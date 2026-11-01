import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createContactHandler } from '../server/contact.mjs';
import { toRequest } from '../server/http.mjs';
import { Readable } from 'node:stream';

const env = {
  RESEND_API_KEY: 'test-only-key', CONTACT_FROM: 'Portfolio <portfolio@example.com>',
  CONTACT_TO: 'info@lightman.it', CONTACT_ALLOWED_ORIGINS: 'https://portfolio.lightman.it'
};
const fields = {
  name: 'Anna / Agenzia', email: 'anna@example.com', project: 'Un evento aziendale a Milano.',
  website: '', submissionId: '12345678-1234-4234-8234-123456789abc'
};
function request(body = fields, { origin = env.CONTACT_ALLOWED_ORIGINS, method = 'POST', headers = {} } = {}) {
  return new Request('https://backend.example.com/api/contact', {
    method, headers: { Origin: origin, 'Content-Type': 'application/json', ...headers },
    ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {})
  });
}
function setup() {
  const sent = [];
  const handler = createContactHandler({ fetchEmail: async (url, options) => {
    sent.push({ url, ...options });
    return Response.json({ id: 'test-email-id' });
  } });
  return { sent, handler };
}

test('sends to the fixed recipient with the visitor as reply-to; retries keep the same key', async () => {
  const { sent, handler } = setup();
  const response = await handler(request({ ...fields, to: 'attacker@example.com' }), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), env.CONTACT_ALLOWED_ORIGINS);
  const mail = JSON.parse(sent[0].body);
  assert.deepEqual(mail.to, ['info@lightman.it']);
  assert.equal(mail.reply_to, fields.email);
  assert.equal(mail.from, env.CONTACT_FROM);
  assert.ok(mail.text.includes(fields.project));
  assert.ok(!JSON.stringify(mail).includes(env.RESEND_API_KEY));
  await handler(request(), env);
  assert.equal(sent[0].headers['Idempotency-Key'], sent[1].headers['Idempotency-Key']);
  await handler(request({ ...fields, project: 'Un progetto con contenuti diversi.' }), env);
  assert.notEqual(sent[0].headers['Idempotency-Key'], sent[2].headers['Idempotency-Key']);
});

test('CORS preflight accepts only configured origins and blocks missing origins', async () => {
  const { sent, handler } = setup();
  assert.equal((await handler(request(null, { method: 'OPTIONS' }), env)).status, 204);
  for (const origin of ['https://evil.example', 'null', '']) {
    const response = await handler(request(fields, { origin }), env);
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  }
  assert.equal(sent.length, 0);
});

test('rejects invalid input, malformed JSON, oversized bodies and unsupported methods', async () => {
  const invalid = [null, [], { ...fields, email: 'invalid' }, { ...fields, email: 'a@example.com\r\nBcc:x@y.com' },
    { ...fields, name: 'a'.repeat(161) }, { ...fields, project: '  short ' },
    { ...fields, project: 'a'.repeat(6001) }, { ...fields, submissionId: 'bad' }, '{malformed'];
  for (const body of invalid) {
    const { sent, handler } = setup();
    assert.equal((await handler(request(body), env)).status, 400);
    assert.equal(sent.length, 0);
  }
  const { handler } = setup();
  assert.equal((await handler(request('a'.repeat(24001)), env)).status, 413);
  assert.equal((await handler(request(fields, { headers: { 'Content-Type': 'text/plain' } }), env)).status, 415);
  assert.equal((await handler(request(null, { method: 'GET' }), env)).status, 405);
});

test('honeypot is silently discarded and unconfigured service never reports success', async () => {
  const { sent, handler } = setup();
  assert.equal((await handler(request({ ...fields, website: 'spam' }), env)).status, 200);
  assert.equal((await handler(request(), { ...env, RESEND_API_KEY: '' })).status, 503);
  assert.equal(sent.length, 0);
});

test('limits attempts per IP and expires the window', async () => {
  let time = 1000;
  const handler = createContactHandler({ now: () => time, fetchEmail: async () => Response.json({ id: 'test' }) });
  for (let i = 0; i < 5; i++) assert.equal((await handler(request(), env, 'ip-a')).status, 200);
  assert.equal((await handler(request(), env, 'ip-a')).status, 429);
  assert.equal((await handler(request(), env, 'ip-b')).status, 200);
  time += 60001;
  assert.equal((await handler(request(), env, 'ip-a')).status, 200);
});

test('provider errors, timeouts and missing IDs never produce a false success or leak details', async () => {
  const failures = [
    async () => Response.json({ secret: 'private-provider-detail' }, { status: 401 }),
    async () => Response.json({}, { status: 429 }),
    async () => { throw new Error('private-provider-detail'); },
    async () => Response.json({})
  ];
  for (const fetchEmail of failures) {
    const handler = createContactHandler({ fetchEmail });
    const response = await handler(request(), env);
    assert.ok([429, 502].includes(response.status));
    assert.deepEqual(await response.json(), { ok: false });
  }
});

test('Node adapter handles both streamed and pre-parsed request bodies', async () => {
  for (const parsed of [false, true]) {
    const req = Readable.from([Buffer.from(JSON.stringify(fields))]);
    req.method = 'POST'; req.url = '/api/contact';
    req.headers = { origin: env.CONTACT_ALLOWED_ORIGINS, 'content-type': 'application/json' };
    if (parsed) req.body = fields;
    const { sent, handler } = setup();
    assert.equal((await handler(toRequest(req), env)).status, 200);
    assert.equal(sent.length, 1);
  }
});

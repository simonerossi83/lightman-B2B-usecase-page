import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPortfolioHandler } from '../supabase/functions/portfolio-contact/handler.mjs';

const key = 'sb_publishable_test_only';
const values = { RESEND_API_KEY: 'test-only-resend', SUPABASE_PUBLISHABLE_KEYS: JSON.stringify({ default: key }) };
function request({ method = 'POST', origin = 'https://b2b.lightman.it', apikey = key } = {}) {
  return new Request('https://example.supabase.co/functions/v1/portfolio-contact', {
    method, headers: { Origin: origin, apikey, 'Content-Type': 'application/json' },
    ...(method === 'POST' ? { body: '{}' } : {})
  });
}

test('Supabase accepts the public app key, keeps Resend on the backend and fixes the sender', async () => {
  let configuration;
  const handler = createPortfolioHandler(name => values[name], async (_req, env) => {
    configuration = env;
    return Response.json({ ok: true });
  });
  assert.equal((await handler(request())).status, 200);
  assert.equal(configuration.CONTACT_FROM, 'Lightman Portfolio <portfolio@invii.lightman.it>');
  assert.equal(configuration.CONTACT_TO, 'info@lightman.it');
  assert.equal(configuration.RESEND_API_KEY, values.RESEND_API_KEY);
});

test('Supabase rejects missing/wrong public keys and wrong origins before the email handler', async () => {
  let calls = 0;
  const handler = createPortfolioHandler(name => values[name], async () => { calls++; return Response.json({ ok: true }); });
  for (const apikey of ['', 'wrong']) assert.equal((await handler(request({ apikey }))).status, 401);
  assert.equal((await handler(request({ origin: 'https://evil.example' }))).status, 403);
  assert.equal(calls, 0);
});

test('Supabase handles preflight without API key and returns a clear error for missing Resend secret', async () => {
  const handler = createPortfolioHandler(name => name === 'RESEND_API_KEY' ? undefined : values[name]);
  const preflight = await handler(request({ method: 'OPTIONS', apikey: '' }));
  assert.equal(preflight.status, 204);
  assert.match(preflight.headers.get('Access-Control-Allow-Headers'), /apikey/);
  const missing = await handler(request());
  assert.equal(missing.status, 503);
  assert.deepEqual(await missing.json(), { ok: false, code: 'mail_not_configured' });
});

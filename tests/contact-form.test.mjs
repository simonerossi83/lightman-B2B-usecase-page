import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';

const source = await readFile(new URL('../dist/contact.js', import.meta.url), 'utf8');
function setup(fetch) {
  const label = { textContent: 'Invia il progetto a David' };
  const button = { disabled: true, querySelector: () => label };
  const status = { textContent: '', dataset: {} };
  const values = { name: 'Anna', email: 'anna@example.com', project: 'Il nostro evento aziendale.', website: '' };
  let submit;
  let resets = 0;
  const form = {
    querySelector: () => button,
    addEventListener: (_type, callback) => { submit = callback; },
    reportValidity: () => true,
    setAttribute() {}, removeAttribute() {},
    reset() { resets++; },
    elements: { project: { focus() {} } }
  };
  vm.runInNewContext(source, {
    document: { querySelector: selector => selector === '#contact-form' ? form : status },
    window: { LIGHTMAN_CONTACT_ENDPOINT: 'https://backend.example.com/api/contact', LIGHTMAN_CONTACT_PUBLISHABLE_KEY: 'sb_publishable_test' },
    FormData: class { get(key) { return values[key]; } },
    crypto: { randomUUID }, AbortSignal, fetch, TypeError
  });
  return { button, status, values, get resets() { return resets; }, submit: () => submit({ preventDefault() {} }) };
}

test('the form sends JSON to the configured endpoint and clears only on confirmed success', async () => {
  let sent;
  const ui = setup(async (url, options) => {
    sent = { url, ...options };
    return Response.json({ ok: true });
  });
  assert.equal(ui.button.disabled, false);
  await ui.submit();
  assert.equal(sent.url, 'https://backend.example.com/api/contact');
  assert.equal(sent.method, 'POST');
  assert.equal(sent.headers.apikey, 'sb_publishable_test');
  assert.equal(JSON.parse(sent.body).email, 'anna@example.com');
  assert.equal(ui.resets, 1);
  assert.equal(ui.status.dataset.state, 'success');
  assert.equal(ui.button.disabled, false);
});

test('a failed send preserves the form and retries use the same idempotency ID', async () => {
  const sent = [];
  const ui = setup(async (_url, options) => {
    sent.push(JSON.parse(options.body));
    return Response.json({ ok: false }, { status: 502 });
  });
  await ui.submit();
  assert.equal(ui.resets, 0);
  assert.equal(ui.status.dataset.state, 'error');
  await ui.submit();
  assert.equal(sent[0].submissionId, sent[1].submissionId);
  ui.values.project = 'Un progetto modificato dopo il tentativo.';
  await ui.submit();
  assert.notEqual(sent[1].submissionId, sent[2].submissionId);
});

test('double submissions are blocked while the request is pending', async () => {
  let complete;
  let count = 0;
  const ui = setup(() => {
    count++;
    return new Promise(resolve => { complete = resolve; });
  });
  const pending = ui.submit();
  assert.equal(ui.button.disabled, true);
  await ui.submit();
  assert.equal(count, 1);
  complete(Response.json({ ok: true }));
  await pending;
  assert.equal(ui.button.disabled, false);
});

test('a static hosting response or a network error is never shown as success', async () => {
  for (const response of [async () => new Response('<html>404</html>'), async () => { throw new TypeError('Failed to fetch'); }]) {
    const ui = setup(response);
    await ui.submit();
    assert.equal(ui.resets, 0);
    assert.equal(ui.status.dataset.state, 'error');
    assert.equal(ui.button.disabled, false);
  }
});

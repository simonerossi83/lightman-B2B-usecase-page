const MAX_BYTES = 24000;
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// One instance per process. Serverless instances each have their own quota;
// use the host's shared rate limiter/WAF when running multiple instances.
export function createContactHandler({ fetchEmail = fetch, now = Date.now } = {}) {
  const attempts = new Map();

  return async function contact(request, env, clientIp = 'unknown') {
    const origin = request.headers.get('Origin');
    const allowed = (env.CONTACT_ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean);
    const cors = origin && allowed.includes(origin)
      ? { 'Access-Control-Allow-Origin': origin }
      : {};
    const respond = (status, body, extra = {}) => new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Vary: 'Origin', ...cors, ...extra }
    });

    // An explicit allowlist is required, including for same-origin requests.
    if (!origin || !allowed.includes(origin)) return respond(403, { ok: false });
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: {
        ...cors, Vary: 'Origin', 'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, apikey', 'Access-Control-Max-Age': '600'
      } });
    }
    if (request.method !== 'POST') return respond(405, { ok: false }, { Allow: 'POST, OPTIONS' });
    if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      return respond(415, { ok: false });
    }

    const time = now();
    for (const [key, value] of attempts) if (value.expires <= time) attempts.delete(key);
    const limit = attempts.get(clientIp);
    if (limit?.count >= 5 || (!limit && attempts.size >= 10000)) {
      return respond(429, { ok: false }, { 'Retry-After': '60' });
    }
    attempts.set(clientIp, { count: (limit?.count || 0) + 1, expires: limit?.expires || time + 60000 });

    let fields;
    try {
      if (Number(request.headers.get('Content-Length')) > MAX_BYTES) return respond(413, { ok: false });
      const reader = request.body?.getReader();
      if (!reader) return respond(400, { ok: false });
      let size = 0;
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BYTES) {
          await reader.cancel();
          return respond(413, { ok: false });
        }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      fields = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return respond(400, { ok: false });
    }
    if (!fields || typeof fields !== 'object' || Array.isArray(fields)) return respond(400, { ok: false });
    if (typeof fields.website !== 'string') return respond(400, { ok: false });
    if (fields.website.trim()) return respond(200, { ok: true });
    const { name, email, project, submissionId } = fields;
    if (typeof name !== 'string' || name.length > 160 || /[\r\n]/.test(name) ||
        typeof email !== 'string' || email.length > 254 || !EMAIL.test(email.trim()) ||
        typeof project !== 'string' || project.trim().length < 10 || project.length > 6000 ||
        typeof submissionId !== 'string' || !UUID.test(submissionId)) {
      return respond(400, { ok: false });
    }
    if (!env.RESEND_API_KEY || !env.CONTACT_FROM || !env.CONTACT_TO) return respond(503, { ok: false });

    const mail = {
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email.trim(),
      subject: 'Nuovo progetto dal portfolio Lightman',
      text: [
        'Nuova richiesta dal portfolio Lightman', '',
        `Nome e agenzia: ${name.trim() || 'Non indicati'}`,
        `Email: ${email.trim()}`, '', 'Il progetto:', project.trim()
      ].join('\n')
    };
    // Stable on retries, unique for edited submissions. Nothing supplied by a
    // visitor can change the recipient, sender or subject.
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(mail)));
    const digest = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
    try {
      const response = await fetchEmail('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `portfolio-${submissionId}-${digest}`
        },
        body: JSON.stringify(mail),
        signal: AbortSignal.timeout(12000)
      });
      if (!response.ok) return respond(response.status === 429 ? 429 : 502, { ok: false });
      const result = await response.json();
      if (typeof result.id !== 'string' || !result.id) return respond(502, { ok: false });
      return respond(200, { ok: true });
    } catch {
      // Never return provider details, credentials or submitted content.
      return respond(502, { ok: false });
    }
  };
}

export const handleContact = createContactHandler();

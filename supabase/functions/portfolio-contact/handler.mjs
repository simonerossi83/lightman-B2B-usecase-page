import { handleContact } from '../_shared/contact.mjs';

export function createPortfolioHandler(getEnv, contact = handleContact) {
  return async request => {
    const env = {
      RESEND_API_KEY: getEnv('PORTFOLIO_RESEND_API_KEY') || getEnv('RESEND_API_KEY'),
      CONTACT_FROM: 'Lightman Portfolio <portfolio@invii.lightman.it>',
      CONTACT_TO: 'info@lightman.it',
      CONTACT_ALLOWED_ORIGINS: 'https://b2b.lightman.it,http://localhost:8000,http://127.0.0.1:8000'
    };
    // Browsers omit API keys during the CORS preflight.
    if (request.method === 'OPTIONS') return contact(request, env);
    const origin = request.headers.get('Origin');
    const allowed = env.CONTACT_ALLOWED_ORIGINS.split(',').includes(origin);
    const respond = (status, code) => Response.json({ ok: false, ...(code ? { code } : {}) }, { status, headers: {
      'Cache-Control': 'no-store', Vary: 'Origin',
      ...(allowed ? { 'Access-Control-Allow-Origin': origin } : {})
    } });
    if (!allowed) return respond(403);

    // Authorize modern publishable keys here: the legacy JWT verifier cannot
    // validate sb_publishable keys. No database or service-role access is used.
    let keys;
    try { keys = JSON.parse(getEnv('SUPABASE_PUBLISHABLE_KEYS') || '{}'); }
    catch { return respond(503); }
    const expected = getEnv('PORTFOLIO_PUBLISHABLE_KEY') || keys.default || 'sb_publishable_MLmyiaoA_ElbUPeyoEIfPQ_6-miL-vv';
    if (!expected || !expected.startsWith('sb_publishable_')) return respond(503);
    if (request.headers.get('apikey') !== expected) return respond(401);
    if (!env.RESEND_API_KEY) return respond(503, 'mail_not_configured');

    // Quota is per isolate; the platform ingress supplies forwarding headers.
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    return contact(request, env, ip);
  };
}

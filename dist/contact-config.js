'use strict';

// URL e chiave PUBBLICA Supabase: utilizzabili dal browser. Mai inserire qui
// chiavi Resend, service_role o sb_secret. In locale usa il backend Node.
const localContact = ['localhost', '127.0.0.1'].includes(window.location.hostname);
window.LIGHTMAN_CONTACT_ENDPOINT = localContact ? '/api/contact'
  : 'https://gfmuvojwsuwuprxlulcp.supabase.co/functions/v1/portfolio-contact';
window.LIGHTMAN_CONTACT_PUBLISHABLE_KEY = localContact ? ''
  : 'sb_publishable_MLmyiaoA_ElbUPeyoEIfPQ_6-miL-vv';

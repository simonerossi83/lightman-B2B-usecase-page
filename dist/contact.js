'use strict';

(() => {
  const form = document.querySelector('#contact-form');
  const button = form.querySelector('button[type="submit"]');
  const label = button.querySelector('.submit-label');
  const status = document.querySelector('#form-status');
  let pending = false;
  // Reuse the key if the response was lost: a retry must not duplicate the email.
  let lastPayload = '';
  let submissionId = '';

  function showStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state;
  }

  button.disabled = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;

    const fields = new FormData(form);
    const payload = {
      name: fields.get('name').trim(),
      email: fields.get('email').trim(),
      project: fields.get('project').trim(),
      website: fields.get('website').trim()
    };
    if (payload.project.length < 10) {
      showStatus('Raccontaci il progetto con almeno 10 caratteri.', 'error');
      form.elements.project.focus();
      return;
    }

    const serialized = JSON.stringify(payload);
    if (serialized !== lastPayload) {
      submissionId = crypto.randomUUID();
      lastPayload = serialized;
    }
    payload.submissionId = submissionId;
    pending = true;
    button.disabled = true;
    label.textContent = 'Invio in corso…';
    form.setAttribute('aria-busy', 'true');
    showStatus('', 'pending');

    try {
      const response = await fetch(window.LIGHTMAN_CONTACT_ENDPOINT || '/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(window.LIGHTMAN_CONTACT_PUBLISHABLE_KEY ? { apikey: window.LIGHTMAN_CONTACT_PUBLISHABLE_KEY } : {})
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
        credentials: 'omit',
        mode: 'cors'
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        throw new Error(response.status === 429
          ? 'Hai inviato diverse richieste. Attendi un minuto prima di riprovare.'
          : 'Non è stato possibile inviare il messaggio. Riprova tra poco oppure scrivi a info@lightman.it.');
      }
      form.reset();
      lastPayload = '';
      submissionId = '';
      showStatus('Messaggio inviato. Grazie per averci raccontato il tuo progetto: ti risponderemo all’email indicata.', 'success');
    } catch (error) {
      showStatus(error.name === 'TimeoutError' || error.name === 'AbortError'
        ? 'La conferma sta impiegando troppo tempo. I dati sono ancora qui: puoi riprovare.'
        : error instanceof TypeError
          ? 'Connessione non riuscita. Riprova oppure scrivi a info@lightman.it.'
          : error.message, 'error');
    } finally {
      pending = false;
      button.disabled = false;
      label.textContent = 'Invia il progetto a David';
      form.removeAttribute('aria-busy');
    }
  });
})();

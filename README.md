# Lightman — Progetti e produzioni

Portfolio editoriale di quattro progetti Lightman Digital Show, con descrizione del metodo di lavoro e modulo contatti. Frontend in HTML, CSS e JavaScript nativi; backend Resend in Node.js 22+, senza dipendenze o compilazione.

## Avvio

Per provare anche il modulo, copiare `.env.example` in `.env`, compilare le variabili e avviare:

```bash
npm run dev
```

Aprire `http://localhost:8000`. Senza variabili Resend la pagina funziona, ma l’endpoint risponde con errore e non invia email. Per una sola anteprima statica:

```bash
python3 -m http.server 8000 --directory dist
```

Il server Python e GitHub Pages non eseguono l’endpoint: per l’invio serve il backend descritto sotto.

## Invio diretto con Resend e Supabase

Il modulo invia direttamente a `info@lightman.it`, senza aprire il client di posta. Il mittente è **Lightman Portfolio <portfolio@invii.lightman.it>**; il `reply_to` è l’email del visitatore, così David può rispondere normalmente. Nome e agenzia sono facoltativi; email e progetto sono obbligatori.

Il frontend è già collegato al progetto Supabase **Lightman Offers** (`gfmuvojwsuwuprxlulcp`):

- Pagina prevista: `https://b2b.lightman.it`.
- Edge Function: `https://gfmuvojwsuwuprxlulcp.supabase.co/functions/v1/portfolio-contact`.
- Origini autorizzate: `https://b2b.lightman.it`, `http://localhost:8000`, `http://127.0.0.1:8000`.
- In locale `dist/contact-config.js` seleziona automaticamente `/api/contact`, servito da Node.

### Passaggio necessario per attivare l’invio

La funzione `portfolio-contact` è stata distribuita (versione 1). Il controllo remoto ha confermato CORS 204, rifiuto delle chiamate senza chiave pubblica (401) e delle origini esterne (403). Il controllo della configurazione ha restituito **503 `mail_not_configured`**: la chiave Resend non è ancora disponibile all’ambiente Edge Functions. Non sono state inviate email reali durante le verifiche.

Aprire [Edge Functions → Secrets di Lightman Offers](https://supabase.com/dashboard/project/gfmuvojwsuwuprxlulcp/functions/secrets) e aggiungere:

| Secret | Valore |
| --- | --- |
| `PORTFOLIO_RESEND_API_KEY` | Chiave Resend autorizzata a inviare da `invii.lightman.it`. |

La funzione usa questa chiave dedicata se presente, altrimenti il secret condiviso `RESEND_API_KEY`. È possibile riutilizzare la chiave esistente; una chiave dedicata con permesso **Sending access** limitata a `invii.lightman.it` consente di gestire separatamente questa pagina. Se Resend è configurato solo come SMTP di Supabase Auth, quella configurazione non espone automaticamente la chiave alle Edge Functions: va aggiunta nei Secrets.

Non servono un nuovo account Resend o una nuova verifica del dominio per usare il mittente su `invii.lightman.it`, già verificato. Il dominio web `b2b.lightman.it` è indipendente dal dominio del mittente. Verificare poi un invio reale dal sito e la ricezione nella casella di destinazione.

**Non inserire chiavi Resend in HTML, script pubblici, chat o repository.** `.env.example` contiene solo segnaposto ed è fuori da `dist/`. Per il solo sviluppo locale copiare l’esempio in `.env` e usare `npm run dev`.

### Autorizzazione e manutenzione

`dist/contact-config.js` contiene esclusivamente l’URL della funzione e la chiave **publishable** Supabase, utilizzabile nel browser. Non contiene chiavi Resend o `service_role`. Il frontend invia la chiave nell’header `apikey`; `handler.mjs` la verifica prima di elaborare i dati. Il gateway ha `verify_jwt = false` perché le nuove chiavi `sb_publishable_...` non sono JWT: l’autorizzazione è gestita dalla funzione, senza login del visitatore. Non vengono letti dati o usate chiavi privilegiate del database.

La funzione usa `SUPABASE_PUBLISHABLE_KEYS.default` se disponibile, altrimenti la chiave pubblica corrente nel codice. L’override `PORTFOLIO_PUBLISHABLE_KEY` è facoltativo. Alla rotazione della chiave pubblica aggiornare anche il frontend ed eventualmente il fallback in `handler.mjs`.

Sono inclusi validazione server, limite del corpo a 24 KB, honeypot, destinatario fisso, CORS con origini esplicite e limite di 5 tentativi al minuto per IP **per processo/isolate**. Quest’ultimo non è condiviso tra istanze: per un limite globale usare un servizio condiviso o il WAF dell’hosting. CORS e chiave publishable identificano l’app nei browser ma non sono una protezione completa dai bot; in caso di abuso aggiungere una verifica antispam server.

Il successo è HTTP 200 con `{ "ok": true }`, restituito solo dopo l’accettazione di Resend, non una conferma di consegna in casella. Il frontend conserva il testo in caso di errore e riutilizza la stessa chiave di idempotenza quando si riprova un invio invariato.

Il codice della funzione è in `supabase/functions/portfolio-contact/`, con logica condivisa in `supabase/functions/_shared/contact.mjs`. Per aggiornare la funzione usare il tool Supabase `deploy_edge_function` con questi file e `verify_jwt: false`, oppure la CLI dopo averne verificato i comandi con `--help`. `server/dev.mjs` permette di provare la stessa logica su Node senza dipendenze.

Riferimenti ufficiali: [Resend e domini verificati](https://resend.com/docs/dashboard/domains/introduction), [API key Resend](https://resend.com/docs/dashboard/api-keys/introduction), [Supabase e invio email](https://supabase.com/docs/guides/functions/examples/send-emails), [autorizzazione delle nuove chiavi Supabase](https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys).

## Pubblicazione su GitHub Pages

Il workflow `.github/workflows/deploy-pages.yml` pubblica il contenuto di `dist/` a ogni push sul branch `main`, dopo il controllo della sintassi JavaScript. Non è richiesta una compilazione.

Per pubblicare un aggiornamento, salvare le modifiche in un commit e inviarle con `git push origin main`. L’esito è consultabile nella scheda **Actions** del repository, nel workflow **Deploy GitHub Pages**. Il workflow può essere avviato anche manualmente con **Run workflow**.

La sorgente di pubblicazione in **Settings → Pages** deve essere **GitHub Actions**. Viene pubblicata soltanto la cartella `dist/`; la visibilità del repository rimane invariata.

Per il dominio definitivo, configurare `b2b.lightman.it` in **Settings → Pages → Custom domain** e i relativi DNS presso il gestore del dominio. La Edge Function accetta già questa origine; la configurazione DNS e la pubblicazione della pagina restano da effettuare. I file frontend modificati sono locali, non sono stati eseguiti commit o push.

## Struttura

- `dist/index.html`: struttura della pagina, template delle card e dialog condiviso.
- `dist/case-studies.js`: unica fonte dei contenuti dei quattro progetti.
- `dist/app.js`: creazione delle card e degli approfondimenti, gestione della modale.
- `dist/style.css`: impaginazione responsive, focus e preferenze reduced-motion.
- `dist/contact-config.js`: URL pubblico del backend email.
- `dist/contact.js`: invio del form e messaggi di stato.
- `supabase/functions/`: endpoint Supabase e logica condivisa di validazione e invio Resend.
- `server/dev.mjs`: server locale Node che riutilizza la stessa logica.
- `dist/assets/`: immagini e logo già presenti nel repository.

## Aggiornare i progetti

Modificare gli oggetti nell’array `caseStudies` in `dist/case-studies.js`. Mantenere esattamente quattro progetti e un `id` univoco per ciascuno.

I campi `title`, `eventType`, `shortDescription`, `coverImage` e `coverAlt` alimentano sia le card sia le modali. `client` e `audience` compaiono nella scheda; `context`, `customization` ed `execution` sono array di paragrafi per le tre sezioni editoriali. `imageCaption` esplicita la provenienza della copertina; `contentNote` segnala lo stato della documentazione.

La scheda **Salesforce World Tour** è compilata con il contesto fornito dal cliente: apertura della convention all’Allianz MiCo di Milano, 15 ballerine, 3.000 spettatori in plenaria e 1.500 utenti in streaming, laser volumetrici e video su schermi di oltre 30 metri. Le note `imageCaption` e `contentNote` sono facoltative: quando vuote, non vengono mostrate.

La scheda **Mirror Dance** è compilata con il contesto fornito dal cliente: inaugurazione di una concessionaria CUPRA, accoglienza itinerante in abiti specchiati durante il buffet aperitivo del pomeriggio e danza serale sul palco con riflessi delle luci sugli abiti.

La scheda **25 anni di storia** è compilata con il contesto fornito dal cliente: anniversario di un’azienda elettronica, accoglienza con trampolieri, robot LED, logo aziendale in uno spettacolo con ologrammi, fontane Sparkular e fumo basso per il taglio torta, laser show durante la discoteca.

La scheda **LED Wall + Performer** è compilata con il contesto fornito dal cliente: congresso Novo Nordisk a Roma, fornitura delle ballerine, coreografia creata in coordinamento con l’agenzia del LED wall e con il team video, mesi di studio per l’interazione fra movimenti e immagini. La ricerca pubblica non ha identificato con certezza titolo e numero di partecipanti dell’evento: questi dati sono omessi.

Le quattro copertine riutilizzano fotografie d’archivio del repository: la loro associazione ai singoli eventi non è verificata. In particolare la foto di `LED Wall + Performer` è illustrativa e non mostra un LED wall. Quando si inseriscono fotografie dei progetti, aggiornare anche `coverAlt` e l’eventuale `imageCaption`.

## Accessibilità e comportamento

Ogni card è un pulsante accessibile da tastiera. Un unico `<dialog>` nativo mostra il progetto selezionato, rende inerte la pagina sottostante e si chiude con X, Escape o clic sullo sfondo. La modale blocca lo scroll di pagina, mantiene il focus al proprio interno e alla chiusura ripristina focus e posizione della pagina. I contenuti lunghi scorrono nella modale; le animazioni rispettano `prefers-reduced-motion`.

Sono richiesti JavaScript e un browser moderno con supporto a `<dialog>` (Chrome, Edge, Firefox e Safari). Un messaggio `noscript` segnala quando JavaScript è disattivato. Il caricamento dei font Google richiede Internet; sono previsti font di sistema alternativi. Le immagini e gli script sono locali. Il meta tag `noindex,nofollow` è conservato.

## Verifiche tecniche

```bash
node --check dist/case-studies.js
node --check dist/app.js
node --check dist/contact.js
npm test
git diff --check
```

I test usano il runner integrato di Node e simulano Resend: controllano form, autorizzazione Supabase, validazione, CORS, errori del provider, idempotenza, honeypot, rate limiting e adattatore HTTP. Non sono configurati lint, typecheck o build. Per una verifica funzionale aprire ogni card, controllare le tre sezioni e tutte le modalità di chiusura, usare Tab e Maiusc+Tab e verificare il layout da 320 px fino al desktop, anche con reduced-motion attivo. Controllare inoltre le CTA, la validazione del form e un invio reale dopo la configurazione del backend.

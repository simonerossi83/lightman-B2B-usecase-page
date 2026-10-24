# Lightman — Progetti e produzioni

Portfolio editoriale di quattro progetti Lightman Digital Show. HTML, CSS e JavaScript nativi: nessuna dipendenza, installazione o compilazione.

## Avvio

Aprire `dist/index.html` nel browser oppure avviare un server locale:

```bash
python3 -m http.server 8000 --directory dist
```

## Pubblicazione su GitHub Pages

Il workflow `.github/workflows/deploy-pages.yml` pubblica il contenuto di `dist/` a ogni push sul branch `main`, dopo il controllo della sintassi JavaScript. Non è richiesta una compilazione.

Per pubblicare un aggiornamento, salvare le modifiche in un commit e inviarle con `git push origin main`. L’esito è consultabile nella scheda **Actions** del repository, nel workflow **Deploy GitHub Pages**. Il workflow può essere avviato anche manualmente con **Run workflow**.

La sorgente di pubblicazione in **Settings → Pages** deve essere **GitHub Actions**. Viene pubblicata soltanto la cartella `dist/`; la visibilità del repository rimane invariata.

## Struttura

- `dist/index.html`: struttura della pagina, template delle card e dialog condiviso.
- `dist/case-studies.js`: unica fonte dei contenuti dei quattro progetti.
- `dist/app.js`: creazione delle card e degli approfondimenti, gestione della modale.
- `dist/style.css`: impaginazione responsive, focus e preferenze reduced-motion.
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
git diff --check
```

Non sono configurati lint, typecheck, build o test runner. Per una verifica funzionale aprire ogni card, controllare le tre sezioni e tutte le modalità di chiusura, usare Tab e Maiusc+Tab e verificare il layout da 320 px fino al desktop, anche con reduced-motion attivo.

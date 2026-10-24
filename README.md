# Lightman — Progetti e produzioni

Portfolio editoriale di quattro progetti Lightman Digital Show. HTML, CSS e JavaScript nativi: nessuna dipendenza, installazione o compilazione.

## Avvio

Aprire `dist/index.html` nel browser oppure avviare un server locale:

```bash
python3 -m http.server 8000 --directory dist
```

## Struttura

- `dist/index.html`: struttura della pagina, template delle card e dialog condiviso.
- `dist/case-studies.js`: unica fonte dei contenuti dei quattro progetti.
- `dist/app.js`: creazione delle card e degli approfondimenti, gestione della modale.
- `dist/style.css`: impaginazione responsive, focus e preferenze reduced-motion.
- `dist/assets/`: immagini e logo già presenti nel repository.

## Aggiornare i progetti

Modificare gli oggetti nell’array `caseStudies` in `dist/case-studies.js`. Mantenere esattamente quattro progetti e un `id` univoco per ciascuno.

I campi `title`, `eventType`, `shortDescription`, `coverImage` e `coverAlt` alimentano sia le card sia le modali. `client` e `audience` compaiono nella scheda; `context`, `customization` ed `execution` sono array di paragrafi per le tre sezioni editoriali. `imageCaption` esplicita la provenienza della copertina; `contentNote` segnala lo stato della documentazione.

I nomi e i brief sintetici sono ripresi dalla landing originale. **Le schede sono da completare** con cliente e settore, pubblico, formato e luogo dell’evento, vincoli, scelte artistiche e tecniche, svolgimento e risultati documentabili. I paragrafi “Da completare” sono placeholder, non un resoconto di attività già accertate.

Le quattro copertine riutilizzano fotografie d’archivio del repository: la loro associazione ai singoli eventi non è verificata. In particolare la foto di `LED Wall + Performer` non documenta un LED wall ed è un segnaposto esplicito. Sostituire le copertine con foto verificate e aggiornare `coverAlt`, `imageCaption`, `contentNote` e la nota generale in `index.html` quando i contenuti sono completi.

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

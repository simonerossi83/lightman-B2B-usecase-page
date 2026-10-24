/*
 * Unica fonte dei contenuti di card e approfondimenti.
 * I riferimenti ai progetti provengono dalla landing originale.
 * I passaggi "Da completare" sono placeholder editoriali, non fatti accertati.
 * Sostituire coverImage, coverAlt e imageCaption con materiale del progetto
 * verificato; aggiornare contentNote quando la scheda è documentata.
 * context, customization ed execution sono array di paragrafi.
 */
const caseStudies = [
  {
    id: 'salesforce',
    title: 'Salesforce',
    eventType: 'Brand experience',
    client: 'Salesforce · riferimento presente nella pagina originale',
    audience: 'Da completare: pubblico e tipologia di partecipanti.',
    coverImage: 'assets/video-luce.webp',
    coverAlt: 'Gruppo di performer con costumi LED e ali luminose multicolore.',
    imageCaption: 'Immagine d’archivio Lightman. Associazione al progetto Salesforce da verificare.',
    shortDescription: 'L’identità del brand come punto di partenza per un LED Dance Show.',
    contentNote: 'Scheda da completare. Sono ripresi solo il nome, il brief sintetico e il linguaggio artistico presenti nella pagina originale. I dettagli di produzione non sono ancora documentati.',
    context: [
      'La pagina originale associa a Salesforce un brief di brand experience: dare forma visiva al tema dell’innovazione del brand.',
      'Da completare: settore e ruolo del committente, formato dell’evento, luogo, pubblico, tempi e vincoli del brief.'
    ],
    customization: [
      'Il linguaggio indicato è un LED Dance Show personalizzato per rappresentare l’identità del brand sulla scena.',
      'Da completare: contenuti visivi effettivamente realizzati, riferimenti al brand, scelte musicali e coreografiche, adattamenti tecnici.'
    ],
    execution: [
      'Da completare con il resoconto della produzione: sviluppo dei contenuti, prove, coordinamento con la regia e svolgimento dello show.',
      'Non sono disponibili informazioni verificate sulle criticità affrontate o sui risultati dell’evento.'
    ]
  },
  {
    id: '25-anni-di-storia',
    title: '25 anni di storia',
    eventType: 'Anniversario aziendale',
    client: 'Da completare: azienda e settore.',
    audience: 'Da completare: destinatari dell’anniversario.',
    coverImage: 'assets/laser.webp',
    coverAlt: 'Fasci laser verdi e blu sopra il pubblico in una sala eventi.',
    imageCaption: 'Immagine d’archivio Lightman. Associazione all’anniversario da verificare.',
    shortDescription: 'Un racconto aziendale attraverso Laser Show e Tech Ballet.',
    contentNote: 'Scheda da completare. Il riferimento ai 25 anni e ai linguaggi dello spettacolo proviene dalla pagina originale. Cliente e dettagli dell’evento non sono indicati.',
    context: [
      'Il progetto è presentato nella pagina originale con il titolo “25 Anni di Storia”. Il brief sintetico riguarda il racconto di una storia aziendale attraverso lo spettacolo.',
      'Da completare: identità e settore dell’azienda, occasione dell’anniversario, pubblico, materiali di partenza e vincoli produttivi.'
    ],
    customization: [
      'La scheda di partenza indica l’abbinamento di Laser Show e Tech Ballet come linguaggio per lo storytelling aziendale.',
      'Da completare: episodi della storia selezionati, struttura del racconto, contributi musicali, contenuti laser e rapporto con la coreografia.'
    ],
    execution: [
      'Da completare: lavorazione dei materiali aziendali, sviluppo della sequenza scenica, prove e coordinamento tecnico durante l’evento.',
      'L’archivio del progetto non contiene ancora un resoconto verificato dell’esecuzione o dei risultati.'
    ]
  },
  {
    id: 'mirror-dance',
    title: 'Mirror Dance',
    eventType: 'Evento in location · luxury',
    client: 'Da completare: committente e settore.',
    audience: 'Da completare: ospiti e modalità di fruizione.',
    coverImage: 'assets/mirror.webp',
    coverAlt: 'Performer in costumi a specchio su un palco, sotto luci bianche e blu.',
    imageCaption: 'Immagine d’archivio Lightman. Associazione a questo specifico progetto da verificare.',
    shortDescription: 'Una performance pensata in relazione all’architettura della location.',
    contentNote: 'Scheda da completare. La relazione fra performance e location è indicata nella pagina originale; cliente, luogo e scelte esecutive sono da documentare.',
    context: [
      'La pagina originale colloca Mirror Dance nell’ambito degli eventi luxury. Il brief riportato è valorizzare la location rispettandone il carattere architettonico.',
      'Da completare: cliente e settore, tipo di evento, caratteristiche degli spazi, pubblico ed eventuali vincoli di allestimento.'
    ],
    customization: [
      'Il riferimento di partenza è una Mirror Dance concepita per dialogare con l’architettura della location.',
      'Da completare: scelta delle aree di esibizione, movimenti e percorsi dei performer, illuminazione, musica e adattamenti alla presenza degli ospiti.'
    ],
    execution: [
      'Da completare: sopralluogo, preparazione degli spazi, prove nella location e inserimento della performance nella sequenza dell’evento.',
      'Le soluzioni adottate sul posto e gli esiti della produzione non sono ancora documentati.'
    ]
  },
  {
    id: 'led-wall-performer',
    title: 'LED Wall + Performer',
    eventType: 'Spettacolo a regia integrata',
    client: 'Da completare: committente e settore.',
    audience: 'Da completare: pubblico e contesto dell’evento.',
    coverImage: 'assets/video-esclusivi.webp',
    coverAlt: 'Performer con grandi ali illuminate su un palco.',
    imageCaption: 'Immagine d’archivio Lightman, segnaposto. La foto non documenta il LED wall del progetto.',
    shortDescription: 'Contenuti su schermo e presenza dei ballerini all’interno della stessa regia.',
    contentNote: 'Scheda da completare. L’interazione fra ballerini e schermo è descritta nella pagina originale. La copertina è un segnaposto da sostituire con un’immagine del progetto.',
    context: [
      'Il brief riportato nella pagina originale riguarda l’incontro fra scena digitale e presenza fisica, attraverso l’interazione di ballerini e LED wall.',
      'Da completare: committente, settore, tipo di evento, pubblico, dimensioni della scena e vincoli del sistema video.'
    ],
    customization: [
      'La scheda esistente descrive ballerini e schermo coordinati all’interno di un’unica regia.',
      'Da completare: contenuti video realizzati, passaggi coreografici, modalità di sincronizzazione e adattamenti alle misure del palco e dello schermo.'
    ],
    execution: [
      'Da completare: preparazione dei contenuti, prove di interazione con lo schermo, gestione dei segnali di regia e svolgimento della performance.',
      'Non sono ancora disponibili dettagli verificati sulle criticità tecniche risolte o sull’esito dell’evento.'
    ]
  }
];

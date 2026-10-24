/*
 * Unica fonte dei contenuti di card e approfondimenti.
 * I testi delle quattro schede si basano sui brief forniti dal cliente.
 * coverImage e coverAlt definiscono la copertina e la descrizione accessibile.
 * imageCaption e contentNote sono facoltativi: se vuoti, non vengono mostrati.
 * context, customization ed execution sono array di paragrafi.
 */
const caseStudies = [
  {
    id: 'salesforce',
    title: 'Salesforce World Tour',
    eventType: 'Apertura convention',
    client: 'Salesforce',
    audience: '3.000 spettatori in sala plenaria e 1.500 utenti in diretta streaming.',
    coverImage: 'assets/video-luce.webp',
    coverAlt: 'Gruppo di performer con costumi LED e ali luminose multicolore.',
    imageCaption: '',
    shortDescription: '15 ballerine, laser volumetrici e video su schermi di oltre 30 metri per l’apertura della convention a Milano.',
    contentNote: '',
    context: [
      'All’Allianz MiCo di Milano abbiamo realizzato lo show di apertura della convention principale del Salesforce World Tour. Il pubblico comprendeva 3.000 spettatori in sala plenaria e 1.500 utenti collegati in diretta streaming.',
      'Lo spettacolo doveva integrare un corpo di ballo di 15 ballerine, effetti laser volumetrici e contributi video su schermi di oltre 30 metri. Il vincolo produttivo era far convergere questi elementi in una sequenza precisa, nel rispetto dei tempi congressuali.'
    ],
    customization: [
      'Il coreografo e il team tecnico hanno lavorato a stretto contatto con la regia del cliente. La coreografia è stata progettata insieme agli effetti laser e ai contributi video, mettendo in relazione i movimenti delle performer con ciò che accadeva sugli schermi.',
      'La sincronizzazione al centesimo di secondo ha guidato la costruzione dello show: ogni intervento artistico e tecnico doveva inserirsi nella stessa sequenza e nei tempi previsti dal programma della convention.'
    ],
    execution: [
      'Le 15 ballerine hanno aperto la convention principale davanti alla platea della plenaria e al pubblico collegato in streaming. La regia ha coordinato la performance dal vivo, i laser volumetrici e i video sugli schermi di oltre 30 metri.',
      'Il lavoro condiviso tra coreografo, team tecnico e regia del cliente ha permesso di eseguire lo show con la sincronizzazione prevista, rispettando i tempi congressuali.'
    ]
  },
  {
    id: '25-anni-di-storia',
    title: '25 anni di storia',
    eventType: 'Anniversario aziendale',
    client: 'Azienda del settore elettronico',
    audience: 'Ospiti dell’anniversario aziendale.',
    coverImage: 'assets/laser.webp',
    coverAlt: 'Fasci laser verdi e blu sopra il pubblico in una sala eventi.',
    imageCaption: '',
    shortDescription: 'Un programma di intrattenimento per i 25 anni di un’azienda elettronica, dall’accoglienza al taglio torta e alla discoteca.',
    contentNote: '',
    context: [
      'Per i 25 anni di un’azienda del settore elettronico abbiamo gestito l’intrattenimento e gli effetti scenici dell’anniversario, dall’accoglienza degli ospiti al taglio della torta, fino al momento discoteca.',
      'Accoglienza, presentazione del logo aziendale, celebrazione e ballo richiedevano interventi distinti, coordinati all’interno dello stesso programma.'
    ],
    customization: [
      'Il logo dell’azienda è stato inserito in uno spettacolo con ologrammi. Per il taglio della torta abbiamo abbinato fontane Sparkular e macchine del fumo basso, dedicando a questo passaggio una composizione di effetti scenici.',
      'Il programma comprendeva inoltre trampolieri per l’accoglienza, robot LED e un laser show durante la discoteca. Artisti ed effetti sono stati distribuiti nei diversi momenti dell’anniversario.'
    ],
    execution: [
      'I trampolieri hanno accolto gli ospiti all’arrivo. Nel corso dell’evento sono intervenuti i robot LED e lo spettacolo con ologrammi ha mostrato il logo aziendale.',
      'Il taglio della torta è stato accompagnato dalle fontane Sparkular e dal fumo basso. Durante il successivo momento discoteca, il laser show ha completato il programma di intrattenimento.'
    ]
  },
  {
    id: 'mirror-dance',
    title: 'Mirror Dance',
    eventType: 'Inaugurazione concessionaria',
    client: 'Concessionaria CUPRA · settore automotive',
    audience: 'Ospiti dell’inaugurazione, dal buffet aperitivo allo spettacolo serale.',
    coverImage: 'assets/mirror.webp',
    coverAlt: 'Performer in costumi a specchio su un palco, sotto luci bianche e blu.',
    imageCaption: '',
    shortDescription: 'Accoglienza itinerante e danza sul palco in abiti specchiati per l’inaugurazione di una concessionaria CUPRA.',
    contentNote: '',
    context: [
      'Per l’inaugurazione di una concessionaria CUPRA abbiamo realizzato una performance articolata in due momenti: l’accoglienza degli ospiti durante il buffet aperitivo del pomeriggio e una danza sul palcoscenico alla sera.',
      'L’intervento accompagnava così due situazioni diverse dello stesso evento: un momento conviviale, con i performer in movimento tra gli ospiti, e uno spettacolo sul palco.'
    ],
    customization: [
      'Gli abiti interamente specchiati sono stati l’elemento comune ai due interventi. Nel pomeriggio, la forma itinerante permetteva ai performer di accogliere gli ospiti durante l’aperitivo; per la sera, la performance assumeva la forma di una danza su palcoscenico.',
      'Sul palco, le superfici specchiate degli abiti riflettevano le luci di scena. Il movimento dei performer diventava così anche un movimento di riflessi, integrando il costume nel disegno visivo dello spettacolo.'
    ],
    execution: [
      'Durante il pomeriggio, i performer in abiti specchiati hanno accolto gli ospiti con un intervento itinerante negli spazi del buffet aperitivo.',
      'Alla sera, la danza si è svolta sul palcoscenico. Le luci del palco, riflettendosi sugli abiti durante i movimenti, hanno creato il gioco di luce che caratterizzava la performance.'
    ]
  },
  {
    id: 'led-wall-performer',
    title: 'LED Wall + Performer',
    eventType: 'Performance per congresso · Roma',
    client: 'Novo Nordisk · settore farmaceutico',
    audience: 'Partecipanti al congresso di Roma.',
    coverImage: 'assets/video-esclusivi.webp',
    coverAlt: 'Performer con grandi ali illuminate su un palco.',
    imageCaption: '',
    shortDescription: 'Una coreografia in dialogo con i contenuti del LED wall, sviluppata per un congresso Novo Nordisk a Roma.',
    contentNote: '',
    context: [
      'Per un congresso Novo Nordisk a Roma, il cliente ha richiesto una coreografia in cui le ballerine interagissero con i contenuti di un LED wall.',
      'La realizzazione coinvolgeva più gruppi di lavoro: la nostra parte artistica, l’agenzia che forniva lo schermo e il team incaricato di sviluppare il video. La difficoltà era far coincidere i movimenti delle ballerine con la sequenza delle immagini.'
    ],
    customization: [
      'Abbiamo fornito le ballerine e creato una coreografia specifica per l’interazione con il LED wall. Il lavoro è stato sviluppato in coordinamento con l’agenzia che forniva lo schermo e con il team autore dei contributi video.',
      'Lo studio dei movimenti è proceduto insieme a quello delle immagini: la coreografia doveva corrispondere a ciò che appariva sullo schermo, sia nei tempi sia nelle posizioni delle performer.'
    ],
    execution: [
      'La preparazione ha richiesto mesi di studio e coordinamento tra coreografia, contenuti video e fornitura del LED wall. Il lavoro si è concentrato sulla precisione dei gesti e sulla loro corrispondenza con le immagini.',
      'Durante il congresso, le ballerine hanno eseguito la coreografia interagendo con il video sul LED wall. Gesti e posizioni studiati al millimetro hanno dato continuità tra i movimenti sul palco e ciò che accadeva sullo schermo.'
    ]
  }
];

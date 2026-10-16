/* VolleyFit – catalogo di base (scritto da zero).
   Campo: metri, x 0–18 (la nostra metà è a sinistra, rete a x = 9), y 0–9 (in alto le zone 4 e 5).
   Omino: vedi pose.js. */
(function(){
'use strict';
const PK = [
  {id:'pk-fondamentali', nome:'Fondamentali di base', colore:'#1546A0', ordine:1, descrizione:'Esercizi tecnici per battuta, ricezione, palleggio, attacco, muro e difesa.'},
  {id:'pk-gioco', nome:'Gioco e situazioni', colore:'#7A2E8E', ordine:2, descrizione:'Esercizi di squadra: cambio palla, copertura, transizione e partitelle a tema. Pensati anche per chi gioca senza libero.'},
  {id:'pk-over45', nome:'Forza e prevenzione over 45', colore:'#E2553A', ordine:3, descrizione:'Forza, core, spalle e salto per atleti adulti: carichi moderati, tanta cura della tecnica di movimento, poche ripetizioni di qualità.'},
  {id:'pk-riscaldamento', nome:'Riscaldamento e mobilità', colore:'#C98A00', ordine:4, descrizione:'Da fare all\'inizio dell\'allenamento: attiva muscoli e articolazioni prima dei salti e degli attacchi.'},
  {id:'pk-casa', nome:'Allenamento a casa', colore:'#0F6E7A', ordine:5, descrizione:'Esercizi con il corpo libero o un elastico, da fare a casa tra un allenamento e l\'altro.'},
  {id:'pk-recupero', nome:'Recupero infortuni', colore:'#1C7342', ordine:6, descrizione:'Ginocchio, spalla, caviglia e schiena. Solo dopo il parere del medico o del fisioterapista; il dolore non deve superare 3 su 10.'},
];
const ES = [];
const SEG = m => { const s=new Set(); for(const x of (m||[])) for(const g of ((window.VSE&&VSE.MUSCOLO_SEGMENTI[x])||[])) s.add(g); return [...s]; };
function E(o){
  o.lavora = o.lavora || {fondamentali:[], muscoli:[]};
  o.lavora.fondamentali = o.lavora.fondamentali||[]; o.lavora.muscoli = o.lavora.muscoli||[];
  o.passi = (o.passi||[]).map(p=>({titolo:p[0], testo:p[1], f:p[2]}));
  o.errori = (o.errori||[]).map(p=>({errore:p[0], correzione:p[1]}));
  o.attenzione = o.attenzione||[]; o.varianti = o.varianti||{}; o.pacchetti=o.pacchetti||[]; o.tags=o.tags||[]; o.materiale=o.materiale||['Corpo libero'];
  o.dose = o.dose||{}; o.note = o.note||'';
  if(o.anim && o.anim.tipo==='corpo' && !o.anim.evidenzia) o.anim.evidenzia = SEG(o.lavora.muscoli);
  o.agg = 0; o.creato = 0;
  ES.push(o);
}
/* elementi del campo */
const at = (id, et, sq) => ({id, tipo:'atleta', squadra:sq||'A', etichetta:et});
const av = (id, et) => ({id, tipo:'atleta', squadra:'B', etichetta:et});
const all = id => ({id:id||'all', tipo:'allenatore', etichetta:'All'});
const pa = id => ({id:id||'pa', tipo:'palla'});
const co = id => ({id, tipo:'cono'});
const be = id => ({id, tipo:'bersaglio'});
const ca = id => ({id:id||'car', tipo:'carrello'});
/* fotogramma del campo: posizioni, durata, pausa, arco */
const F = (pos, dur, pausa, arco) => { const f={pos}; if(dur!=null) f.dur=dur; if(pausa!=null) f.pausa=pausa; if(arco!=null) f.arco=arco; return f; };
/* omino: fotogrammi da [posa, durata, pausa, parametri extra] */
const corpo = (vista, fr, extra) => Object.assign({tipo:'corpo', vista, fotogrammi: fr.map(x=>{ const f={posa:x[0]}; if(x[1]!=null) f.dur=x[1]; if(x[2]!=null) f.pausa=x[2]; if(x[3]) f.p=x[3]; return f; })}, extra||{});

/* =================================================================== TECNICA · BATTUTA */
E({id:'bat-basso-bersaglio', titolo:'Battuta dal basso a bersaglio', obiettivo:'Tecnica', ambito:'Battuta',
  descrizione:'A coppie su campi opposti: si batte dal basso cercando di far cadere la palla nel bersaglio; il compagno la blocca e ribatte.',
  serveA:'Costruisce un lancio regolare e un contatto preciso, la base di ogni battuta.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle']}, difficolta:1, giocatori:[2,12], durata:10,
  materiale:['Palloni','Coni'], materialeNote:'1 pallone a coppia, cerchi o coni per i bersagli', pacchetti:['pk-fondamentali'], tags:['battuta dal basso','precisione'],
  passi:[
    ['Posizione','Dietro la linea di fondo, piede opposto al braccio che colpisce davanti. La palla è tenuta bassa davanti al corpo.',0],
    ['Lancio e colpo','Lancio basso, pochi centimetri. Colpisci sotto e dietro la palla con la mano rigida, portando il peso sul piede avanti.',1],
    ['Il compagno','Il compagno blocca la palla nel bersaglio e batte a sua volta. Contate quante battute entrano su 10.',2]],
  attenzione:['Il braccio teso oscilla come un pendolo, da dietro in avanti.','Guarda la palla fino al contatto.','Il peso passa dal piede dietro al piede avanti durante il colpo.'],
  errori:[['La palla va in rete','Colpisci più sotto la palla e accompagna il braccio verso l\'alto e in avanti.'],['La palla va a destra o a sinistra','Il braccio deve oscillare dritto verso il bersaglio: spalle e piedi rivolti dove vuoi mandarla.']],
  varianti:{facile:'Batti da metà campo (a 6 metri dalla rete) con un bersaglio più grande.', difficile:'Bersagli piccoli nelle zone 1 e 5; il punto vale solo se la palla cade nel bersaglio.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('b','B'), at('c','C'), be('t'), pa()],
    fotogrammi:[F({b:[-0.8,7], c:[15.4,4.9], t:[14.5,4.5], pa:[-0.35,6.8]},null,0.7), F({pa:[14.5,4.5]},1.7,0.4,2.8), F({c:[14.7,4.7], pa:[14.55,4.55]},0.7,0.8)]}});

E({id:'bat-alto-progressione', titolo:'Battuta dall\'alto: da metà campo al fondo', obiettivo:'Tecnica', ambito:'Battuta',
  descrizione:'Si impara la battuta dall\'alto partendo vicini alla rete e arretrando di un passo ogni 3 battute riuscite, fino alla linea di fondo.',
  serveA:'Lancio, caricamento del braccio e contatto si imparano su distanze corte, poi si allunga.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle','obliqui']}, difficolta:2, giocatori:[2,12], durata:15,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['battuta dall\'alto','flottante'],
  passi:[
    ['Lancio','Lancia la palla davanti alla spalla del braccio che colpisce, poco sopra la testa: deve ricadere davanti a te.',0],
    ['Caricamento e colpo','Gomito alto, all\'altezza dell\'orecchio. Colpisci la palla al centro con la mano aperta e rigida, nel punto più alto che raggiungi.',1],
    ['Arretra','Il compagno rimanda la palla. Dopo 3 battute buone fai un passo indietro, fino alla linea di fondo.',2],
    ['Dal fondo','Dalla linea di fondo la palla deve passare la rete con circa un metro di margine.',3]],
  attenzione:['Lancio sempre uguale: è metà della battuta.','Gomito alto e avanti, mai sotto la spalla.','Polso fermo al contatto, per una battuta flottante.'],
  errori:[['Il lancio va dietro la testa','Lancia più avanti: la palla deve cadere un passo davanti al piede anteriore.'],['La palla va lunga','Colpisci più al centro e meno sotto; accorcia il movimento del braccio.'],['La palla va in rete','Colpisci più in alto: aspetta che il braccio sia teso prima del contatto.']],
  varianti:{facile:'Il compagno sta sulla linea dei 3 metri dall\'altra parte e blocca la palla.', difficile:'Il compagno indica una zona (1, 6 o 5) un attimo prima del lancio.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('b','B'), at('c','C'), pa()],
    fotogrammi:[F({b:[4.6,4.6], c:[14,4.6], pa:[4.9,4.3]},null,0.6), F({pa:[13.6,4.4]},1.2,0.4,2.2), F({b:[-0.8,4.6], pa:[-0.45,4.3]},1.5,0.5,2.4), F({pa:[14.2,4.4]},1.6,0.8,2.8)]}});

E({id:'bat-zone', titolo:'Battuta mirata nelle zone 1, 6 e 5', obiettivo:'Tecnica', ambito:'Battuta',
  descrizione:'Tre coni nell\'altro campo segnano le zone 1, 6 e 5. Ogni battitore fa 3 battute, una per zona, poi lascia il posto al compagno.',
  serveA:'Mettere la palla dove non c\'è nessuno vale più di una battuta forte ma imprecisa.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle','obliqui']}, difficolta:3, giocatori:[3,12], durata:15,
  materiale:['Palloni','Coni'], materialeNote:'1 carrello o cesta di palloni, 3 coni', pacchetti:['pk-fondamentali'], tags:['precisione','zone'],
  passi:[
    ['Scegli la zona','Prima del lancio guarda la zona: 1, 6 o 5. I coni segnano i bersagli.',0],
    ['Zona 1','Spalle e piede avanti rivolti verso la zona 1 avversaria.',1],
    ['Zona 6','Batti al centro del campo, una zona spesso scoperta da chi riceve.',3],
    ['Zona 5','Ruota appena le spalle verso la zona 5 prima del lancio.',5]],
  attenzione:['La direzione la danno spalle e mano, non il polso all\'ultimo momento.','Stesso lancio per tutte le zone: l\'avversario non deve capire dove batti.','Prima la precisione, poi la potenza.'],
  errori:[['Tutte le battute finiscono al centro','Prima del lancio orienta il piede avanti e le spalle verso la zona scelta.'],['Molte battute in rete quando si mira','Mira un metro sopra la rete: la palla scende da sola.']],
  varianti:{facile:'Solo due zone, con bersagli grandi (cerchi o tappetini).', difficile:'Un compagno chiama la zona quando la palla è già in aria.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('b','B'), co('z1'), co('z6'), co('z5'), ca(), pa('p1'), pa('p2'), pa('p3')],
    fotogrammi:[F({b:[-0.8,7.3], z1:[16.2,1.6], z6:[16.2,4.5], z5:[16.2,7.4], car:[-1.6,8.9], p1:[-0.45,7.0], p2:[-1.75,8.75], p3:[-1.45,9.05]},null,0.6),
      F({p1:[16.2,1.7]},1.7,0.4,2.6), F({p2:[-0.45,7.0]},0.5,0.4,0.4), F({p2:[16.2,4.6]},1.7,0.4,2.6), F({p3:[-0.45,7.0]},0.5,0.4,0.4), F({p3:[16.2,7.3]},1.7,0.8,2.6)]}});

E({id:'bat-battuta-difesa', titolo:'Battuta e subito in difesa', obiettivo:'Tecnica', ambito:'Battuta',
  descrizione:'Dopo la battuta il battitore entra in campo in zona 1 e difende una palla attaccata o lanciata dall\'allenatore dall\'altra parte della rete.',
  serveA:'Abitua a non restare a guardare la propria battuta: in partita il battitore è subito un difensore.',
  lavora:{fondamentali:['Battuta','Difesa'], muscoli:['quadricipiti','spalle']}, difficolta:3, giocatori:[3,10], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['transizione'],
  passi:[
    ['Battuta','Batti dall\'alto o dal basso verso l\'altro campo.',1],
    ['Entra in campo','Subito dopo la battuta entra in zona 1 e fermati in posizione di difesa prima che l\'allenatore colpisca.',2],
    ['Difesa','L\'allenatore attacca o lancia verso di te: difendi alta e verso il centro del campo.',4]],
  attenzione:['Non restare a guardare la battuta: entra subito.','Fermati in posizione bassa prima del colpo dell\'allenatore.','La difesa va alta e verso il centro, non verso la rete.'],
  errori:[['Il battitore è ancora in movimento quando arriva l\'attacco','Entra con due o tre passi veloci e fermati con i piedi larghi.'],['La palla difesa passa dall\'altra parte','Braccia meno rigide e piano rivolto verso l\'alto: la palla deve restare nel tuo campo.']],
  varianti:{facile:'L\'allenatore lancia la palla a due mani invece di attaccarla.', difficile:'L\'allenatore sceglie se attaccare in zona 1 o fare un pallonetto corto.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('b','B'), all(), pa('p1'), pa('p2')],
    fotogrammi:[F({b:[-0.8,7.5], all:[10.8,4.8], p1:[-0.45,7.2], p2:[10.75,4.35]},null,0.6), F({p1:[15.5,4.2]},1.6,0.2,2.6), F({b:[1.9,7.1]},0.9,0.5), F({p2:[2.15,6.8]},0.7,0.1,0.4), F({p2:[6.2,5.0]},1.1,0.9,2.8)]}});

/* =================================================================== TECNICA · RICEZIONE */
E({id:'ric-coppie-battuta', titolo:'Ricezione a coppie su battuta', obiettivo:'Tecnica', ambito:'Ricezione',
  descrizione:'Due ricevitori in seconda linea ricevono la battuta e mandano la palla al palleggiatore. Dopo 10 battute si ruota.',
  serveA:'Lettura della traiettoria, spostamento e precisione verso il palleggiatore: la base del cambio palla.',
  lavora:{fondamentali:['Ricezione'], muscoli:['quadricipiti']}, difficolta:2, giocatori:[3,4], durata:12,
  materiale:['Palloni','Coni'], materialeNote:'6 palloni, 1 cono', pacchetti:['pk-fondamentali'], tags:['bagher','cambio palla'],
  passi:[
    ['Battuta','B batte dall\'altro campo, a turno verso R1 o R2. Dopo 10 battute si ruota.',0],
    ['Spostamento','Il ricevitore legge la traiettoria, si sposta e si ferma prima che arrivi la palla.',1],
    ['Bagher al bersaglio','Bagher verso il cono tra le zone 2 e 3, dove sta il palleggiatore P, che blocca la palla.',2]],
  attenzione:['Arriva sotto la palla e fermati prima del contatto.','Braccia tese e unite, piano di rimbalzo rivolto al bersaglio.','Spingi con le gambe, non con le braccia.'],
  errori:[['La palla va alta e lunga','Braccia più basse e piano meno inclinato: accompagna verso il bersaglio.'],['Si riceve in corsa','Parti prima: leggi il lancio del battitore e chiudi lo spostamento con un passo d\'arresto.'],['I due ricevitori si fermano a guardarsi','Decidete prima chi prende le palle in mezzo: di solito chi è più indietro o chi ha la palla davanti.']],
  varianti:{facile:'Battuta dal basso o lancio a due mani da metà campo.', difficile:'Battuta flottante dall\'alto e punteggio da 0 a 3 per ogni ricezione.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('r1','R1'), at('r2','R2'), at('p','P'), av('b','B'), co('t'), pa()],
    fotogrammi:[F({r1:[2,2.4], r2:[2,6.6], p:[8.4,6.2], b:[19.3,6.2], t:[7.8,5.6], pa:[19.05,5.7]},null,0.7), F({r1:[2.5,3.1], pa:[2.65,3.25]},1.7,0.2,2.6), F({pa:[8.2,5.85]},1.3,1.0,2.2)]}});

E({id:'ric-bagher-laterale', titolo:'Bagher con spostamento laterale', obiettivo:'Tecnica', ambito:'Ricezione',
  descrizione:'Un compagno lancia la palla a destra e a sinistra; il ricevitore si sposta con passi laterali e gliela restituisce in bagher.',
  serveA:'Insegna a muoversi prima di colpire: le palle facili diventano facili perché ci si arriva in tempo.',
  lavora:{fondamentali:['Ricezione','Difesa'], muscoli:['quadricipiti','adduttori']}, difficolta:1, giocatori:[2,2], durata:8,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['bagher','spostamenti','coppie'],
  passi:[
    ['Partenza','R al centro, in posizione di attesa. Il compagno lancia a due mani a destra o a sinistra.',0],
    ['Spostamento','Passi laterali senza incrociare i piedi; arriva prima della palla e fermati.',1],
    ['Bagher al compagno','Bagher di ritorno, alto e preciso. Poi torni al centro.',2],
    ['Altro lato','Stesso movimento verso l\'altro lato. 10 palle, poi si cambia.',3]],
  attenzione:['Passi laterali bassi, senza saltelli.','Piedi fermi e larghi al momento del contatto.','Le braccia si uniscono solo alla fine: prima ci si sposta con le braccia libere.'],
  errori:[['Si colpisce con le braccia piegate','Unisci le mani e tendi i gomiti prima del contatto; la palla si colpisce sugli avambracci.'],['La palla va di lato','Abbassa la spalla esterna: il piano delle braccia deve guardare il compagno.']],
  varianti:{facile:'Lanci più vicini e più lenti; anche palla bloccata e rilanciata.', difficile:'Lancio a sorpresa avanti, indietro o di lato.'},
  anim:{tipo:'campo', vista:'meta', elementi:[at('r','R'), at('l','L'), pa()],
    fotogrammi:[F({r:[3.6,4.5], l:[7.6,4.5], pa:[7.25,4.4]},null,0.5), F({r:[3.6,2.6], pa:[3.85,2.65]},1.1,0.2,1.8), F({r:[3.6,2.6], pa:[7.25,4.4]},1.0,0.3,2.0), F({r:[3.6,6.4], pa:[3.85,6.35]},1.2,0.2,1.8), F({pa:[7.25,4.4]},1.0,0.3,2.0)]}});

E({id:'ric-tre-ricevitori', titolo:'Ricezione a tre in seconda linea', obiettivo:'Tecnica', ambito:'Ricezione',
  descrizione:'Tre ricevitori nelle zone 5, 6 e 1 ricevono la battuta. Si allena soprattutto la palla che cade tra due compagni.',
  serveA:'Senza libero la ricezione è di tutti: chiamata e divisione del campo evitano le palle «di nessuno».',
  lavora:{fondamentali:['Ricezione'], muscoli:['quadricipiti']}, difficolta:3, giocatori:[5,8], durata:15,
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-gioco'], tags:['chiamata','senza libero'],
  passi:[
    ['Posizioni','Tre ricevitori nelle zone 5, 6 e 1; il palleggiatore P a rete tra le zone 2 e 3.',0],
    ['Palla in mezzo','Sulle palle tra due ricevitori chiama forte «mia». Di solito la prende il ricevitore centrale o chi vede la palla arrivare davanti.',1],
    ['Al palleggiatore','Ricezione alta verso P; gli altri due si girano verso la palla.',2]],
  attenzione:['Chiama sempre, anche quando sembra ovvio.','Chi non riceve si gira verso la palla e copre.','Spazi uguali tra i tre ricevitori.'],
  errori:[['Nessuno prende la palla in mezzo','Accordatevi prima: il ricevitore centrale prende le palle tra lui e i compagni.'],['Ricezioni basse e veloci verso la rete','Piano delle braccia più aperto verso l\'alto: la palla deve arrivare a P all\'altezza della rete o poco sopra.']],
  varianti:{facile:'Battuta dal basso da metà campo avversario.', difficile:'Battuta forte; chi sbaglia la ricezione va a battere.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('r5','R5'), at('r6','R6'), at('r1','R1'), at('p','P'), av('b','B'), pa()],
    fotogrammi:[F({r5:[2.2,1.9], r6:[1.8,4.6], r1:[2.2,7.2], p:[8.4,6.0], b:[19.3,2.6], pa:[19.05,3.0]},null,0.7), F({r6:[2.1,3.25], pa:[2.3,3.15]},1.7,0.2,2.6), F({pa:[8.2,5.7]},1.3,1.0,2.2)]}});

E({id:'ric-corta-lunga', titolo:'Ricezione di palle corte e lunghe', obiettivo:'Tecnica', ambito:'Ricezione',
  descrizione:'L\'allenatore lancia alternando palle corte, vicino alla linea dei 3 metri, e palle lunghe verso il fondo. Il ricevitore avanza e arretra.',
  serveA:'Le battute che mettono in difficoltà sono spesso corte o lunghe, non laterali.',
  lavora:{fondamentali:['Ricezione'], muscoli:['quadricipiti','polpacci']}, difficolta:2, giocatori:[2,3], durata:10,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['spostamenti','avanti indietro'],
  passi:[
    ['Palla corta','Avanza con passi brevi e scendi con le gambe, braccia sotto la palla.',1],
    ['Ritorno','Bagher all\'allenatore e torna al centro.',2],
    ['Palla lunga','Arretra girandoti di lato, poi fermati con il peso in avanti.',3],
    ['Bagher','Bagher all\'allenatore. 10 palle, poi si cambia.',4]],
  attenzione:['Sulla palla corta non allungare solo le braccia: avvicinati con i piedi.','Sulla palla lunga non andare indietro di schiena: gira il corpo e corri.','Sempre fermo al momento del contatto.'],
  errori:[['Sulle palle corte la palla va contro la rete','Piega di più le ginocchia e tieni il piano delle braccia rivolto verso l\'alto.'],['Sulle palle lunghe si cade all\'indietro','Arretra prima e più veloce, poi riporta il peso avanti: il contatto avviene davanti al corpo.']],
  varianti:{facile:'Solo palle corte o solo lunghe per qualche minuto.', difficile:'L\'allenatore batte invece di lanciare.'},
  anim:{tipo:'campo', vista:'meta', elementi:[at('r','R'), all(), pa()],
    fotogrammi:[F({r:[4.2,4.5], all:[8.3,4.4], pa:[7.95,4.3]},null,0.5), F({r:[5.9,4.5], pa:[6.15,4.35]},1.0,0.2,1.6), F({r:[5.9,4.5], pa:[7.95,4.3]},1.0,0.3,1.8), F({r:[1.5,4.5], pa:[1.75,4.35]},1.4,0.2,3.0), F({pa:[7.95,4.3]},1.3,0.4,2.4)]}});

/* =================================================================== TECNICA · PALLEGGIO */
E({id:'pal-coppie-avanti', titolo:'Palleggio a coppie con spostamento in avanti', obiettivo:'Tecnica', ambito:'Palleggio',
  descrizione:'A coppie a 4-5 metri: dopo ogni palleggio un giocatore corre a toccare la linea dei 3 metri e torna in tempo per il palleggio successivo.',
  serveA:'Palleggiare dopo uno spostamento, come succede in partita.',
  lavora:{fondamentali:['Palleggio'], muscoli:['spalle','tricipiti','quadricipiti']}, difficolta:1, giocatori:[2,2], durata:8,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['coppie','spostamenti'],
  passi:[
    ['Palleggio','A palleggia alto verso B.',1],
    ['Ritorno e spostamento','B palleggia di ritorno e corre avanti a toccare la linea dei 3 metri.',2],
    ['Di nuovo pronto','B torna indietro in tempo per il palleggio successivo. 10 volte, poi si cambia.',3]],
  attenzione:['Mani a coppa sopra la fronte: pollici e indici formano un triangolo.','Arriva sotto la palla e palleggia con braccia e gambe insieme.','Traiettoria alta: dà tempo al compagno.'],
  errori:[['La palla resta nelle mani (doppia o trattenuta)','Mani pronte prima che arrivi la palla, contatto breve e spinta con tutte le dita.'],['Si palleggia con la palla davanti al petto','Spostati prima: la palla si prende sopra la fronte, non davanti al viso.']],
  varianti:{facile:'Senza spostamento, solo palleggi alti a coppie.', difficile:'Lo spostamento è laterale, a toccare un cono a 2 metri.'},
  anim:{tipo:'campo', vista:'meta', elementi:[at('a','A'), at('b','B'), pa()],
    fotogrammi:[F({a:[2.2,4.5], b:[5.6,4.5], pa:[2.5,4.3]},null,0.4), F({pa:[5.3,4.3]},1.2,0.2,2.6), F({pa:[2.5,4.3], b:[6.1,4.5]},1.2,0.1,2.6), F({b:[5.6,4.5], pa:[5.3,4.3]},1.2,0.3,2.6)]}});

E({id:'pal-triangolo', titolo:'Palleggio in triangolo con cambio di direzione', obiettivo:'Tecnica', ambito:'Palleggio',
  descrizione:'Tre giocatori nelle zone 4, 2 e 6 si passano la palla in palleggio sempre nello stesso verso; dopo 10 giri si cambia verso.',
  serveA:'Orientare il corpo verso il bersaglio prima del contatto: è il segreto di un\'alzata precisa.',
  lavora:{fondamentali:['Palleggio'], muscoli:['spalle']}, difficolta:2, giocatori:[3,3], durata:10,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['terne','orientamento'],
  passi:[
    ['Da 6 a 4','Il giocatore in 6 palleggia verso la zona 4.',1],
    ['Cambio di direzione','In 4 si orienta il corpo verso il compagno successivo prima che arrivi la palla, poi si palleggia verso 2.',2],
    ['Ritorno','Da 2 di nuovo verso 6. Dopo 10 giri si cambia verso.',3]],
  attenzione:['Orienta piedi e spalle verso dove vuoi mandare la palla prima del contatto.','Palleggio alto e morbido.','Chiama il nome del compagno a cui passi.'],
  errori:[['La palla va dove guardano le spalle e non al compagno','Gira i piedi verso il bersaglio prima che arrivi la palla, non dopo.'],['Palleggi bassi e veloci','Spingi verso l\'alto con le gambe: la palla deve salire almeno 2 metri sopra la testa.']],
  varianti:{facile:'Ogni giocatore fa un palleggio di controllo prima di passare.', difficile:'Il giocatore in 6 dopo il palleggio corre a toccare la rete e torna.'},
  anim:{tipo:'campo', vista:'meta', zone:true, elementi:[at('z4','4'), at('z2','2'), at('z6','6'), pa()],
    fotogrammi:[F({z4:[7.4,1.6], z2:[7.4,7.4], z6:[2.2,4.5], pa:[2.5,4.3]},null,0.4), F({pa:[7.1,1.8]},1.3,0.3,2.6), F({pa:[7.1,7.2]},1.3,0.3,2.6), F({pa:[2.5,4.3]},1.3,0.4,2.6)]}});

E({id:'pal-alzata-4', titolo:'Alzata in zona 4 su palla lanciata', obiettivo:'Tecnica', ambito:'Palleggio',
  descrizione:'Il palleggiatore parte dal campo, corre a rete e alza in zona 4 su una palla lanciata dall\'allenatore. Un compagno in 4 controlla la precisione.',
  serveA:'L\'alzata in zona 4 è la più usata: deve essere alta, lontana un metro dalla rete e vicina all\'antenna.',
  lavora:{fondamentali:['Palleggio','Attacco'], muscoli:['spalle','tricipiti']}, difficolta:3, giocatori:[3,6], durata:12,
  materiale:['Palloni','Coni'], pacchetti:['pk-fondamentali'], tags:['alzatore','palleggiatore'],
  passi:[
    ['Corri a rete','P parte dal campo e raggiunge il suo posto tra le zone 2 e 3, con il fianco destro verso la rete.',1],
    ['Sotto la palla','L\'allenatore lancia una palla alta. P si ferma sotto e si orienta verso la zona 4.',2],
    ['Alzata','Palleggio alto e lungo verso la zona 4, a circa un metro dalla rete e dall\'antenna.',3],
    ['Controllo','A in zona 4 blocca la palla: se arriva dove si può attaccare, l\'alzata è buona.',4]],
  attenzione:['Arriva prima della palla e guarda la zona 4 con le spalle.','Palla alta: deve scendere vicino all\'antenna, non sopra la rete.','Stessa posizione delle mani in tutte le alzate.'],
  errori:[['L\'alzata va troppo vicino alla rete','Spingi più in alto e meno in avanti: la palla deve cadere a un metro dalla rete.'],['L\'alzata è corta','Spinta finale con le gambe e braccia distese fino in fondo.']],
  varianti:{facile:'P parte già a rete e l\'allenatore lancia da vicino.', difficile:'L\'allenatore lancia palle imprecise, anche lontane dalla rete.'},
  anim:{tipo:'campo', vista:'meta', elementi:[at('p','P'), at('a','A'), all(), be('t'), pa()],
    fotogrammi:[F({p:[5.8,6.8], a:[5.8,1.0], all:[3.4,6.6], t:[8.0,1.2], pa:[3.75,6.45]},null,0.5), F({p:[8.4,6.0]},1.0,0.2), F({pa:[8.2,5.75]},1.2,0.3,2.4), F({pa:[8.0,1.3]},1.4,0.2,3.4), F({a:[7.6,1.5], pa:[7.75,1.45]},0.6,0.9)]}});

E({id:'pal-sopra-rete', titolo:'Palleggio sopra la rete', obiettivo:'Tecnica', ambito:'Palleggio',
  descrizione:'Due giocatori ai lati della rete: palleggio di controllo sopra la testa, poi palleggio oltre la rete al compagno.',
  serveA:'Controllo della palla e precisione con due tocchi: utile anche come riscaldamento.',
  lavora:{fondamentali:['Palleggio'], muscoli:['spalle']}, difficolta:2, giocatori:[2,2], durata:8,
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-riscaldamento'], tags:['controllo','coppie'],
  passi:[
    ['Controllo','A palleggia sopra la propria testa per controllare la palla.',1],
    ['Passaggio','Secondo palleggio alto oltre la rete verso B.',2],
    ['Risposta','B fa lo stesso: controllo e passaggio. Contate gli scambi senza errori.',4]],
  attenzione:['Due tocchi a testa: uno di controllo, uno per passare.','Il controllo sale dritto sopra la fronte.','Il passaggio supera la rete di almeno un metro.'],
  errori:[['Il primo palleggio scappa in avanti','Spingi in verticale: mani rivolte verso il soffitto.'],['La palla tocca la rete','Allontanatevi di un passo dalla rete e alzate la traiettoria.']],
  varianti:{facile:'Un solo tocco, oppure palla bloccata e rilanciata.', difficile:'Dopo il passaggio ci si siede a terra e ci si rialza prima della palla successiva.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('a','A'), av('b','B'), pa()],
    fotogrammi:[F({a:[6.6,4.5], b:[11.4,4.5], pa:[6.9,4.3]},null,0.4), F({pa:[6.95,4.25]},0.8,0.1,1.4), F({pa:[11.1,4.3]},1.3,0.1,2.6), F({pa:[11.05,4.25]},0.8,0.1,1.4), F({pa:[6.9,4.3]},1.3,0.4,2.6)]}});

/* =================================================================== TECNICA · ATTACCO */
E({id:'att-rincorsa-lancio', titolo:'Rincorsa e attacco su palla lanciata', obiettivo:'Tecnica', ambito:'Attacco',
  descrizione:'L\'allenatore lancia una palla alta in zona 4; l\'attaccante parte dalla linea dei 3 metri con la rincorsa e attacca nell\'altro campo.',
  serveA:'Tempo della rincorsa, stacco e colpo: si imparano con una palla sempre uguale, prima di passare alle alzate vere.',
  lavora:{fondamentali:['Attacco'], muscoli:['quadricipiti','glutei','spalle']}, difficolta:3, giocatori:[2,10], durata:15,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['schiacciata','rincorsa','stacco'],
  passi:[
    ['Partenza','L\'attaccante A parte dalla linea dei 3 metri in zona 4, un po\' fuori dal campo.',0],
    ['Rincorsa','Quando la palla è al punto più alto parte la rincorsa. Per chi colpisce di destro: sinistro, destro, sinistro, con le braccia che vanno indietro.',1],
    ['Salto e colpo','Stacco a due piedi, braccia in alto, colpo sopra la testa davanti alla spalla con la mano aperta che avvolge la palla.',2]],
  attenzione:['Meglio partire un attimo tardi che in anticipo: la palla deve scendere mentre arrivi.','Ultimo passo lungo e frenante: trasforma la corsa in salto.','Colpisci la palla davanti a te, mai sopra o dietro la testa.'],
  errori:[['Si arriva sotto la palla e la si colpisce all\'indietro','Parti più tardi o fai una rincorsa più corta: la palla deve restare davanti alla spalla.'],['Si salta in avanti verso la rete','Ultimo passo con il tallone avanti che frena; stacca verso l\'alto.'],['Si atterra su un piede solo','Atterra su tutti e due i piedi, con le ginocchia piegate: protegge ginocchia e caviglie.']],
  varianti:{facile:'Rincorsa di due passi e colpo senza salto, con palla tenuta dall\'allenatore su un rialzo.', difficile:'Il lancio arriva da posizioni diverse e l\'attaccante deve adattare la rincorsa.'},
  note:'Per atleti adulti: 5-6 attacchi a testa per serie, con recupero. L\'atterraggio conta quanto il colpo.',
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('a','A'), all(), pa()],
    fotogrammi:[F({a:[5.0,0.9], all:[6.5,3.8], pa:[6.75,3.55]},null,0.6), F({a:[7.4,1.5], pa:[8.0,1.6]},1.4,0.1,3.4), F({pa:[15.2,6.3]},0.5,1.0,0.5)]}});

E({id:'att-parallela-diagonale', titolo:'Attacco in parallela e in diagonale', obiettivo:'Tecnica', ambito:'Attacco',
  descrizione:'Con l\'alzata del palleggiatore, l\'attaccante di zona 4 attacca una palla lungo la linea (verso la zona 1 avversaria) e una in diagonale (verso la zona 5).',
  serveA:'Avere due direzioni con la stessa rincorsa rende l\'attacco difficile da leggere per muro e difesa.',
  lavora:{fondamentali:['Attacco','Palleggio'], muscoli:['spalle','obliqui','quadricipiti']}, difficolta:3, giocatori:[3,8], durata:15,
  materiale:['Palloni','Coni'], pacchetti:['pk-fondamentali'], tags:['direzione','lungolinea'],
  passi:[
    ['Alzata','P alza in zona 4. A parte con la rincorsa.',1],
    ['Parallela','Prima palla lungo la linea laterale, verso il cono in zona 1 avversaria: spalle rivolte in avanti.',2],
    ['Torna','A torna fuori dalla linea dei 3 metri.',3],
    ['Diagonale','Seconda palla in diagonale, verso il cono in zona 5: ruota il busto e porta la mano verso l\'interno del campo.',5]],
  attenzione:['La direzione la decide la rotazione del busto, il braccio segue.','Stessa rincorsa per le due direzioni: non far capire dove attacchi.','Atterra a due piedi e torna subito pronto.'],
  errori:[['La parallela esce','Colpisci la palla più all\'interno e chiudi il polso; mira mezzo metro dentro la linea.'],['La diagonale finisce in rete','Colpisci più in alto e più avanti: la diagonale è il colpo con più spazio, non serve schiacciarla verso il basso.']],
  varianti:{facile:'Attacco da fermo, con un piccolo salto, sulla palla lanciata.', difficile:'Il palleggiatore indica la direzione all\'ultimo, con la voce.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('a','A'), at('p','P'), co('c1'), co('c5'), pa('p1'), pa('p2')],
    fotogrammi:[F({a:[5.0,0.9], p:[8.4,6.0], c1:[16.4,1.4], c5:[16.0,7.6], p1:[8.15,5.75], p2:[8.75,6.35]},null,0.5),
      F({a:[7.4,1.5], p1:[8.0,1.6]},1.4,0.1,3.2), F({p1:[16.3,1.6]},0.5,0.5,0.5), F({a:[5.0,0.9]},1.0,0.3), F({a:[7.4,1.5], p2:[8.0,1.6]},1.4,0.1,3.2), F({p2:[15.9,7.3]},0.5,0.9,0.5)]}});

E({id:'att-pallonetto', titolo:'Pallonetto e colpo piazzato', obiettivo:'Tecnica', ambito:'Attacco',
  descrizione:'L\'attaccante fa la rincorsa come per un attacco forte, ma all\'ultimo appoggia la palla dietro al muro o la piazza in un angolo libero.',
  serveA:'Quando il muro è ben piazzato, un colpo intelligente vale quanto una schiacciata.',
  lavora:{fondamentali:['Attacco'], muscoli:['spalle']}, difficolta:2, giocatori:[3,8], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['pallonetto','piazzata','tocco'],
  passi:[
    ['Alzata e rincorsa','P alza in zona 4, A fa la rincorsa come per un attacco forte.',1],
    ['Pallonetto','All\'ultimo A rallenta il braccio e spinge la palla con le dita sopra il muro, nella zona dei 3 metri avversaria.',2],
    ['Oppure piazzato','In alternativa colpisce a mano aperta ma piano, verso un angolo libero in fondo al campo.',2]],
  attenzione:['Fino all\'ultimo il movimento deve sembrare un attacco forte.','Nel pallonetto si spinge con le dita, senza accompagnare con il palmo: sarebbe palla trattenuta.','Durante la rincorsa guarda dove sono i difensori.'],
  errori:[['Il pallonetto finisce sul muro','Colpisci più in alto e spingi la palla verso l\'alto prima che in avanti.'],['L\'avversario capisce in anticipo','Stessa rincorsa e stesso caricamento del braccio dell\'attacco forte; cambia solo all\'ultimo.']],
  varianti:{facile:'Senza muro, palla lanciata dall\'allenatore.', difficile:'Un difensore avversario si sposta e l\'attaccante sceglie dove c\'è spazio.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('a','A'), at('p','P'), av('m','M'), av('d','D'), pa()],
    fotogrammi:[F({a:[5.0,0.9], p:[8.4,6.0], m:[9.7,1.7], d:[15.6,4.5], pa:[8.15,5.75]},null,0.5), F({a:[7.4,1.5], pa:[8.0,1.6]},1.4,0.1,3.2), F({pa:[11.4,3.2], d:[13.2,3.6]},0.9,1.0,1.4)]}});

E({id:'att-zona2', titolo:'Attacco da zona 2', obiettivo:'Tecnica', ambito:'Attacco',
  descrizione:'Il palleggiatore in zona 3 alza in avanti verso la zona 2; l\'attaccante parte da fuori campo, vicino alla linea laterale destra.',
  serveA:'La zona 2 è la zona dell\'opposto e degli attaccanti mancini; per i destri richiede una rincorsa diversa.',
  lavora:{fondamentali:['Attacco','Palleggio'], muscoli:['spalle','quadricipiti']}, difficolta:3, giocatori:[3,8], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['opposto','mancini'],
  passi:[
    ['Alzata','P, in zona 3, alza in avanti verso la zona 2.',1],
    ['Rincorsa','A parte da fuori campo, vicino alla linea laterale destra, e corre verso l\'interno.',1],
    ['Colpo','Per chi colpisce di destro la palla arriva dal lato del braccio che colpisce: aspetta che scenda e attacca in diagonale.',2]],
  attenzione:['Per i destri la rincorsa da zona 2 è più corta: parti più vicino alla rete.','Colpisci la palla quando è davanti alla spalla destra.','Atterra a due piedi, lontano dalla rete.'],
  errori:[['Si colpisce la palla di lato, lontano dalla spalla','Allinea la rincorsa in modo che la palla scenda davanti al braccio che colpisce: parti più aperto verso l\'esterno.'],['Si tocca la rete','Stacca un poco più lontano dalla rete e salta verso l\'alto, non in avanti.']],
  varianti:{facile:'Palla lanciata dall\'allenatore invece dell\'alzata.', difficile:'I mancini provano anche la parallela.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('a','A'), at('p','P'), pa()],
    fotogrammi:[F({a:[5.0,8.9], p:[8.4,4.4], pa:[8.15,4.2]},null,0.5), F({a:[7.3,7.7], pa:[8.0,7.6]},1.3,0.1,2.8), F({pa:[15.6,2.6]},0.5,1.0,0.5)]}});

/* =================================================================== TECNICA · MURO */
E({id:'muro-spostamento', titolo:'Spostamento a muro con passo laterale', obiettivo:'Tecnica', ambito:'Muro',
  descrizione:'Senza palla: il giocatore parte in zona 3, si sposta con passi laterali verso la zona 4 o 2 e salta a muro. Poi torna al centro.',
  serveA:'Arrivare in tempo e saltare dritto è più importante dell\'altezza del salto.',
  lavora:{fondamentali:['Muro'], muscoli:['quadricipiti','polpacci','spalle']}, difficolta:2, giocatori:[1,6], durata:8,
  materiale:['Corpo libero','Coni'], pacchetti:['pk-fondamentali'], tags:['passo laterale','senza palla'],
  passi:[
    ['Posizione','In zona 3, a un braccio dalla rete, mani all\'altezza delle spalle, ginocchia leggermente piegate.',0],
    ['Verso la zona 4','Due passi laterali veloci senza incrociare, poi stacco a due piedi con le mani che salgono vicino alla rete.',1],
    ['Ritorno','Atterra a due piedi e torna al centro.',2],
    ['Verso la zona 2','Stesso movimento verso la zona 2. 6 ripetizioni per lato.',3]],
  attenzione:['Mani sempre alte davanti alle spalle: salgono dritte, non partono dal basso.','Spalle parallele alla rete per tutto lo spostamento.','Atterra nel punto in cui hai staccato.'],
  errori:[['Si salta in avanti e si tocca la rete','Ultimo passo frenato e stacco verso l\'alto; tieni mezzo metro dalla rete.'],['Le mani scendono durante lo spostamento','Corri con le mani all\'altezza delle spalle, come se tenessi un vassoio sopra la testa.']],
  varianti:{facile:'Un solo passo laterale e salto basso.', difficile:'Il compagno indica la direzione all\'ultimo, con la mano.'},
  anim:{tipo:'campo', vista:'meta', zone:true, elementi:[at('m','M'), co('c4'), co('c2')],
    fotogrammi:[F({m:[8.4,4.5], c4:[8.6,0.7], c2:[8.6,8.3]},null,0.5), F({m:[8.4,1.6]},0.9,0.6), F({m:[8.4,4.5]},0.9,0.4), F({m:[8.4,7.4]},0.9,0.6)]}});

E({id:'muro-a-due', titolo:'Muro a due su attacco da zona 4', obiettivo:'Tecnica', ambito:'Muro',
  descrizione:'Il centrale si sposta e chiude il muro con il laterale di zona 2 sull\'attacco dalla zona 4 avversaria.',
  serveA:'Due muri vicini chiudono la diagonale e lasciano alla difesa una sola zona da coprire.',
  lavora:{fondamentali:['Muro'], muscoli:['quadricipiti','spalle']}, difficolta:4, giocatori:[4,8], durata:15,
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-gioco'], tags:['centrale','laterale','chiusura'],
  passi:[
    ['Lettura','Il centrale C guarda l\'alzatore avversario: appena la palla va verso la zona 4 avversaria, parte.',0],
    ['Chiusura','C si sposta con passi laterali e si mette accanto al laterale L, spalla a spalla. L decide il punto del muro.',1],
    ['Salto insieme','Saltano insieme, con le mani sopra la rete e ben vicine tra loro.',2]],
  attenzione:['Il laterale fissa il punto, il centrale lo raggiunge.','Nessuno spazio tra le mani dei due.','Si salta un attimo dopo l\'attaccante, non insieme a lui.'],
  errori:[['La palla passa tra i due muri','Il centrale arriva spalla a spalla con il laterale; le mani interne quasi si toccano.'],['Il muro arriva tardi','Il centrale parte quando la palla lascia le mani dell\'alzatore, non quando arriva in zona 4.']],
  varianti:{facile:'Attacco da fermo, su palla lanciata dall\'allenatore sul rialzo.', difficile:'L\'alzatore avversario sceglie tra zona 4 e zona 2.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('c','C'), at('l','L'), av('a','A'), av('al','Al'), pa()],
    fotogrammi:[F({c:[8.5,4.5], l:[8.5,7.7], a:[12.8,8.3], al:[9.9,4.4], pa:[10.2,4.2]},null,0.6), F({c:[8.5,6.3], a:[10.9,7.0], pa:[10.25,7.0]},1.3,0.1,2.8), F({pa:[9.15,7.0]},0.35,0.1,0.2), F({pa:[11.8,6.0]},0.6,0.9,0.8)]}});

E({id:'muro-ritorno', titolo:'Dal muro alla ricezione della palla libera', obiettivo:'Tecnica', ambito:'Muro',
  descrizione:'Il giocatore è a muro; quando l\'allenatore chiama «libera» e manda una palla facile, lascia la rete, arretra e la riceve verso il palleggiatore.',
  serveA:'In partita molte palle non vengono attaccate: chi resta a rete lascia un buco e non ha la rincorsa per contrattaccare.',
  lavora:{fondamentali:['Muro','Ricezione'], muscoli:['quadricipiti']}, difficolta:3, giocatori:[3,6], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['transizione','palla libera'],
  passi:[
    ['A muro','M è a muro in zona 4.',0],
    ['«Libera!»','L\'allenatore chiama «libera»: M lascia la rete e arretra di 3-4 passi, girandosi verso il campo.',1],
    ['Ricevi','La palla facile arriva: M si ferma e la manda in bagher a P.',3],
    ['Pronto ad attaccare','Dopo il bagher M è già alla linea dei 3 metri, pronto per la rincorsa.',3]],
  attenzione:['Quando la palla non viene attaccata, chi è in prima linea si allontana dalla rete.','Arretra girando il corpo, non camminando all\'indietro.','Fermati prima del bagher.'],
  errori:[['M resta a rete e la palla gli cade dietro','Alla chiamata «libera» lascia subito la rete: il primo passo è indietro e verso il centro.'],['Si arretra lentamente all\'indietro','Gira i piedi verso il fondo e corri, poi girati di nuovo verso la palla.']],
  varianti:{facile:'L\'allenatore lancia a due mani da vicino alla rete.', difficile:'Dopo il bagher M attacca la palla alzata da P.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('m','M'), at('p','P'), all(), pa()],
    fotogrammi:[F({m:[8.5,1.6], p:[8.4,6.0], all:[11.6,2.6], pa:[11.35,2.35]},null,0.7), F({m:[5.6,2.0]},0.9,0.2), F({pa:[5.75,2.25]},1.2,0.1,2.4), F({pa:[8.2,5.7]},1.2,1.0,2.4)]}});

/* =================================================================== TECNICA · DIFESA */
E({id:'dif-attacco-allenatore', titolo:'Difesa su attacco dell\'allenatore', obiettivo:'Tecnica', ambito:'Difesa',
  descrizione:'L\'allenatore, su un rialzo dall\'altra parte della rete, attacca verso il difensore in zona 5; la difesa va alta verso il centro del campo.',
  serveA:'Abitua alla velocità della palla attaccata e a difendere verso il palleggiatore, non semplicemente «a tenerla su».',
  lavora:{fondamentali:['Difesa'], muscoli:['quadricipiti','glutei']}, difficolta:3, giocatori:[2,6], durata:12,
  materiale:['Palloni'], materialeNote:'un rialzo stabile per l\'allenatore', pacchetti:['pk-fondamentali'], tags:['difesa bassa','ammortizzare'],
  passi:[
    ['Posizione','D in zona 5: piedi larghi, peso in avanti, braccia libere davanti.',0],
    ['Attacco','L\'allenatore attacca verso D. D resta basso e ferma la palla con le braccia.',1],
    ['Difesa alta','La palla sale alta verso il centro del campo, dove il palleggiatore può alzarla.',2]],
  attenzione:['Sii fermo quando l\'allenatore colpisce.','Braccia morbide: assorbi la forza, non respingere.','La palla difesa deve salire alta, verso il centro.'],
  errori:[['La palla rimbalza via forte','Ammortizza: lascia andare le braccia leggermente indietro al contatto.'],['Il difensore si alza mentre l\'allenatore colpisce','Resta basso fino al contatto: dalle gambe piegate la reazione è più veloce.']],
  varianti:{facile:'Lanci a due mani o attacchi piano e centrali.', difficile:'Attacchi a destra e a sinistra del difensore; dopo la difesa si contrattacca.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('d','D'), at('p','P'), all(), pa()],
    fotogrammi:[F({d:[2.6,1.9], p:[8.4,6.0], all:[10.7,2.4], pa:[10.5,2.1]},null,0.8), F({pa:[2.85,2.2]},0.6,0.2,0.4), F({pa:[7.6,5.2]},1.3,1.0,3.0)]}});

E({id:'dif-tre-seconda-linea', titolo:'Difesa a tre in seconda linea', obiettivo:'Tecnica', ambito:'Difesa',
  descrizione:'Tre difensori nelle zone 5, 6 e 1 si sistemano in base all\'attacco dalla zona 4 avversaria e difendono la palla attaccata dall\'allenatore.',
  serveA:'Ognuno deve sapere quale parte del campo difende prima che arrivi l\'attacco.',
  lavora:{fondamentali:['Difesa'], muscoli:['quadricipiti']}, difficolta:3, giocatori:[4,7], durata:15,
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-gioco'], tags:['posizioni','seconda linea'],
  passi:[
    ['Posizioni','Tre difensori nelle zone 5, 6 e 1.',0],
    ['Adattamento','Mentre l\'allenatore prepara l\'attacco dalla zona 4 avversaria, i difensori si spostano: chi è in 1 difende la parallela, chi è in 5 la diagonale, il 6 resta in fondo.',1],
    ['Difesa','Il difensore attaccato difende alto verso il centro; gli altri si girano verso la palla.',3]],
  attenzione:['Tutti fermi al momento del colpo.','Ognuno sa quale zona difende prima che arrivi l\'attacco.','Chi non tocca la palla si muove per la seconda palla.'],
  errori:[['Due difensori vanno sulla stessa palla','Chiamate prima: le palle tra due difensori le prende chi le vede arrivare davanti, di solito il difensore centrale.'],['Difensori troppo vicini alla rete','Stai a circa 6-7 metri dalla rete: molte palle attaccate cadono lì.']],
  varianti:{facile:'L\'allenatore dice prima dove attaccherà.', difficile:'L\'allenatore attacca da zona 4 o da zona 2 avversaria.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('d5','D5'), at('d6','D6'), at('d1','D1'), all(), pa()],
    fotogrammi:[F({d5:[2.3,1.7], d6:[1.4,4.5], d1:[2.3,7.3], all:[10.6,7.3], pa:[10.4,7.0]},null,0.7), F({d5:[2.6,2.1], d6:[1.2,3.9], d1:[3.0,7.9], pa:[10.45,7.1]},0.9,0.4,1.2), F({pa:[2.8,2.35]},0.6,0.1,0.4), F({pa:[7.4,5.0]},1.3,1.0,3.0)]}});

E({id:'dif-palla-corta', titolo:'Recupero della palla corta', obiettivo:'Tecnica', ambito:'Difesa',
  descrizione:'Il difensore parte da 6 metri dalla rete; l\'allenatore lascia cadere una palla corta dietro la linea dei 3 metri e lui scatta a giocarla.',
  serveA:'I pallonetti cadono quasi sempre nella zona tra la rete e la difesa: bisogna leggerli presto.',
  lavora:{fondamentali:['Difesa'], muscoli:['quadricipiti','polpacci']}, difficolta:3, giocatori:[2,4], durata:10,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['pallonetto','reattività'],
  passi:[
    ['Posizione arretrata','D in difesa a circa 6 metri dalla rete.',0],
    ['Scatto','L\'allenatore lascia cadere una palla corta dietro la linea dei 3 metri: D scatta avanti con passi corti e veloci.',1],
    ['Gioco della palla','Arriva sotto la palla piegando le gambe; bagher alto verso il centro. Se arrivi in tempo, meglio un palleggio.',2]],
  attenzione:['Il primo passo è subito in avanti, appena vedi la palla rallentare.','Arriva in basso con le gambe, senza tuffarti.','Per gli adulti: niente tuffi in allenamento finché la caduta non è controllata.'],
  errori:[['Si arriva con le braccia tese ma lontani dalla palla','Più passi e più corti: devi arrivare sotto la palla, non allungarti.'],['La palla va contro la rete','Piano delle braccia rivolto verso l\'alto e un passo d\'arresto prima del colpo.']],
  varianti:{facile:'L\'allenatore dice «corta» prima di lanciare.', difficile:'Palle corte e lunghe alternate a sorpresa.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('d','D'), all(), pa()],
    fotogrammi:[F({d:[2.6,4.5], all:[10.6,4.5], pa:[10.4,4.3]},null,0.8), F({d:[5.6,4.1], pa:[6.0,4.0]},1.0,0.1,1.8), F({pa:[7.8,5.4]},1.0,1.0,2.4)]}});

E({id:'dif-reazione-coppie', titolo:'Difesa di reazione a coppie', obiettivo:'Tecnica', ambito:'Difesa',
  descrizione:'A coppie a 4-5 metri: uno si lancia la palla e attacca con un colpo controllato, l\'altro difende la palla verso di lui.',
  serveA:'Riflessi, posizione bassa e controllo: ottimo anche a fine riscaldamento.',
  lavora:{fondamentali:['Difesa','Attacco'], muscoli:['quadricipiti','spalle']}, difficolta:2, giocatori:[2,2], durata:8,
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-riscaldamento'], tags:['coppie','riflessi'],
  passi:[
    ['Autoalzata','A si lancia la palla e attacca con un colpo controllato verso D.',1],
    ['Difesa','D difende la palla verso A, alta.',3],
    ['Ripeti','A blocca la palla e ricomincia. Dopo 10 colpi si cambia.',3]],
  attenzione:['Attacco controllato, non al massimo: lo scopo è la difesa.','D resta basso e reattivo, con il peso sugli avampiedi.','Difesa sempre alta.'],
  errori:[['Il difensore indietreggia al colpo','Peso in avanti sugli avampiedi: vai incontro alla palla.'],['Le braccia salgono sopra le spalle','Sulle palle alte usa le mani sopra la testa o spostati di lato.']],
  varianti:{facile:'Lancio a due mani invece dell\'attacco.', difficile:'Attacco a destra e a sinistra del difensore.'},
  anim:{tipo:'campo', vista:'meta', elementi:[at('a','A'), at('d','D'), pa()],
    fotogrammi:[F({a:[6.4,4.5], d:[2.4,4.5], pa:[6.1,4.3]},null,0.4), F({pa:[6.15,4.25]},0.7,0.1,1.6), F({pa:[2.7,4.35]},0.45,0.1,0.3), F({pa:[6.1,4.3]},1.2,0.6,2.4)]}});

/* =================================================================== GIOCO E TATTICA */
E({id:'tat-cambio-palla', titolo:'Cambio palla senza libero', obiettivo:'Tattica', ambito:'Cambio palla',
  descrizione:'Sei giocatori in formazione di ricezione senza libero: battuta avversaria, ricezione, alzata in zona 4 e attacco. Si ripete in tutte le rotazioni.',
  serveA:'Chi gioca senza libero deve allenare chi riceve davvero: le due schiacciatrici e il centrale di seconda linea.',
  lavora:{fondamentali:['Ricezione','Palleggio','Attacco'], muscoli:[]}, difficolta:3, giocatori:[7,12], durata:20,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['senza libero','rotazioni','ricezione a tre'],
  passi:[
    ['Formazione di ricezione','Ricevono S1, C2 (il centrale di seconda linea) e S2. Il palleggiatore P, in zona 1, è nascosto dietro; O e C1 a rete non ricevono.',0],
    ['Battuta e penetrazione','Al colpo della battuta P corre a rete tra le zone 2 e 3.',1],
    ['Ricezione','La ricezione va verso P.',2],
    ['Alzata e attacco','S1, dopo aver ricevuto, arretra per prendere la rincorsa; P alza in zona 4 e S1 attacca.',4]],
  attenzione:['Senza libero il centrale di seconda linea riceve: allenatelo anche alla ricezione.','Chi non riceve si gira verso la palla.','Gli attaccanti escono subito dalla ricezione per prendere la rincorsa.'],
  errori:[['Il palleggiatore arriva tardi a rete','Parte quando l\'avversario colpisce la battuta, non quando la palla passa la rete.'],['Chi ha ricevuto non attacca','Dopo la ricezione arretra subito di 2-3 passi, anche fuori dal campo, per avere la rincorsa.'],['Le schiacciatrici si sovrappongono','Spazi uguali: ognuna copre un terzo del campo in larghezza.']],
  varianti:{facile:'Battuta dal basso o lanciata, e alzata sempre in zona 4.', difficile:'Il palleggiatore sceglie tra zona 4, primo tempo del centrale e zona 2.'},
  note:'Pensato per squadre che giocano senza libero. Ripetete in tutte e sei le rotazioni: cambiano chi riceve e da dove parte il palleggiatore.',
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('p','P'), at('s1','S1'), at('c1','C1'), at('o','O'), at('s2','S2'), at('c2','C2'), av('b','B'), pa()],
    fotogrammi:[F({p:[1.3,8.1], s1:[5.4,1.5], c1:[8.4,3.8], o:[8.3,8.3], s2:[2.3,2.1], c2:[2.2,5.1], b:[19.3,2.6], pa:[19.05,3.0]},null,0.8),
      F({p:[8.4,6.0], c2:[2.4,4.4], pa:[2.6,4.35]},1.7,0.2,2.6), F({pa:[8.2,5.7], s1:[4.6,0.9]},1.3,0.2,2.2), F({pa:[8.0,1.6], s1:[7.3,1.5]},1.4,0.1,3.2), F({pa:[15.5,6.4]},0.5,1.0,0.5)]}});

E({id:'tat-3contro3', titolo:'3 contro 3 a metà campo', obiettivo:'Tattica', ambito:'Gioco',
  descrizione:'Partita a tre su mezzo campo, tagliato per lungo con i coni. Ogni azione deve avere i tre tocchi.',
  serveA:'Tanti tocchi a testa e tanta comunicazione: si costruisce il gioco a tre tocchi.',
  lavora:{fondamentali:['Ricezione','Palleggio','Attacco','Difesa'], muscoli:[]}, difficolta:2, giocatori:[6,6], durata:15,
  materiale:['Palloni','Coni'], pacchetti:['pk-gioco'], tags:['partitella','tre tocchi','comunicazione'],
  passi:[
    ['Campo','Metà campo per lungo, delimitato dai coni. Tre giocatori per squadra: due dietro e uno a rete che alza.',0],
    ['Tre tocchi','Ogni azione con tre tocchi: ricezione, alzata, attacco.',2],
    ['Punto','Si gioca a 15 punti; chi perde il punto rimette con un lancio.',3]],
  attenzione:['Sempre tre tocchi: è un esercizio per costruire il gioco.','Chi non tocca la palla si muove per aiutare.','Parlate: «mia», «tua», «palla libera».'],
  errori:[['Si rimanda dall\'altra parte al primo tocco','Regola: il punto vale doppio se arriva con tre tocchi.'],['Tutti vanno sulla palla','Ognuno ha la sua zona: due dietro e uno avanti che alza.']],
  varianti:{facile:'Il primo tocco si può bloccare e rilanciare.', difficile:'2 contro 2 sullo stesso campo, oppure campo più lungo.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('a1','A1'), at('a2','A2'), at('a3','A3'), av('b1','B1'), av('b2','B2'), av('b3','B3'), co('k1'), co('k2'), co('k3'), co('k4'), pa()],
    fotogrammi:[F({a1:[2.4,1.2], a2:[2.4,3.3], a3:[7.6,2.3], b1:[15.6,1.2], b2:[15.6,3.3], b3:[10.4,2.3], k1:[2,4.6], k2:[6,4.6], k3:[12,4.6], k4:[16,4.6], pa:[15.35,3.05]},null,0.6),
      F({pa:[2.7,3.15]},1.5,0.2,2.6), F({pa:[7.35,2.15]},1.1,0.2,2.0), F({pa:[14.4,2.4], b1:[14.6,2.1]},0.6,1.0,0.7)]}});

E({id:'tat-palla-libera', titolo:'Palla libera: dalla rete al contrattacco', obiettivo:'Tattica', ambito:'Difesa e contrattacco',
  descrizione:'La squadra è a rete e in difesa. Alla chiamata «libera» i giocatori di prima linea arretrano, la palla facile viene ricevuta e si contrattacca.',
  serveA:'Trasforma le palle regalate dall\'avversario in punti: servono movimenti automatici.',
  lavora:{fondamentali:['Ricezione','Palleggio','Attacco'], muscoli:[]}, difficolta:3, giocatori:[5,8], durata:15,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['transizione','free ball'],
  passi:[
    ['A rete','Tutti nelle posizioni di muro e di difesa.',0],
    ['«Libera!»','Quando l\'avversario manda una palla facile, chi è a rete arretra alla linea dei 3 metri; il palleggiatore va al suo posto.',1],
    ['Ricezione','Riceve chi è dietro e indirizza verso P.',3],
    ['Contrattacco','P alza e chi ha arretrato attacca.',5]],
  attenzione:['Chiamate «libera» ad alta voce: tutti devono sentirlo.','Il palleggiatore non tocca la prima palla.','Chi riceve manda la palla alta: P deve avere tempo.'],
  errori:[['Gli attaccanti restano a rete e non hanno rincorsa','Alla chiamata «libera» arretrate subito alla linea dei 3 metri.'],['Il palleggiatore riceve la palla libera','Il palleggiatore chiama «via» e corre al suo posto; la palla la prende un compagno.']],
  varianti:{facile:'L\'allenatore lancia sempre al centro.', difficile:'L\'allenatore alterna palle libere e attacchi veri.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('s','S'), at('c','C'), at('p','P'), at('d5','D5'), at('d6','D6'), all(), pa()],
    fotogrammi:[F({s:[8.5,1.5], c:[8.5,4.2], p:[8.5,7.2], d5:[2.3,1.9], d6:[1.6,4.6], all:[11.2,4.5], pa:[11.0,4.25]},null,0.8),
      F({s:[5.3,1.0], c:[5.7,4.0], p:[8.4,6.0]},1.0,0.3), F({pa:[1.9,4.45], d6:[1.8,4.6]},1.4,0.1,2.6), F({pa:[8.2,5.7]},1.2,0.2,2.4), F({pa:[8.0,1.6], s:[7.3,1.5]},1.4,0.1,3.2), F({pa:[15.4,6.6]},0.5,1.0,0.5)]}});

E({id:'tat-copertura', titolo:'Copertura dell\'attacco', obiettivo:'Tattica', ambito:'Copertura',
  descrizione:'Mentre l\'attaccante di zona 4 attacca, i compagni si avvicinano formando una «coppa» per recuperare la palla che torna dal muro.',
  serveA:'Una palla murata recuperata vale un secondo attacco: senza copertura è un punto regalato.',
  lavora:{fondamentali:['Difesa','Attacco'], muscoli:['quadricipiti']}, difficolta:3, giocatori:[6,8], durata:12,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['coppa','muro avversario'],
  passi:[
    ['Alzata in zona 4','Mentre P alza, i compagni si avvicinano all\'attaccante S.',1],
    ['La coppa','Tre giocatori vicini, a 2-3 metri attorno all\'attaccante, bassi e con le braccia pronte; gli altri due più indietro.',1],
    ['Palla murata','Se la palla torna dal muro, chi è più vicino la difende alta.',3],
    ['Si ricostruisce','La palla coperta va verso P per un nuovo attacco.',4]],
  attenzione:['Bassi, quasi in ginocchio: la palla murata cade vicino e veloce.','Guardate le mani del muro, non l\'attaccante.','Anche chi alza partecipa alla copertura.'],
  errori:[['Tutti guardano l\'attacco in piedi','Durante l\'alzata scendete in posizione bassa vicino all\'attaccante.'],['Copertura troppo lontana','La prima linea di copertura sta a 2-3 metri dall\'attaccante, non a 5.']],
  varianti:{facile:'L\'allenatore, dall\'altra parte, rimanda la palla con le mani simulando il muro.', difficile:'Il muro avversario è vero, con uno o due giocatori.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('s','S'), at('p','P'), at('c','C'), at('d5','D5'), at('d6','D6'), at('d1','D1'), av('m','M'), pa()],
    fotogrammi:[F({s:[5.2,1.0], p:[8.4,6.0], c:[8.4,4.0], d5:[2.3,1.9], d6:[1.6,4.6], d1:[2.3,7.3], m:[9.7,1.7], pa:[8.15,5.75]},null,0.7),
      F({s:[7.3,1.5], pa:[8.0,1.6], c:[6.6,2.6], d5:[5.5,1.2], d6:[4.4,3.2], p:[7.1,4.1], d1:[3.2,5.6]},1.4,0.2,3.2), F({pa:[9.15,1.75]},0.3,0.0,0.2), F({pa:[6.4,2.35]},0.7,0.2,1.2), F({pa:[8.2,5.6]},1.2,1.0,2.4)]}});

E({id:'tat-difesa-contrattacco', titolo:'Difesa e contrattacco', obiettivo:'Tattica', ambito:'Difesa e contrattacco',
  descrizione:'L\'allenatore attacca dalla zona 4 avversaria; la squadra difende, il palleggiatore alza e l\'attaccante che era a muro contrattacca.',
  serveA:'Collega difesa, alzata e attacco: la sequenza che decide i punti lunghi.',
  lavora:{fondamentali:['Difesa','Palleggio','Attacco'], muscoli:[]}, difficolta:4, giocatori:[6,9], durata:15,
  materiale:['Palloni'], materialeNote:'un rialzo per l\'allenatore', pacchetti:['pk-gioco'], tags:['transizione','contrattacco'],
  passi:[
    ['Posizioni','P e S a rete, tre difensori in seconda linea. L\'allenatore prepara l\'attacco dalla zona 4 avversaria.',0],
    ['Difesa','S lascia la rete per avere la rincorsa, P si prepara ad alzare; il difensore in zona 1 difende la parallela verso il centro.',2],
    ['Alzata','P alza in zona 4.',3],
    ['Contrattacco','S attacca.',4]],
  attenzione:['Chi non può murare si allontana dalla rete prima dell\'attacco avversario.','La difesa va alta e verso il centro: P deve avere il tempo di arrivare.','L\'attaccante si prepara alla rincorsa mentre la palla è ancora in difesa.'],
  errori:[['Il contrattacco arriva senza rincorsa','L\'attaccante si apre fuori dalla linea dei 3 metri appena capisce che non mura.'],['La difesa è precisa ma bassa','Più alta: meglio una difesa alta al centro che una bassa perfetta.']],
  varianti:{facile:'L\'allenatore lancia invece di attaccare.', difficile:'L\'allenatore attacca da zone diverse; si gioca il punto fino alla fine.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('s','S'), at('p','P'), at('d5','D5'), at('d6','D6'), at('d1','D1'), all(), pa()],
    fotogrammi:[F({s:[8.5,1.5], p:[8.5,7.2], d5:[2.4,1.9], d6:[1.4,4.5], d1:[2.4,7.3], all:[10.8,7.2], pa:[10.6,6.95]},null,0.7),
      F({s:[5.4,1.1], p:[8.3,6.0], d1:[2.8,7.6]},1.0,0.2), F({pa:[2.95,7.35]},0.6,0.1,0.4), F({pa:[8.15,5.7]},1.3,0.2,2.6), F({pa:[8.0,1.6], s:[7.3,1.5]},1.4,0.1,3.2), F({pa:[15.6,4.0]},0.5,1.0,0.5)]}});

/* riscaldamento con palla (preparazione fisica) */
E({id:'risc-coppie-palla', titolo:'Riscaldamento a coppie con la palla', obiettivo:'Fisico', ambito:'Riscaldamento e mobilità',
  descrizione:'A coppie: palleggi, bagher, poi attacco e difesa controllati, allungando a poco a poco la distanza.',
  serveA:'Scalda spalle, braccia e gambe con i gesti della pallavolo, prima dei colpi forti.',
  lavora:{fondamentali:['Palleggio','Ricezione','Attacco','Difesa'], muscoli:['spalle','quadricipiti']}, difficolta:1, giocatori:[2,2], durata:10,
  materiale:['Palloni'], pacchetti:['pk-riscaldamento'], tags:['coppie','attivazione'],
  passi:[
    ['Palleggi','2 minuti di palleggi alti, a 3-4 metri.',1],
    ['Bagher','2 minuti di bagher, sempre più distanti.',2],
    ['Attacco e difesa','3 minuti: uno attacca piano da fermo, l\'altro difende; poi si cambia.',4]],
  attenzione:['Si parte piano: i primi minuti servono a scaldare, non a sfidarsi.','Si aumenta la distanza solo quando la palla è controllata.','Spalle e braccia prima dei colpi forti.'],
  errori:[['Si attacca subito forte','Prima palleggi e bagher; gli attacchi arrivano dopo 5 minuti.'],['Palla persa di continuo','Accorciate la distanza.']],
  varianti:{facile:'Solo palleggi e bagher.', difficile:'Dopo ogni tocco ci si siede a terra e ci si rialza.'},
  anim:{tipo:'campo', vista:'meta', elementi:[at('a','A'), at('b','B'), pa()],
    fotogrammi:[F({a:[2.4,4.5], b:[6.4,4.5], pa:[2.7,4.3]},null,0.3), F({pa:[6.1,4.3]},1.1,0.2,2.4), F({pa:[2.7,4.3]},1.1,0.2,2.0), F({pa:[2.75,4.25]},0.6,0.1,1.4), F({pa:[6.1,4.35]},0.5,0.1,0.3), F({pa:[2.7,4.3]},1.1,0.4,2.2)]}});

/* =================================================================== FISICO · RISCALDAMENTO E MOBILITÀ */
E({id:'mob-corsa-calciata', titolo:'Corsa calciata e skip sul posto', obiettivo:'Fisico', ambito:'Riscaldamento e mobilità',
  descrizione:'30 secondi di corsa calciata e 30 secondi di skip con le ginocchia alte, sul posto o avanzando piano.',
  serveA:'Alza la temperatura dei muscoli delle gambe e attiva caviglie e polpacci prima dei salti.',
  lavora:{fondamentali:[], muscoli:['femorali','quadricipiti','polpacci']}, difficolta:1, giocatori:[1,1], durata:3,
  dose:{serie:2, tempo:30, recupero:30}, materiale:['Corpo libero'], pacchetti:['pk-riscaldamento'], tags:['attivazione','corsa'],
  passi:[
    ['Corsa calciata','I talloni salgono verso i glutei, le braccia accompagnano il movimento.',0],
    ['Ritmo','Appoggio sugli avampiedi, passi rapidi e leggeri, per 30 secondi.',1],
    ['Skip','Poi ginocchia alte all\'altezza del bacino, busto dritto, per altri 30 secondi.',4]],
  attenzione:['Appoggio sugli avampiedi, mai sul tallone.','Busto dritto, non piegato in avanti.','Inizia piano e aumenta il ritmo.'],
  errori:[['Il busto va in avanti','Guarda avanti e tieni le spalle sopra il bacino.'],['Si atterra pesanti sul tallone','Passi più corti e più rapidi, appoggio leggero sull\'avampiede.']],
  varianti:{facile:'Camminata veloce con le ginocchia alte.', difficile:'Avanzando per tutta la lunghezza del campo.'},
  anim:corpo('lato', [['calciata',null,0.05],['calciata_b',0.35,0.05],['calciata',0.35,0.05],['calciata_b',0.35,0.05],['ginocchio_alto',0.4,0.05],['ginocchio_alto_b',0.35,0.05],['ginocchio_alto',0.35,0.05],['ginocchio_alto_b',0.35,0.1]], {ancora:'hip'})});

E({id:'mob-circonduzioni', titolo:'Circonduzioni delle braccia', obiettivo:'Fisico', ambito:'Riscaldamento e mobilità',
  descrizione:'Grandi cerchi con le braccia tese, lenti e ampi: 10 in avanti e 10 all\'indietro.',
  serveA:'Prepara la spalla ai movimenti ampi di battuta e attacco.',
  lavora:{fondamentali:[], muscoli:['spalle','cuffia']}, difficolta:1, giocatori:[1,1], durata:2,
  dose:{serie:2, ripetizioni:10}, materiale:['Corpo libero'], pacchetti:['pk-riscaldamento','pk-recupero'], tags:['spalle','mobilità'],
  passi:[
    ['Partenza','In piedi, piedi alla larghezza delle spalle, braccia lungo i fianchi.',0],
    ['Cerchio','Con le braccia tese disegna grandi cerchi: di lato, in alto e di nuovo giù.',2],
    ['Cambio di verso','10 cerchi in avanti e 10 all\'indietro, lenti e ampi.',3]],
  attenzione:['Movimento lento e ampio, senza strappi.','Spalle basse, lontane dalle orecchie.','Se un punto fa male, riduci l\'ampiezza.'],
  errori:[['Si inarca la schiena quando le braccia salgono','Contrai leggermente gli addominali e tieni il bacino fermo.'],['Il movimento è piccolo e veloce','Rallenta: un cerchio ogni 2-3 secondi.']],
  varianti:{facile:'Un braccio alla volta.', difficile:'Con un elastico leggero teso tra le mani.'},
  anim:corpo('fronte', [['f_in_piedi',null,0.2],['f_braccia_largo',0.9,0],['f_braccia_alto',0.9,0.1],['f_braccia_largo',0.9,0]], {})});

E({id:'mob-flessori-anca', titolo:'Allungamento dei flessori dell\'anca', obiettivo:'Fisico', ambito:'Riscaldamento e mobilità',
  descrizione:'Con un ginocchio a terra si porta il bacino in avanti per allungare la parte davanti della coscia della gamba dietro.',
  serveA:'Chi sta molto seduto ha i flessori dell\'anca corti: allungarli aiuta la schiena e la rincorsa.',
  lavora:{fondamentali:[], muscoli:['flessori','quadricipiti']}, difficolta:1, giocatori:[1,1], durata:3,
  dose:{serie:2, tempo:30, lato:true}, materiale:['Tappetino'], pacchetti:['pk-riscaldamento','pk-casa','pk-recupero'], tags:['allungamento','stretching','schiena'],
  passi:[
    ['Posizione','Ginocchio dietro appoggiato sul tappetino, piede avanti a terra con il ginocchio sopra la caviglia.',0],
    ['Allungamento','Porta il bacino avanti senza inarcare la schiena: senti tirare davanti alla coscia della gamba dietro. Tieni 30 secondi.',1],
    ['Cambio','Ripeti con l\'altra gamba.',1]],
  attenzione:['Contrai il gluteo della gamba dietro: aumenta l\'allungamento e protegge la schiena.','Busto dritto, senza inclinarti all\'indietro.','Allungamento piacevole, mai doloroso.'],
  errori:[['Si inarca la zona lombare','Porta l\'ombelico verso la colonna e il bacino «in dentro»: il movimento è piccolo.'],['Il ginocchio avanti supera la punta del piede','Allunga il passo: il ginocchio davanti resta sopra la caviglia.']],
  varianti:{facile:'Mani appoggiate sul ginocchio davanti.', difficile:'Braccio dello stesso lato della gamba dietro alzato sopra la testa.'},
  anim:corpo('lato', [['inginocchiato_affondo',null,0.6],['inginocchiato_affondo',1.4,2.0,{x:106, t:-10, lN:[-34,56,-180], lF:[72,80,0]}]], {ancora:'knN', attrezzi:[{tipo:'tappetino', x:40, w:130}]})});

E({id:'mob-slanci-gamba', titolo:'Slanci della gamba avanti e indietro', obiettivo:'Fisico', ambito:'Riscaldamento e mobilità',
  descrizione:'Con le mani appoggiate al muro, la gamba tesa oscilla avanti e indietro come un pendolo.',
  serveA:'Scioglie l\'anca e allunga in modo dinamico femorali e flessori prima della corsa e dei salti.',
  lavora:{fondamentali:[], muscoli:['femorali','flessori','glutei']}, difficolta:1, giocatori:[1,1], durata:3,
  dose:{serie:2, ripetizioni:10, lato:true}, materiale:['Muro o spalliera'], pacchetti:['pk-riscaldamento'], tags:['mobilità anca','dinamico'],
  passi:[
    ['Appoggio','In piedi davanti al muro, mani appoggiate per l\'equilibrio.',0],
    ['Avanti','Slancia la gamba tesa in avanti, fin dove arriva senza piegare la schiena.',1],
    ['Indietro','Lasciala tornare indietro oltre la verticale. 10 slanci, poi cambia gamba.',2]],
  attenzione:['Movimento ampio ma controllato, come un pendolo.','Busto fermo e dritto.','Aumenta l\'ampiezza a poco a poco.'],
  errori:[['Il busto si piega per alzare di più la gamba','Riduci l\'ampiezza: conta l\'anca che si muove, non l\'altezza del piede.'],['Si perde l\'equilibrio','Appoggia bene le mani al muro e tieni il ginocchio della gamba d\'appoggio appena sbloccato.']],
  varianti:{facile:'Ampiezza ridotta, ginocchio leggermente piegato.', difficile:'Slanci laterali, davanti al corpo.'},
  anim:corpo('lato', [['braccia_avanti',null,0.2,{x:96}],['swing_avanti',0.7,0.05],['swing_indietro',0.8,0.05]], {ancora:'anF', attrezzi:[{tipo:'muro', x:160}]})});

/* =================================================================== FISICO · GAMBE */
E({id:'gam-squat-elastico', titolo:'Squat con elastico sopra le ginocchia', obiettivo:'Fisico', ambito:'Gambe',
  descrizione:'Squat a corpo libero con un elastico ad anello appena sopra le ginocchia, che obbliga a tenerle in fuori.',
  serveA:'Spinta nel salto a muro e in attacco; l\'elastico allena la stabilità del ginocchio.',
  lavora:{fondamentali:[], muscoli:['quadricipiti','glutei']}, difficolta:2, giocatori:[1,1], durata:6,
  dose:{serie:3, ripetizioni:12, recupero:60}, materiale:['Elastico'], materialeNote:'elastico ad anello leggero o medio', pacchetti:['pk-over45','pk-casa'], tags:['squat','ginocchio','forza'],
  passi:[
    ['Posizione','Piedi alla larghezza delle spalle, elastico appena sopra le ginocchia.',0],
    ['Scendi','Spingi il bacino indietro come per sederti, braccia in avanti.',1],
    ['Risali','Spingi sui talloni e torna in piedi senza bloccare le ginocchia.',2]],
  attenzione:['Ginocchia in linea con le punte dei piedi, spinte contro l\'elastico.','Peso sui talloni, petto alto, schiena neutra.','Scendi solo fin dove controlli il movimento.'],
  errori:[['Le ginocchia cadono verso l\'interno','Allarga un poco i piedi e spingi le ginocchia verso l\'esterno, contro l\'elastico.'],['I talloni si staccano da terra','Porta il bacino più indietro e riduci la profondità.'],['La schiena si arrotonda in basso','Scendi meno e tieni il petto alto, sguardo avanti.']],
  varianti:{facile:'Mezzo squat, oppure sedersi su una sedia e rialzarsi.', difficile:'Fermati 3 secondi in basso, oppure usa un elastico più duro.'},
  anim:corpo('lato', [['in_piedi',null,0.5],['squat',1.3,0.5],['in_piedi',1.2,0.4]], {ancora:'anN', attrezzi:[{tipo:'elastico', da:'knN', a:'knF', sopra:true}]})});

E({id:'gam-affondi-indietro', titolo:'Affondi indietro alternati', obiettivo:'Fisico', ambito:'Gambe',
  descrizione:'Un passo indietro, si scende con il ginocchio dietro verso terra e si torna su spingendo sulla gamba davanti. Poi si cambia gamba.',
  serveA:'Forza di una gamba alla volta, come negli spostamenti e negli stacchi. Il passo indietro è più gentile con il ginocchio di quello in avanti.',
  lavora:{fondamentali:[], muscoli:['quadricipiti','glutei']}, difficolta:2, giocatori:[1,1], durata:6,
  dose:{serie:3, ripetizioni:8, recupero:60, lato:true}, materiale:['Corpo libero'], pacchetti:['pk-over45','pk-casa'], tags:['affondo','una gamba'],
  passi:[
    ['Posizione','In piedi, mani sui fianchi, piedi alla larghezza delle anche.',0],
    ['Passo indietro e giù','Fai un passo lungo indietro e scendi finché il ginocchio dietro sfiora il pavimento.',1],
    ['Risali','Spingi sul tallone della gamba davanti e riporta il piede accanto all\'altro. Poi cambia gamba.',2]],
  attenzione:['Il ginocchio davanti resta sopra la caviglia, in linea con il piede.','Busto dritto, peso sul tallone della gamba davanti.','Il ginocchio dietro scende verso terra senza sbatterlo.'],
  errori:[['Il ginocchio davanti va verso l\'interno','Spingi il ginocchio in fuori, verso il mignolo del piede.'],['Si perde l\'equilibrio di lato','Fai il passo indietro su un binario largo come le anche, non sulla stessa linea.']],
  varianti:{facile:'Una mano appoggiata al muro o a una sedia; scendi meno.', difficile:'Affondi in avanti camminando, con una palla tenuta sopra la testa.'},
  anim:corpo('lato', [['mani_fianchi',null,0.4],['affondo_giu',1.3,0.5],['mani_fianchi',1.2,0.3]], {ancora:'anN'})});

E({id:'gam-ponte', titolo:'Ponte per i glutei', obiettivo:'Fisico', ambito:'Gambe',
  descrizione:'Da supini, con le ginocchia piegate, si solleva il bacino fino a formare una linea dritta da spalle a ginocchia.',
  serveA:'Glutei forti proteggono la schiena e le ginocchia e danno potenza al salto.',
  lavora:{fondamentali:[], muscoli:['glutei','femorali']}, difficolta:1, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:12, recupero:45}, materiale:['Tappetino'], pacchetti:['pk-over45','pk-casa','pk-recupero'], tags:['glutei','schiena'],
  passi:[
    ['A terra','Supino, ginocchia piegate, piedi a terra alla larghezza delle anche, braccia lungo i fianchi.',0],
    ['Sali','Spingi sui talloni e solleva il bacino finché spalle, anche e ginocchia sono in linea. Tieni 2 secondi stringendo i glutei.',1],
    ['Scendi','Scendi piano, appoggiando prima la parte alta della schiena e poi il bacino.',2]],
  attenzione:['Spingi con i talloni, non con le punte.','In alto non inarcare la schiena: la linea è dritta dalle spalle alle ginocchia.','Glutei stretti per tutta la salita.'],
  errori:[['Si sente lavorare la schiena più dei glutei','Sali un po\' meno e stringi forte i glutei; porta l\'ombelico verso la colonna.'],['Le ginocchia si aprono o si chiudono','Tieni una palla o un cuscino tra le ginocchia.']],
  varianti:{facile:'Tieni il bacino su per un solo secondo.', difficile:'Ponte su una gamba, con l\'altra tesa.'},
  anim:Object.assign(corpo('lato', [['ponte_giu',null,0.4],['ponte_su',1.2,1.6],['ponte_giu',1.3,0.2]], {ancora:'anN', attrezzi:[{tipo:'tappetino', x:20, w:150}]}), {}) });
ES[ES.length-1].anim.fotogrammi[0].ritorno=0.05;

E({id:'gam-passi-laterali', titolo:'Passi laterali con elastico', obiettivo:'Fisico', ambito:'Gambe',
  descrizione:'Con un elastico intorno alle caviglie, in posizione di mezzo squat, si fanno passi laterali senza far allentare l\'elastico.',
  serveA:'Rinforza il medio gluteo, che tiene in linea il ginocchio negli atterraggi e negli spostamenti laterali.',
  lavora:{fondamentali:['Difesa','Muro'], muscoli:['glutei','quadricipiti']}, difficolta:1, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:10, recupero:45, lato:true}, materiale:['Elastico'], materialeNote:'elastico ad anello', pacchetti:['pk-over45','pk-casa','pk-recupero'], tags:['medio gluteo','ginocchio','monster walk'],
  passi:[
    ['Posizione','Elastico intorno alle caviglie, piedi alla larghezza delle anche, ginocchia piegate, busto un po\' in avanti.',0],
    ['Passo','Passo laterale con un piede: l\'elastico si tende.',1],
    ['Chiudi','L\'altro piede segue senza allentare del tutto l\'elastico. 10 passi a destra, 10 a sinistra.',2]],
  attenzione:['Resta basso per tutto l\'esercizio: il bacino non sale e non scende.','Le punte dei piedi guardano avanti.','L\'elastico non si allenta mai del tutto.'],
  errori:[['Le ginocchia si chiudono verso l\'interno','Spingi le ginocchia verso l\'esterno, contro l\'elastico.'],['Il busto ondeggia a ogni passo','Passi più corti e addome attivo: si muovono solo le gambe.']],
  varianti:{facile:'Elastico sopra le ginocchia, più leggero.', difficile:'Elastico più duro, oppure passi in diagonale avanti e indietro.'},
  anim:corpo('fronte', [['f_semisquat_stretto',null,0.3,{x:86}],['f_semisquat',0.6,0.25,{x:96}],['f_semisquat_stretto',0.6,0.25,{x:106}],['f_semisquat',0.6,0.25,{x:96}]], {attrezzi:[{tipo:'elastico', da:'anN', a:'anF', sopra:true}]})});

E({id:'gam-polpacci', titolo:'Sollevamenti sui polpacci', obiettivo:'Fisico', ambito:'Gambe',
  descrizione:'In piedi, si sale lentamente sulle punte e si torna giù, controllando la discesa.',
  serveA:'Spinta finale nel salto e protezione della caviglia e del tendine d\'Achille.',
  lavora:{fondamentali:[], muscoli:['polpacci']}, difficolta:1, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:15, recupero:45}, materiale:['Corpo libero'], pacchetti:['pk-over45','pk-casa','pk-recupero'], tags:['caviglia','achille'],
  passi:[
    ['Posizione','In piedi, piedi alla larghezza delle anche; se serve, una mano al muro.',0],
    ['Sali','Sali sulle punte in 2 secondi.',1],
    ['Scendi','Scendi in 2 secondi fino ad appoggiare i talloni.',2]],
  attenzione:['Sali piano in 2 secondi, scendi in 2 secondi.','Peso sull\'alluce e sul secondo dito, caviglie dritte.','Ginocchia tese ma non bloccate.'],
  errori:[['Le caviglie si piegano verso l\'esterno','Spingi sull\'alluce e tieni le caviglie dritte; aiutati con una mano al muro.'],['Il movimento è a scatti','Rallenta: conta 2 secondi in salita e 2 in discesa.']],
  varianti:{facile:'Su due piedi, con le mani al muro.', difficile:'Su un piede solo, oppure sul bordo di un gradino scendendo con i talloni sotto il livello.'},
  anim:corpo('lato', [['in_piedi',null,0.4],['punte',1.0,0.6],['in_piedi',1.0,0.3]], {ancora:'toN'})});

/* =================================================================== FISICO · CORE */
E({id:'core-plank', titolo:'Plank sugli avambracci', obiettivo:'Fisico', ambito:'Core',
  descrizione:'Appoggiati su avambracci e punte dei piedi, si tiene il corpo dritto come una tavola.',
  serveA:'Un tronco stabile trasmette la forza delle gambe alle braccia in attacco e in battuta.',
  lavora:{fondamentali:[], muscoli:['addome','obliqui','spalle']}, difficolta:2, giocatori:[1,1], durata:4,
  dose:{serie:3, tempo:30, recupero:30}, materiale:['Tappetino'], pacchetti:['pk-over45','pk-casa'], tags:['addominali','stabilità'],
  passi:[
    ['Partenza','Avambracci a terra, gomiti sotto le spalle, ginocchia a terra.',0],
    ['Su','Stendi le gambe una alla volta: corpo dritto dalla testa ai talloni. Tieni 20-30 secondi respirando.',1]],
  attenzione:['Bacino in linea: né alto né basso.','Ombelico verso la colonna e glutei leggermente contratti.','Respira normalmente, non trattenere il fiato.'],
  errori:[['Il bacino scende e la schiena si inarca','Contrai i glutei e porta il bacino un po\' in dentro; se non riesci, torna sulle ginocchia.'],['Il bacino è troppo alto','Abbassalo fino a vedere una linea dritta da spalle a talloni: chiedi a un compagno di guardarti.']],
  varianti:{facile:'Plank sulle ginocchia.', difficile:'Solleva un piede alla volta per 2 secondi.'},
  anim:corpo('lato', [['plank_ginocchia',null,0.6],['plank',1.0,3.0]], {ancora:'haN', attrezzi:[{tipo:'tappetino', x:30, w:150}]})});

E({id:'core-dead-bug', titolo:'Dead bug', obiettivo:'Fisico', ambito:'Core',
  descrizione:'Da supini, con braccia e gambe in alto, si allungano lentamente un braccio e la gamba opposta senza staccare la schiena da terra.',
  serveA:'Addominali profondi e controllo del bacino, senza caricare la schiena.',
  lavora:{fondamentali:[], muscoli:['addome','obliqui']}, difficolta:2, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:8, recupero:30, lato:true}, materiale:['Tappetino'], pacchetti:['pk-over45','pk-casa','pk-recupero'], tags:['addominali','schiena'],
  passi:[
    ['Partenza','Supino, braccia tese verso il soffitto, anche e ginocchia piegate a 90 gradi. Zona lombare appoggiata al tappetino.',0],
    ['Braccio e gamba opposti','Allunga lentamente un braccio dietro la testa e la gamba opposta in avanti, vicino al pavimento senza toccarlo.',1],
    ['Ritorno','Torna al centro.',2],
    ['Altro lato','Ripeti con l\'altro braccio e l\'altra gamba.',3]],
  attenzione:['La schiena resta appoggiata a terra per tutto il movimento.','Movimento lento: espira mentre allunghi.','Allunga solo fin dove riesci a tenere la schiena giù.'],
  errori:[['La zona lombare si stacca da terra','Allunga meno la gamba o tienila più alta; spingi la schiena verso il tappetino.'],['Si muovono braccio e gamba dello stesso lato','Braccio destro con gamba sinistra, e viceversa.']],
  varianti:{facile:'Muovi solo le gambe, braccia ferme in alto.', difficile:'Tieni un pallone tra le mani tese.'},
  anim:corpo('lato', [['deadbug_a',null,0.3],['deadbug_b',1.2,0.6],['deadbug_a',1.1,0.3],['deadbug_c',1.2,0.6]], {ancora:'hip', attrezzi:[{tipo:'tappetino', x:10, w:170}]})});

E({id:'core-bird-dog', titolo:'Bird dog (in quadrupedia)', obiettivo:'Fisico', ambito:'Core',
  descrizione:'In quadrupedia si allungano un braccio in avanti e la gamba opposta indietro, tenendo la schiena piatta.',
  serveA:'Stabilità della schiena e dei glutei: un classico per prevenire il mal di schiena.',
  lavora:{fondamentali:[], muscoli:['lombari','glutei','addome']}, difficolta:1, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:8, recupero:30, lato:true}, materiale:['Tappetino'], pacchetti:['pk-over45','pk-casa','pk-recupero'], tags:['schiena','equilibrio'],
  passi:[
    ['Quadrupedia','Mani sotto le spalle, ginocchia sotto le anche, schiena piatta.',0],
    ['Allunga','Allunga un braccio in avanti e la gamba opposta indietro, fino all\'orizzontale. Tieni 2 secondi.',1],
    ['Torna','Torna in quadrupedia.',2],
    ['Altro lato','Cambia braccio e gamba.',3]],
  attenzione:['Schiena piatta come un tavolo: potresti tenerci sopra un bicchiere.','Allunga braccio e gamba, senza alzarli troppo.','Il bacino resta fermo, non ruota.'],
  errori:[['Il bacino ruota quando si alza la gamba','Alza meno la gamba e stringi gli addominali.'],['La testa si alza a guardare avanti','Sguardo verso terra, collo in linea con la schiena.']],
  varianti:{facile:'Solo il braccio o solo la gamba.', difficile:'Tocca gomito e ginocchio sotto il corpo prima di allungare.'},
  anim:corpo('lato', [['quadrupedia',null,0.4],['bird_dog',1.2,1.0],['quadrupedia',1.0,0.3],['bird_dog_b',1.2,1.0]], {ancora:'hip', attrezzi:[{tipo:'tappetino', x:20, w:160}]})});

E({id:'core-plank-laterale', titolo:'Plank laterale', obiettivo:'Fisico', ambito:'Core',
  descrizione:'Sul fianco, appoggiati su un avambraccio, si solleva il bacino fino ad avere il corpo dritto dalla testa ai piedi.',
  serveA:'Obliqui e fianchi forti stabilizzano il tronco negli spostamenti laterali e nella rotazione dell\'attacco.',
  lavora:{fondamentali:[], muscoli:['obliqui','addome','spalle']}, difficolta:3, giocatori:[1,1], durata:4,
  dose:{serie:3, tempo:20, recupero:30, lato:true}, materiale:['Tappetino'], pacchetti:['pk-over45','pk-casa'], tags:['obliqui','fianco'],
  passi:[
    ['Partenza','Sul fianco, gomito sotto la spalla, gambe tese una sopra l\'altra, bacino a terra.',0],
    ['Su','Solleva il bacino finché il corpo è dritto dalla testa ai piedi. Tieni 20 secondi, poi cambia lato.',1]],
  attenzione:['Gomito esattamente sotto la spalla.','Il bacino non cade all\'indietro: il corpo resta su un piano.','Spalla lontana dall\'orecchio.'],
  errori:[['Il bacino scende dopo pochi secondi','Accorcia il tempo o appoggia a terra il ginocchio di sotto.'],['Dolore alla spalla di appoggio','Controlla che il gomito sia sotto la spalla; se il dolore resta, salta l\'esercizio.']],
  varianti:{facile:'Con il ginocchio di sotto appoggiato.', difficile:'Solleva la gamba di sopra.'},
  anim:corpo('fronte', [['f_plank_laterale_giu',null,0.6],['f_plank_laterale_su',1.0,2.4]], {ancora:'elN', attrezzi:[{tipo:'tappetino', x:10, w:180}]})});

E({id:'core-scalatore', titolo:'Scalatore lento', obiettivo:'Fisico', ambito:'Core',
  descrizione:'Da plank a braccia tese si porta un ginocchio verso il petto, lentamente, alternando le gambe.',
  serveA:'Core e spalle insieme, con il controllo del bacino mentre le gambe si muovono.',
  lavora:{fondamentali:[], muscoli:['addome','spalle','flessori']}, difficolta:3, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:10, recupero:45, lato:true}, materiale:['Tappetino'], pacchetti:['pk-over45','pk-casa'], tags:['mountain climber','addominali'],
  passi:[
    ['Plank alto','Mani sotto le spalle, braccia tese, corpo dritto.',0],
    ['Ginocchio al petto','Porta un ginocchio verso il petto senza alzare il bacino.',1],
    ['Torna','Riporta indietro la gamba.',2],
    ['Altra gamba','Ripeti con l\'altra gamba, sempre lentamente.',3]],
  attenzione:['Mani sotto le spalle, braccia tese.','Il bacino resta basso e fermo mentre il ginocchio va al petto.','Lento e controllato: non è una corsa.'],
  errori:[['Il bacino sale a ogni ginocchio','Rallenta e tieni gli addominali contratti.'],['Le spalle vanno oltre le mani','Spingi il pavimento e tieni le spalle sopra i polsi.']],
  varianti:{facile:'Con le mani su una panca o un gradino.', difficile:'Ginocchio verso il gomito opposto.'},
  anim:corpo('lato', [['plank_alto',null,0.3],['scalatore',0.8,0.4],['plank_alto',0.8,0.2],['scalatore_b',0.8,0.4]], {ancora:'haN', attrezzi:[{tipo:'tappetino', x:20, w:160}]})});

/* =================================================================== FISICO · SPALLE E BRACCIA */
E({id:'spa-alzate-elastico', titolo:'Alzate laterali con elastico', obiettivo:'Fisico', ambito:'Spalle e braccia',
  descrizione:'In piedi sull\'elastico, si sollevano le braccia di lato fino all\'altezza delle spalle e si torna giù lentamente.',
  serveA:'Spalle forti e resistenti per battere, alzare e attaccare.',
  lavora:{fondamentali:['Battuta','Attacco'], muscoli:['spalle']}, difficolta:1, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:12, recupero:45}, materiale:['Elastico'], materialeNote:'elastico lungo, leggero', pacchetti:['pk-over45','pk-casa'], tags:['deltoidi','spalla'],
  passi:[
    ['Posizione','In piedi sull\'elastico, piedi alla larghezza delle anche, un capo per mano.',0],
    ['Su','Solleva le braccia di lato, gomiti appena piegati, fino all\'altezza delle spalle.',1],
    ['Giù','Scendi lentamente, frenando l\'elastico.',2]],
  attenzione:['Non andare oltre l\'altezza delle spalle.','Spalle basse, lontane dalle orecchie.','Polsi in linea con l\'avambraccio.'],
  errori:[['Le spalle salgono verso le orecchie','Elastico meno teso; pensa a portare le mani lontano, non in alto.'],['Si dondola con il busto','Ginocchia appena piegate e addome contratto: si muovono solo le braccia.']],
  varianti:{facile:'Senza elastico, oppure un braccio alla volta.', difficile:'Tieni 2 secondi in alto.'},
  anim:corpo('fronte', [['f_alzate_giu',null,0.3],['f_alzate_su',1.1,0.6],['f_alzate_giu',1.4,0.2]], {attrezzi:[{tipo:'elastico', da:'anN', a:'haN'},{tipo:'elastico', da:'anF', a:'haF'}]})});

E({id:'spa-tirate-elastico', titolo:'Tirate con elastico al muro', obiettivo:'Fisico', ambito:'Spalle e braccia',
  descrizione:'L\'elastico è fissato al muro all\'altezza del petto: si tirano i gomiti indietro stringendo le scapole.',
  serveA:'Equilibra la spalla di chi attacca e batte molto: rinforza i muscoli che frenano il braccio dopo il colpo.',
  lavora:{fondamentali:['Attacco','Battuta'], muscoli:['schiena','cuffia','bicipiti']}, difficolta:1, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:12, recupero:45}, materiale:['Elastico','Muro o spalliera'], pacchetti:['pk-over45','pk-casa','pk-recupero'], tags:['rematore','scapole','postura'],
  passi:[
    ['Posizione','Elastico fissato al muro all\'altezza del petto. Indietreggia finché è teso, ginocchia appena piegate.',0],
    ['Tira','Porta i gomiti indietro vicino ai fianchi, stringendo le scapole. Tieni 1 secondo.',1],
    ['Ritorno','Torna avanti lentamente.',2]],
  attenzione:['Prima si muovono le scapole, poi le braccia.','Petto aperto, spalle basse.','Il busto resta fermo.'],
  errori:[['Si tira inclinando il busto all\'indietro','Avvicinati al muro per ridurre la tensione: il busto non si muove.'],['Le spalle salgono verso le orecchie','Pensa a mettere le scapole nelle tasche posteriori dei pantaloni.']],
  varianti:{facile:'Elastico più leggero, più vicino al muro.', difficile:'Un braccio alla volta, tenendo 3 secondi.'},
  anim:corpo('lato', [['rematore_avanti',null,0.3],['rematore_dietro',1.0,0.8],['rematore_avanti',1.2,0.2]], {ancora:'anN', attrezzi:[{tipo:'muro', x:176},{tipo:'elastico', da:'haN', a:[176,62]}]})});

E({id:'spa-piegamenti-ginocchia', titolo:'Piegamenti sulle ginocchia', obiettivo:'Fisico', ambito:'Spalle e braccia',
  descrizione:'Piegamenti sulle braccia con le ginocchia appoggiate a terra e il corpo dritto dalle ginocchia alla testa.',
  serveA:'Forza di petto, braccia e spalle; aiuta anche a stabilizzare la spalla.',
  lavora:{fondamentali:[], muscoli:['petto','tricipiti','spalle']}, difficolta:2, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:10, recupero:60}, materiale:['Tappetino'], pacchetti:['pk-over45','pk-casa'], tags:['flessioni','push up'],
  passi:[
    ['Su','Mani un po\' più larghe delle spalle, ginocchia a terra, corpo dritto dalle ginocchia alla testa.',0],
    ['Giù','Scendi con il petto verso terra, gomiti a circa 45 gradi dal corpo.',1],
    ['Spingi','Spingi il pavimento e torna su.',2]],
  attenzione:['Corpo dritto: il bacino non cade e non sale.','Gomiti né troppo aperti né attaccati al corpo.','Scendi solo fin dove controlli.'],
  errori:[['Il bacino resta indietro e si piega solo il busto','Contrai addome e glutei: il corpo si muove tutto insieme.'],['I gomiti si aprono a 90 gradi','Avvicinali un poco al corpo: proteggi la spalla.']],
  varianti:{facile:'Con le mani appoggiate al muro o a un tavolo.', difficile:'Sulle punte dei piedi, piegamenti completi.'},
  anim:corpo('lato', [['piegamento_su',null,0.3],['piegamento_giu',1.2,0.3],['piegamento_su',1.0,0.3]], {ancora:'haN', attrezzi:[{tipo:'tappetino', x:20, w:160}]})});

E({id:'spa-spinte-alto', titolo:'Spinte sopra la testa con elastico', obiettivo:'Fisico', ambito:'Spalle e braccia',
  descrizione:'In piedi sull\'elastico, mani all\'altezza delle spalle, si spinge verso l\'alto fino a braccia tese.',
  serveA:'Forza del braccio in alto: utile per muro e alzata.',
  lavora:{fondamentali:['Muro','Palleggio'], muscoli:['spalle','tricipiti']}, difficolta:2, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:10, recupero:60}, materiale:['Elastico'], pacchetti:['pk-over45','pk-casa'], tags:['spalle','muro'],
  passi:[
    ['Posizione','In piedi sull\'elastico, mani all\'altezza delle spalle, gomiti avanti.',0],
    ['Spingi','Spingi le mani verso l\'alto fino a braccia tese, vicino alle orecchie.',1],
    ['Scendi','Torna lentamente all\'altezza delle spalle.',2]],
  attenzione:['Addome contratto: la schiena non si inarca.','Spingi dritto sopra la testa, braccia vicino alle orecchie.','Scendi lentamente fino all\'altezza delle spalle.'],
  errori:[['La schiena si inarca quando le braccia salgono','Contrai glutei e addominali; usa un elastico più leggero.'],['Le braccia vanno avanti invece che in alto','Guarda avanti e spingi le mani verso il soffitto, sopra la fronte.']],
  varianti:{facile:'Un braccio alla volta, oppure senza elastico.', difficile:'Da seduti, senza appoggio per la schiena.'},
  anim:corpo('lato', [['spinta_spalle',null,0.3],['spinta_alto',1.0,0.5],['spinta_spalle',1.2,0.2]], {ancora:'anN', attrezzi:[{tipo:'elastico', da:'toN', a:'haN'}]})});

/* =================================================================== FISICO · SALTO E AGILITÀ */
E({id:'sal-atterraggio', titolo:'Salto con atterraggio controllato', obiettivo:'Fisico', ambito:'Salto e agilità',
  descrizione:'Salto verso l\'alto a due piedi e atterraggio morbido, fermandosi in mezzo squat per due secondi.',
  serveA:'Insegna ad atterrare bene dopo muro e attacco: protegge ginocchia e caviglie.',
  lavora:{fondamentali:['Attacco','Muro'], muscoli:['quadricipiti','glutei','polpacci']}, difficolta:3, giocatori:[1,1], durata:6,
  dose:{serie:3, ripetizioni:5, recupero:90}, materiale:['Corpo libero'], pacchetti:['pk-over45'], tags:['atterraggio','pliometria','prevenzione'],
  passi:[
    ['Carica','Piega anche e ginocchia e porta le braccia indietro.',1],
    ['Salto','Spingi con tutte e due le gambe e lancia le braccia in alto.',2],
    ['Atterraggio','Atterra sugli avampiedi e poi su tutto il piede, piegando anche e ginocchia. Fermati 2 secondi.',3],
    ['In piedi','Torna in piedi e riposa qualche secondo prima del salto successivo.',4]],
  attenzione:['Atterra sugli avampiedi e poi su tutto il piede, piegando anche e ginocchia.','Ginocchia in linea con i piedi all\'atterraggio.','Poche ripetizioni di qualità: riposa bene tra le serie.'],
  errori:[['Atterraggio rumoroso e rigido','Piega di più le gambe e ammortizza: l\'atterraggio deve essere silenzioso.'],['Le ginocchia si chiudono all\'atterraggio','Spingi le ginocchia in fuori e rallenta: prova prima con salti più bassi.']],
  varianti:{facile:'Salti piccoli, oppure solo il mezzo squat veloce sulle punte.', difficile:'Atterra e resta fermo 3 secondi su un piede solo (solo senza dolori).'},
  note:'Da fare dopo un buon riscaldamento.',
  anim:corpo('lato', [['in_piedi',null,0.4],['carica_salto',0.7,0.05],['salto',0.35,0.05],['atterraggio',0.35,1.4],['in_piedi',0.9,0.4]], {ancora:'anN'})});

E({id:'sal-muro-posto', titolo:'Salti a muro sul posto', obiettivo:'Fisico', ambito:'Salto e agilità',
  descrizione:'Dalla posizione di muro, piccolo piegamento e salto con le braccia che salgono dritte, poi atterraggio morbido nello stesso punto.',
  serveA:'Il salto a muro si ripete tante volte in partita: va reso efficiente e sicuro.',
  lavora:{fondamentali:['Muro'], muscoli:['quadricipiti','polpacci','spalle']}, difficolta:2, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:6, recupero:60}, materiale:['Corpo libero'], pacchetti:['pk-over45'], tags:['muro','salto'],
  passi:[
    ['Posizione di muro','Piedi alla larghezza delle spalle, mani all\'altezza delle spalle, davanti al corpo.',0],
    ['Piegamento','Piega poco le ginocchia: il muro è un salto veloce, non profondo.',1],
    ['Salto','Spingi e porta le mani dritte in alto, vicine tra loro.',2],
    ['Atterraggio','Atterra morbido nello stesso punto, mani di nuovo alte.',3]],
  attenzione:['Le mani salgono dritte, senza fare un giro dal basso.','Atterra nello stesso punto in cui hai staccato.','Atterraggio morbido, a due piedi.'],
  errori:[['Si salta in avanti','Stacca verso l\'alto: immagina la rete a pochi centimetri.'],['Le braccia partono dal basso','Tienile già alte davanti alle spalle: salgono e basta.']],
  varianti:{facile:'Senza salto, solo la spinta delle braccia sulle punte.', difficile:'Un passo laterale prima del salto.'},
  anim:corpo('fronte', [['f_muro_pronto',null,0.4],['f_muro_carica',0.35,0.05],['f_muro_salto',0.35,0.15],['f_muro_carica',0.35,0.3],['f_muro_pronto',0.5,0.3]], {})});

E({id:'sal-scivolamenti', titolo:'Scivolamenti difensivi', obiettivo:'Fisico', ambito:'Salto e agilità',
  descrizione:'Spostamenti laterali veloci in posizione bassa, da un cono all\'altro, senza incrociare i piedi.',
  serveA:'Velocità negli spostamenti di difesa e di muro.',
  lavora:{fondamentali:['Difesa','Muro'], muscoli:['quadricipiti','glutei','adduttori']}, difficolta:2, giocatori:[1,1], durata:5,
  dose:{serie:4, tempo:15, recupero:30}, materiale:['Coni'], pacchetti:['pk-over45'], tags:['agilità','spostamenti'],
  passi:[
    ['Posizione bassa','Piedi larghi, ginocchia piegate, peso sugli avampiedi, braccia avanti.',0],
    ['Scivola','Spingi con il piede lontano e apri il passo verso il cono.',1],
    ['Chiudi','Il piede dietro si avvicina senza incrociare. Tocca il cono e torna indietro.',2]],
  attenzione:['Il bacino resta basso: la testa non va su e giù.','Non incrociare mai i piedi.','Spinta con la gamba lontana dalla direzione.'],
  errori:[['Ci si alza tra un passo e l\'altro','Resta piegato come se ci fosse un soffitto basso.'],['I piedi si incrociano','Passi più corti e più frequenti.']],
  varianti:{facile:'Coni più vicini, ritmo più lento.', difficile:'Il compagno indica la direzione con la mano.'},
  anim:corpo('fronte', [['f_scivolo_stretto',null,0.1,{x:70}],['f_scivolo_largo',0.35,0.05,{x:84}],['f_scivolo_stretto',0.35,0.05,{x:98}],['f_scivolo_largo',0.35,0.05,{x:112}],['f_scivolo_stretto',0.35,0.2,{x:126}],['f_scivolo_largo',0.35,0.05,{x:112}],['f_scivolo_stretto',0.35,0.05,{x:98}],['f_scivolo_largo',0.35,0.05,{x:84}]], {attrezzi:[{tipo:'cono', x:46},{tipo:'cono', x:152}]})});
ES.find(e=>e.id==='sal-scivolamenti').anim.fotogrammi[0].ritorno=0.35;
ES.find(e=>e.id==='gam-passi-laterali').anim.fotogrammi[0].ritorno=0.6;

/* =================================================================== RECUPERO */
const NOTA_REC = 'Da fare solo dopo il parere del medico o del fisioterapista. Durante l\'esercizio il dolore non deve superare 3 su 10; se aumenta, fermati.';
E({id:'rec-ginocchio-estensione', titolo:'Estensione del ginocchio da seduti', obiettivo:'Recupero', ambito:'Ginocchio',
  descrizione:'Seduti su una sedia, si stende lentamente una gamba fino a tenerla tesa per 2 secondi, poi la si riabbassa.',
  serveA:'Riattiva il quadricipite dopo un infortunio o un periodo di riposo, senza carico sull\'articolazione.',
  lavora:{fondamentali:[], muscoli:['quadricipiti']}, difficolta:1, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:10, recupero:45, lato:true}, materiale:['Sedia'], pacchetti:['pk-recupero','pk-casa'], tags:['ginocchio','quadricipite','fase iniziale'],
  passi:[
    ['Posizione','Seduto con la schiena appoggiata, piedi a terra, ginocchia a 90 gradi.',0],
    ['Stendi','Stendi la gamba fino in fondo, punta del piede verso di te. Tieni 2 secondi.',1],
    ['Scendi','Riabbassa lentamente.',2]],
  attenzione:['Stendi la gamba fino in fondo e tieni 2 secondi, con la punta del piede verso di te.','Schiena appoggiata e dritta.','Nessun dolore oltre 3 su 10.'],
  errori:[['Si solleva la coscia dalla sedia','La coscia resta appoggiata: si muove solo la gamba dal ginocchio in giù.'],['La gamba non si stende del tutto','Riduci la velocità ma cerca la gamba tesa; se il ginocchio non si stende, parlane con il fisioterapista.']],
  varianti:{facile:'Meno ripetizioni, senza fermarsi in alto.', difficile:'Con un elastico legato alla caviglia e alla gamba della sedia.'},

  anim:corpo('lato', [['seduto',null,0.4],['seduto_gamba_tesa',1.2,1.6],['seduto',1.2,0.3]], {attrezzi:[{tipo:'sedia'}]})});

E({id:'rec-ginocchio-muro', titolo:'Mezzo squat con la schiena al muro', obiettivo:'Recupero', ambito:'Ginocchio',
  descrizione:'Con la schiena appoggiata al muro e i piedi un passo avanti, si scende di pochi centimetri e si risale.',
  serveA:'Rinforza quadricipiti e glutei con il muro che guida il movimento e scarica la schiena.',
  lavora:{fondamentali:[], muscoli:['quadricipiti','glutei']}, difficolta:1, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:10, recupero:45}, materiale:['Muro o spalliera'], pacchetti:['pk-recupero','pk-casa'], tags:['ginocchio','wall sit'],
  passi:[
    ['Posizione','Schiena appoggiata al muro, piedi un passo avanti alla larghezza delle anche.',0],
    ['Scendi','Scivola giù lungo il muro fino a metà, senza superare i 60-70 gradi di piegamento. Tieni 2-3 secondi.',1],
    ['Risali','Risali spingendo sui talloni.',2]],
  attenzione:['Ginocchia sopra le caviglie, non oltre le punte.','Ginocchia in linea con i piedi.','Scendi solo fin dove non senti dolore.'],
  errori:[['Le ginocchia vanno avanti oltre le punte','Sposta i piedi più lontano dal muro.'],['Si scende troppo','Fermati a metà: la profondità si aumenta nelle settimane, con il fisioterapista.']],
  varianti:{facile:'Scendi di pochi centimetri.', difficile:'Tieni la posizione bassa 20-30 secondi.'},

  anim:corpo('lato', [['muro_schiena',null,0.4],['muro_squat',1.3,1.6],['muro_schiena',1.2,0.3]], {ancora:'anN', attrezzi:[{tipo:'muro', x:50}]})});

E({id:'rec-spalla-pendolo', titolo:'Pendolo per la spalla', obiettivo:'Recupero', ambito:'Spalla',
  descrizione:'Con il busto piegato in avanti e la mano sana appoggiata a un tavolo, il braccio da curare pende rilassato e oscilla come un pendolo.',
  serveA:'Muove la spalla dolcemente, senza far lavorare i muscoli: utile nelle prime fasi del recupero.',
  lavora:{fondamentali:[], muscoli:['cuffia','spalle']}, difficolta:1, giocatori:[1,1], durata:3,
  dose:{serie:3, tempo:30, recupero:30}, materiale:['Sedia'], materialeNote:'un tavolo o lo schienale di una sedia', pacchetti:['pk-recupero'], tags:['spalla','fase iniziale','mobilità'],
  passi:[
    ['Posizione','Appoggia la mano sana a un tavolo e piega il busto in avanti; il braccio da curare pende verso il pavimento, rilassato.',0],
    ['Oscilla','Muovi il corpo, non il braccio: il braccio oscilla avanti e indietro come un pendolo, poi a piccoli cerchi.',1]],
  attenzione:['Il braccio è completamente rilassato: si muove grazie al movimento del corpo.','Piccoli movimenti, senza dolore.','Schiena dritta, ginocchia leggermente piegate.'],
  errori:[['Si muove il braccio con i muscoli della spalla','Lascia il braccio pesante e dondola leggermente il busto.'],['Dolore durante il movimento','Riduci l\'ampiezza; se il dolore resta, fermati e chiedi al fisioterapista.']],
  varianti:{facile:'Solo avanti e indietro, oscillazioni piccole.', difficile:'Cerchi più ampi, in tutti e due i sensi.'},

  anim:corpo('lato', [['pendolo_a',null,0.05],['pendolo_b',0.9,0.05]], {ancora:'anN', attrezzi:[{tipo:'gradino', x:180, w:34, h:90}]})});

E({id:'rec-spalla-muro', titolo:'Scivolamento delle braccia al muro', obiettivo:'Recupero', ambito:'Spalla',
  descrizione:'Con la schiena e le braccia appoggiate al muro, si fanno scivolare le braccia da una «W» a una «Y» e ritorno.',
  serveA:'Mobilità della spalla verso l\'alto e controllo delle scapole, indispensabili per battere e attaccare.',
  lavora:{fondamentali:[], muscoli:['cuffia','schiena','spalle']}, difficolta:1, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:10, recupero:30}, materiale:['Muro o spalliera'], pacchetti:['pk-recupero','pk-riscaldamento','pk-casa'], tags:['scapole','wall slide','postura'],
  passi:[
    ['W','Schiena al muro, gomiti piegati e appoggiati al muro all\'altezza delle spalle: le braccia formano una «W».',0],
    ['Y','Fai scivolare le braccia verso l\'alto fino a una «Y», restando a contatto con il muro.',1],
    ['Torna','Scendi lentamente alla «W», stringendo le scapole verso il basso.',2]],
  attenzione:['Schiena, testa e braccia restano appoggiate al muro.','Sali solo fin dove le braccia restano a contatto.','Spalle basse, lontane dalle orecchie.'],
  errori:[['La schiena si stacca dal muro','Piega un poco le ginocchia e porta l\'ombelico verso la colonna.'],['Le braccia si staccano dal muro salendo','Sali meno: l\'ampiezza crescerà con il tempo.']],
  varianti:{facile:'Di fronte al muro, con gli avambracci appoggiati.', difficile:'Con un elastico leggero tra le mani.'},

  anim:corpo('fronte', [['f_w',null,0.4],['f_y',1.3,0.6],['f_w',1.3,0.3]], {})});

E({id:'rec-caviglia-equilibrio', titolo:'Equilibrio su una gamba', obiettivo:'Recupero', ambito:'Caviglia',
  descrizione:'In piedi su una gamba sola, con il ginocchio appena sbloccato, si mantiene l\'equilibrio per 30 secondi.',
  serveA:'Ricostruisce il controllo della caviglia dopo una distorsione e previene le ricadute.',
  lavora:{fondamentali:[], muscoli:['polpacci','glutei']}, difficolta:1, giocatori:[1,1], durata:4,
  dose:{serie:3, tempo:30, recupero:30, lato:true}, materiale:['Corpo libero'], pacchetti:['pk-recupero','pk-casa'], tags:['caviglia','propriocezione','distorsione'],
  passi:[
    ['Posizione','In piedi vicino a un muro, per appoggiarti se serve.',0],
    ['Su una gamba','Solleva un piede e resta in equilibrio sull\'altra gamba, ginocchio appena sbloccato. 30 secondi.',1],
    ['Cambia','Riappoggia il piede e cambia gamba.',2]],
  attenzione:['Ginocchio della gamba d\'appoggio appena piegato, non bloccato.','Bacino orizzontale: non cade dal lato del piede alzato.','Guarda un punto fisso davanti a te.'],
  errori:[['Il bacino cade dal lato della gamba alzata','Stringi il gluteo della gamba d\'appoggio e allunga la testa verso l\'alto.'],['Il piede d\'appoggio si muove molto','Abbrevia il tempo e appoggia un dito al muro; aumenta piano piano.']],
  varianti:{facile:'Con un dito appoggiato al muro.', difficile:'Occhi chiusi, oppure su un cuscino; poi lanci e prese di una palla con un compagno.'},

  anim:corpo('fronte', [['f_in_piedi',null,0.4],['f_equilibrio',1.0,2.4],['f_in_piedi',1.0,0.3]], {ancora:'anN'})});

E({id:'rec-schiena-gatto', titolo:'Gatto e cammello', obiettivo:'Recupero', ambito:'Schiena',
  descrizione:'In quadrupedia si alternano lentamente la schiena arrotondata verso l\'alto e la schiena incavata, muovendo anche la testa.',
  serveA:'Mobilità dolce della colonna: allevia la rigidità della schiena prima e dopo l\'allenamento.',
  lavora:{fondamentali:[], muscoli:['lombari','schiena','addome']}, difficolta:1, giocatori:[1,1], durata:3,
  dose:{serie:2, ripetizioni:10}, materiale:['Tappetino'], pacchetti:['pk-recupero','pk-riscaldamento','pk-casa'], tags:['schiena','mobilità','colonna'],
  passi:[
    ['Quadrupedia','Mani sotto le spalle, ginocchia sotto le anche.',0],
    ['Gatto','Espira e arrotonda la schiena verso l\'alto, portando il mento verso il petto.',1],
    ['Cammello','Inspira e lascia scendere la pancia, sguardo leggermente in avanti.',3]],
  attenzione:['Movimento lento, guidato dal respiro.','Braccia tese, il movimento parte dalla schiena.','Nella fase del cammello non forzare in fondo.'],
  errori:[['Si muovono solo testa e collo','Pensa a spingere il pavimento con le mani e a muovere il bacino.'],['Si va in fondo con forza','Resta in un movimento comodo: nessun dolore.']],
  varianti:{facile:'Movimento più piccolo.', difficile:'Aggiungi una rotazione del bacino a destra e a sinistra.'},

  anim:corpo('lato', [['quadrupedia',null,0.3],['gatto',1.4,0.6],['quadrupedia',1.1,0.2],['cammello',1.4,0.6]], {ancora:'hip', attrezzi:[{tipo:'tappetino', x:20, w:160}]})});

window.VSE_CATALOGO = { versione: 1, pacchetti: PK, esercizi: ES };
})();

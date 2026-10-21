/* VolleyFit – catalogo di base (scritto da zero).
   Campo: metri, x 0–18 (la nostra metà è a sinistra, rete a x = 9), y 0–9 (in alto le zone 4 e 5).
   Omino: vedi pose.js. */
(function(){
'use strict';
const PK = [
  {id:'pk-fondamentali', nome:'Fondamentali di base', colore:'#1546A0', ordine:1, descrizione:'Esercizi tecnici per battuta, ricezione, palleggio, attacco, muro e difesa.'},
  {id:'pk-principianti', nome:'Principianti: propedeutici', colore:'#B23A6E', ordine:1.5, descrizione:'Per chi comincia: esercizi semplici che preparano un gesto tecnico alla volta (palleggio, bagher, battuta, attacco, muro, difesa), dal movimento senza palla fino al gioco.'},
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
const corpo = (vista, fr, extra) => Object.assign({tipo:'corpo', vista, fotogrammi: fr.map(x=>{ const f={posa:x[0]}; if(x[1]!=null) f.dur=x[1]; if(x[2]!=null) f.pausa=x[2]; if(x[3]) f.p=x[3]; if(x[4]) f.palla=x[4]; return f; })}, extra||{});

/* =================================================================== TECNICA · BATTUTA */
E({id:'bat-basso-bersaglio', titolo:'Battuta dal basso a bersaglio', obiettivo:'Tecnica', ambito:'Battuta',
  descrizione:'A coppie su campi opposti: si batte dal basso cercando di far cadere la palla nel bersaglio; il compagno la blocca e ribatte.',
  serveA:'Costruisce un lancio regolare e un contatto preciso, la base di ogni battuta.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle']}, difficolta:1, giocatori:[2,12], durata:10,
  materiale:['Palloni','Coni'], materialeNote:'1 pallone a coppia, cerchi o coni per i bersagli', pacchetti:['pk-fondamentali','pk-principianti'], tags:['battuta dal basso','precisione'],
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
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-principianti'], tags:['battuta dall\'alto','flottante'],
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
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-principianti'], tags:['bagher','spostamenti','coppie'],
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
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-principianti'], tags:['coppie','spostamenti'],
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


/* =================================================================== AGGIUNTE 1.1 · TECNICA */
E({id:'bat-corta-lunga', titolo:'Battuta corta e lunga', obiettivo:'Tecnica', ambito:'Battuta',
  descrizione:'Due bersagli nell\'altro campo: uno subito dietro la linea dei 3 metri, uno vicino alla linea di fondo. Si batte alternando corta e lunga.',
  serveA:'Cambiare la profondità obbliga chi riceve ad andare avanti e indietro, e molti ricevitori soffrono la palla corta.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle']}, difficolta:3, giocatori:[2,12], durata:12,
  materiale:['Palloni','Coni'], materialeNote:'2 cerchi o tappetini come bersagli', pacchetti:['pk-fondamentali'], tags:['profondità','battuta tattica'],
  passi:[
    ['Corta','Lancio uguale al solito, colpo più lento e accompagnato: la palla passa la rete bassa e cade dietro la linea dei 3 metri.',1],
    ['Lunga','Stesso lancio, colpo più deciso al centro della palla: la palla scende vicino alla linea di fondo.',3],
    ['Conta','Alterna corta e lunga: 10 battute, contate quante cadono nel bersaglio giusto.',3]],
  attenzione:['Lancio identico per le due battute: cambia solo la forza e la durata del colpo.','Sulla corta la palla deve superare la rete di poco.','Sulla lunga mira un metro dentro la linea, non sulla riga.'],
  errori:[['La corta va in rete','Colpisci più sotto la palla e accompagna verso l\'alto: deve salire prima di scendere.'],['La lunga esce','Colpisci più al centro e meno da sotto; accorcia l\'accompagnamento del braccio.']],
  varianti:{facile:'Battuta dal basso, bersagli grandi.', difficile:'Un ricevitore in campo prova a prendere la palla: il punto vale se non ci arriva.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('b','B'), be('t1'), be('t2'), pa('p1'), pa('p2')],
    fotogrammi:[F({b:[-0.8,4.5], t1:[12.8,4.5], t2:[16.6,6.8], p1:[-0.45,4.2], p2:[-1.4,4.9]},null,0.6),
      F({p1:[12.8,4.5]},1.2,0.4,1.6), F({p2:[-0.45,4.2]},0.5,0.4,0.4), F({p2:[16.6,6.8]},1.6,0.9,2.8)]}});

E({id:'bat-sotto-pressione', titolo:'Battuta sotto pressione', obiettivo:'Tecnica', ambito:'Battuta',
  descrizione:'Ogni giocatore batte una serie di 5 battute; dopo un errore deve fare un giro di corsa intorno al campo prima di riprendere.',
  serveA:'In partita si batte dopo uno scambio lungo o sul punteggio stretto: allenarsi con un po\' di pressione aiuta a sbagliare meno.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle']}, difficolta:3, giocatori:[2,12], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-gioco'], tags:['concentrazione','routine','punteggio'],
  passi:[
    ['Routine','Prima di ogni battuta, sempre la stessa routine: 2 palleggi a terra, respiro, sguardo al bersaglio.',0],
    ['Battuta','Battuta sicura nel campo: conta solo che entri.',1],
    ['Errore','Se sbagli, giro di corsa intorno al campo e riprendi la serie da capo.',2]],
  attenzione:['Sempre la stessa routine, anche quando hai fretta.','Dopo un errore, un respiro lungo prima della battuta successiva.','In questo esercizio conta la sicurezza, non la forza.'],
  errori:[['Dopo un errore si batte subito, di fretta','Rifai la routine completa: è proprio quella che riporta la calma.'],['Si batte piano per paura di sbagliare','Mantieni la tua battuta normale; riduci solo la forza, non il gesto.']],
  varianti:{facile:'Serie da 3 battute, senza giro di corsa.', difficile:'La squadra vince solo se tutti completano la serie; chi sbaglia fa ripartire anche il compagno.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('b','B'), pa()],
    fotogrammi:[F({b:[-0.8,6.2], pa:[-0.45,5.9]},null,0.9), F({pa:[14.8,4.0]},1.6,0.4,2.6), F({b:[-1.3,9.9]},0.9,0.2), F({b:[19.4,9.9]},2.0,0.2), F({b:[19.4,-0.9]},0.9,0.2), F({b:[-1.3,-0.9]},2.0,0.2), F({b:[-0.8,6.2]},0.8,0.6)]}});
ES[ES.length-1].anim.fotogrammi[0].ritorno=0.4;

E({id:'ric-uscita-attacco', titolo:'Ricezione e uscita per l\'attacco', obiettivo:'Tecnica', ambito:'Ricezione',
  descrizione:'Il giocatore di banda riceve in zona 5, poi esce subito fuori dal campo per prendere la rincorsa e attacca l\'alzata del palleggiatore in zona 4.',
  serveA:'Senza libero chi riceve è spesso anche chi attacca: il passaggio dalla ricezione alla rincorsa deve diventare automatico.',
  lavora:{fondamentali:['Ricezione','Attacco'], muscoli:['quadricipiti']}, difficolta:3, giocatori:[3,6], durata:15,
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-gioco'], tags:['senza libero','transizione','banda'],
  passi:[
    ['Ricezione','S riceve la battuta in zona 5 e indirizza verso P.',1],
    ['Uscita','Subito dopo la ricezione S arretra e si apre verso l\'esterno del campo, all\'altezza della linea dei 3 metri.',2],
    ['Alzata e attacco','P alza in zona 4; S fa la rincorsa e attacca.',4]],
  attenzione:['Prima la ricezione: l\'attacco viene dopo, non anticiparlo.','Uscita ampia, verso l\'esterno: la rincorsa da zona 4 parte da fuori campo.','Guarda la palla mentre esci, non girarle le spalle.'],
  errori:[['Si attacca senza rincorsa, da fermi','Esci di 2-3 passi oltre la linea laterale: serve spazio per la rincorsa.'],['La ricezione è affrettata perché si pensa già all\'attacco','Fermati sulla ricezione e solo dopo muoviti: la palla buona al palleggiatore viene prima.']],
  varianti:{facile:'L\'allenatore lancia la palla invece della battuta.', difficile:'Il palleggiatore sceglie se alzare a chi ha ricevuto o all\'altro attaccante.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('s','S'), at('p','P'), av('b','B'), pa()],
    fotogrammi:[F({s:[2.4,2.0], p:[8.4,6.0], b:[19.3,2.6], pa:[19.05,3.0]},null,0.6), F({pa:[2.6,2.25]},1.6,0.2,2.6), F({pa:[8.2,5.7], s:[5.4,-0.6]},1.3,0.2,2.2), F({pa:[8.0,1.6], s:[7.3,1.4]},1.4,0.1,3.2), F({pa:[15.4,6.2]},0.5,1.0,0.5)]}});

E({id:'ric-rotazione-zone', titolo:'Ricezione a rotazione nelle zone 1, 6 e 5', obiettivo:'Tecnica', ambito:'Ricezione',
  descrizione:'Un ricevitore riceve tre battute di fila, una per zona: parte in zona 1, poi si sposta in 6 e infine in 5. Poi cambia.',
  serveA:'Ogni zona ha un angolo diverso verso il palleggiatore: in zona 1 e 5 bisogna orientare le braccia verso l\'interno.',
  lavora:{fondamentali:['Ricezione'], muscoli:['quadricipiti','adduttori']}, difficolta:2, giocatori:[3,4], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['orientamento','zone'],
  passi:[
    ['Zona 1','Ricevi la battuta in zona 1: la spalla destra un po\' più bassa, braccia rivolte verso P.',1],
    ['Zona 6','Spostati in zona 6 e ricevi al centro, braccia dritte verso P.',3],
    ['Zona 5','Ultima palla in zona 5: la spalla sinistra un po\' più bassa per chiudere verso il centro.',5]],
  attenzione:['Il piano delle braccia guarda il palleggiatore, non il battitore.','Dalle zone laterali abbassa la spalla esterna.','Tra una battuta e l\'altra spostati con passi laterali.'],
  errori:[['Dalla zona 1 la palla va fuori dal lato destro','Abbassa la spalla destra e porta il piede destro un po\' avanti.'],['Dalla zona 5 la palla va verso la rete','Ruota il busto verso P prima del contatto; non respingere la palla nella direzione da cui arriva.']],
  varianti:{facile:'Lanci a due mani dall\'altro campo.', difficile:'Battuta forte e ricevitore che deve chiamare la zona prima del contatto.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('r','R'), at('p','P'), av('b','B'), pa('p1'), pa('p2'), pa('p3')],
    fotogrammi:[F({r:[2.0,7.0], p:[8.4,6.0], b:[19.3,4.6], p1:[19.05,4.3], p2:[19.6,5.1], p3:[19.8,5.3]},null,0.5),
      F({p1:[2.25,6.8]},1.5,0.1,2.4), F({p1:[8.2,5.7], r:[1.8,4.5]},1.2,0.3,2.2), F({p2:[2.05,4.3]},1.5,0.1,2.4), F({p2:[8.2,5.7], r:[2.0,2.0]},1.2,0.3,2.2), F({p3:[2.25,2.2]},1.5,0.1,2.4), F({p3:[8.2,5.7]},1.2,0.9,2.2)]}});

E({id:'pal-alzata-dietro', titolo:'Alzata dietro in zona 2', obiettivo:'Tecnica', ambito:'Palleggio',
  descrizione:'Il palleggiatore riceve una palla alta e la alza all\'indietro, sopra la testa, verso la zona 2. Un compagno in 2 controlla la precisione.',
  serveA:'Un palleggiatore che alza anche dietro costringe il muro avversario ad aspettare.',
  lavora:{fondamentali:['Palleggio'], muscoli:['spalle','lombari']}, difficolta:4, giocatori:[3,4], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['alzatore','opposto'],
  passi:[
    ['Posizione','P è tra le zone 2 e 3, con la schiena verso la zona 2. L\'allenatore lancia dal centro del campo.',0],
    ['Sotto la palla','P arriva sotto la palla con le stesse mani dell\'alzata in avanti.',1],
    ['Alzata dietro','All\'ultimo spinge la palla all\'indietro sopra la testa, inarcando appena la schiena; la palla scende in zona 2.',2],
    ['Controllo','O, in zona 2, blocca la palla.',3]],
  attenzione:['Stessa posizione di partenza dell\'alzata in avanti: non deve capirsi prima.','La palla si spinge sopra la fronte, non dietro la nuca.','Spingi con le braccia verso l\'alto e indietro, la schiena si inarca appena.'],
  errori:[['L\'alzata dietro è corta','Tieni la palla più in alto sopra la fronte e spingi con le gambe insieme alle braccia.'],['Si capisce subito che sarà un\'alzata dietro','Sistema i piedi come per l\'alzata in avanti; cambia solo la spinta finale.']],
  varianti:{facile:'Alzata dietro corta, a 2 metri, verso un compagno.', difficile:'P sceglie tra zona 4 e zona 2 a ogni palla.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('p','P'), at('o','O'), all(), pa()],
    fotogrammi:[F({p:[8.3,5.2], o:[6.5,8.6], all:[4.0,4.5], pa:[4.35,4.35]},null,0.5), F({pa:[8.1,5.0]},1.2,0.3,2.4), F({pa:[8.1,7.8]},1.0,0.2,2.4), F({o:[7.7,7.9], pa:[7.85,7.75]},0.6,0.9)]}});

E({id:'pal-alzata-da-difesa', titolo:'Alzata dopo la difesa', obiettivo:'Tecnica', ambito:'Palleggio',
  descrizione:'Il palleggiatore difende in zona 1, poi corre a rete e alza la palla difesa da un compagno verso la zona 4.',
  serveA:'Quando il palleggiatore è in seconda linea deve difendere e poi alzare: la corsa verso rete va allenata.',
  lavora:{fondamentali:['Palleggio','Difesa'], muscoli:['quadricipiti','spalle']}, difficolta:4, giocatori:[3,6], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['palleggiatore','transizione','penetrazione'],
  passi:[
    ['In difesa','P è in zona 1, in posizione di difesa. L\'allenatore attacca verso D in zona 5.',1],
    ['Corsa a rete','Appena vede che la palla non è per lui, P corre verso la rete tra le zone 2 e 3.',2],
    ['Alzata','D difende alto verso il centro; P si ferma sotto la palla e alza in zona 4.',4]],
  attenzione:['Prima difendi: P parte solo quando la palla va verso un compagno.','Corri guardando la palla, non la rete.','Fermati sotto la palla prima di alzare, anche se la difesa è imprecisa.'],
  errori:[['P parte troppo presto e lascia scoperta la zona 1','Aspetta il colpo dell\'allenatore: parti quando capisci dove va la palla.'],['L\'alzata è imprecisa perché si arriva di corsa','Ultimi passi corti e frenati; se la palla è bassa, alza in bagher alto.']],
  varianti:{facile:'L\'allenatore lancia la palla a D invece di attaccarla.', difficile:'D difende in modo impreciso apposta: P deve adattarsi.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('p','P'), at('d','D'), all(), pa()],
    fotogrammi:[F({p:[2.4,7.3], d:[2.4,1.8], all:[10.8,2.6], pa:[10.6,2.35]},null,0.6), F({pa:[2.65,2.05]},0.6,0.1,0.4), F({p:[8.2,5.6], pa:[7.2,5.0]},1.4,0.1,3.0), F({pa:[8.0,5.4]},0.3,0.2,0.4), F({pa:[8.0,1.6]},1.4,0.9,3.2)]}});

E({id:'att-seconda-linea', titolo:'Attacco da seconda linea', obiettivo:'Tecnica', ambito:'Attacco',
  descrizione:'L\'attaccante stacca dietro la linea dei 3 metri, in zona 1 o 6, e attacca un\'alzata più bassa e più lontana dalla rete.',
  serveA:'Un attaccante in più quando in prima linea ce ne sono solo due, utile anche senza libero.',
  lavora:{fondamentali:['Attacco'], muscoli:['quadricipiti','glutei','spalle']}, difficolta:4, giocatori:[3,8], durata:15,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['pipe','seconda linea','opposto'],
  passi:[
    ['Partenza','A parte da dietro, in zona 1 o 6.',0],
    ['Alzata','P alza una palla tesa che scende a circa 1 metro dietro la linea dei 3 metri.',1],
    ['Stacco dietro la linea','A stacca prima della linea dei 3 metri: può atterrare oltre, ma non toccarla allo stacco.',2],
    ['Colpo','Colpisce la palla davanti a sé, verso il fondo del campo avversario.',3]],
  attenzione:['Lo stacco deve avvenire dietro la linea dei 3 metri: è la regola.','Colpo in avanti, verso il fondo: la rete è lontana.','Rincorsa più corta del solito.'],
  errori:[['Si pesta la linea dei 3 metri allo stacco','Parti un passo più indietro e fai l\'ultimo passo con il piede che frena prima della linea.'],['La palla va in rete','Colpisci più in alto e verso il fondo del campo: da lontano serve una traiettoria più lunga.']],
  varianti:{facile:'Attacco da fermo con salto, su palla lanciata.', difficile:'Con un muro avversario.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('a','A'), at('p','P'), pa()],
    fotogrammi:[F({a:[0.8,4.2], p:[8.4,6.0], pa:[8.15,5.75]},null,0.6), F({pa:[5.0,4.4], a:[3.6,4.3]},1.4,0.1,2.4), F({a:[4.6,4.4]},0.2,0.1), F({pa:[16.2,3.0]},0.6,1.0,0.6)]}});

E({id:'att-mani-fuori', titolo:'Attacco mani-fuori sul muro', obiettivo:'Tecnica', ambito:'Attacco',
  descrizione:'Con un muro avversario in zona 2, l\'attaccante di zona 4 colpisce volutamente le mani esterne del muro per mandare la palla fuori.',
  serveA:'Quando il muro è ben piazzato e non si passa, usare le sue mani è un modo per fare punto.',
  lavora:{fondamentali:['Attacco'], muscoli:['spalle','obliqui']}, difficolta:4, giocatori:[3,6], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['muro avversario','tocco'],
  passi:[
    ['Alzata in 4','P alza in zona 4, vicino all\'antenna; A fa la rincorsa.',1],
    ['Guarda il muro','Durante il salto A guarda dove sono le mani del muro.',2],
    ['Colpo verso l\'esterno','Colpisce la palla in diagonale verso l\'esterno, sulla mano più vicina all\'antenna: la palla tocca il muro ed esce.',3]],
  attenzione:['Alzata vicina all\'antenna: senza spazio verso l\'esterno il mani-fuori non riesce.','Colpo deciso, con il polso che ruota verso l\'esterno.','Mira la mano esterna del muro, non la testa del murista.'],
  errori:[['La palla resta dentro il campo avversario','Colpisci più verso l\'esterno e più forte, sulla parte alta della mano.'],['La palla esce senza toccare il muro','Avvicina il colpo al muro: devi colpire la mano, non evitarla.']],
  varianti:{facile:'Muro fermo con le mani alzate, senza saltare.', difficile:'Il muro si sposta all\'ultimo e l\'attaccante sceglie tra mani-fuori e diagonale.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('a','A'), at('p','P'), av('m','M'), pa()],
    fotogrammi:[F({a:[5.0,0.6], p:[8.4,6.0], m:[9.7,0.9], pa:[8.15,5.75]},null,0.6), F({a:[7.4,1.1], pa:[8.0,0.9]},1.4,0.1,3.2), F({pa:[9.3,0.6]},0.25,0.0,0.1), F({pa:[12.0,-1.1]},0.6,1.0,0.8)]}});

E({id:'muro-lettura', titolo:'Muro a lettura dell\'alzata', obiettivo:'Tecnica', ambito:'Muro',
  descrizione:'Il centrale aspetta in zona 3 senza indovinare: guarda la palla, poi le mani dell\'alzatore, poi la direzione dell\'alzata, e solo allora si sposta.',
  serveA:'Partire «a lettura» evita di farsi ingannare dall\'alzatore avversario.',
  lavora:{fondamentali:['Muro'], muscoli:['quadricipiti','polpacci']}, difficolta:4, giocatori:[3,6], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['centrale','lettura','sequenza'],
  passi:[
    ['Guarda la palla','C, in zona 3, segue la palla che arriva all\'alzatore avversario.',0],
    ['Guarda l\'alzatore','Quando la palla è sopra l\'alzatore, C guarda le sue mani e il corpo.',1],
    ['Parti','Appena la palla parte verso un lato, C si sposta con passi laterali.',2],
    ['Salta','C salta davanti all\'attaccante, insieme al compagno di muro se c\'è.',3]],
  attenzione:['Sequenza degli sguardi: palla, alzatore, palla, attaccante.','Non partire prima che la palla lasci le mani dell\'alzatore.','Mani sempre alte durante lo spostamento.'],
  errori:[['Il centrale parte prima e si fa ingannare','Aspetta l\'alzata: meglio arrivare un po\' tardi che dalla parte sbagliata.'],['Si guarda solo l\'attaccante','Prima l\'alzatore: è lui che decide dove va la palla.']],
  varianti:{facile:'L\'alzatore avversario indica la direzione con la voce.', difficile:'Tre possibili attacchi: zona 4, zona 2 e primo tempo.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('c','C'), av('al','Al'), av('a4','A4'), av('a2','A2'), pa()],
    fotogrammi:[F({c:[8.5,4.5], al:[9.9,4.9], a4:[12.8,8.4], a2:[12.8,0.7], pa:[14.5,4.5]},null,0.5), F({pa:[10.15,4.7]},1.3,0.4,2.4), F({pa:[10.2,1.6], a2:[10.8,1.5]},1.2,0.1,2.6), F({c:[8.5,1.8]},0.6,0.9)]}});

E({id:'muro-primo-tempo', titolo:'Muro sul primo tempo', obiettivo:'Tecnica', ambito:'Muro',
  descrizione:'Il centrale avversario attacca una palla veloce e bassa vicino all\'alzatore; il nostro centrale salta subito davanti a lui, senza spostarsi.',
  serveA:'Sul primo tempo non c\'è tempo per leggere: bisogna essere già davanti al centrale avversario.',
  lavora:{fondamentali:['Muro'], muscoli:['quadricipiti','polpacci','spalle']}, difficolta:4, giocatori:[3,6], durata:10,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['centrale','primo tempo','veloce'],
  passi:[
    ['Davanti al centrale','C si mette di fronte al centrale avversario, che si avvicina all\'alzatore.',0],
    ['Salto con lui','Quando il centrale avversario salta, C salta subito dopo, con le mani dritte sopra la rete.',1],
    ['Chiudi','Mani ferme e vicine: la palla veloce rimbalza sul muro.',2]],
  attenzione:['Sul primo tempo si salta quasi insieme all\'attaccante.','Mani dritte sopra la rete, non spinte in avanti.','Salto breve e veloce: non serve caricare tanto.'],
  errori:[['Si salta tardi','Guarda il centrale avversario, non la palla: quando lui stacca, stacca anche tu.'],['Le mani si aprono','Pollici in alto e dita larghe ma mani vicine tra loro.']],
  varianti:{facile:'Il centrale avversario attacca da fermo su palla lanciata.', difficile:'Il centrale avversario può fingere il primo tempo e la palla va in zona 4.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('c','C'), av('al','Al'), av('ca','Ca'), pa()],
    fotogrammi:[F({c:[8.5,4.6], al:[9.9,6.6], ca:[12.0,4.6], pa:[14.0,5.6]},null,0.5), F({ca:[10.3,4.6], pa:[10.15,6.35]},1.2,0.1,2.2), F({pa:[10.05,5.0]},0.25,0.0,0.4), F({pa:[9.25,4.75]},0.15,0.0,0.1), F({pa:[11.6,3.6]},0.5,0.9,0.6)]}});

E({id:'dif-palla-rete', titolo:'Recupero della palla dalla rete', obiettivo:'Tecnica', ambito:'Difesa',
  descrizione:'L\'allenatore lancia la palla contro la rete; il giocatore legge come rimbalza e la recupera in bagher, alta, verso il centro.',
  serveA:'Una ricezione o una difesa che finisce in rete si può salvare, se si sa come rimbalza.',
  lavora:{fondamentali:['Difesa'], muscoli:['quadricipiti']}, difficolta:2, giocatori:[2,4], durata:8,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['rete','recupero'],
  passi:[
    ['Lancio in rete','L\'allenatore lancia la palla nella rete, a diverse altezze.',1],
    ['Lettura','Palla in basso nella rete: cade quasi in verticale. Palla in alto: rimbalza più lontano dalla rete.',1],
    ['Recupero','Il giocatore si mette di fianco alla rete, basso, e manda la palla alta verso il centro del campo.',2]],
  attenzione:['Mettiti di fianco alla rete, non di fronte.','Resta basso: la palla scende vicino a terra.','Recupero alto, verso l\'interno del campo.'],
  errori:[['Si arriva troppo vicini alla rete','Lascia spazio: la palla esce dalla rete di 50-100 centimetri.'],['Il recupero torna in rete','Piano delle braccia rivolto verso l\'alto e verso il centro del campo, non verso la rete.']],
  varianti:{facile:'Palla lanciata sempre in basso nella rete.', difficile:'Lanci forti in alto e recupero da far arrivare al palleggiatore.'},
  anim:{tipo:'campo', vista:'meta', elementi:[at('g','G'), all(), pa()],
    fotogrammi:[F({g:[6.0,4.5], all:[4.6,6.5], pa:[4.95,6.3]},null,0.6), F({pa:[8.85,4.8], g:[7.4,4.3]},0.8,0.0,1.2), F({pa:[7.9,4.5]},0.6,0.1,0.4), F({pa:[4.8,4.0]},1.2,0.9,2.8)]}});

E({id:'dif-difesa-palleggio', titolo:'Difesa e risposta in palleggio', obiettivo:'Tecnica', ambito:'Difesa',
  descrizione:'A coppie: uno attacca, l\'altro difende alto, poi palleggia la palla di nuovo all\'attaccante, che attacca ancora.',
  serveA:'Lega difesa e controllo: dopo la difesa bisogna essere già pronti per il tocco successivo.',
  lavora:{fondamentali:['Difesa','Palleggio','Attacco'], muscoli:['quadricipiti','spalle']}, difficolta:3, giocatori:[2,2], durata:10,
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-riscaldamento'], tags:['coppie','continuità'],
  passi:[
    ['Attacco','A attacca con un colpo controllato verso D.',1],
    ['Difesa alta','D difende alto, sopra la propria testa.',2],
    ['Palleggio','D palleggia la palla ad A, che attacca di nuovo. Avanti senza far cadere la palla.',3]],
  attenzione:['La difesa deve salire alta e restare vicino a te.','Tra difesa e palleggio, rimettiti sotto la palla con un passo.','Attacco controllato: lo scopo è tenere viva la palla.'],
  errori:[['La difesa va subito dall\'altra parte','Ammortizza e manda la palla verso l\'alto, non verso il compagno.'],['Il palleggio è affrettato','Aspetta che la palla scenda sopra la fronte prima di palleggiarla.']],
  varianti:{facile:'Dopo la difesa si può bloccare la palla e rilanciarla.', difficile:'Contate gli scambi senza errori: obiettivo 20.'},
  anim:{tipo:'campo', vista:'meta', elementi:[at('a','A'), at('d','D'), pa()],
    fotogrammi:[F({a:[6.6,4.5], d:[2.6,4.5], pa:[6.3,4.3]},null,0.3), F({pa:[2.9,4.35]},0.45,0.1,0.3), F({pa:[2.95,4.25]},0.9,0.1,1.8), F({pa:[6.3,4.3]},1.1,0.4,2.4)]}});

/* =================================================================== AGGIUNTE 1.1 · GIOCO E TATTICA */
E({id:'tat-cambio-palla-p-avanti', titolo:'Cambio palla con il palleggiatore in prima linea', obiettivo:'Tattica', ambito:'Cambio palla',
  descrizione:'Rotazione con il palleggiatore in zona 2: riceve in prima linea, a rete, e ci sono solo due attaccanti avanti. Si allena l\'alzata in zona 4 e il primo tempo del centrale.',
  serveA:'Sono le rotazioni più difficili in attacco: avere due soluzioni a rete evita che il muro avversario si concentri su una sola.',
  lavora:{fondamentali:['Ricezione','Palleggio','Attacco'], muscoli:[]}, difficolta:4, giocatori:[7,12], durata:20,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['senza libero','rotazioni','primo tempo'],
  passi:[
    ['Formazione','P in zona 2 a rete. Ricevono S1, C2 e S2 in seconda linea; C1 e S3 sono a rete in zona 3 e 4.',0],
    ['Ricezione','La ricezione va verso P, tra le zone 2 e 3.',1],
    ['Due soluzioni','C1 parte per il primo tempo davanti a P; S3 prende la rincorsa in zona 4.',2],
    ['Alzata','P sceglie: primo tempo a C1 oppure alzata alta in zona 4.',3]],
  attenzione:['Il centrale deve partire sempre, anche se poi non riceve la palla: tiene fermo il muro avversario.','Ricezione un po\' più alta: P è già a rete e ha meno tempo.','Chi riceve copre l\'attacco subito dopo.'],
  errori:[['Il centrale parte solo se è sicuro di ricevere la palla','Parte a ogni azione: se non attacca lui, ha comunque aiutato il compagno.'],['Il palleggiatore alza sempre in zona 4','Cambia: anche solo un primo tempo ogni tre azioni costringe il muro a restare al centro.']],
  varianti:{facile:'Alzata sempre in zona 4.', difficile:'Battuta forte; il palleggiatore può anche attaccare di seconda.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('p','P'), at('c1','C1'), at('s3','S3'), at('s1','S1'), at('c2','C2'), at('s2','S2'), av('b','B'), pa()],
    fotogrammi:[F({p:[8.3,7.6], c1:[8.3,4.4], s3:[8.0,1.4], s1:[2.4,2.0], c2:[2.0,4.8], s2:[2.4,7.4], b:[19.3,5.0], pa:[19.05,4.8]},null,0.6),
      F({pa:[2.25,4.65]},1.6,0.2,2.6), F({pa:[8.2,5.7], p:[8.4,5.9], c1:[7.0,4.6], s3:[5.6,0.4]},1.2,0.2,2.2), F({c1:[8.5,5.0], pa:[8.4,5.3], s3:[7.4,1.4]},0.6,0.0,0.8), F({pa:[15.0,3.4]},0.4,1.0,0.3)]}});

E({id:'tat-4contro4', titolo:'4 contro 4 a campo ridotto', obiettivo:'Tattica', ambito:'Gioco',
  descrizione:'Due squadre da quattro su campo ridotto in larghezza: un palleggiatore e tre giocatori che ricevono e attaccano. Si gioca con battuta dal basso.',
  serveA:'Più tocchi a testa rispetto al 6 contro 6, ma con ruoli veri: ricezione, alzata, attacco e copertura.',
  lavora:{fondamentali:['Ricezione','Palleggio','Attacco','Difesa'], muscoli:[]}, difficolta:3, giocatori:[8,8], durata:20,
  materiale:['Palloni','Coni'], pacchetti:['pk-gioco'], tags:['partitella','ruoli'],
  passi:[
    ['Campo','Campo stretto di un metro per lato, segnato con i coni. In ogni squadra un palleggiatore a rete e tre giocatori dietro.',0],
    ['Ricezione','La battuta dal basso arriva ai tre dietro; chi riceve manda la palla al palleggiatore.',1],
    ['Attacco','Il palleggiatore alza a uno dei due giocatori che non hanno ricevuto.',3],
    ['Rotazione','Dopo ogni cambio palla si ruota, così tutti fanno anche il palleggiatore.',4]],
  attenzione:['Sempre tre tocchi.','Chi non riceve si prepara subito ad attaccare.','Il palleggiatore cambia a ogni rotazione: tutti imparano ad alzare.'],
  errori:[['Il palleggiatore riceve la battuta','Il palleggiatore resta a rete; la ricezione spetta ai tre dietro.'],['Si attacca sempre dalla stessa parte','Il palleggiatore alterna: prima a sinistra, poi a destra.']],
  varianti:{facile:'Battuta lanciata a due mani.', difficile:'Battuta dall\'alto e punto doppio se l\'attacco arriva dopo una difesa.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('a1','A1'), at('a2','A2'), at('a3','A3'), at('ap','P'), av('b1','B1'), av('b2','B2'), av('b3','B3'), av('bp','Pb'), co('k1'), co('k2'), co('k3'), co('k4'), pa()],
    fotogrammi:[F({a1:[3.0,1.9], a2:[2.2,4.5], a3:[3.0,7.1], ap:[8.3,5.6], b1:[15.6,1.9], b2:[16.4,4.5], b3:[15.6,7.1], bp:[9.7,3.4], k1:[0,1.0], k2:[0,8.0], k3:[18,1.0], k4:[18,8.0], pa:[18.3,4.2]},null,0.6),
      F({pa:[2.45,4.3]},1.6,0.2,2.6), F({pa:[8.1,5.35]},1.2,0.2,2.2), F({pa:[8.0,1.8], a1:[7.3,1.8]},1.3,0.1,3.0), F({pa:[15.2,5.8]},0.5,1.0,0.5)]}});

E({id:'tat-ondate', titolo:'Gioco a ondate: due punti di fila', obiettivo:'Tattica', ambito:'Gioco',
  descrizione:'Partita 6 contro 6 in cui una squadra guadagna il punto della «ondata» solo se vince due azioni di fila: prima il cambio palla, poi una palla libera lanciata dall\'allenatore.',
  serveA:'Abitua a non calare di concentrazione dopo un punto vinto, il momento in cui spesso si perde il successivo.',
  lavora:{fondamentali:['Ricezione','Attacco','Difesa'], muscoli:[]}, difficolta:3, giocatori:[12,14], durata:25,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['partitella','concentrazione','wash'],
  passi:[
    ['Prima azione','La squadra A riceve la battuta e gioca il punto.',1],
    ['Seconda azione','Se A vince il primo punto, l\'allenatore lancia subito una palla libera ad A, che deve vincere anche quella.',3],
    ['Il punto','Solo con due azioni vinte di fila A conquista il punto dell\'ondata; altrimenti nessuno segna. Si gioca a 5 ondate.',4]],
  attenzione:['Dopo il primo punto tornate subito in posizione: la palla libera arriva in pochi secondi.','Sulla palla libera i giocatori a rete arretrano.','Contate ad alta voce le ondate: aiuta a restare concentrati.'],
  errori:[['Dopo il primo punto ci si rilassa','Chiamate «ancora uno!» appena finisce l\'azione e rimettetevi in posizione.'],['Confusione sulla palla libera','Il palleggiatore chiama «libera» e va al suo posto; i compagni arretrano alla linea dei 3 metri.']],
  varianti:{facile:'Basta una sola azione vinta.', difficile:'Tre azioni di fila: cambio palla, palla libera e attacco dell\'allenatore da difendere.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('s','S'), at('p','P'), at('r','R'), av('b','B'), all(), pa('p1'), pa('p2')],
    fotogrammi:[F({s:[5.4,1.3], p:[8.3,6.0], r:[2.2,4.5], b:[19.3,4.0], all:[-1.2,9.6], p1:[19.05,3.8], p2:[-1.0,9.3]},null,0.6),
      F({p1:[2.45,4.3]},1.6,0.1,2.6), F({p1:[8.1,5.7]},1.1,0.1,2.2), F({p1:[15.4,6.0], s:[7.3,1.5]},1.4,0.4,3.0), F({p2:[4.0,5.0], s:[5.2,1.0]},1.4,0.8,3.0)]}});

E({id:'tat-muro-contrattacco', titolo:'Dal muro al contrattacco', obiettivo:'Tattica', ambito:'Difesa e contrattacco',
  descrizione:'L\'attaccante di zona 4 mura, atterra, si gira e si apre per la rincorsa; la squadra difende e lui contrattacca la palla alzata.',
  serveA:'Dopo il muro c\'è pochissimo tempo per attaccare: il movimento «atterra, girati, apriti» deve essere automatico.',
  lavora:{fondamentali:['Muro','Attacco','Difesa'], muscoli:['quadricipiti']}, difficolta:4, giocatori:[5,8], durata:15,
  materiale:['Palloni'], materialeNote:'un rialzo per l\'allenatore', pacchetti:['pk-gioco'], tags:['transizione','rigiocata'],
  passi:[
    ['Muro','S salta a muro in zona 4 sull\'attacco dell\'allenatore.',1],
    ['Atterra e apriti','Atterra, si gira verso il proprio campo e arretra in diagonale fino alla linea dei 3 metri.',2],
    ['Difesa e alzata','D difende la palla verso P, che alza in zona 4.',3],
    ['Contrattacco','S fa una rincorsa corta e attacca.',4]],
  attenzione:['Atterra a due piedi prima di girarti.','Arretra girandoti verso il campo, guardando la palla.','Rincorsa corta: due o tre passi bastano.'],
  errori:[['Si resta a rete a guardare la difesa','Appena atterri, il primo passo è indietro e verso l\'esterno.'],['Si contrattacca senza salto','Anche con una rincorsa di due passi si deve staccare a due piedi.']],
  varianti:{facile:'Senza salto a muro: solo il movimento di apertura.', difficile:'L\'allenatore alterna attacco e pallonetto dietro il muro.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('s','S'), at('p','P'), at('d','D'), all(), pa()],
    fotogrammi:[F({s:[8.5,1.6], p:[8.5,6.2], d:[2.6,4.6], all:[10.8,1.8], pa:[10.6,1.6]},null,0.6), F({pa:[2.85,4.35]},0.7,0.2,0.4), F({s:[5.4,0.6], p:[8.3,5.8]},0.9,0.1), F({pa:[8.1,5.55]},1.2,0.2,2.6), F({pa:[8.0,1.5], s:[7.3,1.4]},1.3,0.1,3.0), F({pa:[15.6,5.0]},0.5,1.0,0.5)]}});

E({id:'tat-copertura-centrale', titolo:'Copertura del primo tempo', obiettivo:'Tattica', ambito:'Copertura',
  descrizione:'Sull\'attacco veloce del centrale la palla murata torna giù subito vicino a lui: la copertura la fanno il palleggiatore e i giocatori più vicini, già bassi.',
  serveA:'Il primo tempo dura un attimo: la copertura deve essere preparata prima dell\'attacco, non dopo.',
  lavora:{fondamentali:['Difesa','Attacco'], muscoli:['quadricipiti']}, difficolta:4, giocatori:[6,8], durata:12,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['centrale','coppa','primo tempo'],
  passi:[
    ['Primo tempo','P alza veloce a C davanti a sé. Durante l\'alzata, S e D si avvicinano a C, bassi.',1],
    ['Palla murata','Il muro avversario rimanda la palla, che cade a 1-2 metri da C.',2],
    ['Recupero','Il più vicino la difende alta verso P, che rigioca.',3]],
  attenzione:['Su un attacco veloce ci si avvicina mentre la palla è ancora in aria.','Bassi e vicini: a 1-2 metri dal centrale.','Il palleggiatore copre subito dopo l\'alzata.'],
  errori:[['La copertura arriva quando la palla è già a terra','Muovetevi durante l\'alzata, non quando vedete il muro.'],['Copertura troppo lontana','Sul primo tempo la palla murata cade vicinissima: state a un passo o due dal centrale.']],
  varianti:{facile:'L\'allenatore simula il muro rimandando la palla con le mani.', difficile:'Muro vero di due giocatori.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('c','C'), at('p','P'), at('s','S'), at('d','D'), av('m','M'), pa()],
    fotogrammi:[F({c:[6.6,4.6], p:[8.4,6.0], s:[5.2,1.3], d:[2.4,4.6], m:[9.7,4.6], pa:[8.15,5.75]},null,0.6), F({c:[8.3,4.6], pa:[8.35,4.85], s:[6.3,2.7], d:[5.7,5.3], p:[7.4,6.5]},0.6,0.0,0.6), F({pa:[9.15,4.7]},0.15,0.0,0.1), F({pa:[6.6,4.1]},0.6,0.2,1.0), F({pa:[7.9,5.6]},1.0,0.9,2.2)]}});

/* =================================================================== AGGIUNTE 1.1 · FISICO */
E({id:'mob-affondo-braccia', titolo:'Affondo con allungamento in alto', obiettivo:'Fisico', ambito:'Riscaldamento e mobilità',
  descrizione:'Dall\'affondo si portano le braccia tese sopra la testa, allungando tutto il fianco e la parte davanti dell\'anca della gamba dietro.',
  serveA:'In un solo movimento scalda gambe, anche e spalle: ottimo prima di salti e attacchi.',
  lavora:{fondamentali:[], muscoli:['flessori','quadricipiti','spalle']}, difficolta:1, giocatori:[1,1], durata:4,
  dose:{serie:2, ripetizioni:6, lato:true}, materiale:['Corpo libero'], pacchetti:['pk-riscaldamento','pk-casa'], tags:['mobilità anca','allungamento dinamico'],
  passi:[
    ['Affondo','Fai un passo lungo in avanti e scendi nell\'affondo, mani sui fianchi.',1],
    ['Braccia in alto','Porta le braccia tese sopra la testa e spingi il bacino leggermente avanti. Tieni 2 secondi.',2],
    ['Torna','Riporta le mani sui fianchi e torna in piedi. Poi l\'altra gamba.',3]],
  attenzione:['Il ginocchio davanti resta sopra la caviglia.','Quando alzi le braccia, non inarcare la schiena: allunga verso l\'alto.','Movimento fluido, senza rimbalzi.'],
  errori:[['La schiena si inarca quando salgono le braccia','Porta l\'ombelico verso la colonna e stringi il gluteo della gamba dietro.'],['Il ginocchio davanti va oltre la punta','Allunga il passo.']],
  varianti:{facile:'Mani appoggiate su una sedia di fianco.', difficile:'Aggiungi una piccola rotazione del busto verso la gamba davanti.'},
  anim:corpo('lato', [['mani_fianchi',null,0.3],['affondo_giu',1.2,0.3],['affondo_braccia_alto',0.9,1.2],['affondo_giu',0.8,0.2],['mani_fianchi',1.1,0.3]], {ancora:'anN'})});

E({id:'mob-saltelli-aperti', titolo:'Saltelli a gambe aperte', obiettivo:'Fisico', ambito:'Riscaldamento e mobilità',
  descrizione:'Saltelli leggeri sul posto aprendo gambe e braccia insieme, poi richiudendole. Per chi ha dolori alle ginocchia: senza salto, un passo di lato alla volta.',
  serveA:'Alza il battito e scalda caviglie e spalle in poco tempo.',
  lavora:{fondamentali:[], muscoli:['polpacci','spalle','adduttori']}, difficolta:1, giocatori:[1,1], durata:2,
  dose:{serie:2, tempo:30, recupero:30}, materiale:['Corpo libero'], pacchetti:['pk-riscaldamento','pk-casa'], tags:['attivazione','jumping jack'],
  passi:[
    ['Chiuso','In piedi, piedi uniti, braccia lungo i fianchi.',0],
    ['Aperto','Con un saltello apri le gambe e porta le braccia sopra la testa.',1],
    ['Di nuovo chiuso','Con un altro saltello torna chiuso. Avanti per 30 secondi.',0]],
  attenzione:['Atterra sugli avampiedi, morbido.','Saltelli bassi: non serve saltare in alto.','Ritmo regolare.'],
  errori:[['Si atterra sui talloni','Resta sulle punte e piega appena le ginocchia a ogni appoggio.'],['Le braccia non arrivano in alto','Rallenta il ritmo: braccia e gambe si aprono insieme.']],
  varianti:{facile:'Senza salto: un passo laterale alternato e braccia in alto.', difficile:'Più veloce, oppure con un mezzo squat quando apri.'},
  anim:corpo('fronte', [['f_jack_chiuso',null,0.05],['f_jack_aperto',0.32,0.05]], {})});
ES[ES.length-1].anim.fotogrammi[0].ritorno=0.32;

E({id:'gam-step-up', titolo:'Salita sul gradino', obiettivo:'Fisico', ambito:'Gambe',
  descrizione:'Si sale su un gradino stabile spingendo con la gamba che è sopra, si arriva in piedi e si scende piano con la stessa gamba che è salita per ultima.',
  serveA:'Forza di una gamba alla volta, molto vicina al gesto della rincorsa e dello stacco.',
  lavora:{fondamentali:[], muscoli:['quadricipiti','glutei']}, difficolta:2, giocatori:[1,1], durata:6,
  dose:{serie:3, ripetizioni:8, recupero:60, lato:true}, materiale:['Gradino'], materialeNote:'un gradino o una panca stabile, alta 20-40 cm', pacchetti:['pk-over45','pk-casa'], tags:['step','una gamba','ginocchio'],
  passi:[
    ['Piede sul gradino','Appoggia tutto il piede sul gradino.',0],
    ['Sali','Spingi con il tallone del piede sopra e sali senza darti la spinta con la gamba a terra.',1],
    ['Scendi','Scendi piano, appoggiando prima l\'altro piede. Fai tutte le ripetizioni, poi cambia gamba.',2]],
  attenzione:['Spinta della gamba sopra: quella a terra non aiuta.','Il ginocchio resta in linea con il piede, non va verso l\'interno.','Discesa lenta e controllata.'],
  errori:[['Ci si dà la spinta con il piede a terra','Solleva la punta del piede a terra prima di salire: deve lavorare solo l\'altra gamba.'],['Il ginocchio va verso l\'interno','Gradino più basso e ginocchio spinto verso il mignolo.']],
  varianti:{facile:'Gradino basso, una mano al muro.', difficile:'Gradino più alto o un pallone tenuto davanti al petto.'},
  anim:corpo('lato', [['step_davanti',null,0.4],['step_sopra',1.1,0.6],['step_davanti',1.2,0.3]], {attrezzi:[{tipo:'gradino', x:112, w:56, h:22}]})});

E({id:'gam-stacco-una-gamba', titolo:'Stacco su una gamba', obiettivo:'Fisico', ambito:'Gambe',
  descrizione:'In equilibrio su una gamba, si porta il busto in avanti mentre l\'altra gamba va indietro tesa, fino a quasi una linea orizzontale. Poi si torna su.',
  serveA:'Rinforza femorali e glutei e allena l\'equilibrio: protegge il ginocchio negli atterraggi su una gamba.',
  lavora:{fondamentali:[], muscoli:['femorali','glutei','lombari']}, difficolta:3, giocatori:[1,1], durata:6,
  dose:{serie:3, ripetizioni:8, recupero:60, lato:true}, materiale:['Corpo libero'], pacchetti:['pk-over45','pk-casa'], tags:['femorali','equilibrio','stacco rumeno'],
  passi:[
    ['Su una gamba','In piedi su una gamba, ginocchio appena sbloccato.',0],
    ['Busto avanti','Porta il busto avanti e la gamba libera indietro, come un\'altalena: schiena dritta, braccia verso terra.',1],
    ['Torna su','Spingi il bacino avanti e torna in piedi stringendo il gluteo.',2]],
  attenzione:['Schiena dritta dalla testa al tallone della gamba dietro.','Il bacino resta orizzontale: non ruota verso l\'alto.','Scendi solo fin dove mantieni l\'equilibrio.'],
  errori:[['La schiena si arrotonda','Scendi meno e pensa a portare il bacino indietro, non le mani verso terra.'],['Si perde l\'equilibrio','Appoggia una mano al muro, oppure tocca terra con la punta del piede dietro.']],
  varianti:{facile:'Con una mano al muro o la punta del piede dietro appoggiata.', difficile:'Con un pallone o un peso leggero in mano.'},
  anim:corpo('lato', [['in_piedi_una_gamba',null,0.4],['stacco_una_gamba',1.3,0.6],['in_piedi_una_gamba',1.2,0.3]], {ancora:'anN'})});

E({id:'core-crunch', titolo:'Crunch a ginocchia piegate', obiettivo:'Fisico', ambito:'Core',
  descrizione:'Da supini con le ginocchia piegate si sollevano solo testa e spalle, portando le mani verso le ginocchia, poi si torna giù lentamente.',
  serveA:'Addominali alti, senza sforzare la zona lombare.',
  lavora:{fondamentali:[], muscoli:['addome']}, difficolta:1, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:12, recupero:30}, materiale:['Tappetino'], pacchetti:['pk-over45','pk-casa'], tags:['addominali'],
  passi:[
    ['Giù','Supino, ginocchia piegate, piedi a terra, braccia tese verso le ginocchia.',0],
    ['Su','Espira e solleva testa e spalle dal tappetino. La zona lombare resta appoggiata.',1],
    ['Giù piano','Torna giù in 2 secondi.',2]],
  attenzione:['Si sollevano solo testa e spalle, la schiena bassa resta a terra.','Sguardo verso le ginocchia, mento staccato dal petto.','Espira salendo.'],
  errori:[['Si tira il collo con le mani','Tieni le braccia tese verso le ginocchia: è la pancia che solleva.'],['Si sale di slancio','Rallenta: sali in un secondo, scendi in due.']],
  varianti:{facile:'Mani appoggiate sulle cosce, risalita piccola.', difficile:'Braccia incrociate sul petto e 2 secondi fermi in alto.'},
  anim:corpo('lato', [['crunch_giu',null,0.4],['crunch_su',0.9,0.7],['crunch_giu',1.3,0.2]], {ancora:'anN', attrezzi:[{tipo:'tappetino', x:20, w:160}]})});

E({id:'core-superman', titolo:'Superman a terra', obiettivo:'Fisico', ambito:'Core',
  descrizione:'Da proni, con le braccia tese in avanti, si sollevano insieme di pochi centimetri braccia, petto e gambe, e si tiene la posizione per 3 secondi.',
  serveA:'Rinforza i muscoli della schiena che tengono il busto dritto in battuta e in attacco.',
  lavora:{fondamentali:[], muscoli:['lombari','schiena','glutei']}, difficolta:2, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:8, recupero:30}, materiale:['Tappetino'], pacchetti:['pk-over45','pk-casa'], tags:['schiena','postura'],
  passi:[
    ['Proni','A pancia in giù, braccia tese in avanti, gambe tese.',0],
    ['Su','Solleva insieme braccia, petto e gambe di pochi centimetri. Tieni 3 secondi.',1],
    ['Giù','Torna giù lentamente.',2]],
  attenzione:['Bastano pochi centimetri: non serve inarcarsi.','Sguardo verso il tappetino, collo in linea.','Glutei stretti mentre sollevi le gambe.'],
  errori:[['Fastidio alla zona lombare','Solleva meno, oppure solo braccia o solo gambe.'],['La testa va all\'indietro','Guarda il pavimento a una spanna dal naso.']],
  varianti:{facile:'Solleva un braccio e la gamba opposta, alternando.', difficile:'Tieni 5 secondi e muovi le braccia da avanti a lato.'},
  anim:corpo('lato', [['superman_giu',null,0.4],['superman_su',0.9,1.4],['superman_giu',1.0,0.2]], {ancora:'hip', attrezzi:[{tipo:'tappetino', x:10, w:180}]})});

E({id:'spa-ytw', titolo:'Y, T e W con elastico', obiettivo:'Fisico', ambito:'Spalle e braccia',
  descrizione:'Con un elastico leggero tenuto tra le mani, si portano le braccia a formare tre lettere: Y in alto, T aperte di lato, W con i gomiti piegati.',
  serveA:'Rinforza i muscoli piccoli intorno alle scapole, che proteggono la spalla di chi batte e attacca.',
  lavora:{fondamentali:['Battuta','Attacco'], muscoli:['cuffia','schiena','spalle']}, difficolta:2, giocatori:[1,1], durata:5,
  dose:{serie:2, ripetizioni:8, recupero:45}, materiale:['Elastico'], materialeNote:'elastico lungo e leggero', pacchetti:['pk-over45','pk-casa','pk-recupero'], tags:['scapole','prevenzione spalla'],
  passi:[
    ['Y','Braccia tese in alto a formare una Y, elastico in leggera tensione.',0],
    ['T','Abbassa le braccia di lato, all\'altezza delle spalle, aprendo l\'elastico: una T.',1],
    ['W','Piega i gomiti e portali verso i fianchi, stringendo le scapole: una W. Poi di nuovo Y.',2]],
  attenzione:['Spalle basse in tutte le posizioni.','Movimento lento: 2 secondi per passare da una lettera all\'altra.','Elastico leggero: si lavora sul controllo, non sulla forza.'],
  errori:[['Le spalle salgono verso le orecchie','Elastico più leggero; pensa a portare le scapole in basso e indietro.'],['Si inarca la schiena nella Y','Addome contratto; alza le braccia solo fin dove la schiena resta neutra.']],
  varianti:{facile:'Senza elastico.', difficile:'Da proni a terra o con il busto inclinato in avanti.'},
  anim:corpo('fronte', [['f_y',null,0.6],['f_braccia_largo',1.0,0.6],['f_w',1.0,0.6]], {attrezzi:[{tipo:'elastico', da:'haN', a:'haF'}]})});

E({id:'spa-gesto-elastico', titolo:'Gesto dell\'attacco con elastico', obiettivo:'Fisico', ambito:'Spalle e braccia',
  descrizione:'Con un elastico fissato in alto dietro di sé, si ripete lentamente il movimento del braccio dell\'attacco: caricamento, colpo in alto, chiusura in avanti.',
  serveA:'Rinforza la spalla proprio nel gesto che fa in partita, con un carico leggero e controllato.',
  lavora:{fondamentali:['Attacco','Battuta'], muscoli:['spalle','petto','tricipiti']}, difficolta:2, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:10, recupero:45, lato:true}, materiale:['Elastico','Muro o spalliera'], materialeNote:'elastico leggero fissato in alto a una spalliera', pacchetti:['pk-over45'], tags:['spalla','attacco','battuta'],
  passi:[
    ['Caricamento','Di spalle alla spalliera, gomito alto e mano dietro la testa, elastico teso.',0],
    ['Colpo','Distendi il braccio verso l\'alto e in avanti, come quando colpisci la palla.',1],
    ['Chiusura','Accompagna il braccio in avanti e in basso, poi torna lentamente al caricamento.',2]],
  attenzione:['Gomito alto nel caricamento, sopra la spalla.','Il colpo parte dal busto: la spalla segue.','Ritorno lento, frenando l\'elastico.'],
  errori:[['Il gomito resta basso','Prima del colpo porta il gomito all\'altezza dell\'orecchio.'],['Si fa solo con il braccio','Ruota leggermente il busto in avanti mentre distendi il braccio.']],
  varianti:{facile:'Senza elastico, solo il gesto lento.', difficile:'Elastico più duro, sempre lento nel ritorno.'},
  anim:corpo('lato', [['attacco_carica',null,0.4],['attacco_colpo',0.6,0.3],['attacco_fine',0.6,0.4],['attacco_carica',1.2,0.2]], {ancora:'anN', attrezzi:[{tipo:'muro', x:52},{tipo:'elastico', da:'haN', a:[58,40]}]})});

E({id:'sal-saltelli-laterali', titolo:'Saltelli laterali sopra una linea', obiettivo:'Fisico', ambito:'Salto e agilità',
  descrizione:'Piedi uniti, si salta da una parte all\'altra di una linea a terra, rapidi e bassi.',
  serveA:'Rapidità dei piedi e reattività delle caviglie, utili negli spostamenti a muro e in difesa.',
  lavora:{fondamentali:['Muro','Difesa'], muscoli:['polpacci','quadricipiti']}, difficolta:2, giocatori:[1,1], durata:4,
  dose:{serie:3, tempo:20, recupero:40}, materiale:['Corpo libero'], pacchetti:['pk-over45'], tags:['rapidità','caviglie','pliometria leggera'],
  passi:[
    ['Posizione','Piedi uniti accanto a una linea, ginocchia leggermente piegate.',0],
    ['Salta di lato','Saltello basso oltre la linea, atterrando sugli avampiedi.',1],
    ['Torna','Subito un saltello per tornare dall\'altra parte. 20 secondi.',2]],
  attenzione:['Saltelli bassi e veloci, contatto breve con il terreno.','Il busto resta fermo sopra la linea: si muovono le gambe.','Atterraggio morbido sugli avampiedi.'],
  errori:[['Si salta troppo alto e lento','Salta appena quanto basta per superare la linea: conta la rapidità.'],['Si atterra rigidi','Ginocchia leggermente piegate a ogni appoggio.']],
  varianti:{facile:'Passo laterale veloce invece del salto.', difficile:'Su un piede solo (solo senza dolori a caviglie e ginocchia).'},
  anim:corpo('fronte', [['f_semisquat_stretto',null,0.05,{x:84}],['f_salto_laterale',0.22,0.0,{x:100}],['f_semisquat_stretto',0.22,0.1,{x:116}],['f_salto_laterale',0.22,0.0,{x:100}]], {attrezzi:[{tipo:'cono', x:100}]})});
ES[ES.length-1].anim.fotogrammi[0].ritorno=0.22;

E({id:'sal-rincorsa', titolo:'Rincorsa e stacco d\'attacco senza palla', obiettivo:'Fisico', ambito:'Salto e agilità',
  descrizione:'Si ripete la rincorsa d\'attacco a tre passi: passo, ultimo passo lungo con le braccia indietro, stacco a due piedi e atterraggio morbido.',
  serveA:'Costruisce una rincorsa sempre uguale e un atterraggio sicuro, prima di aggiungere la palla.',
  lavora:{fondamentali:['Attacco'], muscoli:['quadricipiti','glutei','polpacci']}, difficolta:3, giocatori:[1,1], durata:6,
  dose:{serie:3, ripetizioni:5, recupero:90}, materiale:['Corpo libero'], pacchetti:['pk-over45'], tags:['rincorsa','stacco','attacco'],
  passi:[
    ['Primo passo','Un passo di avvio, per chi colpisce di destro con il piede sinistro.',1],
    ['Ultimo passo','Passo lungo e veloce, il tallone frena, le braccia vanno indietro.',2],
    ['Stacco','Spingi con le due gambe e lancia le braccia in alto.',3],
    ['Atterraggio','Atterra su tutti e due i piedi, ginocchia piegate.',4]],
  attenzione:['L\'ultimo passo è il più lungo e il più veloce.','Le braccia vanno indietro durante l\'ultimo passo e salgono nello stacco.','Atterra a due piedi, vicino al punto di stacco.'],
  errori:[['Si salta in avanti e non in alto','Ultimo passo con il tallone che frena: trasforma la corsa in salto verso l\'alto.'],['Braccia ferme durante la rincorsa','Portale indietro nell\'ultimo passo: danno gran parte della spinta.']],
  varianti:{facile:'Solo gli ultimi due passi e un salto basso.', difficile:'Rincorsa a quattro passi, poi un attacco su palla lanciata.'},
  note:'Da fare dopo un buon riscaldamento. Poche ripetizioni, ben fatte.',
  anim:corpo('lato', [['in_piedi',null,0.4,{x:40}],['passo_avanti',0.45,0.0,{x:66}],['carica_salto',0.4,0.05,{x:96}],['salto',0.35,0.05,{x:108}],['atterraggio',0.35,0.9,{x:112}]], {})});
ES[ES.length-1].anim.fotogrammi[0].ritorno=0.6;

/* =================================================================== AGGIUNTE 1.1 · RECUPERO */
E({id:'rec-ginocchio-gamba-tesa', titolo:'Sollevamento della gamba tesa da supini', obiettivo:'Recupero', ambito:'Ginocchio',
  descrizione:'Da supini, con una gamba piegata, si solleva l\'altra tesa fino all\'altezza del ginocchio opposto e si riabbassa lentamente.',
  serveA:'Rinforza il quadricipite senza piegare il ginocchio: si usa nelle prime fasi del recupero.',
  lavora:{fondamentali:[], muscoli:['quadricipiti','flessori']}, difficolta:1, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:10, recupero:45, lato:true}, materiale:['Tappetino'], pacchetti:['pk-recupero','pk-casa'], tags:['ginocchio','fase iniziale','quadricipite'],
  passi:[
    ['Posizione','Supino, una gamba piegata con il piede a terra, l\'altra tesa con la punta del piede verso di te.',0],
    ['Su','Contrai la coscia della gamba tesa e sollevala fino all\'altezza dell\'altro ginocchio.',1],
    ['Giù','Riabbassala lentamente, senza appoggiarla del tutto.',2]],
  attenzione:['La gamba resta tesa per tutto il movimento: prima contrai la coscia, poi sollevi.','Schiena appoggiata al tappetino.','Movimento lento, senza slancio.'],
  errori:[['Il ginocchio si piega durante la salita','Contrai bene la coscia prima di sollevare; sali meno.'],['La schiena si inarca','Tieni piegata l\'altra gamba e porta l\'ombelico verso la colonna.']],
  varianti:{facile:'Solleva di pochi centimetri.', difficile:'Con un peso leggero alla caviglia, se il fisioterapista è d\'accordo.'},
  anim:corpo('lato', [['supino_gamba_giu',null,0.4],['supino_gamba_su',1.2,0.8],['supino_gamba_giu',1.4,0.2]], {ancora:'hip', attrezzi:[{tipo:'tappetino', x:20, w:170}]})});

E({id:'rec-ginocchio-elastico', titolo:'Estensione del ginocchio in piedi con elastico', obiettivo:'Recupero', ambito:'Ginocchio',
  descrizione:'Un elastico fissato davanti passa dietro al ginocchio: da ginocchio appena piegato si distende la gamba spingendo indietro contro l\'elastico.',
  serveA:'Recupera gli ultimi gradi di estensione del ginocchio, spesso i più difficili dopo un infortunio.',
  lavora:{fondamentali:[], muscoli:['quadricipiti']}, difficolta:1, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:12, recupero:30, lato:true}, materiale:['Elastico','Muro o spalliera'], pacchetti:['pk-recupero'], tags:['ginocchio','estensione','TKE'],
  passi:[
    ['Posizione','Elastico fissato davanti a te all\'altezza del ginocchio, passato dietro il ginocchio da trattare. Ginocchio leggermente piegato.',0],
    ['Distendi','Spingi il ginocchio indietro fino a gamba tesa, contraendo la coscia. Tieni 2 secondi.',1],
    ['Rilascia','Torna lentamente con il ginocchio appena piegato.',2]],
  attenzione:['Il piede resta fermo a terra.','Distendi fino in fondo senza scattare.','Il peso è sulla gamba che lavora.'],
  errori:[['Il bacino va indietro invece del ginocchio','Tieni il busto dritto: si muove solo il ginocchio.'],['Si blocca il ginocchio con uno scatto','Arriva alla gamba tesa lentamente e tieni.']],
  varianti:{facile:'Elastico leggero e piccolo movimento.', difficile:'Su un cuscino morbido per aggiungere equilibrio.'},
  anim:corpo('lato', [['ginocchio_flesso',null,0.4],['ginocchio_teso',0.9,1.0],['ginocchio_flesso',1.1,0.3]], {ancora:'anN', attrezzi:[{tipo:'muro', x:172},{tipo:'elastico', da:'knN', a:[172,150]}]})});

E({id:'rec-spalla-rotazione-esterna', titolo:'Rotazione esterna della spalla con elastico', obiettivo:'Recupero', ambito:'Spalla',
  descrizione:'Gomiti attaccati ai fianchi e piegati a 90 gradi, elastico tra le mani: si aprono gli avambracci verso l\'esterno, senza staccare i gomiti.',
  serveA:'Rinforza la cuffia dei rotatori, che stabilizza la spalla di chi batte e attacca.',
  lavora:{fondamentali:['Battuta','Attacco'], muscoli:['cuffia','schiena']}, difficolta:1, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:12, recupero:30}, materiale:['Elastico'], materialeNote:'elastico leggero', pacchetti:['pk-recupero','pk-over45','pk-casa'], tags:['cuffia dei rotatori','prevenzione spalla'],
  passi:[
    ['Posizione','In piedi, gomiti ai fianchi piegati a 90 gradi, mani davanti alla pancia con l\'elastico.',0],
    ['Apri','Apri gli avambracci verso l\'esterno tenendo i gomiti attaccati ai fianchi. Tieni 1 secondo.',1],
    ['Chiudi','Torna lentamente con le mani davanti.',2]],
  attenzione:['I gomiti non si staccano dai fianchi: aiutati con un asciugamano arrotolato.','Polsi dritti.','Spalle basse e scapole leggermente indietro.'],
  errori:[['I gomiti si allontanano dai fianchi','Metti un asciugamano tra gomito e fianco e tienilo stretto.'],['Si inarca la schiena per aprire di più','Apri meno: conta che lavori la spalla.']],
  varianti:{facile:'Un braccio alla volta, con l\'elastico fissato a una maniglia.', difficile:'Elastico più duro, oppure con il braccio alzato di lato a 90 gradi.'},
  anim:corpo('fronte', [['f_rot_dentro',null,0.4],['f_rot_fuori',1.0,0.7],['f_rot_dentro',1.2,0.2]], {attrezzi:[{tipo:'elastico', da:'haN', a:'haF'}]})});

E({id:'rec-spalla-scivolamento-frontale', titolo:'Scivolamento delle braccia sul muro di fronte', obiettivo:'Recupero', ambito:'Spalla',
  descrizione:'Di fronte al muro, con gli avambracci appoggiati, si fanno scivolare le braccia verso l\'alto e si torna giù lentamente.',
  serveA:'Recupera il movimento della spalla verso l\'alto, con il muro che guida e sostiene.',
  lavora:{fondamentali:[], muscoli:['spalle','cuffia']}, difficolta:1, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:10, recupero:30}, materiale:['Muro o spalliera'], pacchetti:['pk-recupero','pk-casa'], tags:['mobilità spalla','fase iniziale'],
  passi:[
    ['Posizione','Di fronte al muro, avambracci appoggiati, gomiti all\'altezza delle spalle.',0],
    ['Scivola su','Fai scivolare le braccia verso l\'alto, avvicinando un poco il corpo al muro.',1],
    ['Torna giù','Scendi lentamente fino alla posizione di partenza.',2]],
  attenzione:['Sali solo fin dove non senti dolore.','Spalle basse, lontane dalle orecchie.','Respira normalmente.'],
  errori:[['Le spalle salgono verso le orecchie','Pensa a portare le scapole verso il basso mentre le braccia salgono.'],['Si inarca la schiena per arrivare più in alto','Ferma le braccia prima: l\'ampiezza crescerà con il tempo.']],
  varianti:{facile:'Una sola mano alla volta, piccoli movimenti.', difficile:'Staccare le mani dal muro per 2 secondi in alto.'},
  anim:corpo('lato', [['muro_mani_giu',null,0.4],['muro_mani_su',1.4,0.8],['muro_mani_giu',1.4,0.2]], {attrezzi:[{tipo:'muro', x:141}]})});

E({id:'rec-caviglia-alfabeto', titolo:'Alfabeto con la caviglia', obiettivo:'Recupero', ambito:'Caviglia',
  descrizione:'Seduti, con la gamba tesa e il piede sollevato, si «scrivono» nell\'aria le lettere dell\'alfabeto con la punta del piede.',
  serveA:'Muove la caviglia in tutte le direzioni senza carico: utile nei primi giorni dopo una distorsione.',
  lavora:{fondamentali:[], muscoli:['polpacci']}, difficolta:1, giocatori:[1,1], durata:4,
  dose:{serie:2, ripetizioni:1, lato:true}, materiale:['Sedia'], pacchetti:['pk-recupero','pk-casa'], tags:['caviglia','mobilità','distorsione'],
  passi:[
    ['Posizione','Seduto, gamba tesa, il piede da trattare sollevato da terra.',0],
    ['Scrivi','Con la punta del piede disegna le lettere dalla A alla Z, grandi e lente.',1],
    ['Ripeti','Riposa e ripeti, oppure cambia piede.',2]],
  attenzione:['Si muove solo la caviglia, la gamba resta ferma.','Lettere grandi, movimenti lenti.','Nessun dolore oltre 3 su 10.'],
  errori:[['Si muove tutta la gamba','Appoggia il polpaccio su un cuscino o su un\'altra sedia.'],['Le lettere sono piccole','Cerca il movimento più ampio possibile senza dolore.']],
  varianti:{facile:'Solo punta su e punta giù.', difficile:'Con un elastico leggero intorno all\'avampiede.'},
  anim:corpo('lato', [['seduto_punta_su',null,0.3],['seduto_punta_giu',1.0,0.3],['seduto_gamba_tesa',0.7,0.2]], {attrezzi:[{tipo:'sedia'}]})});

E({id:'rec-caviglia-equilibrio-palla', titolo:'Equilibrio su una gamba con la palla', obiettivo:'Recupero', ambito:'Caviglia',
  descrizione:'In equilibrio su una gamba, si passa la palla da sotto a sopra la testa, oppure si fanno passaggi con un compagno.',
  serveA:'Allena la caviglia a reagire mentre l\'attenzione è sulla palla, come in partita.',
  lavora:{fondamentali:[], muscoli:['polpacci','glutei','addome']}, difficolta:2, giocatori:[1,2], durata:5,
  dose:{serie:3, tempo:30, recupero:30, lato:true}, materiale:['Palloni'], pacchetti:['pk-recupero','pk-over45'], tags:['caviglia','propriocezione','ritorno al campo'],
  passi:[
    ['Su una gamba','In equilibrio su una gamba, palla tenuta davanti alla pancia.',0],
    ['Palla in alto','Porta lentamente la palla sopra la testa, mantenendo l\'equilibrio.',1],
    ['Giù','Riporta la palla davanti alla pancia. 30 secondi, poi cambia gamba.',2]],
  attenzione:['Ginocchio della gamba d\'appoggio appena piegato.','Bacino orizzontale.','Muovi la palla lentamente.'],
  errori:[['Il piede d\'appoggio si muove','Rallenta il movimento della palla e guarda un punto fisso.'],['Il bacino cade dal lato della gamba alzata','Stringi il gluteo della gamba d\'appoggio.']],
  varianti:{facile:'Palla ferma davanti al petto.', difficile:'Passaggi a due mani con un compagno a 3 metri.'},
  anim:corpo('fronte', [['f_equilibrio',null,0.4,{aN:[16,-78], aF:[16,-78]}],['f_equilibrio_palla',1.2,0.6],['f_equilibrio',1.2,0.3,{aN:[16,-78], aF:[16,-78]}]], {ancora:'anN', attrezzi:[{tipo:'palla', su:'mani', sopra:true}]})});

E({id:'rec-schiena-bambino', titolo:'Posizione del bambino', obiettivo:'Recupero', ambito:'Schiena',
  descrizione:'Dalla quadrupedia ci si siede all\'indietro sui talloni, con le braccia tese in avanti a terra e la fronte vicino al tappetino.',
  serveA:'Allunga dolcemente la schiena e i fianchi: utile a fine allenamento o quando la schiena è rigida.',
  lavora:{fondamentali:[], muscoli:['lombari','schiena']}, difficolta:1, giocatori:[1,1], durata:3,
  dose:{serie:2, tempo:30}, materiale:['Tappetino'], pacchetti:['pk-recupero','pk-casa'], tags:['schiena','allungamento','defaticamento'],
  passi:[
    ['Quadrupedia','Mani sotto le spalle, ginocchia sotto le anche.',0],
    ['Siediti indietro','Porta il bacino verso i talloni lasciando le mani dove sono. Fronte verso il tappetino.',1],
    ['Respira','Resta 30 secondi respirando lentamente, poi torna in quadrupedia.',2]],
  attenzione:['Le mani restano ferme: l\'allungamento viene dal bacino che va indietro.','Respira con la pancia.','Se le ginocchia fanno male, metti un cuscino dietro le ginocchia.'],
  errori:[['Fastidio alle ginocchia','Allarga un poco le ginocchia o metti un cuscino tra talloni e glutei.'],['Le spalle sono tese','Lascia scendere il petto verso il tappetino e rilassa il collo.']],
  varianti:{facile:'Non arrivare fino ai talloni.', difficile:'Sposta le mani verso destra e verso sinistra per allungare i fianchi.'},
  anim:corpo('lato', [['quadrupedia',null,0.4],['bambino',1.6,1.8],['quadrupedia',1.4,0.3]], {ancora:'haN', attrezzi:[{tipo:'tappetino', x:20, w:170}]})});

E({id:'rec-schiena-ginocchia-petto', titolo:'Ginocchia al petto', obiettivo:'Recupero', ambito:'Schiena',
  descrizione:'Da supini si portano le ginocchia verso il petto, aiutandosi con le mani, e si tiene la posizione respirando.',
  serveA:'Rilassa la zona lombare dopo l\'allenamento o una lunga giornata seduti.',
  lavora:{fondamentali:[], muscoli:['lombari','glutei']}, difficolta:1, giocatori:[1,1], durata:3,
  dose:{serie:3, tempo:20, recupero:15}, materiale:['Tappetino'], pacchetti:['pk-recupero','pk-casa'], tags:['schiena','rilassamento','lombare'],
  passi:[
    ['Supino','Supino con le ginocchia piegate e i piedi a terra.',0],
    ['Ginocchia al petto','Porta le ginocchia verso il petto e tienile con le mani. Resta 20 secondi.',1],
    ['Torna','Riporta i piedi a terra uno alla volta.',2]],
  attenzione:['Testa e spalle restano appoggiate.','Tira le ginocchia piano, senza forzare.','Respira lentamente.'],
  errori:[['La testa si solleva','Appoggia la testa e rilassa il collo; se serve tieni le mani dietro le cosce.'],['Si tira con forza','Basta un leggero allungamento: nessun dolore.']],
  varianti:{facile:'Un ginocchio alla volta.', difficile:'Piccole oscillazioni a destra e a sinistra.'},
  anim:corpo('lato', [['supino_ginocchia',null,0.4],['ginocchia_petto',1.4,1.6],['supino_ginocchia',1.4,0.2]], {ancora:'hip', attrezzi:[{tipo:'tappetino', x:20, w:170}]})});


/* =================================================================== AGGIUNTE 1.2 · TECNICA */
/* ---------- battuta */
E({id:'bat-coppie-6metri', titolo:'Battuta a coppie da 6 metri', obiettivo:'Tecnica', ambito:'Battuta',
  descrizione:'A coppie, ognuno a 6 metri dalla rete nel proprio campo: si batte al compagno, che blocca la palla al petto e ribatte.',
  serveA:'Riscalda la spalla e costruisce il gesto della battuta su una distanza corta, senza la paura della rete.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle']}, difficolta:1, giocatori:[2,12], durata:8,
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-riscaldamento','pk-principianti'], tags:['riscaldamento','coppie','tecnica di base'],
  passi:[
    ['Posizione','A e B a 6 metri dalla rete, uno per campo, piede opposto al braccio che colpisce davanti.',0],
    ['Battuta','A batte verso B con un colpo controllato, dal basso o dall\'alto.',1],
    ['Risposta','B blocca la palla al petto e batte a sua volta.',3]],
  attenzione:['Lancio basso e sempre nello stesso punto.','Mira al petto del compagno.','Si allunga la distanza solo quando le battute arrivano quasi tutte al compagno.'],
  errori:[['La palla arriva lontano dal compagno','Gira i piedi e le spalle verso il compagno prima del lancio.'],['Si batte subito forte','Prima 10 battute piano: è un riscaldamento.']],
  varianti:{facile:'Distanza di 4-5 metri.', difficile:'Ogni 5 battute riuscite si arretra di un passo, fino alla linea di fondo.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('a','A'), av('b','B'), pa()],
    fotogrammi:[F({a:[3.0,4.5], b:[15.0,4.5], pa:[3.3,4.3]},null,0.5), F({pa:[14.7,4.4]},1.3,0.4,2.2), F({pa:[14.75,4.35]},0.3,0.3,0.1), F({pa:[3.3,4.3]},1.3,0.6,2.2)]}});

E({id:'bat-zona-libera', titolo:'Battuta nella zona libera', obiettivo:'Tecnica', ambito:'Battuta',
  descrizione:'Due ricevitori si spostano nel campo avversario prima di ogni battuta; il battitore guarda dove sono e batte nella zona rimasta libera.',
  serveA:'Abitua a osservare la ricezione avversaria prima di battere, invece di battere sempre nello stesso punto.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle','obliqui']}, difficolta:3, giocatori:[3,10], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['battuta tattica','osservazione'],
  passi:[
    ['Guarda','Prima del lancio guarda dove si sono messi i due ricevitori.',0],
    ['Scegli','Scegli la zona più lontana da entrambi, spesso tra i due o dietro di loro.',1],
    ['Batti','Batti nella zona scelta. I ricevitori provano a prendere la palla: punto al battitore se non ci arrivano.',2]],
  attenzione:['Lo sguardo al campo avversario è parte della routine di battuta.','Le zone tra due ricevitori sono le più difficili da coprire.','Stesso lancio per tutte le direzioni.'],
  errori:[['Si guarda ma si batte sempre al centro','Prima del lancio orienta piedi e spalle verso la zona scelta.'],['Si cerca la riga e si sbaglia','Mira un metro dentro le linee: basta essere lontani dai ricevitori.']],
  varianti:{facile:'Un solo ricevitore.', difficile:'I ricevitori si spostano dopo che il battitore ha lanciato la palla.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('b','B'), av('r1','R1'), av('r2','R2'), pa()],
    fotogrammi:[F({b:[-0.8,2.0], r1:[16.2,2.4], r2:[15.6,6.8], pa:[-0.45,1.8]},null,0.8), F({r1:[16.8,3.6], r2:[16.6,7.4]},0.8,0.6), F({pa:[12.6,5.4]},1.6,0.9,2.4)]}});

E({id:'bat-salto-flottante', titolo:'Battuta in salto flottante', obiettivo:'Tecnica', ambito:'Battuta',
  descrizione:'Rincorsa di due passi da dietro la linea di fondo, lancio basso con una o due mani, salto e colpo secco senza rotazione.',
  serveA:'La palla colpita più in alto passa la rete con una traiettoria più tesa ed è più difficile da ricevere.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle','quadricipiti','polpacci']}, difficolta:4, giocatori:[2,12], durata:15,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['battuta in salto','flottante','avanzato'],
  passi:[
    ['Lancio','Da circa 2 metri dietro la linea di fondo, lancia la palla bassa e in avanti, verso la linea.',0],
    ['Rincorsa','Due passi verso la palla: l\'ultimo un po\' più lungo, con le braccia che salgono.',1],
    ['Salto e colpo','Salta prima della linea, colpisci la palla al centro con la mano rigida e ferma il braccio subito dopo il contatto.',2],
    ['Atterraggio','Puoi atterrare dentro il campo; poi entra in difesa.',3]],
  attenzione:['Lo stacco deve avvenire prima della linea di fondo.','Colpo secco e breve: il braccio non accompagna la palla.','Prima ci vuole una battuta dall\'alto sicura da terra.'],
  errori:[['La palla gira e cade lunga','Colpisci al centro, a mano rigida, e ferma il braccio subito dopo il contatto.'],['Il lancio va troppo avanti o troppo indietro','Prova il lancio da solo, senza colpire: la palla deve cadere un passo oltre il punto di stacco.']],
  varianti:{facile:'Battuta flottante da terra, con un passo di avvio.', difficile:'Battuta in salto mirata nelle zone 1 e 5.'},
  note:'Per atleti adulti: poche ripetizioni per serie e atterraggio sempre a due piedi.',
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('b','B'), pa()],
    fotogrammi:[F({b:[-1.3,4.5], pa:[-0.95,4.3]},null,0.6), F({pa:[-0.3,4.4]},0.6,0.0,0.6), F({b:[-0.5,4.5]},0.4,0.1), F({b:[0.4,4.5], pa:[15.6,6.6]},1.1,0.9,1.4)]}});

/* ---------- ricezione */
E({id:'ric-palleggio-alto', titolo:'Ricezione in palleggio delle palle alte', obiettivo:'Tecnica', ambito:'Ricezione',
  descrizione:'Su battute alte e lente, il ricevitore riceve in palleggio invece che in bagher, sopra la fronte, verso il palleggiatore.',
  serveA:'Le battute dal basso e quelle che arrivano all\'altezza delle spalle si controllano meglio in palleggio.',
  lavora:{fondamentali:['Ricezione','Palleggio'], muscoli:['spalle','quadricipiti']}, difficolta:2, giocatori:[3,4], durata:10,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['palleggio di ricezione','battuta dal basso'],
  passi:[
    ['Battuta alta','B batte dal basso una palla alta verso R.',1],
    ['Sotto la palla','R si sposta finché la palla scende sopra la sua fronte, poi si ferma con le mani pronte.',1],
    ['Palleggio a P','Palleggio alto e morbido verso P.',2]],
  attenzione:['Mani pronte sopra la fronte prima che arrivi la palla.','Si riceve in palleggio solo se la palla arriva sopra le spalle: le palle basse in bagher.','Contatto pulito con tutte le dita.'],
  errori:[['Palla trattenuta o doppia','Mani più rigide e contatto breve; se la palla arriva forte, meglio il bagher.'],['Si palleggia arretrando','Arretra prima e fermati: il palleggio parte con il peso in avanti.']],
  varianti:{facile:'Lancio a due mani invece della battuta.', difficile:'Alternare palle alte e tese: il ricevitore sceglie bagher o palleggio.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('r','R'), at('p','P'), av('b','B'), pa()],
    fotogrammi:[F({r:[2.2,4.5], p:[8.4,6.0], b:[19.3,4.5], pa:[19.05,4.3]},null,0.6), F({pa:[3.1,4.1], r:[2.9,4.3]},2.0,0.2,3.6), F({pa:[8.2,5.7]},1.3,1.0,2.6)]}});

E({id:'ric-due-battitori', titolo:'Ricezione con due battitori in successione', obiettivo:'Tecnica', ambito:'Ricezione',
  descrizione:'Due battitori dall\'altra parte battono uno dopo l\'altro, a pochi secondi di distanza: il ricevitore deve tornare pronto subito dopo ogni ricezione.',
  serveA:'Allena il ritorno in posizione e la concentrazione su più palle di fila, come in una serie di battute in partita.',
  lavora:{fondamentali:['Ricezione'], muscoli:['quadricipiti','adduttori']}, difficolta:3, giocatori:[4,5], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['ritmo','concentrazione'],
  passi:[
    ['Prima battuta','B1 batte da zona 1 avversaria: R riceve verso P.',1],
    ['Torna pronto','R torna subito nella posizione di attesa al centro.',2],
    ['Seconda battuta','B2 batte da zona 5 avversaria appena R è pronto: nuova ricezione.',3]],
  attenzione:['Dopo ogni ricezione torna al centro in posizione bassa.','Leggi da quale lato parte ogni battuta.','Serie di 6 palle, poi si cambia ricevitore.'],
  errori:[['Il ricevitore resta dove ha ricevuto','Dopo il contatto riporta i piedi al centro con passi laterali.'],['Le ultime ricezioni peggiorano','Serie più corte o pausa più lunga tra le battute: conta la qualità.']],
  varianti:{facile:'Un solo battitore, con più tempo tra le palle.', difficile:'I battitori cambiano zona a ogni battuta.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('r','R'), at('p','P'), av('b1','B1'), av('b2','B2'), pa('p1'), pa('p2')],
    fotogrammi:[F({r:[2.2,4.5], p:[8.4,6.0], b1:[19.3,1.4], b2:[19.3,7.6], p1:[19.05,1.7], p2:[19.05,7.3]},null,0.5),
      F({p1:[2.3,2.9], r:[2.1,3.1]},1.5,0.1,2.5), F({p1:[8.2,5.7], r:[2.2,4.5]},1.1,0.2,2.2), F({p2:[2.3,6.1], r:[2.1,6.0]},1.5,0.1,2.5), F({p2:[8.2,5.75]},1.1,0.9,2.2)]}});

E({id:'ric-passo-incrociato', titolo:'Ricezione lontana con passo incrociato', obiettivo:'Tecnica', ambito:'Ricezione',
  descrizione:'Su una battuta che cade lontano di lato, il ricevitore fa un passo incrociato per arrivare prima, poi si ferma di fianco e riceve.',
  serveA:'Le palle a 2-3 metri di lato non si raggiungono con i soli passi laterali.',
  lavora:{fondamentali:['Ricezione','Difesa'], muscoli:['quadricipiti','adduttori','glutei']}, difficolta:3, giocatori:[2,4], durata:10,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['spostamenti','passo incrociato'],
  passi:[
    ['Partenza','R al centro della seconda linea, in posizione di attesa.',0],
    ['Passo incrociato','La palla va lontano a destra: il piede sinistro incrocia davanti al destro, poi un passo laterale per fermarsi.',1],
    ['Ricezione di lato','Abbassa la spalla esterna e riceve con le braccia rivolte verso P.',2]],
  attenzione:['Prima il passo incrociato, poi il passo di arresto.','Al contatto i piedi sono fermi e larghi.','La spalla esterna è più bassa per mandare la palla verso l\'interno.'],
  errori:[['Si arriva in corsa e la palla va fuori','Il passo di arresto è indispensabile: fermati anche solo un attimo.'],['La palla rimbalza verso l\'esterno','Abbassa la spalla esterna e ruota il busto verso il palleggiatore.']],
  varianti:{facile:'L\'allenatore lancia la palla da vicino, a 2 metri dal ricevitore.', difficile:'Palle lunghe a destra e a sinistra alternate, su battuta.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('r','R'), at('p','P'), all(), pa()],
    fotogrammi:[F({r:[2.2,4.0], p:[8.4,6.0], all:[11.2,4.5], pa:[11.0,4.25]},null,0.6), F({r:[2.4,6.8], pa:[2.6,6.95]},1.2,0.2,2.2), F({pa:[8.2,5.7]},1.3,1.0,2.4)]}});

/* ---------- palleggio */
E({id:'pal-alzata-bagher', titolo:'Alzata in bagher', obiettivo:'Tecnica', ambito:'Palleggio',
  descrizione:'Quando la palla arriva bassa o lontana dalla rete, l\'alzata si fa in bagher: alta, lenta e verso la zona 4.',
  serveA:'Non tutte le palle si possono palleggiare: un bagher alto e preciso salva l\'attacco.',
  lavora:{fondamentali:['Palleggio','Ricezione'], muscoli:['quadricipiti','spalle']}, difficolta:2, giocatori:[3,4], durata:10,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['alzata di emergenza','bagher'],
  passi:[
    ['Palla bassa','L\'allenatore lancia una palla bassa vicino alla linea dei 3 metri.',1],
    ['Orientati','Chi alza arriva sotto la palla e si gira verso la zona 4, spalle già orientate.',1],
    ['Bagher alto','Bagher lento e alto, che scende a un metro dalla rete in zona 4. A blocca o attacca.',2]],
  attenzione:['Prima girati verso la zona 4, poi colpisci.','Bagher alto: dà tempo all\'attaccante.','Braccia accompagnano verso il bersaglio, senza spinta delle spalle.'],
  errori:[['Il bagher va basso e veloce','Spingi con le gambe verso l\'alto e tieni le braccia più basse.'],['La palla va verso la rete','Orienta le spalle verso la zona 4 prima del contatto, non verso la rete.']],
  varianti:{facile:'L\'attaccante blocca la palla invece di attaccarla.', difficile:'Lanci da posizioni diverse; chi alza sceglie tra palleggio e bagher.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('g','G'), at('a','A'), all(), pa()],
    fotogrammi:[F({g:[5.0,6.4], a:[5.0,0.6], all:[11.2,6.0], pa:[11.0,5.75]},null,0.6), F({pa:[5.6,5.9], g:[5.4,6.1]},1.4,0.2,2.2), F({pa:[8.0,1.6], a:[7.3,1.4]},1.6,0.9,3.6)]}});

E({id:'pal-alzata-salto', titolo:'Alzata in salto', obiettivo:'Tecnica', ambito:'Palleggio',
  descrizione:'Il palleggiatore salta e alza nel punto più alto del salto: la palla parte più vicina alla rete e il muro ha meno tempo per leggerla.',
  serveA:'Velocizza il gioco e permette al palleggiatore di attaccare di seconda.',
  lavora:{fondamentali:['Palleggio'], muscoli:['polpacci','quadricipiti','spalle']}, difficolta:4, giocatori:[3,4], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['palleggiatore','avanzato'],
  passi:[
    ['Palla alta','L\'allenatore lancia una palla alta, a mezzo metro dalla rete.',1],
    ['Salta','P arriva sotto la palla, stacca a due piedi e porta le mani sopra la fronte.',1],
    ['Alza in alto','Alza nel punto più alto del salto, verso la zona 4. Atterra nel punto di stacco.',2]],
  attenzione:['Prima arriva sotto la palla, poi salta.','La palla si tocca nel punto più alto del salto.','Atterraggio a due piedi, senza toccare la rete.'],
  errori:[['Si alza mentre si sta scendendo','Salta un attimo più tardi.'],['L\'alzata è corta','In salto le gambe non spingono: serve più spinta di braccia e polsi.']],
  varianti:{facile:'Salto piccolo, quasi sulle punte.', difficile:'Alzata in salto alternando zona 4, zona 2 e primo tempo.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('p','P'), at('a','A'), all(), pa()],
    fotogrammi:[F({p:[7.9,5.6], a:[5.0,0.6], all:[4.4,4.8], pa:[4.75,4.6]},null,0.5), F({pa:[8.3,5.4], p:[8.4,5.6]},1.3,0.1,2.8), F({pa:[8.0,1.6], a:[7.3,1.4]},1.3,0.9,3.0)]}});

E({id:'pal-cerchi', titolo:'Alzate nei cerchi', obiettivo:'Tecnica', ambito:'Palleggio',
  descrizione:'Tre cerchi a terra segnano dove devono cadere le alzate in zona 4, zona 3 e zona 2. L\'allenatore chiama la zona mentre la palla arriva.',
  serveA:'La precisione dell\'alzata si misura dove cade la palla: i cerchi la rendono visibile.',
  lavora:{fondamentali:['Palleggio'], muscoli:['spalle']}, difficolta:3, giocatori:[2,3], durata:12,
  materiale:['Palloni','Coni'], materialeNote:'3 cerchi o tappetini', pacchetti:['pk-fondamentali'], tags:['precisione','alzatore'],
  passi:[
    ['Arriva la palla','L\'allenatore lancia una palla alta al palleggiatore.',0],
    ['Chiamata','Mentre la palla è in aria l\'allenatore chiama: «quattro», «tre» o «due».',1],
    ['Alzata','P alza: la palla deve cadere nel cerchio chiamato. Si contano i centri su 10.',2]],
  attenzione:['Stessa posizione di partenza per tutte le alzate.','Alzata in 4 alta, in 3 bassa e vicina, in 2 dietro e più tesa.','Guarda la palla, non il cerchio.'],
  errori:[['Le alzate in 4 sono corte','Spinta di gambe e braccia insieme, braccia distese fino in fondo.'],['L\'alzata dietro finisce sulla rete','Spingi la palla verso l\'alto prima che indietro.']],
  varianti:{facile:'La zona si chiama prima del lancio.', difficile:'Il palleggiatore parte da zona 1 e corre a rete.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('p','P'), all(), be('c4'), be('c3'), be('c2'), pa()],
    fotogrammi:[F({p:[8.3,5.6], all:[4.0,5.0], c4:[8.0,1.2], c3:[8.2,4.4], c2:[8.0,7.9], pa:[4.35,4.8]},null,0.5), F({pa:[8.1,5.4]},1.2,0.3,2.4), F({pa:[8.0,1.3]},1.4,0.9,3.2)]}});

/* ---------- attacco */
E({id:'att-primo-tempo', titolo:'Primo tempo del centrale', obiettivo:'Tecnica', ambito:'Attacco',
  descrizione:'Il centrale parte prima che la palla arrivi al palleggiatore e salta davanti a lui; il palleggiatore alza una palla bassa e veloce, che il centrale colpisce subito.',
  serveA:'L\'attacco più veloce: tiene fermo il muro avversario al centro e libera gli attaccanti di banda.',
  lavora:{fondamentali:['Attacco','Palleggio'], muscoli:['quadricipiti','polpacci','spalle']}, difficolta:4, giocatori:[3,6], durata:15,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['centrale','veloce','primo tempo'],
  passi:[
    ['Partenza anticipata','L\'allenatore lancia la palla a P. Il centrale C parte quando la palla è a metà strada.',1],
    ['Salto davanti a P','C stacca a un metro davanti a P e sale con il braccio già caricato.',2],
    ['Colpo veloce','P alza bassa, poco sopra la rete; C colpisce subito, con un movimento corto del polso.',3]],
  attenzione:['Il centrale è già in aria quando P tocca la palla.','Braccio caricato durante la salita: non c\'è tempo per caricare dopo.','Colpo corto e veloce, anche solo di polso.'],
  errori:[['Il centrale arriva tardi e la palla gli passa sopra','Parti prima: il riferimento è la palla che arriva a P, non l\'alzata.'],['L\'alzata è troppo alta','P spinge poco e veloce, appena sopra il bordo della rete.']],
  varianti:{facile:'Primo tempo staccato: alzata un po\' più alta, il centrale salta quando la palla parte.', difficile:'Su ricezione vera, con un muro avversario.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('c','C'), at('p','P'), all(), pa()],
    fotogrammi:[F({c:[5.4,4.6], p:[8.4,6.0], all:[4.0,6.8], pa:[4.35,6.6]},null,0.6), F({pa:[6.6,6.2], c:[6.6,4.9]},0.6,0.0,1.4), F({pa:[8.2,5.75], c:[8.0,5.0]},0.5,0.0,0.9), F({pa:[8.0,5.2]},0.25,0.0,0.4), F({pa:[14.6,3.6]},0.4,1.0,0.3)]}});

E({id:'att-palla-staccata', titolo:'Attacco su palla staccata dalla rete', obiettivo:'Tecnica', ambito:'Attacco',
  descrizione:'L\'alzata arriva a 2-3 metri dalla rete, dopo una ricezione imprecisa: l\'attaccante la colpisce forte ma verso il fondo del campo avversario.',
  serveA:'In partita molte alzate sono lontane dalla rete: bisogna saperle trasformare in un attacco sicuro.',
  lavora:{fondamentali:['Attacco'], muscoli:['spalle','obliqui','quadricipiti']}, difficolta:3, giocatori:[2,8], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['palla difficile','alzata lontana'],
  passi:[
    ['Alzata lontana','L\'allenatore alza una palla alta che scende a 2-3 metri dalla rete in zona 4.',1],
    ['Rincorsa adattata','A parte più indietro e rincorre la palla: la rincorsa va verso la palla, non verso la rete.',2],
    ['Colpo lungo','Colpisce sopra la palla, con il polso che spinge in avanti: la palla scende in fondo al campo avversario.',3]],
  attenzione:['Rincorsa verso la palla.','Colpo sopra la palla e in avanti: dalla distanza la rete è alta.','Se la palla è troppo lontana, palla piazzata nella zona libera.'],
  errori:[['La palla va in rete','Colpisci più verso il fondo del campo avversario: serve una traiettoria più lunga.'],['Si corre verso la rete e la palla resta dietro','Guarda dove scende la palla prima di partire.']],
  varianti:{facile:'Palla lanciata più vicina, a 1,5 metri.', difficile:'Con un muro avversario.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('a','A'), all(), pa()],
    fotogrammi:[F({a:[3.4,0.6], all:[5.0,5.0], pa:[5.35,4.8]},null,0.6), F({pa:[6.2,1.8]},1.5,0.1,3.4), F({a:[5.6,1.6]},0.4,0.1), F({pa:[16.4,4.0]},0.7,1.0,0.9)]}});

E({id:'att-autolancio-coppie', titolo:'Attacco su autolancio a coppie', obiettivo:'Tecnica', ambito:'Attacco',
  descrizione:'A coppie, uno di fronte all\'altro: ci si lancia la palla da soli e la si attacca verso il compagno, che la difende e ricomincia.',
  serveA:'Ripete tante volte il colpo d\'attacco senza saltare: ottimo come riscaldamento della spalla.',
  lavora:{fondamentali:['Attacco','Difesa'], muscoli:['spalle']}, difficolta:1, giocatori:[2,2], durata:8,
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-riscaldamento','pk-principianti'], tags:['riscaldamento','colpo','coppie'],
  passi:[
    ['Autolancio','A si lancia la palla davanti alla spalla del braccio che colpisce.',1],
    ['Colpo','Colpisce la palla con la mano aperta, polso morbido, verso terra davanti a B: la palla rimbalza.',2],
    ['Risposta','B riceve il rimbalzo, si lancia la palla e attacca a sua volta.',3]],
  attenzione:['Gomito alto, all\'altezza dell\'orecchio.','La mano avvolge la palla e il polso chiude verso il basso.','Si comincia piano.'],
  errori:[['La palla va dritta, senza rotazione','Chiudi il polso sopra la palla a fine colpo.'],['Il gomito è basso','Carica il braccio prima del lancio, gomito in alto.']],
  varianti:{facile:'Colpo direttamente al compagno, senza rimbalzo.', difficile:'Il compagno difende la palla attaccata invece di prenderla al rimbalzo.'},
  anim:{tipo:'campo', vista:'meta', elementi:[at('a','A'), at('b','B'), pa()],
    fotogrammi:[F({a:[2.4,4.5], b:[6.8,4.5], pa:[2.7,4.3]},null,0.3), F({pa:[2.75,4.25]},0.6,0.1,1.4), F({pa:[5.0,4.4]},0.25,0.0,0.1), F({pa:[6.5,4.4]},0.5,0.6,0.8)]}});

/* ---------- muro */
E({id:'muro-rialzo', titolo:'Muro sull\'attacco dal rialzo', obiettivo:'Tecnica', ambito:'Muro',
  descrizione:'L\'allenatore, su un rialzo stabile dall\'altra parte della rete, attacca sulle mani del murista: si allena solo la posizione delle mani.',
  serveA:'Mani forti e ben piazzate sopra la rete, senza il problema del tempo del salto.',
  lavora:{fondamentali:['Muro'], muscoli:['spalle','tricipiti']}, difficolta:2, giocatori:[2,6], durata:10,
  materiale:['Palloni'], materialeNote:'un rialzo stabile per l\'allenatore', pacchetti:['pk-fondamentali'], tags:['mani','posizione'],
  passi:[
    ['Posizione','M a un braccio dalla rete, davanti all\'allenatore.',0],
    ['Salto','Quando l\'allenatore carica il colpo, M salta con le mani dritte sopra la rete.',1],
    ['Mani forti','Mani aperte, dita larghe, polsi fermi e inclinati verso il campo avversario: la palla rimbalza giù dall\'altra parte.',2]],
  attenzione:['Mani sopra la rete, non davanti al petto.','Polsi fermi e pollici verso l\'alto.','Guarda la palla fino al contatto.'],
  errori:[['La palla rimbalza nel nostro campo','Porta le mani oltre la rete e inclina i polsi verso il basso.'],['Le mani si piegano all\'indietro','Tieni le braccia tese e i polsi rigidi.']],
  varianti:{facile:'Senza salto, sulle punte, con la rete abbassata.', difficile:'L\'allenatore cambia direzione all\'ultimo.'},
  anim:{tipo:'campo', vista:'meta', elementi:[at('m','M'), av('all','All'), pa()],
    fotogrammi:[F({m:[8.3,4.5], all:[10.0,4.5], pa:[10.0,4.0]},null,0.7), F({pa:[9.2,4.4]},0.3,0.0,0.1), F({pa:[10.4,5.4]},0.5,0.9,0.4)]}});

E({id:'muro-a-tre', titolo:'Muro a tre sulla palla alta', obiettivo:'Tecnica', ambito:'Muro',
  descrizione:'Su un\'alzata alta e lenta in zona 4 avversaria, il centrale e anche il laterale opposto chiudono il muro a tre accanto al laterale.',
  serveA:'Contro un attaccante forte e un\'alzata lenta, tre muri riducono quasi a niente gli spazi di attacco.',
  lavora:{fondamentali:['Muro'], muscoli:['quadricipiti','polpacci']}, difficolta:4, giocatori:[4,8], durata:12,
  materiale:['Palloni'], pacchetti:['pk-fondamentali','pk-gioco'], tags:['palla alta','spostamenti'],
  passi:[
    ['Palla alta','L\'alzatore avversario alza alto in zona 4.',1],
    ['Chiusura','Il laterale L2 fissa il muro; il centrale C e il laterale L4 corrono verso di lui.',2],
    ['Salto insieme','Saltano insieme, spalla a spalla, con le mani vicine.',3]],
  attenzione:['Il muro a tre si fa solo su palle alte e lente.','Chi arriva da più lontano corre, poi l\'ultimo passo è laterale.','Dietro, la difesa copre il pallonetto e la diagonale corta.'],
  errori:[['Il terzo muro arriva tardi e lascia un buco','Se non fai in tempo, resta a difendere la palla corta.'],['I tre si scontrano','Il laterale fissa il punto e non si muove: gli altri si adeguano a lui.']],
  varianti:{facile:'Muro a tre a terra, solo spostamento e posizione.', difficile:'Alzata alta in 4 o in 2: si sceglie dove fare il muro a tre.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('l4','L4'), at('c','C'), at('l2','L2'), av('al','Al'), av('a','A'), pa()],
    fotogrammi:[F({l4:[8.5,1.6], c:[8.5,4.5], l2:[8.5,7.6], al:[9.9,4.6], a:[12.8,8.4], pa:[10.15,4.4]},null,0.6), F({pa:[10.4,7.5]},1.6,0.1,3.6), F({c:[8.5,6.6], l4:[8.5,5.2], l2:[8.5,8.0], a:[10.9,7.3]},0.9,0.2), F({pa:[9.15,7.0]},0.3,0.9,0.2)]}});

E({id:'muro-chiudi-diagonale', titolo:'Muro che chiude la diagonale', obiettivo:'Tecnica', ambito:'Muro',
  descrizione:'Il murista si sposta di mezzo passo verso l\'interno del campo e chiude la diagonale; la parallela è lasciata al difensore di zona 1 o 5.',
  serveA:'Muro e difesa lavorano insieme: il muro toglie una direzione e la difesa aspetta l\'altra.',
  lavora:{fondamentali:['Muro','Difesa'], muscoli:['quadricipiti']}, difficolta:3, giocatori:[3,6], durata:12,
  materiale:['Palloni'], materialeNote:'un rialzo per l\'allenatore', pacchetti:['pk-fondamentali','pk-gioco'], tags:['muro e difesa','sistema'],
  passi:[
    ['Posizione','M in zona 2 a muro; D in zona 1. L\'allenatore attacca dalla zona 4 avversaria.',0],
    ['Chiudi la diagonale','M si mette con la mano esterna sulla palla e il corpo verso l\'interno: copre la diagonale.',1],
    ['Difesa in parallela','D sa che la palla può arrivare solo lungo la linea e la difende alta.',2]],
  attenzione:['Il murista decide prima cosa chiudere e lo dice al difensore.','Il difensore resta fuori dall\'ombra del muro.','Mani del muro ferme sopra la rete.'],
  errori:[['Muro e difesa coprono la stessa zona','Il difensore si mette dove il muro non arriva.'],['Il muro si sposta all\'ultimo e apre tutto','Scegli la posizione prima del salto e tienila.']],
  varianti:{facile:'L\'allenatore dice prima dove attaccherà.', difficile:'L\'allenatore può anche fare un pallonetto dietro il muro.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('m','M'), at('d','D'), av('all','All'), pa()],
    fotogrammi:[F({m:[8.5,7.4], d:[2.6,7.3], all:[10.8,7.6], pa:[10.6,7.35]},null,0.6), F({m:[8.5,6.8], d:[2.8,8.1]},0.6,0.4), F({pa:[3.0,7.95]},0.6,0.1,0.4), F({pa:[6.6,5.2]},1.2,0.9,2.8)]}});

/* ---------- difesa */
E({id:'dif-zona6-lunga', titolo:'Difesa della palla lunga in zona 6', obiettivo:'Tecnica', ambito:'Difesa',
  descrizione:'Il difensore di zona 6 parte a circa 7-8 metri dalla rete e difende gli attacchi lunghi e i colpi sopra il muro diretti verso il fondo.',
  serveA:'La zona 6 copre la parte del campo più grande: deve leggere la direzione e muoversi presto.',
  lavora:{fondamentali:['Difesa'], muscoli:['quadricipiti','polpacci']}, difficolta:3, giocatori:[2,4], durata:10,
  materiale:['Palloni'], materialeNote:'un rialzo per l\'allenatore', pacchetti:['pk-fondamentali'], tags:['zona 6','palle lunghe'],
  passi:[
    ['Posizione','D in zona 6, vicino alla linea di fondo, in posizione bassa.',0],
    ['Lettura','L\'allenatore attacca lungo o sopra le mani di un muro immaginario: D si sposta verso la palla.',1],
    ['Difesa alta','Difende la palla alta verso il centro; se arriva sopra le spalle, la palleggia.',2]],
  attenzione:['Peso in avanti anche quando sei in fondo.','Sulle palle alte usa le mani sopra la testa.','Difendi verso il centro del campo, non in avanti verso la rete.'],
  errori:[['Il difensore arretra e cade all\'indietro','Parti già in fondo: le palle arrivano verso di te, non dietro di te.'],['Le palle sopra le spalle finiscono fuori','Usa il palleggio o le mani unite sopra la testa.']],
  varianti:{facile:'Lanci alti a due mani.', difficile:'Attacchi corti e lunghi alternati.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('d','D'), all(), pa()],
    fotogrammi:[F({d:[0.9,4.5], all:[10.8,2.4], pa:[10.6,2.2]},null,0.7), F({d:[1.2,3.6], pa:[1.4,3.5]},0.9,0.1,1.2), F({pa:[6.0,4.5]},1.3,0.9,3.0)]}});

E({id:'dif-prima-linea-pallonetto', titolo:'Difesa del pallonetto dalla prima linea', obiettivo:'Tecnica', ambito:'Difesa',
  descrizione:'Il giocatore di prima linea che non va a muro si stacca dalla rete e difende i pallonetti che cadono dietro il muro, vicino alla linea dei 3 metri.',
  serveA:'Senza un compagno che copre il pallonetto, ogni palla piazzata dietro il muro diventa un punto per l\'avversario.',
  lavora:{fondamentali:['Difesa'], muscoli:['quadricipiti']}, difficolta:3, giocatori:[3,6], durata:12,
  materiale:['Palloni'], materialeNote:'un rialzo per l\'allenatore', pacchetti:['pk-fondamentali','pk-gioco'], tags:['pallonetto','prima linea'],
  passi:[
    ['Muro e stacco','M va a muro in zona 2; S, in zona 4, non mura e arretra fino alla linea dei 3 metri.',1],
    ['Pallonetto','L\'allenatore fa un pallonetto dietro il muro.',2],
    ['Difesa','S legge la palla e la difende alta verso il centro.',3]],
  attenzione:['Chi non mura si stacca dalla rete subito.','Resta basso e con il peso in avanti: il pallonetto è lento ma corto.','Difendi alto, verso il palleggiatore.'],
  errori:[['S resta a rete a guardare','Appena capisci che l\'attacco è dall\'altra parte, arretra.'],['La palla viene spinta in rete','Piano delle braccia rivolto verso l\'alto, non verso la rete.']],
  varianti:{facile:'L\'allenatore fa solo pallonetti.', difficile:'L\'allenatore alterna attacco forte e pallonetto.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('m','M'), at('s','S'), all(), pa()],
    fotogrammi:[F({m:[8.5,7.4], s:[8.5,1.6], all:[10.8,7.6], pa:[10.6,7.35]},null,0.6), F({s:[5.6,3.2], m:[8.5,6.9]},0.8,0.3), F({pa:[6.0,4.4]},1.0,0.1,2.0), F({pa:[7.4,5.4]},0.9,0.9,2.4)]}});

E({id:'dif-tre-palle', titolo:'Difesa in serie: tre palle di fila', obiettivo:'Tecnica', ambito:'Difesa',
  descrizione:'L\'allenatore attacca tre palle di fila a destra, al centro e a sinistra del difensore, che dopo ogni difesa torna subito in posizione.',
  serveA:'Allena la reazione e il ritorno in posizione bassa, come negli scambi lunghi.',
  lavora:{fondamentali:['Difesa'], muscoli:['quadricipiti','glutei','adduttori']}, difficolta:3, giocatori:[2,4], durata:10,
  materiale:['Palloni'], pacchetti:['pk-fondamentali'], tags:['reattività','resistenza'],
  passi:[
    ['Prima palla','Attacco a destra del difensore: spostamento e difesa alta.',1],
    ['Seconda palla','Il difensore torna al centro; attacco centrale.',3],
    ['Terza palla','Attacco a sinistra. Poi riposo e cambio.',5]],
  attenzione:['Dopo ogni difesa torna in posizione bassa prima del colpo successivo.','Difese alte e al centro.','Serie brevi: tre palle, poi pausa.'],
  errori:[['Il difensore si alza tra una palla e l\'altra','Resta basso come se avessi un soffitto sopra la testa.'],['La terza difesa è sempre peggio','L\'allenatore aspetta che il difensore sia pronto: conta la qualità.']],
  varianti:{facile:'Lanci a due mani invece di attacchi.', difficile:'Cinque palle di fila.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('d','D'), all(), pa('p1'), pa('p2'), pa('p3')],
    fotogrammi:[F({d:[2.4,4.5], all:[10.6,4.5], p1:[10.4,4.2], p2:[11.2,5.0], p3:[11.4,5.3]},null,0.6),
      F({p1:[2.6,3.2], d:[2.4,3.4]},0.6,0.1,0.4), F({p1:[6.4,4.0], d:[2.4,4.5], p2:[10.4,4.25]},1.1,0.2,2.6), F({p2:[2.65,4.4]},0.6,0.1,0.4), F({p2:[6.4,4.6], p3:[10.4,4.3], d:[2.4,5.7]},1.1,0.2,2.6), F({p3:[2.65,5.8]},0.6,0.1,0.4), F({p3:[6.4,5.2]},1.1,0.9,2.6)]}});

/* =================================================================== AGGIUNTE 1.2 · GIOCO E TATTICA */
/* ---------- cambio palla */
E({id:'tat-cp-p6', titolo:'Cambio palla con il palleggiatore in zona 6', obiettivo:'Tattica', ambito:'Cambio palla',
  descrizione:'Rotazione con il palleggiatore in zona 6: è nascosto dietro i ricevitori e al colpo della battuta corre a rete passando tra loro.',
  serveA:'La penetrazione dal centro è la più lunga: va provata finché diventa sicura e non ostacola chi riceve.',
  lavora:{fondamentali:['Ricezione','Palleggio','Attacco'], muscoli:[]}, difficolta:3, giocatori:[7,12], durata:15,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['senza libero','rotazioni','penetrazione'],
  passi:[
    ['Formazione','P in zona 6, appena dietro i due ricevitori centrali. In prima linea due attaccanti e il centrale.',0],
    ['Penetrazione','Al colpo della battuta P corre a rete passando tra i ricevitori, senza tagliare la traiettoria della palla.',1],
    ['Ricezione','Il ricevitore manda la palla verso il posto di P.',1],
    ['Alzata','P alza in zona 4 o in zona 2.',3]],
  attenzione:['P parte quando la palla lascia la mano del battitore.','I ricevitori si allargano un poco per lasciare il corridoio.','La ricezione va al posto di P, non dove P si trova in quel momento.'],
  errori:[['P ostacola il ricevitore','Corri lungo la linea tra due ricevitori, non davanti a loro.'],['Fallo di posizione al momento della battuta','Prima del colpo P deve essere dietro il ricevitore di zona 3 e fra i giocatori di zona 1 e 5.']],
  varianti:{facile:'Battuta dal basso.', difficile:'Il palleggiatore sceglie tra tre attaccanti, compreso il primo tempo.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('p','P'), at('s1','S1'), at('c','C'), at('o','O'), at('r5','R5'), at('r1','R1'), av('b','B'), pa()],
    fotogrammi:[F({p:[0.9,4.4], s1:[5.0,1.4], c:[8.3,3.4], o:[8.3,8.2], r5:[2.4,2.2], r1:[2.4,6.4], b:[19.3,6.0], pa:[19.05,5.7]},null,0.6),
      F({p:[8.4,5.9], pa:[2.6,6.25]},1.6,0.1,2.6), F({pa:[8.2,5.6]},1.2,0.1,2.2), F({pa:[8.0,1.6], s1:[7.3,1.4]},1.3,0.1,3.0), F({pa:[15.4,6.2]},0.5,1.0,0.5)]}});

E({id:'tat-cp-p5', titolo:'Cambio palla con il palleggiatore in zona 5', obiettivo:'Tattica', ambito:'Cambio palla',
  descrizione:'Rotazione con il palleggiatore in zona 5: parte dall\'angolo in fondo a sinistra e attraversa il campo in diagonale fino a rete.',
  serveA:'È la penetrazione più lunga in diagonale: il ricevitore di zona 4 deve lasciare libero il passaggio.',
  lavora:{fondamentali:['Ricezione','Palleggio','Attacco'], muscoli:[]}, difficolta:3, giocatori:[7,12], durata:15,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['senza libero','rotazioni','penetrazione'],
  passi:[
    ['Formazione','P in zona 5, dietro al giocatore di zona 4. Ricevono gli altri tre in seconda linea.',0],
    ['Corsa in diagonale','Al colpo della battuta P corre in diagonale fino al suo posto tra le zone 2 e 3.',1],
    ['Ricezione e alzata','La ricezione va al posto di P, che alza in zona 4.',3]],
  attenzione:['Corsa lungo la diagonale, senza passare davanti ai ricevitori.','Il giocatore di zona 4 si sposta verso la rete per lasciare spazio.','P si gira verso il campo appena arriva.'],
  errori:[['P arriva tardi a rete','Parti al colpo del battitore e corri guardando la palla.'],['Ricezione verso il punto in cui P è partito','I ricevitori mirano al posto fisso del palleggiatore, non a lui.']],
  varianti:{facile:'Battuta dal basso.', difficile:'Battuta forte e alzata anche al centrale.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('p','P'), at('s4','S4'), at('c','C'), at('o','O'), at('r6','R6'), at('r1','R1'), av('b','B'), pa()],
    fotogrammi:[F({p:[1.0,0.7], s4:[6.4,1.4], c:[8.3,4.4], o:[8.3,8.2], r6:[2.4,4.2], r1:[2.4,6.8], b:[19.3,3.0], pa:[19.05,3.3]},null,0.6),
      F({p:[8.4,5.9], pa:[2.6,4.05]},1.6,0.1,2.6), F({pa:[8.2,5.6]},1.2,0.1,2.2), F({pa:[8.0,1.6], s4:[7.3,1.4]},1.3,0.1,3.0), F({pa:[15.4,6.0]},0.5,1.0,0.5)]}});

E({id:'tat-cp-punteggio', titolo:'Cambio palla a punteggio: 10 battute', obiettivo:'Tattica', ambito:'Cambio palla',
  descrizione:'La squadra in ricezione riceve 10 battute e gioca ogni azione fino al punto. Si contano i cambi palla riusciti; poi le squadre si scambiano.',
  serveA:'Misura in modo semplice quanto la squadra è efficace in ricezione-attacco, la fase che decide le partite.',
  lavora:{fondamentali:['Ricezione','Palleggio','Attacco'], muscoli:[]}, difficolta:3, giocatori:[10,14], durata:20,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['partitella','obiettivo','misurare'],
  passi:[
    ['Battuta','La squadra B batte 10 volte; la squadra A riceve.',1],
    ['Azione','Si gioca il punto fino in fondo.',3],
    ['Conta','A segna un punto ogni cambio palla vinto. Obiettivo: almeno 6 su 10. Poi si scambiano.',4]],
  attenzione:['Scrivete il risultato: si vede il miglioramento nelle settimane.','Dopo ogni azione la squadra torna subito in formazione.','Si ruota ogni 2 battute, così tutti ricevono.'],
  errori:[['Ci si demoralizza dopo due errori','Ogni battuta è una nuova azione: chiamate «la prossima» e ripartite.'],['Si attacca forte anche su ricezioni pessime','Su palla difficile, palla piazzata in zona libera: conta tenere vivo il punto.']],
  varianti:{facile:'Battuta dal basso; vale anche il punto ottenuto con la palla tenuta in gioco.', difficile:'Obiettivo 7 su 10 con battuta forte.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('s','S'), at('p','P'), at('r','R'), av('b','B'), av('d','D'), pa()],
    fotogrammi:[F({s:[5.2,1.0], p:[8.3,6.0], r:[2.2,4.4], b:[19.3,4.5], d:[15.6,4.0], pa:[19.05,4.3]},null,0.6), F({pa:[2.45,4.25]},1.6,0.1,2.6), F({pa:[8.1,5.7]},1.1,0.1,2.2), F({pa:[8.0,1.6], s:[7.3,1.4]},1.4,0.1,3.0), F({pa:[13.0,6.8], d:[14.2,4.8]},0.5,1.0,0.5)]}});

E({id:'tat-cp-battitore-mira', titolo:'Cambio palla contro la battuta mirata', obiettivo:'Tattica', ambito:'Cambio palla',
  descrizione:'Il battitore avversario batte sempre sullo stesso ricevitore. I compagni allargano la loro zona per aiutarlo e chi riceve sa che attaccherà l\'altro schiacciatore.',
  serveA:'In partita gli avversari battono su chi riceve peggio: la squadra deve saperlo proteggere.',
  lavora:{fondamentali:['Ricezione','Attacco'], muscoli:[]}, difficolta:4, giocatori:[8,12], durata:15,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['senza libero','strategia','protezione'],
  passi:[
    ['Formazione stretta','I due compagni vicini a R2 si avvicinano: la zona di R2 diventa più piccola.',0],
    ['Battuta su R2','La battuta arriva sempre su R2 o nelle sue vicinanze; chi può, la prende al posto suo.',1],
    ['Alzata all\'altro','Dopo la ricezione, P alza all\'attaccante che non ha ricevuto.',3]],
  attenzione:['I compagni prendono le palle tra loro e R2.','R2 si concentra solo sulla ricezione.','Il palleggiatore cerca l\'attaccante più libero.'],
  errori:[['R2 viene lasciato solo','Chiamate prima chi prende le palle in mezzo: in questo esercizio le prende il compagno.'],['Si alza sempre a chi ha ricevuto','L\'attaccante che non ha ricevuto è più pronto: alza a lui.']],
  varianti:{facile:'Battuta dal basso, sempre al centro.', difficile:'Il battitore sceglie a sorpresa tra due ricevitori.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('r1','R1'), at('r2','R2'), at('r3','R3'), at('p','P'), at('s','S'), av('b','B'), pa()],
    fotogrammi:[F({r1:[2.4,1.8], r2:[2.0,4.6], r3:[2.4,7.2], p:[8.4,6.0], s:[5.0,0.6], b:[19.3,4.5], pa:[19.05,4.3]},null,0.6),
      F({r1:[2.4,2.9], r3:[2.4,6.3]},0.6,0.3), F({pa:[2.6,3.2], r1:[2.5,3.1]},1.6,0.1,2.6), F({pa:[8.1,5.7]},1.1,0.1,2.2), F({pa:[8.0,1.6], s:[7.3,1.4]},1.4,0.1,3.0), F({pa:[15.2,6.0]},0.5,1.0,0.5)]}});

/* ---------- gioco */
E({id:'tat-2contro2', titolo:'2 contro 2 a metà campo', obiettivo:'Tattica', ambito:'Gioco',
  descrizione:'Due contro due su metà campo in larghezza. Ogni giocatore tocca la palla in ogni azione: uno riceve o difende, l\'altro alza, il primo attacca.',
  serveA:'Tantissimi tocchi a testa e lettura del gioco: ognuno deve fare tutto.',
  lavora:{fondamentali:['Ricezione','Palleggio','Attacco','Difesa'], muscoli:['quadricipiti']}, difficolta:3, giocatori:[4,4], durata:15,
  materiale:['Palloni','Coni'], pacchetti:['pk-gioco'], tags:['partitella','tanti tocchi','beach'],
  passi:[
    ['Campo','Metà campo in larghezza, segnata con i coni; ogni coppia gioca dalla rete alla linea di fondo.',0],
    ['Tre tocchi','Chi riceve manda la palla alta al centro; il compagno alza; chi ha ricevuto attacca.',2],
    ['Punto','Si gioca a 11 punti, poi si cambiano le coppie.',3]],
  attenzione:['Chi non tocca la palla si sposta per il tocco successivo.','Ricezione alta e al centro del proprio campo.','Si parla sempre: «mia», «alzo io».'],
  errori:[['I due giocatori restano fermi uno accanto all\'altro','Dividetevi il campo: uno a destra e uno a sinistra, e scambiatevi i ruoli quando serve.'],['Si attacca con un salto da fermi','Dopo la ricezione arretra di un passo per prendere una piccola rincorsa.']],
  varianti:{facile:'Il primo tocco si può bloccare e rilanciare.', difficile:'Campo più lungo, fino alla rete.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('a1','A1'), at('a2','A2'), av('b1','B1'), av('b2','B2'), co('k1'), co('k2'), co('k3'), co('k4'), pa()],
    fotogrammi:[F({a1:[2.2,1.2], a2:[2.2,3.4], b1:[15.8,1.2], b2:[15.8,3.4], k1:[0,4.5], k2:[6,4.5], k3:[12,4.5], k4:[18,4.5], pa:[15.55,3.15]},null,0.6),
      F({pa:[2.45,1.45]},1.6,0.1,2.6), F({pa:[4.4,2.2], a2:[4.2,2.4]},0.9,0.1,2.0), F({pa:[4.2,1.0], a1:[3.8,1.2]},0.8,0.1,1.6), F({pa:[14.0,3.6]},0.6,1.0,0.6)]}});

E({id:'tat-re-campo', titolo:'Il re del campo', obiettivo:'Tattica', ambito:'Gioco',
  descrizione:'Tre squadre da tre: una è «il re» e difende sempre lo stesso lato. Se la squadra che sfida vince il punto prende il posto del re; se lo perde, esce e entra la terza squadra.',
  serveA:'Ritmo alto, tanta voglia di vincere il punto e nessun tempo morto.',
  lavora:{fondamentali:['Ricezione','Palleggio','Attacco','Difesa'], muscoli:[]}, difficolta:2, giocatori:[9,12], durata:20,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['gioco','divertimento','ritmo'],
  passi:[
    ['Re e sfidanti','La squadra «re» è nel campo di sinistra; gli sfidanti entrano nel campo di destra.',0],
    ['Punto','L\'allenatore lancia una palla facile agli sfidanti e si gioca il punto.',1],
    ['Cambio','Se vincono gli sfidanti, corrono nel campo del re; il re esce e la terza squadra entra a sfidare.',3]],
  attenzione:['Chi esce raccoglie le palle e si prepara a rientrare subito.','Il punto vale solo per il re: chi resta re più a lungo vince.','Tre tocchi sempre, anche nella fretta.'],
  errori:[['Confusione nei cambi','Chi esce va sempre dalla stessa parte, chi entra dall\'altra.'],['Si gioca tutto di prima intenzione','Il punto vale doppio se arriva con tre tocchi.']],
  varianti:{facile:'Squadre da quattro e palla lanciata facile.', difficile:'Squadre da due.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('r1','R1'), at('r2','R2'), at('r3','R3'), av('s1','S1'), av('s2','S2'), av('s3','S3'), all(), pa()],
    fotogrammi:[F({r1:[2.4,2.0], r2:[2.0,4.6], r3:[7.4,6.2], s1:[15.6,2.0], s2:[16.0,4.6], s3:[10.6,6.2], all:[19.2,9.7], pa:[18.95,9.4]},null,0.6),
      F({pa:[15.8,4.6]},1.2,0.2,2.0), F({pa:[10.8,6.0]},1.0,0.1,2.0), F({pa:[3.4,4.0]},0.6,0.4,0.6), F({s1:[2.4,2.0], s2:[2.0,4.6], s3:[7.4,6.2], r1:[14.4,9.7], r2:[15.8,9.7], r3:[17.2,9.7]},1.6,0.9)]}});

E({id:'tat-partita-tre-tocchi', titolo:'Partita con tre tocchi obbligatori', obiettivo:'Tattica', ambito:'Gioco',
  descrizione:'Partita 6 contro 6 con battuta dal basso; un punto vale solo se la squadra ha usato i tre tocchi prima di mandare la palla dall\'altra parte.',
  serveA:'Abitua la squadra a costruire l\'attacco invece di rimandare la palla al primo o al secondo tocco.',
  lavora:{fondamentali:['Ricezione','Palleggio','Attacco'], muscoli:[]}, difficolta:2, giocatori:[10,12], durata:20,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['partitella','costruzione'],
  passi:[
    ['Battuta dal basso','Si batte dal basso per avere più azioni lunghe.',1],
    ['Tre tocchi','Ogni squadra deve usare ricezione, alzata e attacco.',3],
    ['Punto','Se la palla torna dall\'altra parte con meno di tre tocchi, il punto è dell\'avversario.',4]],
  attenzione:['Il secondo tocco è del palleggiatore: gli altri non lo prendono.','La ricezione va alta: dà tempo per i tre tocchi.','Se la palla è difficile, il terzo tocco può essere un bagher alto nel campo avversario.'],
  errori:[['Si rimanda la palla al primo tocco per paura','Meglio una ricezione alta e corta che un rinvio di prima.'],['Il palleggiatore non c\'è','Se P ha ricevuto, alza il giocatore più vicino al suo posto e lo chiama.']],
  varianti:{facile:'Il primo tocco si può bloccare e rilanciare al palleggiatore.', difficile:'Il punto vale doppio se l\'attacco arriva in salto.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('s','S'), at('p','P'), at('r','R'), av('b','B'), av('d','D'), pa()],
    fotogrammi:[F({s:[5.2,1.0], p:[8.3,6.0], r:[2.2,4.4], b:[19.3,5.0], d:[15.6,3.6], pa:[19.05,4.8]},null,0.6), F({pa:[2.45,4.25]},1.8,0.1,3.0), F({pa:[8.1,5.7]},1.1,0.1,2.2), F({pa:[8.0,1.6], s:[7.3,1.4]},1.4,0.1,3.0), F({pa:[15.4,6.8]},0.5,1.0,0.5)]}});

E({id:'tat-giro-rotazioni', titolo:'Giro delle rotazioni senza palla', obiettivo:'Tattica', ambito:'Gioco',
  descrizione:'La squadra prova a vuoto le sei rotazioni: formazione di ricezione, spostamento al colpo della battuta e posizioni di attacco. Si gira e si ripete.',
  serveA:'Senza libero ogni rotazione è diversa: provarle senza palla evita i falli di posizione e la confusione in partita.',
  lavora:{fondamentali:['Ricezione'], muscoli:[]}, difficolta:1, giocatori:[6,6], durata:10,
  materiale:['Corpo libero'], pacchetti:['pk-gioco','pk-principianti'], tags:['rotazioni','senza libero','falli di posizione'],
  passi:[
    ['Formazione di ricezione','L\'allenatore chiama la rotazione; i giocatori si mettono in formazione di ricezione, rispettando l\'ordine.',0],
    ['«Battuta!»','Alla chiamata «battuta» il palleggiatore va a rete e gli attaccanti vanno alle loro posizioni.',1],
    ['Gira','Si ruota in senso orario e si ripete per tutte e sei le rotazioni.',2]],
  attenzione:['Al colpo della battuta ognuno deve essere davanti o dietro, a destra o a sinistra dei compagni giusti.','Dopo la battuta ci si sposta liberamente.','Il palleggiatore dice a voce dove sta andando.'],
  errori:[['Fallo di posizione tra zona 1 e zona 6','Il giocatore di zona 1 deve essere più a destra di quello di zona 6 e dietro quello di zona 2.'],['Ci si sposta prima della battuta','Si parte solo quando la palla è colpita.']],
  varianti:{facile:'Una rotazione alla volta, con la lavagna davanti.', difficile:'L\'allenatore chiama le rotazioni in ordine sparso.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('p','P'), at('s1','S1'), at('c1','C1'), at('o','O'), at('s2','S2'), at('c2','C2')],
    fotogrammi:[F({p:[1.2,8.1], s1:[5.4,1.5], c1:[8.3,3.8], o:[8.3,8.3], s2:[2.3,2.1], c2:[2.2,5.1]},null,1.0),
      F({p:[8.4,6.0], s1:[5.0,0.6], o:[6.2,8.6], c1:[6.2,4.4]},1.4,1.0), F({p:[1.5,1.5], s1:[7.5,1.5], c1:[7.5,4.5], o:[1.5,7.5], s2:[1.5,4.5], c2:[7.5,7.5]},1.6,1.0)]}});

/* ---------- difesa e contrattacco */
E({id:'tat-dc-pallonetto', titolo:'Difesa del pallonetto e contrattacco', obiettivo:'Tattica', ambito:'Difesa e contrattacco',
  descrizione:'L\'allenatore fa un pallonetto dietro il muro. Chi è in prima linea senza murare lo difende alto, il palleggiatore alza e il murista che ha appena atterrato contrattacca.',
  serveA:'Il pallonetto difeso bene è un\'occasione per segnare: la squadra deve passare subito all\'attacco.',
  lavora:{fondamentali:['Difesa','Palleggio','Attacco'], muscoli:[]}, difficolta:4, giocatori:[5,8], durata:15,
  materiale:['Palloni'], materialeNote:'un rialzo per l\'allenatore', pacchetti:['pk-gioco'], tags:['transizione','pallonetto'],
  passi:[
    ['Muro','M mura in zona 4; S è in zona 2 e non mura.',0],
    ['Pallonetto','L\'allenatore fa un pallonetto dietro il muro; S lo difende alto verso il centro.',2],
    ['Alzata','P alza in zona 4.',3],
    ['Contrattacco','M, atterrato e aperto verso l\'esterno, attacca.',4]],
  attenzione:['Chi non mura arretra verso il centro della prima linea.','Difesa alta e al centro.','Il murista si apre subito dopo l\'atterraggio.'],
  errori:[['La difesa del pallonetto va dall\'altra parte','Piano delle braccia verso l\'alto.'],['Il murista non è pronto per attaccare','Atterra, girati e apriti in diagonale verso l\'esterno.']],
  varianti:{facile:'L\'allenatore lancia la palla corta invece del pallonetto.', difficile:'L\'allenatore sceglie tra pallonetto e attacco forte.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('m','M'), at('s','S'), at('p','P'), all(), pa()],
    fotogrammi:[F({m:[8.5,1.6], s:[8.5,7.4], p:[8.5,6.0], all:[10.8,1.8], pa:[10.6,1.6]},null,0.6), F({s:[6.0,5.4], m:[5.6,0.6], p:[8.4,5.6]},0.8,0.1), F({pa:[6.2,5.2]},1.0,0.1,2.0), F({pa:[8.15,5.4]},1.0,0.1,2.2), F({pa:[8.0,1.6], m:[7.3,1.4]},1.3,0.1,3.0), F({pa:[15.6,4.6]},0.5,1.0,0.5)]}});

E({id:'tat-dc-opposto', titolo:'Difesa e contrattacco dell\'opposto', obiettivo:'Tattica', ambito:'Difesa e contrattacco',
  descrizione:'L\'opposto mura in zona 2 sull\'attacco dalla zona 4 avversaria, si apre verso l\'esterno destro e contrattacca la palla alzata dietro dal palleggiatore.',
  serveA:'L\'opposto è spesso l\'attaccante più libero in contrattacco: va allenato anche il suo passaggio dal muro all\'attacco.',
  lavora:{fondamentali:['Muro','Attacco','Difesa'], muscoli:[]}, difficolta:4, giocatori:[5,8], durata:15,
  materiale:['Palloni'], materialeNote:'un rialzo per l\'allenatore', pacchetti:['pk-gioco'], tags:['opposto','transizione','zona 2'],
  passi:[
    ['Muro in 2','O mura in zona 2 sull\'attacco dell\'allenatore.',1],
    ['Apertura','Atterra e si apre verso l\'esterno destro, fuori dalla linea dei 3 metri.',2],
    ['Difesa e alzata dietro','D difende verso il centro; P alza dietro in zona 2.',4],
    ['Contrattacco','O attacca in diagonale.',5]],
  attenzione:['L\'opposto si apre verso destra, non torna indietro dritto.','Difesa alta: l\'alzata dietro ha bisogno di tempo.','Rincorsa corta, due o tre passi.'],
  errori:[['L\'opposto resta a rete','Dopo l\'atterraggio il primo passo è indietro e verso destra.'],['L\'alzata dietro è corta','P si mette sotto la palla con la schiena verso la zona 2 prima di alzare.']],
  varianti:{facile:'Senza muro: solo apertura, difesa e contrattacco.', difficile:'P sceglie tra alzata in 4 e alzata dietro in 2.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('o','O'), at('p','P'), at('d','D'), all(), pa()],
    fotogrammi:[F({o:[8.5,7.4], p:[8.5,5.6], d:[2.6,4.6], all:[10.8,7.6], pa:[10.6,7.35]},null,0.6), F({pa:[2.85,4.4]},0.7,0.2,0.4), F({o:[5.4,8.8], p:[8.3,5.4]},0.9,0.1), F({pa:[8.1,5.2]},1.2,0.1,2.6), F({pa:[8.0,7.6]},0.8,0.0,2.2), F({o:[7.4,7.6], pa:[7.9,7.6]},0.5,0.1), F({pa:[15.4,2.4]},0.5,1.0,0.5)]}});

E({id:'tat-dc-seconda-alzatore', titolo:'Difesa sul secondo tocco dell\'alzatore', obiettivo:'Tattica', ambito:'Difesa e contrattacco',
  descrizione:'L\'alzatore avversario, a rete, invece di alzare spinge la palla di seconda nel nostro campo. Il giocatore di prima linea davanti a lui la mura o la difende.',
  serveA:'Il «secondo tocco» è un punto facile per l\'avversario se nessuno lo controlla.',
  lavora:{fondamentali:['Muro','Difesa'], muscoli:['quadricipiti']}, difficolta:3, giocatori:[4,8], durata:12,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['palleggiatore avversario','attenzione'],
  passi:[
    ['Guarda l\'alzatore','Il nostro giocatore di zona 2 guarda l\'alzatore avversario quando è vicino alla rete.',0],
    ['Secondo tocco','L\'alzatore spinge la palla dietro il nostro muro, nella zona 4.',1],
    ['Difesa','Il giocatore di zona 4 o il difensore di zona 5 la difende; si contrattacca.',2]],
  attenzione:['Se l\'alzatore avversario è in prima linea e la palla è vicina alla rete, il secondo tocco è possibile.','Il giocatore di zona 2 salta a muro sull\'alzatore se vede le mani girarsi verso di noi.','Chiamatelo a voce: «occhio al palleggiatore».'],
  errori:[['Nessuno controlla l\'alzatore','Il giocatore di prima linea più vicino lo segue con lo sguardo a ogni azione.'],['Si salta troppo presto','Salta solo quando vedi la palla partire verso di noi.']],
  varianti:{facile:'L\'allenatore fa sempre il secondo tocco, nello stesso punto.', difficile:'Secondo tocco o alzata, a sorpresa.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('m','M'), at('s','S'), at('d','D'), av('al','Al'), pa()],
    fotogrammi:[F({m:[8.5,5.6], s:[7.6,1.6], d:[2.4,1.9], al:[9.9,6.0], pa:[14.0,5.6]},null,0.5), F({pa:[10.2,5.8]},1.2,0.1,2.2), F({pa:[6.6,2.6], s:[6.4,2.2]},0.8,0.1,1.0), F({pa:[8.1,5.4]},1.2,0.9,2.4)]}});

/* ---------- copertura */
E({id:'tat-cop-zona2', titolo:'Copertura dell\'attacco da zona 2', obiettivo:'Tattica', ambito:'Copertura',
  descrizione:'Quando si attacca da zona 2, la coppa di copertura si sposta a destra: palleggiatore, centrale e difensore di zona 1 vicini all\'attaccante.',
  serveA:'La copertura cambia lato a seconda di dove si attacca: va provata anche sulla destra.',
  lavora:{fondamentali:['Difesa','Attacco'], muscoli:['quadricipiti']}, difficolta:3, giocatori:[6,8], durata:12,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['coppa','zona 2'],
  passi:[
    ['Alzata in 2','P alza in zona 2. O fa la rincorsa.',1],
    ['La coppa','P, C e il difensore di zona 1 si avvicinano a O, bassi; gli altri più indietro.',1],
    ['Palla murata','Il muro rimanda la palla: chi è più vicino la difende alta verso il centro.',3]],
  attenzione:['Bassi e vicini: 2-3 metri dall\'attaccante.','Guardate le mani del muro avversario.','Chi ha alzato copre subito dopo l\'alzata.'],
  errori:[['La copertura resta sul lato sinistro','Si copre sempre attorno a chi attacca: spostatevi a destra.'],['Ci si alza in piedi a guardare l\'attacco','Restate bassi fino al rimbalzo sul muro.']],
  varianti:{facile:'L\'allenatore simula il muro rimandando la palla con le mani.', difficile:'Muro vero a due.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('o','O'), at('p','P'), at('c','C'), at('d1','D1'), at('d6','D6'), at('d5','D5'), av('m','M'), pa()],
    fotogrammi:[F({o:[5.2,8.8], p:[8.4,5.2], c:[8.4,3.0], d1:[2.4,7.3], d6:[1.6,4.6], d5:[2.4,1.9], m:[9.7,7.6], pa:[8.15,5.0]},null,0.6),
      F({o:[7.3,7.6], pa:[8.0,7.6], p:[7.0,5.3], c:[6.6,6.4], d1:[5.4,7.8], d6:[3.6,5.6], d5:[3.4,3.0]},1.0,0.2,2.2), F({pa:[9.15,7.5]},0.3,0.0,0.2), F({pa:[6.4,6.9]},0.6,0.2,1.0), F({pa:[8.2,5.4]},1.0,0.9,2.2)]}});

E({id:'tat-cop-seconda-linea', titolo:'Copertura dell\'attacco da seconda linea', obiettivo:'Tattica', ambito:'Copertura',
  descrizione:'Quando attacca un giocatore di seconda linea, la copertura si fa più indietro, intorno alla linea dei 3 metri, perché la palla murata rimbalza più lontano.',
  serveA:'Con l\'attacco da dietro i giocatori di prima linea possono coprire stando vicini alla rete.',
  lavora:{fondamentali:['Difesa','Attacco'], muscoli:['quadricipiti']}, difficolta:4, giocatori:[6,8], durata:12,
  materiale:['Palloni'], pacchetti:['pk-gioco'], tags:['seconda linea','pipe'],
  passi:[
    ['Alzata dietro la linea','P alza a un metro dietro la linea dei 3 metri; A arriva con la rincorsa da zona 6.',1],
    ['Copertura','I giocatori di prima linea si girano verso l\'attaccante; i difensori di zona 1 e 5 si avvicinano ai lati.',1],
    ['Palla murata','La palla murata cade tra la rete e la linea dei 3 metri: chi è più vicino la difende.',3]],
  attenzione:['La palla murata da un attacco lontano rimbalza più vicina alla rete.','I giocatori di prima linea non tornano indietro: coprono da dove sono.','Tutti bassi al momento del colpo.'],
  errori:[['Tutti indietreggiano verso il fondo','Restate tra la rete e la linea dei 3 metri: la palla cade lì.'],['L\'attaccante resta solo','I difensori di zona 1 e 5 si stringono verso di lui.']],
  varianti:{facile:'Palla lanciata dall\'allenatore e rimandata a mano.', difficile:'Muro vero e gioco fino al punto.'},
  anim:{tipo:'campo', vista:'intero', zone:true, elementi:[at('a','A'), at('p','P'), at('s','S'), at('o','O'), at('d1','D1'), at('d5','D5'), av('m','M'), pa()],
    fotogrammi:[F({a:[0.9,4.5], p:[8.4,6.0], s:[7.8,1.6], o:[7.8,7.6], d1:[2.4,7.4], d5:[2.4,1.6], m:[9.7,4.2], pa:[8.15,5.75]},null,0.6),
      F({pa:[5.0,4.5], a:[4.2,4.5], s:[7.6,2.8], o:[7.4,6.4], p:[7.6,5.3], d1:[3.6,6.4], d5:[3.6,2.6]},1.4,0.1,2.4), F({pa:[9.15,4.3]},0.35,0.0,0.2), F({pa:[7.0,3.8]},0.7,0.2,1.0), F({pa:[8.2,5.4]},1.0,0.9,2.2)]}});

/* =================================================================== AGGIUNTE 1.2 · FISICO */
/* ---------- riscaldamento e mobilità */
E({id:'mob-squat-braccia-alto', titolo:'Squat con le braccia in alto', obiettivo:'Fisico', ambito:'Riscaldamento e mobilità',
  descrizione:'Squat lento a corpo libero tenendo le braccia tese sopra la testa: scendendo il busto resta il più possibile dritto.',
  serveA:'Mobilità di caviglie, anche e spalle insieme, e controllo della schiena: un buon test di come ci si muove a inizio allenamento.',
  lavora:{fondamentali:[], muscoli:['quadricipiti','glutei','spalle']}, difficolta:2, giocatori:[1,1], durata:3,
  dose:{serie:2, ripetizioni:8}, materiale:['Corpo libero'], pacchetti:['pk-riscaldamento','pk-casa'], tags:['mobilità','squat','spalle'],
  passi:[
    ['Braccia in alto','In piedi, piedi alla larghezza delle spalle, braccia tese sopra la testa.',0],
    ['Scendi','Scendi lentamente nello squat tenendo le braccia vicino alle orecchie.',1],
    ['Risali','Risali spingendo sui talloni.',2]],
  attenzione:['Braccia in linea con il busto, non in avanti.','Talloni a terra.','Scendi solo fin dove il busto resta dritto.'],
  errori:[['Le braccia cadono in avanti','Scendi meno e porta le mani un po\' più larghe.'],['I talloni si alzano','Allarga i piedi e ruota leggermente le punte verso l\'esterno.']],
  varianti:{facile:'Mani sui fianchi.', difficile:'Con un bastone tenuto sopra la testa a braccia tese.'},
  anim:corpo('lato', [['in_piedi_braccia_alto',null,0.4],['squat_braccia_alto',1.4,0.5],['in_piedi_braccia_alto',1.2,0.3]], {ancora:'anN'})});

E({id:'mob-camminata-mani', titolo:'Camminata con le mani', obiettivo:'Fisico', ambito:'Riscaldamento e mobilità',
  descrizione:'Da in piedi si appoggiano le mani a terra, si cammina con le mani in avanti fino al plank a braccia tese, poi si torna indietro e ci si rialza.',
  serveA:'Allunga i femorali, scalda le spalle e attiva il core in un solo esercizio.',
  lavora:{fondamentali:[], muscoli:['femorali','spalle','addome']}, difficolta:2, giocatori:[1,1], durata:4,
  dose:{serie:2, ripetizioni:5}, materiale:['Corpo libero'], pacchetti:['pk-riscaldamento','pk-casa'], tags:['inchworm','mobilità','core'],
  passi:[
    ['Mani a terra','Da in piedi, piega il busto e appoggia le mani a terra; se serve piega un poco le ginocchia.',1],
    ['Cammina in avanti','Avanza con le mani fino al plank a braccia tese.',2],
    ['Torna','Cammina con le mani verso i piedi e risali piano.',3]],
  attenzione:['Nel plank il corpo è dritto, il bacino non cade.','Ginocchia leggermente piegate se i femorali tirano molto.','Movimento lento.'],
  errori:[['Il bacino cade nel plank','Fermati prima: il plank deve essere solido.'],['Si sente tirare dietro le ginocchia in modo fastidioso','Piega di più le ginocchia quando appoggi le mani.']],
  varianti:{facile:'Arriva a metà strada, senza plank completo.', difficile:'Nel plank aggiungi un piegamento.'},
  anim:corpo('lato', [['in_piedi',null,0.4],['piegato_mani_terra',1.2,0.3],['plank_alto',1.3,0.6],['piegato_mani_terra',1.2,0.2],['in_piedi',1.1,0.3]], {ancora:'anN'})});

E({id:'mob-punte-talloni', titolo:'Camminata sulle punte e sui talloni', obiettivo:'Fisico', ambito:'Riscaldamento e mobilità',
  descrizione:'Si cammina per alcuni metri sulle punte dei piedi e poi sui talloni, alternando.',
  serveA:'Scalda caviglie, polpacci e la parte davanti della gamba, molto sollecitati da salti e cambi di direzione.',
  lavora:{fondamentali:[], muscoli:['polpacci']}, difficolta:1, giocatori:[1,1], durata:3,
  dose:{serie:2, tempo:30}, materiale:['Corpo libero'], pacchetti:['pk-riscaldamento','pk-recupero'], tags:['caviglie','attivazione'],
  passi:[
    ['Sulle punte','Cammina 10 passi sulle punte, talloni alti, busto dritto.',1],
    ['Sui talloni','Cammina 10 passi sui talloni, punte dei piedi sollevate.',2],
    ['Alterna','Alterna per 30 secondi.',0]],
  attenzione:['Passi corti e controllati.','Busto dritto, sguardo avanti.','Sulle punte, caviglie dritte, senza piegarle verso l\'esterno.'],
  errori:[['Sulle punte i talloni si abbassano','Passi più corti e più lenti.'],['Sui talloni si piega il busto all\'indietro','Tieni il busto un po\' in avanti e le braccia davanti.']],
  varianti:{facile:'Sul posto, con una mano al muro.', difficile:'Camminata sulle punte con le ginocchia alte.'},
  anim:corpo('lato', [['in_piedi',null,0.2],['punte',0.6,0.5],['in_piedi',0.5,0.1],['talloni',0.6,0.5]], {ancora:'hip'})});

/* ---------- gambe */
E({id:'gam-affondo-laterale', titolo:'Affondo laterale', obiettivo:'Fisico', ambito:'Gambe',
  descrizione:'Un passo largo di lato, piegando la gamba che si sposta e tenendo tesa l\'altra; poi si torna al centro e si cambia lato.',
  serveA:'Forza nei movimenti laterali, come gli spostamenti a muro e in difesa; allunga gli adduttori.',
  lavora:{fondamentali:['Difesa','Muro'], muscoli:['quadricipiti','glutei','adduttori']}, difficolta:2, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:8, recupero:60, lato:true}, materiale:['Corpo libero'], pacchetti:['pk-over45','pk-casa'], tags:['laterale','adduttori'],
  passi:[
    ['Posizione','In piedi, piedi uniti, mani davanti al petto.',0],
    ['Passo di lato','Passo largo verso destra: piega la gamba destra, la sinistra resta tesa. Bacino indietro.',1],
    ['Altro lato','Spingi con la gamba piegata, torna al centro e ripeti a sinistra.',3]],
  attenzione:['Il ginocchio piegato va nella direzione della punta del piede.','Bacino indietro come in uno squat.','Piedi interamente appoggiati.'],
  errori:[['Il ginocchio va oltre la punta del piede','Spingi il bacino più indietro.'],['Il piede della gamba tesa si alza','Passo meno largo.']],
  varianti:{facile:'Passo corto e poca discesa.', difficile:'Con un pallone tenuto davanti al petto.'},
  anim:corpo('fronte', [['f_in_piedi',null,0.3],['f_affondo_laterale',1.0,0.4],['f_in_piedi',0.9,0.3],['f_affondo_laterale_b',1.0,0.4]], {})});
ES[ES.length-1].anim.fotogrammi[0].ritorno=0.9;

E({id:'gam-squat-sumo', titolo:'Squat a gambe larghe', obiettivo:'Fisico', ambito:'Gambe',
  descrizione:'Squat con i piedi molto più larghi delle spalle e le punte girate verso l\'esterno; le ginocchia seguono le punte.',
  serveA:'Lavora molto glutei e adduttori ed è più leggero per la schiena dello squat normale.',
  lavora:{fondamentali:[], muscoli:['adduttori','glutei','quadricipiti']}, difficolta:2, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:12, recupero:60}, materiale:['Corpo libero'], pacchetti:['pk-over45','pk-casa'], tags:['sumo','adduttori'],
  passi:[
    ['Posizione','Piedi molto larghi, punte verso l\'esterno, mani unite davanti al petto.',0],
    ['Scendi','Scendi tenendo il busto dritto; le ginocchia vanno nella direzione delle punte.',1],
    ['Risali','Spingi sui talloni e torna su stringendo i glutei.',2]],
  attenzione:['Ginocchia in fuori, nella direzione delle punte.','Busto dritto.','Scendi fin dove le ginocchia restano in linea.'],
  errori:[['Le ginocchia si chiudono','Scendi meno e spingi le ginocchia verso l\'esterno.'],['Il busto va in avanti','Porta il petto alto e lo sguardo avanti.']],
  varianti:{facile:'Mezzo squat.', difficile:'Tieni 3 secondi in basso, oppure un pallone pesante tra le mani.'},
  anim:corpo('fronte', [['f_sumo_su',null,0.4],['f_sumo_giu',1.2,0.5],['f_sumo_su',1.1,0.3]], {})});

E({id:'gam-sedia-muro', titolo:'Sedia al muro', obiettivo:'Fisico', ambito:'Gambe',
  descrizione:'Schiena appoggiata al muro, si scende finché le cosce sono quasi parallele al pavimento e si tiene la posizione.',
  serveA:'Resistenza dei quadricipiti nella posizione bassa della difesa, senza impatto sulle articolazioni.',
  lavora:{fondamentali:['Difesa'], muscoli:['quadricipiti','glutei']}, difficolta:2, giocatori:[1,1], durata:4,
  dose:{serie:3, tempo:30, recupero:45}, materiale:['Muro o spalliera'], pacchetti:['pk-over45','pk-casa'], tags:['isometria','resistenza'],
  passi:[
    ['Posizione','Schiena al muro, piedi un passo avanti alla larghezza delle anche.',0],
    ['Scendi','Scivola giù fino a quando le cosce sono quasi orizzontali.',1],
    ['Tieni','Tieni 30 secondi respirando, poi risali.',1]],
  attenzione:['Ginocchia sopra le caviglie.','Schiena tutta appoggiata al muro.','Respira normalmente.'],
  errori:[['Dolore davanti al ginocchio','Risali un poco: angolo meno chiuso.'],['Le ginocchia vanno avanti oltre le punte','Sposta i piedi più lontano dal muro.']],
  varianti:{facile:'Meno profondo e 20 secondi.', difficile:'Su una gamba sola per pochi secondi, alternando.'},
  anim:corpo('lato', [['muro_schiena',null,0.4],['muro_squat',1.2,2.2,{lN:[84,84,0], lF:[82,82,0]}],['muro_schiena',1.2,0.3]], {ancora:'anN', attrezzi:[{tipo:'muro', x:50}]})});

/* ---------- core */
E({id:'core-plank-braccio', titolo:'Plank con un braccio avanti', obiettivo:'Fisico', ambito:'Core',
  descrizione:'Dal plank a braccia tese si solleva un braccio in avanti per 2 secondi senza far ruotare il bacino, poi si cambia braccio.',
  serveA:'Stabilità del tronco contro la rotazione, utile in attacco e in battuta.',
  lavora:{fondamentali:[], muscoli:['addome','obliqui','spalle']}, difficolta:3, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:6, recupero:45, lato:true}, materiale:['Tappetino'], pacchetti:['pk-over45','pk-casa'], tags:['antirotazione','plank'],
  passi:[
    ['Plank alto','Mani sotto le spalle, braccia tese, piedi un po\' più larghi del bacino.',0],
    ['Braccio avanti','Solleva un braccio in avanti, all\'altezza della testa. Tieni 2 secondi.',1],
    ['Cambia','Appoggia la mano e ripeti con l\'altro braccio.',2]],
  attenzione:['Il bacino resta fermo e orizzontale.','Piedi larghi per avere più equilibrio.','Respira mentre tieni la posizione.'],
  errori:[['Il bacino ruota quando si alza il braccio','Allarga di più i piedi e contrai gli addominali.'],['Le spalle vanno oltre le mani','Spingi il pavimento e tieni le spalle sopra i polsi.']],
  varianti:{facile:'Plank sulle ginocchia.', difficile:'Braccio avanti e gamba opposta sollevata insieme.'},
  anim:corpo('lato', [['plank_alto',null,0.5],['plank_braccio',0.8,1.2],['plank_alto',0.8,0.4]], {ancora:'anN', attrezzi:[{tipo:'tappetino', x:20, w:160}]})});

E({id:'core-ponte-marcia', titolo:'Ponte con marcia', obiettivo:'Fisico', ambito:'Core',
  descrizione:'Dalla posizione di ponte con il bacino alto, si solleva un ginocchio alla volta senza far scendere né ruotare il bacino.',
  serveA:'Glutei e addominali lavorano insieme per tenere fermo il bacino, come negli appoggi su una gamba.',
  lavora:{fondamentali:[], muscoli:['glutei','addome','femorali']}, difficolta:2, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:8, recupero:45, lato:true}, materiale:['Tappetino'], pacchetti:['pk-over45','pk-casa'], tags:['glutei','stabilità del bacino'],
  passi:[
    ['Ponte','Solleva il bacino in posizione di ponte.',1],
    ['Marcia','Solleva un ginocchio verso il petto, tieni 1 secondo, riappoggia. Poi l\'altro.',2],
    ['Scendi','Dopo le ripetizioni, scendi lentamente.',3]],
  attenzione:['Il bacino resta alto e orizzontale.','Spingi forte con il tallone a terra.','Movimento lento.'],
  errori:[['Il bacino scende dal lato della gamba sollevata','Solleva il ginocchio di meno e stringi il gluteo della gamba a terra.'],['Crampo dietro la coscia','Avvicina i piedi al bacino.']],
  varianti:{facile:'Solleva solo il tallone, non tutto il piede.', difficile:'Tieni la gamba sollevata tesa per 3 secondi.'},
  anim:corpo('lato', [['ponte_giu',null,0.4],['ponte_su',1.0,0.4],['ponte_marcia',0.8,0.8],['ponte_su',0.7,0.3],['ponte_giu',1.0,0.3]], {ancora:'anF', attrezzi:[{tipo:'tappetino', x:20, w:150}]})});

E({id:'core-crunch-palla', titolo:'Crunch con lancio della palla', obiettivo:'Fisico', ambito:'Core',
  descrizione:'Da supini, palla tenuta sopra la testa: si sale con il busto portando la palla verso le ginocchia; a coppie la si lancia al compagno.',
  serveA:'Addominali con un movimento simile al gesto di lancio, più divertente in coppia.',
  lavora:{fondamentali:[], muscoli:['addome','spalle']}, difficolta:2, giocatori:[1,2], durata:4,
  dose:{serie:3, ripetizioni:10, recupero:45}, materiale:['Palloni','Tappetino'], pacchetti:['pk-over45','pk-casa'], tags:['addominali','palla','coppie'],
  passi:[
    ['Giù','Supino, ginocchia piegate, palla tra le mani sopra la testa.',0],
    ['Su','Sali con il busto portando la palla verso le ginocchia; a coppie, lanciala al compagno.',1],
    ['Giù piano','Torna giù lentamente con la palla sopra la testa.',2]],
  attenzione:['La zona lombare resta appoggiata nella discesa.','Espira salendo.','Lancio con le braccia tese, non con la schiena.'],
  errori:[['Si sale di slancio','Rallenta la salita e fermati un attimo in alto.'],['La schiena si inarca quando la palla va dietro la testa','Porta la palla meno indietro.']],
  varianti:{facile:'Senza palla, braccia avanti.', difficile:'Palla medica leggera.'},
  anim:corpo('lato', [['crunch_palla_giu',null,0.4],['crunch_palla_su',0.9,0.5],['crunch_palla_giu',1.2,0.2]], {ancora:'anN', attrezzi:[{tipo:'tappetino', x:10, w:170},{tipo:'palla', su:'mani', sopra:true}]})});

/* ---------- spalle e braccia */
E({id:'spa-piegamenti-muro', titolo:'Piegamenti al muro', obiettivo:'Fisico', ambito:'Spalle e braccia',
  descrizione:'In piedi a un passo e mezzo dal muro, mani appoggiate all\'altezza delle spalle: si piegano le braccia avvicinando il petto al muro e si torna.',
  serveA:'La versione più leggera dei piegamenti: rinforza petto e spalle senza caricare troppo.',
  lavora:{fondamentali:[], muscoli:['petto','tricipiti','spalle']}, difficolta:1, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:12, recupero:45}, materiale:['Muro o spalliera'], pacchetti:['pk-over45','pk-casa','pk-recupero'], tags:['push up','spalla'],
  passi:[
    ['Posizione','Mani al muro all\'altezza delle spalle, corpo dritto e inclinato.',0],
    ['Giù','Piega le braccia e avvicina il petto al muro, gomiti a 45 gradi dal corpo.',1],
    ['Su','Spingi e torna a braccia tese.',2]],
  attenzione:['Corpo dritto dalla testa ai talloni.','Gomiti né aperti né attaccati.','Scapole che si avvicinano scendendo e si allontanano spingendo.'],
  errori:[['Il bacino va avanti verso il muro','Contrai addome e glutei: il corpo si muove tutto insieme.'],['Le spalle salgono verso le orecchie','Spalle basse e collo lungo.']],
  varianti:{facile:'Più vicini al muro.', difficile:'Mani su un tavolo stabile, più in basso.'},
  anim:corpo('lato', [['muro_spinta_su',null,0.4],['muro_spinta_giu',1.1,0.3],['muro_spinta_su',1.0,0.3]], {ancora:'anN', attrezzi:[{tipo:'muro', x:168}]})});

E({id:'spa-tricipiti-elastico', titolo:'Estensioni dei tricipiti con elastico', obiettivo:'Fisico', ambito:'Spalle e braccia',
  descrizione:'Elastico fissato sotto il piede dietro: le mani partono dietro la testa con i gomiti in alto e le braccia si distendono verso il soffitto.',
  serveA:'Rinforza i tricipiti, che danno la spinta finale in alzata, muro e attacco.',
  lavora:{fondamentali:['Palleggio','Muro'], muscoli:['tricipiti','spalle']}, difficolta:2, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:12, recupero:45}, materiale:['Elastico'], pacchetti:['pk-over45','pk-casa'], tags:['tricipiti','braccia'],
  passi:[
    ['Posizione','Un piede avanti e uno indietro, elastico sotto il piede dietro, mani dietro la testa, gomiti in alto.',0],
    ['Distendi','Distendi le braccia verso il soffitto tenendo i gomiti vicini alla testa.',1],
    ['Torna','Torna lentamente con le mani dietro la testa.',2]],
  attenzione:['I gomiti restano fermi e puntati in alto.','Addome contratto, schiena non inarcata.','Ritorno lento.'],
  errori:[['I gomiti si aprono','Elastico più leggero e gomiti vicini alla testa.'],['La schiena si inarca','Porta il piede dietro più lontano e contrai gli addominali.']],
  varianti:{facile:'Senza elastico, un braccio alla volta.', difficile:'Elastico più duro.'},
  anim:corpo('lato', [['tricipiti_giu',null,0.4],['tricipiti_su',0.9,0.4],['tricipiti_giu',1.1,0.2]], {ancora:'anN', attrezzi:[{tipo:'elastico', da:'anF', a:'haN'}]})});

E({id:'spa-curl-elastico', titolo:'Piegamenti delle braccia con elastico', obiettivo:'Fisico', ambito:'Spalle e braccia',
  descrizione:'In piedi sull\'elastico, braccia lungo i fianchi: si piegano i gomiti portando le mani verso le spalle e si torna giù lentamente.',
  serveA:'Rinforza i bicipiti, che frenano il braccio dopo l\'attacco e la battuta e proteggono il gomito.',
  lavora:{fondamentali:[], muscoli:['bicipiti']}, difficolta:1, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:12, recupero:45}, materiale:['Elastico'], pacchetti:['pk-over45','pk-casa'], tags:['bicipiti','gomito'],
  passi:[
    ['Posizione','In piedi sull\'elastico, braccia lungo i fianchi, palmi in avanti.',0],
    ['Su','Piega i gomiti portando le mani verso le spalle; i gomiti restano ai fianchi.',1],
    ['Giù','Torna giù in 2-3 secondi.',2]],
  attenzione:['Gomiti fermi ai fianchi.','Niente slancio con la schiena.','La discesa è la parte più importante: lenta.'],
  errori:[['Si dondola con il busto','Elastico più leggero e ginocchia appena piegate.'],['I gomiti vanno avanti','Tienili attaccati ai fianchi.']],
  varianti:{facile:'Un braccio alla volta.', difficile:'Tieni 2 secondi a metà strada.'},
  anim:corpo('lato', [['curl_giu',null,0.4],['curl_su',0.9,0.4],['curl_giu',1.3,0.2]], {ancora:'anN', attrezzi:[{tipo:'elastico', da:'toN', a:'haN'}]})});

/* ---------- salto e agilità */
E({id:'sal-balzi-avanti', titolo:'Balzi in avanti a piedi uniti', obiettivo:'Fisico', ambito:'Salto e agilità',
  descrizione:'Tre balzi in avanti a piedi uniti, bassi e controllati, fermandosi in equilibrio dopo l\'ultimo.',
  serveA:'Potenza delle gambe e controllo dell\'atterraggio in movimento.',
  lavora:{fondamentali:['Attacco','Muro'], muscoli:['quadricipiti','glutei','polpacci']}, difficolta:3, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:3, recupero:90}, materiale:['Corpo libero'], pacchetti:['pk-over45'], tags:['pliometria','balzi'],
  passi:[
    ['Carica','Piega anche e ginocchia e porta le braccia indietro.',0],
    ['Balzo','Spingi in avanti e in alto con le due gambe, slanciando le braccia.',1],
    ['Atterra e ripeti','Atterra morbido a piedi uniti, poi il balzo successivo. Dopo il terzo fermati in equilibrio.',2]],
  attenzione:['Balzi bassi: la distanza conta poco.','Atterraggio silenzioso, ginocchia in linea con i piedi.','Riposa bene tra le serie.'],
  errori:[['Atterraggio rigido','Piega di più le gambe all\'arrivo.'],['Le ginocchia si chiudono','Balzi più corti e più lenti.']],
  varianti:{facile:'Un solo balzo e stop.', difficile:'Balzi sopra coni bassi.'},
  note:'Da fare dopo un buon riscaldamento.',
  anim:corpo('lato', [['carica_salto',null,0.3,{x:40}],['salto',0.35,0.0,{x:70, z:14}],['atterraggio',0.35,0.15,{x:96}],['salto',0.35,0.0,{x:122, z:14}],['atterraggio',0.35,0.8,{x:148}]], {})});
ES[ES.length-1].anim.fotogrammi[0].ritorno=0.5;

E({id:'sal-scivolo-muro', titolo:'Scivolamento e salto a muro', obiettivo:'Fisico', ambito:'Salto e agilità',
  descrizione:'Due passi laterali veloci, poi salto a muro con le braccia che salgono dritte, atterraggio e ritorno al centro.',
  serveA:'Unisce lo spostamento e il salto del muro, il movimento che si ripete di più in prima linea.',
  lavora:{fondamentali:['Muro'], muscoli:['quadricipiti','polpacci','adduttori']}, difficolta:3, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:6, recupero:60}, materiale:['Coni'], pacchetti:['pk-over45'], tags:['muro','spostamento'],
  passi:[
    ['Passi laterali','Due passi laterali veloci verso il cono, mani alte.',1],
    ['Carica','Ultimo passo frenato e ginocchia piegate.',2],
    ['Salto','Salto verso l\'alto con le mani dritte; atterra a due piedi e torna al centro.',3]],
  attenzione:['Mani sempre all\'altezza delle spalle durante lo spostamento.','Ultimo passo frenato: si salta in alto, non di lato.','Atterraggio nel punto di stacco.'],
  errori:[['Si salta in diagonale','Fermati con l\'ultimo passo prima di saltare.'],['Le mani scendono','Corri con le mani alte, davanti al petto.']],
  varianti:{facile:'Senza salto: spostamento e braccia in alto sulle punte.', difficile:'Il compagno indica il lato all\'ultimo.'},
  anim:corpo('fronte', [['f_muro_pronto',null,0.3,{x:70}],['f_scivolo_largo',0.3,0.0,{x:86}],['f_scivolo_muro',0.3,0.05,{x:102}],['f_muro_salto',0.35,0.15,{x:102}],['f_muro_carica',0.35,0.3,{x:102}]], {attrezzi:[{tipo:'cono', x:116}]})});
ES[ES.length-1].anim.fotogrammi[0].ritorno=0.8;

E({id:'sal-partenze', titolo:'Partenze dalla posizione di difesa', obiettivo:'Fisico', ambito:'Salto e agilità',
  descrizione:'Dalla posizione bassa di difesa, al segnale si scatta in avanti per 2-3 metri e si torna in posizione.',
  serveA:'Velocità di reazione e primo passo, decisivi su pallonetti e palle corte.',
  lavora:{fondamentali:['Difesa'], muscoli:['quadricipiti','polpacci','glutei']}, difficolta:2, giocatori:[1,6], durata:5,
  dose:{serie:4, ripetizioni:4, recupero:45}, materiale:['Corpo libero'], pacchetti:['pk-over45'], tags:['reattività','scatti brevi'],
  passi:[
    ['Posizione','Posizione di attesa bassa, peso sugli avampiedi.',0],
    ['Scatto','Al segnale, primo passo esplosivo in avanti e 2-3 passi veloci.',1],
    ['Ritorno','Torna indietro e rimettiti in posizione per il segnale successivo.',2]],
  attenzione:['Il primo passo è corto e veloce.','Parti dalla posizione bassa, senza alzarti prima.','Scatti brevi: 2-3 metri bastano.'],
  errori:[['Ci si alza prima di partire','Spingi in avanti restando basso nei primi passi.'],['Si parte in ritardo','Peso sugli avampiedi, non sui talloni.']],
  varianti:{facile:'Partenza camminando veloce.', difficile:'Il segnale indica la direzione: avanti, destra o sinistra.'},
  anim:corpo('lato', [['pronto',null,0.6,{x:60}],['passo_avanti',0.45,0.1,{x:110}],['pronto',0.6,0.3,{x:126}]], {})});
ES[ES.length-1].anim.fotogrammi[0].ritorno=0.9;

/* =================================================================== AGGIUNTE 1.2 · RECUPERO */
E({id:'rec-ginocchio-tallone', titolo:'Scivolamento del tallone da supini', obiettivo:'Recupero', ambito:'Ginocchio',
  descrizione:'Da supini con le gambe tese, si fa scivolare il tallone sul tappetino verso il gluteo piegando il ginocchio, poi si torna.',
  serveA:'Recupera la piegatura del ginocchio dolcemente, senza carico: utile nelle prime fasi.',
  lavora:{fondamentali:[], muscoli:['femorali','quadricipiti']}, difficolta:1, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:10, recupero:30, lato:true}, materiale:['Tappetino'], pacchetti:['pk-recupero','pk-casa'], tags:['ginocchio','mobilità','fase iniziale'],
  passi:[
    ['Posizione','Supino, gamba da trattare tesa, l\'altra piegata con il piede a terra.',0],
    ['Scivola','Fai scivolare il tallone verso il gluteo, fin dove arrivi senza dolore. Tieni 2 secondi.',1],
    ['Torna','Distendi lentamente la gamba.',2]],
  attenzione:['Il tallone resta a contatto con il tappetino.','Piega fino a un leggero fastidio, non al dolore.','Movimento lento.'],
  errori:[['Il tallone si stacca','Metti un asciugamano sotto il tallone per scivolare meglio.'],['Si forza oltre il dolore','Fermati prima: la piegatura aumenta nei giorni.']],
  varianti:{facile:'Movimento piccolo.', difficile:'Con un elastico attorno al piede per aiutare la piegatura.'},
  anim:corpo('lato', [['supino_gamba_giu',null,0.4,{lN:[90,0,0]}],['supino_gamba_piegata',1.4,0.8],['supino_gamba_giu',1.4,0.2,{lN:[90,0,0]}]], {ancora:'hip', attrezzi:[{tipo:'tappetino', x:20, w:170}]})});

E({id:'rec-ginocchio-isometria', titolo:'Contrazione del quadricipite da seduti a terra', obiettivo:'Recupero', ambito:'Ginocchio',
  descrizione:'Seduti a terra con la gamba tesa e un asciugamano arrotolato sotto il ginocchio: si spinge il ginocchio verso il basso contraendo la coscia e si tiene 5 secondi.',
  serveA:'Riattiva il quadricipite senza muovere il ginocchio: è spesso il primo esercizio dopo un infortunio.',
  lavora:{fondamentali:[], muscoli:['quadricipiti']}, difficolta:1, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:10, recupero:30, lato:true}, materiale:['Tappetino'], materialeNote:'un asciugamano arrotolato', pacchetti:['pk-recupero','pk-casa'], tags:['ginocchio','isometria','fase iniziale'],
  passi:[
    ['Posizione','Seduto a terra, gambe tese, asciugamano arrotolato sotto il ginocchio.',0],
    ['Contrai','Spingi il ginocchio verso l\'asciugamano tirando la punta del piede verso di te. Tieni 5 secondi.',1],
    ['Rilassa','Rilassa per 5 secondi e ripeti.',0]],
  attenzione:['Si vede la coscia che si indurisce.','Il tallone può sollevarsi di poco.','Respira durante la contrazione.'],
  errori:[['Non si sente la coscia lavorare','Tira di più la punta del piede verso di te e spingi forte il ginocchio verso il basso.'],['Si trattiene il respiro','Conta ad alta voce fino a 5.']],
  varianti:{facile:'Da supini.', difficile:'Contrazione da 10 secondi.'},
  anim:corpo('lato', [['seduto_terra',null,1.0],['seduto_terra',0.5,2.0,{lN:[92,0,104]}]], {attrezzi:[{tipo:'tappetino', x:30, w:160}]})});

E({id:'rec-ginocchio-mini-squat', titolo:'Mezzo squat su una gamba', obiettivo:'Recupero', ambito:'Ginocchio',
  descrizione:'In piedi su una gamba vicino al muro, si scende di pochi centimetri piegando il ginocchio e si risale, controllando che il ginocchio resti in linea.',
  serveA:'Riporta forza e controllo sulla singola gamba, indispensabili prima di tornare a saltare.',
  lavora:{fondamentali:[], muscoli:['quadricipiti','glutei']}, difficolta:2, giocatori:[1,1], durata:5,
  dose:{serie:3, ripetizioni:8, recupero:45, lato:true}, materiale:['Muro o spalliera'], pacchetti:['pk-recupero'], tags:['ginocchio','una gamba','ritorno al campo'],
  passi:[
    ['Su una gamba','In piedi su una gamba, una mano al muro, l\'altra gamba sollevata dietro.',0],
    ['Scendi','Piega il ginocchio e porta il bacino indietro, scendendo di pochi centimetri.',1],
    ['Risali','Risali lentamente.',2]],
  attenzione:['Il ginocchio resta sopra il piede, non va verso l\'interno.','Bacino orizzontale.','Scendi poco: la profondità aumenta nelle settimane.'],
  errori:[['Il ginocchio va verso l\'interno','Scendi meno e spingi il ginocchio verso il mignolo.'],['Il bacino cade dal lato della gamba sollevata','Stringi il gluteo della gamba d\'appoggio.']],
  varianti:{facile:'Su due gambe con il peso spostato su una.', difficile:'Senza appoggio al muro.'},
  anim:corpo('lato', [['in_piedi_una_gamba',null,0.4],['una_gamba_mezzo_squat',1.3,0.4],['in_piedi_una_gamba',1.2,0.3]], {ancora:'anN', attrezzi:[{tipo:'muro', x:150}]})});

E({id:'rec-spalla-rotazione-interna', titolo:'Rotazione interna della spalla con elastico', obiettivo:'Recupero', ambito:'Spalla',
  descrizione:'Elastico fissato di lato all\'altezza del gomito: con il gomito attaccato al fianco si porta la mano verso la pancia e si torna lentamente.',
  serveA:'Completa la rotazione esterna: i due esercizi insieme equilibrano la spalla.',
  lavora:{fondamentali:['Battuta','Attacco'], muscoli:['cuffia','petto']}, difficolta:1, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:12, recupero:30, lato:true}, materiale:['Elastico','Muro o spalliera'], pacchetti:['pk-recupero','pk-over45'], tags:['cuffia dei rotatori','spalla'],
  passi:[
    ['Posizione','Elastico fissato di lato, gomito ai fianchi piegato a 90 gradi, mano verso l\'esterno.',0],
    ['Ruota dentro','Porta la mano verso la pancia tenendo il gomito attaccato al fianco.',1],
    ['Torna','Torna lentamente fuori.',2]],
  attenzione:['Gomito fermo al fianco: aiutati con un asciugamano.','Movimento solo della spalla, il busto non ruota.','Ritorno lento.'],
  errori:[['Il busto ruota insieme al braccio','Tieni le spalle ferme rivolte in avanti.'],['Il gomito si stacca','Asciugamano arrotolato tra gomito e fianco.']],
  varianti:{facile:'Elastico leggerissimo.', difficile:'Elastico più duro, ritorno in 3 secondi.'},
  anim:corpo('fronte', [['f_rot_fuori_un',null,0.4],['f_rot_dentro_un',1.0,0.5],['f_rot_fuori_un',1.2,0.2]], {attrezzi:[{tipo:'muro', x:178},{tipo:'elastico', da:'haN', a:[178,118]}]})});

E({id:'rec-spalla-scapole', titolo:'Avvicinare le scapole', obiettivo:'Recupero', ambito:'Spalla',
  descrizione:'In piedi o seduti, con le braccia avanti, si portano i gomiti indietro avvicinando le scapole e si tiene 3 secondi.',
  serveA:'Riattiva i muscoli tra le scapole che tengono la spalla nella posizione giusta.',
  lavora:{fondamentali:[], muscoli:['schiena','cuffia']}, difficolta:1, giocatori:[1,1], durata:3,
  dose:{serie:3, ripetizioni:10, recupero:30}, materiale:['Corpo libero'], pacchetti:['pk-recupero','pk-casa'], tags:['scapole','postura','fase iniziale'],
  passi:[
    ['Braccia avanti','Braccia tese in avanti all\'altezza delle spalle.',0],
    ['Gomiti indietro','Porta i gomiti indietro vicino ai fianchi e avvicina le scapole. Tieni 3 secondi.',1],
    ['Torna','Distendi di nuovo le braccia in avanti.',2]],
  attenzione:['Spalle basse, lontane dalle orecchie.','Petto aperto.','Movimento lento, senza dolore.'],
  errori:[['Le spalle salgono','Pensa a portare le scapole verso le tasche posteriori dei pantaloni.'],['Si inarca la schiena','Addome leggermente contratto.']],
  varianti:{facile:'Da seduti con la schiena appoggiata.', difficile:'Con un elastico leggero fissato davanti.'},
  anim:corpo('lato', [['rematore_avanti',null,0.4,{t:0, lN:[3,0,0], lF:[-3,0,0]}],['rematore_dietro',1.0,1.2,{t:0, lN:[3,0,0], lF:[-3,0,0]}],['rematore_avanti',1.0,0.3,{t:0, lN:[3,0,0], lF:[-3,0,0]}]], {ancora:'anN'})});

E({id:'rec-spalla-bastone', titolo:'Elevazione delle braccia con il bastone', obiettivo:'Recupero', ambito:'Spalla',
  descrizione:'Tenendo un bastone (per esempio un manico di scopa) con le due mani, si portano le braccia tese in avanti e verso l\'alto; il braccio sano aiuta quello da trattare.',
  serveA:'Recupera il movimento della spalla verso l\'alto con l\'aiuto dell\'altro braccio.',
  lavora:{fondamentali:[], muscoli:['spalle','cuffia']}, difficolta:1, giocatori:[1,1], durata:3,
  dose:{serie:3, ripetizioni:10, recupero:30}, materiale:['Corpo libero'], materialeNote:'un bastone o un manico di scopa', pacchetti:['pk-recupero','pk-casa'], tags:['spalla','mobilità','fase iniziale'],
  passi:[
    ['Posizione','In piedi, bastone tenuto con le due mani davanti alle cosce, braccia tese.',0],
    ['Su','Sali in avanti e in alto fin dove non senti dolore, aiutandoti con il braccio sano.',1],
    ['Giù','Scendi lentamente.',2]],
  attenzione:['Braccia tese.','Il braccio sano guida il movimento.','Spalle basse e schiena dritta.'],
  errori:[['Si inarca la schiena per salire di più','Fermati prima: conta il movimento della spalla.'],['Dolore acuto','Riduci l\'ampiezza e parlane con il fisioterapista.']],
  varianti:{facile:'Da supini, bastone verso il soffitto.', difficile:'Tieni 3 secondi in alto.'},
  anim:corpo('lato', [['curl_giu',null,0.4,{aN:[20,0], aF:[18,0]}],['in_piedi_braccia_alto',1.5,0.6],['curl_giu',1.5,0.2,{aN:[20,0], aF:[18,0]}]], {ancora:'anN'})});

E({id:'rec-caviglia-elastico', titolo:'Spinta del piede contro l\'elastico', obiettivo:'Recupero', ambito:'Caviglia',
  descrizione:'Seduti a terra con la gamba tesa, un elastico intorno all\'avampiede tenuto con le mani: si spinge la punta del piede in avanti e si torna lentamente.',
  serveA:'Rinforza polpaccio e caviglia senza carico, nelle prime settimane dopo una distorsione.',
  lavora:{fondamentali:[], muscoli:['polpacci']}, difficolta:1, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:15, recupero:30, lato:true}, materiale:['Elastico','Tappetino'], pacchetti:['pk-recupero','pk-casa'], tags:['caviglia','polpaccio','distorsione'],
  passi:[
    ['Posizione','Seduto a terra, gamba tesa, elastico intorno all\'avampiede, capi tenuti con le mani.',0],
    ['Spingi','Spingi la punta del piede in avanti, come per premere un pedale.',1],
    ['Torna','Torna lentamente con la punta verso di te.',2]],
  attenzione:['Si muove solo la caviglia.','Movimento completo ma senza dolore.','Ritorno lento.'],
  errori:[['Il ginocchio si piega','Tieni la gamba tesa; metti un cuscino sotto il polpaccio.'],['Il piede si gira verso l\'interno','Spingi con l\'alluce, dritto.']],
  varianti:{facile:'Elastico leggero.', difficile:'Elastico più duro; poi anche verso l\'interno e l\'esterno.'},
  anim:corpo('lato', [['seduto_terra_elastico',null,0.4],['seduto_terra_elastico_spinta',0.9,0.4],['seduto_terra_elastico',1.2,0.2]], {attrezzi:[{tipo:'tappetino', x:30, w:160},{tipo:'elastico', da:'toN', a:'haN'}]})});

E({id:'rec-caviglia-punta-una', titolo:'Sollevamento sulla punta su una gamba', obiettivo:'Recupero', ambito:'Caviglia',
  descrizione:'In piedi su una gamba vicino al muro, si sale lentamente sulla punta e si scende, controllando che la caviglia resti dritta.',
  serveA:'Forza e controllo della caviglia sulla singola gamba, come negli atterraggi.',
  lavora:{fondamentali:[], muscoli:['polpacci']}, difficolta:2, giocatori:[1,1], durata:4,
  dose:{serie:3, ripetizioni:10, recupero:45, lato:true}, materiale:['Muro o spalliera'], pacchetti:['pk-recupero','pk-over45'], tags:['caviglia','polpaccio','ritorno al campo'],
  passi:[
    ['Su una gamba','In piedi su una gamba, una mano al muro.',0],
    ['Sali','Sali sulla punta in 2 secondi.',1],
    ['Scendi','Scendi in 2 secondi.',2]],
  attenzione:['Caviglia dritta, non piegata verso l\'esterno.','Spinta sull\'alluce.','Movimento lento.'],
  errori:[['La caviglia si piega verso l\'esterno','Sali meno e spingi sull\'alluce.'],['Si usa molto la mano al muro','Appoggia solo un dito: la mano serve per sicurezza.']],
  varianti:{facile:'Su due gambe con il peso spostato su una.', difficile:'Senza appoggio.'},
  anim:corpo('lato', [['in_piedi_una_gamba',null,0.4],['una_gamba_punta',1.0,0.5],['in_piedi_una_gamba',1.0,0.3]], {ancora:'toN', attrezzi:[{tipo:'muro', x:146}]})});

E({id:'rec-caviglia-cuscino', titolo:'Equilibrio su un cuscino', obiettivo:'Recupero', ambito:'Caviglia',
  descrizione:'In piedi su una gamba sopra un cuscino morbido o un tappetino piegato: la superficie instabile obbliga la caviglia a correggere di continuo.',
  serveA:'L\'esercizio più utile per evitare nuove distorsioni: allena le risposte automatiche della caviglia.',
  lavora:{fondamentali:[], muscoli:['polpacci','glutei']}, difficolta:2, giocatori:[1,1], durata:4,
  dose:{serie:3, tempo:30, recupero:30, lato:true}, materiale:['Tappetino'], materialeNote:'un cuscino o un tappetino piegato', pacchetti:['pk-recupero','pk-over45','pk-casa'], tags:['caviglia','propriocezione','prevenzione'],
  passi:[
    ['Sali sul cuscino','Appoggia un piede al centro del cuscino, vicino a un muro.',0],
    ['Equilibrio','Solleva l\'altro piede e resta in equilibrio 30 secondi, ginocchio appena piegato.',1],
    ['Cambia','Scendi e cambia gamba.',2]],
  attenzione:['Ginocchio sbloccato.','Sguardo su un punto fisso.','Le piccole oscillazioni sono normali: sono l\'allenamento.'],
  errori:[['Si appoggia spesso il piede','Riduci il tempo o usa un cuscino più basso.'],['Il ginocchio è bloccato teso','Piegalo leggermente.']],
  varianti:{facile:'A terra senza cuscino.', difficile:'Occhi chiusi, oppure lanci di palla con un compagno.'},
  anim:corpo('fronte', [['f_in_piedi',null,0.4,{g:192}],['f_equilibrio',0.9,0.6,{g:192}],['f_equilibrio',0.5,0.3,{t:4, x:102, g:192}],['f_equilibrio',0.5,0.3,{t:-4, x:98, g:192}],['f_in_piedi',0.9,0.3,{g:192}]], {ancora:'anN', attrezzi:[{tipo:'gradino', x:76, w:50, h:8}]})});

E({id:'rec-schiena-sfinge', titolo:'Sfinge', obiettivo:'Recupero', ambito:'Schiena',
  descrizione:'Proni a terra, ci si solleva appoggiandosi sugli avambracci con i gomiti sotto le spalle, lasciando il bacino a terra, e si resta rilassati.',
  serveA:'Estende dolcemente la colonna: aiuta chi passa molto tempo seduto o piegato in avanti.',
  lavora:{fondamentali:[], muscoli:['lombari','addome']}, difficolta:1, giocatori:[1,1], durata:3,
  dose:{serie:3, tempo:20, recupero:20}, materiale:['Tappetino'], pacchetti:['pk-recupero','pk-casa'], tags:['schiena','estensione','mobilità'],
  passi:[
    ['Proni','A pancia in giù, fronte vicino al tappetino.',0],
    ['Sugli avambracci','Appoggia gli avambracci con i gomiti sotto le spalle e solleva il petto. Bacino a terra.',1],
    ['Rilassa','Resta 20 secondi respirando, poi torna giù.',2]],
  attenzione:['Bacino e gambe rilassati a terra.','Spalle lontane dalle orecchie.','Se aumenta il dolore alla schiena o alle gambe, fermati.'],
  errori:[['Si contraggono i glutei e la schiena','Lascia andare il bacino verso il tappetino.'],['Il collo è piegato all\'indietro','Guarda il pavimento poco davanti a te.']],
  varianti:{facile:'Un cuscino sotto il petto.', difficile:'Piccolo movimento su e giù, lento, con le braccia.'},
  anim:corpo('lato', [['superman_giu',null,0.4,{aN:[0,100], aF:[0,100]}],['cobra',1.4,1.6],['superman_giu',1.3,0.3,{aN:[0,100], aF:[0,100]}]], {ancora:'anN', attrezzi:[{tipo:'tappetino', x:10, w:180}]})});

E({id:'rec-schiena-femorali', titolo:'Allungamento dei femorali da supini con elastico', obiettivo:'Recupero', ambito:'Schiena',
  descrizione:'Da supini, un elastico o un asciugamano intorno al piede: si porta la gamba tesa verso l\'alto fino a sentire un allungamento dietro la coscia.',
  serveA:'Femorali più elastici riducono la tensione sulla zona lombare.',
  lavora:{fondamentali:[], muscoli:['femorali','lombari']}, difficolta:1, giocatori:[1,1], durata:3,
  dose:{serie:2, tempo:30, lato:true}, materiale:['Elastico','Tappetino'], pacchetti:['pk-recupero','pk-casa','pk-riscaldamento'], tags:['femorali','allungamento','schiena'],
  passi:[
    ['Posizione','Supino, elastico intorno all\'avampiede, l\'altra gamba tesa a terra.',0],
    ['Su','Porta la gamba tesa verso l\'alto fino a sentire tirare dietro la coscia. Tieni 30 secondi.',1],
    ['Giù','Riabbassa lentamente e cambia gamba.',2]],
  attenzione:['La schiena resta appoggiata.','Ginocchio della gamba sollevata il più possibile teso.','Allungamento piacevole, mai doloroso.'],
  errori:[['Il bacino si solleva','Abbassa un poco la gamba.'],['Si tira con le spalle','Spalle rilassate sul tappetino.']],
  varianti:{facile:'Ginocchio leggermente piegato.', difficile:'Punta del piede verso di te durante l\'allungamento.'},
  anim:corpo('lato', [['supino_gamba_giu',null,0.4,{lN:[92,0,0], lF:[94,0,0], aN:[104,0], aF:[102,0]}],['supino_femorali',1.4,1.6],['supino_gamba_giu',1.4,0.2,{lN:[92,0,0], lF:[94,0,0], aN:[104,0], aF:[102,0]}]], {ancora:'hip', attrezzi:[{tipo:'tappetino', x:10, w:180},{tipo:'elastico', da:'toN', a:'haN'}]})});

E({id:'rec-schiena-inclinazioni', titolo:'Inclinazioni laterali del busto', obiettivo:'Recupero', ambito:'Schiena',
  descrizione:'In piedi, un braccio sopra la testa: ci si inclina lentamente di lato, allungando tutto il fianco; poi l\'altro lato.',
  serveA:'Allunga i muscoli dei fianchi e della schiena, spesso rigidi in chi attacca e batte con un braccio solo.',
  lavora:{fondamentali:[], muscoli:['obliqui','schiena']}, difficolta:1, giocatori:[1,1], durata:3,
  dose:{serie:2, ripetizioni:6, lato:true}, materiale:['Corpo libero'], pacchetti:['pk-recupero','pk-riscaldamento','pk-casa'], tags:['fianchi','allungamento','schiena'],
  passi:[
    ['Posizione','In piedi, piedi alla larghezza delle spalle.',0],
    ['Inclinati','Braccio sinistro sopra la testa e inclinati a destra. Tieni 3 secondi.',1],
    ['Altro lato','Torna dritto e ripeti dall\'altra parte.',3]],
  attenzione:['Il busto si inclina di lato, non in avanti.','Bacino fermo.','Respira mentre allunghi.'],
  errori:[['Il busto ruota','Immagina di essere tra due vetri: solo di lato.'],['Si spinge troppo','Allungamento leggero, senza dolore.']],
  varianti:{facile:'Mani sui fianchi.', difficile:'Con un elastico teso tra le mani sopra la testa.'},
  anim:corpo('fronte', [['f_in_piedi',null,0.3],['f_inclinazione_dx',1.2,0.8],['f_in_piedi',1.0,0.3],['f_inclinazione_sx',1.2,0.8]], {ancora:'anN'})});
ES[ES.length-1].anim.fotogrammi[0].ritorno=1.0;

/* =================================================================== PRINCIPIANTI · PROPEDEUTICI (versione 1.3) */
const PP = {tipo:'palla', su:'mani', dy:-10, sopra:true};   // palla tenuta sopra la fronte
const PB = {tipo:'palla', su:'mani', dy:-6, sopra:true};    // palla sugli avambracci

/* ---------------- PALLEGGIO */
E({id:'pp-lancio-presa', titolo:'Lancio e presa sopra la fronte', obiettivo:'Tecnica', ambito:'Palleggio', prepara:'Palleggio: posizione delle mani',
  descrizione:'Da soli: si lancia la palla in alto con due mani e la si riprende sopra la fronte, con le mani già a coppa. Nessun palleggio, solo lancio e presa.',
  serveA:'Fissa la posizione delle mani e il punto di contatto sopra la fronte, prima ancora di colpire la palla.',
  lavora:{fondamentali:['Palleggio'], muscoli:['spalle','tricipiti','quadricipiti']}, difficolta:1, giocatori:[1,12], durata:5,
  dose:{serie:3, ripetizioni:10}, materiale:['Palloni'], materialeNote:'1 pallone a testa', pacchetti:['pk-principianti','pk-casa'], tags:['palleggio','mani','da soli','primo approccio'],
  passi:[
    ['Mani a coppa','Porta le mani sopra la fronte, a una spanna dalla testa: pollici e indici formano un triangolo, le dita sono aperte e rilassate.',0],
    ['Lancio','Piega le gambe e lancia la palla in alto, un metro sopra la testa, distendendo braccia e gambe insieme.',1],
    ['Guarda la palla','Mentre la palla sale riporta subito le mani a coppa sopra la fronte e guarda la palla attraverso il triangolo.',2],
    ['Presa morbida','Prendi la palla con tutte le dita e accompagnala piegando gomiti e ginocchia, senza farla arrivare alla fronte.',3]],
  attenzione:['La palla si prende sopra la fronte, mai davanti al viso o al petto.','Toccano tutte le dita, non il palmo.','Gomiti larghi, all\'altezza delle spalle.'],
  errori:[['La palla scivola tra le mani','Avvicina pollici e indici: il triangolo deve essere più piccolo della palla.'],['La palla si prende davanti al petto','Spostati sotto la palla e alza le mani prima che arrivi: devi vederla nel triangolo.'],['Le dita sono rigide e la palla rimbalza','Rilassa le dita e ammortizza piegando anche le gambe.']],
  varianti:{facile:'Lancio basso, appena sopra la testa, per prendere confidenza.', difficile:'Prima della presa batti le mani una volta.'},
  note:'È il primo esercizio da fare con chi non ha mai giocato: se la presa non è sopra la fronte, il palleggio non lo sarà mai.',
  anim:corpo('lato', [['mani_coppa',null,0.6],['palleggio_giu',0.6,0.15],['palleggio_su',0.4,0.05,null,{su:[116,-90]}],['palleggio_giu',0.9,0.6]], {ancora:'anN', attrezzi:[PP]})});

E({id:'pp-autopalleggio', titolo:'Autopalleggio sul posto', obiettivo:'Tecnica', ambito:'Palleggio', prepara:'Palleggio',
  descrizione:'Da soli: palleggi verticali sopra la testa, alti circa un metro, cercando di non muoversi dal posto.',
  serveA:'Abitua a spingere la palla con braccia e gambe insieme e a controllarne l\'altezza.',
  lavora:{fondamentali:['Palleggio'], muscoli:['spalle','tricipiti','quadricipiti']}, difficolta:1, giocatori:[1,12], durata:6,
  dose:{serie:3, tempo:45, recupero:20}, materiale:['Palloni'], materialeNote:'1 pallone a testa', pacchetti:['pk-principianti','pk-casa'], tags:['palleggio','da soli','controllo'],
  passi:[
    ['Pronto','Gambe leggermente piegate, mani a coppa sopra la fronte e palla appoggiata sulle dita.',0],
    ['Spinta','Distendi braccia e gambe insieme e spingi la palla verso l\'alto, dritta sopra la testa.',1],
    ['Arriva sotto','Mentre scende, piega di nuovo le gambe e prepara le mani: la palla ricade nello stesso punto.',2],
    ['Ripeti','Conta quanti palleggi riesci a fare senza far cadere la palla. Prova a migliorare il record.',3]],
  attenzione:['Palla alta circa un metro sopra le mani, sempre la stessa altezza.','Contatto breve: la palla non si ferma nelle mani.','Gambe sempre un po\' piegate, pronte a spingere.'],
  errori:[['La palla va in avanti','Il contatto è troppo davanti: porta le mani sopra la fronte e spingi verso l\'alto, non in avanti.'],['Si spinge solo con le braccia','Piega le gambe mentre la palla scende e distendile insieme alle braccia.']],
  varianti:{facile:'Dopo ogni palleggio blocca la palla e riparti.', difficile:'Alterna un palleggio alto e uno basso, o fai un giro su te stesso tra due palleggi.'},
  anim:corpo('lato', [['palleggio_giu',null,0.25],['palleggio_su',0.35,0.05],['palleggio_su',0.5,0.15,null,{su:[114,-100]}],['palleggio_giu',0.6,0.15]], {ancora:'anN', attrezzi:[PP]})});

E({id:'pp-palleggio-muro', titolo:'Palleggio contro il muro', obiettivo:'Tecnica', ambito:'Palleggio', prepara:'Palleggio',
  descrizione:'A un metro e mezzo da un muro, si palleggia la palla contro la parete sopra una linea alta e la si ripalleggia al ritorno.',
  serveA:'Il muro restituisce sempre la palla: tante ripetizioni in poco tempo, anche a casa o in palestra prima dell\'allenamento.',
  lavora:{fondamentali:['Palleggio'], muscoli:['spalle','tricipiti','quadricipiti']}, difficolta:1, giocatori:[1,12], durata:6,
  dose:{serie:3, ripetizioni:15}, materiale:['Palloni','Muro o spalliera'], pacchetti:['pk-principianti','pk-casa'], tags:['palleggio','muro','da soli'],
  passi:[
    ['Distanza','In piedi a circa un metro e mezzo dal muro, piedi alla larghezza delle spalle, uno leggermente avanti.',0],
    ['Palleggio al muro','Palleggia verso l\'alto e in avanti: la palla deve toccare il muro sopra la testa.',1],
    ['Ritorno','Mentre la palla torna, piega le gambe e prepara le mani sopra la fronte.',2],
    ['Continua','Palleggia di nuovo. Se la palla si abbassa, bloccala e riparti.',0]],
  attenzione:['Mani pronte sopra la fronte prima che la palla torni.','Spingi verso l\'alto: la palla tocca il muro più in alto della tua testa.','Muovi i piedi per restare sempre sotto la palla.'],
  errori:[['La palla torna sempre più bassa','Usa le gambe: palleggia più alto e allontanati di mezzo passo dal muro.'],['La palla si ferma nelle mani','Contatto più breve: le mani spingono subito, come una molla.']],
  varianti:{facile:'Lancia la palla contro il muro e riprendila sopra la fronte.', difficile:'Alterna un palleggio al muro e un autopalleggio sopra la testa.'},
  anim:corpo('lato', [['palleggio_giu',null,0.3],['palleggio_su',0.35,0.05],['palleggio_su',0.45,0.05,null,{su:[178,20]}],['palleggio_giu',0.55,0.3]], {attrezzi:[PP,{tipo:'muro', x:188}]})});

E({id:'pp-palleggio-seduti', titolo:'Palleggio da seduti', obiettivo:'Tecnica', ambito:'Palleggio', prepara:'Palleggio: lavoro delle braccia e delle dita',
  descrizione:'Seduti a terra con le gambe davanti, si fanno autopalleggi verticali o palleggi con un compagno seduto di fronte.',
  serveA:'Senza l\'aiuto delle gambe si sentono bene il lavoro delle dita e la distensione delle braccia.',
  lavora:{fondamentali:['Palleggio'], muscoli:['spalle','tricipiti','addome']}, difficolta:1, giocatori:[1,12], durata:5,
  dose:{serie:3, tempo:30, recupero:20}, materiale:['Palloni','Tappetino'], pacchetti:['pk-principianti','pk-casa'], tags:['palleggio','seduti','dita'],
  passi:[
    ['Seduto','Seduto a terra, schiena dritta, una gamba tesa e una piegata. Mani a coppa sopra la fronte.',0],
    ['Spinta delle braccia','Distendi le braccia verso l\'alto e spingi la palla con tutte le dita.',1],
    ['Ricezione','Accogli la palla sopra la fronte piegando i gomiti, poi spingi di nuovo.',0]],
  attenzione:['Schiena dritta: non lasciarti cadere all\'indietro.','Spingono tutte e dieci le dita.','Gomiti larghi, all\'altezza delle spalle.'],
  errori:[['La palla parte storta','Le due mani devono spingere allo stesso modo: pollici vicini e simmetrici.'],['La palla è troppo bassa','Distendi completamente le braccia alla fine della spinta.']],
  varianti:{facile:'Lancio e presa da seduti, senza palleggio.', difficile:'A coppie, seduti a 2 metri: palleggio al compagno e ritorno.'},
  anim:corpo('lato', [['seduto_terra_palleggio',null,0.35],['seduto_terra_palleggio',0.6,0.2,{aN:[164,10], aF:[160,10]},{su:[92,-40]}]], {attrezzi:[PP,{tipo:'tappetino', x:30, w:150}]})});

E({id:'pp-lancio-palleggio-coppie', titolo:'Lancio e palleggio a coppie', obiettivo:'Tecnica', ambito:'Palleggio', prepara:'Palleggio',
  descrizione:'A coppie a 3-4 metri: A lancia la palla con due mani, alta e morbida; B la palleggia di ritorno e A la blocca sopra la fronte.',
  serveA:'Il primo palleggio "vero": la palla arriva sempre uguale e ci si concentra solo sul contatto.',
  lavora:{fondamentali:['Palleggio'], muscoli:['spalle','tricipiti','quadricipiti']}, difficolta:1, giocatori:[2,12], durata:8,
  dose:{serie:2, ripetizioni:10}, materiale:['Palloni'], materialeNote:'1 pallone a coppia', pacchetti:['pk-principianti','pk-fondamentali'], tags:['palleggio','coppie','lancio'],
  passi:[
    ['Lancio','A lancia la palla a due mani dal basso, alta e morbida, verso la fronte di B.',1],
    ['Palleggio','B si sistema sotto la palla e la palleggia di ritorno verso A, alta.',2],
    ['Presa','A blocca la palla sopra la fronte, con le mani a coppa. Dopo 10 palleggi si cambia.',3]],
  attenzione:['Il lancio deve essere facile: alto e preciso.','Chi palleggia si muove per avere la palla sopra la fronte.','La palla torna alta: almeno 2 metri sopra la testa del compagno.'],
  errori:[['B palleggia senza spostarsi','Fai un passo verso la palla prima che arrivi, e fermati sotto di lei.'],['La palla torna bassa e tesa','Spingi verso l\'alto, non verso il compagno: la traiettoria è una parabola.']],
  varianti:{facile:'B blocca la palla sopra la fronte e la rilancia.', difficile:'A lancia un po\' a destra o a sinistra: B deve spostarsi prima di palleggiare.'},
  anim:{tipo:'campo', vista:'meta', elementi:[at('a','A'), at('b','B'), pa()],
    fotogrammi:[F({a:[2.4,4.5], b:[6,4.5], pa:[2.7,4.4]},null,0.5), F({pa:[5.7,4.4]},1.2,0.3,2.4), F({pa:[2.7,4.4]},1.3,0.3,2.8), F({a:[2.4,4.5]},0.3,0.8)]}});

E({id:'pp-palleggio-spostamento', titolo:'Spostarsi sotto la palla e palleggiare', obiettivo:'Tecnica', ambito:'Palleggio', prepara:'Palleggio: spostamento sotto la palla',
  descrizione:'L\'allenatore o un compagno lancia la palla un po\' a destra, un po\' a sinistra o un po\' avanti. Chi palleggia si sposta, si ferma sotto la palla e la palleggia di ritorno.',
  serveA:'Insegna che il palleggio si fa con i piedi prima che con le mani: bisogna arrivare sotto la palla.',
  lavora:{fondamentali:['Palleggio'], muscoli:['spalle','quadricipiti','polpacci']}, difficolta:2, giocatori:[2,12], durata:8,
  materiale:['Palloni'], pacchetti:['pk-principianti','pk-fondamentali'], tags:['palleggio','spostamenti'],
  passi:[
    ['Lancio laterale','Il lanciatore lancia la palla alta, un passo a destra di B.',0],
    ['Spostamento','B si sposta con passi laterali e si ferma sotto la palla prima che scenda.',1],
    ['Palleggio di ritorno','B palleggia verso il lanciatore e torna al centro. Il lancio successivo va dall\'altra parte.',2]],
  attenzione:['Fermati prima di palleggiare: i piedi sono fermi al momento del contatto.','Spalle rivolte verso dove vuoi mandare la palla.','Passi corti e veloci.'],
  errori:[['Si palleggia in corsa','Parti appena vedi il lancio, così hai il tempo di arrivare e fermarti.'],['La palla va di lato','Gira piedi e spalle verso il lanciatore prima del contatto.']],
  varianti:{facile:'Lanci a un solo passo di distanza, sempre dallo stesso lato.', difficile:'Lanci anche in avanti e indietro, senza dire prima la direzione.'},
  anim:{tipo:'campo', vista:'meta', elementi:[all(), at('b','B'), pa()],
    fotogrammi:[F({all:[7,4.5], b:[3,4.5], pa:[6.7,4.4]},null,0.5), F({pa:[3.25,3.1], b:[3,3.2]},1.3,0.3,2.6), F({pa:[6.7,4.4]},1.3,0.3,2.6), F({b:[3,4.5]},0.6,0.5)]}});

E({id:'pp-palleggio-alto-basso', titolo:'Palleggio alto e basso alternato', obiettivo:'Tecnica', ambito:'Palleggio', prepara:'Palleggio: dosare la spinta',
  descrizione:'Autopalleggio alternando un palleggio basso (mezzo metro) e uno alto (2 metri), sempre sulla verticale.',
  serveA:'Insegna a dosare la forza della spinta con gambe e braccia: è la base per alzate corte e lunghe.',
  lavora:{fondamentali:['Palleggio'], muscoli:['spalle','tricipiti','quadricipiti']}, difficolta:2, giocatori:[1,12], durata:6,
  dose:{serie:3, tempo:45, recupero:20}, materiale:['Palloni'], pacchetti:['pk-principianti','pk-casa'], tags:['palleggio','da soli','controllo'],
  passi:[
    ['Palleggio basso','Spinta corta, soprattutto con le dita e i polsi: la palla sale di mezzo metro.',1],
    ['Palleggio alto','Piega bene le gambe e distendi tutto il corpo: la palla sale di 2 metri.',3],
    ['Ricezione','Su ogni palla alta ammortizza di più con le gambe prima di spingere.',4]],
  attenzione:['La palla resta sempre sopra la testa, anche quella alta.','Sul palleggio alto lavorano soprattutto le gambe.','Ritmo regolare: basso, alto, basso, alto.'],
  errori:[['La palla alta va avanti','Spingi dritto in su: guarda la palla attraverso le mani.'],['Il palleggio basso diventa una spinta rigida','Gomiti morbidi: la palla rimbalza sulle dita.']],
  varianti:{facile:'Tra un palleggio e l\'altro blocca la palla.', difficile:'Dopo il palleggio alto tocca terra con una mano e torna sotto la palla.'},
  anim:corpo('lato', [['mani_coppa',null,0.15],['mani_coppa',0.3,0.05,null,{su:[121,-40]}],['palleggio_giu',0.35,0.1],['palleggio_su',0.3,0.05],['palleggio_su',0.6,0.15,null,{su:[114,-110]}],['palleggio_giu',0.7,0.2]], {ancora:'anN', attrezzi:[PP]})});

/* ---------------- BAGHER E RICEZIONE */
E({id:'pp-bagher-braccia', titolo:'Le braccia del bagher', obiettivo:'Tecnica', ambito:'Ricezione', prepara:'Bagher: posizione delle braccia',
  descrizione:'Senza palla: si impara a unire le mani, tendere le braccia e formare il "piano di rimbalzo" con gli avambracci, poi si scende in posizione di bagher.',
  serveA:'Un piano di rimbalzo piatto e stabile è la cosa più importante del bagher: senza, la palla va dove vuole.',
  lavora:{fondamentali:['Ricezione','Difesa'], muscoli:['spalle','quadricipiti','glutei']}, difficolta:1, giocatori:[1,20], durata:4,
  dose:{serie:2, ripetizioni:10}, materiale:['Corpo libero'], pacchetti:['pk-principianti','pk-casa'], tags:['bagher','senza palla','primo approccio'],
  passi:[
    ['Mani unite','Appoggia il dorso di una mano nel palmo dell\'altra e chiudi i pollici affiancati, puntati in avanti e in basso.',0],
    ['Braccia tese','Distendi i gomiti e ruota le braccia: gli avambracci formano un piano largo e piatto, davanti al corpo.',1],
    ['Posizione','Piega le gambe, porta il peso in avanti e abbassa il piano all\'altezza delle cosce.',2],
    ['Spinta','Distendi le gambe e alza appena le braccia, senza piegare i gomiti: è il movimento del bagher.',3]],
  attenzione:['Pollici affiancati e allineati: le braccia sono alla stessa altezza.','Gomiti tesi e "chiusi" verso l\'interno.','Le braccia si muovono poco: lavorano le gambe.'],
  errori:[['Gomiti piegati','Spingi i pollici verso il basso: i gomiti si distendono da soli.'],['Mani intrecciate con le dita','Usa la presa a coppa (una mano nell\'altra): le dita intrecciate fanno storcere i polsi.'],['Le braccia salgono sopra le spalle','Ferma le braccia all\'altezza della pancia: la spinta viene dalle gambe.']],
  varianti:{facile:'Davanti a uno specchio, controllando che il piano sia piatto.', difficile:'Un compagno appoggia una palla sugli avambracci: tienila ferma mentre scendi e risali.'},
  anim:corpo('lato', [['braccia_avanti',null,0.6],['braccia_unite',0.8,0.6],['bagher',0.9,0.6],['bagher_alto',0.6,0.6]], {ancora:'anN'})});

E({id:'pp-bagher-presa', titolo:'Palla sugli avambracci e presa', obiettivo:'Tecnica', ambito:'Ricezione', prepara:'Bagher: punto di contatto',
  descrizione:'A coppie a 3 metri: A lancia la palla dal basso verso B, che la fa rimbalzare sugli avambracci verso l\'alto, davanti a sé, e poi la blocca con le mani.',
  serveA:'Insegna dove si tocca la palla (sopra i polsi, non sulle mani) e a non "colpire" con le braccia.',
  lavora:{fondamentali:['Ricezione'], muscoli:['spalle','quadricipiti']}, difficolta:1, giocatori:[2,12], durata:6,
  dose:{serie:2, ripetizioni:10}, materiale:['Palloni'], materialeNote:'1 pallone a coppia', pacchetti:['pk-principianti'], tags:['bagher','coppie','contatto'],
  passi:[
    ['In attesa','B è in posizione di bagher, braccia unite e tese davanti. A lancia la palla con due mani dal basso.',0],
    ['Contatto','La palla tocca gli avambracci, due dita sopra i polsi. B accompagna verso l\'alto con le gambe.',1],
    ['Su e presa','La palla sale di un metro davanti a B, che la blocca con le mani e la restituisce.',2]],
  attenzione:['Contatto sugli avambracci, non sulle mani né sui gomiti.','La palla sale piano: le braccia non colpiscono.','Guarda la palla fino al contatto.'],
  errori:[['La palla parte di lato','Il piano non è piatto: pollici affiancati e gomiti tesi.'],['La palla schizza in avanti','Non dare colpi con le braccia: piega e distendi le gambe.']],
  varianti:{facile:'Lancio da 2 metri, molto alto e lento.', difficile:'B manda la palla direttamente nelle mani di A, senza bloccarla.'},
  anim:corpo('lato', [['bagher',null,0.4,null,{su:[215,10]}],['bagher',0.9,0.1],['bagher_alto',0.45,0.05,null,{su:[150,-20]}],['braccia_avanti',0.5,0.6]], {ancora:'anN', attrezzi:[PB]})});

E({id:'pp-autobagher', titolo:'Autobagher sul posto', obiettivo:'Tecnica', ambito:'Ricezione', prepara:'Bagher',
  descrizione:'Da soli: bagher verticali sopra le braccia, alti circa un metro, restando nello stesso punto.',
  serveA:'Tante ripetizioni di contatto sugli avambracci: si impara a controllare la palla con il piano di rimbalzo.',
  lavora:{fondamentali:['Ricezione','Difesa'], muscoli:['spalle','quadricipiti']}, difficolta:1, giocatori:[1,12], durata:6,
  dose:{serie:3, tempo:45, recupero:20}, materiale:['Palloni'], pacchetti:['pk-principianti','pk-casa'], tags:['bagher','da soli','controllo'],
  passi:[
    ['Pronto','Gambe piegate, braccia unite e tese davanti. Lancia la palla poco sopra le braccia.',0],
    ['Bagher','Quando la palla scende, distendi le gambe e alza appena le braccia: la palla sale di un metro.',1],
    ['Ripeti','Riprendi la posizione mentre la palla scende. Conta i bagher consecutivi.',2]],
  attenzione:['Piano di rimbalzo piatto, rivolto verso l\'alto.','Si piegano le gambe, non i gomiti.','Piccoli passi per restare sotto la palla.'],
  errori:[['La palla va in avanti','Abbassa le spalle e tieni le braccia più orizzontali.'],['Bagher troppo alti e incontrollati','Muovi le braccia meno: basta la spinta delle gambe.']],
  varianti:{facile:'Un bagher e poi presa con le mani.', difficile:'Alterna un bagher e un palleggio.'},
  anim:corpo('lato', [['bagher',null,0.25],['bagher_alto',0.35,0.05],['bagher_alto',0.5,0.15,null,{su:[160,-60]}],['bagher',0.6,0.2]], {ancora:'anN', attrezzi:[PB]})});

E({id:'pp-bagher-muro', titolo:'Bagher contro il muro', obiettivo:'Tecnica', ambito:'Ricezione', prepara:'Bagher: direzione della palla',
  descrizione:'A 2-3 metri da un muro: si fa bagher verso la parete sopra una linea, e si ripete sulla palla che torna (anche dopo un rimbalzo a terra).',
  serveA:'Insegna a orientare il piano delle braccia verso il bersaglio: la palla va dove "guardano" gli avambracci.',
  lavora:{fondamentali:['Ricezione','Difesa'], muscoli:['spalle','quadricipiti']}, difficolta:1, giocatori:[1,12], durata:6,
  dose:{serie:3, ripetizioni:12}, materiale:['Palloni','Muro o spalliera'], pacchetti:['pk-principianti','pk-casa'], tags:['bagher','muro','da soli'],
  passi:[
    ['Posizione','A 2-3 metri dal muro, in posizione di bagher. Lancia la palla contro il muro.',0],
    ['Bagher','Quando torna, fai bagher verso il muro, sopra la linea: piano delle braccia rivolto verso la parete.',1],
    ['Ritorno','La palla torna: aspettala in posizione e ripeti. Se è troppo bassa lasciala rimbalzare una volta.',2]],
  attenzione:['Il piano delle braccia è inclinato verso il muro.','Arriva con i piedi dietro la palla, non sotto.','Gambe piegate e peso in avanti.'],
  errori:[['La palla va verso l\'alto e non al muro','Inclina meno le braccia e spingi un po\' più in avanti con le gambe.'],['La palla tocca il muro sempre più in basso','Allontanati di un passo e usa di più le gambe.']],
  varianti:{facile:'Lascia rimbalzare la palla a terra prima di ogni bagher.', difficile:'Alterna bagher verso destra e verso sinistra, toccando due segni diversi sul muro.'},
  anim:corpo('lato', [['bagher',null,0.25],['bagher_alto',0.35,0.05],['bagher_alto',0.55,0.05,null,{su:[230,20]}],['bagher',0.65,0.25]], {attrezzi:[PB,{tipo:'muro', x:240}]})});

E({id:'pp-bagher-rimbalzo', titolo:'Bagher dopo un rimbalzo', obiettivo:'Tecnica', ambito:'Ricezione', prepara:'Bagher: tempo sulla palla',
  descrizione:'A coppie a 4 metri: A lancia la palla a terra davanti a B, che dopo il rimbalzo fa bagher verso A. A blocca e ripete.',
  serveA:'La palla dopo il rimbalzo è lenta e prevedibile: si impara a posizionarsi e ad aspettarla con le braccia pronte.',
  lavora:{fondamentali:['Ricezione','Difesa'], muscoli:['spalle','quadricipiti']}, difficolta:1, giocatori:[2,12], durata:8,
  dose:{serie:2, ripetizioni:10}, materiale:['Palloni'], materialeNote:'1 pallone a coppia', pacchetti:['pk-principianti'], tags:['bagher','coppie','rimbalzo'],
  passi:[
    ['Lancio a terra','A lancia la palla a terra, un metro davanti a B.',1],
    ['Bagher','B aspetta la palla dopo il rimbalzo, con le braccia già unite, e fa bagher verso A.',2],
    ['Presa','A blocca la palla sopra la fronte. Dopo 10 bagher si cambia.',3]],
  attenzione:['Braccia pronte prima del rimbalzo.','Si colpisce la palla mentre scende, davanti al corpo.','Il piano delle braccia guarda il compagno.'],
  errori:[['Si colpisce la palla mentre sale','Aspetta: lasciala salire e scendere, poi colpiscila all\'altezza della pancia.'],['La palla va troppo alta o dietro','Braccia meno inclinate, spinta delle gambe verso il compagno.']],
  varianti:{facile:'B blocca la palla sugli avambracci invece di colpirla.', difficile:'A lancia un po\' a destra o a sinistra: B si sposta prima del rimbalzo.'},
  anim:{tipo:'campo', vista:'meta', elementi:[at('a','A'), at('b','B'), pa()],
    fotogrammi:[F({a:[7,4.5], b:[2.6,4.5], pa:[6.7,4.4]},null,0.5), F({pa:[3.8,4.4]},0.7,0.05,0.4), F({pa:[3,4.4]},0.6,0.15,1.2), F({pa:[6.7,4.4]},1.3,0.7,2.6)]}});

E({id:'pp-bagher-bersaglio', titolo:'Bagher verso il compagno a rete', obiettivo:'Tecnica', ambito:'Ricezione', prepara:'Ricezione',
  descrizione:'L\'allenatore lancia a due mani dall\'altra parte della rete verso B, che in bagher manda la palla al compagno C in zona 2-3, vicino alla rete. C blocca.',
  serveA:'È già la ricezione: la palla arriva da lontano, oltre la rete, e va mandata a chi alza.',
  lavora:{fondamentali:['Ricezione'], muscoli:['spalle','quadricipiti']}, difficolta:2, giocatori:[3,12], durata:10,
  materiale:['Palloni','Coni'], materialeNote:'una cesta di palloni, 1 cono per il bersaglio', pacchetti:['pk-principianti','pk-fondamentali'], tags:['ricezione','lancio','bersaglio'],
  passi:[
    ['Lancio oltre la rete','L\'allenatore lancia la palla con due mani, alta, verso B in zona 6.',0],
    ['Ricezione','B si sistema dietro la palla e fa bagher verso C, vicino alla rete in zona 2-3.',1],
    ['Presa','C blocca la palla e la porta nella cesta. Dopo 8 palle B passa al posto di C.',2]],
  attenzione:['Spalle rivolte verso C prima che arrivi la palla.','Palla alta verso la rete, non tesa.','Ferma i piedi prima del contatto.'],
  errori:[['La palla torna dall\'altra parte della rete','Il piano delle braccia è troppo dritto: orientalo verso C, girando spalle e piedi.'],['La palla arriva bassa a C','Spingi di più con le gambe verso l\'alto.']],
  varianti:{facile:'Lancio da metà campo avversario, corto e lento.', difficile:'Lancio dalla linea di fondo avversaria, alternando zone 1, 6 e 5.'},
  anim:{tipo:'campo', vista:'intero', elementi:[all(), at('b','B'), at('c','C'), co('k'), pa()],
    fotogrammi:[F({all:[12.5,4.5], b:[3,4.5], c:[8,5.6], k:[8.3,6.4], pa:[12.2,4.4]},null,0.6), F({pa:[3.3,4.4]},1.6,0.15,3), F({pa:[7.8,5.5]},1.3,0.7,2.6)]}});

E({id:'pp-bagher-avanti', titolo:'Passo avanti e bagher sulla palla corta', obiettivo:'Tecnica', ambito:'Ricezione', prepara:'Ricezione: spostamento in avanti',
  descrizione:'A coppie: A lancia corto, un paio di metri davanti a B, che fa un passo o due in avanti e gioca la palla in bagher verso A.',
  serveA:'Le palle corte sono le più difficili per chi inizia: si impara ad andare incontro alla palla con le braccia già pronte.',
  lavora:{fondamentali:['Ricezione','Difesa'], muscoli:['spalle','quadricipiti','glutei']}, difficolta:2, giocatori:[2,12], durata:8,
  materiale:['Palloni'], materialeNote:'1 pallone a coppia', pacchetti:['pk-principianti'], tags:['bagher','spostamenti','palla corta'],
  passi:[
    ['Lancio corto','A lancia la palla morbida, a due metri davanti a B.',0],
    ['Passo avanti','B fa un passo in avanti e abbassa le gambe, braccia unite e tese.',1],
    ['Bagher e ritorno','Bagher alto verso A, poi B torna indietro al punto di partenza.',2]],
  attenzione:['Unisci le braccia mentre ti sposti, non dopo.','Ultimo passo con le gambe piegate: arrivi basso sulla palla.','Ritorna subito indietro dopo il bagher.'],
  errori:[['Si corre con le braccia unite','Corri con le braccia libere e uniscile solo nell\'ultimo passo.'],['La palla parte bassa e tesa','Sotto la palla con le gambe piegate: la spinta deve andare verso l\'alto.']],
  varianti:{facile:'Lancio a un solo passo di distanza.', difficile:'A alterna palle corte e lunghe, senza avvisare.'},
  anim:{tipo:'campo', vista:'meta', elementi:[at('a','A'), at('b','B'), pa()],
    fotogrammi:[F({a:[7.6,4.5], b:[2.2,4.5], pa:[7.3,4.4]},null,0.5), F({pa:[4.05,4.4], b:[3.8,4.5]},1.2,0.2,1.8), F({pa:[7.3,4.4]},1.3,0.2,2.6), F({b:[2.2,4.5]},0.8,0.5)]}});

/* ---------------- BATTUTA */
E({id:'pp-bat-lancio', titolo:'Il lancio della battuta', obiettivo:'Tecnica', ambito:'Battuta', prepara:'Battuta dall\'alto: il lancio',
  descrizione:'Senza colpire: si lancia la palla con una mano, davanti alla spalla del braccio che batte, e la si lascia ricadere (o la si riprende) controllando dove cade.',
  serveA:'Metà della battuta è il lancio: se la palla cade sempre nello stesso punto, colpirla diventa facile.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle']}, difficolta:1, giocatori:[1,12], durata:5,
  dose:{serie:2, ripetizioni:10}, materiale:['Palloni','Coni'], materialeNote:'1 pallone a testa; un cerchio o un segno a terra', pacchetti:['pk-principianti','pk-casa'], tags:['battuta','lancio','da soli'],
  passi:[
    ['Posizione','Piede opposto al braccio che batte davanti. La palla è nella mano che lancia, davanti alla spalla del braccio che batte.',0],
    ['Lancio','Alza il braccio teso e lascia la palla quando la mano è all\'altezza della testa: deve salire di circa un metro.',1],
    ['Il braccio si carica','Mentre la palla sale porta il braccio che batte in alto, gomito all\'altezza dell\'orecchio.',2],
    ['Controllo','Lascia cadere la palla: deve cadere un passo davanti al piede avanti, in linea con la spalla.',3]],
  attenzione:['La palla non gira: si lancia con il palmo, non con le dita.','Il braccio che lancia sale teso, senza scatti.','Sempre la stessa altezza.'],
  errori:[['La palla cade dietro la testa','Lascia la palla prima, quando il braccio è ancora davanti al viso.'],['La palla gira molto','Spingila con tutta la mano aperta, senza far scattare il polso.'],['Il lancio è troppo alto','Basta un metro sopra la testa: più è alto, più è difficile da colpire.']],
  varianti:{facile:'Lancio a due mani, poi presa a due mani.', difficile:'Metti un cerchio a terra: il lancio vale solo se la palla ci cade dentro.'},
  anim:corpo('lato', [['bat_lancio_giu',null,0.5],['bat_lancio_su',0.6,0.05,null,{su:[114,-90]}],['bat_lancio_su',0.45,0.1,null,{su:[116,-110]}],['bat_lancio_giu',0.8,0.4,null,{su:[134,190]}]], {ancora:'anN', attrezzi:[{tipo:'palla', su:'haF', dy:-9, sopra:true}]})});

E({id:'pp-bat-pendolo', titolo:'Battuta dal basso: il pendolo del braccio', obiettivo:'Tecnica', ambito:'Battuta', prepara:'Battuta dal basso',
  descrizione:'Da soli, verso una rete o un compagno a 4-5 metri: si impara il movimento della battuta dal basso, con il braccio teso che oscilla come un pendolo.',
  serveA:'È la prima battuta da imparare: semplice e sicura, permette subito di mettere la palla in gioco.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle','quadricipiti']}, difficolta:1, giocatori:[1,12], durata:6,
  dose:{serie:3, ripetizioni:8}, materiale:['Palloni'], pacchetti:['pk-principianti'], tags:['battuta dal basso','pendolo'],
  passi:[
    ['Posizione','Piede opposto al braccio che batte davanti, busto un po\' in avanti. La palla è nella mano davanti al corpo, all\'altezza della vita.',0],
    ['Braccio indietro','Il braccio che batte, teso, va indietro come un pendolo. Il peso è sul piede dietro.',0],
    ['Colpo','Il braccio torna avanti e colpisce la palla sotto e dietro, con la mano chiusa a pugno o rigida. Il peso passa sul piede avanti.',1],
    ['Accompagna','Il braccio continua verso il bersaglio e la palla parte alta e morbida.',2]],
  attenzione:['Il braccio resta teso per tutto il movimento.','Guarda la palla fino al contatto.','La mano che tiene la palla la lascia appena prima del colpo, senza lanciarla.'],
  errori:[['La palla va bassa','Colpisci più sotto la palla e accompagna verso l\'alto.'],['Si manca la palla','Tieni la palla ferma, bassa e davanti al braccio che batte: il pendolo passa sempre di lì.'],['La palla va di lato','Spalle e piedi rivolti verso il bersaglio, braccio che oscilla dritto.']],
  varianti:{facile:'Colpisci la palla tenuta ferma da un compagno, senza lasciarla.', difficile:'Batti verso un compagno a 6 metri, che deve prenderla senza muoversi.'},
  anim:corpo('lato', [['bat_basso_carica',null,0.5],['bat_basso_colpo',0.35,0.05,null,{su:'haF', dy:-6}],['bat_basso_colpo',0.6,0.4,null,{su:[260,-40]}]], {ancora:'anN', attrezzi:[{tipo:'palla', su:'haF', dy:-6, sopra:true}]})});
ES[ES.length-1].anim.fotogrammi[0].salto=true;

E({id:'pp-bat-basso-muro', titolo:'Battuta dal basso contro il muro', obiettivo:'Tecnica', ambito:'Battuta', prepara:'Battuta dal basso',
  descrizione:'A 4-5 metri da un muro, con una linea all\'altezza della rete: si batte dal basso cercando di colpire il muro sopra la linea, e si riprende la palla al ritorno.',
  serveA:'Molte ripetizioni in poco spazio, con un bersaglio chiaro: la linea è la rete.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle']}, difficolta:1, giocatori:[1,12], durata:6,
  dose:{serie:3, ripetizioni:10}, materiale:['Palloni','Muro o spalliera'], materialeNote:'nastro adesivo per segnare la linea sul muro', pacchetti:['pk-principianti'], tags:['battuta dal basso','muro','da soli'],
  passi:[
    ['Posizione','A 4-5 metri dal muro, posizione della battuta dal basso.',0],
    ['Colpo','Braccio indietro e colpo sotto la palla: deve salire e toccare il muro sopra la linea.',1],
    ['Ritorno','Riprendi la palla al ritorno, anche dopo un rimbalzo, e ripeti.',2]],
  attenzione:['Il braccio oscilla dritto verso il muro.','Il peso passa sul piede avanti durante il colpo.','Allontanati di un passo ogni 5 battute buone.'],
  errori:[['La palla tocca il muro sotto la linea','Colpisci più sotto la palla e accompagna di più il braccio verso l\'alto.'],['La palla va di lato','Gira i piedi verso il muro: le spalle guardano il punto da colpire.']],
  varianti:{facile:'A 3 metri dal muro.', difficile:'Tre segni sul muro (destra, centro, sinistra): colpiscili in ordine.'},
  anim:corpo('lato', [['bat_basso_carica',null,0.5],['bat_basso_colpo',0.35,0.05,null,{su:'haF', dy:-6}],['bat_basso_colpo',0.6,0.2,null,{su:[262,30]}]], {ancora:'anN', attrezzi:[{tipo:'palla', su:'haF', dy:-6, sopra:true},{tipo:'muro', x:272}]})});
ES[ES.length-1].anim.fotogrammi[0].ritorno=1.0;

E({id:'pp-bat-3metri', titolo:'Battuta dal basso da vicino alla rete', obiettivo:'Tecnica', ambito:'Battuta', prepara:'Battuta dal basso',
  descrizione:'A coppie ai due lati della rete, ciascuno a 3-4 metri dalla rete: si batte dal basso verso il compagno, che blocca e ribatte. Si arretra di un passo ogni 3 battute buone.',
  serveA:'Dalla distanza corta alla linea di fondo, un passo alla volta: la battuta si costruisce senza errori e senza fretta.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle']}, difficolta:1, giocatori:[2,12], durata:10,
  materiale:['Palloni'], materialeNote:'1 pallone a coppia; rete abbassata se possibile', pacchetti:['pk-principianti','pk-fondamentali'], tags:['battuta dal basso','coppie','progressione'],
  passi:[
    ['Distanza corta','A batte dal basso da 3-4 metri dalla rete verso B.',1],
    ['Presa','B blocca la palla e batte di ritorno.',2],
    ['Arretra','Dopo 3 battute buone di fila si fa un passo indietro, fino alla linea di fondo.',3]],
  attenzione:['La palla passa la rete con almeno un metro di margine.','Sempre la stessa routine: posizione, respiro, colpo.','Si arretra solo dopo 3 battute buone.'],
  errori:[['La palla va in rete','Colpisci più sotto e accompagna verso l\'alto.'],['La palla va troppo lunga','Accorcia l\'oscillazione del braccio: più corta, meno forte.']],
  varianti:{facile:'Rete abbassata o una corda tesa a 2 metri.', difficile:'Dalla linea di fondo, verso un compagno che si sposta in zone diverse.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('a','A'), at('b','B'), pa()],
    fotogrammi:[F({a:[5.6,4.5], b:[12.6,4.5], pa:[5.9,4.4]},null,0.6), F({pa:[12.3,4.4]},1.4,0.4,2.6), F({pa:[5.9,4.4]},1.4,0.4,2.6), F({a:[4.6,4.5], b:[13.6,4.5], pa:[4.9,4.4]},0.8,0.6)]}});

E({id:'pp-bat-colpo-tenuta', titolo:'Colpo dall\'alto sulla palla tenuta ferma', obiettivo:'Tecnica', ambito:'Battuta', prepara:'Battuta dall\'alto: il contatto',
  descrizione:'Un compagno in piedi su una sedia (o più alto) tiene la palla ferma sopra e davanti alla spalla di chi batte. Si colpisce la palla con la mano aperta e rigida, facendola uscire dalle mani del compagno.',
  serveA:'Senza il lancio ci si concentra solo su braccio caricato, punto di contatto e mano rigida.',
  lavora:{fondamentali:['Battuta','Attacco'], muscoli:['spalle','obliqui']}, difficolta:1, giocatori:[2,12], durata:6,
  dose:{serie:2, ripetizioni:8}, materiale:['Palloni','Sedia'], pacchetti:['pk-principianti'], tags:['battuta dall\'alto','contatto','coppie'],
  passi:[
    ['Braccio caricato','Gomito alto all\'altezza dell\'orecchio, mano aperta dietro la testa; l\'altro braccio punta la palla.',0],
    ['Contatto','Distendi il braccio e colpisci la palla al centro, con il palmo aperto e il polso fermo.',1],
    ['La palla esce','Il compagno la lascia andare: la palla parte dritta in avanti, senza girare.',2]],
  attenzione:['La palla va colpita con il braccio teso, nel punto più alto.','Mano rigida e aperta, dita unite.','Il colpo parte da spalla e busto, non solo dal braccio.'],
  errori:[['Si colpisce con il braccio piegato','Fai tenere la palla un po\' più in alto: devi distendere il braccio per arrivarci.'],['La palla gira','Polso fermo al contatto, senza chiudere la mano sopra la palla.']],
  varianti:{facile:'Colpisci piano la palla tenuta da un compagno all\'altezza della tua mano tesa.', difficile:'Il compagno lascia cadere la palla dall\'alto: colpiscila prima che scenda sotto la testa.'},
  anim:corpo('lato', [['bat_lancio_su',null,0.6],['bat_colpo',0.3,0.1],['bat_colpo',0.5,0.5,null,{su:[260,-30]}]], {ancora:'anN', attrezzi:[{tipo:'palla', su:[126,-18], sopra:true}]})});
ES[ES.length-1].anim.fotogrammi[0].salto=true;

E({id:'pp-bat-alto-muro', titolo:'Battuta dall\'alto contro il muro', obiettivo:'Tecnica', ambito:'Battuta', prepara:'Battuta dall\'alto',
  descrizione:'A 4-5 metri da un muro: lancio, caricamento e colpo dall\'alto verso il muro, sopra una linea all\'altezza della rete.',
  serveA:'Mette insieme lancio e colpo con tante ripetizioni, prima di battere sul campo.',
  lavora:{fondamentali:['Battuta'], muscoli:['spalle','obliqui','cuffia']}, difficolta:2, giocatori:[1,12], durata:8,
  dose:{serie:3, ripetizioni:8}, materiale:['Palloni','Muro o spalliera'], pacchetti:['pk-principianti'], tags:['battuta dall\'alto','muro','da soli'],
  passi:[
    ['Posizione','Piede opposto al braccio che batte davanti, palla nella mano che lancia.',0],
    ['Lancio e carica','Lancio basso davanti alla spalla, e intanto carichi il braccio con il gomito alto.',1],
    ['Colpo','Colpisci la palla al centro con la mano aperta, nel punto più alto.',2],
    ['Al muro','La palla parte dritta e tocca il muro sopra la linea. Riprendila e ripeti.',3]],
  attenzione:['Lancio basso e sempre uguale.','Gomito alto, mai sotto la spalla.','Peso che passa sul piede avanti al momento del colpo.'],
  errori:[['La palla va verso il basso','Il lancio è troppo avanti: lancia un po\' più vicino alla testa.'],['La palla va alta, sopra il segno','Colpisci la palla al centro, non sotto.']],
  varianti:{facile:'A 3 metri, colpo sulla palla lanciata con due mani.', difficile:'A 6 metri, con un segno piccolo da colpire.'},
  anim:corpo('lato', [['bat_lancio_giu',null,0.4],['bat_lancio_su',0.5,0.05,null,{su:[118,-70]}],['bat_colpo',0.3,0.05,null,{su:'haN', dy:-10}],['bat_colpo',0.5,0.4,null,{su:[262,30]}]], {ancora:'anN', attrezzi:[{tipo:'palla', su:'haF', dy:-9, sopra:true},{tipo:'muro', x:272}]})});
ES[ES.length-1].anim.fotogrammi[0].ritorno=1.0;

/* ---------------- ATTACCO */
E({id:'pp-att-braccio', titolo:'Il movimento del braccio d\'attacco, senza palla', obiettivo:'Tecnica', ambito:'Attacco', prepara:'Attacco: movimento del braccio',
  descrizione:'Da fermi, senza palla: si impara il caricamento del braccio (gomito alto, mano dietro la testa) e la frustata verso l\'alto e in avanti.',
  serveA:'Il braccio d\'attacco è un movimento nuovo per chi inizia: va imparato da fermi, lentamente, prima di aggiungere palla e salto.',
  lavora:{fondamentali:['Attacco','Battuta'], muscoli:['spalle','cuffia','obliqui']}, difficolta:1, giocatori:[1,20], durata:4,
  dose:{serie:2, ripetizioni:10}, materiale:['Corpo libero'], pacchetti:['pk-principianti','pk-casa'], tags:['attacco','senza palla','primo approccio'],
  passi:[
    ['Partenza','In piedi, piede opposto al braccio che attacca davanti.',0],
    ['Caricamento','Le due braccia salgono; il braccio che attacca si piega con il gomito alto, all\'altezza dell\'orecchio, e la mano va dietro la testa. L\'altro braccio punta in alto.',1],
    ['Frustata','Il braccio si distende verso l\'alto e in avanti, come per colpire una palla sopra la testa.',2],
    ['Fine','Il braccio scende davanti al corpo, sul lato opposto. Ripeti lentamente, poi più veloce.',3]],
  attenzione:['Gomito sempre più alto della spalla.','Il colpo è nel punto più alto, con il braccio teso.','Il busto ruota: prima la spalla, poi il gomito, poi la mano.'],
  errori:[['Il gomito resta basso','Immagina di tirare fuori la mano da una tasca dietro la testa: il gomito sale da solo.'],['Si spinge la palla come un lancio del peso','Il braccio va a frusta: la mano arriva per ultima, veloce.']],
  varianti:{facile:'Davanti a uno specchio, fermandosi in ogni posizione.', difficile:'Con un elastico leggero o un asciugamano in mano, per sentire la frustata.'},
  anim:corpo('lato', [['in_piedi',null,0.5],['attacco_carica',0.7,0.5],['attacco_colpo',0.35,0.2],['attacco_fine',0.4,0.6]], {ancora:'anN'})});

E({id:'pp-att-lancio-una-mano', titolo:'Lancio della palla a una mano sopra la testa', obiettivo:'Tecnica', ambito:'Attacco', prepara:'Attacco: movimento del braccio',
  descrizione:'A coppie a 6-8 metri, oppure contro un muro: si lancia la palla con una mano, partendo da dietro la testa con il gomito alto, come nel tiro della pallamano.',
  serveA:'Il lancio a una mano usa lo stesso movimento del braccio d\'attacco: lo rende naturale prima di colpire.',
  lavora:{fondamentali:['Attacco','Battuta'], muscoli:['spalle','cuffia','obliqui']}, difficolta:1, giocatori:[2,12], durata:6,
  dose:{serie:2, ripetizioni:10}, materiale:['Palloni'], materialeNote:'1 pallone a coppia (anche una palla più piccola va bene)', pacchetti:['pk-principianti'], tags:['attacco','lancio','coppie'],
  passi:[
    ['Carica','Palla nella mano del braccio che attacca, dietro la testa, gomito alto. L\'altro braccio punta in avanti.',0],
    ['Lancio','Ruota il busto e distendi il braccio verso l\'alto e in avanti: la palla parte dal punto più alto.',1],
    ['Fine','Il braccio scende davanti al corpo. Il compagno blocca e rilancia allo stesso modo.',2]],
  attenzione:['La palla parte sopra la testa, non dalla spalla.','Gomito alto durante tutto il caricamento.','Il piede opposto al braccio è davanti.'],
  errori:[['La palla parte da di lato, come un lancio a parabola','Gomito più alto: la mano passa sopra la testa, non di fianco.'],['Si lancia solo con il braccio','Ruota anche busto e spalle, come per tirare lontano.']],
  varianti:{facile:'Lancio a due mani sopra la testa.', difficile:'Lancio a una mano verso il basso, a far rimbalzare la palla davanti al compagno.'},
  anim:corpo('lato', [['lancio_sopra_carica',null,0.6],['attacco_colpo',0.3,0.05],['attacco_fine',0.6,0.5,null,{su:[270,0]}]], {ancora:'anN', attrezzi:[{tipo:'palla', su:'haN', dy:-8, sopra:true}]})});
ES[ES.length-1].anim.fotogrammi[0].salto=true;

E({id:'pp-att-palla-tenuta', titolo:'Colpo d\'attacco sulla palla tenuta alta', obiettivo:'Tecnica', ambito:'Attacco', prepara:'Attacco: colpo sulla palla',
  descrizione:'Un compagno su una sedia tiene la palla ferma in alto, davanti a chi attacca. Da fermi si carica il braccio e si colpisce la palla verso il basso, facendola uscire dalle mani del compagno.',
  serveA:'Il colpo d\'attacco senza il problema del tempo: la palla è ferma, si pensa solo a mano, polso e direzione.',
  lavora:{fondamentali:['Attacco'], muscoli:['spalle','cuffia','addome']}, difficolta:1, giocatori:[2,12], durata:6,
  dose:{serie:2, ripetizioni:8}, materiale:['Palloni','Sedia'], pacchetti:['pk-principianti'], tags:['attacco','contatto','coppie'],
  passi:[
    ['Carica','Gomito alto, mano dietro la testa, l\'altro braccio punta la palla.',0],
    ['Colpo','Distendi il braccio e colpisci la palla in alto e dietro, con tutta la mano aperta.',1],
    ['Polso','Chiudi il polso sopra la palla: deve partire in avanti e verso il basso.',2]],
  attenzione:['Colpisci con il braccio teso, nel punto più alto.','Mano aperta, a coppa sulla palla.','Il polso si chiude dopo il contatto, non prima.'],
  errori:[['La palla va in alto','Colpisci la palla più in alto e chiudi il polso.'],['Ci si fa male alla mano','Colpisci con tutto il palmo, non con le dita: mano morbida ma ferma.']],
  varianti:{facile:'Palla tenuta all\'altezza della mano tesa, senza sedia.', difficile:'Con un passo di rincorsa prima del colpo.'},
  anim:corpo('lato', [['attacco_carica',null,0.6],['attacco_colpo',0.3,0.05],['attacco_fine',0.4,0.5,null,{su:[240,170]}]], {ancora:'anN', attrezzi:[{tipo:'palla', su:[120,-16], sopra:true}]})});
ES[ES.length-1].anim.fotogrammi[0].salto=true;

E({id:'pp-att-rincorsa', titolo:'Rincorsa a tre passi senza salto', obiettivo:'Tecnica', ambito:'Attacco', prepara:'Attacco: rincorsa',
  descrizione:'Tre coni a terra segnano i passi della rincorsa verso la rete: si cammina, poi si corre, sui tre appoggi fermandosi a piedi pari dopo l\'ultimo passo, senza saltare.',
  serveA:'La rincorsa giusta (sinistro-destro-sinistro per chi attacca con la destra) va imparata prima di aggiungere salto e palla.',
  lavora:{fondamentali:['Attacco'], muscoli:['quadricipiti','polpacci','glutei']}, difficolta:1, giocatori:[1,12], durata:5,
  dose:{serie:2, ripetizioni:8}, materiale:['Coni'], materialeNote:'3 coni o segni a terra per ogni fila', pacchetti:['pk-principianti'], tags:['attacco','rincorsa','passi'],
  passi:[
    ['Primo passo','Partenza a 3-4 metri dalla rete. Il primo passo (sinistro, per chi attacca con la destra) è corto e lento.',1],
    ['Secondo passo','Il secondo passo (destro) è lungo e veloce: le braccia vanno indietro.',2],
    ['Chiusura','Il piede sinistro raggiunge il destro: i piedi sono paralleli, le gambe piegate e le braccia dietro, pronte a salire.',3]],
  attenzione:['Ritmo: lento, veloce-veloce.','L\'ultimo appoggio è a piedi quasi paralleli, a mezzo metro dalla rete.','Le braccia vanno indietro nel secondo passo.'],
  errori:[['Passi tutti uguali','Pensa a "ta... ta-ta": il primo passo lento, gli ultimi due rapidi.'],['Si arriva troppo vicini alla rete','Parti un passo più indietro, o accorcia il primo passo.'],['Piede sbagliato all\'inizio','Chi attacca con la destra parte con il sinistro; chi attacca con la sinistra con il destro.']],
  varianti:{facile:'Camminando, dicendo ad alta voce "uno, due-tre".', difficile:'Alla fine dei tre passi salta e porta le braccia in alto.'},
  anim:{tipo:'campo', vista:'meta', zone:true, elementi:[at('a','A'), co('c1'), co('c2'), co('c3')],
    fotogrammi:[F({a:[4.4,3], c1:[5.6,2.6], c2:[7,2.2], c3:[8.1,1.9]},null,0.5), F({a:[5.6,2.6]},0.7,0.1), F({a:[7,2.2]},0.4,0.05), F({a:[8.1,1.9]},0.3,0.8)]}});

E({id:'pp-att-stacco-presa', titolo:'Stacco a due piedi e presa della palla in alto', obiettivo:'Tecnica', ambito:'Attacco', prepara:'Attacco: stacco e tempo sulla palla',
  descrizione:'Un compagno lancia una palla alta vicino alla rete; si fa la rincorsa, si stacca a due piedi e si prende la palla con due mani nel punto più alto, poi si atterra morbidi.',
  serveA:'Insegna il tempo della rincorsa rispetto alla palla, la parte più difficile dell\'attacco, senza dover ancora colpire.',
  lavora:{fondamentali:['Attacco'], muscoli:['quadricipiti','glutei','polpacci','spalle']}, difficolta:2, giocatori:[2,12], durata:8,
  dose:{serie:2, ripetizioni:6}, materiale:['Palloni'], pacchetti:['pk-principianti'], tags:['attacco','salto','tempo','presa'],
  passi:[
    ['Lancio','Il compagno lancia la palla alta, a un metro dalla rete. Parti con la rincorsa quando la palla è al punto più alto.',0],
    ['Stacco','Ultimo passo a piedi pari, gambe piegate e braccia dietro; poi salta portando le braccia in alto.',0],
    ['Presa in alto','Prendi la palla con due mani nel punto più alto del salto, davanti alla testa.',1],
    ['Atterraggio','Atterra su due piedi, ginocchia piegate e morbide, nello stesso punto da cui sei saltato.',2]],
  attenzione:['Parti quando la palla scende, non quando è lanciata.','La palla si prende davanti, mai sopra o dietro la testa.','Atterraggio morbido, su due piedi.'],
  errori:[['Si arriva prima della palla','Aspetta di più prima di partire, oppure fai la rincorsa più lenta.'],['Si salta in avanti verso la rete','L\'ultimo passo frena: il salto va in alto, non in avanti.']],
  varianti:{facile:'Senza rincorsa: salto da fermi e presa.', difficile:'Prendi la palla con una sola mano, quella che attacca.'},
  anim:corpo('lato', [['carica_salto',null,0.5,null,{su:[150,-120]}],['salto_presa',0.4,0.15],['atterraggio',0.45,0.6]], {ancora:'anN', attrezzi:[{tipo:'palla', su:'mani', dy:-10, sopra:true}]})});

E({id:'pp-att-autolancio', titolo:'Attacco da fermo su autolancio', obiettivo:'Tecnica', ambito:'Attacco', prepara:'Attacco',
  descrizione:'Vicino alla rete (abbassata se possibile): ci si lancia la palla davanti e sopra la spalla del braccio che attacca e la si colpisce da fermi, mandandola nel campo avversario.',
  serveA:'Mette insieme braccio caricato e colpo sulla palla in movimento, senza la difficoltà della rincorsa.',
  lavora:{fondamentali:['Attacco'], muscoli:['spalle','cuffia','addome']}, difficolta:2, giocatori:[1,12], durata:8,
  dose:{serie:3, ripetizioni:6}, materiale:['Palloni'], materialeNote:'una cesta di palloni; rete abbassata', pacchetti:['pk-principianti'], tags:['attacco','autolancio','da fermi'],
  passi:[
    ['Autolancio','A un metro e mezzo dalla rete lancia la palla con due mani, davanti alla spalla del braccio che attacca, un metro sopra la testa.',1],
    ['Carica e colpo','Carica il braccio mentre la palla sale e colpiscila nel punto più alto, mano aperta.',2],
    ['Nel campo','La palla passa la rete e cade nel campo avversario. Prendi un\'altra palla dalla cesta.',3]],
  attenzione:['Il lancio è davanti alla spalla, non sopra la testa.','Polso che si chiude sulla palla.','Non toccare la rete.'],
  errori:[['La palla va in rete','Allontanati dalla rete e colpisci più alto.'],['La palla va lunga','Chiudi di più il polso e colpisci la palla un po\' più dietro.']],
  varianti:{facile:'Rete molto bassa, colpo senza chiudere il polso.', difficile:'Con un passo di rincorsa e un piccolo salto.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('a','A'), ca(), pa()],
    fotogrammi:[F({a:[7.4,2.4], car:[5.4,3.8], pa:[7.7,2.3]},null,0.5), F({pa:[7.9,2.2]},0.7,0.05,1.4), F({pa:[8,2.2]},0.15,0.05), F({pa:[13.5,3.6]},0.6,0.8,0.6)]}});

E({id:'pp-att-palla-sopra-rete', titolo:'Attacco sulla palla tenuta sopra la rete', obiettivo:'Tecnica', ambito:'Attacco', prepara:'Attacco: rincorsa, salto e colpo',
  descrizione:'L\'allenatore su un rialzo tiene la palla ferma sopra la rete. Si fa la rincorsa a tre passi, si salta e si colpisce la palla facendola uscire dalle sue mani verso il campo avversario.',
  serveA:'Il primo attacco completo: rincorsa, salto e colpo, ma con la palla sempre nello stesso punto.',
  lavora:{fondamentali:['Attacco'], muscoli:['quadricipiti','glutei','spalle','addome']}, difficolta:2, giocatori:[2,12], durata:10,
  materiale:['Palloni','Sedia'], materialeNote:'un rialzo stabile o una sedia per l\'allenatore', pacchetti:['pk-principianti','pk-fondamentali'], tags:['attacco','rialzo','salto'],
  passi:[
    ['Rincorsa','Parti da 3-4 metri dalla rete, in zona 4, e fai la rincorsa a tre passi.',1],
    ['Salto e colpo','Salta davanti alla palla e colpiscila con il braccio teso, mano aperta.',2],
    ['La palla passa','L\'allenatore lascia la palla al contatto: deve cadere nel campo avversario.',3]],
  attenzione:['Salta un po\' dietro la palla, non sotto.','Braccio caricato durante il salto, non prima.','Atterra su due piedi, senza toccare la rete.'],
  errori:[['Si salta sotto la palla','Fermati con l\'ultimo passo mezzo metro prima: la palla deve essere davanti alla spalla.'],['Si tocca la rete','Lo stacco va in alto, non in avanti: frena con l\'ultimo passo.']],
  varianti:{facile:'Palla tenuta più bassa e salto da fermi.', difficile:'L\'allenatore lascia cadere la palla un attimo prima del colpo.'},
  anim:{tipo:'campo', vista:'meta', zone:true, elementi:[all(), at('a','A'), pa()],
    fotogrammi:[F({all:[9.8,1.6], a:[4.6,3], pa:[9.15,1.8]},null,0.5), F({a:[7,2.4]},0.8,0.05), F({a:[8.2,2.3]},0.4,0.1), F({pa:[10.6,3.4]},0.4,0.7,0.4)]}});

/* ---------------- MURO */
E({id:'pp-muro-gesto', titolo:'Il gesto del muro senza rete', obiettivo:'Tecnica', ambito:'Muro', prepara:'Muro: posizione e salto',
  descrizione:'Senza rete e senza palla: posizione di partenza con le mani davanti alle spalle, piccolo piegamento e salto con le braccia che salgono tese e vicine, poi atterraggio morbido.',
  serveA:'Il muro è un salto diverso da quello d\'attacco: le braccia partono già alte e salgono dritte, senza slancio.',
  lavora:{fondamentali:['Muro'], muscoli:['quadricipiti','polpacci','spalle']}, difficolta:1, giocatori:[1,20], durata:4,
  dose:{serie:2, ripetizioni:8}, materiale:['Corpo libero'], pacchetti:['pk-principianti','pk-casa'], tags:['muro','senza palla','salto'],
  passi:[
    ['Pronto','Piedi alla larghezza delle spalle, gambe appena piegate, mani aperte davanti alle spalle, gomiti in avanti.',0],
    ['Piegamento','Piega le gambe velocemente, senza abbassare le braccia.',1],
    ['Salto','Salta in verticale spingendo le braccia tese in alto e un po\' in avanti, mani aperte e dita larghe.',2],
    ['Atterraggio','Riporta le mani davanti alle spalle e atterra su due piedi, morbido, pronto a ripartire.',3]],
  attenzione:['Le braccia non scendono mai sotto le spalle.','Mani vicine: tra le due mani non deve passare una palla.','Salto verticale, non in avanti.'],
  errori:[['Si slanciano le braccia dal basso','Tieni le mani davanti alle spalle anche durante il piegamento.'],['Mani troppo larghe','Pollici rivolti in alto e vicini: le mani formano una parete.']],
  varianti:{facile:'Senza salto: solo la spinta delle braccia in alto sulle punte.', difficile:'Due salti di fila, con il secondo il più veloce possibile.'},
  anim:corpo('fronte', [['f_muro_pronto',null,0.6],['f_muro_carica',0.35,0.1],['f_muro_salto',0.35,0.3],['f_muro_pronto',0.45,0.5]])});

E({id:'pp-muro-mani-coppie', titolo:'Mani sopra la rete a coppie', obiettivo:'Tecnica', ambito:'Muro', prepara:'Muro: spostamento lungo la rete',
  descrizione:'Due giocatori uno di fronte all\'altro ai lati della rete. Si spostano insieme lungo la rete con passi laterali e, a ogni fermata, saltano e si battono le mani sopra la rete.',
  serveA:'Abitua a stare vicino alla rete, a muoversi di lato senza toccarla e a portare le mani oltre il nastro.',
  lavora:{fondamentali:['Muro'], muscoli:['quadricipiti','polpacci','adduttori']}, difficolta:1, giocatori:[2,12], durata:6,
  dose:{serie:2, ripetizioni:6}, materiale:['Corpo libero'], materialeNote:'rete abbassata se possibile', pacchetti:['pk-principianti'], tags:['muro','coppie','spostamenti'],
  passi:[
    ['Di fronte','A e B si guardano ai due lati della rete, a mezzo metro dal nastro, mani davanti alle spalle.',0],
    ['Salto','Saltano insieme e si battono le mani sopra la rete.',1],
    ['Spostamento','Due passi laterali nella stessa direzione, poi un nuovo salto. Arrivati all\'antenna si torna indietro.',2]],
  attenzione:['Passi laterali senza incrociare i piedi.','Mani sempre alte durante lo spostamento.','Non toccare la rete con le mani o con il corpo.'],
  errori:[['Si salta in avanti e si tocca la rete','Fermati bene prima di saltare: il salto è verticale.'],['Si abbassano le braccia durante i passi','Tieni le mani all\'altezza della fronte, come se dovessi murare in ogni momento.']],
  varianti:{facile:'Senza salto, ci si tocca le mani sopra la rete abbassata.', difficile:'Uno dei due cambia direzione all\'improvviso e l\'altro deve seguirlo.'},
  anim:{tipo:'campo', vista:'meta', zone:true, elementi:[at('a','A'), av('b','B')],
    fotogrammi:[F({a:[8.25,1.6], b:[9.75,1.6]},null,0.6), F({a:[8.45,1.6], b:[9.55,1.6]},0.3,0.3), F({a:[8.25,3.6], b:[9.75,3.6]},0.8,0.1), F({a:[8.45,3.6], b:[9.55,3.6]},0.3,0.3), F({a:[8.25,5.6], b:[9.75,5.6]},0.8,0.1), F({a:[8.45,5.6], b:[9.55,5.6]},0.3,0.5)]}});

E({id:'pp-muro-palla-tenuta', titolo:'Muro sulla palla tenuta sopra la rete', obiettivo:'Tecnica', ambito:'Muro', prepara:'Muro: mani sopra la rete',
  descrizione:'Un compagno su una sedia dall\'altra parte della rete tiene la palla appena sopra il nastro. Chi mura salta e la "copre" con le due mani, spingendola verso il campo del compagno.',
  serveA:'Insegna a portare le mani oltre la rete e a chiuderle sulla palla, il gesto che rende il muro efficace.',
  lavora:{fondamentali:['Muro'], muscoli:['quadricipiti','polpacci','spalle']}, difficolta:1, giocatori:[2,12], durata:6,
  dose:{serie:2, ripetizioni:8}, materiale:['Palloni','Sedia'], pacchetti:['pk-principianti'], tags:['muro','coppie','mani'],
  passi:[
    ['Pronto','Di fronte alla rete, a mezzo metro, mani davanti alle spalle.',0],
    ['Salto','Salto verticale, braccia che salgono dritte e passano sopra il nastro.',1],
    ['Mani sulla palla','Mani aperte e rigide sopra la palla: spingila verso il basso, nel campo del compagno.',1],
    ['Atterraggio','Riporta le braccia indietro senza toccare la rete e atterra morbido.',2]],
  attenzione:['Le mani passano sopra la rete, non la toccano.','Dita larghe e rigide, polsi fermi.','Salto verticale, mai verso la rete.'],
  errori:[['Si colpisce la palla con un colpo','Il muro non colpisce: le mani si fermano sulla palla e la spingono giù.'],['Le mani restano dalla propria parte','Porta le spalle in avanti mentre salti: le braccia passano la rete.']],
  varianti:{facile:'Rete bassa, senza salto: solo le braccia sopra il nastro.', difficile:'Il compagno sposta la palla a destra o a sinistra all\'ultimo momento.'},
  anim:corpo('lato', [['squat_braccia_alto',null,0.5,{aN:[150,10], aF:[148,10]}],['salto',0.35,0.3,{aN:[150,0], aF:[148,0], t:4}],['atterraggio',0.4,0.5]], {ancora:'anN', attrezzi:[{tipo:'palla', su:[155,-44], sopra:true},{tipo:'rete', x:141, y:-22, alt:28}]})});

E({id:'pp-muro-passi-rete', titolo:'Passi laterali lungo la rete con le mani alte', obiettivo:'Tecnica', ambito:'Muro', prepara:'Muro: passo laterale',
  descrizione:'Lungo la rete, senza saltare: passi laterali (passo accostato) da un cono all\'altro con le mani sempre alte davanti alle spalle, fermandosi in posizione di muro.',
  serveA:'Lo spostamento giusto viene prima del salto: piedi paralleli alla rete, passi corti e mani pronte.',
  lavora:{fondamentali:['Muro'], muscoli:['quadricipiti','adduttori','polpacci']}, difficolta:1, giocatori:[1,12], durata:5,
  dose:{serie:3, ripetizioni:4}, materiale:['Coni'], materialeNote:'2 coni a 3 metri di distanza', pacchetti:['pk-principianti'], tags:['muro','spostamenti','senza salto'],
  passi:[
    ['Partenza','Al primo cono, di fronte alla rete, in posizione di muro.',0],
    ['Passo accostato','Un piede va di lato, l\'altro lo raggiunge senza incrociarsi. Le mani restano alte.',1],
    ['Fermata','Arrivato al secondo cono fermati: piedi paralleli alla rete, gambe piegate, pronto a saltare.',4]],
  attenzione:['Piedi e spalle sempre paralleli alla rete.','Le mani non scendono mai.','Fermata stabile prima di ripartire.'],
  errori:[['Si ruota il corpo e si corre','Guarda sempre la rete davanti a te: i piedi vanno solo di lato.'],['Si salta durante i passi','Passi radenti, i piedi strisciano quasi sul pavimento.']],
  varianti:{facile:'Lento, contando i passi ad alta voce.', difficile:'Alla fine dello spostamento aggiungi il salto a muro.'},
  anim:corpo('fronte', [['f_muro_pronto',null,0.4,{x:70}],['f_scivolo_largo',0.3,0.05,{x:86}],['f_scivolo_stretto',0.3,0.05,{x:102}],['f_scivolo_largo',0.3,0.05,{x:118}],['f_muro_pronto',0.3,0.6,{x:132}]], {attrezzi:[{tipo:'cono', x:46},{tipo:'cono', x:156}]})});

E({id:'pp-muro-palla-lanciata', titolo:'Muro su palla lanciata a due mani', obiettivo:'Tecnica', ambito:'Muro', prepara:'Muro: tempo del salto',
  descrizione:'Un compagno dall\'altra parte della rete, vicino al nastro, lancia la palla a due mani sopra la testa verso il campo di chi mura, che salta e prova a respingerla.',
  serveA:'Primo muro "vero": bisogna saltare al momento giusto, guardando le braccia di chi lancia.',
  lavora:{fondamentali:['Muro'], muscoli:['quadricipiti','polpacci','spalle']}, difficolta:2, giocatori:[2,12], durata:8,
  materiale:['Palloni'], materialeNote:'rete abbassata se possibile', pacchetti:['pk-principianti'], tags:['muro','coppie','tempo'],
  passi:[
    ['Pronto','B è a rete in posizione di muro, di fronte ad A che ha la palla sopra la testa.',0],
    ['Lancio','A lancia la palla con due mani sopra la rete, verso il campo di B.',1],
    ['Muro','B salta un attimo dopo il lancio e respinge la palla nel campo di A.',2]],
  attenzione:['Guarda le braccia di chi lancia, non la palla.','Salta dopo il lancio, non prima.','Mani sopra la rete e polsi fermi.'],
  errori:[['Si salta troppo presto','Aspetta che la palla lasci le mani del compagno.'],['La palla passa tra le mani','Avvicina le mani: pollici a una spanna di distanza.']],
  varianti:{facile:'A lancia lentamente e sempre nello stesso punto.', difficile:'A lancia a destra o a sinistra: B fa un passo laterale prima del salto.'},
  anim:{tipo:'campo', vista:'meta', zone:true, elementi:[at('b','B'), av('a','A'), pa()],
    fotogrammi:[F({b:[8.4,2.4], a:[10.2,2.4], pa:[10,2.3]},null,0.6), F({pa:[9.1,2.35]},0.4,0.05,0.8), F({pa:[10.4,3.2]},0.5,0.6,0.6)]}});

/* ---------------- DIFESA */
E({id:'pp-dif-attesa', titolo:'La posizione di attesa', obiettivo:'Tecnica', ambito:'Difesa', prepara:'Difesa e ricezione: posizione di attesa',
  descrizione:'Senza palla: dal piedi uniti alla posizione di attesa (piedi larghi, gambe piegate, peso in avanti, braccia staccate dal corpo). Si tiene la posizione e si riparte su un segnale.',
  serveA:'In difesa e in ricezione tutto parte da qui: in posizione di attesa si parte in ogni direzione nel minor tempo.',
  lavora:{fondamentali:['Difesa','Ricezione'], muscoli:['quadricipiti','glutei','polpacci']}, difficolta:1, giocatori:[1,20], durata:4,
  dose:{serie:3, tempo:20, recupero:20}, materiale:['Corpo libero'], pacchetti:['pk-principianti','pk-casa'], tags:['difesa','posizione','senza palla','primo approccio'],
  passi:[
    ['In piedi','Piedi alla larghezza delle spalle, uno leggermente avanti.',0],
    ['Gambe piegate','Piega le gambe e porta il busto in avanti: le spalle sono sopra le ginocchia.',1],
    ['Pronto','Peso sulla parte anteriore dei piedi, braccia staccate dal corpo e mani davanti alle ginocchia. Tieni 20 secondi.',2]],
  attenzione:['Talloni appena sollevati: il peso è sugli avampiedi.','Schiena dritta, sguardo avanti.','Braccia rilassate, pronte a unirsi.'],
  errori:[['Peso sui talloni','Porta le spalle più avanti: devi sentire il peso sulle dita dei piedi.'],['Gambe tese e busto piegato','Piega le ginocchia, non la schiena.']],
  varianti:{facile:'Tieni la posizione 10 secondi.', difficile:'Su un battito di mani fai due passi rapidi a destra o a sinistra e torna in posizione.'},
  anim:corpo('lato', [['in_piedi',null,0.6],['mezzo_squat',0.6,0.3],['pronto',0.5,1.0]], {ancora:'anN'})});

E({id:'pp-dif-presa-bassa', titolo:'Presa della palla bassa davanti al corpo', obiettivo:'Tecnica', ambito:'Difesa', prepara:'Difesa: abbassarsi sulla palla',
  descrizione:'A coppie a 4 metri: A lancia la palla bassa e tesa verso le ginocchia di B, che dalla posizione di attesa si abbassa e la prende con due mani davanti al corpo.',
  serveA:'Insegna ad abbassarsi con le gambe e ad andare incontro alla palla con le braccia, prima di difendere in bagher.',
  lavora:{fondamentali:['Difesa'], muscoli:['quadricipiti','glutei']}, difficolta:1, giocatori:[2,12], durata:6,
  dose:{serie:2, ripetizioni:10}, materiale:['Palloni'], pacchetti:['pk-principianti'], tags:['difesa','presa','coppie'],
  passi:[
    ['Attesa','B in posizione di attesa. A lancia la palla verso le sue ginocchia.',0],
    ['Abbassati','B piega le gambe e scende con il corpo, braccia in avanti verso la palla.',1],
    ['Presa','Prende la palla con due mani davanti alle ginocchia e la rilancia ad A.',1]],
  attenzione:['Scendono le gambe, non solo la schiena.','Prendi la palla davanti al corpo, non di lato.','Torna subito in posizione di attesa.'],
  errori:[['Si piega solo la schiena','Abbassa il bacino: le ginocchia si piegano di più.'],['Si aspetta la palla da fermi','Fai un piccolo passo avanti verso la palla mentre ti abbassi.']],
  varianti:{facile:'Lancio lento, all\'altezza della pancia.', difficile:'Il lancio va un passo a destra o a sinistra.'},
  anim:corpo('lato', [['pronto',null,0.4,null,{su:[230,110]}],['bagher',0.6,0.6,{t:30, aN:[50,30], aF:[46,30], lN:[54,82,0], lF:[46,82,0]}]], {ancora:'anN', attrezzi:[{tipo:'palla', su:'mani', dy:-4, sopra:true}]})});

E({id:'pp-dif-laterale-presa', titolo:'Spostamento laterale e presa', obiettivo:'Tecnica', ambito:'Difesa', prepara:'Difesa: spostamenti laterali',
  descrizione:'L\'allenatore lancia la palla a destra o a sinistra di B, a due-tre passi: B si sposta con passi laterali, la prende con due mani davanti al corpo e la rilancia.',
  serveA:'Unisce spostamento e posizione bassa: in difesa la palla raramente arriva addosso.',
  lavora:{fondamentali:['Difesa'], muscoli:['quadricipiti','adduttori','glutei']}, difficolta:1, giocatori:[2,12], durata:6,
  materiale:['Palloni'], pacchetti:['pk-principianti'], tags:['difesa','spostamenti','presa'],
  passi:[
    ['Lancio','L\'allenatore lancia la palla due passi a destra di B.',0],
    ['Spostamento e presa','B si sposta con passi laterali, senza incrociare i piedi, e prende la palla davanti al corpo.',1],
    ['Dall\'altra parte','B rilancia e torna al centro: il lancio successivo va a sinistra.',3]],
  attenzione:['Passi laterali bassi, senza saltellare.','Il corpo resta rivolto verso chi lancia.','Arriva in tempo e fermati prima di prendere la palla.'],
  errori:[['Si incrociano i piedi','Il piede che segue non supera mai l\'altro.'],['Si prende la palla di lato al corpo','Sposta prima i piedi: la palla va presa davanti.']],
  varianti:{facile:'Lancio a un solo passo, sempre dallo stesso lato.', difficile:'Al posto della presa, B fa bagher verso l\'allenatore.'},
  anim:{tipo:'campo', vista:'meta', elementi:[all(), at('b','B'), pa()],
    fotogrammi:[F({all:[7,4.5], b:[3,4.5], pa:[6.7,4.4]},null,0.5), F({b:[3,2.8], pa:[3.3,2.8]},0.9,0.2,1.2), F({pa:[6.7,4.4], b:[3,4.5]},1,0.3,1.4), F({b:[3,6.2], pa:[3.3,6.2]},0.9,0.2,1.2), F({pa:[6.7,4.4], b:[3,4.5]},1,0.3,1.4)]}});

E({id:'pp-dif-palleggio-alto', titolo:'Difesa in palleggio delle palle alte', obiettivo:'Tecnica', ambito:'Difesa', prepara:'Difesa: palleggio sulle palle alte',
  descrizione:'L\'allenatore lancia palle alte e lente sopra la testa di B, che invece di usare il bagher le gioca in palleggio verso un compagno vicino alla rete.',
  serveA:'Le palle alte si giocano meglio in palleggio: si impara a scegliere il fondamentale giusto.',
  lavora:{fondamentali:['Difesa','Palleggio'], muscoli:['spalle','tricipiti','quadricipiti']}, difficolta:2, giocatori:[3,12], durata:8,
  materiale:['Palloni'], pacchetti:['pk-principianti'], tags:['difesa','palleggio','palla alta'],
  passi:[
    ['Palla alta','L\'allenatore lancia la palla alta, sopra la testa di B.',0],
    ['Sotto la palla','B fa un passo indietro e si sistema sotto la palla, mani sopra la fronte.',1],
    ['Palleggio','B palleggia alto verso C, vicino alla rete. C la blocca.',2]],
  attenzione:['Decidi subito: se la palla arriva sopra le spalle, palleggio.','Spostati indietro con passi rapidi, non camminando all\'indietro.','Palleggio alto e verso la rete.'],
  errori:[['Si gioca in bagher con le braccia sopra la testa','Alza le mani a coppa appena vedi che la palla è alta.'],['La palla va dietro','Arretra di più: la palla deve scendere sopra la tua fronte.']],
  varianti:{facile:'Palla lanciata direttamente sopra B, senza spostamento.', difficile:'L\'allenatore alterna palle alte e basse: B sceglie palleggio o bagher.'},
  anim:{tipo:'campo', vista:'meta', elementi:[all(), at('b','B'), at('c','C'), pa()],
    fotogrammi:[F({all:[7.2,4.5], b:[3.4,4.5], c:[8,6], pa:[6.9,4.4]},null,0.5), F({b:[2.6,4.5], pa:[2.85,4.4]},1.3,0.2,3.2), F({pa:[7.8,5.9]},1.3,0.6,2.8)]}});

E({id:'pp-dif-partenze', titolo:'Partenze verso i coni su segnale', obiettivo:'Tecnica', ambito:'Difesa', prepara:'Difesa: reazione e partenza',
  descrizione:'Quattro coni intorno al giocatore, a due metri. L\'allenatore indica un cono: dalla posizione di attesa si parte, lo si tocca con la mano e si torna al centro.',
  serveA:'Allena la prima reazione e la partenza dalla posizione di attesa, senza la palla.',
  lavora:{fondamentali:['Difesa','Ricezione'], muscoli:['quadricipiti','polpacci','glutei']}, difficolta:1, giocatori:[1,12], durata:5,
  dose:{serie:3, ripetizioni:6, recupero:30}, materiale:['Coni'], materialeNote:'4 coni a persona', pacchetti:['pk-principianti'], tags:['difesa','reazione','agilità'],
  passi:[
    ['Attesa','Al centro dei coni, in posizione di attesa.',0],
    ['Partenza','L\'allenatore indica un cono: parti subito, con il primo passo verso il cono.',1],
    ['Tocca e torna','Tocca il cono con la mano, abbassandoti, e torna al centro in posizione.',2]],
  attenzione:['Primo passo rapido, nella direzione giusta.','Abbassati con le gambe per toccare il cono.','Ritorno in posizione prima del segnale successivo.'],
  errori:[['Si parte con un saltello sul posto','Parti direttamente con il piede più vicino al cono.'],['Si torna al centro in piedi','Torna in posizione di attesa, gambe piegate.']],
  varianti:{facile:'Segnale a voce ("destra", "sinistra").', difficile:'L\'allenatore lancia una palla vicino al cono: la si prende invece di toccare il cono.'},
  anim:{tipo:'campo', vista:'meta', elementi:[all(), at('b','B'), co('c1'), co('c2'), co('c3'), co('c4')],
    fotogrammi:[F({all:[7.6,4.5], b:[3.4,4.5], c1:[1.8,2.9], c2:[5,2.9], c3:[1.8,6.1], c4:[5,6.1]},null,0.6), F({b:[4.7,3.2]},0.6,0.15), F({b:[3.4,4.5]},0.6,0.4), F({b:[2.1,5.8]},0.6,0.15), F({b:[3.4,4.5]},0.6,0.4)]}});

E({id:'pp-dif-palla-lanciata', titolo:'Difesa in bagher su palla lanciata', obiettivo:'Tecnica', ambito:'Difesa', prepara:'Difesa in bagher',
  descrizione:'L\'allenatore, a 4-5 metri, lancia la palla con due mani verso il basso, davanti a B. B la difende in bagher, alta, verso il compagno vicino alla rete.',
  serveA:'Primo passo verso la difesa sull\'attacco: palla più veloce del bagher di ricezione, ma ancora prevedibile.',
  lavora:{fondamentali:['Difesa'], muscoli:['quadricipiti','glutei','spalle']}, difficolta:2, giocatori:[3,12], durata:8,
  materiale:['Palloni'], materialeNote:'una cesta di palloni', pacchetti:['pk-principianti','pk-fondamentali'], tags:['difesa','bagher','lancio'],
  passi:[
    ['Attesa','B in posizione di difesa in zona 6, basso, braccia staccate dal corpo.',0],
    ['Lancio','L\'allenatore lancia la palla verso il basso, davanti a B.',1],
    ['Difesa','B unisce le braccia e fa bagher alto, verso C vicino alla rete. C blocca.',2]],
  attenzione:['Le braccia si uniscono all\'ultimo, sulla palla.','Palla alta: dà tempo ai compagni.','Arriva basso con le gambe, non con la schiena.'],
  errori:[['La palla torna dall\'allenatore','Inclina il piano delle braccia verso la rete, girando le spalle verso C.'],['Le braccia colpiscono la palla','In difesa le braccia frenano: tienile ferme e lascia che la palla rimbalzi.']],
  varianti:{facile:'Palla lanciata dal basso, lenta e alta.', difficile:'L\'allenatore lancia da sopra un rialzo, più forte, a destra o a sinistra.'},
  anim:{tipo:'campo', vista:'meta', elementi:[all(), at('b','B'), at('c','C'), pa()],
    fotogrammi:[F({all:[7.4,4.5], b:[2.8,4.5], c:[8,6], pa:[7.1,4.4]},null,0.6), F({pa:[3.15,4.4]},0.6,0.05,0.5), F({pa:[7.8,5.9]},1.3,0.6,3)]}});

/* ---------------- GIOCO */
E({id:'pp-gioco-palla-rilanciata', titolo:'Palla rilanciata: si gioca con la presa', obiettivo:'Tattica', ambito:'Gioco', prepara:'Gioco: i tre tocchi',
  descrizione:'Partita 3 contro 3 su campo ridotto in cui la palla si prende e si lancia invece di colpirla: il primo prende e passa all\'alzatore, l\'alzatore lancia a chi "attacca", che rilancia nell\'altro campo.',
  serveA:'Fa capire subito la logica dei tre tocchi e dei ruoli, anche a chi non sa ancora palleggiare o fare bagher.',
  lavora:{fondamentali:['Ricezione','Palleggio','Attacco'], muscoli:[]}, difficolta:1, giocatori:[6,12], durata:12,
  materiale:['Palloni','Coni'], materialeNote:'1 pallone; coni per segnare il campo ridotto', pacchetti:['pk-principianti','pk-gioco'], tags:['gioco','partita','tre tocchi','presa'],
  passi:[
    ['Primo tocco','La palla arriva nel campo: il giocatore più vicino la prende e la passa con un lancio alto a chi è vicino alla rete.',1],
    ['Secondo tocco','Chi è a rete (l\'alzatore) prende la palla e la lancia alta al terzo compagno.',2],
    ['Terzo tocco','Il terzo la prende in alto e la lancia nel campo avversario, cercando un punto libero.',3]],
  attenzione:['Sempre tre passaggi prima di mandare la palla di là.','Chi ha la palla non può camminare.','Si chiama la palla prima di prenderla.'],
  errori:[['Si rimanda subito la palla di là','Conta i passaggi ad alta voce: "uno, due, tre".'],['Due giocatori vanno sulla stessa palla','Chiama "mia" prima di muoverti; chi è a rete non prende il primo tocco.']],
  varianti:{facile:'Si gioca 2 contro 2 con due passaggi.', difficile:'Il primo tocco va fatto in bagher o in palleggio; gli altri ancora con la presa.'},
  anim:{tipo:'campo', vista:'intero', elementi:[at('a1','1'), at('a2','2'), at('a3','3'), av('b1','1'), av('b2','2'), av('b3','3'), pa()],
    fotogrammi:[F({a1:[3,2.4], a2:[7.8,4.8], a3:[3,6.6], b1:[15,2.4], b2:[10.2,4.8], b3:[15,6.6], pa:[14.7,6.5]},null,0.5), F({pa:[3.3,2.5]},1.6,0.3,2.6), F({pa:[7.6,4.8]},1.1,0.3,2.2), F({pa:[3.3,6.5]},1.1,0.3,2.2), F({pa:[14.6,2.6]},1.6,0.6,2.8)]}});

E({id:'pp-gioco-minivolley-rimbalzo', titolo:'Minivolley 2 contro 2 con un rimbalzo', obiettivo:'Tattica', ambito:'Gioco', prepara:'Gioco: palleggio e bagher in partita',
  descrizione:'Partita 2 contro 2 su un campo stretto (metà larghezza), con rete bassa. Prima di ogni tocco la palla può rimbalzare una volta a terra; si gioca in palleggio o bagher, con al massimo tre tocchi.',
  serveA:'Il rimbalzo dà tempo per sistemarsi: si gioca davvero, con palleggio e bagher, anche senza un gran controllo della palla.',
  lavora:{fondamentali:['Palleggio','Ricezione','Battuta'], muscoli:['quadricipiti','spalle']}, difficolta:2, giocatori:[4,12], durata:15,
  materiale:['Palloni','Coni'], materialeNote:'coni per dividere il campo in due campi stretti', pacchetti:['pk-principianti','pk-gioco'], tags:['gioco','partita','rimbalzo','minivolley'],
  passi:[
    ['Inizio','Si comincia con una battuta dal basso da metà campo o con un lancio.',1],
    ['Rimbalzo','La palla può rimbalzare una volta prima di ogni tocco: chi la gioca si sistema e la passa al compagno.',2],
    ['Di là','Il secondo o il terzo tocco manda la palla nel campo avversario. Si gioca ai 15 punti.',4]],
  attenzione:['Un solo rimbalzo per ogni tocco, non per azione.','Si cerca sempre di passare al compagno prima di mandare di là.','Chiamare la palla.'],
  errori:[['Si colpisce la palla mentre sale dopo il rimbalzo','Aspetta che scenda: è più facile da controllare.'],['La palla va sempre subito di là','Regola: punto doppio se la squadra fa tre tocchi.']],
  varianti:{facile:'Rimbalzo libero e presa permessa sul secondo tocco.', difficile:'Il rimbalzo è permesso solo sul primo tocco.'},
  anim:{tipo:'campo', vista:'intero', elementi:[co('k1'), co('k2'), co('k3'), at('a1','A'), at('a2','B'), av('b1','C'), av('b2','D'), pa()],
    fotogrammi:[F({k1:[1,4.6], k2:[9,4.6], k3:[17,4.6], a1:[3.5,2.3], a2:[7,2.8], b1:[14.5,2.3], b2:[11,2.8], pa:[14.2,2.2]},null,0.5), F({pa:[4.6,2.6]},1.6,0.05,2.6), F({pa:[3.8,2.4]},0.5,0.2,0.6), F({pa:[6.8,2.8]},1,0.2,2.2), F({pa:[12.5,1.8]},1.3,0.6,2.4)]}});

window.VSE_CATALOGO = { versione: 1, pacchetti: PK, esercizi: ES };
})();

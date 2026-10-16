/* VolleyFit – costanti, sagoma del corpo, icone */
(function(){
'use strict';

const OBIETTIVI = [
  {id:'Tecnica',  nome:'Tecnica',            desc:'I fondamentali della pallavolo'},
  {id:'Tattica',  nome:'Gioco e tattica',    desc:'Situazioni di gioco e collaborazione'},
  {id:'Fisico',   nome:'Preparazione fisica',desc:'Forza, core, mobilità, salto'},
  {id:'Recupero', nome:'Recupero',           desc:'Dopo un infortunio, con il parere del medico'},
];
const AMBITI = {
  Tecnica:  ['Battuta','Ricezione','Palleggio','Attacco','Muro','Difesa'],
  Tattica:  ['Gioco','Cambio palla','Copertura','Difesa e contrattacco'],
  Fisico:   ['Riscaldamento e mobilità','Gambe','Core','Spalle e braccia','Salto e agilità'],
  Recupero: ['Ginocchio','Spalla','Caviglia','Schiena'],
};
const FONDAMENTALI = ['Battuta','Ricezione','Palleggio','Attacco','Muro','Difesa'];

const MUSCOLI = [
  {id:'spalle',      nome:'Spalle',                 vista:'fronte'},
  {id:'cuffia',      nome:'Cuffia dei rotatori',    vista:'dietro', regione:'spalle'},
  {id:'petto',       nome:'Petto',                  vista:'fronte'},
  {id:'bicipiti',    nome:'Bicipiti',               vista:'fronte'},
  {id:'tricipiti',   nome:'Tricipiti',              vista:'dietro'},
  {id:'addome',      nome:'Addominali',             vista:'fronte'},
  {id:'obliqui',     nome:'Obliqui',                vista:'fronte'},
  {id:'schiena',     nome:'Dorsali e schiena alta', vista:'dietro'},
  {id:'lombari',     nome:'Zona lombare',           vista:'dietro'},
  {id:'glutei',      nome:'Glutei',                 vista:'dietro'},
  {id:'quadricipiti',nome:'Quadricipiti',           vista:'fronte'},
  {id:'flessori',    nome:'Flessori dell\'anca',      vista:'fronte', regione:'quadricipiti'},
  {id:'adduttori',   nome:'Adduttori',              vista:'fronte'},
  {id:'femorali',    nome:'Femorali',               vista:'dietro'},
  {id:'polpacci',    nome:'Polpacci e caviglie',    vista:'dietro'},
];
const MUSCOLO = Object.fromEntries(MUSCOLI.map(m=>[m.id,m]));
// segmenti dell'omino da colorare per ogni muscolo
const MUSCOLO_SEGMENTI = {
  spalle:['braccio'], cuffia:['braccio'], petto:['busto'], bicipiti:['braccio'], tricipiti:['braccio'],
  addome:['busto'], obliqui:['busto'], schiena:['busto'], lombari:['busto'], glutei:['coscia'],
  quadricipiti:['coscia'], flessori:['coscia'], adduttori:['coscia'], femorali:['coscia'], polpacci:['gamba','piede'],
};

const MATERIALI = ['Corpo libero','Elastico','Palloni','Coni','Muro o spalliera','Sedia','Tappetino','Gradino'];

/* ------------------------------------------------------------------ icone (tratto, 24x24) */
const P = {
  cerca:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  scambio:'<path d="M7 4v13M3 13l4 4 4-4M17 20V7M13 11l4-4 4 4"/>',
  piu:'<path d="M12 5v14M5 12h14"/>',
  indietro:'<path d="M15 6l-6 6 6 6"/>',
  avanti:'<path d="M9 6l6 6-6 6"/>',
  chiudi:'<path d="M6 6l12 12M18 6L6 18"/>',
  griglia:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  pacchetto:'<path d="M4 7l8-4 8 4v10l-8 4-8-4z"/><path d="M4 7l8 4 8-4M12 11v10"/>',
  archivio:'<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M10 13h4"/>',
  matita:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  stella:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  filtri:'<path d="M4 6h16M7 12h10M10 18h4"/>',
  play:'<path d="M7 4l13 8-13 8z" fill="currentColor" stroke="none"/>',
  pausa:'<rect x="6" y="4" width="4.5" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="13.5" y="4" width="4.5" height="16" rx="1" fill="currentColor" stroke="none"/>',
  schermo:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  stampa:'<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  copia:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/>',
  cestino:'<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13"/>',
  scarica:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  carica:'<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
  nuvola:'<path d="M7 18a4 4 0 01-.6-8A6 6 0 0118 9a4.5 4.5 0 01-.5 9z"/>',
  ok:'<path d="M5 12l5 5 9-10"/>',
  attenzione:'<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
  su:'<path d="M6 15l6-6 6 6"/>',
  giu:'<path d="M6 9l6 6 6-6"/>',
  annulla:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>',
  occhio:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  guida:'<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5M9 7h6"/>',
  tempo:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
  persone:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2a5 5 0 016 4.8"/>',
  pallone:'<circle cx="12" cy="12" r="8"/><path d="M4.5 9.5c5 1 10 0 15-3M5 15c4-2 9-2 14 1M12 4c-2 4-2 12 0 16"/>',
  aggiorna:'<path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
};
function icona(n, size, extra){ return `<svg width="${size||20}" height="${size||20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra||''}>${P[n]||''}</svg>`; }

/* icone dei fondamentali e degli ambiti fisici */
const IC_AMBITO = {
  Battuta:'<circle cx="15" cy="12" r="6"/><path d="M3 9h5M2 13h6M4 17h4"/>',
  Ricezione:'<path d="M4 19c4-6 12-6 16 0"/><circle cx="12" cy="8" r="3"/>',
  Palleggio:'<circle cx="12" cy="5" r="3"/><path d="M6 21l2-8h8l2 8M8 13L6 9M16 13l2-4"/>',
  Attacco:'<path d="M5 19L19 5M12 5h7v7"/>',
  Muro:'<rect x="5" y="4" width="5" height="16" rx="2"/><rect x="14" y="4" width="5" height="16" rx="2"/>',
  Difesa:'<path d="M12 3l8 4v5c0 5-4 8-8 9-4-1-8-4-8-9V7z"/>',
  Gioco:'<rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M12 6v12"/>',
  'Cambio palla':'<path d="M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5"/><path d="M18 3v4h-4M6 21v-4h4"/>',
  Copertura:'<path d="M3 15a9 9 0 0118 0"/><circle cx="12" cy="15" r="2.5"/>',
  'Difesa e contrattacco':'<path d="M12 3l7 3.5v4.5c0 4.4-3 7-7 8-4-1-7-3.6-7-8V6.5z"/><path d="M9 12l3-3 3 3"/>',
  'Riscaldamento e mobilità':'<path d="M12 3c3 4 5 6 5 10a5 5 0 01-10 0c0-2 1-3.5 2-5 0 2 1 3 2 3 0-3 0-5 1-8z"/>',
  Gambe:'<path d="M9 3v8l-2 10M15 3v8l2 10"/>',
  Core:'<rect x="7" y="4" width="10" height="16" rx="3"/><path d="M7 10h10M7 15h10M12 4v16"/>',
  'Spalle e braccia':'<path d="M4 18c0-6 3-10 8-10s8 4 8 10"/><circle cx="12" cy="5" r="2.5"/>',
  'Salto e agilità':'<path d="M12 21v-5M7 21l5-5 5 5M12 3v6M8 6l4-3 4 3"/>',
  Ginocchio:'<path d="M10 3v8a2 2 0 004 0M14 11l1 10M10 11l-1 10"/>',
  Spalla:'<path d="M4 20c0-5 2-9 6-10l4-1c3 0 6 2 6 5"/><circle cx="12" cy="9" r="2"/>',
  Caviglia:'<path d="M10 3v12l-4 4h12l-2-4-2-2V3"/>',
  Schiena:'<path d="M12 3v18M9 6h6M8 10h8M9 14h6M10 18h4"/>',
};
function iconaAmbito(a, size){ return `<svg width="${size||20}" height="${size||20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC_AMBITO[a]||P.pallone}</svg>`; }

/* ------------------------------------------------------------------ sagoma del corpo
   Restituisce l'SVG della sagoma, davanti o dietro. Le zone cliccabili hanno data-m.
   attivi: insieme di id da colorare (forte), secondari: insieme da colorare (tenue). */
function sagoma(vista, attivi, secondari, opt){
  opt=opt||{};
  const A=new Set(attivi||[]), S=new Set(secondari||[]);
  const regAtt = new Set(), regSec = new Set();
  for(const m of MUSCOLI){ const r=m.regione||m.id; if(A.has(m.id)) regAtt.add(r); if(S.has(m.id)) regSec.add(r); }
  const neutral='var(--body)', strong='var(--muscle)', soft='var(--muscle-soft-fill)';
  const fill = id => regAtt.has(id)?strong:(regSec.has(id)?soft:neutral);
  const z = (id, shape) => `<g data-m="${id}" class="zona${opt.cliccabile?' clic':''}" ${opt.cliccabile?`role="button" tabindex="0" aria-label="${MUSCOLO[id]?MUSCOLO[id].nome:id}" aria-pressed="${regAtt.has(id)}"`:''} fill="${fill(id)}">${shape}</g>`;
  const N = `fill="${neutral}"`;
  let s = `<svg viewBox="0 0 164 300" xmlns="http://www.w3.org/2000/svg" ${opt.attrs||''}>`;
  s+=`<circle cx="82" cy="24" r="16" ${N}/><rect x="75" y="38" width="14" height="12" rx="4" ${N}/>`;
  // avambracci, mani, bacino, stinchi (neutri)
  s+=`<rect x="29" y="118" width="13" height="46" rx="6.5" ${N}/><rect x="122" y="118" width="13" height="46" rx="6.5" ${N}/>`;
  s+=`<circle cx="35" cy="172" r="7" ${N}/><circle cx="129" cy="172" r="7" ${N}/>`;
  if(vista==='fronte'){
    s+=`<rect x="58" y="134" width="48" height="22" rx="9" ${N}/>`;
    s+=`<rect x="57" y="228" width="18" height="56" rx="9" ${N}/><rect x="89" y="228" width="18" height="56" rx="9" ${N}/>`;
    s+=z('spalle','<ellipse cx="47" cy="62" rx="14" ry="12"/><ellipse cx="117" cy="62" rx="14" ry="12"/>');
    s+=z('petto','<rect x="58" y="52" width="23" height="27" rx="9"/><rect x="83" y="52" width="23" height="27" rx="9"/>');
    s+=z('bicipiti','<rect x="33" y="74" width="15" height="42" rx="7.5"/><rect x="116" y="74" width="15" height="42" rx="7.5"/>');
    s+=z('addome','<rect x="65" y="82" width="34" height="50" rx="10"/>');
    s+=z('obliqui','<rect x="54" y="84" width="9" height="44" rx="4.5"/><rect x="101" y="84" width="9" height="44" rx="4.5"/>');
    s+=z('quadricipiti','<rect x="54" y="158" width="21" height="66" rx="10"/><rect x="89" y="158" width="21" height="66" rx="10"/>');
    s+=z('adduttori','<rect x="76" y="160" width="6" height="44" rx="3"/><rect x="82.5" y="160" width="6" height="44" rx="3"/>');
    s+=`<circle cx="66" cy="230" r="0" ${N}/>`;
  } else {
    s+=z('spalle','<ellipse cx="47" cy="62" rx="14" ry="12"/><ellipse cx="117" cy="62" rx="14" ry="12"/>');
    s+=z('schiena','<path d="M60 50h44a6 6 0 016 6l-4 38a6 6 0 01-6 5H64a6 6 0 01-6-5l-4-38a6 6 0 016-6z"/>');
    s+=z('tricipiti','<rect x="33" y="74" width="15" height="42" rx="7.5"/><rect x="116" y="74" width="15" height="42" rx="7.5"/>');
    s+=z('lombari','<rect x="64" y="101" width="36" height="31" rx="9"/>');
    s+=z('glutei','<rect x="57" y="135" width="24" height="27" rx="11"/><rect x="83" y="135" width="24" height="27" rx="11"/>');
    s+=z('femorali','<rect x="56" y="164" width="21" height="60" rx="10"/><rect x="87" y="164" width="21" height="60" rx="10"/>');
    s+=z('polpacci','<rect x="57" y="228" width="19" height="56" rx="9.5"/><rect x="88" y="228" width="19" height="56" rx="9.5"/>');
  }
  s+='</svg>';
  return s;
}

window.VSE = { OBIETTIVI, AMBITI, FONDAMENTALI, MUSCOLI, MUSCOLO, MUSCOLO_SEGMENTI, MATERIALI, icona, iconaAmbito, sagoma, IC_AMBITO };
})();

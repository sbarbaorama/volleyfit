/* VolleyFit – dati sul dispositivo.
   Il catalogo di base arriva con l'app (catalogo.js). Sul dispositivo (e nell'archivio online)
   si salvano solo le differenze: esercizi e pacchetti nuovi o modificati, eliminazioni, preferiti.
   Ogni scheda ha "agg" (momento dell'ultima modifica): nell'unione vince la più recente. */
(function(){
'use strict';
const KEY='vse-dati', MKEY='vse-meta';
const vuoto = () => ({esercizi:{}, pacchetti:{}, tombe:{}, pref:{}});
let D = vuoto(), M = {};
const ascolta = [];

function leggi(){
  try{ const s=localStorage.getItem(KEY); if(s){ const o=JSON.parse(s); D=Object.assign(vuoto(), o); } }catch(e){ console.warn('dati non leggibili', e); }
  try{ const s=localStorage.getItem(MKEY); if(s) M=JSON.parse(s)||{}; }catch(e){ M={}; }
}
let erroreSalvataggio=null;
function scrivi(){
  try{ localStorage.setItem(KEY, JSON.stringify(D)); erroreSalvataggio=null; }
  catch(e){ erroreSalvataggio = 'Il dispositivo non ha più spazio per salvare: esporta una copia e libera spazio.'; }
}
function scriviMeta(){ try{ localStorage.setItem(MKEY, JSON.stringify(M)); }catch(e){} }
function avvisa(cosa, locale){ for(const f of ascolta){ try{ f(cosa, locale); }catch(e){ console.error(e); } } }
const ora = () => Date.now();
const nuovoId = p => p+'_'+Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-4);
const clona = o => JSON.parse(JSON.stringify(o));

const CAT = () => window.VSE_CATALOGO || {esercizi:[], pacchetti:[]};
let semiEs=null, semiPk=null;
function semi(){
  if(!semiEs){ semiEs={}; for(const e of CAT().esercizi) semiEs[e.id]=e; semiPk={}; for(const p of CAT().pacchetti) semiPk[p.id]=p; }
}

function visibile(coll, semiMap, id){
  const r = D[coll][id], t = D.tombe[id]||0, s = semiMap[id];
  if(r && (r.agg||0) > t){ if(r._reset) return s ? Object.assign({}, s, {_origine:'catalogo'}) : null; return Object.assign({}, r, {_origine: s?'modificato':'mio'}); }
  if(t) return null;
  return s ? Object.assign({}, s, {_origine:'catalogo'}) : null;
}
function lista(coll, semiMap){
  semi();
  const ids = new Set([...Object.keys(semiMap), ...Object.keys(D[coll])]);
  const out=[]; for(const id of ids){ const v=visibile(coll, semiMap, id); if(v) out.push(v); }
  return out;
}

const Store = {
  carica(){ leggi(); semi(); },
  ascolta(f){ ascolta.push(f); },
  errore(){ return erroreSalvataggio; },
  nuovoId,
  /* ---------- esercizi */
  esercizi(){ semi(); return lista('esercizi', semiEs); },
  esercizio(id){ semi(); return visibile('esercizi', semiEs, id); },
  diCatalogo(id){ semi(); return !!semiEs[id]; },
  originale(id){ semi(); return semiEs[id] ? clona(semiEs[id]) : null; },
  salvaEsercizio(rec){
    const r = clona(rec); delete r._origine; r.agg = ora(); if(!r.creato) r.creato = r.agg;
    D.esercizi[r.id] = r; scrivi(); avvisa('esercizi', true); return r;
  },
  eliminaEsercizio(id){ D.tombe[id]=ora(); delete D.esercizi[id]; scrivi(); avvisa('esercizi', true); },
  ripristinaEsercizio(id){ semi(); if(semiEs[id]){ D.esercizi[id]={id, _reset:true, agg:ora()}; scrivi(); avvisa('esercizi', true); } },
  eliminatiDiCatalogo(){ semi(); return Object.keys(semiEs).filter(id=>!visibile('esercizi', semiEs, id)).map(id=>semiEs[id]); },
  /* ---------- pacchetti */
  pacchetti(){ semi(); return lista('pacchetti', semiPk).sort((a,b)=>(a.ordine||99)-(b.ordine||99) || a.nome.localeCompare(b.nome)); },
  pacchetto(id){ semi(); return visibile('pacchetti', semiPk, id); },
  salvaPacchetto(rec){ const r=clona(rec); delete r._origine; r.agg=ora(); D.pacchetti[r.id]=r; scrivi(); avvisa('pacchetti', true); return r; },
  eliminaPacchetto(id){
    D.tombe[id]=ora(); delete D.pacchetti[id];
    // toglie il pacchetto dagli esercizi che lo contengono
    for(const e of Store.esercizi()) if((e.pacchetti||[]).includes(id)){ const c=clona(e); c.pacchetti=c.pacchetti.filter(x=>x!==id); delete c._origine; c.agg=ora(); D.esercizi[c.id]=c; }
    scrivi(); avvisa('pacchetti', true);
  },
  /* ---------- preferiti */
  preferito(id){ return !!(D.pref[id] && D.pref[id].on); },
  setPreferito(id, on){ D.pref[id]={on:!!on, agg:ora()}; scrivi(); avvisa('pref', true); },
  /* ---------- dati per la sincronizzazione e le copie */
  dati(){ return clona(D); },
  vuoto(){ return !Object.keys(D.esercizi).length && !Object.keys(D.pacchetti).length && !Object.keys(D.tombe).length && !Object.keys(D.pref).length; },
  firma(o){ // stringa stabile per confrontare due copie
    const ord = x => Array.isArray(x) ? x.map(ord) : (x && typeof x==='object' ? Object.keys(x).sort().reduce((a,k)=>{a[k]=ord(x[k]);return a;},{}) : x);
    return JSON.stringify(ord({esercizi:o.esercizi||{}, pacchetti:o.pacchetti||{}, tombe:o.tombe||{}, pref:o.pref||{}}));
  },
  /* unisce dati arrivati da fuori (archivio online o file); restituisce true se qualcosa è cambiato qui */
  unisci(R, opz){
    if(!R) return false; opz=opz||{};
    let cambiato=false;
    for(const c of ['esercizi','pacchetti','pref']){
      const src=R[c]||{};
      for(const id in src){ const r=src[id]; if(!r) continue; const l=D[c][id];
        if(!l || (r.agg||0) > (l.agg||0)){ D[c][id]=r; cambiato=true; } }
    }
    const t=R.tombe||{};
    for(const id in t){ if((t[id]||0) > (D.tombe[id]||0)){ D.tombe[id]=t[id]; cambiato=true; } }
    if(cambiato){ scrivi(); avvisa('tutto', false); }
    return cambiato;
  },
  sostituisci(R){ D = Object.assign(vuoto(), clona(R||{})); scrivi(); avvisa('tutto', false); },
  /* importa esercizi completi (da file): li aggiunge come esercizi miei o aggiorna */
  importaEsercizi(arr, pacchettiArr){
    let n=0;
    for(const p of (pacchettiArr||[])){ if(!p||!p.id||!p.nome) continue; const ex=Store.pacchetto(p.id); if(!ex || (p.agg||0)>(ex.agg||0)){ const r=clona(p); delete r._origine; r.agg=Math.max(ora(), p.agg||0); D.pacchetti[r.id]=r; } }
    for(const e of arr){ if(!e||!e.id||!e.titolo) continue; const r=clona(e); delete r._origine; r.agg=ora(); if(!r.creato) r.creato=r.agg; D.esercizi[r.id]=r; if(D.tombe[r.id] && D.tombe[r.id]>=r.agg) delete D.tombe[r.id]; n++; }
    scrivi(); avvisa('tutto', true); return n;
  },
  /* ---------- impostazioni del dispositivo */
  meta(k){ return M[k]; },
  setMeta(k,v){ if(v===undefined||v===null) delete M[k]; else M[k]=v; scriviMeta(); },
  clona,
};
window.Store = Store;
})();

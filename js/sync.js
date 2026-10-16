/* VolleyFit – sincronizzazione con un archivio privato su GitHub.
   Tutti i dati dell'utente stanno in un solo file JSON dentro l'archivio
   (per default volleysched-dati / esercizi-app/dati.json): così l'archivio di Volleysched
   può essere riusato con lo stesso codice di accesso, senza toccare i suoi file. */
(function(){
'use strict';
const API='https://api.github.com';
const DEF_PATH='volleyfit/dati.json';
let stato={s:'off', msg:''}, inCorso=null, timer=null, giro=null;
const ascolta=[];
function set(s,msg){ stato={s,msg:msg||''}; for(const f of ascolta) try{ f(stato); }catch(e){} }

function cfg(){ const c=Store.meta('sync'); return c && c.owner && c.repo && c.token ? Object.assign({path:DEF_PATH}, c) : null; }
function hdr(c, raw){ return {'Authorization':'Bearer '+c.token, 'Accept': raw?'application/vnd.github.raw+json':'application/vnd.github+json', 'X-GitHub-Api-Version':'2022-11-28'}; }
const enc = s => { const b=new TextEncoder().encode(s); let bin=''; for(let i=0;i<b.length;i+=0x8000) bin+=String.fromCharCode.apply(null, b.subarray(i,i+0x8000)); return btoa(bin); };
const dec = b64 => { const bin=atob(b64.replace(/\n/g,'')); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return new TextDecoder().decode(u); };
const pathUrl = c => `${API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${c.path.split('/').map(encodeURIComponent).join('/')}`;

function errore(r, j){
  if(r.status===401) return 'Il codice di accesso non è valido o è scaduto.';
  if(r.status===403) return (j&&j.message&&/rate limit/i.test(j.message)) ? 'Troppe richieste a GitHub: riprovo tra poco.' : 'Il codice di accesso non ha il permesso di scrivere in questo archivio (serve «Contents: Read and write»).';
  if(r.status===404) return 'Archivio non trovato: controlla nome utente e nome dell\'archivio, e che il codice di accesso lo includa.';
  return 'GitHub ha risposto con un errore ('+r.status+').';
}

async function probe(c){
  const r = await fetch(`${API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}`, {headers:hdr(c)});
  let j=null; try{ j=await r.json(); }catch(e){}
  if(!r.ok) throw new Error(errore(r,j));
  const f = await leggi(Object.assign({path:DEF_PATH}, c));
  const n = f.dati ? Object.keys(f.dati.esercizi||{}).length + Object.keys(f.dati.pacchetti||{}).length : 0;
  return {privato: !!j.private, scrittura: !(j.permissions && j.permissions.push===false), esiste: !!f.sha, schede: n};
}

async function leggi(c){
  const r = await fetch(pathUrl(c)+'?t='+Date.now(), {headers:hdr(c), cache:'no-store'});
  if(r.status===404) return {sha:null, dati:null};
  let j=null; try{ j=await r.json(); }catch(e){}
  if(!r.ok) throw new Error(errore(r,j));
  let testo='';
  if(j.content) testo = dec(j.content);
  else { const r2 = await fetch(pathUrl(c)+'?t='+Date.now(), {headers:hdr(c,true), cache:'no-store'}); if(!r2.ok) throw new Error(errore(r2,null)); testo = await r2.text(); }
  let dati=null; try{ dati=JSON.parse(testo); }catch(e){ throw new Error('Il file nell\'archivio online non è leggibile.'); }
  return {sha:j.sha, dati};
}

async function scrivi(c, dati, sha){
  const body={ message:'Esercizi aggiornati da '+(Store.meta('dispositivo')||'un dispositivo'), content: enc(JSON.stringify(dati)) };
  if(sha) body.sha=sha;
  const r = await fetch(pathUrl(c), {method:'PUT', headers:Object.assign({'Content-Type':'application/json'}, hdr(c)), body:JSON.stringify(body)});
  let j=null; try{ j=await r.json(); }catch(e){}
  if(r.status===409 || r.status===422) return {conflitto:true};
  if(!r.ok) throw new Error(errore(r,j));
  return {sha: j.content && j.content.sha};
}

async function esegui(){
  const c=cfg(); if(!c){ set('off'); return; }
  if(!navigator.onLine){ set('offline','Senza rete: le modifiche partono quando torna la connessione.'); return; }
  set('busy','Sincronizzo…');
  try{
    for(let tent=0; tent<4; tent++){
      const rem = await leggi(c);
      if(rem.dati) Store.unisci(rem.dati);
      const loc = Store.dati();
      if(rem.dati && Store.firma(rem.dati)===Store.firma(loc)){ break; }
      if(!rem.dati && Store.vuoto()) break;
      const out = Object.assign({app:'volleyfit', versione:1, aggiornato:new Date().toISOString()}, loc);
      const w = await scrivi(c, out, rem.sha);
      if(!w.conflitto) break;
      await new Promise(r=>setTimeout(r, 400+Math.random()*600));
    }
    Store.setMeta('syncUltima', Date.now());
    set('ok','');
  }catch(e){
    set(navigator.onLine?'err':'offline', e && e.message ? e.message : 'Errore di rete.');
  }
}

const Sync = {
  DEF_PATH,
  config: cfg,
  stato: ()=>stato,
  ascolta(f){ ascolta.push(f); },
  probe, leggi,
  async run(){ if(inCorso) return inCorso; inCorso = esegui().finally(()=>{ inCorso=null; }); return inCorso; },
  presto(){ if(!cfg()) return; if(stato.s!=='busy') set('pending','Modifiche da inviare'); clearTimeout(timer); timer=setTimeout(()=>Sync.run(), 2500); },
  avvia(){
    if(giro) clearInterval(giro);
    if(!cfg()){ set('off'); return; }
    Sync.run();
    giro=setInterval(()=>{ if(document.visibilityState==='visible') Sync.run(); }, 60000);
  },
  async collega(c, scelta){
    // scelta: 'unisci' | 'online' (prendi solo i dati online)
    const conf={owner:c.owner, repo:c.repo, token:c.token, path:c.path||DEF_PATH};
    if(scelta==='online'){ const rem=await leggi(conf); Store.sostituisci(rem.dati||{}); }
    Store.setMeta('sync', conf);
    Sync.avvia();
  },
  scollega(){ Store.setMeta('sync', null); if(giro) clearInterval(giro); set('off'); },
};
window.addEventListener('online', ()=>Sync.run());
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='visible' && cfg()) Sync.run(); });
window.Sync = Sync;
})();

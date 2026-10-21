/* VolleyFit – interfaccia */
(function(){
'use strict';
const VERSIONE = '1.3.1';
const $ = (s,r) => (r||document).querySelector(s);
const $$ = (s,r) => Array.from((r||document).querySelectorAll(s));
const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I = (n,s,x) => VSE.icona(n,s,x);
const norm = s => String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const app = $('#app');

/* ------------------------------------------------------------------ stato dell'interfaccia */
const F0 = {pk:null, fond:null, musc:null, obiettivo:null, ambito:null, diff:[], gioc:0, durata:0, mat:[], pref:false, miei:false};
const ui = {
  q:'', modo:'pallavolo', ordine:'ambito', f:Object.assign({}, F0),
  lista:[], player:null, editor:null, sporco:false,
};
try{ const s=JSON.parse(sessionStorage.getItem('vse-ui')||'null'); if(s){ ui.q=s.q||''; ui.modo=s.modo||'pallavolo'; ui.ordine=s.ordine||'ambito'; ui.f=Object.assign({}, F0, s.f||{}); } }catch(e){}
const salvaUI = () => { try{ sessionStorage.setItem('vse-ui', JSON.stringify({q:ui.q, modo:ui.modo, ordine:ui.ordine, f:ui.f})); }catch(e){} };

/* ------------------------------------------------------------------ utilità interfaccia */
let toastT=null;
function toast(msg){
  let t=$('.toast'); if(!t){ t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); document.body.appendChild(t); }
  t.textContent=msg; t.hidden=false; clearTimeout(toastT); toastT=setTimeout(()=>{ t.hidden=true; }, 2600);
}
function modal(titolo, corpo, piede, onMount){
  const root=$('#modal-root');
  const prevFocus=document.activeElement;
  root.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mtit"><div class="box">
    <div class="mh"><h2 id="mtit">${esc(titolo)}</h2><button type="button" class="icon-btn plain" data-a="m-chiudi" aria-label="Chiudi">${I('chiudi')}</button></div>
    <div class="mb">${corpo}</div>${piede?`<div class="mf">${piede}</div>`:''}</div></div>`;
  const m=root.firstElementChild;
  const chiudi=()=>{ root.innerHTML=''; document.removeEventListener('keydown', key); if(prevFocus && prevFocus.focus) try{ prevFocus.focus(); }catch(e){} };
  const key=e=>{ if(e.key==='Escape') chiudi(); };
  document.addEventListener('keydown', key);
  m.addEventListener('click', e=>{ if(e.target===m || e.target.closest('[data-a="m-chiudi"]')) chiudi(); });
  setTimeout(()=>{ const f=m.querySelector('input,select,textarea,.choice,.btn.primary,.btn.accent'); if(f) f.focus(); }, 30);
  if(onMount) onMount(m, chiudi);
  return chiudi;
}
function conferma(titolo, testo, ok, pericolo){
  return new Promise(res=>{
    let fatto=false;
    const chiudi = modal(titolo, `<p style="margin:0">${testo}</p>`, `<button class="btn" data-a="m-chiudi">Annulla</button><button class="btn ${pericolo?'danger':'primary'}" id="m-ok">${esc(ok||'Conferma')}</button>`, (m, c)=>{
      $('#m-ok',m).onclick=()=>{ fatto=true; c(); res(true); };
      const obs=new MutationObserver(()=>{ if(!m.isConnected){ obs.disconnect(); if(!fatto) res(false); } }); obs.observe($('#modal-root'),{childList:true});
    });
  });
}
function scelta(titolo, testo, opzioni){
  return new Promise(res=>{
    let fatto=false;
    modal(titolo, `${testo?`<p style="margin:0">${testo}</p>`:''}${opzioni.map((o,i)=>`<button type="button" class="choice" data-i="${i}">${o.ic?`<span style="flex:none;margin-top:2px">${I(o.ic,22)}</span>`:''}<span><b>${esc(o.t)}</b><span>${esc(o.d||'')}</span></span></button>`).join('')}`, '', (m,c)=>{
      $$('.choice',m).forEach(b=>b.onclick=()=>{ fatto=true; c(); res(+b.dataset.i); });
      const obs=new MutationObserver(()=>{ if(!m.isConnected){ obs.disconnect(); if(!fatto) res(-1); } }); obs.observe($('#modal-root'),{childList:true});
    });
  });
}
function scarica(nome, obj){
  const blob=new Blob([JSON.stringify(obj, null, 1)], {type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=nome;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
}
const oggi = () => new Date().toISOString().slice(0,10);
const slug = s => norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40) || 'esercizi';

/* ------------------------------------------------------------------ tema */
function applicaTema(){
  const t=Store.meta('tema')||'auto';
  if(t==='auto') document.documentElement.removeAttribute('data-tema'); else document.documentElement.setAttribute('data-tema', t);
  const scuro = t==='scuro' || (t==='auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  $('meta[name=theme-color]').setAttribute('content', scuro?'#111316':'#1546A0');
  if(ui.player) ui.player.refreshColors();
}
matchMedia('(prefers-color-scheme: dark)').addEventListener && matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ()=>{ applicaTema(); if(location.hash.replace('#','').startsWith('/')===false || true) render(); });

/* ------------------------------------------------------------------ descrizioni */
function difficoltaDots(n){ n=+n||0; let s='<span class="dots" aria-label="Difficoltà '+n+' su 5">'; for(let i=1;i<=5;i++) s+=`<i class="${i<=n?'on':''}"></i>`; return s+'</span>'; }
function giocatoriTesto(e){
  const g=e.giocatori||[]; const a=+g[0]||0, b=+g[1]||0;
  if(!a && !b) return '';
  if(a===1 && (!b||b===1)) return 'da solo';
  if(a===b || !b) return a+' giocatori';
  return a+'–'+b+' giocatori';
}
function doseTesto(e){
  const d=e.dose||{}; if(!d.serie && !d.ripetizioni && !d.tempo) return '';
  let s='';
  if(d.serie) s+=d.serie+' × ';
  if(d.ripetizioni) s+=d.ripetizioni; else if(d.tempo) s+=d.tempo+'″';
  if(d.lato) s+=' per lato';
  return s;
}
function fisico(e){ return e.obiettivo==='Fisico' || e.obiettivo==='Recupero'; }
function testoRicerca(e){
  if(e._rt) return e._rt;
  const l=e.lavora||{};
  return norm([e.titolo, e.descrizione, e.ambito, e.obiettivo, e.prepara||'', e.prepara?'propedeutico principianti':'', (e.tags||[]).join(' '), (l.fondamentali||[]).join(' '), (l.muscoli||[]).map(m=>VSE.MUSCOLO[m]?VSE.MUSCOLO[m].nome:m).join(' '), (e.materiale||[]).join(' ')].join(' '));
}
function ordineAmbito(e){
  const oi = VSE.OBIETTIVI.findIndex(o=>o.id===e.obiettivo);
  const ai = (VSE.AMBITI[e.obiettivo]||[]).indexOf(e.ambito);
  return (oi<0?9:oi)*100 + (ai<0?50:ai);
}

/* ------------------------------------------------------------------ filtri */
// la scelta di un muscolo mostra solo gli esercizi di preparazione fisica e di recupero
const perCorpo = e => e.obiettivo==='Fisico' || e.obiettivo==='Recupero';
function filtra(list, f, q, ignora){
  ignora=ignora||{};
  const toks = norm(q).split(/\s+/).filter(Boolean);
  return list.filter(e=>{
    if(toks.length){ const t=testoRicerca(e); if(!toks.every(k=>t.includes(k))) return false; }
    const l=e.lavora||{};
    if(f.pk && !ignora.pk && !(e.pacchetti||[]).includes(f.pk)) return false;
    if(f.fond && !ignora.fond && !(e.ambito===f.fond || (l.fondamentali||[]).includes(f.fond))) return false;
    if(f.musc && !ignora.musc){ if(!perCorpo(e)) return false; const ms=l.muscoli||[]; const ok = ms.includes(f.musc) || ms.some(m=>VSE.MUSCOLO[m] && VSE.MUSCOLO[m].regione===f.musc); if(!ok) return false; }
    if(f.obiettivo && !ignora.obiettivo && e.obiettivo!==f.obiettivo) return false;
    if(f.ambito && !ignora.ambito && e.ambito!==f.ambito) return false;
    if(f.diff && f.diff.length && !f.diff.includes(+e.difficolta)) return false;
    if(f.gioc){ const g=e.giocatori||[1,1]; const a=+g[0]||1, b=+g[1]||a; if(f.gioc<a || f.gioc>b) return false; }
    if(f.durata && (+e.durata||0) > f.durata) return false;
    if(f.mat && f.mat.length){ const ok=(e.materiale||[]).every(m=>m==='Corpo libero' || f.mat.includes(m)); if(!ok) return false; }
    if(f.pref && !Store.preferito(e.id)) return false;
    if(f.miei && e._origine==='catalogo') return false;
    return true;
  });
}
function ordina(list){
  const l=list.slice();
  if(ui.ordine==='az') l.sort((a,b)=>a.titolo.localeCompare(b.titolo,'it'));
  else if(ui.ordine==='diff') l.sort((a,b)=>(+a.difficolta||0)-(+b.difficolta||0) || a.titolo.localeCompare(b.titolo,'it'));
  else l.sort((a,b)=>ordineAmbito(a)-ordineAmbito(b) || (+a.difficolta||0)-(+b.difficolta||0) || a.titolo.localeCompare(b.titolo,'it'));
  return l;
}
function nFiltri(){ const f=ui.f; return (f.obiettivo?1:0)+(f.ambito?1:0)+(f.diff.length?1:0)+(f.gioc?1:0)+(f.durata?1:0)+(f.mat.length?1:0)+(f.pref?1:0)+(f.miei?1:0); }

/* ------------------------------------------------------------------ schede del catalogo */
function cardEsercizio(e){
  const campo = e.anim && e.anim.tipo==='campo';
  const th = e.anim && (e.anim.fotogrammi||[]).length ? VSA.copertina(e.anim, {attrs:'aria-hidden="true" preserveAspectRatio="xMidYMid meet"'}) : (e.immagine?`<img src="${esc(e.immagine)}" alt="" style="width:100%;height:100%;object-fit:contain">`:'');
  const pref = Store.preferito(e.id);
  const meta = [];
  meta.push(difficoltaDots(e.difficolta));
  const dose=doseTesto(e); if(dose) meta.push(esc(dose));
  else { const g=giocatoriTesto(e); if(g) meta.push(esc(g)); }
  if(e.durata) meta.push(esc(e.durata)+'′');
  return `<article class="ce">
    <div class="th ${campo?'campo':''}">${th}</div>
    ${e._origine!=='catalogo'?`<span class="tag">${e._origine==='mio'?'Mio':'Modificato'}</span>`:''}
    <div class="bd"><div class="amb ${fisico(e)?'fis':''}">${esc(e.ambito||e.obiettivo||'')}${e.prepara?' · propedeutico':''}</div>
      <h3><a href="#/es/${encodeURIComponent(e.id)}">${esc(e.titolo)}</a></h3>
      <div class="mt">${meta.join('<span aria-hidden="true">·</span>')}</div></div>
    <button type="button" class="star" data-a="pref" data-id="${esc(e.id)}" aria-pressed="${pref}" aria-label="${pref?'Togli dai preferiti':'Aggiungi ai preferiti'}">${I('stella',20)}</button>
  </article>`;
}

/* ------------------------------------------------------------------ mappa del campo (catalogo) */
function mappaCampo(tutti){
  const cnt = fd => filtra(tutti, ui.f, ui.q, {fond:true, obiettivo:true, ambito:true}).filter(e=>e.ambito===fd || ((e.lavora||{}).fondamentali||[]).includes(fd)).length;
  const pos = {Muro:[50,9], Attacco:[24,26], Palleggio:[76,26], Ricezione:[50,46], Difesa:[50,64], Battuta:[50,88]};
  let b='';
  for(const fd of VSE.FONDAMENTALI){ const p=pos[fd]; const on=ui.f.fond===fd;
    b+=`<button type="button" class="fb" style="left:${p[0]}%;top:${p[1]}%" data-a="fond" data-v="${fd}" aria-pressed="${on}">${esc(fd)} <small>${cnt(fd)}</small></button>`; }
  const svg=`<svg viewBox="0 0 270 216" preserveAspectRatio="none" aria-hidden="true"><rect x="30" y="18" width="210" height="146" fill="var(--floor)"/><path d="M30 18h210" stroke="#fff" stroke-width="6"/><path d="M30 67h210" stroke="#fff" stroke-width="2.5"/><path d="M30 18v146h210V18" fill="none" stroke="#fff" stroke-width="2.5"/></svg>`;
  const tat = VSE.AMBITI.Tattica.map(a=>{ const on=ui.f.ambito===a && ui.f.obiettivo==='Tattica'; const n=filtra(tutti, ui.f, ui.q, {fond:true, obiettivo:true, ambito:true}).filter(e=>e.obiettivo==='Tattica' && e.ambito===a).length; return `<button type="button" class="chip" data-a="tattica" data-v="${esc(a)}" aria-pressed="${on}">${esc(a)} <span class="muted" style="font-weight:400">${n}</span></button>`; }).join('');
  return `<div class="campo-map" role="group" aria-label="Scegli un fondamentale sul campo">${svg}${b}</div>
    <div class="chips" style="margin-top:10px" role="group" aria-label="Gioco e tattica">${tat}</div>`;
}
function mappaCorpo(tutti){
  const sel = ui.f.musc ? [ui.f.musc] : [];
  const base = filtra(tutti, ui.f, ui.q, {musc:true});
  const lista = VSE.MUSCOLI.filter(m=>!m.regione).map(m=>{ const n=base.filter(e=>perCorpo(e) && ((e.lavora||{}).muscoli||[]).some(x=>x===m.id || (VSE.MUSCOLO[x]&&VSE.MUSCOLO[x].regione===m.id))).length; return {m,n}; });
  return `<div class="corpo-map">
      <figure>${VSE.sagoma('fronte', sel, [], {cliccabile:true, attrs:'role="group" aria-label="Sagoma vista davanti"'})}<figcaption>Davanti</figcaption></figure>
      <figure>${VSE.sagoma('dietro', sel, [], {cliccabile:true, attrs:'role="group" aria-label="Sagoma vista dietro"'})}<figcaption>Dietro</figcaption></figure>
    </div>
    <details style="margin-top:8px"><summary style="cursor:pointer;font-weight:600;font-size:13.5px;min-height:36px;display:flex;align-items:center">Elenco dei muscoli</summary>
    <div class="chips" style="margin-top:6px">${lista.map(({m,n})=>`<button type="button" class="chip" data-a="musc" data-v="${m.id}" aria-pressed="${ui.f.musc===m.id}">${esc(m.nome)} <span class="muted" style="font-weight:400">${n}</span></button>`).join('')}</div></details>`;
}

function pannelloFiltri(dentroModale){
  const f=ui.f;
  const amb = f.obiettivo ? VSE.AMBITI[f.obiettivo] : [];
  const mats = VSE.MATERIALI.filter(m=>m!=='Corpo libero');
  return `<div class="filtri" style="display:flex;flex-direction:column;gap:14px">
    <div><div class="ptitle">Obiettivo</div><div class="chips">${VSE.OBIETTIVI.map(o=>`<button type="button" class="chip" data-a="f-obiettivo" data-v="${o.id}" aria-pressed="${f.obiettivo===o.id}">${esc(o.nome)}</button>`).join('')}</div></div>
    ${amb.length?`<div><div class="ptitle">${f.obiettivo==='Tecnica'?'Fondamentale':(f.obiettivo==='Tattica'?'Situazione':'Parte del corpo')}</div><div class="chips">${amb.map(a=>`<button type="button" class="chip" data-a="f-ambito" data-v="${esc(a)}" aria-pressed="${f.ambito===a}">${esc(a)}</button>`).join('')}</div></div>`:''}
    <div><div class="ptitle">Difficoltà</div><div class="chips">${[1,2,3,4,5].map(n=>`<button type="button" class="chip" data-a="f-diff" data-v="${n}" aria-pressed="${f.diff.includes(n)}" style="min-width:44px;justify-content:center">${n}</button>`).join('')}</div></div>
    <div><div class="ptitle">Quanti giocatori ho</div><div class="row">
      <button type="button" class="icon-btn" data-a="f-gioc" data-v="-1" aria-label="Meno giocatori">−</button>
      <output style="min-width:110px;text-align:center;font-weight:600">${f.gioc?f.gioc+' giocator'+(f.gioc===1?'e':'i'):'Qualsiasi numero'}</output>
      <button type="button" class="icon-btn" data-a="f-gioc" data-v="1" aria-label="Più giocatori">+</button></div></div>
    <div><div class="ptitle">Durata massima</div><div class="chips">${[0,5,10,15,20].map(n=>`<button type="button" class="chip" data-a="f-durata" data-v="${n}" aria-pressed="${f.durata===n}">${n?n+' min':'Qualsiasi'}</button>`).join('')}</div></div>
    <div><div class="ptitle">Materiale che ho</div><div class="chips">${mats.map(m=>`<button type="button" class="chip" data-a="f-mat" data-v="${esc(m)}" aria-pressed="${f.mat.includes(m)}">${esc(m)}</button>`).join('')}</div>
      <div class="muted" style="font-size:12.5px;margin-top:6px">${f.mat.length?'Mostro solo gli esercizi che si fanno con questo materiale.':'Se scegli qualcosa, vedi solo gli esercizi che puoi fare con quel materiale.'}</div></div>
    <div><div class="ptitle">Altro</div><div class="chips">
      <button type="button" class="chip" data-a="f-pref" aria-pressed="${f.pref}">${I('stella',16)} Preferiti</button>
      <button type="button" class="chip" data-a="f-miei" aria-pressed="${f.miei}">Creati o modificati da me</button></div></div>
    <div><div class="ptitle">Ordina</div><div class="seg" role="group" aria-label="Ordina">${[['ambito','Per argomento'],['az','A–Z'],['diff','Difficoltà']].map(([k,t])=>`<button type="button" data-a="ordine" data-v="${k}" aria-pressed="${ui.ordine===k}">${t}</button>`).join('')}</div></div>
    ${dentroModale?'':`<button type="button" class="btn sm" data-a="f-pulisci" ${nFiltri()||ui.f.pk||ui.f.fond||ui.f.musc||ui.q?'':'disabled'}>Pulisci tutti i filtri</button>`}
  </div>`;
}

function chipsAttivi(){
  const f=ui.f, c=[];
  const x=(t,a,v)=>c.push(`<button type="button" class="chip x" data-a="${a}" data-v="${esc(v||'')}" aria-label="Togli il filtro ${esc(t)}">${esc(t)} <b aria-hidden="true">×</b></button>`);
  if(ui.q) x('«'+ui.q+'»','x-q');
  if(f.pk){ const p=Store.pacchetto(f.pk); if(p) x(p.nome,'x-pk'); }
  if(f.fond) x(f.fond,'x-fond');
  if(f.musc) x(VSE.MUSCOLO[f.musc]?VSE.MUSCOLO[f.musc].nome:f.musc,'x-musc');
  if(f.obiettivo) x(VSE.OBIETTIVI.find(o=>o.id===f.obiettivo).nome,'x-obiettivo');
  if(f.ambito) x(f.ambito,'x-ambito');
  if(f.diff.length) x('Difficoltà '+f.diff.slice().sort().join(', '),'x-diff');
  if(f.gioc) x(f.gioc+' giocatori','x-gioc');
  if(f.durata) x('Fino a '+f.durata+' min','x-durata');
  if(f.mat.length) x('Con: '+f.mat.join(', '),'x-mat');
  if(f.pref) x('Preferiti','x-pref');
  if(f.miei) x('Creati o modificati da me','x-miei');
  return c.join('');
}

/* ------------------------------------------------------------------ VISTA: catalogo */
function vistaCatalogo(){
  const tutti = Store.esercizi();
  const lista = ordina(filtra(tutti, ui.f, ui.q));
  ui.lista = lista.map(e=>e.id);
  const pks = Store.pacchetti();
  const nPk = id => tutti.filter(e=>(e.pacchetti||[]).includes(id)).length;
  const wide = matchMedia('(min-width:1000px)').matches;
  let gruppi='';
  if(!lista.length){
    gruppi = `<div class="empty" style="grid-column:1/-1">${I('cerca',28)}<p>Nessun esercizio con questi filtri.</p><button type="button" class="btn" data-a="f-pulisci">Pulisci i filtri</button></div>`;
  } else if(ui.ordine==='ambito' && !ui.q){
    let cur=null;
    for(const e of lista){
      const k=(e.obiettivo||'')+'|'+(e.ambito||'');
      if(k!==cur){ cur=k; const n=lista.filter(x=>(x.obiettivo||'')+'|'+(x.ambito||'')===k).length;
        gruppi+=`<h2 style="grid-column:1/-1;font-size:16px;margin:${gruppi?'12px':'0'} 0 0;display:flex;align-items:center;gap:8px"><span style="color:${fisico(e)?'var(--muscle)':'var(--accent)'}">${VSE.iconaAmbito(e.ambito,20)}</span>${esc(e.ambito||'Senza argomento')} <span class="muted" style="font-weight:400;font-size:14px">${n}</span></h2>`; }
      gruppi+=cardEsercizio(e);
    }
  } else gruppi = lista.map(cardEsercizio).join('');

  const nf=nFiltri();
  const aside = `
    <div class="pks" role="group" aria-label="Pacchetti">
      <button type="button" class="pk" data-a="pk" data-v="" aria-pressed="${!ui.f.pk}"><small>Tutto il catalogo</small><b>Tutti</b><small>${tutti.length}</small></button>
      ${pks.map(p=>`<button type="button" class="pk" data-a="pk" data-v="${esc(p.id)}" aria-pressed="${ui.f.pk===p.id}"><small><span class="sw" style="background:${esc(p.colore||'#999')}"></span>Pacchetto</small><b>${esc(p.nome)}</b><small>${nPk(p.id)} esercizi</small></button>`).join('')}
    </div>
    <div class="seg" role="group" aria-label="Cerca per" style="margin:12px 0 10px">
      <button type="button" data-a="modo" data-v="pallavolo" aria-pressed="${ui.modo==='pallavolo'}">Pallavolo</button>
      <button type="button" data-a="modo" data-v="corpo" aria-pressed="${ui.modo==='corpo'}">Corpo</button>
    </div>
    <div class="mappa">${ui.modo==='corpo'?mappaCorpo(tutti):mappaCampo(tutti)}</div>
    ${wide?`<div class="panel" style="margin-top:12px">${pannelloFiltri(false)}</div>`:''}`;

  app.innerHTML = `<div class="cat">
    <aside>${!wide?`<div class="cat-head"><h1 class="h1">Cosa alleni oggi?</h1></div>`:''}${aside}</aside>
    <section aria-label="Esercizi">
      ${wide?`<div class="cat-head"><h1 class="h1">Cosa alleni oggi?</h1><span class="muted">${lista.length} esercizi</span></div>`:''}
      <div class="filtri-att">
        ${!wide?`<button type="button" class="chip" data-a="apri-filtri" aria-pressed="${nf>0}">${I('filtri',16)} Filtri${nf?' · '+nf:''}</button>`:''}
        ${chipsAttivi()}
        ${!wide?`<span class="muted" style="font-size:13px;margin-left:auto">${lista.length} esercizi</span>`:''}
      </div>
      <div class="risultati">${gruppi}</div>
    </section></div>`;
}

/* ------------------------------------------------------------------ VISTA: scheda */
function vistaScheda(id){
  const e = Store.esercizio(id);
  if(!e){ app.innerHTML=`<div class="empty"><p>Questo esercizio non c'è più.</p><a class="btn" href="#/">Torna al catalogo</a></div>`; return; }
  const l=e.lavora||{}, campo=e.anim && e.anim.tipo==='campo';
  const pref=Store.preferito(e.id);
  const ob=VSE.OBIETTIVI.find(o=>o.id===e.obiettivo);
  const pk=(e.pacchetti||[]).map(id=>Store.pacchetto(id)).filter(Boolean);
  const passi=(e.passi||[]);
  const haAnim = e.anim && (e.anim.fotogrammi||[]).length;
  const idx = ui.lista.indexOf(e.id);
  const prev = idx>0 ? ui.lista[idx-1] : null, next = idx>=0 && idx<ui.lista.length-1 ? ui.lista[idx+1] : null;
  const fondSec=(l.fondamentali||[]).filter(f=>f!==e.ambito);
  const ms=l.muscoli||[];
  const fronte = ms.filter(m=>VSE.MUSCOLO[m] && (VSE.MUSCOLO[m].vista==='fronte')), dietro = ms.filter(m=>VSE.MUSCOLO[m] && VSE.MUSCOLO[m].vista==='dietro');
  const princ = ms[0];
  const lavoraHTML = `
    <div class="lavora">
      ${fisico(e)
        ? `<div class="minisag" aria-hidden="true">${VSE.sagoma('fronte', [princ], ms)}${VSE.sagoma('dietro', [princ], ms)}</div>`
        : `<div class="big">${VSE.iconaAmbito(e.ambito, 26)}</div>`}
      <div style="min-width:0">${fisico(e)
        ? `<div style="font-weight:700;font-size:17px">${esc(VSE.MUSCOLO[princ]?VSE.MUSCOLO[princ].nome:(e.ambito||''))}</div><div class="muted" style="font-size:13px">${ms.length>1?'muscolo principale':'parte del corpo'}</div>`
        : `<div style="font-weight:700;font-size:17px">${esc(e.ambito||'')}</div><div class="muted" style="font-size:13px">${e.obiettivo==='Tattica'?'situazione di gioco':'fondamentale principale'}</div>`}</div>
    </div>
    ${(fondSec.length||ms.length)?`<div class="chips" style="margin-top:10px">${fondSec.map(f=>`<span class="chip soft">${esc(f)}</span>`).join('')}${ms.map((m,i)=>`<span class="chip musc ${fisico(e)&&i===0?'on':''}">${esc(VSE.MUSCOLO[m]?VSE.MUSCOLO[m].nome:m)}</span>`).join('')}</div>`:''}
    ${e.serveA?`<p style="margin:10px 0 0;font-size:14px;color:var(--ink-2)"><b>A cosa serve:</b> ${esc(e.serveA)}</p>`:''}`;
  const prepHTML = e.prepara ? `<div class="prep">${VSE.iconaAmbito(e.ambito,20)}<span><small>Prepara a</small><b>${esc(e.prepara)}</b></span></div>` : '';
  const info=[];
  info.push(['Difficoltà', difficoltaDots(e.difficolta)+` <span class="muted" style="font-weight:400">${+e.difficolta||'–'} su 5</span>`]);
  const g=giocatoriTesto(e); if(g) info.push(['Giocatori', esc(g)]);
  if(e.durata) info.push(['Durata', esc(e.durata)+' minuti']);
  const dose=doseTesto(e); if(dose) info.push(['Quantità', esc(dose)]);
  if(e.dose && e.dose.recupero) info.push(['Recupero', esc(e.dose.recupero)+'″ tra le serie']);
  if((e.materiale||[]).length) info.push(['Materiale', esc(e.materiale.join(', '))+(e.materialeNote?` <span class="muted" style="font-weight:400">(${esc(e.materialeNote)})</span>`:'')]);
  const stepFrame = (p,i) => (p.f!=null ? +p.f : Math.min(i+1, ((e.anim||{}).fotogrammi||[1]).length-1));
  app.innerHTML = `
  <div class="sch-head">
    <div class="tt">
      <div class="crumb"><a href="#/" style="color:inherit">${esc(ob?ob.nome:'Esercizi')}</a> › ${esc(e.ambito||'')}${pk.map(p=>`<span class="chip soft" style="min-height:26px;font-size:12px"><span class="sw" style="width:9px;height:9px;border-radius:3px;background:${esc(p.colore||'#999')};display:inline-block"></span>${esc(p.nome)}</span>`).join('')}</div>
      <h1 class="h1" style="margin-top:4px">${esc(e.titolo)}</h1>
      ${e.descrizione?`<p style="margin:6px 0 0;color:var(--ink-2);max-width:70ch">${esc(e.descrizione)}</p>`:''}
    </div>
    <div class="azioni noprint">
      <button type="button" class="btn" data-a="pref" data-id="${esc(e.id)}" aria-pressed="${pref}">${I('stella',18, pref?'style="fill:#F6B93B;color:#C98A00"':'')} ${pref?'Preferito':'Preferiti'}</button>
      <button type="button" class="btn" data-a="a-pacchetto" data-id="${esc(e.id)}">${I('pacchetto',18)} Pacchetti</button>
      <a class="btn primary" href="#/modifica/${encodeURIComponent(e.id)}">${I('matita',18)} Modifica</a>
      <button type="button" class="icon-btn" data-a="altro-es" data-id="${esc(e.id)}" aria-label="Altre azioni">⋯</button>
    </div>
  </div>
  ${e.obiettivo==='Recupero'?`<div class="banner" style="margin-bottom:14px">${I('attenzione',20)}<span>Da fare solo dopo il parere del medico o del fisioterapista. Durante l'esercizio il dolore non deve superare 3 su 10; se aumenta, fermati.</span></div>`:''}
  <div class="sch">
    <div class="main">
      ${haAnim?`<div class="player">
        <div style="position:relative"><div class="stage ${campo?'campo':''}" id="stage">${VSA.svg(e.anim,0,{attrs:'role="img" aria-label="Animazione dell\'esercizio"'})}</div><span class="badge" id="badge" style="position:absolute;left:10px;top:10px;font-size:12px;font-weight:600;background:var(--surface);color:var(--ink);border-radius:999px;padding:4px 10px;box-shadow:var(--shadow)">Passo 1 di ${passi.length||1}</span></div>
        <div class="ctrl">
          <button type="button" class="play" data-a="play" aria-label="Metti in pausa">${I('pausa',18)}</button>
          <div class="prog" aria-hidden="true"><i id="prog"></i></div>
          <button type="button" class="btn sm" data-a="vel">Velocità 1×</button>
          <button type="button" class="icon-btn" data-a="schermo" aria-label="Schermo intero">${I('schermo',18)}</button>
        </div></div>`:(e.immagine?`<div class="player"><div class="stage"><img src="${esc(e.immagine)}" alt="Schema dell'esercizio" style="width:100%;display:block"></div></div>`:'')}
      <div class="stampa-passi">${haAnim?passi.map((p,i)=>`<figure>${VSA.svg(e.anim, stepFrame(p,i), {fantasma:false})}<figcaption><b>${i+1}. ${esc(p.titolo||'')}</b></figcaption></figure>`).join(''):''}</div>
      ${passi.length?`<section class="panel"><h2>Passo per passo</h2><div class="passi" id="passi">${passi.map((p,i)=>`<button type="button" class="passo" data-a="passo" data-f="${stepFrame(p,i)}" data-i="${i}"><span class="n">${i+1}</span><span><b>${esc(p.titolo||('Passo '+(i+1)))}</b><span class="tx">${esc(p.testo||'')}</span></span></button>`).join('')}</div></section>`:''}
    </div>
    <div class="side">
      <section class="panel"><h2>Su cosa lavora</h2>${prepHTML}${lavoraHTML}<div class="info" style="margin-top:12px">${info.map(([k,v])=>`<div><small>${k}</small><b>${v}</b></div>`).join('')}</div></section>
      ${(e.attenzione||[]).length?`<section class="panel"><h2>Punti di attenzione</h2><ul class="att">${e.attenzione.map(a=>`<li>${I('ok',18)}<span>${esc(a)}</span></li>`).join('')}</ul></section>`:''}
      ${(e.errori||[]).length?`<section class="panel"><h2>Errori e correzioni</h2>${e.errori.map(x=>`<div class="err"><b>${esc(x.errore||x[0]||'')}</b><div class="co">${I('avanti',16)}<span>${esc(x.correzione||x[1]||'')}</span></div></div>`).join('')}</section>`:''}
      ${(e.varianti && (e.varianti.facile||e.varianti.difficile))?`<section class="panel"><h2>Varianti</h2><div class="var">${e.varianti.facile?`<div><small>Più facile</small>${esc(e.varianti.facile)}</div>`:''}${e.varianti.difficile?`<div><small>Più difficile</small>${esc(e.varianti.difficile)}</div>`:''}</div></section>`:''}
      ${e.note?`<section class="panel"><h2>Note</h2><p style="margin:0;white-space:pre-line">${esc(e.note)}</p></section>`:''}
    </div>
  </div>
  <div class="navsch">
    ${prev?`<a class="btn" href="#/es/${encodeURIComponent(prev)}" rel="prev">${I('indietro',18)} Precedente</a>`:'<span></span>'}
    <span class="muted" style="font-size:13px">${idx>=0?(idx+1)+' di '+ui.lista.length:''}</span>
    ${next?`<a class="btn" href="#/es/${encodeURIComponent(next)}" rel="next">Successivo ${I('avanti',18)}</a>`:'<span></span>'}
  </div>`;
  if(haAnim){
    const stage=$('#stage'), badge=$('#badge'), prog=$('#prog');
    const nP = passi.length;
    const frameToStep = f => { let best=-1; for(let i=0;i<nP;i++){ if(stepFrame(passi[i],i)<=f) best=i; } return best<0?0:best; };
    ui.player = new VSA.Player(stage, e.anim, {
      attrs:'role="img" aria-label="Animazione dell\'esercizio: '+esc(e.titolo)+'"',
      onFrame(fi){
        const si = nP ? frameToStep(fi) : 0;
        $$('#passi .passo').forEach((b,i)=>{ if(i===si) b.setAttribute('aria-current','step'); else b.removeAttribute('aria-current'); });
        if(badge) badge.textContent = nP ? `Passo ${si+1} di ${nP}` : `Fotogramma ${fi+1}`;
      },
      onTime(u){ if(prog) prog.style.width=(u*100).toFixed(1)+'%'; },
      onPlay(on){ const b=$('[data-a="play"]'); if(b){ b.innerHTML=I(on?'pausa':'play',18); b.setAttribute('aria-label', on?'Metti in pausa':'Riproduci'); } },
    });
    if(!ui.player.playing){ const b=$('[data-a="play"]'); b.innerHTML=I('play',18); b.setAttribute('aria-label','Riproduci'); }
  }
}

/* ------------------------------------------------------------------ pacchetti di un esercizio */
function finestraPacchetti(id){
  const e=Store.esercizio(id); if(!e) return;
  const pks=Store.pacchetti();
  modal('Pacchetti di «'+e.titolo+'»', `
    <p class="muted" style="margin:0">Scegli in quali pacchetti mettere l'esercizio.</p>
    <div>${pks.map(p=>`<label class="check"><input type="checkbox" value="${esc(p.id)}" ${(e.pacchetti||[]).includes(p.id)?'checked':''}><span class="sw" style="width:12px;height:12px;border-radius:4px;background:${esc(p.colore||'#999')};display:inline-block"></span>${esc(p.nome)}</label>`).join('')}</div>
    <label class="f">Nuovo pacchetto<input type="text" id="pk-nuovo" placeholder="Es. Allenamento del giovedì"></label>`,
    `<button class="btn" data-a="m-chiudi">Annulla</button><button class="btn primary" id="pk-ok">Salva</button>`, (m,c)=>{
      $('#pk-ok',m).onclick=()=>{
        const sel=$$('input[type=checkbox]:checked',m).map(i=>i.value);
        const nome=$('#pk-nuovo',m).value.trim();
        if(nome){ const p=Store.salvaPacchetto({id:Store.nuovoId('pk'), nome, descrizione:'', colore:coloreNuovo(), ordine:50}); sel.push(p.id); }
        const r=Store.clona(e); r.pacchetti=sel; Store.salvaEsercizio(r); c(); toast('Pacchetti aggiornati'); render();
      };
    });
}
const COLORI_PK=['#1546A0','#E2553A','#1C7342','#7A2E8E','#C98A00','#0F6E7A','#B4421E','#3D4AA8'];
function coloreNuovo(){ const usati=Store.pacchetti().map(p=>p.colore); return COLORI_PK.find(c=>!usati.includes(c)) || COLORI_PK[Math.floor(Math.random()*COLORI_PK.length)]; }

async function altroEsercizio(id){
  const e=Store.esercizio(id); if(!e) return;
  const opz=[{t:'Duplica',d:'Crea una copia da modificare',ic:'copia',k:'dup'},{t:'Stampa',d:'Scheda con i disegni di ogni passo',ic:'stampa',k:'stampa'},{t:'Esporta questo esercizio',d:'File .json da dare a un altro allenatore',ic:'scarica',k:'esp'}];
  if(e._origine==='modificato') opz.push({t:'Ripristina l\'originale',d:'Annulla le tue modifiche a questo esercizio',ic:'annulla',k:'rip'});
  opz.push({t: e._origine==='mio'?'Elimina':'Nascondi dal catalogo', d: e._origine==='mio'?'Lo togli definitivamente':'Puoi rimetterlo da Archivio', ic:'cestino', k:'del'});
  const i=await scelta(e.titolo, '', opz); if(i<0) return;
  const k=opz[i].k;
  if(k==='dup'){ const r=Store.clona(e); delete r._origine; r.id=Store.nuovoId('es'); r.titolo=e.titolo+' (copia)'; delete r.creato; Store.salvaEsercizio(r); toast('Copia creata'); location.hash='#/modifica/'+encodeURIComponent(r.id); }
  if(k==='stampa'){ setTimeout(()=>window.print(), 100); }
  if(k==='esp'){ const r=Store.clona(e); delete r._origine; scarica('esercizio-'+slug(e.titolo)+'.json', {app:'volleyfit', tipo:'esercizi', versione:1, esportato:new Date().toISOString(), esercizi:[r], pacchetti:[]}); }
  if(k==='rip'){ if(await conferma('Ripristinare l\'originale?','Le tue modifiche a «'+esc(e.titolo)+'» andranno perse.','Ripristina')){ Store.ripristinaEsercizio(e.id); toast('Esercizio ripristinato'); render(); } }
  if(k==='del'){ if(await conferma(e._origine==='mio'?'Eliminare l\'esercizio?':'Nascondere l\'esercizio?', e._origine==='mio'?'«'+esc(e.titolo)+'» verrà eliminato su tutti i dispositivi collegati.':'«'+esc(e.titolo)+'» sparirà dal catalogo. Potrai rimetterlo da Archivio › Catalogo.', e._origine==='mio'?'Elimina':'Nascondi', true)){ Store.eliminaEsercizio(e.id); toast(e._origine==='mio'?'Esercizio eliminato':'Esercizio nascosto'); location.hash='#/'; } }
}

/* ------------------------------------------------------------------ VISTA: editor */
function vistaEditor(id, preset){
  let rec;
  if(id){ rec=Store.esercizio(id); if(!rec){ app.innerHTML='<div class="empty"><p>Esercizio non trovato.</p></div>'; return; } rec=Store.clona(rec); }
  else rec = Editor.nuovo(preset||{});
  const nuovo=!id;
  app.innerHTML = `<div class="sch-head"><div class="tt"><div class="crumb">${nuovo?'Nuovo esercizio':'Modifica'}${!nuovo && rec._origine==='catalogo'?' · esercizio del catalogo: le modifiche restano tue e puoi sempre ripristinare l\'originale':''}</div><h1 class="h1" style="margin-top:4px" id="ed-tit">${esc(rec.titolo||'Nuovo esercizio')}</h1></div></div>
    <div id="ed"></div>
    <div class="savebar"><span class="msg" id="ed-msg">${nuovo?'':'Nessuna modifica'}</span><button type="button" class="btn" data-a="ed-annulla">Annulla</button><button type="button" class="btn primary" data-a="ed-salva">${I('ok',18)} Salva</button></div>`;
  ui.sporco=false;
  ui.editor = Editor.monta($('#ed'), rec, {
    onChange(r){ ui.sporco=true; const m=$('#ed-msg'); if(m) m.textContent='Modifiche non salvate'; const t=$('#ed-tit'); if(t) t.textContent=r.titolo||'Nuovo esercizio'; },
    toast, conferma, modal,
  });
  ui.editorNuovo=nuovo;
}
function salvaEditor(){
  if(!ui.editor) return;
  const r = ui.editor.dati();
  if(!r.titolo || !r.titolo.trim()){ toast('Scrivi il titolo dell\'esercizio'); const t=$('#ed [name=titolo]'); if(t) t.focus(); return; }
  if(!r.id) r.id=Store.nuovoId('es');
  Store.salvaEsercizio(r);
  ui.sporco=false;
  toast('Esercizio salvato');
  location.hash='#/es/'+encodeURIComponent(r.id);
}

/* ------------------------------------------------------------------ VISTA: pacchetti */
function vistaPacchetti(){
  const tutti=Store.esercizi(); const pks=Store.pacchetti();
  app.innerHTML = `<div class="cat-head"><h1 class="h1">Pacchetti</h1><button type="button" class="btn primary" data-a="pk-nuovo">${I('piu',18)} Nuovo pacchetto</button></div>
    <p class="muted" style="margin:-4px 0 14px;max-width:70ch">Un pacchetto raccoglie esercizi su un tema o per un gruppo. Lo stesso esercizio può stare in più pacchetti. Per aggiungere un esercizio, aprilo e premi «Pacchetti».</p>
    <div class="pk-grid">${pks.map(p=>{ const n=tutti.filter(e=>(e.pacchetti||[]).includes(p.id)).length; return `<a class="pk-card" href="#/pacchetto/${encodeURIComponent(p.id)}"><div class="bar" style="background:${esc(p.colore||'#999')}"></div><h3>${esc(p.nome)}</h3>${p.descrizione?`<p>${esc(p.descrizione)}</p>`:''}<span class="n">${n} esercizi${p._origine==='catalogo'?'':' · creato da te'}</span></a>`; }).join('')}</div>`;
}
function vistaPacchetto(id){
  const p=Store.pacchetto(id);
  if(!p){ app.innerHTML='<div class="empty"><p>Pacchetto non trovato.</p><a class="btn" href="#/pacchetti">Tutti i pacchetti</a></div>'; return; }
  const lista=ordina(Store.esercizi().filter(e=>(e.pacchetti||[]).includes(id)));
  ui.lista=lista.map(e=>e.id);
  const durTot=lista.reduce((s,e)=>s+(+e.durata||0),0);
  app.innerHTML = `<div class="sch-head"><div class="tt"><div class="crumb"><a href="#/pacchetti" style="color:inherit">Pacchetti</a></div>
      <h1 class="h1" style="margin-top:4px;display:flex;align-items:center;gap:10px"><span style="width:16px;height:16px;border-radius:5px;background:${esc(p.colore||'#999')};flex:none"></span>${esc(p.nome)}</h1>
      ${p.descrizione?`<p style="margin:6px 0 0;color:var(--ink-2);max-width:70ch">${esc(p.descrizione)}</p>`:''}
      <p class="muted" style="margin:6px 0 0;font-size:13.5px">${lista.length} esercizi${durTot?' · circa '+durTot+' minuti in tutto':''}</p></div>
    <div class="azioni"><button type="button" class="btn" data-a="pk-filtra" data-id="${esc(p.id)}">${I('griglia',18)} Apri nel catalogo</button><button type="button" class="btn" data-a="pk-modifica" data-id="${esc(p.id)}">${I('matita',18)} Modifica</button><button type="button" class="btn" data-a="pk-esporta" data-id="${esc(p.id)}">${I('scarica',18)} Esporta</button></div></div>
    <div class="risultati">${lista.length?lista.map(cardEsercizio).join(''):'<div class="empty" style="grid-column:1/-1">Il pacchetto è vuoto. Apri un esercizio e premi «Pacchetti» per aggiungerlo.</div>'}</div>`;
}
function finestraPacchetto(id){
  const p = id ? Store.pacchetto(id) : {id:Store.nuovoId('pk'), nome:'', descrizione:'', colore:coloreNuovo(), ordine:50};
  modal(id?'Modifica pacchetto':'Nuovo pacchetto', `
    <label class="f">Nome<input type="text" id="pkn" value="${esc(p.nome)}" placeholder="Es. Allenamento del giovedì"></label>
    <label class="f">Descrizione<textarea id="pkd" rows="3" placeholder="Per chi è, quando usarlo…">${esc(p.descrizione||'')}</textarea></label>
    <div><div class="ptitle">Colore</div><div class="chips">${COLORI_PK.map(c=>`<button type="button" class="chip" data-col="${c}" aria-pressed="${p.colore===c}" aria-label="Colore ${c}" style="width:44px;padding:0;justify-content:center"><span style="width:20px;height:20px;border-radius:6px;background:${c}"></span></button>`).join('')}</div></div>`,
    `${id?'<button class="btn danger" id="pk-del" style="margin-right:auto">Elimina</button>':''}<button class="btn" data-a="m-chiudi">Annulla</button><button class="btn primary" id="pk-ok">Salva</button>`, (m,c)=>{
      let col=p.colore;
      $$('[data-col]',m).forEach(b=>b.onclick=()=>{ col=b.dataset.col; $$('[data-col]',m).forEach(x=>x.setAttribute('aria-pressed', x===b)); });
      $('#pk-ok',m).onclick=()=>{ const nome=$('#pkn',m).value.trim(); if(!nome){ toast('Scrivi il nome del pacchetto'); return; }
        const r=Store.clona(p); r.nome=nome; r.descrizione=$('#pkd',m).value.trim(); r.colore=col; Store.salvaPacchetto(r); c(); toast('Pacchetto salvato'); if(!id) location.hash='#/pacchetto/'+encodeURIComponent(r.id); else render(); };
      const d=$('#pk-del',m); if(d) d.onclick=async()=>{ c(); if(await conferma('Eliminare il pacchetto?','Gli esercizi restano nel catalogo: viene tolto solo il pacchetto.','Elimina',true)){ Store.eliminaPacchetto(p.id); toast('Pacchetto eliminato'); location.hash='#/pacchetti'; } };
    });
}

/* ------------------------------------------------------------------ esportazione / importazione */
function recPuliti(lista){ return lista.map(e=>{ const r=Store.clona(e); delete r._origine; delete r._rt; return r; }); }
async function esporta(){
  const pks=Store.pacchetti();
  const opz=[
    {t:'Tutti gli esercizi', d:'Catalogo completo, con le tue modifiche ('+Store.esercizi().length+' esercizi)', ic:'griglia', k:'tutti'},
    {t:'Solo i miei esercizi e le modifiche', d:'Quello che hai creato o cambiato tu', ic:'matita', k:'miei'},
    {t:'Un pacchetto', d:'Scegli quale nel passo successivo', ic:'pacchetto', k:'pk'},
    {t:'Per Volleysched', d:'File da importare in Volleysched (Archivio › Importa)', ic:'scambio', k:'vs'},
  ];
  const i=await scelta('Esporta', 'Il file non contiene mai il tuo codice di accesso.', opz); if(i<0) return;
  const k=opz[i].k;
  let lista=Store.esercizi(), nome='esercizi';
  if(k==='miei'){ lista=lista.filter(e=>e._origine!=='catalogo'); nome='miei-esercizi'; if(!lista.length){ toast('Non hai ancora creato o modificato esercizi'); return; } }
  if(k==='pk'){ const j=await scelta('Quale pacchetto?','', pks.map(p=>({t:p.nome, d:Store.esercizi().filter(e=>(e.pacchetti||[]).includes(p.id)).length+' esercizi', ic:'pacchetto'}))); if(j<0) return; return esportaPacchetto(pks[j].id); }
  if(k==='vs') return esportaVolleysched(lista, 'volleysched');
  const usati=new Set(); lista.forEach(e=>(e.pacchetti||[]).forEach(p=>usati.add(p)));
  scarica(nome+'-'+oggi()+'.json', {app:'volleyfit', tipo:'esercizi', versione:1, esportato:new Date().toISOString(), esercizi:recPuliti(lista), pacchetti:recPuliti(pks.filter(p=>usati.has(p.id)))});
  toast('File scaricato');
}
function esportaPacchetto(id){
  const p=Store.pacchetto(id); if(!p) return;
  const lista=Store.esercizi().filter(e=>(e.pacchetti||[]).includes(id));
  scarica('pacchetto-'+slug(p.nome)+'-'+oggi()+'.json', {app:'volleyfit', tipo:'esercizi', versione:1, esportato:new Date().toISOString(), esercizi:recPuliti(lista), pacchetti:recPuliti([p])});
  toast('File scaricato');
}
function svgPng(svgText, w){
  return new Promise(res=>{
    try{
      const m=svgText.match(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/); const ar = m ? (+m[4])/(+m[3]) : 0.6;
      const img=new Image(); const blob=new Blob([svgText.replace('<svg ','<svg width="'+w+'" height="'+Math.round(w*ar)+'" ')],{type:'image/svg+xml'}); const u=URL.createObjectURL(blob);
      img.onload=()=>{ const c=document.createElement('canvas'); c.width=w; c.height=Math.round(w*ar); const g=c.getContext('2d'); g.fillStyle='#fff'; g.fillRect(0,0,c.width,c.height); g.drawImage(img,0,0,c.width,c.height); URL.revokeObjectURL(u); try{ res(c.toDataURL('image/jpeg',0.85)); }catch(e){ res(null); } };
      img.onerror=()=>{ URL.revokeObjectURL(u); res(null); };
      img.src=u;
    }catch(e){ res(null); }
  });
}
async function esportaVolleysched(lista, nome){
  toast('Preparo il file…');
  const col=Object.assign(VSA.colori(), {sfondo:'#EAF0F8', inchiostro:'#1A1C1E', lontano:'#9CA2AB', suolo:'#BFC8D6', campo:'#1546A0', pavimento:'#E8833A'});
  const formaz = e => { const g=e.giocatori||[]; const a=+g[0]||1, b=+g[1]||a; if(b<=1) return 'Individuale'; if(b===2) return 'Coppie'; if(b===3) return 'Terne'; return 'A gruppi'; };
  const intens = d => (+d||0)<=2?'Bassa':((+d)===3?'Media':'Alta');
  const fond = e => e.obiettivo==='Fisico'?'Preparazione fisica':(e.obiettivo==='Recupero'?'Recupero infortuni':(e.ambito||''));
  const out=[];
  for(const e of lista){
    const img = e.anim && (e.anim.fotogrammi||[]).length ? await svgPng(VSA.copertina(e.anim,{col}), 640) : (e.immagine||null);
    const l=e.lavora||{};
    const lav=[...(l.fondamentali||[]), ...(l.muscoli||[]).map(m=>VSE.MUSCOLO[m]?VSE.MUSCOLO[m].nome:m)];
    out.push({
      id:'vse_'+e.id, titolo:e.titolo, fondamentale:fond(e), formazione:formaz(e), durata:e.durata||'', intensita:intens(e.difficolta),
      materiale:(e.materiale||[]).join(', '),
      organizzazione:[e.descrizione||'', e.prepara?'Prepara a: '+e.prepara:'', lav.length?'Su cosa lavora: '+lav.join(', ')+'.':'', e.serveA?'A cosa serve: '+e.serveA:''].filter(Boolean).join('\n'),
      svolgimento:(e.passi||[]).map((p,i)=>(i+1)+'. '+(p.titolo?p.titolo+': ':'')+(p.testo||'')).join('\n') + (doseTesto(e)?'\n'+doseTesto(e)+(e.dose&&e.dose.recupero?', recupero '+e.dose.recupero+'″':''):''),
      puntoChiave:(e.attenzione||[]).join('\n'),
      variante:[e.varianti&&e.varianti.facile?'Più facile: '+e.varianti.facile:'', e.varianti&&e.varianti.difficile?'Più difficile: '+e.varianti.difficile:''].filter(Boolean).join('\n'),
      note:[e.obiettivo==='Recupero'?'Da fare solo dopo il parere del medico o del fisioterapista; il dolore non deve superare 3 su 10.':'', (e.errori||[]).map(x=>'Errore: '+(x.errore||'')+' → '+(x.correzione||'')).join('\n'), e.note||''].filter(Boolean).join('\n'),
      image:img, schema:null, origine:'VolleyFit',
      createdAt:e.creato||Date.now(), updatedAt:e.agg||Date.now(),
    });
  }
  scarica(nome+'-'+oggi()+'.json', {app:'schedario-pallavolo', exportedAt:new Date().toISOString(), data:{exercises:out, sessions:[]}});
  toast('File per Volleysched scaricato');
}
function daVolleysched(x){
  const f=String(x.fondamentale||'');
  let obiettivo='Tecnica', ambito=f;
  if(/fisic|prepar/i.test(f)){ obiettivo='Fisico'; ambito='Gambe'; }
  else if(/recuper|infortun/i.test(f)){ obiettivo='Recupero'; ambito='Ginocchio'; }
  else if(!VSE.FONDAMENTALI.includes(f)){ obiettivo='Tattica'; ambito='Gioco'; }
  const righe = s => String(s||'').split(/\n+|(?<=\.)\s+(?=[A-ZÀ-Ý])/).map(t=>t.replace(/^\s*[-•\d.)]+\s*/,'').trim()).filter(Boolean);
  const pr = {Bassa:2, Media:3, Alta:4}[x.intensita]||2;
  const passi = righe(x.svolgimento).map((t,i)=>({titolo:'', testo:t, f:null}));
  return {
    id:String(x.id||'').startsWith('vse_') ? String(x.id).slice(4) : 'vs_'+(x.id||Math.random().toString(36).slice(2)),
    titolo:x.titolo||'Esercizio', obiettivo, ambito, descrizione:x.organizzazione||'', difficolta:pr,
    durata:x.durata||'', giocatori: /coppie/i.test(x.formazione)?[2,2]:(/terne/i.test(x.formazione)?[3,3]:(/individ/i.test(x.formazione)?[1,1]:[])),
    materiale: x.materiale?[]:[], materialeNote:x.materiale||'',
    lavora:{fondamentali: obiettivo==='Tecnica'?[f]:[], muscoli:[]},
    passi, attenzione:righe(x.puntoChiave), errori:[], varianti:{facile:x.variante||'', difficile:''}, note:x.note||'',
    immagine:x.image||null, anim:null, pacchetti:[], tags:['Volleysched'],
  };
}
function importa(){
  const inp=document.createElement('input'); inp.type='file'; inp.accept='.json,application/json';
  inp.onchange=()=>{
    const file=inp.files[0]; if(!file) return;
    const r=new FileReader();
    r.onload=async()=>{
      let j; try{ j=JSON.parse(r.result); }catch(e){ toast('Il file non è un file .json valido'); return; }
      let es=[], pk=[], tipo='';
      if(j && (j.app==='volleyfit'||j.app==='volleyfit') && Array.isArray(j.esercizi)){ es=j.esercizi; pk=j.pacchetti||[]; tipo='esercizi'; }
      else if(j && (j.app==='volleyfit'||j.app==='volleyfit') && j.esercizi && typeof j.esercizi==='object'){ // copia dell'archivio online
        if(await conferma('Unire la copia?','Il file è una copia completa dei dati. Le schede più recenti sostituiscono quelle più vecchie.','Unisci')){ Store.unisci(j); toast('Copia unita'); render(); } return; }
      else { const d=j.data||j; if(Array.isArray(d.exercises)){
        const nostri=d.exercises.filter(x=>String(x.id||'').startsWith('vse_') && Store.esercizio(String(x.id).slice(4)));
        es=d.exercises.filter(x=>!nostri.includes(x)).map(daVolleysched); tipo='volleysched';
        if(!es.length && nostri.length){ toast('Questi esercizi sono già nell\'app: non c\'è niente da importare'); return; } } }
      if(!es.length){ toast('Nel file non ho trovato esercizi'); return; }
      const ok=await conferma('Importare '+es.length+' esercizi?', tipo==='volleysched'?'Arrivano da Volleysched: avranno passi, punti chiave e immagine, ma senza animazione. Puoi completarli con l\'editor.':'Gli esercizi con lo stesso codice vengono aggiornati, gli altri aggiunti.', 'Importa');
      if(!ok) return;
      const n=Store.importaEsercizi(es, pk); toast(n+' esercizi importati'); location.hash='#/'; render();
    };
    r.readAsText(file);
  };
  inp.click();
}

/* ------------------------------------------------------------------ VISTA: archivio */
function statoSyncHTML(){
  const st=Sync.stato(), u=Store.meta('syncUltima');
  const L={ok:'Sincronizzato', pending:'Modifiche da inviare', busy:'Sincronizzazione in corso…', offline:'Senza rete', err:'Errore', off:'Non collegato'};
  return `<b>${L[st.s]||''}</b>${st.msg?' · '+esc(st.msg):''}${u?`<div class="muted" style="font-size:12.5px">Ultimo controllo: ${new Date(u).toLocaleString('it-IT',{dateStyle:'short',timeStyle:'short'})}</div>`:''}`;
}
function vistaArchivio(){
  const c=Sync.config(); const last=Store.meta('syncUltimo')||{};
  const nasc=Store.eliminatiDiCatalogo(); const mod=Store.esercizi().filter(e=>e._origine==='modificato');
  const tema=Store.meta('tema')||'auto';
  app.innerHTML = `<div class="cat-head"><h1 class="h1">Archivio e impostazioni</h1><a class="btn" href="#/guida">${I('guida',18)} Guida</a></div>
  <div style="display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));align-items:start">
  <section class="panel" id="sync-panel"><h2>Sincronizzazione tra i dispositivi</h2>
    ${c?`<div class="banner info" style="display:block" id="sync-stato">${statoSyncHTML()}</div>
      <p style="font-size:14px;color:var(--ink-2)">Collegato a <b>${esc(c.owner)}/${esc(c.repo)}</b>, file <code>${esc(c.path)}</code>. Le modifiche partono da sole pochi secondi dopo il salvataggio; quelle degli altri dispositivi arrivano all'apertura e poi ogni minuto.</p>
      <div class="row"><button type="button" class="btn primary" data-a="sync-ora">${I('aggiorna',18)} Sincronizza adesso</button>
      <a class="btn" href="https://github.com/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/commits" target="_blank" rel="noopener">Versioni precedenti</a>
      <button type="button" class="btn" data-a="sync-token">Cambia codice di accesso</button>
      <button type="button" class="btn danger" data-a="sync-off">Scollega questo dispositivo</button></div>`
    :`<p style="margin-top:0;font-size:14px;color:var(--ink-2)">Per ora i dati sono solo su questo dispositivo. Collega l'archivio privato su GitHub che usi per Volleysched: gli esercizi vanno in una cartella a parte (<code>${esc(Sync.DEF_PATH.split('/')[0])}</code>) e i dati di Volleysched non vengono toccati.</p>
      <details><summary style="cursor:pointer;font-weight:700;min-height:40px;display:flex;align-items:center">Se non hai ancora un archivio privato</summary>
      <ol style="font-size:14px;color:var(--ink-2);padding-left:20px">
        <li>Su GitHub crea un archivio nuovo: <a href="https://github.com/new" target="_blank" rel="noopener">github.com/new</a>. Nome per esempio <code>volleysched-dati</code>, scegli <b>Private</b>.</li>
        <li>Crea il codice di accesso: <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com/settings/personal-access-tokens/new</a>. Repository access: <b>Only select repositories</b> → l'archivio dei dati. Permissions → Repository permissions → <b>Contents: Read and write</b>.</li>
        <li>Se usi già Volleysched con la sincronizzazione, puoi usare lo stesso archivio e lo stesso codice.</li>
      </ol></details>
      <div class="grid3" id="sync-form" style="margin-top:8px">
        <label class="f">Nome utente GitHub<input type="text" name="owner" autocomplete="username" autocapitalize="off" spellcheck="false" value="${esc(last.owner||'')}" placeholder="es. mario-rossi"></label>
        <label class="f">Nome dell'archivio<input type="text" name="repo" autocapitalize="off" spellcheck="false" value="${esc(last.repo||'volleysched-dati')}"></label>
        <label class="f">Codice di accesso<input type="password" name="token" autocomplete="off" spellcheck="false" placeholder="github_pat_…"></label>
      </div>
      <div class="row" style="margin-top:12px"><button type="button" class="btn primary" data-a="sync-collega">${I('nuvola',18)} Collega</button><span class="muted" id="sync-msg" style="font-size:13.5px"></span></div>
      <p class="muted" style="font-size:12.5px;margin-bottom:0">Il codice di accesso resta solo su questo dispositivo: non finisce nei file esportati.</p>`}
  </section>
  <section class="panel"><h2>Copie e scambio con altri allenatori</h2>
    <p style="margin-top:0;font-size:14px;color:var(--ink-2)">Esporta gli esercizi in un file .json, anche nel formato di Volleysched, oppure importa un file ricevuto.</p>
    <div class="row"><button type="button" class="btn" data-a="esporta">${I('scarica',18)} Esporta…</button><button type="button" class="btn" data-a="importa">${I('carica',18)} Importa…</button></div>
  </section>
  <section class="panel"><h2>Aspetto</h2>
    <div class="seg" role="group" aria-label="Tema">${[['auto','Come il dispositivo'],['chiaro','Chiaro'],['scuro','Scuro']].map(([k,t])=>`<button type="button" data-a="tema" data-v="${k}" aria-pressed="${tema===k}">${t}</button>`).join('')}</div>
    <label class="f" style="margin-top:12px">Nome di questo dispositivo (compare nella cronologia online)<input type="text" id="disp" value="${esc(Store.meta('dispositivo')||'')}" placeholder="Es. Telefono, PC di casa"></label>
  </section>
  <section class="panel"><h2>Catalogo</h2>
    <p style="margin-top:0;font-size:14px;color:var(--ink-2)">Il catalogo contiene ${Store.esercizi().filter(e=>e._origine!=='mio').length} esercizi. Ne hai modificati ${mod.length}${nasc.length?' e nascosti '+nasc.length:''}.</p>
    ${nasc.length?`<div class="listed">${nasc.map(e=>`<div class="li-ed"><span>${esc(e.titolo)}</span><button type="button" class="btn sm" data-a="rimetti" data-id="${esc(e.id)}">Rimetti</button></div>`).join('')}</div>`:''}
  </section>
  <section class="panel"><h2>App</h2>
    <p style="margin-top:0;font-size:14px;color:var(--ink-2)">VolleyFit, versione ${VERSIONE}. Funziona anche senza rete; per installarla sul telefono usa «Aggiungi a schermata Home» dal browser.</p>
    <div class="row"><button type="button" class="btn" data-a="aggiorna-app">${I('aggiorna',18)} Cerca aggiornamenti</button></div>
  </section>
  </div>`;
}
async function collegaSync(soloToken){
  const f=$('#sync-form'), msg=$('#sync-msg');
  const v=n=>(f.querySelector(`[name=${n}]`).value||'').trim();
  const c={owner:v('owner').replace(/^@/,''), repo:v('repo'), token:v('token')};
  if(!c.owner||!c.repo||!c.token){ toast('Compila nome utente, archivio e codice di accesso'); return; }
  Store.setMeta('syncUltimo',{owner:c.owner, repo:c.repo});
  const btn=$('[data-a="sync-collega"]'); btn.disabled=true; msg.textContent='Controllo l\'archivio…';
  try{
    const p=await Sync.probe(c);
    if(!p.privato && !(await conferma('L\'archivio è pubblico','Chiunque potrebbe leggere i tuoi esercizi. Ti consiglio di renderlo privato su GitHub (Settings → Danger Zone → Change visibility). Continuare lo stesso?','Continua'))){ msg.textContent=''; return; }
    let modo='unisci';
    if(p.esiste && !Store.vuoto() && !soloToken){
      const i=await scelta('Ci sono già dei dati online', `Nell'archivio ci sono già <b>${p.schede}</b> schede salvate da un altro dispositivo.`, [
        {t:'Unisci', d:'Tiene i dati di questo dispositivo e quelli online; per ogni scheda vince la più recente', ic:'scambio'},
        {t:'Usa solo i dati online', d:'Le modifiche fatte solo qui vengono sostituite', ic:'nuvola'}]);
      if(i<0){ msg.textContent=''; return; } modo = i===1?'online':'unisci';
    }
    await Sync.collega(c, modo);
    toast('Archivio collegato'); render();
  }catch(e){ msg.textContent=e.message||'Collegamento non riuscito'; }
  finally{ if(btn.isConnected) btn.disabled=false; }
}

/* ------------------------------------------------------------------ VISTA: guida */
function vistaGuida(){
  app.innerHTML = `<div class="cat-head"><h1 class="h1">Guida rapida</h1><a class="btn" href="#/archivio">${I('indietro',18)} Archivio</a></div>
  <div class="panel guida" style="max-width:820px">
    <h3>Cercare un esercizio</h3>
    <p>Nel catalogo scegli <b>Pallavolo</b> e tocca un fondamentale sul campo, oppure scegli <b>Corpo</b> e tocca un muscolo sulla sagoma. Puoi anche scegliere un <b>pacchetto</b> e usare i <b>filtri</b>: obiettivo, difficoltà da 1 a 5, quanti giocatori hai, durata e materiale. Tocca di nuovo un filtro per toglierlo.</p>
    <h3>La scheda dell'esercizio</h3>
    <p>L'animazione mostra l'esercizio dall'inizio alla fine e il passo in corso si colora nell'elenco. Tocca un passo per fermare l'animazione su quel momento. «Velocità» rallenta il movimento; il pulsante con le frecce apre lo schermo intero. Sotto trovi su cosa lavora l'esercizio, i punti di attenzione e gli errori più comuni con la correzione.</p>
    <h3>Creare o modificare un esercizio</h3>
    <ol><li>Premi <b>Nuovo</b> oppure, in una scheda, <b>Modifica</b>.</li>
    <li>Compila i dati: obiettivo, argomento, su cosa lavora, difficoltà, giocatori o serie e ripetizioni.</li>
    <li>Nell'animazione crea i <b>fotogrammi</b>: sono le posizioni chiave. L'app disegna il movimento tra un fotogramma e l'altro.
      <ul><li><b>Campo</b>: aggiungi atleti, palla e coni, poi trascinali. Aggiungi un fotogramma e sposta ciò che si muove.</li>
      <li><b>Omino</b>: per ogni fotogramma scegli una posa e, se serve, regolala con i cursori.</li></ul></li>
    <li>Scrivi i passi e collega ognuno al suo fotogramma, poi i punti di attenzione e gli errori con la correzione.</li>
    <li>Premi <b>Salva</b>. Se modifichi un esercizio del catalogo puoi sempre ripristinare l'originale.</li></ol>
    <h3>Pacchetti</h3>
    <p>Un pacchetto raccoglie esercizi su un tema. Ce ne sono già alcuni pronti; creane di nuovi da <b>Pacchetti</b>. Per aggiungere un esercizio a un pacchetto aprilo e premi <b>Pacchetti</b>.</p>
    <h3>Telefono, tablet e computer</h3>
    <p>Da <b>Archivio</b> collega l'archivio privato su GitHub con nome utente, nome dell'archivio e codice di accesso. Ripeti su ogni dispositivo con gli stessi dati. Senza rete l'app funziona lo stesso: le modifiche partono quando torna la connessione. GitHub conserva tutte le versioni.</p>
    <h3>Copie e Volleysched</h3>
    <p>Da <b>Archivio › Esporta</b> puoi salvare tutti gli esercizi, solo i tuoi o un pacchetto, oppure creare un file da importare in Volleysched. Con <b>Importa</b> carichi un file ricevuto da un altro allenatore o esportato da Volleysched.</p>
  </div>`;
}

/* ------------------------------------------------------------------ router */
function rotta(){ const h=(location.hash||'#/').slice(1); const [p, qs]=h.split('?'); const parti=p.split('/').filter(Boolean).map(decodeURIComponent); return {parti, qs:new URLSearchParams(qs||'')}; }
function evidenziaNav(n){ $$('[data-nav]').forEach(a=>{ if(a.dataset.nav===n) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); }); }
let ultimaVista='';
function render(){
  if(ui.player){ ui.player.destroy(); ui.player=null; }
  const {parti, qs}=rotta();
  const v=parti[0]||'';
  const scroll = (v===ultimaVista && (v===''||v==='pacchetti')) ? window.scrollY : 0;
  if(v!=='modifica' && v!=='nuovo'){ if(ui.editor){ ui.editor.distruggi && ui.editor.distruggi(); ui.editor=null; } }
  if(v==='es'){ evidenziaNav('catalogo'); vistaScheda(parti[1]); }
  else if(v==='modifica'){ evidenziaNav(''); if(!(ui.editor && ui.editorId===parti[1])){ vistaEditor(parti[1]); ui.editorId=parti[1]; } }
  else if(v==='nuovo'){ evidenziaNav('nuovo'); if(!(ui.editor && ui.editorId==='nuovo')){ vistaEditor(null, {obiettivo:qs.get('obiettivo')||null}); ui.editorId='nuovo'; } }
  else if(v==='pacchetti'){ evidenziaNav('pacchetti'); vistaPacchetti(); }
  else if(v==='pacchetto'){ evidenziaNav('pacchetti'); vistaPacchetto(parti[1]); }
  else if(v==='archivio'){ evidenziaNav('archivio'); vistaArchivio(); }
  else if(v==='guida'){ evidenziaNav('archivio'); vistaGuida(); }
  else { evidenziaNav('catalogo'); vistaCatalogo(); }
  if(v!=='modifica' && v!=='nuovo') ui.editorId=null;
  if(v!==ultimaVista || scroll===0) window.scrollTo(0, scroll);
  ultimaVista=v;
  const qt=$('#q-top'); if(qt && document.activeElement!==qt) qt.value=ui.q;
}
let hashPrima=location.hash;
window.addEventListener('hashchange', async ()=>{
  const prima=hashPrima; hashPrima=location.hash;
  if(ui.sporco && ui.editor && !location.hash.startsWith('#/modifica') && !location.hash.startsWith('#/nuovo')){
    if(!(await conferma('Uscire senza salvare?','Le modifiche all\'esercizio andranno perse.','Esci senza salvare',true))){ hashPrima=prima; history.replaceState(null,'',prima); return; }
    ui.sporco=false;
  }
  render(); app.focus({preventScroll:true});
});
window.addEventListener('beforeunload', e=>{ if(ui.sporco){ e.preventDefault(); e.returnValue=''; } });

/* ------------------------------------------------------------------ azioni */
function setF(k,v){ ui.f[k]=v; salvaUI(); render(); }
const azioni = {
  'pref': b=>{ const id=b.dataset.id; const on=!Store.preferito(id); Store.setPreferito(id,on); toast(on?'Aggiunto ai preferiti':'Tolto dai preferiti'); render(); },
  'pk': b=>{ const v=b.dataset.v||null; setF('pk', ui.f.pk===v?null:v); },
  'modo': b=>{ ui.modo=b.dataset.v; if(ui.modo==='corpo') ui.f.fond=null; else ui.f.musc=null; salvaUI(); render(); },
  'fond': b=>{ const v=b.dataset.v; ui.f.fond = ui.f.fond===v?null:v; if(ui.f.fond){ ui.f.ambito=null; if(ui.f.obiettivo==='Fisico'||ui.f.obiettivo==='Recupero') ui.f.obiettivo=null; } salvaUI(); render(); },
  'tattica': b=>{ const v=b.dataset.v; if(ui.f.obiettivo==='Tattica' && ui.f.ambito===v){ ui.f.obiettivo=null; ui.f.ambito=null; } else { ui.f.obiettivo='Tattica'; ui.f.ambito=v; ui.f.fond=null; } salvaUI(); render(); },
  'musc': b=>{ const v=b.dataset.v; setF('musc', ui.f.musc===v?null:v); },
  'f-obiettivo': b=>{ const v=b.dataset.v; ui.f.obiettivo = ui.f.obiettivo===v?null:v; ui.f.ambito=null; salvaUI(); render(); aggiornaModaleFiltri(); },
  'f-ambito': b=>{ const v=b.dataset.v; setF('ambito', ui.f.ambito===v?null:v); aggiornaModaleFiltri(); },
  'f-diff': b=>{ const n=+b.dataset.v; const d=ui.f.diff.slice(); const i=d.indexOf(n); if(i>=0) d.splice(i,1); else d.push(n); setF('diff', d); aggiornaModaleFiltri(); },
  'f-gioc': b=>{ setF('gioc', Math.max(0, Math.min(14, ui.f.gioc + (+b.dataset.v)))); aggiornaModaleFiltri(); },
  'f-durata': b=>{ setF('durata', +b.dataset.v); aggiornaModaleFiltri(); },
  'f-mat': b=>{ const v=b.dataset.v; const m=ui.f.mat.slice(); const i=m.indexOf(v); if(i>=0) m.splice(i,1); else m.push(v); setF('mat', m); aggiornaModaleFiltri(); },
  'f-pref': ()=>{ setF('pref', !ui.f.pref); aggiornaModaleFiltri(); },
  'f-miei': ()=>{ setF('miei', !ui.f.miei); aggiornaModaleFiltri(); },
  'ordine': b=>{ ui.ordine=b.dataset.v; salvaUI(); render(); aggiornaModaleFiltri(); },
  'f-pulisci': ()=>{ ui.f=Object.assign({}, F0, {diff:[], mat:[]}); ui.q=''; salvaUI(); render(); aggiornaModaleFiltri(); },
  'x-q': ()=>{ ui.q=''; salvaUI(); render(); }, 'x-pk': ()=>setF('pk',null), 'x-fond': ()=>setF('fond',null), 'x-musc': ()=>setF('musc',null),
  'x-obiettivo': ()=>{ ui.f.obiettivo=null; ui.f.ambito=null; salvaUI(); render(); }, 'x-ambito': ()=>setF('ambito',null), 'x-diff': ()=>setF('diff',[]),
  'x-gioc': ()=>setF('gioc',0), 'x-durata': ()=>setF('durata',0), 'x-mat': ()=>setF('mat',[]), 'x-pref': ()=>setF('pref',false), 'x-miei': ()=>setF('miei',false),
  'apri-filtri': ()=>{ modal('Filtri', `<div id="mf-corpo">${pannelloFiltri(true)}</div>`, `<button class="btn" data-a="f-pulisci" style="margin-right:auto">Pulisci</button><button class="btn primary" data-a="m-chiudi" id="mf-ok">Mostra ${filtra(Store.esercizi(), ui.f, ui.q).length} esercizi</button>`); },
  'play': ()=>{ if(ui.player) ui.player.toggle(); },
  'vel': b=>{ if(!ui.player) return; const v = ui.player.speed===1?0.5:(ui.player.speed===0.5?0.25:1); ui.player.setSpeed(v); b.textContent = v===1?'Velocità 1×':(v===0.5?'Lento 0,5×':'Molto lento 0,25×'); },
  'schermo': ()=>{ const s=$('#stage'); if(!s) return; if(document.fullscreenElement) document.exitFullscreen(); else if(s.requestFullscreen) s.requestFullscreen().catch(()=>toast('Schermo intero non disponibile su questo dispositivo')); else toast('Schermo intero non disponibile su questo dispositivo'); },
  'passo': b=>{ if(!ui.player) return; ui.player.pause(); ui.player.vai(+b.dataset.f); $$('#passi .passo').forEach(x=>x.removeAttribute('aria-current')); b.setAttribute('aria-current','step'); const s=$('#stage'); if(s && s.getBoundingClientRect().top<0) s.scrollIntoView({behavior:'smooth', block:'start'}); },
  'a-pacchetto': b=>finestraPacchetti(b.dataset.id),
  'altro-es': b=>altroEsercizio(b.dataset.id),
  'ed-salva': ()=>salvaEditor(),
  'ed-annulla': async ()=>{ if(ui.sporco && !(await conferma('Annullare le modifiche?','Le modifiche non salvate andranno perse.','Annulla le modifiche',true))) return; ui.sporco=false; const id=ui.editorId; ui.editor=null; ui.editorId=null; if(id && id!=='nuovo') location.hash='#/es/'+encodeURIComponent(id); else history.length>1?history.back():(location.hash='#/'); },
  'pk-nuovo': ()=>finestraPacchetto(null),
  'pk-modifica': b=>finestraPacchetto(b.dataset.id),
  'pk-esporta': b=>esportaPacchetto(b.dataset.id),
  'pk-filtra': b=>{ ui.f=Object.assign({}, F0, {diff:[], mat:[], pk:b.dataset.id}); ui.q=''; salvaUI(); location.hash='#/'; },
  'esporta': ()=>esporta(),
  'importa': ()=>importa(),
  'tema': b=>{ Store.setMeta('tema', b.dataset.v); applicaTema(); render(); },
  'rimetti': b=>{ Store.ripristinaEsercizio(b.dataset.id); toast('Esercizio rimesso nel catalogo'); render(); },
  'sync-collega': ()=>collegaSync(false),
  'sync-ora': ()=>Sync.run().then(()=>{ const st=Sync.stato(); toast(st.s==='ok'?'Sincronizzato':(st.msg||'Sincronizzazione non riuscita')); }),
  'sync-off': async ()=>{ if(await conferma('Scollegare questo dispositivo?','I dati restano qui, ma non verranno più sincronizzati con gli altri dispositivi.','Scollega',true)){ Sync.scollega(); render(); } },
  'sync-token': ()=>{ const c=Sync.config(); modal('Cambia codice di accesso', `<p style="margin:0;font-size:14px">Quando il codice scade, creane uno nuovo su GitHub con gli stessi permessi e scrivilo qui.</p><div id="sync-form" style="display:grid;gap:10px"><input type="hidden" name="owner" value="${esc(c.owner)}"><input type="hidden" name="repo" value="${esc(c.repo)}"><label class="f">Nuovo codice di accesso<input type="password" name="token" autocomplete="off" placeholder="github_pat_…"></label></div><span class="muted" id="sync-msg" style="font-size:13.5px"></span>`, `<button class="btn" data-a="m-chiudi">Annulla</button><button class="btn primary" data-a="sync-collega2">Salva</button>`); },
  'sync-collega2': async ()=>{ await collegaSync(true); $('#modal-root').innerHTML=''; },
  'aggiorna-app': ()=>{ if(navigator.serviceWorker && navigator.serviceWorker.getRegistration){ navigator.serviceWorker.getRegistration().then(r=>{ if(r){ r.update().then(()=>{ if(!r.waiting && !r.installing) toast('Hai già l\'ultima versione'); }); } else toast('Hai già l\'ultima versione'); }); } else toast('Hai già l\'ultima versione'); },
};
function aggiornaModaleFiltri(){
  const c=$('#mf-corpo'); if(c){ c.innerHTML=pannelloFiltri(true); const ok=$('#mf-ok'); if(ok) ok.textContent='Mostra '+filtra(Store.esercizi(), ui.f, ui.q).length+' esercizi'; }
}
document.addEventListener('click', e=>{
  const z=e.target.closest('.zona.clic');
  if(z){ azioni.musc({dataset:{v:z.dataset.m}}); return; }
  const b=e.target.closest('[data-a]'); if(!b) return;
  const f=azioni[b.dataset.a]; if(f){ e.preventDefault(); f(b, e); }
});
document.addEventListener('keydown', e=>{
  if((e.key==='Enter'||e.key===' ') && e.target.classList && e.target.classList.contains('clic')){ e.preventDefault(); azioni.musc({dataset:{v:e.target.dataset.m}}); }
  if(e.key==='ArrowRight' || e.key==='ArrowLeft'){
    if(/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||'')) return;
    if(!location.hash.startsWith('#/es/')) return;
    const a=$(e.key==='ArrowRight'?'a[rel=next]':'a[rel=prev]'); if(a) location.hash=a.getAttribute('href');
  }
  if(e.key==='/' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||'')){ const q=$('#q-top'); if(q && q.offsetParent){ e.preventDefault(); q.focus(); } }
});
document.addEventListener('change', e=>{
  if(e.target.id==='disp'){ Store.setMeta('dispositivo', e.target.value.trim()); toast('Nome salvato'); }
});
let qT=null;
$('#q-top').addEventListener('input', e=>{ ui.q=e.target.value; salvaUI(); clearTimeout(qT); qT=setTimeout(()=>{ if(!location.hash.startsWith('#/') || location.hash==='#/' || location.hash==='') render(); else location.hash='#/'; }, 180); });
$('#btn-cerca').addEventListener('click', ()=>{
  modal('Cerca', `<label class="f"><span class="vh">Cerca</span><input type="search" id="q-m" value="${esc(ui.q)}" placeholder="Esercizio, muscolo o fondamentale" autocomplete="off" enterkeyhint="search"></label><div id="q-ris" class="listed"></div>`, '', (m,c)=>{
    const inp=$('#q-m',m), out=$('#q-ris',m);
    const go=()=>{ const r=ordina(filtra(Store.esercizi(), Object.assign({},F0,{diff:[],mat:[]}), inp.value)).slice(0,30);
      out.innerHTML = inp.value.trim() ? (r.length?r.map(e=>`<a class="choice" href="#/es/${encodeURIComponent(e.id)}" style="text-decoration:none;color:inherit"><span><b>${esc(e.titolo)}</b><span>${esc(e.ambito||'')} · difficoltà ${+e.difficolta||'–'}</span></span></a>`).join(''):'<p class="muted">Nessun risultato.</p>') : '<p class="muted" style="margin:0">Scrivi per esempio «ricezione», «glutei», «elastico».</p>'; };
    inp.addEventListener('input', go); go();
    inp.addEventListener('keydown', ev=>{ if(ev.key==='Enter'){ ui.q=inp.value.trim(); salvaUI(); c(); location.hash='#/'; render(); } });
    out.addEventListener('click', ev=>{ if(ev.target.closest('a')) c(); });
  });
});
$('#syncpill').addEventListener('click', ()=>{ location.hash='#/archivio'; });

/* ------------------------------------------------------------------ sincronizzazione: stato */
function aggiornaPill(st){
  const p=$('#syncpill'); if(!p) return;
  if(st.s==='off'){ p.hidden=true; return; }
  p.hidden=false; p.className='syncpill '+st.s;
  const L={ok:'Sincronizzato', pending:'Da inviare', busy:'Sincronizzo…', offline:'Offline', err:'Errore'};
  p.querySelector('span').textContent=L[st.s]||''; p.title=st.msg||L[st.s]||'';
  const box=$('#sync-stato'); if(box) box.innerHTML=statoSyncHTML();
}
Sync.ascolta(aggiornaPill);

/* ------------------------------------------------------------------ avvio */
Store.carica();
Store.ascolta((cosa, locale)=>{ if(locale) Sync.presto(); else if(!ui.editor) render(); const err=Store.errore(); if(err) toast(err); });
applicaTema();
render();
Sync.avvia();
// assegna un nome al dispositivo se manca
if(!Store.meta('dispositivo')){ const ua=navigator.userAgent; Store.setMeta('dispositivo', /iPhone/.test(ua)?'iPhone':/iPad/.test(ua)?'iPad':/Android/.test(ua)?(/Mobile/.test(ua)?'Telefono Android':'Tablet Android'):/Mac/.test(ua)?'Mac':/Windows/.test(ua)?'PC Windows':'Dispositivo'); }
let rT=null; let largo=matchMedia('(min-width:1000px)').matches;
window.addEventListener('resize', ()=>{ clearTimeout(rT); rT=setTimeout(()=>{ const l=matchMedia('(min-width:1000px)').matches; if(l!==largo){ largo=l; const v=rotta().parti[0]||''; if(v===''||v==='pacchetti') render(); } }, 200); });

/* service worker e aggiornamenti */
if('serviceWorker' in navigator && location.protocol!=='file:'){
  navigator.serviceWorker.register('sw.js').then(reg=>{
    const mostra=()=>{ if($('.aggiorna')) return; const d=document.createElement('div'); d.className='aggiorna'; d.setAttribute('role','status');
      d.innerHTML=`<span style="flex:1">È disponibile una nuova versione dell'app.</span><button class="btn sm">Aggiorna</button>`;
      d.querySelector('button').onclick=()=>{ if(ui.sporco){ toast('Salva prima l\'esercizio'); return; } reg.waiting && reg.waiting.postMessage('aggiorna'); };
      document.body.appendChild(d); };
    if(reg.waiting) mostra();
    reg.addEventListener('updatefound', ()=>{ const w=reg.installing; w && w.addEventListener('statechange', ()=>{ if(w.state==='installed' && navigator.serviceWorker.controller) mostra(); }); });
  }).catch(()=>{});
  let ric=false; navigator.serviceWorker.addEventListener('controllerchange', ()=>{ if(ric) return; ric=true; location.reload(); });
}
window.VSEApp = { render, ui, toast };
})();

/* VolleyFit – editor degli esercizi */
(function(){
'use strict';
const $ = (s,r) => (r||document).querySelector(s);
const $$ = (s,r) => Array.from((r||document).querySelectorAll(s));
const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I = (n,s,x) => VSE.icona(n,s,x);
const clona = o => JSON.parse(JSON.stringify(o));
let seq = 0; const nid = p => p+(++seq)+Math.random().toString(36).slice(2,5);

function animDefault(tipo, vista){
  if(tipo==='corpo') return {tipo:'corpo', vista:vista||'lato', ancora:'anN', fotogrammi: vista==='fronte' ? [{posa:'f_in_piedi', pausa:0.6},{posa:'f_braccia_largo', dur:1.2, pausa:0.6}] : [{posa:'in_piedi', pausa:0.6},{posa:'squat', dur:1.3, pausa:0.6}], attrezzi:[]};
  return {tipo:'campo', vista:'intero', zone:false,
    elementi:[{id:'a1',tipo:'atleta',squadra:'A',etichetta:'1'},{id:'a2',tipo:'atleta',squadra:'A',etichetta:'2'},{id:'pa',tipo:'palla'}],
    fotogrammi:[{pos:{a1:[3,4.5], a2:[7,4.5], pa:[3.5,4.3]}, pausa:0.5},{pos:{pa:[6.6,4.3]}, dur:1.2, pausa:0.6}]};
}
function chiaveAttrezzo(a){
  if(a.k) return a.k;
  if(a.tipo==='elastico'){
    const v=[a.da,a.a].map(x=>Array.isArray(x)?'fisso':x).sort().join('-');
    if(v==='knF-knN') return 'elastico-ginocchia'; if(v==='anF-anN') return 'elastico-caviglie';
    if(v.includes('fisso')) return 'elastico-muro'; return 'elastico-piedi-mani';
  }
  if(a.tipo==='muro') return (a.x>100)?'muro-davanti':'muro-dietro';
  return a.tipo;
}
function evidenziaDa(muscoli){
  const s=new Set(); for(const m of (muscoli||[])) for(const g of (VSE.MUSCOLO_SEGMENTI[m]||[])) s.add(g); return [...s];
}
function nuovo(preset){
  const ob = preset.obiettivo && VSE.AMBITI[preset.obiettivo] ? preset.obiettivo : 'Tecnica';
  const fis = ob==='Fisico'||ob==='Recupero';
  return {id:null, titolo:'', obiettivo:ob, ambito:VSE.AMBITI[ob][0], descrizione:'', serveA:'', prepara:'',
    lavora:{fondamentali: fis?[]:[VSE.AMBITI[ob][0]].filter(a=>VSE.FONDAMENTALI.includes(a)), muscoli:[]},
    difficolta:2, giocatori: fis?[1,1]:[2,4], durata: fis?5:10,
    dose: fis?{serie:3, ripetizioni:10, tempo:'', recupero:60, lato:false}:{},
    materiale: fis?['Corpo libero']:['Palloni'], materialeNote:'', pacchetti:[],
    passi:[{titolo:'',testo:'',f:0},{titolo:'',testo:'',f:1}], attenzione:[''], errori:[{errore:'',correzione:''}], varianti:{facile:'',difficile:''}, note:'', tags:[],
    anim: animDefault(fis?'corpo':'campo')};
}

/* ------------------------------------------------------------------ montaggio */
function monta(root, rec, opts){
  const R = clona(rec);
  R.lavora = R.lavora||{fondamentali:[], muscoli:[]}; R.lavora.fondamentali=R.lavora.fondamentali||[]; R.lavora.muscoli=R.lavora.muscoli||[];
  R.passi=R.passi||[]; R.attenzione=R.attenzione||[]; R.errori=(R.errori||[]).map(x=>Array.isArray(x)?{errore:x[0],correzione:x[1]}:x); R.varianti=R.varianti||{}; R.dose=R.dose||{}; R.giocatori=R.giocatori||[]; R.materiale=R.materiale||[]; R.pacchetti=R.pacchetti||[]; R.tags=R.tags||[];
  if(!R.anim || !(R.anim.fotogrammi||[]).length) R.anim = animDefault((R.obiettivo==='Fisico'||R.obiettivo==='Recupero')?'corpo':'campo');
  const st = {frame:0, sel:null, tool:'sposta', prova:null, drag:null};
  const cambiato = () => opts.onChange && opts.onChange(R);

  root.innerHTML = `<div class="ed2">
    <div class="ed-col">
      <section class="panel" data-ord="2" id="p-anim"></section>
      <section class="panel" data-ord="3" id="p-passi"></section>
    </div>
    <div class="ed-col">
      <section class="panel" data-ord="1" id="p-dati"></section>
      <section class="panel" data-ord="4" id="p-att"></section>
      <section class="panel" data-ord="5" id="p-err"></section>
      <section class="panel" data-ord="6" id="p-var"></section>
    </div></div>`;
  if(!document.getElementById('ed2-css')){
    const css=document.createElement('style'); css.id='ed2-css';
    css.textContent=`.ed2{display:flex;flex-direction:column;gap:14px}.ed2 .ed-col{display:contents}.ed2 .panel{margin:0!important}
      .ed2 [data-ord="1"]{order:1}.ed2 [data-ord="2"]{order:2}.ed2 [data-ord="3"]{order:3}.ed2 [data-ord="4"]{order:4}.ed2 [data-ord="5"]{order:5}.ed2 [data-ord="6"]{order:6}
      @media (min-width:1000px){.ed2{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);align-items:start}.ed2 .ed-col{display:flex;flex-direction:column;gap:14px}}
      .ed2 .sub{font-size:13px;font-weight:600;color:var(--ink-2);margin:12px 0 6px}
      .ed2 .mini-sag{display:grid;grid-template-columns:repeat(2,minmax(0,110px));gap:8px}
      .ed2 .mini-sag svg{width:100%;height:auto}
      .ed2 .num{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px}
      .ed2 details.reg summary{cursor:pointer;font-weight:600;min-height:44px;display:flex;align-items:center}
      .ed2 .frame-ops{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
      .ed2 .ed-stage{position:relative}
      .ed2 .ed-stage .hint{position:absolute;left:8px;bottom:8px;font-size:12px;background:rgba(0,0,0,.55);color:#fff;border-radius:8px;padding:3px 8px;pointer-events:none}`;
    document.head.appendChild(css);
  }

  /* ---------------- dati principali */
  function dati(){
    const p=$('#p-dati',root);
    const fis = R.obiettivo==='Fisico'||R.obiettivo==='Recupero';
    const pks = Store.pacchetti();
    p.innerHTML = `<h2>Dati principali</h2>
      <div style="display:flex;flex-direction:column;gap:12px">
      <label class="f">Titolo *<input type="text" name="titolo" value="${esc(R.titolo)}" placeholder="Es. Ricezione a coppie su battuta" maxlength="90"></label>
      <label class="f">Descrizione breve<textarea name="descrizione" rows="2" placeholder="In una o due frasi: cosa si fa e come è organizzato">${esc(R.descrizione)}</textarea></label>
      <div><div class="sub">Obiettivo</div><div class="seg" role="group" aria-label="Obiettivo">${VSE.OBIETTIVI.map(o=>`<button type="button" data-e="obiettivo" data-v="${o.id}" aria-pressed="${R.obiettivo===o.id}">${esc(o.id==='Fisico'?'Fisico':o.id==='Tattica'?'Gioco':o.nome)}</button>`).join('')}</div></div>
      <div><div class="sub">${R.obiettivo==='Tecnica'?'Fondamentale principale':R.obiettivo==='Tattica'?'Situazione di gioco':'Parte del corpo'}</div><div class="chips">${VSE.AMBITI[R.obiettivo].map(a=>`<button type="button" class="chip" data-e="ambito" data-v="${esc(a)}" aria-pressed="${R.ambito===a}">${esc(a)}</button>`).join('')}</div></div>
      <div><div class="sub">Su cosa lavora: fondamentali</div><div class="chips">${VSE.FONDAMENTALI.map(a=>`<button type="button" class="chip" data-e="fond" data-v="${esc(a)}" aria-pressed="${R.lavora.fondamentali.includes(a)}">${esc(a)}</button>`).join('')}</div></div>
      <div><div class="sub">Su cosa lavora: muscoli <span class="muted" style="font-weight:400">(tocca la sagoma; il primo che scegli è il principale)</span></div>
        <div class="row" style="align-items:flex-start;gap:14px">
          <div class="mini-sag">${VSE.sagoma('fronte', R.lavora.muscoli.slice(0,1), R.lavora.muscoli, {cliccabile:true, attrs:'data-sag="1" role="group" aria-label="Sagoma davanti"'})}${VSE.sagoma('dietro', R.lavora.muscoli.slice(0,1), R.lavora.muscoli, {cliccabile:true, attrs:'data-sag="1" role="group" aria-label="Sagoma dietro"'})}</div>
          <div class="chips" style="flex:1;min-width:180px">${VSE.MUSCOLI.map(m=>`<button type="button" class="chip" data-e="musc" data-v="${m.id}" aria-pressed="${R.lavora.muscoli.includes(m.id)}">${R.lavora.muscoli[0]===m.id?'★ ':''}${esc(m.nome)}</button>`).join('')}</div>
        </div></div>
      <label class="f">A cosa serve<input type="text" name="serveA" value="${esc(R.serveA)}" placeholder="Es. spinta nel salto a muro, stabilità del ginocchio"></label>
      <label class="f">Prepara a <span class="muted" style="font-weight:400">(solo per gli esercizi propedeutici)</span><input type="text" name="prepara" value="${esc(R.prepara||'')}" placeholder="Es. palleggio: posizione delle mani"></label>
      <div><div class="sub">Difficoltà</div><div class="seg" role="group" aria-label="Difficoltà">${[1,2,3,4,5].map(n=>`<button type="button" data-e="diff" data-v="${n}" aria-pressed="${+R.difficolta===n}">${n}</button>`).join('')}</div></div>
      <div class="num">
        <label class="f">Giocatori da<input type="number" name="g0" min="1" max="24" value="${esc(R.giocatori[0]||'')}"></label>
        <label class="f">a<input type="number" name="g1" min="1" max="24" value="${esc(R.giocatori[1]||'')}"></label>
        <label class="f">Durata (minuti)<input type="number" name="durata" min="0" max="120" value="${esc(R.durata||'')}"></label>
      </div>
      <div><div class="sub">Quantità ${fis?'':'<span class="muted" style="font-weight:400">(facoltativa)</span>'}</div><div class="num">
        <label class="f">Serie<input type="number" name="serie" min="0" max="20" value="${esc(R.dose.serie||'')}"></label>
        <label class="f">Ripetizioni<input type="number" name="ripetizioni" min="0" max="200" value="${esc(R.dose.ripetizioni||'')}"></label>
        <label class="f">oppure secondi<input type="number" name="tempo" min="0" max="600" value="${esc(R.dose.tempo||'')}"></label>
        <label class="f">Recupero (s)<input type="number" name="recupero" min="0" max="600" value="${esc(R.dose.recupero||'')}"></label>
      </div><label class="check" style="margin-top:4px"><input type="checkbox" name="lato" ${R.dose.lato?'checked':''}> Per lato (da ripetere con l'altra gamba o l'altro braccio)</label></div>
      <div><div class="sub">Materiale</div><div class="chips">${VSE.MATERIALI.map(m=>`<button type="button" class="chip" data-e="mat" data-v="${esc(m)}" aria-pressed="${R.materiale.includes(m)}">${esc(m)}</button>`).join('')}</div>
        <label class="f" style="margin-top:8px">Dettagli sul materiale<input type="text" name="materialeNote" value="${esc(R.materialeNote||'')}" placeholder="Es. 6 palloni, 2 coni"></label></div>
      <div><div class="sub">Pacchetti</div>${pks.map(k=>`<label class="check"><input type="checkbox" data-e="pk" value="${esc(k.id)}" ${R.pacchetti.includes(k.id)?'checked':''}><span style="width:12px;height:12px;border-radius:4px;background:${esc(k.colore||'#999')};display:inline-block"></span>${esc(k.nome)}</label>`).join('')}</div>
      <label class="f">Parole chiave per la ricerca<input type="text" name="tags" value="${esc(R.tags.join(', '))}" placeholder="separate da virgola, es. float, zona 5"></label>
      </div>`;
  }

  /* ---------------- animazione */
  function anim(){
    const p=$('#p-anim',root);
    if(st.prova){ st.prova.destroy(); st.prova=null; }
    const A=R.anim, n=A.fotogrammi.length;
    if(st.frame>=n) st.frame=n-1;
    const campo = A.tipo==='campo';
    const F = A.fotogrammi[st.frame]||{};
    let corpo='';
    if(campo){
      const els=A.elementi||[]; const sel=els.find(e=>e.id===st.sel);
      corpo = `
      <div class="row" style="margin-bottom:10px"><div class="seg" role="group" aria-label="Vista del campo" style="flex:1;min-width:220px">
        <button type="button" data-e="cvista" data-v="intero" aria-pressed="${A.vista!=='meta'}">Campo intero</button>
        <button type="button" data-e="cvista" data-v="meta" aria-pressed="${A.vista==='meta'}">Metà campo</button></div>
        <label class="check"><input type="checkbox" data-e="zone" ${A.zone?'checked':''}> Numeri delle zone</label></div>
      <div class="tools" role="group" aria-label="Strumenti" style="margin-bottom:8px">
        ${[['sposta','Sposta',''],['atleta-A','+ Atleta',''],['atleta-B','+ Avversario',''],['allenatore','+ Allenatore',''],['palla','+ Palla',''],['cono','+ Cono',''],['bersaglio','+ Bersaglio',''],['carrello','+ Carrello','']].map(([k,t])=>`<button type="button" class="tool" data-e="tool" data-v="${k}" aria-pressed="${st.tool===k}">${t}</button>`).join('')}
      </div>
      <div class="ed-stage campo" id="ed-stage">${VSA.svg(A, st.frame, {selezionato:st.sel, attrs:'role="img" aria-label="Campo del fotogramma '+(st.frame+1)+'"'})}<span class="hint">${st.tool==='sposta'?'Trascina atleti e palla nel fotogramma '+(st.frame+1):'Tocca il campo per aggiungere'}</span></div>
      ${sel?`<div class="row" style="margin-top:10px;background:var(--surface-2);border-radius:12px;padding:8px 10px">
        <b style="font-size:14px">${sel.tipo==='atleta'?(sel.squadra==='B'?'Avversario':'Atleta'):sel.tipo==='allenatore'?'Allenatore':sel.tipo==='palla'?'Palla':sel.tipo==='cono'?'Cono':sel.tipo==='bersaglio'?'Bersaglio':'Carrello'}</b>
        ${(sel.tipo==='atleta'||sel.tipo==='allenatore')?`<label class="f" style="flex-direction:row;align-items:center;gap:6px">Sigla<input type="text" data-e="etichetta" value="${esc(sel.etichetta||'')}" maxlength="3" style="width:72px"></label>`:''}
        ${sel.tipo==='atleta'?`<div class="seg" role="group" aria-label="Squadra"><button type="button" data-e="squadra" data-v="A" aria-pressed="${sel.squadra!=='B'}">Nostra</button><button type="button" data-e="squadra" data-v="B" aria-pressed="${sel.squadra==='B'}">Avversaria</button></div>`:''}
        <button type="button" class="btn sm danger" data-e="del-el" style="margin-left:auto">${I('cestino',16)} Togli</button></div>`:''}`;
    } else {
      const vista=A.vista||'lato';
      const pose=Object.entries(window.VSE_POSE).filter(([k,v])=>v.vista===vista);
      const P=VSA.posaDi(F);
      const sl=(lab, path, min, max, step)=>{ const v=path.length>1?P[path[0]][path[1]]:P[path[0]]; return `<label class="slider"><span>${lab}</span><input type="range" min="${min}" max="${max}" step="${step||1}" value="${Math.round(v*100)/100}" data-e="sl" data-k="${path.join('.')}"><output>${Math.round(v*10)/10}</output></label>`; };
      const att=A.attrezzi||[]; const ha=t=>att.some(a=>chiaveAttrezzo(a)===t);
      corpo = `
      <div class="row" style="margin-bottom:10px">
        <div class="seg" role="group" aria-label="Vista" style="flex:1;min-width:200px"><button type="button" data-e="ovista" data-v="lato" aria-pressed="${vista==='lato'}">Di lato</button><button type="button" data-e="ovista" data-v="fronte" aria-pressed="${vista==='fronte'}">Di fronte</button></div>
        <label class="f" style="flex-direction:row;align-items:center;gap:8px;font-weight:600">Tieni fermi<select data-e="ancora" class="inp" style="width:auto"><option value="">nessuno</option><option value="anN" ${A.ancora==='anN'?'selected':''}>i piedi</option><option value="haN" ${A.ancora==='haN'?'selected':''}>le mani</option><option value="hip" ${A.ancora==='hip'?'selected':''}>il bacino</option></select></label>
      </div>
      <div class="ed-stage" id="ed-stage">${VSA.svg(A, st.frame, {attrs:'role="img" aria-label="Posa del fotogramma '+(st.frame+1)+'"'})}</div>
      <label class="f" style="margin-top:10px">Posa del fotogramma ${st.frame+1}<select data-e="posa" class="inp"><option value="">— posa personalizzata —</option>${pose.map(([k,v])=>`<option value="${k}" ${F.posa===k?'selected':''}>${esc(v.nome)}</option>`).join('')}</select></label>
      <details class="reg" ${st.regOpen?'open':''}><summary>Regola la posa</summary><div style="display:flex;flex-direction:column;gap:6px">
        ${sl('Busto',['t'],-130,130)}${sl('Testa',['h'],-70,70)}
        ${sl('Braccio vicino: spalla',['aN',0],-180,190)}${sl('Braccio vicino: gomito',['aN',1],-60,175)}
        ${sl('Braccio lontano: spalla',['aF',0],-180,190)}${sl('Braccio lontano: gomito',['aF',1],-60,175)}
        ${sl('Gamba vicina: anca',['lN',0],-130,185)}${sl('Gamba vicina: ginocchio',['lN',1],0,165)}${sl('Gamba vicina: piede',['lN',2],-180,90)}
        ${sl('Gamba lontana: anca',['lF',0],-130,185)}${sl('Gamba lontana: ginocchio',['lF',1],0,165)}${sl('Gamba lontana: piede',['lF',2],-180,90)}
        ${sl('Avanti / indietro',['x'],30,170)}${sl('Salto',['z'],0,60)}${vista==='fronte'?sl('Piegamento',['q'],0,1,0.05):''}
        <p class="muted" style="font-size:12.5px;margin:0">«Vicino» è l'arto scuro, «lontano» quello chiaro. Gli angoli sono in gradi.</p>
      </div></details>
      <div class="sub">Attrezzi</div>
      <div class="chips">
        ${[['tappetino','Tappetino'],['elastico-ginocchia','Elastico alle ginocchia'],['elastico-caviglie','Elastico alle caviglie'],['elastico-piedi-mani','Elastico piedi–mani'],['elastico-muro','Elastico al muro'],['palla','Palla in mano'],['muro-dietro','Muro dietro'],['muro-davanti','Muro davanti'],['sedia','Sedia'],['gradino','Gradino']].map(([k,t])=>`<button type="button" class="chip" data-e="attr" data-v="${k}" aria-pressed="${ha(k)}">${t}</button>`).join('')}
      </div>
      <p class="muted" style="font-size:12.5px;margin:8px 0 0">Le parti del corpo lavorate si colorano da sole in base ai muscoli scelti nei dati principali.</p>`;
    }
    p.innerHTML = `<div class="row" style="justify-content:space-between;margin-bottom:10px"><h2 style="margin:0">Animazione</h2>
        <div class="seg" role="group" aria-label="Tipo di animazione"><button type="button" data-e="atipo" data-v="campo" aria-pressed="${campo}">Campo</button><button type="button" data-e="atipo" data-v="corpo" aria-pressed="${!campo}">Omino</button></div></div>
      ${corpo}
      <div class="sub">Fotogrammi <span class="muted" style="font-weight:400">— l'app crea il movimento da un fotogramma all'altro</span></div>
      <div class="frames" role="group" aria-label="Fotogrammi">${A.fotogrammi.map((f,i)=>`<button type="button" class="frame" data-e="frame" data-v="${i}" aria-pressed="${i===st.frame}" aria-label="Fotogramma ${i+1}">${VSA.svg(A,i,{mini:true,fantasma:false})}${i+1}</button>`).join('')}<button type="button" class="frame add" data-e="f-add" aria-label="Aggiungi fotogramma">${I('piu',22)}<span>Aggiungi</span></button></div>
      <div class="frame-ops" style="margin-top:8px">
        <button type="button" class="btn sm" data-e="f-sx" ${st.frame===0?'disabled':''} aria-label="Sposta a sinistra">${I('indietro',16)}</button>
        <button type="button" class="btn sm" data-e="f-dx" ${st.frame>=n-1?'disabled':''} aria-label="Sposta a destra">${I('avanti',16)}</button>
        <button type="button" class="btn sm" data-e="f-dup">${I('copia',16)} Duplica</button>
        <button type="button" class="btn sm danger" data-e="f-del" ${n<=1?'disabled':''}>${I('cestino',16)} Elimina</button>
        <button type="button" class="btn sm accent" data-e="prova" style="margin-left:auto">${I('play',14)} Prova l'animazione</button>
      </div>
      <div class="num" style="margin-top:10px">
        ${st.frame>0?`<label class="f">Arriva in (s)<input type="number" step="0.1" min="0.1" max="10" data-e="fdur" value="${esc(F.dur!=null?F.dur:(campo?1.4:1.1))}"></label>`:`<label class="f">Ritorno all'inizio (s)<input type="number" step="0.1" min="0" max="10" data-e="frit" value="${esc(F.ritorno!=null?F.ritorno:(campo?1.4:1.1))}"></label>`}
        <label class="f">Si ferma per (s)<input type="number" step="0.1" min="0" max="10" data-e="fpausa" value="${esc(F.pausa!=null?F.pausa:0.5)}"></label>
        ${campo && st.frame>0?`<label class="f">Altezza palla<select data-e="farco" class="inp"><option value="">automatica</option><option value="0.3" ${F.arco==0.3?'selected':''}>tesa</option><option value="1.5" ${F.arco==1.5?'selected':''}>media</option><option value="3" ${F.arco==3?'selected':''}>alta</option><option value="4.5" ${F.arco==4.5?'selected':''}>altissima</option></select></label>`:''}
        <label class="f">Anteprima nel catalogo<select data-e="copertina" class="inp"><option value="">automatica</option>${A.fotogrammi.map((f,i)=>`<option value="${i}" ${A.copertina===i?'selected':''}>fotogramma ${i+1}</option>`).join('')}</select></label>
      </div>`;
    if(campo) agganciaCampo();
  }

  /* trascinamento sul campo */
  function agganciaCampo(){
    const stage=$('#ed-stage',root); if(!stage) return;
    const A=R.anim; const B=VSA.campoBox(A.vista||'intero'); const S=40;
    const toM = ev => { const svg=stage.querySelector('svg'); const pt=svg.createSVGPoint(); pt.x=ev.clientX; pt.y=ev.clientY; const p=pt.matrixTransform(svg.getScreenCTM().inverse()); return [Math.round((p.x/S + B.x0)*10)/10, Math.round((p.y/S + B.y0)*10)/10]; };
    const limita = m => [Math.max(B.x0+0.3, Math.min(B.x1-0.3, m[0])), Math.max(B.y0+0.3, Math.min(B.y1-0.3, m[1]))];
    stage.onpointerdown = ev => {
      if(st.prova) return;
      const g=ev.target.closest('[data-el]');
      if(st.tool!=='sposta'){
        const m=limita(toM(ev)); const t=st.tool;
        const el={id:nid('e'), tipo: t.startsWith('atleta')?'atleta':t, squadra: t==='atleta-B'?'B':'A'};
        if(el.tipo==='atleta'){ const n=(A.elementi||[]).filter(e=>e.tipo==='atleta' && e.squadra===el.squadra).length+1; el.etichetta = el.squadra==='B'?'B'+(n>1?n:''):String(n); }
        if(el.tipo==='allenatore') el.etichetta='All';
        A.elementi=(A.elementi||[]).concat([el]);
        A.fotogrammi[0].pos=A.fotogrammi[0].pos||{}; A.fotogrammi[0].pos[el.id]=m;
        if(st.frame>0){ A.fotogrammi[st.frame].pos=A.fotogrammi[st.frame].pos||{}; A.fotogrammi[st.frame].pos[el.id]=m; }
        st.sel=el.id; st.tool='sposta'; cambiato(); anim(); return;
      }
      if(!g){ if(st.sel){ st.sel=null; anim(); } return; }
      ev.preventDefault();
      st.sel=g.dataset.el; st.drag={id:st.sel, moved:false};
      stage.setPointerCapture && stage.setPointerCapture(ev.pointerId);
      ridisegnaStage();
    };
    stage.onpointermove = ev => {
      if(!st.drag) return;
      const m=limita(toM(ev)); const f=A.fotogrammi[st.frame]; f.pos=f.pos||{}; f.pos[st.drag.id]=m; st.drag.moved=true; ridisegnaStage();
    };
    stage.onpointerup = stage.onpointercancel = () => { if(st.drag){ const mv=st.drag.moved; st.drag=null; if(mv){ cambiato(); } anim(); } };
  }
  function ridisegnaStage(){
    const s=$('#ed-stage svg',root); if(!s) return;
    const tmp=document.createElement('div'); tmp.innerHTML=VSA.svg(R.anim, st.frame, {selezionato:st.sel, attrs:'role="img"'});
    s.replaceWith(tmp.firstElementChild);
  }

  /* ---------------- passi */
  function passi(){
    const p=$('#p-passi',root); const n=R.anim.fotogrammi.length;
    p.innerHTML = `<h2>Passo per passo</h2><p class="muted" style="font-size:13px;margin:-4px 0 10px">Collega ogni passo al fotogramma che lo mostra: nella scheda il passo si colora quando l'animazione arriva lì.</p>
      <div class="listed">${R.passi.map((s,i)=>`<div class="li-ed"><div style="display:flex;flex-direction:column;gap:8px">
          <div class="row"><b style="width:26px">${i+1}.</b><input class="inp" style="flex:1;min-width:140px" type="text" data-e="ps-t" data-i="${i}" value="${esc(s.titolo||'')}" placeholder="Titolo breve, es. Posizione"><select class="inp" style="width:auto" data-e="ps-f" data-i="${i}" aria-label="Fotogramma del passo ${i+1}">${Array.from({length:n},(_,k)=>`<option value="${k}" ${(s.f!=null?+s.f:Math.min(i+1,n-1))===k?'selected':''}>Fotogramma ${k+1}</option>`).join('')}</select></div>
          <textarea class="inp" rows="2" data-e="ps-x" data-i="${i}" placeholder="Cosa si fa in questo passo">${esc(s.testo||'')}</textarea></div>
        <div class="ops"><button type="button" class="icon-btn" data-e="ps-su" data-i="${i}" aria-label="Sposta su" ${i===0?'disabled':''}>${I('su',16)}</button><button type="button" class="icon-btn" data-e="ps-giu" data-i="${i}" aria-label="Sposta giù" ${i===R.passi.length-1?'disabled':''}>${I('giu',16)}</button><button type="button" class="icon-btn" data-e="ps-del" data-i="${i}" aria-label="Elimina passo">${I('cestino',16)}</button></div></div>`).join('')}</div>
      <button type="button" class="btn sm" data-e="ps-add" style="margin-top:10px">${I('piu',16)} Aggiungi passo</button>`;
  }
  function lista(id, campo, titolo, ph, sub){
    const p=$('#'+id,root);
    p.innerHTML = `<h2>${titolo}</h2>${sub?`<p class="muted" style="font-size:13px;margin:-4px 0 10px">${sub}</p>`:''}<div class="listed">${R[campo].map((s,i)=>`<div class="li-ed"><textarea class="inp" rows="2" data-e="l-x" data-c="${campo}" data-i="${i}" placeholder="${esc(ph)}">${esc(s)}</textarea><div class="ops"><button type="button" class="icon-btn" data-e="l-del" data-c="${campo}" data-i="${i}" aria-label="Elimina">${I('cestino',16)}</button></div></div>`).join('')}</div>
      <button type="button" class="btn sm" data-e="l-add" data-c="${campo}" style="margin-top:10px">${I('piu',16)} Aggiungi</button>`;
  }
  function errori(){
    const p=$('#p-err',root);
    p.innerHTML = `<h2>Errori e correzioni</h2><p class="muted" style="font-size:13px;margin:-4px 0 10px">L'errore che vedi in campo e cosa dire all'atleta per correggerlo.</p>
      <div class="listed">${R.errori.map((x,i)=>`<div class="li-ed"><div style="display:flex;flex-direction:column;gap:8px">
        <input class="inp" type="text" data-e="er-e" data-i="${i}" value="${esc(x.errore||'')}" placeholder="Errore, es. Le ginocchia cadono verso l'interno">
        <textarea class="inp" rows="2" data-e="er-c" data-i="${i}" placeholder="Correzione, es. Spingi le ginocchia verso l'esterno">${esc(x.correzione||'')}</textarea></div>
        <div class="ops"><button type="button" class="icon-btn" data-e="er-del" data-i="${i}" aria-label="Elimina">${I('cestino',16)}</button></div></div>`).join('')}</div>
      <button type="button" class="btn sm" data-e="er-add" style="margin-top:10px">${I('piu',16)} Aggiungi errore</button>`;
  }
  function varianti(){
    const p=$('#p-var',root);
    p.innerHTML = `<h2>Varianti e note</h2><div style="display:flex;flex-direction:column;gap:10px">
      <label class="f">Più facile<textarea rows="2" name="vfacile" placeholder="Come semplificare">${esc(R.varianti.facile||'')}</textarea></label>
      <label class="f">Più difficile<textarea rows="2" name="vdifficile" placeholder="Come rendere più impegnativo">${esc(R.varianti.difficile||'')}</textarea></label>
      <label class="f">Note<textarea rows="3" name="note" placeholder="Altre osservazioni">${esc(R.note||'')}</textarea></label></div>`;
  }
  function tutto(){ dati(); anim(); passi(); lista('p-att','attenzione','Punti di attenzione','Es. Fermati prima del contatto con la palla','Le cose su cui insistere per fare bene l\'esercizio.'); errori(); varianti(); }
  tutto();

  /* ---------------- eventi */
  const toggle = (arr, v) => { const i=arr.indexOf(v); if(i>=0) arr.splice(i,1); else arr.push(v); };
  function aggiornaEvidenzia(){ if(R.anim.tipo==='corpo') R.anim.evidenzia = evidenziaDa(R.lavora.muscoli); }
  function attrezzo(k){
    const A=R.anim; A.attrezzi=A.attrezzi||[];
    const tolti=A.attrezzi.filter(a=>chiaveAttrezzo(a)===k);
    if(tolti.length){ A.attrezzi=A.attrezzi.filter(a=>chiaveAttrezzo(a)!==k); if(k==='elastico-muro') A.attrezzi=A.attrezzi.filter(a=>chiaveAttrezzo(a)!=='muro-davanti'); return; }
    const J=VSA.fk(VSA.posaDi(A.fotogrammi[0]), A.vista||'lato');
    const hip=J.hip;
    const m={
      'tappetino':{k, tipo:'tappetino', x:Math.round(hip[0]-90), w:180},
      'elastico-ginocchia':{k, tipo:'elastico', da:'knN', a:'knF'},
      'elastico-caviglie':{k, tipo:'elastico', da:'anN', a:'anF'},
      'elastico-piedi-mani':{k, tipo:'elastico', da:'anN', a:'haN'},
      'elastico-muro':{k, tipo:'elastico', da:'haN', a:[Math.round(hip[0]+86), Math.round(hip[1]-10)]},
      'palla':{k, tipo:'palla', su:'mani', sopra:true},
      'muro-dietro':{k, tipo:'muro', x:Math.round(hip[0]-36)},
      'muro-davanti':{k, tipo:'muro', x:Math.round(hip[0]+86)},
      'sedia':{k, tipo:'sedia'},
      'gradino':{k, tipo:'gradino', x:Math.round(hip[0]-10), w:50, h:22},
    }[k];
    if(m){ if(k==='elastico-muro' && !A.attrezzi.some(a=>a.tipo==='muro')) A.attrezzi.push({k:'muro-davanti', tipo:'muro', x:Math.round(hip[0]+86)}); A.attrezzi.push(m); }
  }
  root.addEventListener('click', async ev=>{
    const z=ev.target.closest('.zona.clic');
    if(z && z.closest('[data-sag]')){ const reg=z.dataset.m; toggle(R.lavora.muscoli, reg); aggiornaEvidenzia(); cambiato(); dati(); anim(); return; }
    const b=ev.target.closest('[data-e]'); if(!b || b.tagName==='SELECT' || (b.tagName==='INPUT' && b.type!=='checkbox')) return;
    const e=b.dataset.e, v=b.dataset.v, i=+b.dataset.i;
    const A=R.anim;
    switch(e){
      case 'obiettivo': if(R.obiettivo!==v){ R.obiettivo=v; R.ambito=VSE.AMBITI[v][0]; cambiato(); dati(); } break;
      case 'ambito': R.ambito=v; if(R.obiettivo==='Tecnica' && VSE.FONDAMENTALI.includes(v) && !R.lavora.fondamentali.includes(v)) R.lavora.fondamentali.unshift(v); cambiato(); dati(); break;
      case 'fond': toggle(R.lavora.fondamentali, v); cambiato(); dati(); break;
      case 'musc': toggle(R.lavora.muscoli, v); aggiornaEvidenzia(); cambiato(); dati(); anim(); break;
      case 'diff': R.difficolta=+v; cambiato(); dati(); break;
      case 'mat': toggle(R.materiale, v); cambiato(); dati(); break;
      case 'pk': R.pacchetti = $$('[data-e="pk"]:checked',root).map(x=>x.value); cambiato(); break;
      case 'atipo': if(A.tipo!==v){ if(!(await opts.conferma('Cambiare tipo di animazione?','I fotogrammi attuali verranno sostituiti da un esempio da modificare.','Cambia'))) return; R.anim=animDefault(v); st.frame=0; st.sel=null; aggiornaEvidenzia(); cambiato(); anim(); passi(); } break;
      case 'cvista': A.vista=v; cambiato(); anim(); break;
      case 'zone': A.zone=b.checked; cambiato(); anim(); break;
      case 'tool': st.tool=v; anim(); break;
      case 'squadra': { const el=(A.elementi||[]).find(x=>x.id===st.sel); if(el){ el.squadra=v; cambiato(); anim(); } } break;
      case 'del-el': { const id=st.sel; A.elementi=(A.elementi||[]).filter(x=>x.id!==id); A.fotogrammi.forEach(f=>{ if(f.pos) delete f.pos[id]; }); st.sel=null; cambiato(); anim(); } break;
      case 'ovista': if((A.vista||'lato')!==v){ if(!(await opts.conferma('Cambiare vista?','Le pose verranno sostituite da un esempio nella nuova vista.','Cambia'))) return; const old=A.attrezzi; R.anim=animDefault('corpo', v); R.anim.attrezzi=[]; st.frame=0; aggiornaEvidenzia(); cambiato(); anim(); passi(); } break;
      case 'attr': attrezzo(v); cambiato(); anim(); break;
      case 'frame': st.frame=+v; st.sel=null; anim(); break;
      case 'f-add': case 'f-dup': { const f=clona(A.fotogrammi[st.frame]); if(A.tipo==='campo'){ f.pos=VSA.posCampo(A, st.frame); delete f.arco; } f.dur=f.dur||(A.tipo==='campo'?1.4:1.1); delete f.ritorno; A.fotogrammi.splice(st.frame+1,0,f); st.frame++; cambiato(); anim(); passi(); if(e==='f-add') opts.toast && opts.toast(A.tipo==='campo'?'Fotogramma aggiunto: sposta ciò che si muove':'Fotogramma aggiunto: scegli la posa'); } break;
      case 'f-del': if(A.fotogrammi.length>1){ if(A.tipo==='campo'){ const full=VSA.posCampo(A, st.frame); if(st.frame+1<A.fotogrammi.length){ const nx=A.fotogrammi[st.frame+1]; nx.pos=Object.assign({}, st.frame===0?full:(A.fotogrammi[st.frame].pos||{}), nx.pos||{}); } }
          A.fotogrammi.splice(st.frame,1);
          R.passi.forEach(p=>{ if(p.f!=null && p.f>st.frame) p.f--; else if(p.f!=null && p.f>=A.fotogrammi.length) p.f=A.fotogrammi.length-1; });
          st.frame=Math.max(0,st.frame-1); cambiato(); anim(); passi(); } break;
      case 'f-sx': case 'f-dx': { const j=st.frame+(e==='f-sx'?-1:1); if(j<0||j>=A.fotogrammi.length) break;
          if(A.tipo==='campo'){ // rende complete le posizioni dei due fotogrammi prima di scambiarli
            const pa=VSA.posCampo(A, st.frame), pb=VSA.posCampo(A, j); A.fotogrammi[st.frame].pos=pa; A.fotogrammi[j].pos=pb; }
          const t=A.fotogrammi[st.frame]; A.fotogrammi[st.frame]=A.fotogrammi[j]; A.fotogrammi[j]=t; st.frame=j; cambiato(); anim(); } break;
      case 'prova': {
          const stg=$('#ed-stage',root);
          if(st.prova){ st.prova.destroy(); st.prova=null; anim(); break; }
          st.prova = new VSA.Player(stg, A, {forza:true});
          b.innerHTML=I('pausa',14)+' Ferma la prova'; } break;
      case 'ps-add': R.passi.push({titolo:'',testo:'',f:Math.min(R.passi.length, A.fotogrammi.length-1)}); cambiato(); passi(); break;
      case 'ps-del': R.passi.splice(i,1); cambiato(); passi(); break;
      case 'ps-su': if(i>0){ const t=R.passi[i]; R.passi[i]=R.passi[i-1]; R.passi[i-1]=t; cambiato(); passi(); } break;
      case 'ps-giu': if(i<R.passi.length-1){ const t=R.passi[i]; R.passi[i]=R.passi[i+1]; R.passi[i+1]=t; cambiato(); passi(); } break;
      case 'l-add': R[b.dataset.c].push(''); cambiato(); lista(b.dataset.c==='attenzione'?'p-att':'', b.dataset.c, 'Punti di attenzione','Es. Fermati prima del contatto con la palla','Le cose su cui insistere per fare bene l\'esercizio.'); { const t=$$('[data-e="l-x"]',root).pop(); if(t) t.focus(); } break;
      case 'l-del': R[b.dataset.c].splice(i,1); cambiato(); lista('p-att', b.dataset.c, 'Punti di attenzione','Es. Fermati prima del contatto con la palla','Le cose su cui insistere per fare bene l\'esercizio.'); break;
      case 'er-add': R.errori.push({errore:'',correzione:''}); cambiato(); errori(); { const t=$$('[data-e="er-e"]',root).pop(); if(t) t.focus(); } break;
      case 'er-del': R.errori.splice(i,1); cambiato(); errori(); break;
    }
  });
  root.addEventListener('input', ev=>{
    const t=ev.target; const e=t.dataset.e, i=+t.dataset.i, n=t.name;
    const num = v => v===''?'':(+v);
    if(n){
      if(['titolo','descrizione','serveA','prepara','materialeNote','note'].includes(n)) R[n]=t.value;
      else if(n==='g0') R.giocatori[0]=num(t.value); else if(n==='g1') R.giocatori[1]=num(t.value);
      else if(n==='durata') R.durata=num(t.value);
      else if(['serie','ripetizioni','tempo','recupero'].includes(n)) R.dose[n]=num(t.value);
      else if(n==='lato') R.dose.lato=t.checked;
      else if(n==='tags') R.tags=t.value.split(',').map(s=>s.trim()).filter(Boolean);
      else if(n==='vfacile') R.varianti.facile=t.value; else if(n==='vdifficile') R.varianti.difficile=t.value;
      cambiato(); return;
    }
    const A=R.anim, F=A.fotogrammi[st.frame];
    if(e==='etichetta'){ const el=(A.elementi||[]).find(x=>x.id===st.sel); if(el){ el.etichetta=t.value.slice(0,3); ridisegnaStage(); cambiato(); } }
    else if(e==='sl'){
      const k=t.dataset.k.split('.'); const P=VSA.posaDi(F); F.p=F.p||{};
      if(k.length>1){ const arr=P[k[0]].slice(); arr[+k[1]]=+t.value; F.p[k[0]]=arr; } else F.p[k[0]]=+t.value;
      t.nextElementSibling.textContent=Math.round(+t.value*10)/10;
      ridisegnaStage(); cambiato();
    }
    else if(e==='fdur'){ F.dur=+t.value||1; cambiato(); }
    else if(e==='frit'){ F.ritorno=+t.value; cambiato(); }
    else if(e==='fpausa'){ F.pausa=+t.value; cambiato(); }
    else if(e==='ps-t'){ R.passi[i].titolo=t.value; cambiato(); }
    else if(e==='ps-x'){ R.passi[i].testo=t.value; cambiato(); }
    else if(e==='l-x'){ R[t.dataset.c][i]=t.value; cambiato(); }
    else if(e==='er-e'){ R.errori[i].errore=t.value; cambiato(); }
    else if(e==='er-c'){ R.errori[i].correzione=t.value; cambiato(); }
  });
  root.addEventListener('change', ev=>{
    const t=ev.target; const e=t.dataset.e; const A=R.anim; const F=A.fotogrammi[st.frame];
    if(e==='posa'){ if(t.value){ F.posa=t.value; delete F.p; } else { F.p=VSA.posaDi(F); delete F.p.terra; delete F.posa; } cambiato(); anim(); }
    else if(e==='ancora'){ if(t.value) A.ancora=t.value; else delete A.ancora; cambiato(); anim(); }
    else if(e==='farco'){ if(t.value) F.arco=+t.value; else delete F.arco; cambiato(); anim(); }
    else if(e==='copertina'){ if(t.value==='') delete A.copertina; else A.copertina=+t.value; cambiato(); }
    else if(e==='ps-f'){ R.passi[+t.dataset.i].f=+t.value; cambiato(); }
    else if(e==='sl'){ anim(); }
  });
  root.addEventListener('toggle', ev=>{ if(ev.target.classList && ev.target.classList.contains('reg')) st.regOpen=ev.target.open; }, true);

  return {
    dati(){
      const r=clona(R);
      r.titolo=(r.titolo||'').trim();
      r.passi=r.passi.filter(p=>(p.titolo||'').trim()||(p.testo||'').trim()).map(p=>({titolo:(p.titolo||'').trim(), testo:(p.testo||'').trim(), f:p.f!=null?+p.f:null}));
      r.attenzione=r.attenzione.map(s=>String(s||'').trim()).filter(Boolean);
      r.errori=r.errori.filter(x=>(x.errore||'').trim()||(x.correzione||'').trim()).map(x=>({errore:(x.errore||'').trim(), correzione:(x.correzione||'').trim()}));
      r.giocatori=r.giocatori.filter(x=>x!==''&&x!=null);
      if(r.anim && r.anim.tipo==='corpo') r.anim.evidenzia=evidenziaDa(r.lavora.muscoli);
      return r;
    },
    distruggi(){ if(st.prova) st.prova.destroy(); },
  };
}

window.Editor = { monta, nuovo, animDefault, evidenziaDa };
})();

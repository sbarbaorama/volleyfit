/* VolleyFit – motore delle animazioni.
   Due tipi di animazione:
   - "corpo": un omino con articolazioni (cinematica diretta), vista di lato o di fronte.
     Ogni fotogramma è una posa (nome dal catalogo delle pose oppure parametri),
     tra un fotogramma e l'altro si interpolano gli angoli.
   - "campo": campo da pallavolo visto dall'alto; ogni fotogramma contiene le posizioni
     (in metri) di atleti, palla e attrezzi; la palla vola ad arco.
*/
(function(){
'use strict';

/* ------------------------------------------------------------------ utilità */
const R = d => d*Math.PI/180;
const r1 = v => Math.round(v*10)/10;
const lerp = (a,b,u) => a+(b-a)*u;
const ease = u => 0.5-0.5*Math.cos(Math.PI*Math.min(1,Math.max(0,u)));
const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function cssVar(name, fb){ try{ const v=getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v||fb; }catch(e){ return fb; } }

/* ------------------------------------------------------------------ OMINO */
const LEN = {torso:58, neck:16, head:11, uarm:29, farm:27, thigh:45, shin:44, foot:15};
const GROUND = 200;

/* Parametri di una posa (gradi):
   x,y  posizione del bacino (y viene poi riportata a terra se terra!==false)
   t    inclinazione del busto (0 = dritto, + = in avanti / verso destra)
   h    inclinazione della testa rispetto al busto
   aN,aF  braccio vicino/lontano: [spalla, gomito] spalla 0 = giù, + = avanti/alto; gomito + = piega in avanti
   lN,lF  gamba vicina/lontana: [anca, ginocchio, caviglia] anca 0 = giù, + = avanti; ginocchio + = piega; caviglia + = punta in alto
   z    sollevamento da terra (salti)
   q    (solo vista di fronte) accorciamento delle cosce per il piegamento, 0..1
   g    livello del pavimento (default 200)
*/
const DEF = {x:100,y:112,t:0,h:0,aN:[8,10],aF:[-8,10],lN:[4,0,0],lF:[-4,0,0],z:0,q:0,g:GROUND};
function normPose(p){
  const o = Object.assign({}, DEF, p||{});
  for(const k of ['aN','aF']) o[k] = [ (o[k]&&o[k][0])||0, (o[k]&&o[k][1])||0 ];
  for(const k of ['lN','lF']) o[k] = [ (o[k]&&o[k][0])||0, (o[k]&&o[k][1])||0, (o[k]&&o[k][2])||0 ];
  return o;
}
function lerpPose(a,b,u){
  const o={};
  for(const k of ['x','y','t','h','z','q','g']) o[k]=lerp(a[k],b[k],u);
  for(const k of ['aN','aF']) o[k]=[lerp(a[k][0],b[k][0],u), lerp(a[k][1],b[k][1],u)];
  for(const k of ['lN','lF']) o[k]=[lerp(a[k][0],b[k][0],u), lerp(a[k][1],b[k][1],u), lerp(a[k][2],b[k][2],u)];
  o.terra = (u<0.5?a:b).terra;
  return o;
}
const down = (a,L)=>[Math.sin(R(a))*L, Math.cos(R(a))*L];   // 0 = verso il basso, + = verso destra

function fk(P, vista){
  const p = normPose(P);
  const J = {};
  const hip = [p.x, p.y];
  const up = [Math.sin(R(p.t))*LEN.torso, -Math.cos(R(p.t))*LEN.torso];
  const neck = [hip[0]+up[0], hip[1]+up[1]];
  const ht = p.t+p.h;
  J.head = [neck[0]+Math.sin(R(ht))*LEN.neck, neck[1]-Math.cos(R(ht))*LEN.neck];
  J.neck = neck; J.hip = hip;
  if(vista==='fronte'){
    // spalle e anche separate di lato; N = lato destro dello schermo, F = lato sinistro
    const px = Math.cos(R(p.t)), py = Math.sin(R(p.t));          // perpendicolare al busto
    const shN=[neck[0]+px*15, neck[1]+py*15+4], shF=[neck[0]-px*15, neck[1]-py*15+4];
    const hpN=[hip[0]+px*9, hip[1]+py*9], hpF=[hip[0]-px*9, hip[1]-py*9];
    J.shN=shN; J.shF=shF; J.hpN=hpN; J.hpF=hpF;
    const arm=(sh,a,sg)=>{ const e=[sh[0]+sg*down(a[0],LEN.uarm)[0], sh[1]+down(a[0],LEN.uarm)[1]];
      const w=[e[0]+sg*down(a[0]+a[1],LEN.farm)[0], e[1]+down(a[0]+a[1],LEN.farm)[1]]; return [e,w]; };
    [J.elN,J.haN]=arm(shN,p.aN,1); [J.elF,J.haF]=arm(shF,p.aF,-1);
    const th = LEN.thigh*(1-0.5*p.q);
    const leg=(hp,l,sg)=>{ const k=[hp[0]+sg*down(l[0],th)[0], hp[1]+down(l[0],th)[1]];
      const a=[k[0]+sg*down(l[0]-l[1],LEN.shin)[0], k[1]+down(l[0]-l[1],LEN.shin)[1]];
      const t=[a[0]+sg*6, a[1]+2]; return [k,a,t]; };
    [J.knN,J.anN,J.toN]=leg(hpN,p.lN,1); [J.knF,J.anF,J.toF]=leg(hpF,p.lF,-1);
  } else {
    J.shN=neck; J.shF=neck; J.hpN=hip; J.hpF=hip;
    const arm=a=>{ const e=[neck[0]+down(a[0],LEN.uarm)[0], neck[1]+down(a[0],LEN.uarm)[1]];
      const w=[e[0]+down(a[0]+a[1],LEN.farm)[0], e[1]+down(a[0]+a[1],LEN.farm)[1]]; return [e,w]; };
    [J.elN,J.haN]=arm(p.aN); [J.elF,J.haF]=arm(p.aF);
    const leg=l=>{ const k=[hip[0]+down(l[0],LEN.thigh)[0], hip[1]+down(l[0],LEN.thigh)[1]];
      const sa=l[0]-l[1];
      const a=[k[0]+down(sa,LEN.shin)[0], k[1]+down(sa,LEN.shin)[1]];
      const fa=90+l[2];
      const t=[a[0]+down(fa,LEN.foot)[0], a[1]+down(fa,LEN.foot)[1]]; return [k,a,t]; };
    [J.knN,J.anN,J.toN]=leg(p.lN); [J.knF,J.anF,J.toF]=leg(p.lF);
  }
  // appoggio a terra
  if(p.terra!==false){
    let maxY=-1e9;
    for(const k in J){ let y=J[k][1]; if(k==='head') y+=LEN.head; else y+=4; if(y>maxY) maxY=y; }
    const dy = p.g - maxY - p.z;
    for(const k in J){ J[k]=[J[k][0], J[k][1]+dy]; }
  }
  J._g = p.g;
  return J;
}

/* segmenti dell'omino: nome -> [da, a, spessore, lato] */
const SEG = {
  braccioF:['shF','elF',8,'F'], avambraccioF:['elF','haF',7,'F'],
  cosciaF:['hpF','knF',10,'F'], gambaF:['knF','anF',9,'F'], piedeF:['anF','toF',7,'F'],
  busto:['neck','hip',12,'C'],
  cosciaN:['hpN','knN',10,'N'], gambaN:['knN','anN',9,'N'], piedeN:['anN','toN',7,'N'],
  braccioN:['shN','elN',8,'N'], avambraccioN:['elN','haN',7,'N'],
};
const ORDER_LATO = ['braccioF','avambraccioF','cosciaF','gambaF','piedeF','busto','cosciaN','gambaN','piedeN','braccioN','avambraccioN'];

function attrezziSVG(list, J, col, livello){
  let s='';
  for(const a of (list||[])){
    if((a.sopra?'sopra':'sotto')!==livello) continue;
    const pt = v => Array.isArray(v) ? v : (v==='mani' ? [ (J.haN[0]+J.haF[0])/2, (J.haN[1]+J.haF[1])/2 ] : (J[v]||[0,0]));
    if(a.tipo==='elastico'){
      const p1=pt(a.da), p2=pt(a.a);
      if(Math.hypot(p1[0]-p2[0],p1[1]-p2[1])<7) s+=`<ellipse cx="${r1(p1[0])}" cy="${r1(p1[1])}" rx="7" ry="4.5" fill="none" stroke="${col.elastico}" stroke-width="3.2"/>`;
      else s+=`<line x1="${r1(p1[0])}" y1="${r1(p1[1])}" x2="${r1(p2[0])}" y2="${r1(p2[1])}" stroke="${col.elastico}" stroke-width="3.2" stroke-linecap="round"/>`;
    } else if(a.tipo==='palla'){
      const p=pt(a.su||a.pos||'mani'); const rr=a.r||9;
      s+=`<circle cx="${r1(p[0]+(a.dx||0))}" cy="${r1(p[1]+(a.dy||0))}" r="${rr}" fill="${col.palla}" stroke="${col.inchiostro}" stroke-width="1.5"/><path d="M${r1(p[0]+(a.dx||0)-rr+2)} ${r1(p[1]+(a.dy||0)-2)}q${rr-2} 5 ${2*rr-4} 0" fill="none" stroke="${col.inchiostro}" stroke-width="1" opacity=".6"/>`;
    } else if(a.tipo==='tappetino'){
      s+=`<rect x="${a.x||18}" y="${J._g-2}" width="${a.w||164}" height="5" rx="2.5" fill="${col.tappetino}"/>`;
    } else if(a.tipo==='muro'){
      s+=`<rect x="${a.x}" y="10" width="7" height="${J._g-10}" fill="${col.attrezzo}"/>`;
    } else if(a.tipo==='gradino'){
      s+=`<rect x="${a.x}" y="${GROUND-(a.h||22)}" width="${a.w||46}" height="${a.h||22}" rx="2" fill="${col.attrezzo}"/>`;
    } else if(a.tipo==='sedia'){
      const hx=J.hip[0], sy=J.hip[1]+7, bx=hx+(a.verso==='destra'?16:-24);
      s+=`<path d="M${r1(hx-24)} ${r1(sy)}H${r1(hx+16)}M${r1(hx-20)} ${r1(sy)}V${J._g}M${r1(hx+12)} ${r1(sy)}V${J._g}M${r1(hx-24)} ${r1(sy)}V${r1(sy-44)}" stroke="${col.attrezzo}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
    } else if(a.tipo==='cono'){
      s+=`<path d="M${a.x-7} ${GROUND}L${a.x} ${GROUND-16}L${a.x+7} ${GROUND}Z" fill="${col.elastico}"/>`;
    } else if(a.tipo==='rete'){
      s+=`<rect x="${a.x}" y="${a.y||40}" width="4" height="${GROUND-(a.y||40)}" fill="${col.attrezzo}" opacity=".7"/><rect x="${a.x-3}" y="${a.y||40}" width="10" height="${a.alt||34}" fill="none" stroke="${col.attrezzo}" stroke-width="2" stroke-dasharray="3 2"/>`;
    }
  }
  return s;
}

function omino(J, opt){
  const col = opt.col, ev = new Set(opt.evidenzia||[]);
  const ghost = opt.ghost;
  let s='';
  const order = ORDER_LATO;
  for(const n of order){
    const [a,b,w,side] = SEG[n];
    const pa=J[a], pb=J[b];
    let c = ghost ? col.inchiostro : (side==='F' && opt.vista!=='fronte' ? col.lontano : col.inchiostro);
    if(!ghost && ev.has(n)) c = side==='F' && opt.vista!=='fronte' ? col.evidenzaLontano : col.evidenza;
    if(!ghost && ev.has(n.replace(/[NF]$/,''))) c = side==='F' && opt.vista!=='fronte' ? col.evidenzaLontano : col.evidenza;
    s+=`<line x1="${r1(pa[0])}" y1="${r1(pa[1])}" x2="${r1(pb[0])}" y2="${r1(pb[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  }
  if(opt.vista==='fronte') s+=`<line x1="${r1(J.shN[0])}" y1="${r1(J.shN[1])}" x2="${r1(J.shF[0])}" y2="${r1(J.shF[1])}" stroke="${ghost?col.inchiostro:(ev.has('busto')?col.evidenza:col.inchiostro)}" stroke-width="10" stroke-linecap="round"/><line x1="${r1(J.hpN[0])}" y1="${r1(J.hpN[1])}" x2="${r1(J.hpF[0])}" y2="${r1(J.hpF[1])}" stroke="${ghost?col.inchiostro:(ev.has('busto')?col.evidenza:col.inchiostro)}" stroke-width="10" stroke-linecap="round"/>`;
  s+=`<circle cx="${r1(J.head[0])}" cy="${r1(J.head[1])}" r="${LEN.head}" fill="${col.inchiostro}"/>`;
  if(!ghost && opt.vista!=='fronte'){
    // occhio: indica la direzione dello sguardo (perpendicolare all'asse collo-testa)
    const ax=J.head[0]-J.neck[0], ay=J.head[1]-J.neck[1], L=Math.hypot(ax,ay)||1;
    const ux=ax/L, uy=ay/L, gx=-uy, gy=ux;
    s+=`<circle cx="${r1(J.head[0]+gx*5+ux*1.5)}" cy="${r1(J.head[1]+gy*5+uy*1.5)}" r="1.9" fill="${col.sfondo}"/>`;
  }
  return ghost ? `<g opacity=".13">${s}</g>` : s;
}

/* ------------------------------------------------------------------ CAMPO */
const COURT = {L:18, W:9};
function campoBox(vista){
  // area visibile in metri
  if(vista==='meta') return {x0:-2, x1:11.2, y0:-1.4, y1:10.4};
  return {x0:-2, x1:20, y0:-1.4, y1:10.4};
}

function colori(){
  return {
    inchiostro: cssVar('--anim-ink','#1A1C1E'),
    lontano: cssVar('--anim-far','#9CA2AB'),
    sfondo: cssVar('--anim-bg','#EAF0F8'),
    evidenza: cssVar('--muscle','#E2553A'),
    evidenzaLontano: cssVar('--muscle-far','#EFA08F'),
    elastico: cssVar('--band','#1F6FD1'),
    palla: cssVar('--ball','#F6B93B'),
    tappetino: cssVar('--mat','#C9C5BD'),
    attrezzo: cssVar('--prop','#8B95A5'),
    suolo: cssVar('--anim-ground','#C3CBD8'),
    campo: cssVar('--court','#1546A0'),
    pavimento: cssVar('--floor','#E8833A'),
    linee: '#FFFFFF',
    squadraA: '#FFFFFF', squadraAtesto:'#1A1C1E',
    squadraB: '#1A1C1E', squadraBtesto:'#FFFFFF',
    allenatore: cssVar('--ball','#F6B93B'),
  };
}

/* ------------------------------------------------------------------ TIMELINE */
// restituisce {i: indice del fotogramma verso cui si va (o fermo), j: precedente, u: avanzamento 0..1}
function buildTimeline(frames, defDur){
  const n = frames.length; const seg=[]; let t=0;
  for(let i=0;i<n;i++){
    const f=frames[i];
    const hold = f.pausa!=null ? +f.pausa : 0.5;
    seg.push({type:'hold', i, j:i, t0:t, t1:t+hold}); t+=hold;
    const nx=(i+1)%n;
    if(n>1){
      const fn=frames[nx];
      const d = nx===0 ? (frames[0].ritorno!=null?+frames[0].ritorno:(fn.dur!=null?+fn.dur:defDur)) : (fn.dur!=null?+fn.dur:defDur);
      if(nx===0 && frames[0].salto) { /* ritorno istantaneo */ seg.push({type:'move', i:nx, j:i, t0:t, t1:t+0.001}); t+=0.001; }
      else { seg.push({type:'move', i:nx, j:i, t0:t, t1:t+d}); t+=d; }
    }
  }
  return {seg, total: Math.max(t,0.001)};
}
function at(tl, t){
  t = ((t%tl.total)+tl.total)%tl.total;
  for(const s of tl.seg){ if(t>=s.t0 && t<s.t1) return {i:s.i, j:s.j, u: s.type==='hold'?1:(t-s.t0)/(s.t1-s.t0), move:s.type==='move'}; }
  const s=tl.seg[tl.seg.length-1]; return {i:s.i, j:s.j, u:1, move:false};
}
function timeOfFrame(tl, i){ for(const s of tl.seg) if(s.type==='hold' && s.i===i) return s.t0+Math.min(0.15,(s.t1-s.t0)/2); return 0; }

/* ------------------------------------------------------------------ RENDER CORPO */
function posaDi(f){
  if(!f) return normPose({});
  let base = {};
  if(f.posa && window.VSE_POSE && window.VSE_POSE[f.posa]) base = window.VSE_POSE[f.posa].p;
  const o = Object.assign({}, base, f.p||{});
  return normPose(o);
}

function jointsCorpo(anim, P){
  const frames = anim.fotogrammi||[];
  const vista = anim.vista||'lato';
  const J = fk(P, vista);
  if(anim.ancora && frames.length){
    const J0 = fk(posaDi(frames[0]), vista); const k=anim.ancora;
    if(J0[k] && J[k]){ const dx=J0[k][0]-J[k][0]; for(const q in J){ if(q[0]!=='_') J[q]=[J[q][0]+dx, J[q][1]]; } }
  }
  return J;
}
const VB_ASPECT = 1.25;
function vbCorpo(anim){
  const frames = anim.fotogrammi||[];
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9,g=GROUND;
  const add=(x,y)=>{ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; };
  const list = frames.length ? frames : [{}];
  for(let i=0;i<list.length;i++){
    const P=posaDi(list[i]); const J=jointsCorpo(anim,P); g=J._g;
    for(const k in J){ if(k[0]==='_') continue; const r=k==='head'?LEN.head:5; add(J[k][0]-r,J[k][1]-r); add(J[k][0]+r,J[k][1]+r); }
    // punto intermedio verso il fotogramma successivo
    if(list.length>1){ const Q=lerpPose(P, posaDi(list[(i+1)%list.length]), 0.5); const K=jointsCorpo(anim,Q);
      for(const k in K){ if(k[0]==='_') continue; add(K[k][0],K[k][1]); } }
  }
  for(const a of (anim.attrezzi||[])){
    if(a.tipo==='muro'||a.tipo==='cono'||a.tipo==='gradino'){ add(a.x,g-20); add(a.x+(a.w||8),g); }
    if(a.tipo==='elastico'){ for(const v of [a.da,a.a]) if(Array.isArray(v)) add(v[0],v[1]); }
  }
  add(x0, g+4);
  const pad=16;
  let w=(x1-x0)+2*pad, h=(g+8-y0)+pad, X0=x0-pad, Y0=y0-pad;
  w=Math.max(w,120); h=Math.max(h,120);
  if(w/h < VB_ASPECT){ const nw=h*VB_ASPECT; X0-= (nw-w)/2; w=nw; }
  else { const nh=w/VB_ASPECT; Y0-= (nh-h)*0.75; h=nh; }
  return [r1(X0), r1(Y0), r1(w), r1(h)];
}
function svgCorpo(anim, state, opt){
  const col = opt.col || colori();
  const frames = anim.fotogrammi||[];
  const vista = anim.vista||'lato';
  let P;
  if(state.move){ const a=posaDi(frames[state.j]), b=posaDi(frames[state.i]); P = lerpPose(a,b,ease(state.u)); }
  else P = posaDi(frames[state.i]);
  const J = jointsCorpo(anim, P);
  const att = (anim.attrezzi||[]);
  const ev = anim.evidenzia||[];
  let ghost='';
  if(opt.fantasma!==false && frames.length>1 && !opt.mini && !opt.noGhost && vista!=='fronte'){
    const G = jointsCorpo(anim, posaDi(frames[0])); ghost = omino(G,{col, vista, ghost:true});
  }
  const g = J._g;
  const vb = opt.vb || vbCorpo(anim);
  const bg = opt.trasparente ? '' : `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${col.sfondo}"/>`;
  return `<svg viewBox="${vb.join(' ')}" xmlns="http://www.w3.org/2000/svg" ${opt.attrs||''}>${bg}
<line x1="${r1(vb[0]+8)}" y1="${g+1.5}" x2="${r1(vb[0]+vb[2]-8)}" y2="${g+1.5}" stroke="${col.suolo}" stroke-width="3" stroke-linecap="round"/>
${attrezziSVG(att,J,col,'sotto')}${ghost}${omino(J,{col, vista, evidenzia:ev})}${attrezziSVG(att,J,col,'sopra')}</svg>`;
}

/* ------------------------------------------------------------------ RENDER CAMPO */
function posCampo(anim, idx){
  // posizioni complete al fotogramma idx (gli elementi non indicati restano dove erano)
  const pos={};
  const fr=anim.fotogrammi||[];
  for(let k=0;k<=idx && k<fr.length;k++) Object.assign(pos, (fr[k]||{}).pos||{});
  return pos;
}
function svgCampo(anim, state, opt){
  const col = opt.col || colori();
  const vista = anim.vista||'intero';
  const B = campoBox(vista);
  const S = 40; // px per metro
  const W=(B.x1-B.x0)*S, H=(B.y1-B.y0)*S;
  const X=x=>r1((x-B.x0)*S), Y=y=>r1((y-B.y0)*S);
  const fr = anim.fotogrammi||[];
  const els = anim.elementi||[];
  let s=`<svg viewBox="0 0 ${r1(W)} ${r1(H)}" xmlns="http://www.w3.org/2000/svg" ${opt.attrs||''}>`;
  s+=`<rect x="0" y="0" width="${r1(W)}" height="${r1(H)}" fill="${col.campo}"/>`;
  const cx1 = vista==='meta' ? Math.min(COURT.L, B.x1) : COURT.L;
  s+=`<rect x="${X(0)}" y="${Y(0)}" width="${r1(cx1*S)}" height="${r1(COURT.W*S)}" fill="${col.pavimento}"/>`;
  // linee
  const lw=3;
  s+=`<path d="M${X(cx1)} ${Y(0)}H${X(0)}V${Y(9)}H${X(cx1)}" fill="none" stroke="#fff" stroke-width="${lw}"/>`;
  if(vista!=='meta') s+=`<path d="M${X(18)} ${Y(0)}V${Y(9)}" stroke="#fff" stroke-width="${lw}"/>`;
  s+=`<path d="M${X(6)} ${Y(0)}V${Y(9)}" stroke="#fff" stroke-width="2"/>`;
  if(vista!=='meta') s+=`<path d="M${X(12)} ${Y(0)}V${Y(9)}" stroke="#fff" stroke-width="2"/>`;
  else s+=`<path d="M${X(12)} ${Y(0)}V${Y(9)}" stroke="#fff" stroke-width="2" opacity=".0"/>`;
  // rete
  s+=`<path d="M${X(9)} ${Y(-0.7)}V${Y(9.7)}" stroke="#fff" stroke-width="8"/><circle cx="${X(9)}" cy="${Y(-0.7)}" r="5" fill="#fff"/><circle cx="${X(9)}" cy="${Y(9.7)}" r="5" fill="#fff"/>`;
  // zone (numeri piccoli) solo se richiesto
  if(anim.zone){
    const z=[[1,7.5,1.5],[6,4.5,1.5],[5,1.5,1.5],[4,1.5,7.5],[3,4.5,7.5],[2,7.5,7.5]];
    // la nostra metà è a sinistra: x 0..9 (fondo a x=0, rete a x=9)
    const pts={1:[1.5,7.5],6:[1.5,4.5],5:[1.5,1.5],4:[7.5,1.5],3:[7.5,4.5],2:[7.5,7.5]};
    for(const k in pts) s+=`<text x="${X(pts[k][0])}" y="${Y(pts[k][1])+8}" text-anchor="middle" font-size="30" font-weight="700" fill="#fff" opacity=".4" font-family="Sora,system-ui,sans-serif">${k}</text>`;
  }
  // scie (traiettorie della palla e spostamenti) per l'intera animazione
  const palle = els.filter(e=>e.tipo==='palla');
  if(!opt.mini || true){
    for(let k=1;k<fr.length;k++){
      const p0=posCampo(anim,k-1), p1=posCampo(anim,k);
      for(const e of els){
        const a=p0[e.id], b=p1[e.id]; if(!a||!b) continue;
        if(Math.hypot(a[0]-b[0],a[1]-b[1])<0.05) continue;
        if(e.tipo==='palla'){
          const arc = (fr[k].arco!=null?fr[k].arco:Math.min(3.5, 0.32*Math.hypot(a[0]-b[0],a[1]-b[1])+0.4));
          const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2 - 1.2*arc;
          s+=`<path d="M${X(a[0])} ${Y(a[1])}Q${X(mx)} ${Y(my)} ${X(b[0])} ${Y(b[1])}" fill="none" stroke="${col.palla}" stroke-width="2.5" stroke-dasharray="7 6" opacity=".7"/>`;
        } else if(e.tipo==='atleta' || e.tipo==='allenatore'){
          s+=`<path d="M${X(a[0])} ${Y(a[1])}L${X(b[0])} ${Y(b[1])}" stroke="#fff" stroke-width="2.2" stroke-dasharray="4 5" opacity=".55" marker-end="url(#fr)"/>`;
        }
      }
    }
  }
  s+=`<defs><marker id="fr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#fff" opacity=".7"/></marker></defs>`;
  // posizioni correnti
  const pA = posCampo(anim, state.move?state.j:state.i), pB = posCampo(anim, state.i);
  const u = state.move ? ease(state.u) : 1;
  const uLin = state.move ? Math.min(1,Math.max(0,state.u)) : 1;
  const cur = {};
  for(const e of els){
    const a=pA[e.id]||pB[e.id], b=pB[e.id]||a; if(!a) continue;
    if(e.tipo==='palla'){
      const d=Math.hypot(a[0]-b[0],a[1]-b[1]);
      const arc = state.move ? ((fr[state.i]||{}).arco!=null?fr[state.i].arco:Math.min(3.5,0.32*d+0.4)) : 0;
      const x=lerp(a[0],b[0],uLin), y=lerp(a[1],b[1],uLin);
      const h = d>0.05 ? 4*arc*uLin*(1-uLin) : 0;
      cur[e.id]={x,y,h};
    } else cur[e.id]={x:lerp(a[0],b[0],u), y:lerp(a[1],b[1],u), h:0};
  }
  // attrezzi a terra, poi atleti, poi palla
  const sel = opt.selezionato;
  for(const e of els){ const c=cur[e.id]; if(!c) continue;
    if(e.tipo==='cono') s+=`<path d="M${X(c.x)-15} ${Y(c.y)+12}L${X(c.x)} ${Y(c.y)-16}L${X(c.x)+15} ${Y(c.y)+12}Z" fill="${col.palla}" stroke="#1A1C1E" stroke-width="1.5" data-el="${esc(e.id)}"/>`;
    if(e.tipo==='bersaglio') s+=`<g data-el="${esc(e.id)}"><rect x="${X(c.x-0.75)}" y="${Y(c.y-0.75)}" width="${r1(1.5*S)}" height="${r1(1.5*S)}" fill="#fff" fill-opacity=".18" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 4"/></g>`;
    if(e.tipo==='carrello') s+=`<g data-el="${esc(e.id)}"><rect x="${X(c.x)-20}" y="${Y(c.y)-20}" width="40" height="40" rx="6" fill="#fff" stroke="#1A1C1E" stroke-width="2"/><circle cx="${X(c.x)-7}" cy="${Y(c.y)-6}" r="7" fill="${col.palla}" stroke="#1A1C1E"/><circle cx="${X(c.x)+7}" cy="${Y(c.y)+7}" r="7" fill="${col.palla}" stroke="#1A1C1E"/></g>`;
     if(sel===e.id && (e.tipo==='cono'||e.tipo==='bersaglio'||e.tipo==='carrello')) s+=`<circle cx="${X(c.x)}" cy="${Y(c.y)}" r="34" fill="none" stroke="${col.palla}" stroke-width="3"/>`;
  }
  for(const e of els){ const c=cur[e.id]; if(!c) continue;
    if(e.tipo!=='atleta' && e.tipo!=='allenatore') continue;
    const sq = e.tipo==='allenatore' ? 'C' : (e.squadra||'A');
    const fill = sq==='B'?col.squadraB:(sq==='C'?col.allenatore:col.squadraA);
    const tc = sq==='B'?col.squadraBtesto:col.squadraAtesto;
    const lab = esc(e.etichetta||'');
    const fs = lab.length>2?15:(lab.length>1?19:22);
    s+=`<g data-el="${esc(e.id)}"><circle cx="${X(c.x)}" cy="${Y(c.y)}" r="27" fill="${fill}" stroke="#1A1C1E" stroke-width="${sq==='B'?0:2}"/><text x="${X(c.x)}" y="${Y(c.y)+fs*0.36}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${tc}" font-family="Sora,system-ui,sans-serif">${lab}</text></g>`;
    if(sel===e.id) s+=`<circle cx="${X(c.x)}" cy="${Y(c.y)}" r="36" fill="none" stroke="${col.palla}" stroke-width="4"/>`;
  }
  for(const e of palle){ let c=cur[e.id]; if(!c) continue;
    if(c.h<0.05){ // palla ferma in mano a un atleta: spostata di lato per non coprire la sigla
      for(const a of els){ if(a.tipo!=='atleta' && a.tipo!=='allenatore') continue; const q=cur[a.id]; if(!q) continue;
        if(Math.hypot(q.x-c.x,q.y-c.y)<0.75){ const dx = q.x+0.55 > B.x1-0.45 ? -0.55 : 0.55; c={x:q.x+dx, y:q.y-0.5, h:0}; break; } } }
    const lift = c.h*0.6;
    s+=` <ellipse cx="${X(c.x)}" cy="${Y(c.y)+4}" rx="${r1(13-Math.min(6,c.h*1.5))}" ry="5" fill="#000" opacity=".2"/>`;
    s+=`<g data-el="${esc(e.id)}"> <circle cx="${X(c.x)}" cy="${r1(Y(c.y)-lift*S)}" r="${r1(14+c.h*1.8)}" fill="${col.palla}" stroke="#1A1C1E" stroke-width="1.6"/><path d="M${X(c.x)-11} ${r1(Y(c.y)-lift*S-3)}q11 8 22 0" fill="none" stroke="#1A1C1E" stroke-width="1.2" opacity=".55"/></g>`;
    if(sel===e.id) s+=`<circle cx="${X(c.x)}" cy="${Y(c.y)}" r="26" fill="none" stroke="#fff" stroke-width="3"/>`;
  }
  s+='</svg>';
  return s;
}

/* ------------------------------------------------------------------ API */
function svg(anim, frameIdx, opt){
  opt=opt||{};
  if(!anim || !(anim.fotogrammi||[]).length) return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" ${opt.attrs||''}><rect width="200" height="220" fill="${(opt.col||colori()).sfondo}"/></svg>`;
  const i = Math.max(0, Math.min((anim.fotogrammi.length-1), frameIdx==null?0:frameIdx));
  const st={i, j:i, u:1, move:false};
  return anim.tipo==='campo' ? svgCampo(anim, st, opt) : svgCorpo(anim, st, opt);
}
function copertina(anim, opt){
  if(!anim) return svg(anim,0,opt);
  const n=(anim.fotogrammi||[]).length;
  const i = anim.copertina!=null ? anim.copertina : (anim.tipo==='campo' ? Math.max(0,n-1) : Math.min(1,n-1));
  return svg(anim, i, Object.assign({mini:true, fantasma:false}, opt||{}));
}

class Player{
  constructor(el, anim, opt){
    this.el=el; this.anim=anim; this.opt=opt||{};
    this.speed=1; this.playing=!this.opt.fermo; this.t=0; this.last=null; this.raf=null; this.lastIdx=-1;
    this.reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(this.reduce && !this.opt.forza) this.playing=false;
    this.rebuild();
    this.tick=this.tick.bind(this);
    this.raf=requestAnimationFrame(this.tick);
  }
  rebuild(){
    this.tl = buildTimeline(this.anim.fotogrammi||[], this.anim.tipo==='campo'?1.4:1.1);
    this.col = colori();
    this.vb = this.anim.tipo==='campo' ? null : vbCorpo(this.anim);
    this.draw();
  }
  setAnim(a){ this.anim=a; this.rebuild(); }
  state(){ return at(this.tl, this.t); }
  draw(){
    const st=this.state();
    const o=Object.assign({}, this.opt, {col:this.col, vb:this.vb});
    this.el.innerHTML = this.anim.tipo==='campo' ? svgCampo(this.anim, st, o) : svgCorpo(this.anim, st, o);
    if(st.i!==this.lastIdx){ this.lastIdx=st.i; this.opt.onFrame && this.opt.onFrame(st.i); }
    this.opt.onTime && this.opt.onTime(this.t/this.tl.total);
  }
  tick(ts){
    if(!this.el.isConnected){ this.destroy(); return; }
    if(this.last==null) this.last=ts;
    const dt=Math.min(0.1,(ts-this.last)/1000); this.last=ts;
    if(this.playing){ this.t=(this.t+dt*this.speed)%this.tl.total; this.draw(); }
    this.raf=requestAnimationFrame(this.tick);
  }
  play(){ this.playing=true; this.opt.onPlay && this.opt.onPlay(true); }
  pause(){ this.playing=false; this.draw(); this.opt.onPlay && this.opt.onPlay(false); }
  toggle(){ this.playing?this.pause():this.play(); }
  vai(i){ this.t=timeOfFrame(this.tl, i); this.lastIdx=-1; this.draw(); }
  setSpeed(v){ this.speed=v; }
  refreshColors(){ this.col=colori(); this.draw(); }
  destroy(){ if(this.raf) cancelAnimationFrame(this.raf); this.raf=null; }
}

window.VSA = { vbCorpo, svg, copertina, Player, fk, normPose, posaDi, posCampo, campoBox, buildTimeline, LEN, colori };
})();

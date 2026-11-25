/* 2026 refresh: always-on bar, LIST/ROAM labels, card entry screen, merged INDEX panel. */
(()=>{
 'use strict';
 const $=s=>document.querySelector(s),body=document.body,D=window.COLLECTION,W=D.watches;
 const header=document.querySelector('body > header');

 /* ---- bar stays open; the hamburger is retired ---- */
 const keepOpen=()=>{if(body.dataset.menuOpen!=='true'){body.dataset.menuOpen='true';header.inert=false;header.setAttribute('aria-hidden','false');}};
 keepOpen();
 new MutationObserver(keepOpen).observe(body,{attributes:true,attributeFilter:['data-menu-open']});

 /* ---- LIST / ROAM ---- */
 const label=(sel,text)=>{const b=$(sel);if(b)b.textContent=text};
 label('[data-presentation-button="list"]','LIST');
 label('[data-presentation-button="free"]','ROAM');

 /* ---- entry-screen state flag ---- */
 const entry=$('#collection-entry');
 const syncHome=()=>{body.dataset.entryHome=String(!!entry&&!entry.hidden)};
 if(entry){syncHome();new MutationObserver(syncHome).observe(entry,{attributes:true,attributeFilter:['hidden']});}

 /* ---- entry cards ---- */
 const CARDS={
  'By Brand':{art:'previews/dial-2.webp',ko:'브랜드별',note:()=>`${brandCounts().size} MAISONS`},
  'By Style':{art:'previews/dial-5.webp',ko:'스타일별',note:()=>`${D.groups.style.length} STYLES`},
  'By Color':{art:'previews/dial-112.webp',ko:'색상별',note:()=>`${D.groups.color.length} TONES`}
 };
 function decorate(){
  if(!entry)return;
  if(!entry.querySelector('.entry-heading')){
   const head=document.createElement('div');head.className='entry-heading';head.setAttribute('aria-hidden','true');
   head.innerHTML='<span>Exquisite</span><em>timepieces.</em>';
   const rule=document.createElement('div');rule.className='entry-rule';rule.setAttribute('aria-hidden','true');
   const foot=document.createElement('div');foot.className='entry-foot';foot.setAttribute('aria-hidden','true');
   foot.innerHTML=`<span>2026 EDITION</span><span>01 — 0${entry.querySelectorAll('.collection-choice').length||3}</span>`;
   entry.append(head,rule,foot);
  }
  entry.querySelectorAll('.collection-choice').forEach((button,i)=>{
   if(button.dataset.carded)return;
   const title=button.querySelector('.collection-choice-title');
   const meta=CARDS[title?.textContent.trim()];
   if(!meta)return;
   button.dataset.carded='true';
   const no=document.createElement('span');no.className='entry-card-no';no.textContent=String(i+1).padStart(2,'0');
   const art=document.createElement('img');art.className='entry-card-art';art.src=meta.art;art.alt='';art.loading='lazy';art.decoding='async';
   const body2=document.createElement('span');body2.className='entry-card-body';
   const foot=document.createElement('span');foot.className='entry-card-meta';
   foot.innerHTML=`<span>${meta.ko}</span><b>${meta.note()}</b>`;
   button.prepend(no);
   button.append(art);
   body2.append(title,foot);
   button.append(body2);
  });
 }
 if(entry){decorate();new MutationObserver(decorate).observe(entry,{childList:true});}

 /* ---- data for the index panel ---- */
 function brandCounts(){
  const counts=new Map();
  for(const w of Object.values(W))counts.set(w.brand,(counts.get(w.brand)||0)+1);
  return counts;
 }
 const EN={'폴 쥬른':'F.P.Journe','드 베튠':'De Bethune','리차드 밀':'Richard Mille','랑앤하이네':'Lang & Heyne','로랑 페리에':'Laurent Ferrier','파텍 필립':'Patek Philippe','바쉐론 콘스탄틴':'Vacheron Constantin','오데마 피게':'Audemars Piguet','랑에 운트 죄네':'A. Lange & Söhne','브레게':'Breguet','예거 르쿨트르':'Jaeger-LeCoultre','블랑팡':'Blancpain','쇼파드':'Chopard','피아제':'Piaget','불가리':'Bvlgari','자케 드로':'Jaquet Droz','위블로':'Hublot','IWC':'IWC','제니스':'Zenith','롤렉스':'Rolex','까르띠에':'Cartier','오메가':'Omega','브라이틀링':'Breitling','파네라이':'Panerai','그랜드 세이코':'Grand Seiko','세이코':'Seiko','태그호이어':'TAG Heuer','론진':'Longines','크로노스위스':'Chronoswiss','레이몬드 웨일':'Raymond Weil','노모스':'Nomos','해밀턴':'Hamilton'};
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 function tierRows(list,counts){
  return list.map(line=>{
   const [no,rest]=line.split('. ');
   const names=rest.split('/').map(s=>s.trim());
   const total=names.reduce((sum,n)=>sum+(counts.get(n)||0),0);
   const parts=names.map(n=>{
    const owned=counts.get(n),name=esc(EN[n]||n);
    return owned?`<b>${name}<sup>${owned}</sup></b>`:`<i>${name}</i>`;
   });
   return `<div class="ix-tier"><span class="n">${String(+no).padStart(2,'0')}</span><p>${parts.join('<s>/</s>')}</p>${total?`<em>${String(total).padStart(2,'0')}</em>`:'<em class="z">—</em>'}</div>`;
  }).join('');
 }
 function bars(entries){
  const max=Math.max(...entries.map(([,n])=>n),1);
  return entries.map(([lab,n])=>`<div class="ix-bar"><span>${esc(lab)}</span><u style="--w:${Math.round(n/max*100)}%"></u><b>${String(n).padStart(2,'0')}</b></div>`).join('');
 }
 function fold(title,count,entries){
  return `<details><summary><span>${title} · ${String(count).padStart(2,'0')}</span><span class="ix-sum-right">COUNT<span class="ix-sign">+</span></span></summary><div class="ix-bars">${bars(entries)}</div></details>`;
 }

 /* ---- index panel ---- */
 const openButton=document.createElement('button');
 openButton.id='index-open';openButton.type='button';
 openButton.setAttribute('aria-haspopup','dialog');
 openButton.innerHTML='INDEX <sup>98</sup>';
 header.append(openButton);

 const dialog=document.createElement('dialog');
 dialog.id='index-dialog';dialog.setAttribute('aria-labelledby','index-title');
 document.body.append(dialog);

 function build(){
  const counts=brandCounts();
  const brandEntries=[...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  const styleEntries=D.groups.style.map(g=>[g.label,g.ids.length]).sort((a,b)=>b[1]-a[1]);
  const colorEntries=D.groups.color.map(g=>[g.label,g.ids.length]).sort((a,b)=>b[1]-a[1]);
  const total=Object.keys(W).length;
  openButton.innerHTML=`INDEX <sup>${total}</sup>`;
  dialog.innerHTML=`<button type="button" class="ix-close" aria-label="닫기">✕</button><div class="ix-wrap">
   <div class="ix-head">
    <div><div class="ix-eyebrow">BRAND HIERARCHY × COLLECTION NUMBERS</div><h2 id="index-title">Index <em>&amp; Numbers</em></h2></div>
    <div class="ix-stats">
     <div><b>${total}</b><span>TIMEPIECES</span></div>
     <div><b>${counts.size}</b><span>BRANDS</span></div>
     <div><b>${styleEntries.length}</b><span>STYLES</span></div>
     <div><b>${String(colorEntries.length).padStart(2,'0')}</b><span>COLORS</span></div>
    </div>
   </div>
   <div class="ix-cols">
    <div class="ix-col"><h3>메이저 브랜드<small>TIER 01 — ${D.major.length}</small></h3>${tierRows(D.major,counts)}</div>
    <div class="ix-col"><h3>독립 워치메이커<small>TIER 01 — ${D.independent.length}</small></h3>${tierRows(D.independent,counts)}</div>
   </div>
   <div class="ix-folds">
    ${fold('브랜드별',counts.size,brandEntries.map(([k,n])=>[EN[k]||k,n]))}
    ${fold('스타일별',styleEntries.length,styleEntries)}
    ${fold('색상별',colorEntries.length,colorEntries)}
   </div>
   <p class="ix-note">OWNED IN BOLD · SUPERSCRIPT = PIECES</p>
  </div>`;
  dialog.querySelector('.ix-close').onclick=()=>dialog.close();
 }

 openButton.onclick=()=>{build();dialog.showModal()};
 dialog.addEventListener('click',e=>{
  if(e.target!==dialog)return;
  const r=dialog.getBoundingClientRect();
  if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();
 });
})();

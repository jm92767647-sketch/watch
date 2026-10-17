/* Separate catalogue presentation. The free-view camera and gestures are unchanged. */
let presentation='list',catalogMode='brand',catalogGroup=null,catalogObserver=null;
const catalogPane=document.querySelector('#catalog-pane');
const modeTitles={brand:'브랜드별',style:'스타일별',color:'색상별'};
const catalogBrands={'폴 쥬른':'F.P. Journe','드 베튠':'De Bethune','리차드 밀':'Richard Mille','랑앤하이네':'Lang & Heyne','로랑 페리에':'Laurent Ferrier','파텍 필립':'Patek Philippe','바쉐론 콘스탄틴':'Vacheron Constantin','오데마 피게':'Audemars Piguet','랑에 운트 죄네':'A. Lange & Söhne','브레게':'Breguet','예거 르쿨트르':'Jaeger-LeCoultre','블랑팡':'Blancpain','쇼파드':'Chopard','피아제':'Piaget','불가리':'Bulgari','자케 드로':'Jaquet Droz','위블로':'Hublot','IWC':'IWC','제니스':'Zenith','롤렉스':'Rolex','까르띠에':'Cartier','오메가':'Omega','브라이틀링':'Breitling','파네라이':'Panerai','그랜드 세이코':'Grand Seiko','세이코':'Seiko','태그호이어':'TAG Heuer','론진':'Longines','크로노스위스':'Chronoswiss','레이몬드 웨일':'Raymond Weil','노모스':'NOMOS Glashütte','해밀턴':'Hamilton'};
const catalogColors={'골드 · 화이트 다이얼':'Gold · White Dial','실버 · 화이트 다이얼':'Silver · White Dial','실버 · 블랙 다이얼':'Silver · Black Dial','실버 · 블루 다이얼':'Silver · Blue Dial','실버 · 특이 색상 다이얼':'Silver · Other Dial Colors','골드 · 특이 색상 다이얼':'Gold · Other Dial Colors','스켈레톤 다이얼':'Skeleton Dial'};
function catalogLabel(label,kind=catalogMode){return (kind==='brand'?catalogBrands:kind==='color'?catalogColors:{})[label]||label;}
function catalogGroups(kind=catalogMode){
 const allowed=id=>!filtered()||(isOn('minimum')&&W[id].minimum)||(isOn('limited')&&W[id].limited);
 if(kind==='brand'){
  const brands=new Map();for(const id of D.groups.brand.flatMap(g=>g.ids)){const name=W[id].brand;if(!brands.has(name))brands.set(name,[]);if(allowed(id)&&!brands.get(name).includes(id))brands.get(name).push(id);}
  return [...brands].map(([label,ids])=>({label,ids})).filter(g=>g.ids.length);
 }
 return D.groups[kind].map(g=>({label:g.label,ids:g.ids.filter(allowed)})).filter(g=>g.ids.length);
}
function catalogNav(){document.querySelectorAll('nav [data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===(presentation==='list'?catalogMode:mode)));}
function catalogPhoto(id){const photo=window.FULL_PHOTOS[id];return flipped.has(id)&&photo.opposite?photo.opposite:photo;}
function catalogArt(id){const p=catalogPhoto(id);return `<svg viewBox="${p.viewBox.join(' ')}" role="img" aria-label="${esc(W[id].name)} 스트랩 전체 사진"><image width="${p.dimensions[0]}" height="${p.dimensions[1]}" data-src="${esc(p.previewPath||p.path)}"/></svg>`;}
function loadCatalogCard(card){const image=card.querySelector('image');if(image&&!image.hasAttribute('href')){image.onload=()=>image.dataset.loaded='true';image.onerror=()=>image.dataset.loaded='error';image.setAttribute('href',image.dataset.src);}}
function fitCatalog(){
 const grid=catalogPane.querySelector('.catalog-products');if(!grid)return;
 const n=grid.children.length,mobile=matchMedia('(max-width:760px)').matches;
 if(mobile){grid.style.cssText='';return;}
 const rows=n>1?2:1,columns=Math.ceil(n/rows),width=grid.parentElement.clientWidth,height=grid.parentElement.clientHeight;
 const stageHeight=Math.max(64,Math.min((height-(rows-1)*6)/rows-44,((width-(columns-1)*6)/columns)/.6669167292));
 grid.style.setProperty('--catalog-columns',columns);grid.style.setProperty('--catalog-art-height',stageHeight+'px');grid.style.setProperty('--catalog-card-width',(stageHeight*.6669167292)+'px');
}
function renderCatalog(){
 catalogObserver?.disconnect();const groups=catalogGroups();const group=groups.find(g=>g.label===catalogGroup);catalogNav();catalogPane.dataset.mode=catalogMode;
 if(!group){catalogGroup=null;const split=catalogMode==='color'?groups.length:Math.ceil(groups.length/2),column=gs=>`<div class="catalog-column">${gs.map(g=>`<button class="catalog-entry" data-group="${esc(g.label)}"><span>${esc(catalogLabel(g.label))}</span></button>`).join('')}</div>`;catalogPane.innerHTML=`<div class="catalog-directory">${column(groups.slice(0,split))}${catalogMode==='color'?'':column(groups.slice(split))}</div>`;}
 else{
  catalogPane.innerHTML=`<div class="catalog-group-head"><button id="catalog-back" aria-label="뒤로가기"><svg viewBox="0 0 32 24" fill="none" aria-hidden="true"><path d="M30 12H3M13 2 3 12l10 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button><h2>${esc(catalogLabel(group.label))}</h2><span>${group.ids.length}</span></div><div class="catalog-products-area"><div class="catalog-products">${group.ids.map(id=>`<article class="catalog-card" data-watch="${id}"><div class="catalog-photo">${catalogArt(id)}${window.FULL_PHOTOS[id].opposite?`<button class="catalog-flip" data-catalog-flip="${id}" aria-label="${esc(W[id].name)} 반대면 보기" aria-pressed="${flipped.has(id)}">↻</button>`:''}</div><div class="catalog-caption"><span>${esc(catalogLabel(W[id].brand,'brand'))}</span><h3>${esc(modelName(W[id].name))}</h3></div></article>`).join('')}</div></div>`;
  fitCatalog();
  if('IntersectionObserver' in window){catalogObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)loadCatalogCard(e.target);else e.target.querySelector('image')?.removeAttribute('href');}),{root:catalogPane,rootMargin:'250px'});catalogPane.querySelectorAll('.catalog-card').forEach(card=>catalogObserver.observe(card));}
  else catalogPane.querySelectorAll('.catalog-card').forEach(loadCatalogCard);
 }
 catalogPane.scrollTop=0;
}
function setPresentation(next){
 if(next===presentation)return;presentation=next;document.body.dataset.presentation=next;
 viewport.inert=next==='list';viewport.setAttribute('aria-hidden',String(next==='list'));
 document.querySelectorAll('[data-presentation-button]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.presentationButton===next)));
 if(next==='list'){catalogMode=mode;catalogGroup=null;renderCatalog();}
 else{
  mode='brand';lockedId=null;buildLayout();target.z=overviewZoom();target.x=target.y=0;bound(target);Object.assign(camera,target);geometryKey='';draw(performance.now());wake();catalogNav();
 }
}
document.querySelectorAll('[data-presentation-button]').forEach(b=>b.onclick=()=>setPresentation(b.dataset.presentationButton));
document.querySelectorAll('nav [data-mode]').forEach(button=>{const original=button.onclick;button.onclick=()=>{if(presentation==='free')original();else{catalogMode=button.dataset.mode;catalogGroup=null;renderCatalog();}};});
['minimum','limited'].forEach(key=>{const button=$('#'+key),original=button.onclick;button.onclick=()=>{if(presentation==='free')original();else{button.setAttribute('aria-pressed',String(!isOn(key)));prepare();$('#count').textContent=allIds().length;renderCatalog();}};});
function syncNumberOrder(){const group=$('#number-order');group.dataset.order=numberByCount?'count':'position';group.querySelectorAll('[data-number-order]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.numberOrder==='count')===numberByCount)));}
const originalNumbers=$('#numbers').onclick;$('#numbers').onclick=()=>{if(presentation==='list'){mode=catalogMode;prepare();}originalNumbers();syncNumberOrder();};
document.querySelectorAll('[data-number-order]').forEach(button=>button.onclick=()=>{if((button.dataset.numberOrder==='count')!==numberByCount)$('#number-sort').onclick();syncNumberOrder();});
catalogPane.onclick=e=>{
 const group=e.target.closest('[data-group]');if(group){catalogGroup=group.dataset.group;renderCatalog();return;}
 if(e.target.closest('#catalog-back')){catalogGroup=null;renderCatalog();return;}
 const flip=e.target.closest('[data-catalog-flip]');if(flip){const id=Number(flip.dataset.catalogFlip);if(flipped.has(id))flipped.delete(id);else flipped.add(id);const card=flip.closest('.catalog-card');card.querySelector('svg').outerHTML=catalogArt(id);flip.setAttribute('aria-pressed',String(flipped.has(id)));loadCatalogCard(card);}
};
window.addEventListener('resize',()=>{if(presentation==='list'){fitCatalog();setTimeout(catalogNav,180);}});
viewport.inert=true;viewport.setAttribute('aria-hidden','true');renderCatalog();

const D=window.COLLECTION,$=s=>document.querySelector(s),W=D.watches;
let mode='brand',level=0,index=0,selected=D.groups.brand[0].ids[0],rows=[],focusGroups=[];
const flipped = new Set();
const aliases=[['폴 쥬른',['폴 쥬른']],['드 베튠',['드 베튠']],['리차드 밀',['리차드 밀']],['랑앤하이네',['랑앤하이네']],['로랑 페리에',['로랑 페리에']],['파텍 필립',['파텍필립','파텍 필립']],['바쉐론 콘스탄틴',['VC','바쉐론']],['오데마 피게',['AP','오데마']],['랑에 운트 죄네',['랑에']],['브레게',['브레게']],['예거 르쿨트르',['JL']],['블랑팡',['블랑팡']],['쇼파드',['쇼파드']],['피아제',['피아제']],['불가리',['불가리']],['자케 드로',['자케 드로']],['위블로',['위블로']],['IWC',['IWC']],['제니스',['제니스']],['롤렉스',['롤렉스']],['까르띠에',['까르띠에']],['오메가',['오메가']],['브라이틀링',['브라이틀링']],['파네라이',['파네라이']],['그랜드 세이코',['그랜드 세이코']],['세이코',['세이코']],['태그호이어',['태그호이어']],['론진',['론진']],['크로노스위스',['크로노스위스']],['레이몬드 웨일',['레이몬드']],['노모스',['노모스']],['해밀턴',['해밀턴']]];
Object.values(W).forEach(w=>w.brand=aliases.find(([,xs])=>xs.some(x=>w.name.startsWith(x)))?.[0]||w.name);
const shortBrands={'폴 쥬른':'FPJ','드 베튠':'DB','리차드 밀':'RM','랑앤하이네':'L&H','로랑 페리에':'LF','파텍 필립':'PP','바쉐론 콘스탄틴':'VC','오데마 피게':'AP','랑에 운트 죄네':'ALS','브레게':'Breguet','예거 르쿨트르':'JLC','블랑팡':'BP','쇼파드':'Chopard','피아제':'Piaget','불가리':'Bvlgari','자케 드로':'JD','위블로':'Hublot','IWC':'IWC','제니스':'Zenith','롤렉스':'Rolex','까르띠에':'Cartier','오메가':'Omega','브라이틀링':'Breitling','파네라이':'Panerai','그랜드 세이코':'GS','세이코':'Seiko','태그호이어':'TAG','론진':'Longines','크로노스위스':'CS','레이몬드 웨일':'RW','노모스':'Nomos','해밀턴':'Hamilton'};
Object.assign(shortBrands,{'브레게':'BRG','쇼파드':'CHP','피아제':'PIA','불가리':'BVL','위블로':'HUB','제니스':'ZEN','롤렉스':'RLX','까르띠에':'CRT','오메가':'OMG','브라이틀링':'BRT','파네라이':'PAN','세이코':'SKO','론진':'LGS','노모스':'NOM','해밀턴':'HMT'});
function modelName(name){const match=aliases.flatMap(([brand,prefixes])=>[brand,...prefixes]).sort((a,b)=>b.length-a.length).find(prefix=>name.startsWith(prefix));return match?name.slice(match.length).trim().replace(/^X 부틸라이넨 /,'× 부틸라이넨 '):name;}
const compactModels={107:'루미노르',83:'리베르소 노난티엠',92:'데피 클래식 퓨잡',97:'레전드 다이버',75:'RO 점보',19:'씨마스터 300',100:'노틸러스',94:'옥토 피니시모',10:'헥터 살몬',50:'발롱 블루',66:'SLGH 017',96:'SBGP 001',3:'포르투기저',113:'네비타이머',15:'노틸러스',25:'골든일립스',80:'마린 알람',79:'마린 크로노',2:'데이데이트',99:'데이데이트',85:'GMT2 펩시',55:'db25',73:'퍼페추얼 캘린더',81:'월드 타임',60:'메티에다르',117:'삭소니아 씬',90:'클래식 투르비옹',106:'칼라트라바',4:'클래식 7147',62:'파일럿 타입 20',56:'히스토릭 트리플 캘린더',110:'퍼페추얼 크로노',24:'똑뛰 모노푸셔 크로노',74:'크로노스코프',22:'SSB 479',57:'kind of magic',64:'메티에다르 스켈레톤',65:'줄스오데마 미닛리피터',95:'RO 오픈워크',17:'RO 퍼페추얼 캘린더',48:'듀오미터 퀀텀루나'};

const styleCodes={'MINIMAL':'MI','CLASSIC':'CL','COLORFUL':'CO','MILITARY (+MEAN)':'ML','MASCULINE BRACELET':'MB','ELEGANT MASCULINE BRACELET':'EM','ELEGANT BRACELET':'EB','MASCULINE':'MA','ELEGANT MASCULINE GOLD BRACELET':'EG','ELEGANT GOLD BRACELET':'GB','FANCY':'FA','ARTISTIC BEAUTY':'AB','NOBLE CLASSIC':'NC','CLASSIC CALENDAR':'CC','SYMMETRY COMPLICATION':'SC','ASYMMETRY COMPLICATION':'AC','VINTAGE COMPLICATION':'VC','NEO VINTAGE COMPLICATION':'NV','MECHANICAL BEAUTY':'MC'};
function displayModel(w){return compactModels[w.id]||modelName(w.name)}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function prepare(){
 rows=[];focusGroups=[];
 if(filtered()){
  const ordered=D.groups[mode].flatMap(g=>g.ids);
  for(const [key,label] of [['minimum','최적화된 최소 컬렉션 6개'],['limited','50개 미만 극소수 한정생산판']]){
   if(isOn(key))rows.push({label,emphasis:key,ids:ordered.filter(id=>W[id][key])});
  }
  focusGroups=rows.map(g=>({...g}));return;
 }
 for(const g of D.groups[mode]){
  if(mode==='style'&&rows.at(-1)?.row===g.row){rows.at(-1).ids.push(...g.ids);rows.at(-1).label+=' · '+g.label}
  else rows.push({...g,ids:[...g.ids]});
  for(const id of g.ids){const label=mode==='brand'?W[id].brand:g.label;if(focusGroups.at(-1)?.label===label)focusGroups.at(-1).ids.push(id);else focusGroups.push({label,ids:[id]})}
 }
}
function card(id,first=false,span=1){
 const w=W[id],full=(window.FULL_PHOTOS||{})[id];
 let dial=w.dialArt;
 if(level===1&&dial?.subjectBounds){const [x,y,right,bottom]=dial.subjectBounds,margin=(bottom-y)*.025;dial={...dial,viewBox:[x-margin,y-margin,right-x+margin*2,bottom-y+margin*2]};}
 const photo=level>1?(level===4&&flipped.has(id)&&full?.opposite?full.opposite:full):dial;
 const tag=mode==='brand'?w.brand:w.style;
 const imagePath=photo?(level===0?photo.previewPath:level===1||level===4?photo.detailPath:photo.previewPath)||photo.path:w.image;
 const imageSource=photo?imagePath+'?v='+photo.version:imagePath;
 const artType=level>1?'full-photo':'dial-photo';
 const art=photo?.viewBox?`<svg class="watch-art ${artType}" role="img" aria-label="${esc(w.name)} · ${level>1?'전체':'다이얼'} 사진${level===4&&flipped.has(id)?' · 반대면':''}" viewBox="${photo.viewBox.join(' ')}"><image onload="this.parentElement.dataset.loaded='true'" onerror="this.parentElement.dataset.loaded='error'" data-src="${esc(imageSource)}" width="${photo.dimensions[0]}" height="${photo.dimensions[1]}"/></svg>`:`<img class="${artType}" src="${esc(imageSource)}" alt="${esc(w.name)} · ${level>1?'전체':'다이얼'} 사진" draggable="false">`;
 return `<button class="watch ${selected===id?'selected ':''}${w.minimum?'minimum ':''}${w.limited?'limited ':''}${mode==='brand'?'':'style-'+w.styleColor}" data-id="${id}" aria-label="${esc(w.name)}" aria-pressed="${selected===id}"><span class="tag" style="--span:${span}">${first?esc(mode==='color'&&level<=1?styleCodes[tag]:tag):''}</span>${art}<span class="label">${esc(level===4?w.name:level>1?(shortBrands[w.brand]||w.brand)+' '+displayModel(w):displayModel(w))}</span></button>`;
}
function slots(ids,color=false){
 let html='',prev='',marked=false,columns=[];
 const divider=color&&!filtered()&&ids.some(id=>W[id].styleColor==='purple')&&ids.some(id=>W[id].styleColor==='blue');
 ids.forEach((id,i)=>{
  if(divider&&!marked&&W[id].styleColor==='blue'){html+='<div class="standard" aria-label="STANDARD · 왼쪽 보라색 분류, 오른쪽 파란색 분류">STANDARD</div>';columns.push('10px');marked=true}
  const tag=mode==='brand'?W[id].brand:W[id].style;let span=1;
  while(i+span<ids.length&&(mode==='brand'?W[ids[i+span]].brand:W[ids[i+span]].style)===tag)span++;
  html+=card(id,tag!==prev,span);columns.push('minmax(0,1fr)');prev=tag;
 });
 return `<div class="slots" style="--columns:${ids.length};grid-template-columns:${columns.join(' ')}">${html}</div>`;
}
function tierSlots(ids,color=false,twoRows=false){
 if(!twoRows||ids.length===1)return slots(ids,color);
 const half=Math.ceil(ids.length/2),parts=[ids.slice(0,half),ids.slice(half)];
 return `<div class="tiered" style="--tier-columns:${half}">${parts.map(part=>`<div class="tier" style="--tier-count:${part.length}">${slots(part,color)}</div>`).join('')}</div>`;
}
function displayRow(g,i,single=false){return `<div class="display-row ${single?'single-row':''} ${g.emphasis||''}" style="--row-count:${g.ids.length}">${mode==='color'?`<div class="row-title">${esc(g.label)}</div>`:''}${single?tierSlots(g.ids,mode==='color',true):slots(g.ids,mode==='color')}</div>`}
function unifiedFocus(){return mode==='color'||(mode==='style'&&focusGroups[index]?.label==='MECHANICAL BEAUTY');}
function benefitsFromTwoRows(ids){
 if(ids.length<5||matchMedia('(max-width:760px)').matches)return false;
 const area=$('#viewport').getBoundingClientRect(),n=ids.length,columns=Math.ceil(n/2),ratio=2/3;
 const one=Math.min((Math.min(1400,area.width*.94)-16*(n-1))/n/ratio,area.height-120);
 const two=Math.min((Math.min(1600,area.width*.94)-16*(columns-1))/columns/ratio,(area.height-68)/2-77);
 return two>one;
}
function isOn(key){return $('#'+key).getAttribute('aria-pressed')==='true';}
function fitWatchLengths(){
 const arts=[...document.querySelectorAll('#scene .watch-art')];if(!arts.length)return;
 if(matchMedia('(max-width:760px)').matches)document.querySelectorAll('#scene .slots').forEach(slots=>slots.style.width='');
 if(level<=1&&!matchMedia('(max-width:760px)').matches){
  const groups=[...document.querySelectorAll('#scene .slots')];
  const viewport=$('#viewport'),vcss=getComputedStyle(viewport);
  const available=viewport.clientWidth-28;
  const measures=groups.map(slots=>{
   const items=[...slots.querySelectorAll('.watch-art')],gap=parseFloat(getComputedStyle(slots).columnGap)||0;
   const ratios=items.map(art=>art.viewBox.baseVal.width/art.viewBox.baseVal.height);
   const divider=slots.querySelector('.standard')?10:0;
   const heights=items.map(art=>parseFloat(getComputedStyle(art.closest('.watch')).gridTemplateRows.split(' ')[1]));
   return {slots,items,ratios,divider,gap,limit:Math.min(...heights,(available-divider-gap*(items.length+(divider?1:0)-1))/ratios.reduce((a,b)=>a+b,0))};
  });
  const height=Math.max(0,Math.min(...measures.map(g=>g.limit)));
  for(const g of measures){
   g.slots.style.width='max-content';g.slots.style.gridTemplateColumns=[...g.slots.children].map(el=>el.classList.contains('standard')?'10px':height*(el.querySelector('.watch-art').viewBox.baseVal.width/el.querySelector('.watch-art').viewBox.baseVal.height)+'px').join(' ');
   g.items.forEach((art,i)=>{art.style.width=height*g.ratios[i]+'px';art.style.height=height+'px';});
  }
  return;
 }
 const frames=arts.map(art=>{
  const watch=art.closest('.watch'),css=getComputedStyle(watch),box=art.viewBox.baseVal;
  const width=watch.getBoundingClientRect().width-parseFloat(css.borderLeftWidth)-parseFloat(css.borderRightWidth)-parseFloat(css.paddingLeft)-parseFloat(css.paddingRight);
  const height=parseFloat(css.gridTemplateRows.split(' ')[1]);
  const maxValue=getComputedStyle(art).maxHeight,maxHeight=maxValue.endsWith('px')?parseFloat(maxValue):Infinity;
  return {art,ratio:box.width/box.height,height:Math.min(height,width/(box.width/box.height),Number.isFinite(maxHeight)?maxHeight:Infinity)};
 });
 const height=Math.max(0,Math.min(...frames.map(f=>f.height)));
 frames.forEach(f=>{f.art.style.width=`${height*f.ratio}px`;f.art.style.height=`${height}px`;});
}

const viewport=$('#viewport'),scene=$('#scene'),motionReduced=matchMedia('(prefers-reduced-motion:reduce)');
const camera={x:0,y:0,z:1},target={x:0,y:0,z:1},pointers=new Map();
let items=[],markers=[],viewWidth=0,viewHeight=0,worldHeight=0,maxZoom=12,frameId=0,previousFrame=0,lastAssets=0,geometryKey='',dragVelocity={x:0,y:0},lastPointerTime=0,ignoreTapUntil=0;
let firstLayout=true,resizeTimer,gesture=null;
function filtered(){return isOn('minimum')||isOn('limited')}
function allIds(){return [...new Set(rows.flatMap(g=>g.ids))]}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function smooth(a,b,v){const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)}
function morph(z){return smooth(1.35,2.3,z)}
function stretch(z){return 1+morph(z)*.85+smooth(2.3,5,z)*.15}
function fullName(w){return w.brand+' '+modelName(w.name)}
function svgPhoto(photo,kind){if(!photo)return '';return `<svg class="${kind}" viewBox="${photo.viewBox.join(' ')}" role="img" aria-label="${esc(kind==='dial-layer'?'다이얼':'스트랩 전체')} 사진"><image width="${photo.dimensions[0]}" height="${photo.dimensions[1]}" data-preview="${esc(photo.previewPath||photo.path)}" data-detail="${esc(photo.detailPath||photo.previewPath||photo.path)}"/></svg>`}
function buildLayout(focusId=null,keepZoom=false){
 const oldZ=target.z;
 prepare();$('#count').textContent=allIds().length;
 scene.className='measuring';scene.dataset.mode=mode;document.body.dataset.level='0';
 scene.style.setProperty('--rows',rows.length);scene.style.setProperty('--max-columns',Math.max(...rows.map(g=>g.ids.length)));
 scene.innerHTML=rows.map((g,i)=>displayRow(g,i)).join('');fitWatchLengths();
 const origin=viewport.getBoundingClientRect();viewWidth=origin.width;viewHeight=origin.height;
 const sceneOrigin=scene.getBoundingClientRect();
 items=[...scene.querySelectorAll('.watch')].map(element=>{
  const art=element.querySelector('.watch-art'),r=art.getBoundingClientRect(),tag=element.querySelector('.tag'),tr=tag.getBoundingClientRect(),label=element.querySelector('.label'),lr=label.getBoundingClientRect();
  return {id:Number(element.dataset.id),cx:r.left-origin.left+r.width/2,cy:r.top-origin.top+r.height/2,w:r.width,h:r.height,labelOffset:lr.top-(r.top+r.height),labelFont:parseFloat(getComputedStyle(label).fontSize),tagText:tag.textContent,tagOffset:tr.top-r.top,tagWidth:tr.width,tagFont:parseFloat(getComputedStyle(tag).fontSize),className:element.className.replace(/\bwatch\b|\bselected\b/g,''),lastQuality:'',visible:false};
 });
 markers=[...scene.querySelectorAll('.row-title,.standard')].map(e=>{const r=e.getBoundingClientRect();return {text:e.textContent,x:r.left-origin.left,y:r.top-origin.top,vertical:e.classList.contains('standard')&&viewWidth>760};});
 worldHeight=Math.max(viewHeight,...items.map(i=>i.cy+i.h/2+40));
 maxZoom=clamp(viewHeight*.79/(Math.min(...items.map(i=>i.h))*1.65),3.5,14);
 scene.className='exploration';scene.style.cssText='';
 scene.innerHTML=items.map(i=>{const w=W[i.id],photo=window.FULL_PHOTOS[i.id];return `<article class="explore-watch ${i.className}" data-id="${i.id}" aria-label="${esc(w.name)}"><span class="explore-tag">${esc(i.tagText)}</span><div class="explore-art">${svgPhoto(w.dialArt,'dial-layer')}${svgPhoto(photo,'full-layer')}</div><span class="explore-label">${esc((w.minimum||w.limited?'✓ ':'')+displayModel(w))}</span><div class="explore-details style-${w.styleColor}"><p class="brand-name">${esc(w.brand)}</p><h2>${esc(modelName(w.name))}</h2><p class="style-name">${esc(w.style)}</p><p>${esc(w.color)}</p>${photo?.opposite?`<button class="flip-control" data-flip="${i.id}" aria-pressed="${flipped.has(i.id)}">↻ ${flipped.has(i.id)?'원래 면':'반대면'} 보기</button>`:''}</div></article>`;}).join('')+markers.map(m=>`<span class="board-marker">${esc(m.text)}</span>`).join('');
 items.forEach(i=>{i.element=scene.querySelector(`[data-id="${i.id}"]`);i.element.hidden=true;i.art=i.element.querySelector('.explore-art');i.dial=i.element.querySelector('.dial-layer');i.full=i.element.querySelector('.full-layer');i.tag=i.element.querySelector('.explore-tag');i.label=i.element.querySelector('.explore-label');i.details=i.element.querySelector('.explore-details');if(flipped.has(i.id))setReverse(i,false);});
 markers.forEach((m,n)=>m.element=scene.querySelectorAll('.board-marker')[n]);
 document.querySelectorAll('nav [data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===mode));
 target.z=keepZoom?clamp(oldZ,1,maxZoom):1;target.x=target.y=0;
 const focus=items.find(i=>i.id===focusId);
 if(focus){target.z=firstLayout?clamp(viewHeight*.57/(focus.h*1.65),2.5,maxZoom):target.z;target.x=viewWidth/2-focus.cx*target.z;target.y=viewHeight*.45-focus.cy*stretch(target.z)*target.z;}
 firstLayout=false;bound(target);Object.assign(camera,target);geometryKey='';lastAssets=0;draw(performance.now());wake();
}
function bound(c){
 c.z=clamp(c.z,1,maxZoom);const s=stretch(c.z);
 const edgeX=viewWidth*.4*smooth(1,1.8,c.z),edgeY=viewHeight*.24*smooth(1,1.8,c.z);
 const minX=Math.min(0,viewWidth-viewWidth*c.z)-edgeX,minY=Math.min(0,viewHeight-worldHeight*s*c.z)-edgeY;
 c.x=clamp(c.x,minX,edgeX);c.y=clamp(c.y,minY,edgeY);
 if(c.z===1){c.x=0;if(worldHeight<=viewHeight+1)c.y=0;}
}
function draw(now){
 const z=camera.z,blend=morph(z),s=stretch(z),geometry=z.toFixed(4);
 const changed=geometry!==geometryKey;geometryKey=geometry;
 let nearest=null,distance=Infinity;
 for(const i of items){
  const x=camera.x+i.cx*z,y=camera.y+i.cy*s*z,aw=i.w*z,ah=i.h*z*(1+blend*.65),shown=x+aw*.7>0&&x-aw*.7<viewWidth&&y+ah/2+130>0&&y-ah/2<viewHeight;
  if(shown!==i.visible){i.element.hidden=!shown;i.visible=shown;if(!shown)i.element.querySelectorAll('image[href]').forEach(image=>image.removeAttribute('href'));}
  if(!shown)continue;
  i.element.style.transform=`translate3d(${x-aw/2}px,${y-ah/2}px,0)`;
  if(changed||i.appliedGeometry!==geometry){
   i.appliedGeometry=geometry;i.element.style.width=aw+'px';i.element.style.height=ah+'px';i.art.style.width=aw+'px';i.art.style.height=ah+'px';
   i.dial.style.height=i.h*z+'px';i.dial.style.top=(ah-i.h*z)/2+'px';i.dial.style.opacity=1-blend;
   if(i.full){i.full.style.opacity=blend;i.full.style.height=ah+'px';}
   i.tag.style.top=(Math.min(i.tagOffset*z,-12))+'px';i.tag.style.width=i.tagWidth*z+'px';i.tag.style.fontSize=Math.min(15,i.tagFont*z)+'px';i.tag.style.opacity=1-smooth(2.1,3.5,z);i.tag.textContent=i.tagText&&mode==='color'&&z>1.6?W[i.id].style:i.tagText;
   const detail=smooth(330,410,ah);i.label.style.top=(ah+Math.min(12,i.labelOffset*z))+'px';i.label.style.width=aw+'px';i.label.style.fontSize=Math.min(13,i.labelFont*z)+'px';i.label.style.opacity=1-smooth(280,330,ah);i.label.textContent=(W[i.id].minimum||W[i.id].limited?'✓ ':'')+(z>2?(shortBrands[W[i.id].brand]||W[i.id].brand)+' ':'')+displayModel(W[i.id]);
   i.details.style.top=(ah+9)+'px';i.details.style.opacity=detail;i.details.style.visibility=detail>.01?'visible':'hidden';i.details.style.width=Math.max(aw,Math.min(300,aw*1.1))+'px';
   i.element.dataset.detail=detail>.9?'true':'false';
  }
  const d=Math.hypot(x-viewWidth/2,y-viewHeight*.45);if(d<distance){distance=d;nearest=i;}
 }
 if(nearest)selected=nearest.id;
 for(const m of markers){m.element.style.transform=`translate(${camera.x+m.x*z}px,${camera.y+m.y*s*z}px)`;m.element.style.opacity=1-smooth(1.8,3.4,z);m.element.style.writingMode=m.vertical?'vertical-rl':'horizontal-tb';}
 scene.dataset.zoom=z.toFixed(3);scene.dataset.center=selected;
 if(now-lastAssets>160){loadNearby();lastAssets=now;}
}
function loadNearby(){
 for(const i of items){if(!i.visible)continue;
  for(const [svg,enabled] of [[i.dial,morph(camera.z)<1],[i.full,morph(camera.z)>0]]){if(!svg)continue;const image=svg.querySelector('image');if(!enabled){image.removeAttribute('href');continue;}const quality=i.h*camera.z>300?'detail':'preview',src=image.dataset[quality];if(image.getAttribute('href')!==src){image.onload=()=>{image.dataset.loaded='true'};image.onerror=()=>{image.dataset.loaded='error';if(!image.dataset.retried){image.dataset.retried='true';setTimeout(()=>{if(image.isConnected&&!image.closest('.explore-watch').hidden){image.removeAttribute('href');image.setAttribute('href',src);}},600);}};image.setAttribute('href',src);}}
 }
}
function wake(){if(!frameId){previousFrame=performance.now();frameId=requestAnimationFrame(tick)}}
function tick(now){
 frameId=0;const dt=Math.min(40,now-previousFrame);previousFrame=now;
 const ease=motionReduced.matches?1:1-Math.exp(-dt/65);
 camera.x+=(target.x-camera.x)*ease;camera.y+=(target.y-camera.y)*ease;camera.z+=(target.z-camera.z)*ease;
 if(!pointers.size&&(Math.abs(dragVelocity.x)>.02||Math.abs(dragVelocity.y)>.02)){target.x+=dragVelocity.x*dt;target.y+=dragVelocity.y*dt;const decay=Math.exp(-dt/110);dragVelocity.x*=decay;dragVelocity.y*=decay;bound(target);}
 const active=Math.abs(target.x-camera.x)>.05||Math.abs(target.y-camera.y)>.05||Math.abs(target.z-camera.z)>.0001||Math.abs(dragVelocity.x)>.02||Math.abs(dragVelocity.y)>.02;
 if(!active)Object.assign(camera,target);draw(now);if(active)frameId=requestAnimationFrame(tick);else loadNearby();
}
function zoomAt(z,px,py){
 const old=target.z,newZ=clamp(z,1,maxZoom);if(newZ===old)return;
 const wx=(px-target.x)/old,wy=(py-target.y)/(old*stretch(old));
 target.z=newZ;target.x=px-wx*newZ;target.y=py-wy*newZ*stretch(newZ);bound(target);dragVelocity={x:0,y:0};wake();
}
viewport.addEventListener('wheel',e=>{
 e.preventDefault();const r=viewport.getBoundingClientRect(),unit=e.deltaMode===1?16:e.deltaMode===2?viewHeight:1;
 const delta=clamp(e.deltaY*unit,-120,120),speed=e.ctrlKey?.008:.00135;
 zoomAt(target.z*Math.exp(-delta*speed),e.clientX-r.left,e.clientY-r.top);hideHint();
},{passive:false});
function pointerShape(){const p=[...pointers.values()];return p.length>1?{x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2,d:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)}:{...p[0],d:0};}
viewport.addEventListener('pointerdown',e=>{
 if(e.button>0||e.target.closest('.flip-control'))return;
 const r=viewport.getBoundingClientRect();pointers.set(e.pointerId,{x:e.clientX-r.left,y:e.clientY-r.top});viewport.setPointerCapture(e.pointerId);gesture=pointerShape();lastPointerTime=performance.now();dragVelocity={x:0,y:0};viewport.classList.add('dragging');
});
viewport.addEventListener('pointermove',e=>{
 if(!pointers.has(e.pointerId))return;
 const r=viewport.getBoundingClientRect();pointers.set(e.pointerId,{x:e.clientX-r.left,y:e.clientY-r.top});const next=pointerShape(),now=performance.now(),dt=Math.max(8,now-lastPointerTime);
 if(pointers.size>1&&gesture.d>0){zoomAt(target.z*next.d/Math.max(1,gesture.d),gesture.x,gesture.y);target.x+=next.x-gesture.x;target.y+=next.y-gesture.y;dragVelocity={x:0,y:0};}
 else if(pointers.size===1){const dx=next.x-gesture.x,dy=next.y-gesture.y;target.x+=dx;target.y+=dy;dragVelocity={x:clamp(dx/dt,-1.7,1.7),y:clamp(dy/dt,-1.7,1.7)};}
 bound(target);gesture=next;lastPointerTime=now;hideHint();wake();
});
function release(e){if(!pointers.has(e.pointerId))return;const wasPinch=pointers.size>1;pointers.delete(e.pointerId);if(pointers.size){gesture=pointerShape();dragVelocity={x:0,y:0};}else{gesture=null;viewport.classList.remove('dragging');if(wasPinch||performance.now()-lastPointerTime>80)dragVelocity={x:0,y:0};}wake();}
viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',e=>{dragVelocity={x:0,y:0};release(e)});
viewport.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});
viewport.addEventListener('gesturechange',e=>e.preventDefault(),{passive:false});
viewport.onkeydown=e=>{const moves={ArrowLeft:[80,0],ArrowRight:[-80,0],ArrowUp:[0,80],ArrowDown:[0,-80]};if(moves[e.key]){e.preventDefault();target.x+=moves[e.key][0];target.y+=moves[e.key][1];bound(target);wake();}else if(['+','=','-','0','Home'].includes(e.key)){e.preventDefault();if(e.key==='0'||e.key==='Home'){target.z=1;target.x=target.y=0;wake();}else zoomAt(target.z*(e.key==='-'?1/1.16:1.16),viewWidth/2,viewHeight/2);}};
function setReverse(i,animate=true){const photo=window.FULL_PHOTOS[i.id],use=flipped.has(i.id)?photo.opposite:photo;if(!i.full||!use)return;i.full.setAttribute('viewBox',use.viewBox.join(' '));const image=i.full.querySelector('image');image.setAttribute('width',use.dimensions[0]);image.setAttribute('height',use.dimensions[1]);image.dataset.preview=use.previewPath||use.path;image.dataset.detail=use.detailPath||use.previewPath||use.path;image.removeAttribute('href');const button=i.element.querySelector('.flip-control');button.textContent='↻ '+(flipped.has(i.id)?'원래 면':'반대면')+' 보기';button.setAttribute('aria-pressed',flipped.has(i.id));if(animate&&!motionReduced.matches)i.full.animate([{opacity:.2,transform:'scaleX(.05)'},{opacity:1,transform:'scaleX(1)'}],{duration:280,easing:'ease-out'});loadNearby();}
scene.addEventListener('click',e=>{const button=e.target.closest('[data-flip]');if(!button)return;const id=Number(button.dataset.flip),item=items.find(i=>i.id===id);if(flipped.has(id))flipped.delete(id);else flipped.add(id);setReverse(item);});
function hideHint(){$('#gesture-hint').style.opacity='0'}
document.querySelectorAll('nav [data-mode]').forEach(button=>button.onclick=()=>{const focus=selected;mode=button.dataset.mode;buildLayout(focus,true)});
['minimum','limited'].forEach(key=>$('#'+key).onclick=()=>{$('#'+key).setAttribute('aria-pressed',!isOn(key));buildLayout();});
function numberContent(){
 const ids=allIds(),set=new Set(ids),brands=new Map();for(const id of ids)brands.set(W[id].brand,(brands.get(W[id].brand)||0)+1);
 const sections=[['브랜드별',[...brands]],['스타일별',D.groups.style.map(g=>[g.label,g.ids.filter(id=>set.has(id)).length])],['색상별',D.groups.color.map(g=>[g.label,g.ids.filter(id=>set.has(id)).length])]];
 $('#number-total').textContent=`현재 컬렉션 ${ids.length}개 · 브랜드 ${brands.size}개 · 스타일 ${sections[1][1].filter(([,n])=>n).length}개 · 색상 ${sections[2][1].filter(([,n])=>n).length}개`;
 $('#number-panels').innerHTML=sections.map(([title,counts])=>`<section class="number-section"><h3>${title}</h3><ul>${counts.map(([label,n])=>`<li><span>${esc(label)}</span><strong>${n}</strong></li>`).join('')}</ul></section>`).join('');
}
$('#numbers').onclick=()=>{numberContent();$('#number-dialog').showModal()};$('#close-numbers').onclick=()=>$('#number-dialog').close();
for(const key of ['major','independent'])$('#'+key).innerHTML=D[key].map((s,i)=>`<div class="rank-item"><strong>${String(i+1).padStart(2,'0')}</strong><p>${esc(s.replace(/^\d+\.\s*/,''))}</p></div>`).join('');
$('#rank').onclick=()=>{$('#rank-dialog').showModal();$('#rank').setAttribute('aria-pressed','true')};$('#rank-dialog').addEventListener('close',()=>$('#rank').setAttribute('aria-pressed','false'));$('#close-rank').onclick=()=>$('#rank-dialog').close();
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}));
let previousWidth=0,previousHeight=0;
function handleResize(){const r=viewport.getBoundingClientRect();if(Math.abs(r.width-previousWidth)<1&&Math.abs(r.height-previousHeight)<1)return;previousWidth=r.width;previousHeight=r.height;clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>buildLayout(selected,true),120);}
window.addEventListener('resize',handleResize);if(typeof ResizeObserver==='function')new ResizeObserver(handleResize).observe(viewport);
buildLayout(100);previousWidth=viewWidth;previousHeight=viewHeight;

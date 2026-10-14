const D=window.COLLECTION,$=s=>document.querySelector(s),W=D.watches;
let mode='brand',level=0,index=0,selected=D.groups.brand[0].ids[0],rows=[],focusGroups=[];
const flipped = new Set();
const aliases=[['폴 쥬른',['폴 쥬른']],['드 베튠',['드 베튠']],['리차드 밀',['리차드 밀']],['랑앤하이네',['랑앤하이네']],['로랑 페리에',['로랑 페리에']],['파텍 필립',['파텍필립','파텍 필립']],['바쉐론 콘스탄틴',['VC','바쉐론']],['오데마 피게',['AP','오데마']],['랑에 운트 죄네',['랑에']],['브레게',['브레게']],['예거 르쿨트르',['JL']],['블랑팡',['블랑팡']],['쇼파드',['쇼파드']],['피아제',['피아제']],['불가리',['불가리']],['자케 드로',['자케 드로']],['위블로',['위블로']],['IWC',['IWC']],['제니스',['제니스']],['롤렉스',['롤렉스']],['까르띠에',['까르띠에']],['오메가',['오메가']],['브라이틀링',['브라이틀링']],['파네라이',['파네라이']],['그랜드 세이코',['그랜드 세이코']],['세이코',['세이코']],['태그호이어',['태그호이어']],['론진',['론진']],['크로노스위스',['크로노스위스']],['레이몬드 웨일',['레이몬드']],['노모스',['노모스']],['해밀턴',['해밀턴']]];
Object.values(W).forEach(w=>w.brand=aliases.find(([,xs])=>xs.some(x=>w.name.startsWith(x)))?.[0]||w.name);
const shortBrands={'폴 쥬른':'FPJ','드 베튠':'DB','리차드 밀':'RM','랑앤하이네':'L&H','로랑 페리에':'LF','파텍 필립':'PP','바쉐론 콘스탄틴':'VC','오데마 피게':'AP','랑에 운트 죄네':'ALS','브레게':'Breguet','예거 르쿨트르':'JLC','블랑팡':'BP','쇼파드':'Chopard','피아제':'Piaget','불가리':'Bvlgari','자케 드로':'JD','위블로':'Hublot','IWC':'IWC','제니스':'Zenith','롤렉스':'Rolex','까르띠에':'Cartier','오메가':'Omega','브라이틀링':'Breitling','파네라이':'Panerai','그랜드 세이코':'GS','세이코':'Seiko','태그호이어':'TAG','론진':'Longines','크로노스위스':'CS','레이몬드 웨일':'RW','노모스':'Nomos','해밀턴':'Hamilton'};
Object.assign(shortBrands,{'브레게':'BRG','쇼파드':'CHP','피아제':'PIA','불가리':'BVL','위블로':'HUB','제니스':'ZEN','롤렉스':'RLX','까르띠에':'CRT','오메가':'OMG','브라이틀링':'BRT','파네라이':'PAN','세이코':'SKO','론진':'LGS','노모스':'NOM','해밀턴':'HMT'});
function modelName(name){const match=aliases.flatMap(([brand,prefixes])=>[brand,...prefixes]).sort((a,b)=>b.length-a.length).find(prefix=>name.startsWith(prefix));return match?name.slice(match.length).trim().replace(/^X 부틸라이넨 /,'× 부틸라이넨 '):name;}
const compactModels={97:'레전드 다이버',75:'RO 점보',19:'씨마스터 300',100:'노틸러스',94:'옥토 피니시모',10:'헥터 살몬',50:'발롱 블루',66:'SLGH 017',96:'SBGP 001',3:'포르투기저',113:'네비타이머',15:'노틸러스',25:'골든일립스',80:'마린 알람',79:'마린 크로노',2:'데이데이트',99:'데이데이트',85:'GMT2 펩시',55:'db25',73:'퍼페추얼 캘린더',81:'월드 타임',60:'메티에다르',117:'삭소니아 씬',90:'클래식 투르비옹',106:'칼라트라바',4:'클래식 7147',62:'파일럿 타입 20',56:'히스토릭 트리플 캘린더',110:'퍼페추얼 크로노',24:'똑뛰 모노푸셔 크로노',74:'크로노스코프',22:'SSB 479',57:'kind of magic',64:'메티에다르 스켈레톤',65:'줄스오데마 미닛리피터',95:'RO 오픈워크',17:'RO 퍼페추얼 캘린더',48:'듀오미터 퀀텀루나'};
W[17].name=W[17].name.replace('로얄오크','RO');
const styleCodes={'MINIMAL':'MI','CLASSIC':'CL','COLORFUL':'CO','MILITARY (+MEAN)':'ML','MASCULINE BRACELET':'MB','ELEGANT MASCULINE BRACELET':'EM','ELEGANT BRACELET':'EB','MASCULINE':'MA','ELEGANT MASCULINE GOLD BRACELET':'EG','ELEGANT GOLD BRACELET':'GB','FANCY':'FA','ARTISTIC BEAUTY':'AB','NOBLE CLASSIC':'NC','CLASSIC CALENDAR':'CC','SYMMETRY COMPLICATION':'SC','ASYMMETRY COMPLICATION':'AC','VINTAGE COMPLICATION':'VC','NEO VINTAGE COMPLICATION':'NV','MECHANICAL BEAUTY':'MC'};
function displayModel(w){return compactModels[w.id]||modelName(w.name)}
let ignoreClickUntil=0,dragStart=null;
$('#viewport').addEventListener('pointerdown',e=>{if(level===0||e.button!==0||e.target.closest('a,#flip-watch'))return;dragStart={x:e.clientX,y:e.clientY,id:e.pointerId};});
$('#viewport').addEventListener('pointermove',e=>{if(dragStart&&Math.abs(e.clientX-dragStart.x)>12&&Math.abs(e.clientX-dragStart.x)>Math.abs(e.clientY-dragStart.y))$('#viewport').setPointerCapture(e.pointerId);});
$('#viewport').addEventListener('pointerup',e=>{if(!dragStart)return;const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;dragStart=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3){ignoreClickUntil=Date.now()+350;page(dx<0?1:-1);}});
$('#viewport').addEventListener('pointercancel',()=>dragStart=null);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function accepted(id){return (isOn('minimum')&&W[id].minimum)||(isOn('limited')&&W[id].limited)||(!isOn('minimum')&&!isOn('limited'))}
function filtered(){return isOn('minimum')||isOn('limited')}
function allIds(){return [...new Set(rows.flatMap(g=>g.ids))]}
function pageCount(){return level===0?1:level===1?rows.length:level===2?(mode==='color'?rows.length:focusGroups.length):allIds().length}
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
 const photo=level>0?(level===3&&flipped.has(id)&&full?.opposite?full.opposite:full):w.dialArt;
 const tag=mode==='brand'?w.brand:w.style;
 const imageSource=photo?photo.path+'?v='+photo.version:w.image;
 const artType=level>0?'full-photo':'dial-photo';
 const art=photo?.viewBox?`<svg class="watch-art ${artType}" role="img" aria-label="${esc(w.name)} · ${level>0?'전체':'다이얼'} 사진${level===3&&flipped.has(id)?' · 반대면':''}" viewBox="${photo.viewBox.join(' ')}"><image onload="this.parentElement.dataset.loaded='true'" onerror="this.parentElement.dataset.loaded='error'" href="${esc(imageSource)}" width="${photo.dimensions[0]}" height="${photo.dimensions[1]}"/></svg>`:`<img class="${artType}" src="${esc(imageSource)}" alt="${esc(w.name)} · ${level>0?'전체':'다이얼'} 사진" draggable="false">`;
 return `<button class="watch ${selected===id?'selected ':''}${w.minimum?'minimum ':''}${w.limited?'limited ':''}${mode==='brand'?'':'style-'+w.styleColor}" data-id="${id}" aria-label="${esc(w.name)}" aria-pressed="${selected===id}"><span class="tag" style="--span:${span}">${first?esc(mode==='color'&&level===0?styleCodes[tag]:tag):''}</span>${art}<span class="label">${esc(level===3?w.name:level>0?(shortBrands[w.brand]||w.brand)+' '+displayModel(w):displayModel(w))}</span></button>`;
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
 if(level===0&&mode!=='brand'&&!matchMedia('(max-width:760px)').matches){
  const groups=[...document.querySelectorAll('#scene .slots')];
  const viewport=$('#viewport'),vcss=getComputedStyle(viewport);
  const available=viewport.clientWidth-parseFloat(vcss.paddingLeft)-parseFloat(vcss.paddingRight);
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
new ResizeObserver(fitWatchLengths).observe($('#viewport'));
function render(){
 prepare();const ids=allIds();if(!ids.includes(selected))selected=ids[0];const total=pageCount();index=Math.max(0,Math.min(index,total-1));
 $('#count').textContent=ids.length;let html='';
 if(!ids.length)html='<p class="empty">표시할 시계가 없습니다.</p>';
 else if(level===0)html=rows.map((g,i)=>displayRow(g,i)).join('');
 else if(level===1)html=displayRow(rows[index],index,true);
 else if(level===2){const g=mode==='color'?rows[index]:focusGroups[index];if(unifiedFocus())html=displayRow(g,index,true);else html=`<div class="focus"><h2 class="${mode==='style'?W[g.ids[0]].styleColor:''}">${esc(g.label)}</h2>${tierSlots(g.ids,false,benefitsFromTwoRows(g.ids))}</div>`}
 else{selected=ids[index];const w=W[selected],photo=(window.FULL_PHOTOS||{})[selected],source=flipped.has(selected)?photo?.opposite?.sourceUrl:photo?.sourceUrl;html=`<div class="focus solo${photo?.opposite?' reversible':''}"><h2>${esc(w.name)}</h2>${slots([selected])}<div class="watch-details">${photo?.opposite?`<button id="flip-watch" aria-pressed="${flipped.has(selected)}">↻ 뒤집기 · ${flipped.has(selected)?'원래 면 보기':'반대면 보기'}</button>`:''}${source?`<a class="photo-source" href="${esc(source)}" target="_blank" rel="noopener noreferrer">사진 출처 ↗</a>`:''}</div></div>`}
 $('#scene').dataset.mode=mode;document.body.dataset.level=level;$('#scene').style.setProperty('--rows',rows.length);$('#scene').style.setProperty('--max-columns',Math.max(...rows.map(g=>g.ids.length)));$('#prev').hidden=$('#next').hidden=level===0;$('#position').hidden=level===0;$('#scene').innerHTML=html;$('#viewport').scrollTop=0;if(matchMedia('(max-width:760px)').matches)window.scrollTo(0,0);fitWatchLengths();
 if($('#flip-watch'))$('#flip-watch').onclick=()=>{if(flipped.has(selected))flipped.delete(selected);else flipped.add(selected);render();$('#scene .watch-art')?.classList.add('flip-reveal');};
 $('#position').textContent=`${total?index+1:0} / ${total}`;$('#prev').disabled=index<=0||!ids.length;$('#next').disabled=index>=total-1||!ids.length;
 $('#minus').disabled=level===0;$('#plus').disabled=level===3;
 document.querySelectorAll('#levels [data-level]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.level)===level));
 $('#levels [data-level="2"]').textContent=mode==='brand'&&!filtered()?'한 브랜드':'한 분류';
 document.querySelectorAll('nav [data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===mode));
}
function zoom(n){n=Math.max(0,Math.min(3,n));if(n===level)return;prepare();const ids=allIds(),row=Math.max(0,rows.findIndex(g=>g.ids.includes(selected)));index=n===3?Math.max(0,ids.indexOf(selected)):n===2?Math.max(0,(mode==='color'?rows:focusGroups).findIndex(g=>g.ids.includes(selected))):n===1?row:0;level=n;render()}
document.querySelectorAll('nav [data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;index=0;$('#viewport').scrollTop=0;render()});document.querySelectorAll('#levels [data-level]').forEach(b=>b.onclick=()=>zoom(Number(b.dataset.level)));$('#plus').onclick=()=>zoom(level+1);$('#minus').onclick=()=>zoom(level-1);['minimum','limited'].forEach(k=>$('#'+k).onclick=()=>{$('#'+k).setAttribute('aria-pressed',!isOn(k));index=0;render()});$('#scene').onclick=e=>{if(Date.now()<ignoreClickUntil)return;const c=e.target.closest('[data-id]');if(!c)return;selected=Number(c.dataset.id);document.querySelectorAll('.watch').forEach(b=>{b.classList.toggle('selected',Number(b.dataset.id)===selected);b.setAttribute('aria-pressed',Number(b.dataset.id)===selected)})};$('#scene').ondblclick=e=>{if(e.target.closest('[data-id]'))zoom(3)};
function page(delta){prepare();const ids=allIds(),total=pageCount();index=Math.max(0,Math.min(total-1,index+delta));selected=level===0?rows[0]?.ids[0]:level===1?rows[index]?.ids[0]:level===2?(mode==='color'?rows:focusGroups)[index]?.ids[0]:ids[index];render()}
$('#prev').onclick=()=>page(-1);$('#next').onclick=()=>page(1);let lastWheel=0;$('#viewport').addEventListener('wheel',e=>{if(e.ctrlKey||e.shiftKey)return;if(matchMedia('(max-width:760px)').matches&&$('#viewport').scrollHeight>$('#viewport').clientHeight)return;e.preventDefault();if(Date.now()-lastWheel<280)return;lastWheel=Date.now();zoom(level+(e.deltaY<0?1:-1))},{passive:false});$('#viewport').onkeydown=e=>{if(e.key==='+'||e.key==='='){zoom(level+1);e.preventDefault()}if(e.key==='-'){zoom(level-1);e.preventDefault()}if(e.key==='ArrowRight')page(1);if(e.key==='ArrowLeft')page(-1)};
for(const key of ['major','independent'])$('#'+key).innerHTML=D[key].map((s,i)=>`<div class="rank-item"><strong>${String(i+1).padStart(2,'0')}</strong><p>${esc(s.replace(/^\d+\.\s*/,''))}</p></div>`).join('');$('#rank').onclick=()=>{$('#rank-dialog').showModal();$('#rank').setAttribute('aria-pressed','true');};$('#rank-dialog').addEventListener('close',()=>$('#rank').setAttribute('aria-pressed','false'));$('#close-rank').onclick=()=>$('#rank-dialog').close();$('#rank-dialog').onclick=e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close()}};render();




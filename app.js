const D=window.COLLECTION,$=s=>document.querySelector(s),W=D.watches;
let mode='brand',level=0,index=0,selected=D.groups.brand[0].ids[0],rows=[],focusGroups=[];
const flipped = new Set();
const aliases=[['폴 쥬른',['폴 쥬른']],['드 베튠',['드 베튠']],['리차드 밀',['리차드 밀']],['랑앤하이네',['랑앤하이네']],['로랑 페리에',['로랑 페리에']],['파텍 필립',['파텍필립','파텍 필립']],['바쉐론 콘스탄틴',['VC','바쉐론']],['오데마 피게',['AP','오데마']],['랑에 운트 죄네',['랑에']],['브레게',['브레게']],['예거 르쿨트르',['JL']],['블랑팡',['블랑팡']],['쇼파드',['쇼파드']],['피아제',['피아제']],['불가리',['불가리']],['자케 드로',['자케 드로']],['위블로',['위블로']],['IWC',['IWC']],['제니스',['제니스']],['롤렉스',['롤렉스']],['까르띠에',['까르띠에']],['오메가',['오메가']],['브라이틀링',['브라이틀링']],['파네라이',['파네라이']],['그랜드 세이코',['그랜드 세이코']],['세이코',['세이코']],['태그호이어',['태그호이어']],['론진',['론진']],['크로노스위스',['크로노스위스']],['레이몬드 웨일',['레이몬드']],['노모스',['노모스']],['해밀턴',['해밀턴']]];
Object.values(W).forEach(w=>w.brand=aliases.find(([,xs])=>xs.some(x=>w.name.startsWith(x)))?.[0]||w.name);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function accepted(id){return ($('#minimum').checked&&W[id].minimum)||($('#limited').checked&&W[id].limited)||(!$('#minimum').checked&&!$('#limited').checked)}
function filtered(){return $('#minimum').checked||$('#limited').checked}
function allIds(){return [...new Set(rows.flatMap(g=>g.ids))]}
function pageCount(){return level===0?Math.ceil(rows.length/3):level===1?rows.length:level===2?focusGroups.length:allIds().length}
function prepare(){
 rows=[];focusGroups=[];
 if(filtered()){
  const ordered=D.groups[mode].flatMap(g=>g.ids);
  for(const [key,label] of [['minimum','최적화된 최소 컬렉션 6개'],['limited','50개 미만 극소수 한정생산판']]){
   if($('#'+key).checked)rows.push({label,emphasis:key,ids:ordered.filter(id=>W[id][key])});
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
 const art=photo?.viewBox?`<svg class="watch-art ${artType}" role="img" aria-label="${esc(w.name)} · ${level>0?'전체':'다이얼'} 사진${level===3&&flipped.has(id)?' · 반대면':''}" viewBox="${photo.viewBox.join(' ')}"><image href="${esc(imageSource)}" width="${photo.dimensions[0]}" height="${photo.dimensions[1]}"/></svg>`:`<img class="${artType}" src="${esc(imageSource)}" alt="${esc(w.name)} · ${level>0?'전체':'다이얼'} 사진" draggable="false">`;
 return `<button class="watch ${selected===id?'selected ':''}${w.minimum?'minimum ':''}${w.limited?'limited ':''}${mode==='brand'?'':'style-'+w.styleColor}" data-id="${id}" aria-label="${esc(w.name)}" aria-pressed="${selected===id}"><span class="tag" style="--span:${span}">${first?esc(tag):''}</span>${art}<span class="label">${esc(w.name)}</span></button>`;
}
function slots(ids,color=false){
 let html='',prev='',marked=false,columns=[];
 const divider=color&&!filtered()&&ids.some(id=>W[id].styleColor==='purple')&&ids.some(id=>W[id].styleColor==='blue');
 ids.forEach((id,i)=>{
  if(divider&&!marked&&W[id].styleColor==='blue'){html+='<div class="standard" aria-label="STANDARD · 왼쪽 보라색 분류, 오른쪽 파란색 분류">STANDARD</div>';columns.push('18px');marked=true}
  const tag=mode==='brand'?W[id].brand:W[id].style;let span=1;
  while(i+span<ids.length&&(mode==='brand'?W[ids[i+span]].brand:W[ids[i+span]].style)===tag)span++;
  html+=card(id,tag!==prev,span);columns.push('minmax(0,1fr)');prev=tag;
 });
 return `<div class="slots" style="grid-template-columns:${columns.join(' ')}">${html}</div>`;
}
function displayRow(g,i,single=false){const label=mode==='style'&&!filtered()?`스타일별 · ${i+1}번째 줄`:g.label;return `<div class="display-row ${single?'single-row':''} ${g.emphasis||''}"><div class="row-title"><span class="line-number">${String(i+1).padStart(2,'0')}</span>${esc(label)}</div>${slots(g.ids,mode==='color')}</div>`}
function fitWatchLengths(){
 const arts=[...document.querySelectorAll('#scene .watch-art')];if(!arts.length)return;
 const frames=arts.map(art=>{
  const watch=art.closest('.watch'),css=getComputedStyle(watch),box=art.viewBox.baseVal;
  const width=watch.getBoundingClientRect().width-parseFloat(css.borderLeftWidth)-parseFloat(css.borderRightWidth)-parseFloat(css.paddingLeft)-parseFloat(css.paddingRight);
  const height=parseFloat(css.gridTemplateRows.split(' ')[1]);
  const maxHeight=parseFloat(getComputedStyle(art).maxHeight);
  return {art,ratio:box.width/box.height,height:Math.min(height,width/(box.width/box.height),Number.isFinite(maxHeight)?maxHeight:Infinity)};
 });
 const height=Math.max(0,Math.min(...frames.map(f=>f.height)));
 frames.forEach(f=>{f.art.style.width=`${height*f.ratio}px`;f.art.style.height=`${height}px`;});
}
new ResizeObserver(fitWatchLengths).observe($('#viewport'));
function render(){
 prepare();const ids=allIds();if(!ids.includes(selected))selected=ids[0];const total=pageCount();index=Math.max(0,Math.min(index,total-1));
 $('#count').textContent=`${ids.length} WATCHES`;
 $('#description').textContent=filtered()?'선택한 강조 시계를 색상별로 한 줄에 모아 보기':{brand:'독립 워치메이커를 맨 위에 · 메이저 브랜드는 원본 계급·줄바꿈 순서',style:'분류명부터 다음 분류명까지 · 원본 디자인 순서',color:'원본 7줄 · STANDARD 왼쪽은 보라, 오른쪽은 파랑'}[mode];
 $('#style-legend').hidden=mode==='brand';$('#color-order').hidden=mode!=='color'||filtered();$('#viewport').classList.toggle('filtered',filtered());let html='';
 if(!ids.length)html='<p class="empty">표시할 시계가 없습니다.</p>';
 else if(level===0)html=rows.slice(index*3,index*3+3).map((g,i)=>displayRow(g,index*3+i)).join('');
 else if(level===1)html=displayRow(rows[index],index,true);
 else if(level===2){const g=focusGroups[index];html=`<div class="focus"><h2 class="${mode==='style'?W[g.ids[0]].styleColor:''}">${esc(g.label)}</h2>${slots(g.ids)}</div>`}
 else{selected=ids[index];const w=W[selected],photo=(window.FULL_PHOTOS||{})[selected],source=flipped.has(selected)?photo?.opposite?.sourceUrl:photo?.sourceUrl;html=`<div class="focus solo${photo?.opposite?' reversible':''}"><h2>${esc(w.name)}</h2>${slots([selected])}<div class="watch-details">${photo?.opposite?`<button id="flip-watch" aria-pressed="${flipped.has(selected)}">↻ 뒤집기 · ${flipped.has(selected)?'원래 면 보기':'반대면 보기'}</button>`:''}${source?`<a class="photo-source" href="${esc(source)}" target="_blank" rel="noopener noreferrer">사진 출처 ↗</a>`:''}</div></div>`}
 $('#scene').dataset.mode=mode;$('#scene').innerHTML=html;$('#viewport').scrollTop=0;fitWatchLengths();
 if($('#flip-watch'))$('#flip-watch').onclick=()=>{if(flipped.has(selected))flipped.delete(selected);else flipped.add(selected);render();$('#scene .watch-art')?.classList.add('flip-reveal');};
 $('#position').textContent=`${total?index+1:0} / ${total}`;$('#prev').disabled=index<=0||!ids.length;$('#next').disabled=index>=total-1||!ids.length;
 $('#minus').disabled=level===0;$('#plus').disabled=level===3;
 document.querySelectorAll('[data-level]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.level)===level));
 $('[data-level="2"]').textContent=mode==='brand'&&!filtered()?'한 브랜드':'한 분류';
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===mode));
}
function zoom(n){n=Math.max(0,Math.min(3,n));if(n===level)return;prepare();const ids=allIds(),row=Math.max(0,rows.findIndex(g=>g.ids.includes(selected)));index=n===3?Math.max(0,ids.indexOf(selected)):n===2?Math.max(0,focusGroups.findIndex(g=>g.ids.includes(selected))):n===1?row:Math.floor(row/3);level=n;render()}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;index=0;$('#viewport').scrollTop=0;render()});document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>zoom(Number(b.dataset.level)));$('#plus').onclick=()=>zoom(level+1);$('#minus').onclick=()=>zoom(level-1);['minimum','limited'].forEach(k=>$('#'+k).onchange=()=>{index=0;render()});$('#scene').onclick=e=>{const c=e.target.closest('[data-id]');if(!c)return;selected=Number(c.dataset.id);document.querySelectorAll('.watch').forEach(b=>{b.classList.toggle('selected',Number(b.dataset.id)===selected);b.setAttribute('aria-pressed',Number(b.dataset.id)===selected)})};$('#scene').ondblclick=e=>{if(e.target.closest('[data-id]'))zoom(3)};
function page(delta){prepare();const ids=allIds(),total=pageCount();index=Math.max(0,Math.min(total-1,index+delta));selected=level===0?rows[index*3]?.ids[0]:level===1?rows[index]?.ids[0]:level===2?focusGroups[index]?.ids[0]:ids[index];render()}
$('#prev').onclick=()=>page(-1);$('#next').onclick=()=>page(1);let lastWheel=0;$('#viewport').addEventListener('wheel',e=>{if(e.ctrlKey||e.shiftKey)return;e.preventDefault();if(Date.now()-lastWheel<280)return;lastWheel=Date.now();zoom(level+(e.deltaY<0?1:-1))},{passive:false});$('#viewport').onkeydown=e=>{if(e.key==='+'||e.key==='='){zoom(level+1);e.preventDefault()}if(e.key==='-'){zoom(level-1);e.preventDefault()}if(e.key==='ArrowRight')page(1);if(e.key==='ArrowLeft')page(-1)};
for(const key of ['major','independent'])$('#'+key).innerHTML=D[key].map((s,i)=>`<div class="rank-item"><strong>${String(i+1).padStart(2,'0')}</strong><p>${esc(s.replace(/^\d+\.\s*/,''))}</p></div>`).join('');$('#rank').onclick=()=>$('#rank-dialog').showModal();$('#close-rank').onclick=()=>$('#rank-dialog').close();$('#rank-dialog').onclick=e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close()}};render();




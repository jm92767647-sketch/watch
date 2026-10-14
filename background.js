const clouds=[...document.querySelectorAll('.color-cloud')];
const calm=matchMedia('(prefers-reduced-motion:reduce)');
const initial=[[50,50],[40,28],[-50,50],[-50,0],[50,-50],[0,-50],[-50,-50]];
const transform=([x,y])=>`translate(${x}vw,${y}dvh)`;
let animations=[],generation=0;
function drift(cloud,from,token){
 if(calm.matches||token!==generation)return;
 // Choose the opposite quadrant so both axes cross most of the viewport.
 const opposite=value=>value===0?(Math.random()<.5?-1:1):-Math.sign(value);
 const to=[opposite(from[0])*(42+Math.random()*16),opposite(from[1])*(42+Math.random()*16)];
 const dx=to[0]-from[0],dy=to[1]-from[1],length=Math.hypot(dx,dy),bend=(Math.random()<.5?-1:1)*(4+Math.random()*6);
 const middle=[(from[0]+to[0])/2-dy/length*bend,(from[1]+to[1])/2+dx/length*bend];
 const animation=cloud.animate([{transform:transform(from)},{transform:transform(middle),offset:.5},{transform:transform(to)}],{duration:16000+Math.random()*12000,easing:'cubic-bezier(.45,0,.55,1)',fill:'forwards'});
 animations.push(animation);
 animation.finished.then(()=>{if(token!==generation)return;cloud.style.transform=transform(to);animation.cancel();animations=animations.filter(a=>a!==animation);drift(cloud,to,token);}).catch(()=>{});
}
function restart(){generation++;animations.forEach(a=>a.cancel());animations=[];clouds.forEach((cloud,i)=>{cloud.style.transform=transform(initial[i]);drift(cloud,initial[i],generation);});}
calm.addEventListener('change',restart);restart();

const clouds=[...document.querySelectorAll('.color-cloud')];
const calm=matchMedia('(prefers-reduced-motion:reduce)');
const initial=[[50,50],[40,28],[-50,50],[-50,0],[50,-50],[0,-50],[-50,-50]];
const transform=([x,y])=>`translate(${x}vw,${y}dvh)`;
let animations=[],generation=0;
function drift(cloud,from,token){
 if(calm.matches||token!==generation)return;
 const to=[Math.random()*100-50,Math.random()*100-50];
 const animation=cloud.animate([{transform:transform(from)},{transform:transform(to)}],{duration:55000+Math.random()*45000,easing:'cubic-bezier(.45,0,.55,1)',fill:'forwards'});
 animations.push(animation);
 animation.finished.then(()=>{if(token!==generation)return;cloud.style.transform=transform(to);animation.cancel();animations=animations.filter(a=>a!==animation);drift(cloud,to,token);}).catch(()=>{});
}
function restart(){generation++;animations.forEach(a=>a.cancel());animations=[];clouds.forEach((cloud,i)=>{cloud.style.transform=transform(initial[i]);drift(cloud,initial[i],generation);});}
calm.addEventListener('change',restart);restart();

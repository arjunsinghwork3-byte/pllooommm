document.addEventListener('DOMContentLoaded',()=>{
const screens={landing,howTo,game,win,lose};
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score');
const couponEl=document.getElementById('coupon');

let score=0,active=false,balls=[],frame=0,spawnInt;
const sprite=new Image();
sprite.src='sprite.png';

const chaosWords=['VENDORS','PLANNING','DECORATORS'];
const player={x:180,y:540,w:16,h:16,speed:6};

// Music
const audio=new AudioContext();
function music(){const o=audio.createOscillator();o.type='sawtooth';o.frequency.value=110;
const g=audio.createGain();g.gain.value=0.04;o.connect(g).connect(audio.destination);o.start();return o;}
let osc;

startBtn.onclick=()=>show('howTo');
playBtn.onclick=startGame;
retryBtn.onclick=startGame;
rewardBtn.onclick=()=>window.location.href='https://ploomm.com';
leftBtn.onclick=()=>player.x-=player.speed;
rightBtn.onclick=()=>player.x+=player.speed;

document.addEventListener('keydown',e=>{
if(!active)return;
if(e.key==='ArrowLeft')player.x-=player.speed;
if(e.key==='ArrowRight')player.x+=player.speed;
});

function show(s){Object.values(screens).forEach(x=>x.classList.add('hidden'));screens[s].classList.remove('hidden');}

function spawn(){
balls.push({
x:Math.random()*340+20,y:0,
type:Math.random()>0.7?'ploomm':'chaos',
text:Math.random()>0.7?'PLOOMM':chaosWords[Math.floor(Math.random()*chaosWords.length)],
speed:1
});
}

function loop(){
if(!active)return;
ctx.clearRect(0,0,400,600);
ctx.drawImage(sprite,(frame%2)*16,0,16,16,player.x,player.y,32,32);
frame++;

balls.forEach((b,i)=>{
b.y+=b.speed;
ctx.fillStyle=b.type==='ploomm'?'#f97316':'#38bdf8';
ctx.beginPath();ctx.arc(b.x,b.y,18,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#000';ctx.fillText(b.text,b.x-20,b.y+3);
if(b.y>player.y&&b.x>player.x&&b.x<player.x+32){
if(b.type==='ploomm'){score+=10;scoreEl.textContent=score;if(score>=100)winGame();}
else{loseGame();}
balls.splice(i,1);
}
});
requestAnimationFrame(loop);
}

function startGame(){
score=0;balls=[];scoreEl.textContent=0;active=true;
show('game');audio.resume();osc=music();
clearInterval(spawnInt);spawnInt=setInterval(spawn,1400);loop();
}

function winGame(){
active=false;osc.stop();
couponEl.textContent='PLOOMM-'+Math.random().toString(36).substring(2,8).toUpperCase();
show('win');
}

function loseGame(){
active=false;osc.stop();
show('lose');
}

show('landing');
});

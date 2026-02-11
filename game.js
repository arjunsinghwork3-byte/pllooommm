document.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const landing = document.getElementById("landing");
const gameScreen = document.getElementById("game");
const loseScreen = document.getElementById("lose");
const winScreen = document.getElementById("win");

const scoreEl = document.getElementById("score");
const couponEl = document.getElementById("coupon");

let score = 0;
let balls = [];
let running = false;
let animationId;
let spawnTimer;

const sprite = new Image();
sprite.src = "sprite.png";

let frameIndex = 0;
let frameTick = 0;

const player = {
    x: 180,
    y: 540,
    w: 32,
    h: 32,
    speed: 6
};

const chaosWords = ["VENDORS","PLANNING","DECORATORS"];

document.getElementById("startBtn").onclick = startGame;
document.getElementById("retryBtn").onclick = startGame;
document.getElementById("leftBtn").onclick = () => move(-1);
document.getElementById("rightBtn").onclick = () => move(1);

document.addEventListener("keydown", e => {
    if(!running) return;
    if(e.key==="ArrowLeft") move(-1);
    if(e.key==="ArrowRight") move(1);
});

function move(dir){
    player.x += dir * player.speed;
    if(player.x < 0) player.x = 0;
    if(player.x > canvas.width - player.w) player.x = canvas.width - player.w;
}

function startGame(){
    landing.classList.add("hidden");
    loseScreen.classList.add("hidden");
    winScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    score = 0;
    scoreEl.textContent = score;
    balls = [];
    running = true;

    startMusic();

    clearInterval(spawnTimer);
    spawnTimer = setInterval(spawnBall, 1500);

    loop();
}

function spawnBall(){
    const isPloomm = Math.random() > 0.4;

    balls.push({
        x: Math.random() * 360 + 20,
        y: -20,
        radius: 18,
        type: isPloomm ? "ploomm" : "chaos",
        text: isPloomm ? "PLOOMM" : chaosWords[Math.floor(Math.random()*chaosWords.length)],
        speed: 2
    });
}

function loop(){
    if(!running) return;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Sprite animation every 12 frames
    frameTick++;
    if(frameTick >= 12){
        frameIndex = (frameIndex + 1) % 2;
        frameTick = 0;
    }

    ctx.drawImage(sprite, frameIndex*16,0,16,16,
        player.x, player.y, player.w, player.h);

    for(let i = balls.length-1; i >= 0; i--){
        let ball = balls[i];
        ball.y += ball.speed;

        ctx.fillStyle = ball.type==="ploomm" ? "#f97316" : "#38bdf8";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = "#000";
        ctx.font = "8px Arial";
        ctx.fillText(ball.text, ball.x - 20, ball.y + 3);

        // Proper collision detection
        if(
            ball.y + ball.radius > player.y &&
            ball.y - ball.radius < player.y + player.h &&
            ball.x + ball.radius > player.x &&
            ball.x - ball.radius < player.x + player.w
        ){
            if(ball.type==="ploomm"){
                score += 10;
                scoreEl.textContent = score;
                if(score >= 100){
                    endGame(true);
                }
            } else {
                endGame(false);
            }
            balls.splice(i,1);
        }

        if(ball.y > canvas.height + 30){
            balls.splice(i,1);
        }
    }

    animationId = requestAnimationFrame(loop);
}

function endGame(win){
    running = false;
    cancelAnimationFrame(animationId);
    clearInterval(spawnTimer);
    stopMusic();

    gameScreen.classList.add("hidden");

    if(win){
        couponEl.textContent =
            "PLOOMM-" +
            Math.random().toString(36).substring(2,8).toUpperCase();
        winScreen.classList.remove("hidden");
    } else {
        loseScreen.classList.remove("hidden");
    }
}

/* 80s melody loop */
let audioCtx;
let melodyTimer;

const melody = [262, 330, 392, 330];

function startMusic(){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let i = 0;

    melodyTimer = setInterval(()=>{
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "square";
        osc.frequency.value = melody[i];
        gain.gain.value = 0.05;

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.18);

        i = (i + 1) % melody.length;

    }, 220);
}

function stopMusic(){
    if(melodyTimer) clearInterval(melodyTimer);
    if(audioCtx) audioCtx.close();
}

});

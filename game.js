document.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const landing = document.getElementById("landing");
const avatarBox = document.getElementById("avatarBox");
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
    x: 160,
    y: 520,
    w: 48,
    h: 48,
    speed: 6
};

const chaosWords = [
"Follow-ups","Pricing","Stakeholders",
"Compliance","Dropouts","Changes",
"Overruns","Delays"
];

function showScreen(screen){
    document.querySelectorAll(".screen").forEach(s=>{
        s.classList.add("hidden");
        s.classList.remove("active");
    });
    screen.classList.remove("hidden");
    screen.classList.add("active");
}

document.getElementById("startBtn").onclick = () => {
    showScreen(avatarBox);
    setTimeout(()=>{
        startGame();
        showScreen(gameScreen);
    },2000);
};

document.getElementById("continueBtn").onclick = () => {
    showScreen(winScreen);
};

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
    score = 0;
    scoreEl.textContent = score;
    balls = [];
    running = true;
    spawnTimer = setInterval(spawnBall,1500);
    loop();
}

function spawnBall(){
    const isOrange = Math.random() > 0.4;
    balls.push({
        x: Math.random() * 350 + 20,
        y: -20,
        radius: 22,
        type: isOrange ? "orange" : "chaos",
        text: isOrange ? "PLOOMM" :
        chaosWords[Math.floor(Math.random()*chaosWords.length)],
        speed: 2
    });
}

function loop(){
    if(!running) return;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    frameTick++;
    if(frameTick >= 12){
        frameIndex = (frameIndex + 1) % 2;
        frameTick = 0;
    }

    ctx.drawImage(sprite, frameIndex*16,0,16,16,
        player.x, player.y, player.w, player.h);

    for(let i=balls.length-1;i>=0;i--){
        let ball = balls[i];
        ball.y += ball.speed;

        ctx.fillStyle = ball.type==="orange" ? "#f97316" : "#000000";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "10px Arial";
        ctx.fillText(ball.text, ball.x-25, ball.y+4);

        if(
            ball.y + ball.radius > player.y &&
            ball.y - ball.radius < player.y + player.h &&
            ball.x + ball.radius > player.x &&
            ball.x - ball.radius < player.x + player.w
        ){
            if(ball.type==="orange"){
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

    if(win){
        couponEl.textContent =
            "PLOOMM-" +
            Math.random().toString(36).substring(2,8).toUpperCase();
        showScreen(winScreen);
    } else {
        showScreen(loseScreen);
    }
}

});

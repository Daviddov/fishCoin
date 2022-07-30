const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

const screenWidth = 1000;
const screenHeight = 600;
const characterWidth = 50;
const characterHeight = 50;
const enemyColor = 'rgb(100,222, 99)'
const wallWidth = 20;
const wallHeight = 300;
let level = 1;
let pearls = 0;
let replaceEnemy = 0;
let lives = 3;
const sprites = {};
class GameCharacter {
    constructor(x, y, width, height, speedY, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedY = speedY;
        this.speedX = 0;
        this.color = color;

    }

    moveY() {
        if (this.y < 0) { this.y = 0 }
        if (this.y > screenHeight - this.height) { this.h = screenHeight - this.height }
        if (this.y <= 0 || this.y + this.height >= screenHeight) {
            this.speedY *= -1;
        }
        this.y += this.speedY;
    }

    moveX() {
        if (this.x < 0) { this.x = 0 }
        if (this.y > screenWidth - this.width) { this.h = screenWidth - this.width }
        if (this.x <= 0 || this.x + this.width >= screenWidth) {
            this.speedX *= -1;
        }
        this.x += this.speedX;
    }
}

const player = new GameCharacter(0, 60, characterWidth, characterHeight, 0, 'red');
const flag = new GameCharacter(screenWidth - characterWidth, screenHeight - characterHeight, characterWidth, characterHeight, 0, 'green');

const pearl = new GameCharacter(100, 100, characterWidth, characterHeight, 0, 'yellow');
const enemies = [
    new GameCharacter(200, 0, characterWidth, characterHeight, .4, enemyColor),
    new GameCharacter(400, 300, characterWidth, characterHeight, 1, enemyColor),
    new GameCharacter(600, 100, characterWidth, characterHeight, 2, enemyColor),
    new GameCharacter(800, 50, characterWidth, characterHeight, 3, enemyColor)
]
let playerName = prompt('Enter your name')
let playerDataGame = {playerName:playerName, level:level, points:pearls, }
addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowDown':
            player.speedY = 6
            break;
        case 'ArrowUp':
            player.speedY = -6
            break;
        case 'ArrowLeft':
            player.speedX = -6
            sprites.player.src = 'images/fish.png'
            break;
        case 'ArrowRight':
            player.speedX = 6
            sprites.player.src = 'images/fish2.png'
            break;
    }
})
addEventListener('keyup', event => {
    player.speedY = 1;
    player.speedX = 0;
}
)
const enemySecImage = [
    'images/enemy.png', 'images/enemy1.png', 'images/enemy2.png',
    'images/enemy3.png', 'images/enemy4.png', 'images/enemy5.png',
    'images/enemy6.png', 'images/enemy7.png',
]

function loadSprites() {
    sprites.player = new Image();
    sprites.player.src = 'images/fish2.png'

    sprites.enemy = new Image();
    sprites.enemy.src = enemySecImage[0]

    sprites.background = new Image();
    sprites.background.src = "images/aquarium.jpg"

    sprites.flag = new Image();
    sprites.flag.src = 'images/chest.png'

    sprites.pearl = new Image();
    sprites.pearl.src = 'images/pearl.png'



}
function checkCollision(eleme1, eleme2) {
    if (eleme1.x + eleme2.width >= eleme2.x && eleme1.x < eleme2.x + eleme2.width &&
        eleme1.y + eleme2.height >= eleme2.y && eleme1.y < eleme2.y + eleme2.height) {
        return true;
    }
}
function youWin() {
    player.x = 0
    player.y = 60
    replaceEnemy++ 
    replaceEnemy = replaceEnemy % 8
    sprites.enemy.src = enemySecImage[replaceEnemy]
    level++ 
    enemies.forEach((enemy) => {
        enemy.speedY *= 1.2
    })

}
function youLoose() {
    player.x = 0
    player.y = 60
    lives--
    if (lives == 0){gameOver()};
}
function gameOver() {
    lives = 3;
    level = 1;
    pearls = 0;
}
function step() {
    update();
    draw();
    window.requestAnimationFrame(step);
}

function update() {
    player.moveX()
    player.moveY()

    if (checkCollision(player, flag) == true) {
        youWin()
    }
    if (checkCollision(player, pearl) == true) {
        pearls += level
        new Audio('./bubble.mp3').play()
        pearl.x = Math.floor(Math.random() * screenWidth)
        pearl.y = Math.floor(Math.random() * screenHeight)
    }

    enemies.forEach((enemy) => {
        enemy.moveY();
        if (checkCollision(player, enemy) == true) {
            youLoose()
        }

    })

}

function draw() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    ctx.drawImage(sprites.background, 0, 0, screenWidth, screenHeight);
    ctx.font = '30px cursive';
    ctx.fillText(🧍‍♂️: ${playerName}  💖: ${lives} `Level: ${level} 💰: ${pearls}`, 700, 50);
    ctx.drawImage(sprites.player, player.x, player.y, player.width, player.height);
    ctx.drawImage(sprites.flag, flag.x, flag.y, flag.width, flag.height);
    ctx.drawImage(sprites.pearl, pearl.x, pearl.y, pearl.width, pearl.height);

    enemies.forEach((enemy) => {
        ctx.drawImage(sprites.enemy, enemy.x, enemy.y, enemy.width, enemy.height);
    })

}

loadSprites()
step();

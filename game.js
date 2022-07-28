const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

const screenWidth = 1000;
const screenHeight = 600;
const characterWidth = 50;
const characterHeight = 50;
const enemyColor = 'rgb(100,222, 99)'
const wallWidth = 20;
const wallHeight = 300;
let level = 1
let coins = 0
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
        if (this.y < 0 || this.y + this.height >= screenHeight) {
            this.speedY *= -1;
        }
        this.y += this.speedY;
    }

    moveX() {
        if (this.x < 0 || this.x + this.width >= screenWidth) {
            this.speedX *= -1;
        }
        this.x += this.speedX;
    }
}

const player = new GameCharacter(0, 60, characterWidth, characterHeight, 0, 'red');
const flag = new GameCharacter(screenWidth-characterWidth, screenHeight / 2 - characterHeight / 2, characterWidth, characterHeight, 0, 'green');

const coin = new GameCharacter(100, 100, characterWidth, characterHeight, 0, 'yellow');
const enemies = [
    new GameCharacter(200, 0, characterWidth, characterHeight, .5, enemyColor),
    new GameCharacter(400, 300, characterWidth, characterHeight, 1, enemyColor),
    new GameCharacter(600, 100, characterWidth, characterHeight, 2, enemyColor),
    new GameCharacter(800, 50, characterWidth, characterHeight, 3, enemyColor)
]


addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowDown':
            player.speedY = 4
            break;
        case 'ArrowUp':
            player.speedY = -4
            break;
        case 'ArrowLeft':
            player.speedX = -4
            sprites.player.src = 'images/fish.png'
            break;
        case 'ArrowRight':
            player.speedX = 4
            sprites.player.src = 'images/fish2.png'
            break;
    }
})
addEventListener('keyup', event => {
    player.speedY = 1;
    player.speedX = 0;
}
)

function loadSprites() {
    sprites.player = new Image();
    sprites.player.src = 'images/fish2.png'

    sprites.enemy = new Image();
    sprites.enemy.src = 'images/enemy.png'

    sprites.background = new Image();
    sprites.background.src = "images/aquarium.jpg"

    sprites.flag = new Image();
    sprites.flag.src = 'images/chest.png'

    sprites.coin = new Image();
    sprites.coin.src = 'images/coin.jpg'
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
    level++
    enemies.forEach((enemy) => {
        enemy.speedY *= 1.5
           })
}
function youLoose() {
    player.x = 0
    player.y = 60
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
    if (checkCollision(player, coin) == true) {
        coins += level
        coin.x = Math.floor(Math.random() * screenWidth)
        coin.y = Math.floor(Math.random() * screenHeight)
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
    ctx.fillText(`Level: ${level} Coins: ${coins}`, 10, 50);
    ctx.drawImage(sprites.player, player.x, player.y, player.width, player.height);
    ctx.drawImage(sprites.flag, flag.x, flag.y, flag.width, flag.height);
    ctx.drawImage(sprites.coin, coin.x, coin.y, coin.width, coin.height);

    enemies.forEach((enemy) => {
        ctx.drawImage(sprites.enemy, enemy.x, enemy.y, enemy.width, enemy.height);
    })

}

loadSprites()
step();

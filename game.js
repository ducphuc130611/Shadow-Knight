// ============================================================
// SHADOW KNIGHT
// STEP 1 - BASIC RPG
// ============================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// ============================================================
// CANVAS
// ============================================================

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// ============================================================
// WORLD
// ============================================================

const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 2000;

const TILE_SIZE = 50;


// ============================================================
// PLAYER
// ============================================================

const player = {

    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,

    width: 32,
    height: 32,

    speed: 4,

    hp: 100,
    maxHp: 100,

    level: 1,

    xp: 0,
    maxXp: 100,

    gold: 0

};


// ============================================================
// CAMERA
// ============================================================

const camera = {

    x: 0,
    y: 0

};


// ============================================================
// KEYBOARD
// ============================================================

const keys = {};

window.addEventListener("keydown", function(event) {

    keys[event.key.toLowerCase()] = true;

});

window.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;

});


// ============================================================
// OBSTACLES
// ============================================================

const obstacles = [

    {
        x: 500,
        y: 400,
        width: 200,
        height: 100
    },

    {
        x: 1000,
        y: 700,
        width: 250,
        height: 100
    },

    {
        x: 1500,
        y: 300,
        width: 150,
        height: 250
    },

    {
        x: 2000,
        y: 1000,
        width: 300,
        height: 100
    },

    {
        x: 700,
        y: 1400,
        width: 100,
        height: 300
    }

];


// ============================================================
// COLLISION
// ============================================================

function isColliding(rect1, rect2) {

    return (

        rect1.x < rect2.x + rect2.width &&

        rect1.x + rect1.width > rect2.x &&

        rect1.y < rect2.y + rect2.height &&

        rect1.y + rect1.height > rect2.y

    );

}


function canMoveTo(newX, newY) {

    const newPlayer = {

        x: newX,
        y: newY,

        width: player.width,
        height: player.height

    };


    for (const obstacle of obstacles) {

        if (isColliding(newPlayer, obstacle)) {

            return false;

        }

    }


    return true;

}


// ============================================================
// PLAYER MOVEMENT
// ============================================================

function updatePlayer() {

    let dx = 0;
    let dy = 0;


    // WASD

    if (keys["w"]) {
        dy -= player.speed;
    }

    if (keys["s"]) {
        dy += player.speed;
    }

    if (keys["a"]) {
        dx -= player.speed;
    }

    if (keys["d"]) {
        dx += player.speed;
    }


    // Arrow keys

    if (keys["arrowup"]) {
        dy -= player.speed;
    }

    if (keys["arrowdown"]) {
        dy += player.speed;
    }

    if (keys["arrowleft"]) {
        dx -= player.speed;
    }

    if (keys["arrowright"]) {
        dx += player.speed;
    }


    // Normalize diagonal movement

    if (dx !== 0 && dy !== 0) {

        dx *= 0.7071;
        dy *= 0.7071;

    }


    // X collision

    if (canMoveTo(player.x + dx, player.y)) {

        player.x += dx;

    }


    // Y collision

    if (canMoveTo(player.x, player.y + dy)) {

        player.y += dy;

    }


    // World boundaries

    player.x = Math.max(
        0,
        Math.min(
            WORLD_WIDTH - player.width,
            player.x
        )
    );


    player.y = Math.max(
        0,
        Math.min(
            WORLD_HEIGHT - player.height,
            player.y
        )
    );

}


// ============================================================
// CAMERA
// ============================================================

function updateCamera() {

    camera.x =
        player.x +
        player.width / 2 -
        canvas.width / 2;


    camera.y =
        player.y +
        player.height / 2 -
        canvas.height / 2;


    // Camera boundaries

    camera.x = Math.max(
        0,
        Math.min(
            WORLD_WIDTH - canvas.width,
            camera.x
        )
    );


    camera.y = Math.max(
        0,
        Math.min(
            WORLD_HEIGHT - canvas.height,
            camera.y
        )
    );

}


// ============================================================
// DRAW WORLD
// ============================================================

function drawWorld() {

    ctx.fillStyle = "#477a3a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Grid

    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;


    const startX =
        Math.floor(camera.x / TILE_SIZE) * TILE_SIZE;

    const startY =
        Math.floor(camera.y / TILE_SIZE) * TILE_SIZE;


    for (
        let x = startX;
        x < camera.x + canvas.width;
        x += TILE_SIZE
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x - camera.x,
            0
        );

        ctx.lineTo(
            x - camera.x,
            canvas.height
        );

        ctx.stroke();

    }


    for (
        let y = startY;
        y < camera.y + canvas.height;
        y += TILE_SIZE
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y - camera.y
        );

        ctx.lineTo(
            canvas.width,
            y - camera.y
        );

        ctx.stroke();

    }

}


// ============================================================
// DRAW OBSTACLES
// ============================================================

function drawObstacles() {

    for (const obstacle of obstacles) {

        const screenX =
            obstacle.x - camera.x;

        const screenY =
            obstacle.y - camera.y;


        ctx.fillStyle = "#31552b";

        ctx.fillRect(
            screenX,
            screenY,
            obstacle.width,
            obstacle.height
        );


        ctx.strokeStyle = "#1b3218";

        ctx.lineWidth = 4;

        ctx.strokeRect(
            screenX,
            screenY,
            obstacle.width,
            obstacle.height
        );

    }

}


// ============================================================
// DRAW PLAYER
// ============================================================

function drawPlayer() {

    const screenX =
        player.x - camera.x;

    const screenY =
        player.y - camera.y;


    // Body

    ctx.fillStyle = "#4b6cff";

    ctx.fillRect(
        screenX,
        screenY,
        player.width,
        player.height
    );


    // Helmet

    ctx.fillStyle = "#bfc7d5";

    ctx.fillRect(
        screenX + 6,
        screenY - 8,
        20,
        10
    );


    // Sword

    ctx.fillStyle = "#eeeeee";

    ctx.fillRect(
        screenX + player.width,
        screenY + 8,
        18,
        5
    );


    // Player outline

    ctx.strokeStyle = "#111";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        screenX,
        screenY,
        player.width,
        player.height
    );

}


// ============================================================
// UPDATE HUD
// ============================================================

function updateHUD() {

    const hpPercent =
        (player.hp / player.maxHp) * 100;


    document.getElementById("hp-bar").style.width =
        hpPercent + "%";


    document.getElementById("hp-text").textContent =
        `HP: ${player.hp} / ${player.maxHp}`;


    document.getElementById("level-text").textContent =
        `Level: ${player.level}`;


    document.getElementById("xp-text").textContent =
        `XP: ${player.xp} / ${player.maxXp}`;


    document.getElementById("gold-text").textContent =
        `💰 Gold: ${player.gold}`;

}


// ============================================================
// UPDATE
// ============================================================

function update() {

    updatePlayer();

    updateCamera();

    updateHUD();

}


// ============================================================
// DRAW
// ============================================================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawWorld();

    drawObstacles();

    drawPlayer();

}


// ============================================================
// GAME LOOP
// ============================================================

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(gameLoop);

}


gameLoop();

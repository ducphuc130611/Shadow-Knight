// ============================================================
// SHADOW KNIGHT
// STEP 2 - COMBAT SYSTEM
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

    gold: 0,

    damage: 25,

    attackCooldown: 400,

    lastAttack: 0,

    direction: "down"

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

    const key = event.key.toLowerCase();

    keys[key] = true;


    // Attack

    if (key === " ") {

        attack();

        event.preventDefault();

    }

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
// ENEMIES
// ============================================================

const enemies = [

    {
        x: 700,
        y: 600,

        width: 36,
        height: 36,

        hp: 60,
        maxHp: 60,

        damage: 10,

        speed: 1,

        alive: true,

        color: "#9b3d3d"
    },

    {
        x: 1200,
        y: 500,

        width: 36,
        height: 36,

        hp: 80,
        maxHp: 80,

        damage: 12,

        speed: 1,

        alive: true,

        color: "#8f4545"
    },

    {
        x: 1700,
        y: 800,

        width: 36,
        height: 36,

        hp: 100,
        maxHp: 100,

        damage: 15,

        speed: 0.8,

        alive: true,

        color: "#753939"
    },

    {
        x: 2200,
        y: 600,

        width: 36,
        height: 36,

        hp: 120,
        maxHp: 120,

        damage: 18,

        speed: 0.7,

        alive: true,

        color: "#653333"
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


    if (keys["w"] || keys["arrowup"]) {

        dy -= player.speed;

        player.direction = "up";

    }


    if (keys["s"] || keys["arrowdown"]) {

        dy += player.speed;

        player.direction = "down";

    }


    if (keys["a"] || keys["arrowleft"]) {

        dx -= player.speed;

        player.direction = "left";

    }


    if (keys["d"] || keys["arrowright"]) {

        dx += player.speed;

        player.direction = "right";

    }


    // Normalize diagonal movement

    if (dx !== 0 && dy !== 0) {

        dx *= 0.7071;
        dy *= 0.7071;

    }


    if (canMoveTo(player.x + dx, player.y)) {

        player.x += dx;

    }


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
// ATTACK BOX
// ============================================================

function getAttackBox() {

    const size = 55;

    let box = {

        x: player.x,
        y: player.y,

        width: player.width,
        height: player.height

    };


    if (player.direction === "up") {

        box.x = player.x - 10;
        box.y = player.y - size;

        box.width = player.width + 20;
        box.height = size;

    }


    else if (player.direction === "down") {

        box.x = player.x - 10;
        box.y = player.y + player.height;

        box.width = player.width + 20;
        box.height = size;

    }


    else if (player.direction === "left") {

        box.x = player.x - size;
        box.y = player.y - 10;

        box.width = size;
        box.height = player.height + 20;

    }


    else if (player.direction === "right") {

        box.x = player.x + player.width;
        box.y = player.y - 10;

        box.width = size;
        box.height = player.height + 20;

    }


    return box;

}


// ============================================================
// ATTACK
// ============================================================

function attack() {

    const now = Date.now();


    if (
        now - player.lastAttack <
        player.attackCooldown
    ) {

        return;

    }


    player.lastAttack = now;


    const attackBox = getAttackBox();


    for (const enemy of enemies) {

        if (!enemy.alive) {
            continue;
        }


        if (isColliding(attackBox, enemy)) {

            enemy.hp -= player.damage;


            console.log(
                "Enemy hit! HP:",
                enemy.hp
            );


            if (enemy.hp <= 0) {

                killEnemy(enemy);

            }

        }

    }

}


// ============================================================
// KILL ENEMY
// ============================================================

function killEnemy(enemy) {

    enemy.alive = false;

    const xpReward = 50;
    const goldReward = 10;


    player.xp += xpReward;

    player.gold += goldReward;


    console.log(
        `Enemy defeated! +${xpReward} XP +${goldReward} Gold`
    );


    checkLevelUp();

}


// ============================================================
// LEVEL UP
// ============================================================

function checkLevelUp() {

    while (player.xp >= player.maxXp) {

        player.xp -= player.maxXp;

        player.level++;


        player.maxXp =
            Math.floor(
                player.maxXp * 1.5
            );


        player.maxHp += 20;

        player.hp = player.maxHp;

        player.damage += 5;


        console.log(
            `LEVEL UP! Level ${player.level}`
        );

    }

}


// ============================================================
// ENEMY AI
// ============================================================

function updateEnemies() {

    for (const enemy of enemies) {

        if (!enemy.alive) {
            continue;
        }


        const dx =
            player.x - enemy.x;

        const dy =
            player.y - enemy.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        // Enemy follows player

        if (
            distance > 45 &&
            distance < 500
        ) {

            const moveX =
                (dx / distance) *
                enemy.speed;

            const moveY =
                (dy / distance) *
                enemy.speed;


            enemy.x += moveX;
            enemy.y += moveY;

        }


        // Enemy attacks player

        if (distance < 50) {

            damagePlayer(enemy.damage);

        }

    }

}


// ============================================================
// PLAYER DAMAGE
// ============================================================

let lastPlayerDamage = 0;


function damagePlayer(amount) {

    const now = Date.now();


    // Prevent damage every frame

    if (
        now - lastPlayerDamage <
        700
    ) {

        return;

    }


    lastPlayerDamage = now;


    player.hp -= amount;


    if (player.hp < 0) {

        player.hp = 0;

    }


    console.log(
        `Player damaged: -${amount} HP`
    );


    if (player.hp <= 0) {

        playerDeath();

    }

}


// ============================================================
// PLAYER DEATH
// ============================================================

function playerDeath() {

    alert(
        "💀 Bạn đã chết!\n\nGame sẽ được tải lại."
    );


    location.reload();

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


    ctx.strokeStyle =
        "rgba(255,255,255,0.05)";


    const startX =
        Math.floor(camera.x / TILE_SIZE) *
        TILE_SIZE;


    const startY =
        Math.floor(camera.y / TILE_SIZE) *
        TILE_SIZE;


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
// DRAW ENEMIES
// ============================================================

function drawEnemies() {

    for (const enemy of enemies) {

        if (!enemy.alive) {
            continue;
        }


        const screenX =
            enemy.x - camera.x;

        const screenY =
            enemy.y - camera.y;


        // Enemy body

        ctx.fillStyle = enemy.color;


        ctx.fillRect(
            screenX,
            screenY,
            enemy.width,
            enemy.height
        );


        // Eyes

        ctx.fillStyle = "#ffffff";


        ctx.fillRect(
            screenX + 7,
            screenY + 8,
            6,
            6
        );


        ctx.fillRect(
            screenX + 23,
            screenY + 8,
            6,
            6
        );


        // HP bar background

        ctx.fillStyle = "#222";


        ctx.fillRect(
            screenX,
            screenY - 10,
            enemy.width,
            5
        );


        // HP

        ctx.fillStyle = "#e53935";


        const hpWidth =
            enemy.width *
            (enemy.hp / enemy.maxHp);


        ctx.fillRect(
            screenX,
            screenY - 10,
            hpWidth,
            5
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


    if (player.direction === "right") {

        ctx.fillRect(
            screenX + 32,
            screenY + 8,
            20,
            5
        );

    }


    else if (player.direction === "left") {

        ctx.fillRect(
            screenX - 20,
            screenY + 8,
            20,
            5
        );

    }


    else if (player.direction === "up") {

        ctx.fillRect(
            screenX + 13,
            screenY - 25,
            5,
            20
        );

    }


    else {

        ctx.fillRect(
            screenX + 13,
            screenY + 32,
            5,
            20
        );

    }


    // Outline

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
// ATTACK EFFECT
// ============================================================

function drawAttackEffect() {

    const now = Date.now();


    if (
        now - player.lastAttack >
        150
    ) {

        return;

    }


    const attackBox =
        getAttackBox();


    ctx.fillStyle =
        "rgba(255,255,255,0.35)";


    ctx.fillRect(
        attackBox.x - camera.x,
        attackBox.y - camera.y,
        attackBox.width,
        attackBox.height
    );

}


// ============================================================
// HUD
// ============================================================

function updateHUD() {

    const hpPercent =
        (player.hp / player.maxHp) * 100;


    document.getElementById(
        "hp-bar"
    ).style.width =
        hpPercent + "%";


    document.getElementById(
        "hp-text"
    ).textContent =
        `HP: ${player.hp} / ${player.maxHp}`;


    document.getElementById(
        "level-text"
    ).textContent =
        `Level: ${player.level}`;


    document.getElementById(
        "xp-text"
    ).textContent =
        `XP: ${player.xp} / ${player.maxXp}`;


    document.getElementById(
        "gold-text"
    ).textContent =
        `💰 Gold: ${player.gold}`;

}


// ============================================================
// UPDATE
// ============================================================

function update() {

    updatePlayer();

    updateEnemies();

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

    drawEnemies();

    drawPlayer();

    drawAttackEffect();

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

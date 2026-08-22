// ============================================================
// SHADOW KNIGHT
// STEP 6
// ============================================================


const canvas =
    document.getElementById(
        "gameCanvas"
    );


const ctx =
    canvas.getContext(
        "2d"
    );


// ============================================================
// CANVAS
// ============================================================

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}


window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();


// ============================================================
// WORLD
// ============================================================

const WORLD_WIDTH =
    3000;


const WORLD_HEIGHT =
    2000;


const TILE_SIZE =
    50;


// ============================================================
// PLAYER
// ============================================================

const player = {

    x:
        WORLD_WIDTH / 2,

    y:
        WORLD_HEIGHT / 2,

    width:
        32,

    height:
        32,

    speed:
        4,

    hp:
        100,

    maxHp:
        100,

    level:
        1,

    xp:
        0,

    maxXp:
        100,

    gold:
        300,

    baseDamage:
        25,

    damage:
        25,

    direction:
        "down",

    attackCooldown:
        400,

    lastAttack:
        0

};


// ============================================================
// CAMERA
// ============================================================

const camera = {

    x: 0,

    y: 0

};


// ============================================================
// INPUT
// ============================================================

const keys = {};


window.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();


        keys[key] =
            true;


        if (
            key === " "
        ) {

            attack();

            event.preventDefault();

        }


        if (
            key === "q"
        ) {

            usePotionFromInventory();

        }

    }
);


window.addEventListener(
    "keyup",
    function(event) {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


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

const enemyTypes = [

    {

        name:
            "Goblin",

        width:
            32,

        height:
            32,

        hp:
            50,

        damage:
            8,

        speed:
            1.6,

        xp:
            30,

        gold:
            8,

        color:
            "#4caf50"

    },


    {

        name:
            "Orc",

        width:
            42,

        height:
            42,

        hp:
            120,

        damage:
            15,

        speed:
            0.8,

        xp:
            70,

        gold:
            20,

        color:
            "#795548"

    },


    {

        name:
            "Demon",

        width:
            38,

        height:
            38,

        hp:
            180,

        damage:
            22,

        speed:
            1.1,

        xp:
            120,

        gold:
            35,

        color:
            "#9c27b0"

    }

];


const enemies = [];


const MAX_ENEMIES =
    8;


let enemyId =
    0;


// ============================================================
// BOSS
// ============================================================

const boss = {

    active:
        true,

    alive:
        true,

    name:
        "Shadow Lord",

    x:
        2300,

    y:
        1500,

    width:
        100,

    height:
        100,

    hp:
        1000,

    maxHp:
        1000,

    damage:
        30,

    speed:
        0.65,

    phase:
        1,

    lastAttack:
        0,

    attackCooldown:
        1500,

    lastSkill:
        0,

    skillCooldown:
        4000,

    hitFlash:
        0

};


// ============================================================
// EFFECTS
// ============================================================

const damageNumbers = [];

const deathEffects = [];

const bossProjectiles = [];


// ============================================================
// UTILITY
// ============================================================

function random(
    min,
    max
) {

    return Math.random() *
        (max - min) +
        min;

}


function distanceBetween(
    a,
    b
) {

    const dx =
        a.x -
        b.x;


    const dy =
        a.y -
        b.y;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


// ============================================================
// COLLISION
// ============================================================

function isColliding(
    a,
    b
) {

    return (

        a.x <
        b.x +
        b.width &&

        a.x +
        a.width >
        b.x &&

        a.y <
        b.y +
        b.height &&

        a.y +
        a.height >
        b.y

    );

}


function canMoveTo(
    x,
    y
) {

    const rect = {

        x:
            x,

        y:
            y,

        width:
            player.width,

        height:
            player.height

    };


    for (
        const obstacle
        of obstacles
    ) {

        if (
            isColliding(
                rect,
                obstacle
            )
        ) {

            return false;

        }

    }


    return true;

}


// ============================================================
// PLAYER STATS
// ============================================================

function updatePlayerStats() {

    const weapon =
        getItem(
            equipment.weapon
        );


    const armor =
        getItem(
            equipment.armor
        );


    const boots =
        getItem(
            equipment.boots
        );


    player.damage =
        player.baseDamage +
        (
            weapon.damage ||
            0
        );


    player.maxHp =
        100 +
        (
            armor.maxHp ||
            0
        );


    player.speed =
        4 +
        (
            boots.speed ||
            0
        );


    if (
        player.hp >
        player.maxHp
    ) {

        player.hp =
            player.maxHp;

    }

}


// ============================================================
// MOVEMENT
// ============================================================

function updatePlayer() {

    let dx = 0;

    let dy = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        dy -=
            player.speed;

        player.direction =
            "up";

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        dy +=
            player.speed;

        player.direction =
            "down";

    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        dx -=
            player.speed;

        player.direction =
            "left";

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        dx +=
            player.speed;

        player.direction =
            "right";

    }


    if (
        dx !== 0 &&
        dy !== 0
    ) {

        dx *=
            0.7071;

        dy *=
            0.7071;

    }


    if (
        canMoveTo(
            player.x + dx,
            player.y
        )
    ) {

        player.x +=
            dx;

    }


    if (
        canMoveTo(
            player.x,
            player.y + dy
        )
    ) {

        player.y +=
            dy;

    }


    player.x =
        Math.max(
            0,

            Math.min(
                WORLD_WIDTH -
                player.width,

                player.x
            )
        );


    player.y =
        Math.max(
            0,

            Math.min(
                WORLD_HEIGHT -
                player.height,

                player.y
            )
        );

}


// ============================================================
// POTION
// ============================================================

function usePotionFromInventory() {

    for (
        let i = 0;
        i < inventory.length;
        i++
    ) {

        const slot =
            inventory[i];


        if (
            slot &&
            slot.id ===
            "healthPotion"
        ) {

            useInventoryPotion(
                i,
                getItem(
                    "healthPotion"
                )
            );

            return;

        }

    }


    showMessage(
        "🧪 Không có Potion!"
    );

}


// ============================================================
// ATTACK BOX
// ============================================================

function getAttackBox() {

    const size =
        60;


    const box = {

        x:
            player.x,

        y:
            player.y,

        width:
            player.width,

        height:
            player.height

    };


    if (
        player.direction ===
        "up"
    ) {

        box.x =
            player.x -
            14;

        box.y =
            player.y -
            size;

        box.width =
            player.width +
            28;

        box.height =
            size;

    }

    else if (
        player.direction ===
        "down"
    ) {

        box.x =
            player.x -
            14;

        box.y =
            player.y +
            player.height;

        box.width =
            player.width +
            28;

        box.height =
            size;

    }

    else if (
        player.direction ===
        "left"
    ) {

        box.x =
            player.x -
            size;

        box.y =
            player.y -
            14;

        box.width =
            size;

        box.height =
            player.height +
            28;

    }

    else {

        box.x =
            player.x +
            player.width;

        box.y =
            player.y -
            14;

        box.width =
            size;

        box.height =
            player.height +
            28;

    }


    return box;

}


// ============================================================
// ATTACK
// ============================================================

function attack() {

    const now =
        Date.now();


    if (
        now -
        player.lastAttack <
        player.attackCooldown
    ) {

        return;

    }


    player.lastAttack =
        now;


    const attackBox =
        getAttackBox();


    for (
        const enemy
        of enemies
    ) {

        if (
            !enemy.alive
        ) {

            continue;

        }


        if (
            isColliding(
                attackBox,
                enemy
            )
        ) {

            enemy.hp -=
                player.damage;


            enemy.hitFlash =
                120;


            createDamageNumber(
                enemy.x,
                enemy.y,
                player.damage
            );


            if (
                enemy.hp <=
                0
            ) {

                killEnemy(
                    enemy
                );

            }

        }

    }


    if (
        boss.active &&
        boss.alive &&
        isColliding(
            attackBox,
            boss
        )
    ) {

        damageBoss(
            player.damage
        );

    }

}


// ============================================================
// KILL ENEMY
// ============================================================

function killEnemy(
    enemy
) {

    enemy.alive =
        false;


    player.xp +=
        enemy.xp;


    player.gold +=
        enemy.gold;


    createDeathEffect(
        enemy.x,
        enemy.y,
        enemy.color
    );


    // Item drop

    createEnemyDrop(
        enemy.type,
        enemy.x,
        enemy.y
    );


    checkLevelUp();


    setTimeout(
        function() {

            const index =
                enemies.indexOf(
                    enemy
                );


            if (
                index !== -1
            ) {

                enemies.splice(
                    index,
                    1
                );

            }


            spawnEnemy();

        },

        3000

    );

}


// ============================================================
// LEVEL UP
// ============================================================

function checkLevelUp() {

    while (
        player.xp >=
        player.maxXp
    ) {

        player.xp -=
            player.maxXp;


        player.level++;


        player.maxXp =
            Math.floor(
                player.maxXp *
                1.5
            );


        player.baseDamage +=
            5;


        player.hp =
            player.maxHp;


        showMessage(
            `⭐ LEVEL UP! Level ${player.level}`
        );

    }

}


// ============================================================
// BOSS
// ============================================================

function damageBoss(
    amount
) {

    if (
        !boss.alive
    ) {

        return;

    }


    boss.hp -=
        amount;


    boss.hitFlash =
        120;


    createDamageNumber(
        boss.x,
        boss.y,
        amount
    );


    if (
        boss.hp <=
        boss.maxHp *
        0.5
        &&
        boss.phase === 1
    ) {

        boss.phase =
            2;

        boss.speed =
            1.1;

        boss.damage =
            45;

        boss.attackCooldown =
            1000;


        showMessage(
            "🔥 SHADOW LORD PHASE 2!"
        );

    }


    if (
        boss.hp <=
        0
    ) {

        boss.hp =
            0;


        bossDeath();

    }

}


function bossDeath() {

    boss.alive =
        false;

    boss.active =
        false;


    player.xp +=
        500;

    player.gold +=
        500;


    createItemDrop(
        "shadowBlade",
        boss.x,
        boss.y
    );


    createItemDrop(
        "shadowCrystal",
        boss.x + 50,
        boss.y
    );


    createDeathEffect(
        boss.x,
        boss.y,
        "#8e44ad"
    );


    showMessage(
        "👑 SHADOW LORD DEFEATED! " +
        "💎 Đồ huyền thoại đã rơi!"
    );


    checkLevelUp();


    setTimeout(
        respawnBoss,
        15000
    );

}


function respawnBoss() {

    boss.hp =
        boss.maxHp;

    boss.phase =
        1;

    boss.damage =
        30;

    boss.speed =
        0.65;

    boss.alive =
        true;

    boss.active =
        true;

    boss.x =
        random(
            1800,
            2700
        );

    boss.y =
        random(
            1200,
            1800
        );

}


// ============================================================
// SPAWN ENEMY
// ============================================================

function spawnEnemy() {

    if (
        enemies.length >=
        MAX_ENEMIES
    ) {

        return;

    }


    const type =
        enemyTypes[
            Math.floor(
                Math.random() *
                enemyTypes.length
            )
        ];


    let x;

    let y;

    let attempts =
        0;


    do {

        x =
            random(
                100,
                WORLD_WIDTH -
                100
            );


        y =
            random(
                100,
                WORLD_HEIGHT -
                100
            );


        attempts++;

    }

    while (

        distanceBetween(
            {
                x: x,
                y: y
            },
            player
        ) < 500

        &&

        attempts < 100

    );


    enemies.push({

        id:
            enemyId++,

        type:
            type.name,

        x:
            x,

        y:
            y,

        width:
            type.width,

        height:
            type.height,

        hp:
            type.hp,

        maxHp:
            type.hp,

        damage:
            type.damage,

        speed:
            type.speed,

        xp:
            type.xp,

        gold:
            type.gold,

        color:
            type.color,

        alive:
            true,

        lastAttack:
            0,

        attackCooldown:
            900,

        hitFlash:
            0

    });

}


for (
    let i = 0;
    i < MAX_ENEMIES;
    i++
) {

    spawnEnemy();

}


// ============================================================
// ENEMY AI
// ============================================================

function updateEnemies() {

    for (
        const enemy
        of enemies
    ) {

        if (
            !enemy.alive
        ) {

            continue;

        }


        if (
            enemy.hitFlash >
            0
        ) {

            enemy.hitFlash -=
                16;

        }


        const dx =
            player.x -
            enemy.x;


        const dy =
            player.y -
            enemy.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance > 50 &&
            distance < 600
        ) {

            enemy.x +=
                dx /
                distance *
                enemy.speed;


            enemy.y +=
                dy /
                distance *
                enemy.speed;

        }


        if (
            distance < 55
        ) {

            const now =
                Date.now();


            if (
                now -
                enemy.lastAttack >
                enemy.attackCooldown
            ) {

                enemy.lastAttack =
                    now;


                damagePlayer(
                    enemy.damage
                );

            }

        }

    }

}


// ============================================================
// BOSS AI
// ============================================================

function updateBoss() {

    if (
        !boss.active ||
        !boss.alive
    ) {

        return;

    }


    if (
        boss.hitFlash >
        0
    ) {

        boss.hitFlash -=
            16;

    }


    const dx =
        player.x -
        boss.x;


    const dy =
        player.y -
        boss.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (
        distance > 120 &&
        distance < 1000
    ) {

        boss.x +=
            dx /
            distance *
            boss.speed;


        boss.y +=
            dy /
            distance *
            boss.speed;

    }


    if (
        distance < 130
    ) {

        const now =
            Date.now();


        if (
            now -
            boss.lastAttack >
            boss.attackCooldown
        ) {

            boss.lastAttack =
                now;


            damagePlayer(
                boss.damage
            );

        }

    }


    const now =
        Date.now();


    if (
        now -
        boss.lastSkill >
        boss.skillCooldown
    ) {

        boss.lastSkill =
            now;


        createBossProjectile();

    }

}


// ============================================================
// BOSS PROJECTILE
// ============================================================

function createBossProjectile() {

    const dx =
        player.x -
        boss.x;


    const dy =
        player.y -
        boss.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (
        distance === 0
    ) {

        return;

    }


    bossProjectiles.push({

        x:
            boss.x +
            boss.width / 2,

        y:
            boss.y +
            boss.height / 2,

        vx:
            dx /
            distance *
            5,

        vy:
            dy /
            distance *
            5,

        radius:
            10,

        damage:
            boss.phase === 1
                ? 20
                : 30,

        life:
            3000

    });

}


function updateBossProjectiles() {

    for (
        let i =
            bossProjectiles.length - 1;

        i >= 0;

        i--
    ) {

        const projectile =
            bossProjectiles[i];


        projectile.x +=
            projectile.vx;


        projectile.y +=
            projectile.vy;


        projectile.life -=
            16;


        const rect = {

            x:
                projectile.x -
                projectile.radius,

            y:
                projectile.y -
                projectile.radius,

            width:
                projectile.radius *
                2,

            height:
                projectile.radius *
                2

        };


        if (
            isColliding(
                rect,
                player
            )
        ) {

            damagePlayer(
                projectile.damage
            );


            bossProjectiles.splice(
                i,
                1
            );


            continue;

        }


        if (
            projectile.life <=
            0
        ) {

            bossProjectiles.splice(
                i,
                1
            );

        }

    }

}


// ============================================================
// PLAYER DAMAGE
// ============================================================

let lastPlayerDamage =
    0;


function damagePlayer(
    amount
) {

    const now =
        Date.now();


    if (
        now -
        lastPlayerDamage <
        400
    ) {

        return;

    }


    lastPlayerDamage =
        now;


    player.hp -=
        amount;


    if (
        player.hp < 0
    ) {

        player.hp =
            0;

    }


    createDamageNumber(
        player.x,
        player.y,
        amount,
        true
    );


    if (
        player.hp <=
        0
    ) {

        playerDeath();

    }

}


function playerDeath() {

    showMessage(
        "💀 Bạn đã chết!"
    );


    setTimeout(
        function() {

            location.reload();

        },

        1500
    );

}


// ============================================================
// SHOP
// ============================================================

function buyItem(
    itemId
) {

    const prices = {

        healthPotion:
            30,

        ironSword:
            150,

        ironArmor:
            200,

        swiftBoots:
            175

    };


    const price =
        prices[itemId];


    if (
        player.gold <
        price
    ) {

        showMessage(
            "💰 Không đủ Gold!"
        );

        return;

    }


    if (
        !addItem(
            itemId,
            1
        )
    ) {

        return;

    }


    player.gold -=
        price;


    updateHUD();


    const item =
        getItem(
            itemId
        );


    showMessage(
        `🛒 Mua ${item.icon} ${item.name}`
    );

}


// ============================================================
// DAMAGE NUMBERS
// ============================================================

function createDamageNumber(
    x,
    y,
    damage,
    isPlayer = false
) {

    damageNumbers.push({

        x:
            x,

        y:
            y,

        damage:
            damage,

        life:
            1000,

        isPlayer:
            isPlayer

    });

}


function updateDamageNumbers() {

    for (
        let i =
            damageNumbers.length - 1;

        i >= 0;

        i--
    ) {

        const number =
            damageNumbers[i];


        number.y -=
            0.5;


        number.life -=
            16;


        if (
            number.life <=
            0
        ) {

            damageNumbers.splice(
                i,
                1
            );

        }

    }

}


function drawDamageNumbers() {

    ctx.font =
        "bold 18px Arial";


    ctx.textAlign =
        "center";


    for (
        const number
        of damageNumbers
    ) {

        ctx.globalAlpha =
            number.life /
            1000;


        ctx.fillStyle =
            number.isPlayer
                ? "#ff5555"
                : "#ffff00";


        ctx.fillText(

            "-" +
            number.damage,

            number.x -
            camera.x,

            number.y -
            camera.y

        );

    }


    ctx.globalAlpha =
        1;

}


// ============================================================
// DEATH EFFECTS
// ============================================================

function createDeathEffect(
    x,
    y,
    color
) {

    deathEffects.push({

        x:
            x,

        y:
            y,

        radius:
            10,

        life:
            700,

        color:
            color

    });

}


function updateDeathEffects() {

    for (
        let i =
            deathEffects.length - 1;

        i >= 0;

        i--
    ) {

        const effect =
            deathEffects[i];


        effect.radius +=
            2;


        effect.life -=
            16;


        if (
            effect.life <=
            0
        ) {

            deathEffects.splice(
                i,
                1
            );

        }

    }

}


function drawDeathEffects() {

    for (
        const effect
        of deathEffects
    ) {

        ctx.globalAlpha =
            effect.life /
            700;


        ctx.strokeStyle =
            effect.color;


        ctx.lineWidth =
            5;


        ctx.beginPath();


        ctx.arc(

            effect.x -
            camera.x,

            effect.y -
            camera.y,

            effect.radius,

            0,

            Math.PI * 2

        );


        ctx.stroke();

    }


    ctx.globalAlpha =
        1;

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


    camera.x =
        Math.max(

            0,

            Math.min(

                WORLD_WIDTH -
                canvas.width,

                camera.x

            )

        );


    camera.y =
        Math.max(

            0,

            Math.min(

                WORLD_HEIGHT -
                canvas.height,

                camera.y

            )

        );

}


// ============================================================
// DRAW WORLD
// ============================================================

function drawWorld() {

    ctx.fillStyle =
        "#477a3a";


    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    ctx.strokeStyle =
        "rgba(255,255,255,0.05)";


    const startX =
        Math.floor(
            camera.x /
            TILE_SIZE
        ) *
        TILE_SIZE;


    const startY =
        Math.floor(
            camera.y /
            TILE_SIZE
        ) *
        TILE_SIZE;


    for (
        let x =
            startX;

        x <
            camera.x +
            canvas.width;

        x +=
            TILE_SIZE
    ) {

        ctx.beginPath();


        ctx.moveTo(

            x -
            camera.x,

            0

        );


        ctx.lineTo(

            x -
            camera.x,

            canvas.height

        );


        ctx.stroke();

    }


    for (
        let y =
            startY;

        y <
            camera.y +
            canvas.height;

        y +=
            TILE_SIZE
    ) {

        ctx.beginPath();


        ctx.moveTo(

            0,

            y -
            camera.y

        );


        ctx.lineTo(

            canvas.width,

            y -
            camera.y

        );


        ctx.stroke();

    }

}


// ============================================================
// DRAW OBSTACLES
// ============================================================

function drawObstacles() {

    for (
        const obstacle
        of obstacles
    ) {

        ctx.fillStyle =
            "#31552b";


        ctx.fillRect(

            obstacle.x -
            camera.x,

            obstacle.y -
            camera.y,

            obstacle.width,

            obstacle.height

        );


        ctx.strokeStyle =
            "#1b3218";


        ctx.lineWidth =
            4;


        ctx.strokeRect(

            obstacle.x -
            camera.x,

            obstacle.y -
            camera.y,

            obstacle.width,

            obstacle.height

        );

    }

}


// ============================================================
// DRAW ENEMIES
// ============================================================

function drawEnemies() {

    for (
        const enemy
        of enemies
    ) {

        if (
            !enemy.alive
        ) {

            continue;

        }


        const screenX =
            enemy.x -
            camera.x;


        const screenY =
            enemy.y -
            camera.y;


        ctx.fillStyle =
            enemy.hitFlash > 0
                ? "#ffffff"
                : enemy.color;


        ctx.fillRect(

            screenX,

            screenY,

            enemy.width,

            enemy.height

        );


        ctx.fillStyle =
            "#ffffff";


        ctx.fillRect(

            screenX + 7,

            screenY + 8,

            6,

            6

        );


        ctx.fillRect(

            screenX +
            enemy.width -
            13,

            screenY + 8,

            6,

            6

        );


        ctx.fillStyle =
            "#222";


        ctx.fillRect(

            screenX,

            screenY - 10,

            enemy.width,

            5

        );


        ctx.fillStyle =
            "#e53935";


        ctx.fillRect(

            screenX,

            screenY - 10,

            enemy.width *
            (
                enemy.hp /
                enemy.maxHp
            ),

            5

        );


        ctx.font =
            "11px Arial";


        ctx.textAlign =
            "center";


        ctx.fillStyle =
            "#ffffff";


        ctx.fillText(

            enemy.type,

            screenX +
            enemy.width / 2,

            screenY - 15

        );

    }

}


// ============================================================
// DRAW BOSS
// ============================================================

function drawBoss() {

    if (
        !boss.active ||
        !boss.alive
    ) {

        return;

    }


    const screenX =
        boss.x -
        camera.x;


    const screenY =
        boss.y -
        camera.y;


    ctx.fillStyle =
        boss.hitFlash > 0

            ? "#ffffff"

            : boss.phase === 2

            ? "#ff1744"

            : "#6a1b9a";


    ctx.fillRect(

        screenX,

        screenY,

        boss.width,

        boss.height

    );


    ctx.fillStyle =
        "#eeeeee";


    ctx.beginPath();


    ctx.moveTo(
        screenX + 15,
        screenY
    );


    ctx.lineTo(
        screenX + 5,
        screenY - 25
    );


    ctx.lineTo(
        screenX + 30,
        screenY
    );


    ctx.fill();


    ctx.beginPath();


    ctx.moveTo(
        screenX + 70,
        screenY
    );


    ctx.lineTo(
        screenX + 95,
        screenY - 25
    );


    ctx.lineTo(
        screenX + 85,
        screenY
    );


    ctx.fill();


    ctx.fillStyle =
        "#ffeb3b";


    ctx.fillRect(

        screenX + 20,

        screenY + 30,

        15,

        10

    );


    ctx.fillRect(

        screenX + 65,

        screenY + 30,

        15,

        10

    );


    ctx.strokeStyle =
        "#111";


    ctx.lineWidth =
        4;


    ctx.strokeRect(

        screenX,

        screenY,

        boss.width,

        boss.height

    );

}


// ============================================================
// PROJECTILES
// ============================================================

function drawBossProjectiles() {

    for (
        const projectile
        of bossProjectiles
    ) {

        ctx.fillStyle =
            "#8e44ad";


        ctx.beginPath();


        ctx.arc(

            projectile.x -
            camera.x,

            projectile.y -
            camera.y,

            projectile.radius,

            0,

            Math.PI * 2

        );


        ctx.fill();

    }

}


// ============================================================
// BOSS HUD
// ============================================================

function drawBossHUD() {

    if (
        !boss.active ||
        !boss.alive
    ) {

        return;

    }


    const barWidth =
        Math.min(
            700,
            canvas.width - 100
        );


    const barHeight =
        28;


    const x =
        canvas.width / 2 -
        barWidth / 2;


    const y =
        25;


    ctx.fillStyle =
        "#222";


    ctx.fillRect(

        x,

        y,

        barWidth,

        barHeight

    );


    ctx.fillStyle =
        boss.phase === 2
            ? "#ff1744"
            : "#8e44ad";


    ctx.fillRect(

        x,

        y,

        barWidth *
        (
            boss.hp /
            boss.maxHp
        ),

        barHeight

    );


    ctx.strokeStyle =
        "#ffffff";


    ctx.lineWidth =
        3;


    ctx.strokeRect(

        x,

        y,

        barWidth,

        barHeight

    );


    ctx.font =
        "bold 20px Arial";


    ctx.textAlign =
        "center";


    ctx.fillStyle =
        "#ffffff";


    ctx.fillText(

        "👑 " +
        boss.name +
        " - PHASE " +
        boss.phase,

        canvas.width / 2,

        y + 21

    );

}


// ============================================================
// PLAYER
// ============================================================

function drawPlayer() {

    const screenX =
        player.x -
        camera.x;


    const screenY =
        player.y -
        camera.y;


    ctx.fillStyle =
        "#4b6cff";


    ctx.fillRect(

        screenX,

        screenY,

        player.width,

        player.height

    );


    ctx.fillStyle =
        "#bfc7d5";


    ctx.fillRect(

        screenX + 6,

        screenY - 8,

        20,

        10

    );


    ctx.fillStyle =
        "#eeeeee";


    if (
        player.direction ===
        "right"
    ) {

        ctx.fillRect(

            screenX + 32,

            screenY + 8,

            20,

            5

        );

    }

    else if (
        player.direction ===
        "left"
    ) {

        ctx.fillRect(

            screenX - 20,

            screenY + 8,

            20,

            5

        );

    }

    else if (
        player.direction ===
        "up"
    ) {

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


    ctx.strokeStyle =
        "#111";


    ctx.lineWidth =
        2;


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

    const now =
        Date.now();


    if (
        now -
        player.lastAttack >
        150
    ) {

        return;

    }


    const box =
        getAttackBox();


    ctx.fillStyle =
        "rgba(255,255,255,0.35)";


    ctx.fillRect(

        box.x -
        camera.x,

        box.y -
        camera.y,

        box.width,

        box.height

    );

}


// ============================================================
// HUD
// ============================================================

function updateHUD() {

    const hpPercent =
        (
            player.hp /
            player.maxHp
        ) *
        100;


    document.getElementById(
        "hp-bar"
    ).style.width =
        hpPercent +
        "%";


    document.getElementById(
        "hp-text"
    ).textContent =
        `HP: ${Math.floor(player.hp)} / ${player.maxHp}`;


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


    document.getElementById(
        "damage-text"
    ).textContent =
        `⚔️ Damage: ${player.damage}`;

}


// ============================================================
// MESSAGE
// ============================================================

let messageTimer =
    null;


function showMessage(
    text
) {

    const message =
        document.getElementById(
            "message"
        );


    message.textContent =
        text;


    message.classList.add(
        "show"
    );


    clearTimeout(
        messageTimer
    );


    messageTimer =
        setTimeout(
            function() {

                message.classList.remove(
                    "show"
                );

            },

            1800
        );

}


// ============================================================
// UPDATE
// ============================================================

function update() {

    updatePlayerStats();

    updatePlayer();

    updateEnemies();

    updateBoss();

    updateBossProjectiles();

    updateDamageNumbers();

    updateDeathEffects();

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

    drawItemDrops();

    drawEnemies();

    drawBossProjectiles();

    drawBoss();

    drawDeathEffects();

    drawPlayer();

    drawAttackEffect();

    drawDamageNumbers();

    drawBossHUD();

}


// ============================================================
// GAME LOOP
// ============================================================

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(
        gameLoop
    );

}


// ============================================================
// START
// ============================================================

initializeInventory();

updatePlayerStats();

renderInventory();

updateHUD();

gameLoop();

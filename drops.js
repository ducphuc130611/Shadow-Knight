// ============================================================
// ITEM DROPS
// ============================================================

const droppedItems = [];


// ============================================================
// CREATE DROP
// ============================================================

function createItemDrop(
    itemId,
    x,
    y
) {

    const item =
        getItem(itemId);


    if (!item) {
        return;
    }


    droppedItems.push({

        id: itemId,

        x: x,

        y: y,

        width: 24,

        height: 24,

        bob: Math.random() * 10

    });
}


// ============================================================
// RANDOM ENEMY DROP
// ============================================================

function createEnemyDrop(
    enemyType,
    x,
    y
) {

    const random =
        Math.random();


    let itemId = null;


    if (
        enemyType === "Goblin"
    ) {

        if (random < 0.15) {

            itemId =
                "healthPotion";

        }

        else if (random < 0.60) {

            itemId =
                "goblinEar";

        }

    }


    else if (
        enemyType === "Orc"
    ) {

        if (random < 0.15) {

            itemId =
                "healthPotion";

        }

        else if (random < 0.25) {

            itemId =
                "ironSword";

        }

    }


    else if (
        enemyType === "Demon"
    ) {

        if (random < 0.15) {

            itemId =
                "healthPotion";

        }

        else if (random < 0.30) {

            itemId =
                "demonHeart";

        }

        else if (random < 0.35) {

            itemId =
                "swiftBoots";

        }

    }


    if (itemId) {

        createItemDrop(
            itemId,
            x,
            y
        );
    }
}


// ============================================================
// PICK UP
// ============================================================

function pickupNearbyItem() {

    /*
     * Nếu đang đứng gần Elder,
     * E được dành cho NPC.
     */

    if (
        typeof elder !== "undefined" &&
        distanceBetween(
            player,
            elder
        ) <= 100
    ) {

        return;
    }


    let closest = null;

    let closestDistance =
        Infinity;


    for (
        const drop
        of droppedItems
    ) {

        const dx =
            player.x -
            drop.x;


        const dy =
            player.y -
            drop.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance < 80 &&
            distance < closestDistance
        ) {

            closest =
                drop;

            closestDistance =
                distance;
        }
    }


    if (!closest) {

        showMessage(
            "Không có item nào gần đây."
        );

        return;
    }


    if (
        addItem(
            closest.id,
            1
        )
    ) {

        const item =
            getItem(
                closest.id
            );


        showMessage(
            `📦 Nhặt được ${item.icon} ${item.name}!`
        );


        const index =
            droppedItems.indexOf(
                closest
            );


        if (index !== -1) {

            droppedItems.splice(
                index,
                1
            );
        }


        if (
            typeof checkQuestProgress ===
            "function"
        ) {

            checkQuestProgress();
        }
    }
}


// ============================================================
// DRAW DROPS
// ============================================================

function drawItemDrops() {

    for (
        const drop
        of droppedItems
    ) {

        const item =
            getItem(
                drop.id
            );


        if (!item) {
            continue;
        }


        drop.bob += 0.08;


        const offset =
            Math.sin(
                drop.bob
            ) * 4;


        const screenX =
            drop.x -
            camera.x;


        const screenY =
            drop.y -
            camera.y +
            offset;


        ctx.beginPath();


        ctx.arc(

            screenX +
                drop.width / 2,

            screenY +
                drop.height / 2,

            18,

            0,

            Math.PI * 2

        );


        ctx.fillStyle =
            "rgba(255,215,0,0.15)";


        ctx.fill();


        ctx.font =
            "24px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(

            item.icon,

            screenX +
                drop.width / 2,

            screenY + 21

        );


        const distance =
            distanceBetween(
                player,
                drop
            );


        if (
            distance < 80
        ) {

            ctx.font =
                "bold 13px Arial";


            ctx.fillStyle =
                "#ffffff";


            ctx.fillText(

                "[E]",

                screenX +
                    drop.width / 2,

                screenY - 8

            );
        }
    }
}


// ============================================================
// E KEY
// ============================================================

window.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key.toLowerCase() ===
            "e"
        ) {

            /*
             * Elder được ưu tiên.
             */

            if (
                typeof elder !== "undefined" &&
                distanceBetween(
                    player,
                    elder
                ) <= 100
            ) {

                talkToElder();

                return;
            }


            pickupNearbyItem();
        }

    }
);

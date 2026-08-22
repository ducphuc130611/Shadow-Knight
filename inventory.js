// ============================================================
// INVENTORY SYSTEM
// ============================================================

const INVENTORY_SIZE = 20;


// Mỗi ô có:
// { id: itemId, amount: number }

const inventory = [];


// ============================================================
// EQUIPMENT
// ============================================================

const equipment = {

    weapon: "woodenSword",

    armor: "clothArmor",

    boots: "oldBoots"

};


// ============================================================
// ADD ITEM
// ============================================================

function addItem(itemId, amount = 1) {

    const item =
        getItem(itemId);


    if (!item) {

        console.error(
            "Không tìm thấy item:",
            itemId
        );

        return false;

    }


    // Potion/material có thể stack

    if (
        item.type === "potion" ||
        item.type === "material"
    ) {

        for (
            const slot
            of inventory
        ) {

            if (
                slot &&
                slot.id === itemId
            ) {

                slot.amount += amount;

                renderInventory();

                return true;

            }

        }

    }


    // Item không stack

    for (
        let i = 0;
        i < INVENTORY_SIZE;
        i++
    ) {

        if (
            !inventory[i]
        ) {

            inventory[i] = {

                id: itemId,

                amount: amount

            };


            renderInventory();

            return true;

        }

    }


    showMessage(
        "🎒 Inventory đã đầy!"
    );

    return false;

}


// ============================================================
// REMOVE ITEM
// ============================================================

function removeItem(
    itemId,
    amount = 1
) {

    for (
        let i = 0;
        i < inventory.length;
        i++
    ) {

        const slot =
            inventory[i];


        if (
            slot &&
            slot.id === itemId
        ) {

            slot.amount -=
                amount;


            if (
                slot.amount <= 0
            ) {

                inventory[i] =
                    null;

            }


            renderInventory();

            return true;

        }

    }


    return false;

}


// ============================================================
// FIND ITEM
// ============================================================

function hasItem(itemId) {

    return inventory.some(
        slot =>
            slot &&
            slot.id === itemId
    );

}


// ============================================================
// USE ITEM
// ============================================================

function useInventoryItem(
    index
) {

    const slot =
        inventory[index];


    if (!slot) {

        return;

    }


    const item =
        getItem(slot.id);


    if (!item) {

        return;

    }


    // Potion

    if (
        item.type === "potion"
    ) {

        useInventoryPotion(
            index,
            item
        );

        return;

    }


    // Equipment

    if (
        item.type === "weapon" ||
        item.type === "armor" ||
        item.type === "boots"
    ) {

        equipItem(
            index
        );

        return;

    }


    // Material

    if (
        item.type === "material"
    ) {

        showItemDescription(
            item
        );

    }

}


// ============================================================
// POTION
// ============================================================

function useInventoryPotion(
    index,
    item
) {

    if (
        player.hp >=
        player.maxHp
    ) {

        showMessage(
            "❤️ HP đã đầy!"
        );

        return;

    }


    player.hp +=
        item.heal;


    if (
        player.hp >
        player.maxHp
    ) {

        player.hp =
            player.maxHp;

    }


    inventory[index].amount--;


    if (
        inventory[index].amount <= 0
    ) {

        inventory[index] =
            null;

    }


    showMessage(
        `🧪 +${item.heal} HP`
    );


    renderInventory();

}


// ============================================================
// EQUIP
// ============================================================

function equipItem(index) {

    const slot =
        inventory[index];


    if (!slot) {

        return;

    }


    const item =
        getItem(slot.id);


    if (!item) {

        return;

    }


    let slotName;


    if (
        item.type === "weapon"
    ) {

        slotName =
            "weapon";

    }

    else if (
        item.type === "armor"
    ) {

        slotName =
            "armor";

    }

    else if (
        item.type === "boots"
    ) {

        slotName =
            "boots";

    }

    else {

        return;

    }


    // Item đang trang bị

    const oldItemId =
        equipment[slotName];


    // Đưa item cũ vào inventory

    if (oldItemId) {

        addItem(
            oldItemId,
            1
        );

    }


    // Trang bị item mới

    equipment[slotName] =
        item.id;


    // Xóa item khỏi inventory

    inventory[index] =
        null;


    updatePlayerStats();

    renderInventory();

    updateHUD();


    showMessage(
        `⚔️ Đã trang bị ${item.name}!`
    );

}


// ============================================================
// UNEQUIP
// ============================================================

function unequipItem(
    slotName
) {

    const itemId =
        equipment[slotName];


    if (!itemId) {

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


    // Đặt về item mặc định

    if (
        slotName === "weapon"
    ) {

        equipment.weapon =
            "woodenSword";

    }

    else if (
        slotName === "armor"
    ) {

        equipment.armor =
            "clothArmor";

    }

    else if (
        slotName === "boots"
    ) {

        equipment.boots =
            "oldBoots";

    }


    updatePlayerStats();

    renderInventory();

    updateHUD();

}


// ============================================================
// RENDER INVENTORY
// ============================================================

function renderInventory() {

    const grid =
        document.getElementById(
            "inventory-grid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = "";


    for (
        let i = 0;
        i < INVENTORY_SIZE;
        i++
    ) {

        const slot =
            document.createElement(
                "div"
            );


        slot.className =
            "inventory-slot";


        if (
            inventory[i]
        ) {

            const item =
                getItem(
                    inventory[i].id
                );


            if (item) {

                slot.classList.add(
                    `item-${item.rarity}`
                );


                slot.innerHTML = `

                    <div class="inventory-icon">

                        ${item.icon}

                    </div>

                    ${
                        inventory[i].amount > 1

                        ? `<div class="inventory-count">
                            x${inventory[i].amount}
                           </div>`

                        : ""

                    }

                `;


                slot.onclick =
                    function() {

                        useInventoryItem(
                            i
                        );

                    };


                slot.oncontextmenu =
                    function(event) {

                        event.preventDefault();

                        showItemDescription(
                            item
                        );

                    };

            }

        }


        grid.appendChild(
            slot
        );

    }


    renderEquipment();

}


// ============================================================
// EQUIPMENT UI
// ============================================================

function renderEquipment() {

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


    const weaponSlot =
        document.getElementById(
            "weapon-slot"
        );


    const armorSlot =
        document.getElementById(
            "armor-slot"
        );


    const bootsSlot =
        document.getElementById(
            "boots-slot"
        );


    weaponSlot.innerHTML = `

        ${weapon.icon}

        ${weapon.name}

        <br>

        <small>
            +${weapon.damage || 0} Damage
        </small>

    `;


    armorSlot.innerHTML = `

        ${armor.icon}

        ${armor.name}

        <br>

        <small>
            +${armor.maxHp || 0} Max HP
        </small>

    `;


    bootsSlot.innerHTML = `

        ${boots.icon}

        ${boots.name}

        <br>

        <small>
            +${boots.speed || 0} Speed
        </small>

    `;


    weaponSlot.onclick =
        function() {

            unequipItem(
                "weapon"
            );

        };


    armorSlot.onclick =
        function() {

            unequipItem(
                "armor"
            );

        };


    bootsSlot.onclick =
        function() {

            unequipItem(
                "boots"
            );

        };

}


// ============================================================
// ITEM DESCRIPTION
// ============================================================

function showItemDescription(
    item
) {

    const box =
        document.getElementById(
            "item-description"
        );


    let extra = "";


    if (
        item.damage
    ) {

        extra +=
            `<br>⚔️ Damage: +${item.damage}`;

    }


    if (
        item.maxHp
    ) {

        extra +=
            `<br>❤️ Max HP: +${item.maxHp}`;

    }


    if (
        item.speed
    ) {

        extra +=
            `<br>💨 Speed: +${item.speed}`;

    }


    if (
        item.heal
    ) {

        extra +=
            `<br>❤️ Heal: ${item.heal}`;

    }


    box.innerHTML = `

        <b>
            ${item.icon}
            ${item.name}
        </b>

        <br>

        ${item.description}

        ${extra}

        <br>

        <small>
            Rarity: ${item.rarity}
        </small>

    `;

}


// ============================================================
// TOGGLE INVENTORY
// ============================================================

function toggleInventory() {

    const window =
        document.getElementById(
            "inventory-window"
        );


    window.classList.toggle(
        "hidden"
    );


    renderInventory();

}


// ============================================================
// INITIAL ITEMS
// ============================================================

function initializeInventory() {

    for (
        let i = 0;
        i < INVENTORY_SIZE;
        i++
    ) {

        inventory[i] =
            null;

    }


    addItem(
        "healthPotion",
        3
    );


    addItem(
        "goblinEar",
        2
    );

}


// ============================================================
// KEYBOARD
// ============================================================

window.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key.toLowerCase() ===
            "i"
        ) {

            toggleInventory();

        }

    }
);

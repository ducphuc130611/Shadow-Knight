// ============================================================
// ITEMS.JS
// Shadow Knight - Item Database
// ============================================================

const ITEMS = {

    // ========================================================
    // POTIONS
    // ========================================================

    healthPotion: {

        id: "healthPotion",

        name: "Health Potion",

        type: "potion",

        icon: "🧪",

        description: "Hồi 50 HP",

        heal: 50,

        rarity: "common"

    },


    // ========================================================
    // WEAPONS
    // ========================================================

    woodenSword: {

        id: "woodenSword",

        name: "Wooden Sword",

        type: "weapon",

        icon: "🗡️",

        description: "Một thanh kiếm gỗ cơ bản.",

        damage: 0,

        rarity: "common"

    },


    ironSword: {

        id: "ironSword",

        name: "Iron Sword",

        type: "weapon",

        icon: "⚔️",

        description: "Kiếm sắt mạnh hơn kiếm gỗ.",

        damage: 15,

        rarity: "uncommon"

    },


    shadowBlade: {

        id: "shadowBlade",

        name: "Shadow Blade",

        type: "weapon",

        icon: "🗡️",

        description: "Thanh kiếm huyền thoại của Shadow Lord.",

        damage: 35,

        rarity: "legendary"

    },


    // ========================================================
    // ARMOR
    // ========================================================

    clothArmor: {

        id: "clothArmor",

        name: "Cloth Armor",

        type: "armor",

        icon: "👕",

        description: "Bộ giáp vải cơ bản.",

        maxHp: 0,

        rarity: "common"

    },


    ironArmor: {

        id: "ironArmor",

        name: "Iron Armor",

        type: "armor",

        icon: "🛡️",

        description: "Bộ giáp sắt chắc chắn.",

        maxHp: 50,

        rarity: "uncommon"

    },


    // ========================================================
    // BOOTS
    // ========================================================

    oldBoots: {

        id: "oldBoots",

        name: "Old Boots",

        type: "boots",

        icon: "👟",

        description: "Đôi giày cũ.",

        speed: 0,

        rarity: "common"

    },


    swiftBoots: {

        id: "swiftBoots",

        name: "Swift Boots",

        type: "boots",

        icon: "🥾",

        description: "Giày giúp người chơi di chuyển nhanh hơn.",

        speed: 1,

        rarity: "uncommon"

    },


    // ========================================================
    // MATERIALS
    // ========================================================

    goblinEar: {

        id: "goblinEar",

        name: "Goblin Ear",

        type: "material",

        icon: "👂",

        description: "Một chiếc tai của Goblin.",

        value: 10,

        rarity: "common"

    },


    demonHeart: {

        id: "demonHeart",

        name: "Demon Heart",

        type: "material",

        icon: "❤️",

        description: "Trái tim của một con Demon.",

        value: 75,

        rarity: "rare"

    },


    shadowCrystal: {

        id: "shadowCrystal",

        name: "Shadow Crystal",

        type: "material",

        icon: "💎",

        description: "Một tinh thể chứa năng lượng bóng tối.",

        value: 250,

        rarity: "legendary"

    }

};


// ============================================================
// GET ITEM
// ============================================================

function getItem(itemId) {

    return ITEMS[itemId] || null;

}


// ============================================================
// GET RANDOM DROP
// ============================================================

function getRandomDrop(enemyType) {

    const random =
        Math.random();


    // Goblin

    if (
        enemyType === "Goblin"
    ) {

        if (random < 0.15) {

            return "healthPotion";

        }

        if (random < 0.25) {

            return "goblinEar";

        }

    }


    // Orc

    if (
        enemyType === "Orc"
    ) {

        if (random < 0.15) {

            return "healthPotion";

        }

        if (random < 0.25) {

            return "ironSword";

        }

    }


    // Demon

    if (
        enemyType === "Demon"
    ) {

        if (random < 0.15) {

            return "healthPotion";

        }

        if (random < 0.25) {

            return "demonHeart";

        }

        if (random < 0.28) {

            return "swiftBoots";

        }

    }


    return null;

}

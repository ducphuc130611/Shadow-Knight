// ============================================================
// ITEMS DATABASE
// ============================================================

const ITEMS = {

    healthPotion: {
        id: "healthPotion",
        name: "Health Potion",
        type: "potion",
        icon: "🧪",
        description: "Hồi 50 HP.",
        heal: 50,
        rarity: "common"
    },

    woodenSword: {
        id: "woodenSword",
        name: "Wooden Sword",
        type: "weapon",
        icon: "🗡️",
        description: "Thanh kiếm gỗ cơ bản.",
        damage: 0,
        rarity: "common"
    },

    ironSword: {
        id: "ironSword",
        name: "Iron Sword",
        type: "weapon",
        icon: "⚔️",
        description: "Một thanh kiếm sắt mạnh.",
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
        description: "Tăng tốc độ di chuyển.",
        speed: 1,
        rarity: "uncommon"
    },

    goblinEar: {
        id: "goblinEar",
        name: "Goblin Ear",
        type: "material",
        icon: "👂",
        description: "Một chiếc tai Goblin.",
        value: 10,
        rarity: "common"
    },

    demonHeart: {
        id: "demonHeart",
        name: "Demon Heart",
        type: "material",
        icon: "❤️",
        description: "Trái tim của Demon.",
        value: 75,
        rarity: "rare"
    },

    shadowCrystal: {
        id: "shadowCrystal",
        name: "Shadow Crystal",
        type: "material",
        icon: "💎",
        description: "Tinh thể chứa năng lượng bóng tối.",
        value: 250,
        rarity: "legendary"
    }
};


function getItem(itemId) {
    return ITEMS[itemId] || null;
}

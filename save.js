// ============================================================
// SHADOW KNIGHT — STEP 8: SAVE / LOAD
// Browser local save system for Release v0.0
// ============================================================

const SAVE_KEY = "shadow_knight_save_v0";

function getSaveData() {
    return {
        version: "0.0",
        savedAt: Date.now(),
        player: {
            x: player.x,
            y: player.y,
            hp: player.hp,
            maxHp: player.maxHp,
            level: player.level,
            xp: player.xp,
            maxXp: player.maxXp,
            gold: player.gold,
            baseDamage: player.baseDamage,
            damage: player.damage,
            direction: player.direction
        },
        inventory: typeof inventory !== "undefined" ? inventory : [],
        equipment: typeof equipment !== "undefined" ? equipment : {},
        questState: typeof questState !== "undefined" ? questState : {}
    };
}

function saveGame(showMessageBox = true) {
    try {
        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(getSaveData())
        );

        if (showMessageBox && typeof showMessage === "function") {
            showMessage("💾 Game đã được lưu!");
        }

        return true;
    } catch (error) {
        console.error("Shadow Knight Save Error:", error);

        if (showMessageBox && typeof showMessage === "function") {
            showMessage("❌ Không thể lưu game!");
        }

        return false;
    }
}

function hasSaveGame() {
    return localStorage.getItem(SAVE_KEY) !== null;
}

function loadGame(showMessageBox = true) {
    try {
        const raw = localStorage.getItem(SAVE_KEY);

        if (!raw) {
            if (showMessageBox && typeof showMessage === "function") {
                showMessage("📂 Chưa có Save!");
            }
            return false;
        }

        const data = JSON.parse(raw);

        if (!data || !data.player) {
            throw new Error("Save data is invalid.");
        }

        const savedPlayer = data.player;

        player.x = Number(savedPlayer.x) || WORLD_WIDTH / 2;
        player.y = Number(savedPlayer.y) || WORLD_HEIGHT / 2;
        player.hp = Math.max(0, Number(savedPlayer.hp) || 0);
        player.maxHp = Math.max(1, Number(savedPlayer.maxHp) || 100);
        player.level = Math.max(1, Number(savedPlayer.level) || 1);
        player.xp = Math.max(0, Number(savedPlayer.xp) || 0);
        player.maxXp = Math.max(1, Number(savedPlayer.maxXp) || 100);
        player.gold = Math.max(0, Number(savedPlayer.gold) || 0);
        player.baseDamage = Math.max(0, Number(savedPlayer.baseDamage) || 25);
        player.damage = Math.max(0, Number(savedPlayer.damage) || player.baseDamage);
        player.direction = savedPlayer.direction || "down";

        if (typeof inventory !== "undefined" && Array.isArray(data.inventory)) {
            inventory.length = 0;
            data.inventory.forEach(function (item) {
                inventory.push(item);
            });
        }

        if (typeof equipment !== "undefined" && data.equipment) {
            equipment.weapon = data.equipment.weapon || null;
            equipment.armor = data.equipment.armor || null;
            equipment.boots = data.equipment.boots || null;
        }

        if (typeof questState !== "undefined" && data.questState) {
            Object.keys(questState).forEach(function (key) {
                delete questState[key];
            });

            Object.keys(data.questState).forEach(function (key) {
                questState[key] = data.questState[key];
            });
        }

        if (typeof updatePlayerStats === "function") {
            updatePlayerStats();
        }

        if (typeof renderInventory === "function") {
            renderInventory();
        }

        if (typeof updateQuestUI === "function") {
            updateQuestUI();
        }

        if (typeof updateHUD === "function") {
            updateHUD();
        }

        if (showMessageBox && typeof showMessage === "function") {
            showMessage("📂 Save đã được Load!");
        }

        return true;
    } catch (error) {
        console.error("Shadow Knight Load Error:", error);

        if (showMessageBox && typeof showMessage === "function") {
            showMessage("❌ Save bị lỗi hoặc không hợp lệ!");
        }

        return false;
    }
}

function resetSaveGame() {
    const confirmed = confirm(
        "Xóa toàn bộ Save Shadow Knight?\n\nHành động này không thể hoàn tác."
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(SAVE_KEY);

    location.reload();
}

// Auto-save every 30 seconds.
setInterval(function () {
    saveGame(false);
}, 30000);

// Save progress before leaving/refreshing the page.
window.addEventListener("beforeunload", function () {
    saveGame(false);
});

// Keyboard shortcuts: F5 is browser refresh, so use F6/F7/F8 here.
window.addEventListener("keydown", function (event) {
    if (event.key === "F6") {
        event.preventDefault();
        saveGame();
    }

    if (event.key === "F7") {
        event.preventDefault();
        loadGame();
    }

    if (event.key === "F8") {
        event.preventDefault();
        resetSaveGame();
    }
});

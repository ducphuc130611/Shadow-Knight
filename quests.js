// ============================================================
// QUEST SYSTEM
// ============================================================

const quests = {

    goblinHunt: {

        id: "goblinHunt",

        name: "Goblin Hunt",

        description:
            "Tiêu diệt 5 Goblin và mang 3 Goblin Ear về cho Elder.",

        requiredKills: 5,

        requiredItem: "goblinEar",

        requiredItemAmount: 3,

        rewardXP: 150,

        rewardGold: 200,

        rewardItem: "healthPotion",

        rewardItemAmount: 2

    }

};


const questState = {

    goblinHunt: {

        accepted: false,

        completed: false,

        claimed: false,

        kills: 0

    }

};


// ============================================================
// ACCEPT QUEST
// ============================================================

function acceptQuest(questId) {

    const quest =
        quests[questId];

    const state =
        questState[questId];


    if (!quest || !state) {

        return;

    }


    if (state.claimed) {

        showMessage(
            "Nhiệm vụ này đã hoàn thành."
        );

        return;

    }


    if (state.accepted) {

        showMessage(
            "Bạn đã nhận nhiệm vụ này rồi."
        );

        return;

    }


    state.accepted =
        true;


    showMessage(
        `📜 Đã nhận nhiệm vụ: ${quest.name}`
    );


    updateQuestUI();

}


// ============================================================
// CHECK QUEST
// ============================================================

function checkQuestProgress() {

    const quest =
        quests.goblinHunt;

    const state =
        questState.goblinHunt;


    if (
        !state.accepted ||
        state.completed
    ) {

        return;

    }


    const earCount =
        getItemAmount(
            quest.requiredItem
        );


    if (
        state.kills >=
        quest.requiredKills &&

        earCount >=
        quest.requiredItemAmount
    ) {

        state.completed =
            true;


        showMessage(
            "✅ Quest hoàn thành! Hãy quay lại Elder."
        );

    }


    updateQuestUI();

}


// ============================================================
// GET ITEM AMOUNT
// ============================================================

function getItemAmount(
    itemId
) {

    let total = 0;


    for (
        const slot
        of inventory
    ) {

        if (
            slot &&
            slot.id === itemId
        ) {

            total +=
                slot.amount;

        }

    }


    return total;

}


// ============================================================
// CLAIM QUEST
// ============================================================

function claimQuest(
    questId
) {

    const quest =
        quests[questId];

    const state =
        questState[questId];


    if (!quest || !state) {

        return;

    }


    if (!state.accepted) {

        showMessage(
            "Bạn chưa nhận nhiệm vụ."
        );

        return;

    }


    if (!state.completed) {

        showMessage(
            "Bạn chưa hoàn thành nhiệm vụ."
        );

        return;

    }


    if (state.claimed) {

        showMessage(
            "Bạn đã nhận phần thưởng rồi."
        );

        return;

    }


    state.claimed =
        true;


    player.xp +=
        quest.rewardXP;


    player.gold +=
        quest.rewardGold;


    addItem(
        quest.rewardItem,
        quest.rewardItemAmount
    );


    checkLevelUp();


    showMessage(
        `🎁 Nhận thưởng: +${quest.rewardXP} XP +${quest.rewardGold} Gold`
    );


    updateQuestUI();

}


// ============================================================
// QUEST UI
// ============================================================

function updateQuestUI() {

    const panel =
        document.getElementById(
            "quest-content"
        );


    if (!panel) {

        return;

    }


    const quest =
        quests.goblinHunt;

    const state =
        questState.goblinHunt;


    const earCount =
        getItemAmount(
            quest.requiredItem
        );


    if (state.claimed) {

        panel.innerHTML = `

            <h3>📜 ${quest.name}</h3>

            <p>
                ✅ Đã hoàn thành
            </p>

        `;

        return;

    }


    if (!state.accepted) {

        panel.innerHTML = `

            <h3>📜 ${quest.name}</h3>

            <p>
                ${quest.description}
            </p>

            <button
                onclick="acceptQuest('goblinHunt')"
            >
                Nhận nhiệm vụ
            </button>

        `;

        return;

    }


    panel.innerHTML = `

        <h3>📜 ${quest.name}</h3>

        <p>
            ${quest.description}
        </p>

        <p>
            Goblin:
            ${state.kills}
            /
            ${quest.requiredKills}
        </p>

        <p>
            Goblin Ear:
            ${earCount}
            /
            ${quest.requiredItemAmount}
        </p>

        ${
            state.completed

            ? `

                <button
                    onclick="claimQuest('goblinHunt')"
                >
                    🎁 Nhận phần thưởng
                </button>

            `

            : `

                <p>
                    ⚔️ Hãy hoàn thành nhiệm vụ!
                </p>

            `
        }

    `;

}


// ============================================================
// INITIALIZE
// ============================================================

function initializeQuests() {

    updateQuestUI();

}

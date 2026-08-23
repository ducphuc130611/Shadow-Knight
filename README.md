# ⚔️ Shadow Knight

**Release: v0.0 — Initial Release**

Shadow Knight is a browser-based 2D action RPG built with HTML5 Canvas, CSS and JavaScript.

## 🎮 Gameplay

- Move with **WASD / Arrow Keys**.
- Press **SPACE** to attack.
- Press **Q** to use a Health Potion.
- Press **E** to talk to the Elder or interact with nearby drops.
- Press **I** to open Inventory.
- Fight Goblins, Orcs and Demons.
- Defeat the **Shadow Lord** boss and survive its second phase.
- Gain XP, level up, collect Gold and obtain equipment/items.
- Complete the Goblin Hunt quest.
- Buy items from the Shop and equip weapons, armor and boots.

## 💾 Save / Load

Release v0.0 includes a browser-local save system.

- **Save:** button or `F6`
- **Load:** button or `F7`
- **Reset Save:** button or `F8`
- Automatic save every 30 seconds.
- Automatic save when leaving or refreshing the page.

Save data is stored locally in the player's browser using `localStorage`. It is not stored on the GitHub server.

## 🏷️ Version 0.0

This is the initial playable release. The v0.0 codebase is frozen for release; future gameplay additions will be handled as later updates instead of being mixed into this release.

## 📁 Project

```text
Shadow-Knight/
├── index.html
├── style.css
├── game.js
├── items.js
├── inventory.js
├── drops.js
├── quests.js
├── save.js
└── README.md
```

## 🌐 Run

Open `index.html` in a modern browser, or deploy the repository with GitHub Pages.

## ⚠️ Note

Save data belongs to the browser/device where the game is played. Clearing browser site data will remove the local save.

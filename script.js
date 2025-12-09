// Egyszerű állapotok
let selectedCardElement = null;
let inClan = false;
const questProgress = new Map();

// Card → elixír mapping az átlaghoz
const cardElixirMap = {
    "Lángőr": 4,
    "Jégvarázs": 3,
    "Íjász duó": 3,
    "Viharherceg": 5
};

// Segédfüggvény: HUD erőforrás kiolvasás / írás
function getGold() {
    return parseInt(document.getElementById("goldAmount").textContent, 10) || 0;
}
function setGold(v) {
    document.getElementById("goldAmount").textContent = v;
}
function getGems() {
    return parseInt(document.getElementById("gemAmount").textContent, 10) || 0;
}
function setGems(v) {
    document.getElementById("gemAmount").textContent = v;
}

// Nézetváltás
function setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const views = document.querySelectorAll(".view");

    navItems.forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-view");

            navItems.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            views.forEach((view) => {
                if (view.getAttribute("data-view-id") === target) {
                    view.classList.add("active");
                } else {
                    view.classList.remove("active");
                }
            });
        });
    });
}

// Harc gomb → külső oldal
function setupBattleButton() {
    const btn = document.getElementById("battleBtn");
    const status = document.getElementById("matchStatusText");

    if (!btn) return;

    btn.addEventListener("click", () => {
        if (status) {
            status.textContent = "Átirányítás a demonstrációs csata oldalra...";
        }
        window.location.href = "https://users.iit.uni-miskolc.hu/~z5bz1o/cr.html";
    });
}

// Kártya kijelölés + pakli
function setupCardsAndDeck() {
    const cards = document.querySelectorAll(".selectable-card");
    const addBtn = document.getElementById("addToDeckBtn");
    const clearBtn = document.getElementById("clearDeckBtn");
    const deckSlots = document.querySelectorAll(".deck-slot");
    const deckCountLabel = document.getElementById("deckCountLabel");
    const avgElixirLabel = document.getElementById("avgElixirLabel");

    // Kártya kijelölés (csak 1 aktív)
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (selectedCardElement === card) {
                card.classList.remove("selected");
                selectedCardElement = null;
                return;
            }
            if (selectedCardElement) {
                selectedCardElement.classList.remove("selected");
            }
            card.classList.add("selected");
            selectedCardElement = card;
        });
    });

    function updateDeckMeta() {
        // darabszám
        let count = 0;
        let elixirSum = 0;

        deckSlots.forEach((slot) => {
            const name = slot.getAttribute("data-card-name");
            if (name) {
                count++;
                const elixir = cardElixirMap[name] || 0;
                elixirSum += elixir;
            }
        });

        if (deckCountLabel) {
            deckCountLabel.textContent = `${count} / 8 kártya`;
        }
        if (avgElixirLabel) {
            if (count === 0) {
                avgElixirLabel.textContent = "–";
            } else {
                const avg = (elixirSum / count).toFixed(1);
                avgElixirLabel.textContent = avg;
            }
        }
    }

    if (addBtn) {
        addBtn.addEventListener("click", () => {
            if (!selectedCardElement) {
                alert("Először válassz ki egy kártyát a listából!");
                return;
            }
            const name = selectedCardElement.getAttribute("data-card-name");
            if (!name) return;

            // Nézzük, hogy van-e még üres slot
            let inserted = false;
            for (const slot of deckSlots) {
                const existingName = slot.getAttribute("data-card-name");
                if (!existingName) {
                    slot.textContent = name;
                    slot.classList.add("filled");
                    slot.setAttribute("data-card-name", name);
                    inserted = true;
                    break;
                }
            }

            if (!inserted) {
                alert("A pakli már tele van (8/8).");
            }

            updateDeckMeta();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            deckSlots.forEach((slot) => {
                slot.textContent = "Üres";
                slot.classList.remove("filled");
                slot.removeAttribute("data-card-name");
            });
            updateDeckMeta();
        });
    }

    updateDeckMeta();
}

// Bolt funkciók
function setupShop() {
    const buyButtons = document.querySelectorAll(".shop-buy-btn");

    buyButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const item = btn.closest(".shop-item");
            if (!item) return;

            const priceType = item.getAttribute("data-price-type"); // "gold" vagy "gem"
            const price = parseInt(item.getAttribute("data-price") || "0", 10);
            const goldReward = parseInt(item.getAttribute("data-gold-reward") || "0", 10);

            if (priceType === "gold") {
                const currentGold = getGold();
                if (currentGold < price) {
                    alert("Nincs elég aranyod a vásárláshoz (demo).");
                    return;
                }
                setGold(currentGold - price);
                alert("Sikeres vásárlás (demo) – aranyból levonva!");
            } else if (priceType === "gem") {
                const currentGems = getGems();
                if (currentGems < price) {
                    alert("Nincs elég gyémántod a vásárláshoz (demo).");
                    return;
                }
                setGems(currentGems - price);
                if (goldReward > 0) {
                    setGold(getGold() + goldReward);
                    alert("Sikeres vásárlás (demo) – gyémánt → arany csomag!");
                } else {
                    alert("Sikeres vásárlás (demo) – láda megvásárolva!");
                }
            }
        });
    });
}

// Klán csatlakozás / kilépés
function setupClan() {
    const button = document.getElementById("clanActionBtn");
    const infoLine = document.getElementById("clanInfoLine");
    const hudClanLabel = document.getElementById("hudClanLabel");

    if (!button) return;

    button.addEventListener("click", () => {
        inClan = !inClan;

        if (inClan) {
            button.textContent = "Kilépés";
            if (infoLine) {
                infoLine.textContent = "Tagok: 33 / 50 • Te is tag vagy";
            }
            if (hudClanLabel) {
                hudClanLabel.textContent = "Klán Akadémia";
            }
        } else {
            button.textContent = "Csatlakozás";
            if (infoLine) {
                infoLine.textContent = "Tagok: 32 / 50 • Nyelv: magyar";
            }
            if (hudClanLabel) {
                hudClanLabel.textContent = "Nincs klán";
            }
        }
    });
}

// Küldetés gombok
function setupQuests() {
    const questItems = document.querySelectorAll(".quest-item");

    questItems.forEach((item, index) => {
        const max = parseInt(item.getAttribute("data-max") || "0", 10);
        const rewardGold = parseInt(item.getAttribute("data-reward-gold") || "0", 10);
        const progressLine = item.querySelector(".quest-progress");
        const button = item.querySelector(".quest-btn");
        const key = "quest-" + index;

        questProgress.set(key, 0);

        if (!button || !progressLine) return;

        function updateText() {
            const current = questProgress.get(key) || 0;
            progressLine.textContent = `Előrehaladás: ${current} / ${max}`;
        }

        button.addEventListener("click", () => {
            let current = questProgress.get(key) || 0;
            if (current >= max) {
                return;
            }
            current++;
            questProgress.set(key, current);
            updateText();

            if (current >= max) {
                if (rewardGold > 0) {
                    setGold(getGold() + rewardGold);
                    alert(`Küldetés teljesítve! +${rewardGold} arany (demo).`);
                } else {
                    alert("Küldetés teljesítve! (demo)");
                }
                button.textContent = "Kész";
                button.disabled = true;
            }
        });

        updateText();
    });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupBattleButton();
    setupCardsAndDeck();
    setupShop();
    setupClan();
    setupQuests();
});

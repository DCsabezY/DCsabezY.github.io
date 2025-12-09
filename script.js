// Navigáció – képernyők váltása
const navButtons = document.querySelectorAll(".nav-item");
const screens = document.querySelectorAll(".screen");

navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        screens.forEach(scr => {
            scr.classList.toggle("active", scr.id === "screen-" + target);
        });
        navButtons.forEach(b => b.classList.toggle("active", b === btn));
    });
});

// --- HARC gomb → átirányítás ---
const battleButton = document.getElementById("battleButton");

battleButton.addEventListener("click", () => {
    window.location.href = "https://users.iit.uni-miskolc.hu/~z5bz1o/cr.html";
});
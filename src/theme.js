import { modeToggleButton, body, lightModeIcon, darkModeIcon } from "./domElements.js";

const bodyClassList = body.classList;

function toggleTheme() {
    bodyClassList.toggle("dark-mode");
    setThemeIcon(bodyClassList.contains("dark-mode"));
}

function setThemeIcon(isDark) {
    if (isDark) {
        lightModeIcon.style.display = "block";
        darkModeIcon.style.display = "none";
    }
    else {
        lightModeIcon.style.display = "none";
        darkModeIcon.style.display = "block";
    }
}

export function initializeTheme() {
    modeToggleButton.addEventListener("click", () => toggleTheme());
    bodyClassList.remove("dark-mode");
    setThemeIcon(false);
}
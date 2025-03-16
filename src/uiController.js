import { playerPrompt } from "./constants/domElements.js";
import { X, O } from "./constants/playerSymbols.js";

function updateCell(cell, value) {
    cell.innerHTML = value;
}

export function updateGameUI(cell, value, gameStatus) {
    updateCell(cell, value);
    if(gameStatus === 'draw') {
        playerPrompt.innerHTML = "It's a draw, try again?";
    }
    else if (gameStatus === X || gameStatus === O) {
        playerPrompt.innerHTML = `Player ${gameStatus}'s wins!`;
    }
    else {
        playerPrompt.innerHTML = `Player ${value === X ? O : X}'s turn`;
    }
}

export function restartGameUI(cells) {
    cells.forEach(cell => updateCell(cell, ""));
    playerPrompt.innerHTML = `Player ${X}'s turn`;
}
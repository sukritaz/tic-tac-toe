import { cells, restartButton } from "./constants/domElements.js";
import { updateGameUI, restartGameUI } from "./uiController.js";
import { isGameOver } from "./gameValidator.js";
import { X, O } from "./constants/playerSymbols.js";

const board = new Array(9);

let currentPlayer = X;
let gameStatus = false;

export function initializeGame() {
    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            if (!gameStatus) {
                updateBoard(index, currentPlayer);
                gameStatus = isGameOver(board);
                updateGameUI(cell, currentPlayer, gameStatus);
                togglePlayer();
            }
        })
    });
    
    restartButton.addEventListener("click", () => {
        restartGameUI(cells);
        board.fill("");
        currentPlayer = X;
        gameStatus = false;
    });
}

function updateBoard(index, currentPlayer) {
    board[index] = currentPlayer;
}

function togglePlayer() {
    currentPlayer = currentPlayer === X ? O : X;
}
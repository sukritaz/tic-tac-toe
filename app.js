const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const difficultySelect = document.getElementById('difficulty');
const modeSelect = document.getElementById('mode');
const difficultyLabel = document.getElementById('difficultyLabel');
let currentPlayer = 'X';
let gameIsActive = true;
let boardState = Array(9).fill(null);
let singlePlayer = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startGame();

restartButton.addEventListener('click', startGame);
modeSelect.addEventListener('change', changeMode);

function startGame() {
    currentPlayer = 'X';
    gameIsActive = true;
    boardState = Array(9).fill(null);
    cells.forEach(cell => {
        cell.classList.remove('X');
        cell.classList.remove('O');
        cell.textContent = '';
        cell.addEventListener('click', handleClick, { once: true });
    });
    setMessage(`Player ${currentPlayer}'s turn`);
    singlePlayer = modeSelect.value === 'single';
    difficultySelect.style.display = singlePlayer ? 'inline-block' : 'none';
    difficultyLabel.style.display = singlePlayer ? 'inline-block' : 'none';
}

function handleClick(e) {
    if (!gameIsActive) return;
    const cell = e.target;
    const index = [...cells].indexOf(cell);
    if (boardState[index] !== null) return;
    placeMark(cell, index, currentPlayer);
    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (singlePlayer && currentPlayer === 'O') {
            aiMove();
        } else {
            setMessage(`Player ${currentPlayer}'s turn`);
        }
    }
}

function placeMark(cell, index, currentPlayer) {
    boardState[index] = currentPlayer;
    cell.classList.add(currentPlayer);
    cell.textContent = currentPlayer;
}

function swapTurns() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin(currentPlayer) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return boardState[index] === currentPlayer;
        });
    });
}

function isDraw() {
    return boardState.every(cell => cell !== null);
}

function endGame(draw) {
    gameIsActive = false;
    if (draw) {
        setMessage('Draw!');
    } else {
        setMessage(`Player ${currentPlayer} wins!`);
    }
}

function setMessage(message) {
    messageElement.textContent = message;
}

function aiMove() {
    const difficulty = difficultySelect.value;
    let move;
    if (difficulty === 'easy') {
        move = getRandomMove();
    } else if (difficulty === 'medium') {
        move = getMediumMove();
    } else if (difficulty === 'hard') {
        move = getBestMove();
    }
    if (move !== undefined) {
        placeMark(cells[move], move, currentPlayer);
        if (checkWin(currentPlayer)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setMessage(`Player ${currentPlayer}'s turn`);
        }
    }
}

function getRandomMove() {
    const availableMoves = boardState.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function getMediumMove() {
    const opponent = 'X';
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (boardState[a] === opponent && boardState[b] === opponent && boardState[c] === null) return c;
        if (boardState[a] === opponent && boardState[c] === opponent && boardState[b] === null) return b;
        if (boardState[b] === opponent && boardState[c] === opponent && boardState[a] === null) return a;
    }
    return getRandomMove();
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === null) {
            boardState[i] = 'O';
            let score = minimax(boardState, 0, false);
            boardState[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        'O': 1,
        'X': -1,
        'draw': 0
    };
    let result = checkWinForMinimax(board);
    if (result !== null) {
        return scores[result];
    }
    if (isDraw()) {
        return scores['draw'];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinForMinimax(board) {
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function changeMode() {
    startGame();
}

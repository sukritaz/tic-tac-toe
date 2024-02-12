function gameController() {
    player1 = createPlayer('Sally', 'X', false);
    player2 = createPlayer('Adam', 'O', true, "MEDIUM");

    let playerPlay = player1;

    let board = function () {
        const row = 3;
        const col = 3;

        let verticleXCheckCounter = [0, 0, 0];
        let verticleOCheckCounter = [0, 0, 0];
        let horizontalXCheckCounter = [0, 0, 0];
        let horizontalOCheckCounter = [0, 0, 0];
        let diagonalXCheckCounter = [0, 0];
        let diagonalOCheckCounter = [0, 0];

        let markedCellCount = 0;

        const grid = [];

        for (i = 0; i < row; i++) {
            grid[i] = [];
            for (j = 0; j < col; j++) {
                grid[i][j] = i + ":" + j;
            }
        }
        return ({
            getGrid: () => grid,
            getValue: function (row, col) {
                return grid[row][col];
            },
            setValue: function (move, marker) {
                let row = move.row;
                let col = move.col;
                const value = this.getValue(row, col);
                if (value !== "X" && value !== "O") {
                    grid[row][col] = marker;
                    markedCellCount +=1;
                    if (marker === "X") {
                        verticleXCheckCounter[col] += 1;
                        horizontalXCheckCounter[row] += 1;
                        if (row === col) {
                            diagonalXCheckCounter[0] += 1;
                        }
                        if (row + col === 2) {
                            diagonalXCheckCounter[1] += 1;
                        }
                    }
                    if (marker === "O") {
                        verticleOCheckCounter[col] += 1;
                        horizontalOCheckCounter[row] += 1;
                        if (row === col) {
                            diagonalOCheckCounter[0] += 1;
                        }
                        if (row + col === 2) {
                            diagonalOCheckCounter[1] += 1;
                        }
                    }
                    return true;
                }
                return false;
            },
            getRow: () => row,
            getColumn: () => col,

            printGrid: () => {
                for (i = 0; i < row; i++) {
                    console.log(grid[i].join("  "));
                }
            },

            getVerticleXCheckCounter: () => verticleXCheckCounter,
            getVerticleOCheckCounter: () => verticleOCheckCounter,
            getHorizontalXCheckCounter: () => horizontalXCheckCounter,
            getHorizontalOCheckCounter: () => horizontalOCheckCounter,

            getStatus: function () {
                if (verticleOCheckCounter.includes(3) || verticleXCheckCounter.includes(3)
                    || horizontalOCheckCounter.includes(3) || horizontalXCheckCounter.includes(3)
                    || diagonalOCheckCounter.includes(3) || diagonalXCheckCounter.includes(3) || markedCellCount === 9) {
                    console.log("Game is Over");
                    return false;
                }
                return true;
            }
        });
    }();


    let isRoundProgress = true;

    while (isRoundProgress) {
        let userInputFlag = true;
        let botMoveFlag = true;
        const playerMarker = playerPlay.marker;

        if (playerPlay.isBot) {
            while (botMoveFlag) {
                const move = botMove(board, playerPlay.botLevel, playerMarker);
                if (board.setValue(move, playerMarker)) {
                    console.log(`Marking ${move.row}:${move.row} with value: ${playerMarker}`);
                    botMoveFlag = false;
                }
            }
        }
        else {
            while (userInputFlag) {
                const rawMove = prompt(`Please play your move: ${playerMarker} in [ROW]:[COLUMN] format`);
                const moves = rawMove === "" ? "0:0".split(":") : rawMove.split(":");
                const move = createMove(moves[0], moves[1]);
                if (board.setValue(move, playerMarker)) {
                    console.log(`Marking ${move.row}:${move.col} with value: ${playerMarker}`);
                    userInputFlag = false;
                } else {
                    prompt(`Could not register value in cell ${move.row}:${move.col} with value: ${playerMarker} because it is already marked. Please try again.`);
                }

            }
        }


        board.printGrid();
        isRoundProgress = board.getStatus();

        // Switch players
        if (isRoundProgress) {
            playerPlay = (playerPlay === player1) ? player2 : player1;
        }
        else {
            console.log(`Player ${playerMarker} wins, congratulations!!`);
        }
    }

}

function createPlayer(name, marker, isBot, botLevel, roundsWon) {
    return ({ name: name, marker: marker, isBot: isBot, botLevel: botLevel, roundsWon: roundsWon });
}

function createMove(row, col) {
    return ({ row: row, col: col });
}

function botMove(board, botLevel, botMarker) {
    if (botLevel === "EASY") {
        for (i = 0; i < board.getRow(); i++) {
            for (j = 0; j < board.getColumn(); j++) {
                if (board.getValue(i, j) !== "X" && board.getValue(i, j) !== "O") {
                    return createMove(i, j);
                }
            }
        }
    }
    else if (botLevel === "MEDIUM") {

        let oppHorizontalCounter = [0, 0, 0];
        let oppVerticalCounter = [0, 0, 0];

        if (botMarker === "X") {
            oppHorizontalCounter = board.getHorizontalOCheckCounter();
            oppVerticalCounter = board.getVerticleOCheckCounter();
        }
        else if (botMarker === "O") {
            oppHorizontalCounter = board.getHorizontalXCheckCounter();
            oppVerticalCounter = board.getVerticleXCheckCounter();
        }

        for (i = 0; i < board.getRow(); i++) {
            for (j = 0; j < board.getColumn(); j++) {
                let row = minIndex(oppVerticalCounter.slice(i), i);
                let col = minIndex(oppHorizontalCounter.slice(j), j);
                let boardValue = board.getValue(row, col);
                if (boardValue !== "X" && boardValue !== "O") {
                    return createMove(row, col);
                }
            }
        }
        // Fallback
        for (i = 0; i < board.getRow(); i++) {
            for (j = 0; j < board.getColumn(); j++) {
                if (board.getValue(i, j) !== "X" && board.getValue(i, j) !== "O") {
                    return createMove(i, j);
                }
            }
        }

    }
    else if (botLevel === "HARD") {

    }
}

function minIndex(arr, startIndex) {
    let min = arr[0]
    let index = startIndex;
    for (k = 1; k < arr.length; k++) {
        if (arr[k] < min) {
            min = arr[k];
            index = startIndex + k;
        }
    }
    return index;
}

const game = gameController();

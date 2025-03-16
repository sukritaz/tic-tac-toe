const winningCombinations = [[0,1,2],
                              [3,4,5],
                              [6,7,8],
                              [0,3,6],
                              [1,4,7],
                              [2,5,8],
                              [0,4,8],
                              [2,4,6]];

export function isGameOver(board) {
    for(let i = 0; i<winningCombinations.length; i++) {
        let [index1, index2, index3] = winningCombinations[i];
        if(board[index1] === board[index2] && board[index2] === board[index3]) {
            return board[index1];
        }
    }
    if(isDraw(board)) {
        return 'draw';
    }
    return false;
}

function isDraw(board) {
    return board.every(cell => cell !== '');
}
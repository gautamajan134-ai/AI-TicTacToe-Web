const boardElement = document.getElementById("board");
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";

function createBoard() {
    boardElement.innerHTML = "";
    board.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.innerText = cell;
        cellDiv.addEventListener("click", () => handleMove(index));
        boardElement.appendChild(cellDiv);
    });
}

function handleMove(index) {
    if (board[index] !== "" || getWinner(board)) return;

    board[index] = "X";
    createBoard();

    let winner = getWinner(board);
    if (winner) {
        showResult(winner + " Wins!");
        return;
    }

    if (isFull(board)) {
        showResult("It's a Draw!");
        return;
    }

    setTimeout(() => {
        aiMove();

        let winnerAI = getWinner(board);
        if (winnerAI) {
            showResult(winnerAI + " Wins!");
            return;
        }

        if (isFull(board)) {
            showResult("It's a Draw!");
        }

    }, 300);
}

function aiMove() {
    let difficulty = document.getElementById("difficulty").value;
    let move;

    if (difficulty === "easy") {
        move = randomMove();
    } else if (difficulty === "medium") {
        move = Math.random() < 0.5 ? randomMove() : bestMove();
    } else {
        move = bestMove();
    }

    if (move !== null) {
        board[move] = "O";
        createBoard();
    }
}

function randomMove() {
    let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    return empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
}

function bestMove() {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let winner = getWinner(board);
    if (winner === "O") return 1;
    if (winner === "X") return -1;
    if (isFull(board)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                board[i] = "";
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                board[i] = "";
            }
        }
        return bestScore;
    }
}

function getWinner(board) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (let [a,b,c] of wins) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return null;
        }

function isFull(board) {
    return board.every(cell => cell !== "");
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    createBoard();
}
function showResult(message) {
    setTimeout(() => {
        alert(message);
        restartGame();
    }, 100);
}
createBoard();

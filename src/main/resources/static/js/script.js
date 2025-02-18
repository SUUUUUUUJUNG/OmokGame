const canvas = document.getElementById("omokBoard");
const ctx = canvas.getContext("2d");

const boardSize = 15;
const cellSize = 40;
canvas.width = cellSize * boardSize;
canvas.height = cellSize * boardSize;

let board = Array.from(Array(boardSize), () => Array(boardSize).fill(null));
let currentPlayer = "black";
let history = [];

const turnIndicator = document.getElementById("turnIndicator");

// 턴 표시 업데이트
function updateTurnIndicator() {
    turnIndicator.innerHTML = `현재 턴: <span class="${currentPlayer}">${currentPlayer === "black" ? "흑돌" : "백돌"}</span>`;
}

// 오목판 그리기
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e0c08c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1.5;

    for (let i = 0; i < boardSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize + cellSize / 2, cellSize / 2);
        ctx.lineTo(i * cellSize + cellSize / 2, canvas.height - cellSize / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cellSize / 2, i * cellSize + cellSize / 2);
        ctx.lineTo(canvas.width - cellSize / 2, i * cellSize + cellSize / 2);
        ctx.stroke();
    }
}

// 돌 그리기
function drawStone(x, y, color) {
    ctx.beginPath();
    ctx.arc(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, cellSize / 3, 0, Math.PI * 2);

    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 5;

    ctx.fillStyle = color === "black" ? "#000" : "#fff";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowBlur = 0;
}

// 승리 판정 함수
function checkWin(x, y, color) {
    const directions = [
        { dx: 1, dy: 0 },  // 가로 (→)
        { dx: 0, dy: 1 },  // 세로 (↓)
        { dx: 1, dy: 1 },  // 대각선 ↘
        { dx: 1, dy: -1 }  // 대각선 ↗
    ];

    for (let { dx, dy } of directions) {
        let count = 1;

        for (let i = 1; i < 5; i++) {
            let nx = x + dx * i;
            let ny = y + dy * i;
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === color) {
                count++;
            } else {
                break;
            }
        }

        for (let i = 1; i < 5; i++) {
            let nx = x - dx * i;
            let ny = y - dy * i;
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[ny][nx] === color) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 5) {
            setTimeout(() => alert(`${color === "black" ? "흑돌" : "백돌"} 승리!`), 100);
            canvas.removeEventListener("click", placeStone);
            return true;
        }
    }
    return false;
}

// 돌 놓기 함수
function placeStone(event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);

    if (board[y][x] !== null) return;

    board[y][x] = currentPlayer;
    drawStone(x, y, currentPlayer);
    history.push({ x, y, color: currentPlayer });

    if (checkWin(x, y, currentPlayer)) {
        return;
    }

    currentPlayer = currentPlayer === "black" ? "white" : "black";
    updateTurnIndicator();
}

// 무르기 기능
function undoMove() {
    if (history.length === 0) return;

    const lastMove = history.pop();
    board[lastMove.y][lastMove.x] = null;

    drawBoard();
    history.forEach(move => drawStone(move.x, move.y, move.color));

    currentPlayer = lastMove.color;
    updateTurnIndicator();
}

// 리셋 기능
function resetGame() {
    board = Array.from(Array(boardSize), () => Array(boardSize).fill(null));
    history = [];
    currentPlayer = "black";
    drawBoard();
    updateTurnIndicator();
    canvas.addEventListener("click", placeStone);
}

// 버튼 이벤트 연결
document.getElementById("undoButton").addEventListener("click", undoMove);
document.getElementById("resetButton").addEventListener("click", resetGame);

canvas.addEventListener("click", placeStone);
drawBoard();
updateTurnIndicator();

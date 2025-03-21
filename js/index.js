//Variables
const row = 4;
var col;

// Elementos del DOM
const secInformation = document.getElementById("information");
const selDifficulty = document.getElementById("dif");
const btnPlay = document.getElementById("btn-play");
const secGame = document.getElementById("game");

// Eventos
btnPlay.addEventListener("click", play);

function play() {
    getColumns();
    secInformation.style.display = "none";
    createBoard();
}

function getColumns() {
    col = selDifficulty.value;
}

function createBoard() {
    const grid = document.getElementById("grid");
    grid.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
    grid.innerHTML = '';

    const totalCells = col * row;
    for (let i = 1; i <= totalCells; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-item";
        cell.textContent = `Item ${i}`;
        grid.appendChild(cell);
    }

}

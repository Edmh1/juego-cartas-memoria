var row, col, totalCards, moves = 0, matchedCards = 0;
var flippedCards = [];
var startGame = false;
var timePlayed = [];
var timerInterval;
const secInformation = document.getElementById("information");
const selDifficulty = document.getElementById("dif");
const btnPlay = document.getElementById("btn-play");
const secGame = document.getElementById("game");
const grid = document.getElementById("grid");
const time = document.getElementById("time");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const miliseconds = document.getElementById("milliseconds");

const emojis = ["🍎", "🍌", "🍇", "🍉", "🍒", "🍋", "🍍", "🥝", "🥑", "🍆", "🥕", "🍑"]; 

btnPlay.addEventListener("click", play);
secGame.style.display = "none";

function play() {
    setGrid();
    secInformation.classList.add("scale-out-center");

    setTimeout(() => {
        secInformation.style.display = "none";
        secInformation.classList.remove("scale-out-center");
    }, 1000);

    setTimeout(() => {
        grid.classList.add("scale-in-center");
        time.classList.add("scale-in-center");
        createBoard();
        secGame.style.display = "flex";

        setTimeout(() => {
            grid.classList.remove("scale-in-center");
            time.classList.remove("scale-in-center");
        }, 500);
    }, 1100);
}

function setGrid() {
    const difficulty = selDifficulty.value;

    switch (difficulty) {
        case "4":
            col = 4; row = 4; totalCards = 16;
            break;
        case "5":
            col = 5; row = 4; totalCards = 20;
            break;
        case "6":
            col = 6; row = 4; totalCards = 24;
            break;
        default:
            col = 4; row = 4; totalCards = 16;
    }
}

function createBoard() {
    grid.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
    grid.innerHTML = '';

    let selectedEmojis = emojis.slice(0, totalCards / 2);
    let emojiPairs = [...selectedEmojis, ...selectedEmojis];
    emojiPairs = emojiPairs.sort(() => Math.random() - 0.5);

    for (let i = 0; i < totalCards; i++) {
        const cell = document.createElement("div");
        cell.className = "card-item";
        cell.dataset.emoji = emojiPairs[i];
        cell.innerHTML = `<span class="emoji">${emojiPairs[i]}</span>`;
        cell.addEventListener('click', flipCard);
        grid.appendChild(cell);
    }
}

function startTimer(){
    let startTime = Date.now();
    timerInterval = setInterval(() => {
        let elapsedTime = Date.now() - startTime;
        let ms = elapsedTime % 1000;
        let s = Math.floor((elapsedTime / 1000) % 60);
        let m = Math.floor((elapsedTime / (1000 * 60)) % 60);
        let h = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

        hours.textContent = String(h).padStart(2, '0');
        minutes.textContent = String(m).padStart(2, '0');
        seconds.textContent = String(s).padStart(2, '0');
        miliseconds.textContent = String(ms).padStart(3, '0');
    }, 10);
    timerInterval = timerInterval;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    hours.textContent = "00";
    minutes.textContent = "00";
    seconds.textContent = "00";
    miliseconds.textContent = "000";
}

function getTimerValues() {
    timePlayed.push(hours.textContent);
    timePlayed.push(minutes.textContent);
    timePlayed.push(seconds.textContent);
    timePlayed.push(miliseconds.textContent);
}

function flipCard() {

    if (!startGame) {
        startGame = true;
        startTimer();
    }

    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.querySelector(".emoji").style.visibility = "visible";
        flippedCards.push(this);
    }
    
    if (flippedCards.length === 2) {
        moves++;
        setTimeout(checkMatch, 600);
    }
}

function checkMatch() {
    if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
        flippedCards.forEach(card => card.style.pointerEvents = 'none');
        matchedCards += 2;
    } else {
        flippedCards.forEach(card => {
            card.classList.remove('flipped');
            card.querySelector(".emoji").style.visibility = "hidden";
        });
    }
    flippedCards = [];

    if (matchedCards === totalCards) {
        stopTimer();
        getTimerValues();
        Swal.fire({
            icon: "success",
            title: "¡Has encontrado todas las parejas!",
            text: "Lo completaste con un total de " + moves + " movimientos y duraste " + timePlayed.join(":") + " en completarlo.\n¿Deseas reiniciar?",
            showDenyButton: true,
            confirmButtonText: "Elegir dificultad",
            denyButtonText: "Reiniciar",
            background:"#E4F2E7",
            color:"#2D3E40",
            customClass: {
                confirmButton: 'swal-confirm-button',  // Cambia el color del botón de confirmación
                denyButton: 'swal-deny-button'       // Cambia el color del botón de denegación
            }
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            } else if (result.isDenied) {
                reset();
            }
        });
    }
}
function checkOrientation() {
    if (window.innerHeight > window.innerWidth + 180) {
        document.getElementById("rotate-device").style.display = "flex";
    } else {
        document.getElementById("rotate-device").style.display = "none";
    }
}
window.addEventListener("resize", checkOrientation);
window.addEventListener("load", checkOrientation);

function reset(){
    moves = 0;
    flippedCards = [];
    matchedCards = 0;
    startGame = false;
    resetTimer();
    createBoard();
}
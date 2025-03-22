var row, col, totalCards, moves = 0, matchedCards = 0;
var flippedCards = [];
const secInformation = document.getElementById("information");
const selDifficulty = document.getElementById("dif");
const btnPlay = document.getElementById("btn-play");
const secGame = document.getElementById("game");
const grid = document.getElementById("grid");

const emojis = ["🍎", "🍌", "🍇", "🍉", "🍒", "🍋", "🍍", "🥝", "🥑", "🍆", "🥕", "🌶"]; 

btnPlay.addEventListener("click", play);
selDifficulty.addEventListener("change", checkScreenOrientation); // Detectar cambios en la dificultad

function play() {
    setGrid();
    checkScreenOrientation(); // Verificar si se debe girar la pantalla

    secInformation.classList.add("scale-out-center");

    setTimeout(() => {
        secInformation.style.display = "none";
        secInformation.classList.remove("scale-out-center");
    }, 1000);

    setTimeout(() => {
        grid.classList.add("scale-in-center");
        createBoard();
        secGame.style.display = "flex";

        setTimeout(() => {
            grid.classList.remove("scale-in-center");
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

function flipCard() {
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
        Swal.fire({
            icon: "success",
            title: "¡Has encontrado todas las parejas!",
            text: "Lo completaste con un total de " + moves + " movimientos.\n\n ¿Deseas reiniciar?",
            showDenyButton: true,
            confirmButtonText: "Elegir dificultad",
            denyButtonText: "Reiniciar",
            background:"#E4F2E7",
            color:"#2D3E40",
            customClass: {
                confirmButton: 'swal-confirm-button',
                denyButton: 'swal-deny-button'
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

function reset(){
    moves = 0;
    flippedCards = [];
    matchedCards = 0;
    createBoard();
}

// Mostrar alerta si la pantalla es pequeña y la dificultad es normal o difícil
function checkScreenOrientation() {
    const difficulty = selDifficulty.value;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (screenWidth < 700 && screenHeight > screenWidth && (difficulty === "5" || difficulty === "6")) {
        Swal.fire({
            icon: "warning",
            title: "Gira tu dispositivo",
            text: "Para una mejor experiencia, gira tu dispositivo a modo horizontal.",
            background: "#E4F2E7",
            color: "#2D3E40",
            confirmButtonText: "Entendido",
            customClass: {
                confirmButton: 'swal-confirm-button'
            }
        });
    }
}

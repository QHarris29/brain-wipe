const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0; //initial score value.
let timer;
let timerSeconds = 9; // Initial timer value in seconds

document.querySelector(".score").textContent = score;

fetch("./data/cards.json")
    .then((res) => res.json())
    .then((data) => {
        cards = [...data, ...data];
        shuffleCards();
        generateCards();
    });

function shuffleCards() {
    let currentIndex = cards.length,
        randomIndex,
        temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
        <div class="front">
            <img class="front-image" src=${card.image} />
        </div>
        <div class="back"></div>
             `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    score++;
    document.querySelector(".score").textContent = score;
    lockBoard = true;

    checkForMatch();
}

function checkWin() {
    const allMatched = document.querySelectorAll('.flipped').length === cards.length;
    const isHighScore = score === 9;

    if (allMatched && isHighScore) {
        // Display the "You got the high score" popup
        alert("You got the high score!");

        // You can also customize the appearance of the popup using a modal or any other UI component.
    }
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();

    // Check for win after each match
    checkWin();
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function startGame() {
    document.getElementById("timer").textContent = timerSeconds;

    flipAllCards(true);

    startTimer();

    setTimeout(() => {
        flipAllCards(false);
        startTimer();
    }, 10000);
}

function startTimer() {
    timer = setInterval(() => {
        document.getElementById("timer").textContent = timerSeconds;

        if (timerSeconds === 0) {
            clearInterval(timer);
            endGame();
        } else {
            timerSeconds--;
        }
    }, 1000);
}

function restartGame() {
    flipAllCards(false);
    score = 0;
    document.querySelector(".score").textContent = score;
    clearInterval(timer);

    // Reset timerSeconds to its initial value
    timerSeconds = 9; // or whatever initial value you want

    // Add event listeners to all cards
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.addEventListener("click", flipCard);
    });
}

function flipAllCards(faceUp) {
    let allCards = document.querySelectorAll('.card');

    allCards.forEach(card => {
        if (faceUp) {
            card.classList.add('flipped');
        } else {
            card.classList.remove('flipped');
        }
    });
}

function simulateWin() {
    // Simulate winning the game by flipping all cards
    flipAllCards(true);

    // Call checkWin to show the "You got the high score" popup
    checkWin();
}

// Add a button or a keyboard shortcut to trigger the simulation
const simulateWinButton = document.getElementById("simulateWinButton");
simulateWinButton.addEventListener("click", simulateWin);


const startBtn = document.getElementById("start")
startBtn.addEventListener("click", startGame)

const restartBtn = document.getElementById("restart")
restartBtn.addEventListener("click", restartGame);



const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let timer;

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

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
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
    // Flip all cards face up at the beginning
    flipAllCards(true);

    // Wait for a short duration before flipping cards face down and starting the timer
    setTimeout(() => {
        flipAllCards(false); // Flip all cards face down after a short delay
        startTimer();
    }, 10000); // Set the delay to 10 seconds (10000 milliseconds)
}

function restartGame() {
    // Flip all cards face down
    flipAllCards(false);

    // Reset the game state
    score = 0;
    document.querySelector(".score").textContent = score;

    // Clear any existing timer
    clearInterval(timer);

    // Re-add click event listeners to all cards
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

function startTimer() {
    timer = setInterval(() => {
        // Timer logic here
        console.log("Time remaining...");
        // You can update a timer display if needed

        // Example: If you want to end the game after 30 seconds
        if (timerSeconds === 0) {
            clearInterval(timer);
            // Call a function to handle the end of the game
            endGame();
        }
    }, 1000); // Update the timer every 1000 milliseconds (1 second)
}

const startBtn = document.getElementById("start")
startBtn.addEventListener("click", startGame)

const restartBtn = document.getElementById("restart")
restartBtn.addEventListener("click", restartGame);



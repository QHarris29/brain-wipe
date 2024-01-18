const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0; //initial score value.
let timer;
let timerSeconds = 9; // Initial timer value in seconds
let isDarkMode = true;
let youtubePlayer;
const toggleModeBtn = document.getElementById("toggleMode");
toggleModeBtn.addEventListener("click", toggleMode);

document.querySelector(".score").textContent = score;

//// Shuffles the order of the cards array ... Creates and returns a card element with front and back elements.
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

// Creates a DOM element for a card using the provided card data.
function createCardElement(card) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);

    const frontElement = document.createElement("div");
    frontElement.classList.add("front");
    frontElement.style.backgroundImage = `url(${card.image})`;

    const backElement = document.createElement("div");
    backElement.classList.add("back");

    cardElement.appendChild(frontElement);
    cardElement.appendChild(backElement);

    return cardElement;
}

// Generates the cards on the grid container based on the current cards array. Creates card elements and adds event listeners to them.
function generateCards() {
    for (let card of cards) {
        const cardElement = createCardElement(card);
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
}

// Handles the logic when a card is flipped. Checks if the board is locked, if it's the first or second card, and updates the score.Calls checkForMatch, disables cards, or flips them back based on the match result.
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

// Checks if the player has won and achieved a high score. Checks if all cards are flipped and if the score is at a high score value.
function checkWin() {
    const allMatched = document.querySelectorAll('.flipped').length === cards.length;
    const isHighScore = score === 9;

    if (allMatched && isHighScore) {
        // Display the "You got the high score" popup
        alert("You got the high score!");
    } else if (allMatched && score > 9) {
        // Display perfect score popup
        alert("GOOD JOB! Click reset and try for a perfect score!!!");
    }
}

// Checks if the flipped pair of cards is a match. Compares the names of the first and second card's dataset. Calls disableCards or unflipCards based on the match result.
function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();

    // Check for win after each match
    checkWin();
}

// Disables the event listeners for a matched pair of cards.
function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}

// Flips back the unmatched pair of cards after a short delay.
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

// Resets the board after a pair of cards has been checked.
function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// Initiates the start of the game by flipping all cards and starting the timer.
function resetTimer() {
    timerSeconds = 10;
    document.getElementById("timer").textContent = timerSeconds;
}

function startGame() {
    resetTimer(); // Reset the timer before starting the game

    // If the timer is already running, clear it
    if (timer) {
        clearInterval(timer);
    }

    // Flip all cards face up
    flipAllCards(true);

    // Start the timer
    startTimer();

    // Set a timeout to flip the cards back and start the timer again after 10 seconds
    setTimeout(() => {
        flipAllCards(false);
    }, 10000);
}

// Starts the countdown timer and ends the game when the time is up.
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

// Resets the game state, including score, timer, and card layout.
function resetGame() {
    resetTimer();
    flipAllCards(false);
    score = 0;
    document.querySelector(".score").textContent = score;

    // Reset timerSeconds to its initial value
    timerSeconds = 10; // Set to 10 seconds for the reset

    // Display the initial time on the timer
    document.getElementById("timer").textContent = timerSeconds;

    // Clear the existing timer (if it's running)
    clearInterval(timer);

    // Clear the existing cards in the grid-container
    gridContainer.innerHTML = '';

    // Shuffle the cards
    shuffleCards();

    // Regenerate the cards
    generateCards();

    // Add event listeners to all cards
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.addEventListener("click", flipCard);
        card.classList.remove('flipped'); // Make sure cards are not flipped
    });
}

// Flips all cards either face up or face down.
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

function toggleMode() {
    const body = document.body;
    isDarkMode = !isDarkMode;

    if (isDarkMode) {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode");
    } else {
        body.classList.add("light-mode");
        body.classList.remove("dark-mode");
    }
}

// Changes the theme by loading new card data based on the selected theme.
function changeTheme() {
    const themeSelector = document.getElementById("theme");
    const selectedTheme = themeSelector.value;

    // Clear the existing cards in the grid-container
    gridContainer.innerHTML = '';

    // Load corresponding JSON file based on the selected theme
    fetch(`./data/${selectedTheme}Cards.json`)
        .then((res) => res.json())
        .then((data) => {
            // Update the cards array and regenerate the cards
            cards = [...data, ...data];
            shuffleCards();
            generateCards();
        });
}



// Call changeTheme with the default theme when the page loads
changeTheme();

// Adds event listeners to the start and restart buttons.
const startBtn = document.getElementById("start")
startBtn.addEventListener("click", startGame)

const restartBtn = document.getElementById("restart")
restartBtn.addEventListener("click", resetGame);
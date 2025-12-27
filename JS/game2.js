/**
 * game2.js
 * Memory Card Game.
 * Concepts: Arrays, Sorting/Shuffling, DOM Creation, Logic state.
 */

const session = getSession();
if(!session) window.location.href = 'login.html';

const board = document.getElementById('memory-board');
const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
let cards = [...symbols, ...symbols]; // Duplicate pairs
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchesFound = 0;

// 1. Shuffle Algorithm (Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 2. Build Board
function initGame() {
    board.innerHTML = '';
    const shuffledCards = shuffle(cards);

    shuffledCards.forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.symbol = symbol;
        card.innerText = symbol; 
        
        // Hide symbol visually initially (done via CSS, but logic here)
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

// 3. Game Logic
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return; // Prevent double click on same card

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second click
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();
    matchesFound++;

    // Win Condition
    if (matchesFound === symbols.length) {
        setTimeout(() => {
            alert('You Won! +50 Points');
            const user = findUser(session.username);
            updateUser(session.username, {
                score: user.score + 50,
                gamesPlayed: (user.gamesPlayed || 0) + 1
            });
            window.location.href = 'main.html';
        }, 500);
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000); // Wait 1 second before flipping back
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

initGame();
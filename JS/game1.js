/**
 * game1.js
 * Catcher Game.
 * Concepts: setInterval, DOM styling (left/top), Key events, Collision detection.
 */

const session = getSession();
if(!session) window.location.href = 'login.html';

const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('game-score');

let playerX = 180; // Starting position
let gameInterval;
let score = 0;
let isGameOver = false;

// 1. Player Movement (Event Listener)
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    
    if (e.key === 'ArrowLeft' && playerX > 0) {
        playerX -= 20;
    } else if (e.key === 'ArrowRight' && playerX < 360) {
        playerX += 20;
    }
    player.style.left = playerX + 'px';
});

// 2. Game Loop
function startGame() {
    score = 0;
    isGameOver = false;
    scoreDisplay.innerText = 0;
    
    // Clear previous objects
    document.querySelectorAll('.falling-object').forEach(e => e.remove());

    gameInterval = setInterval(() => {
        createFallingObject();
    }, 1000); // New object every 1 second
}

// 3. Create DOM Elements
function createFallingObject() {
    const obj = document.createElement('div');
    obj.classList.add('falling-object');
    // Random horizontal position
    obj.style.left = Math.floor(Math.random() * 370) + 'px'; 
    obj.style.top = '0px';
    gameArea.appendChild(obj);

    let objY = 0;
    
    // Inner Interval for movement
    const moveInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(moveInterval);
            return;
        }

        objY += 5; // Speed
        obj.style.top = objY + 'px';

        // Collision Detection
        if (checkCollision(player, obj)) {
            // Caught object!
            score += 10;
            scoreDisplay.innerText = score;
            obj.remove();
            clearInterval(moveInterval);
        } else if (objY > 380) {
            // Missed object -> Game Over
            endGame();
            clearInterval(moveInterval);
        }
    }, 30);
}

// 4. Math: Rectangle Intersection
function checkCollision(playerDiv, objDiv) {
    const pRect = playerDiv.getBoundingClientRect();
    const oRect = objDiv.getBoundingClientRect();

    return !(
        pRect.top > oRect.bottom ||
        pRect.bottom < oRect.top ||
        pRect.right < oRect.left ||
        pRect.left > oRect.right
    );
}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    alert(`Game Over! Final Score: ${score}`);
    
    // Update User Stats
    const user = findUser(session.username);
    updateUser(session.username, {
        score: user.score + score, // Accumulate score
        gamesPlayed: (user.gamesPlayed || 0) + 1
    });
    
    window.location.href = 'main.html';
}

// Start immediately
startGame();
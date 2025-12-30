/**
 * game1.js
 * Catcher Game.
 * Concepts: requestAnimationFrame (Unit 11), Collision detection, Arrays.
 */

const session = getSession();
if(!session) window.location.href = 'login.html';

const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('game-score');
const menu = document.getElementById('difficulty-menu');

// Game State
let playerX = 180;
let score = 0;
let isGameOver = false;
let animationId; // מזהה האנימציה לעצירה
let activeObjects = []; 

// Settings
let currentDifficulty = 'medium';
let fallSpeed = 5;
let spawnRate = 1000;
let spawnInterval;

// 1. Player Movement
document.addEventListener('keydown', (e) => {
    if (isGameOver || menu.style.display !== 'none') return;
    
    if (e.key === 'ArrowLeft' && playerX > 0) {
        playerX -= 20;
    } else if (e.key === 'ArrowRight' && playerX < 360) {
        playerX += 20;
    }
    player.style.left = playerX + 'px';
});

// 2. Setup Difficulty
function setDifficulty(level) {
    currentDifficulty = level;
    switch(level) {
        case 'easy': fallSpeed = 3; spawnRate = 1200; break;
        case 'medium': fallSpeed = 6; spawnRate = 900; break;
        case 'hard': fallSpeed = 10; spawnRate = 600; break;
    }
    menu.style.display = 'none';
    startGame();
}

// Game Loop using requestAnimationFrame (Unit 11)
function startGame() {
    score = 0;
    isGameOver = false;
    scoreDisplay.innerText = 0;
    activeObjects = [];
    
    // Clean old elements
    document.querySelectorAll('.falling-object').forEach(e => e.remove());

    // Start Spawning Objects
    spawnInterval = setInterval(createFallingObject, spawnRate);

    // Start Animation Loop
    animationId = requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (isGameOver) return;

    // Update all active objects
    updateObjects();

    // Request next frame
    animationId = requestAnimationFrame(gameLoop);
}

//Object Management
function createFallingObject() {
    if (isGameOver) return;

    const div = document.createElement('div');
    div.classList.add('falling-object');
    div.style.left = Math.floor(Math.random() * 370) + 'px'; 
    div.style.top = '0px';
    gameArea.appendChild(div);

    // הוספה למערך הניהול
    activeObjects.push({
        element: div,
        y: 0
    });
}

function updateObjects() {
    // מעבר על המערך ועדכון מיקומים (במקום טיימר לכל אובייקט)
    for (let i = 0; i < activeObjects.length; i++) {
        let obj = activeObjects[i];
        
        obj.y += fallSpeed;
        obj.element.style.top = obj.y + 'px';

        // Collision Check
        if (checkCollision(player, obj.element)) {
            score += 10;
            scoreDisplay.innerText = score;
            // הסרה מה-DOM ומהמערך
            obj.element.remove();
            activeObjects.splice(i, 1);
            i--; // תיקון אינדקס
        } 
        // Missed object
        else if (obj.y > 380) {
            endGame();
            return;
        }
    }
}

//Utilities
function checkCollision(playerDiv, objDiv) {
    const pRect = playerDiv.getBoundingClientRect();
    const oRect = objDiv.getBoundingClientRect();
    return !(pRect.top > oRect.bottom || pRect.bottom < oRect.top || pRect.right < oRect.left || pRect.left > oRect.right);
}

function endGame() {
    if (isGameOver) return;
    isGameOver = true;
    
    // Stop everything
    cancelAnimationFrame(animationId);
    clearInterval(spawnInterval);
    
    alert(`Game Over! Score: ${score} (${currentDifficulty})`);
    
    // Update Stats
    const user = findUser(session.username);
    const currentLevelScores = user.levelScores || { easy: 0, medium: 0, hard: 0 };
    currentLevelScores[currentDifficulty] += score;

    updateUser(session.username, {
        score: user.score + score,
        levelScores: currentLevelScores,
        gamesPlayed: (user.gamesPlayed || 0) + 1
    });
    
    window.location.href = 'main.html';
}
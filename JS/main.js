/**
 * main.js
 * Dashboard logic.
 * Concepts: Reduce (Unit 6), Date Objects (Unit 9), Objects/Methods (Unit 7).
 */

const session = getSession();
if (!session) {
    window.location.href = 'login.html';
}

// UI Manager Object (Unit 7 - Object Methods)
const UIManager = {
    // מתודות לעדכון ה-DOM
    updateGreeting: function(username) {
        // Unit 9 - Date Objects logic
        const hour = new Date().getHours();
        let greeting = "Welcome";
        
        if (hour < 12) greeting = "Good Morning";
        else if (hour < 18) greeting = "Good Afternoon";
        else greeting = "Good Evening";

        document.querySelector('header h1').innerHTML = 
            `${greeting}, <span id="display-username">${username}</span>`;
    },
    
    updateStats: function(user) {
        document.getElementById('display-score').innerText = user.score;
        document.getElementById('display-login').innerText = user.lastLogin 
            ? new Date(user.lastLogin).toLocaleString() 
            : "First Login";
    },

    updateServerStats: function(users) {
        // Unit 6 - Reduce
        // חישוב סך כל הנקודות של כל השחקנים במערכת
        const totalServerScore = users.reduce((sum, u) => sum + (u.score || 0), 0);
        document.getElementById('display-server-score').innerText = totalServerScore;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const user = findUser(session.username);
    const allUsers = getUsers();

    // שימוש באובייקט לניהול התצוגה
    UIManager.updateGreeting(user.username);
    UIManager.updateStats(user);
    UIManager.updateServerStats(allUsers);

    document.getElementById('btn-logout').addEventListener('click', logoutUser);

    // Load Leaderboard (מהלוגיקה הקודמת)
    loadLeaderboard('total');
});

// --- פונקציות טבלת מובילים (נשאר כפי שכתבנו קודם) ---
function loadLeaderboard(type, btnElement) {
    const users = getUsers();
    const tableBody = document.getElementById('leaderboard-body');

    if (btnElement) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
    }

    const topUsers = users.sort((a, b) => {
        let scoreA, scoreB;
        if (type === 'total') {
            scoreA = a.score || 0;
            scoreB = b.score || 0;
        } else {
            scoreA = (a.levelScores && a.levelScores[type]) ? a.levelScores[type] : 0;
            scoreB = (b.levelScores && b.levelScores[type]) ? b.levelScores[type] : 0;
        }
        return scoreB - scoreA;
    }).slice(0, 5);

    tableBody.innerHTML = '';
    
    if (topUsers.length === 0 || (type !== 'total' && !topUsers[0].levelScores?.[type])) {
        tableBody.innerHTML = '<tr><td colspan="3">No scores yet.</td></tr>';
        return;
    }

    topUsers.forEach((u, index) => {
        const tr = document.createElement('tr');
        if (u.username === session.username) {
            tr.style.backgroundColor = "#e8f6f3";
            tr.style.fontWeight = "bold";
        }
        let displayScore = (type === 'total') ? u.score : ((u.levelScores && u.levelScores[type]) || 0);
        tr.innerHTML = `<td>${index + 1}</td><td>${u.username}</td><td>${displayScore}</td>`;
        tableBody.appendChild(tr);
    });
}
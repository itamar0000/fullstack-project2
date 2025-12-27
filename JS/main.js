/**
 * main.js
 * Dashboard logic.
 * Concepts: Session check, DOM updating from Objects.
 */

// Check session immediately
const session = getSession();
if (!session) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Load fresh user data
    const user = findUser(session.username);

    // Update DOM elements
    document.getElementById('display-username').innerText = user.username;
    document.getElementById('display-score').innerText = user.score;
    document.getElementById('display-login').innerText = user.lastLogin 
        ? new Date(user.lastLogin).toLocaleString() 
        : "First Login";

    // Logout Handler
    document.getElementById('btn-logout').addEventListener('click', logoutUser);
});
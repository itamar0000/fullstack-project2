/**
 * storage.js
 * Handles all interactions with LocalStorage.
 * Concepts: Objects, Arrays, JSON parsing/stringifying, filtering.
 */

const DB_KEY = 'users_db';
const SESSION_KEY = 'active_session';

// Initialize DB if empty
function initDB() {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify([]));
    }
}

// Get all users
function getUsers() {
    initDB();
    return JSON.parse(localStorage.getItem(DB_KEY));
}

// Save a new user
function saveUser(userObj) {
    const users = getUsers();
    users.push(userObj);
    localStorage.setItem(DB_KEY, JSON.stringify(users));
}

// Update existing user data (for scores)
function updateUser(username, updates) {
    const users = getUsers();
    // Array Iterator: map
    const newUsers = users.map(u => {
        if (u.username === username) {
            return { ...u, ...updates }; // Object spread to update fields
        }
        return u;
    });
    localStorage.setItem(DB_KEY, JSON.stringify(newUsers));
}

// Find user by username
function findUser(username) {
    const users = getUsers();
    // Array Iterator: find
    return users.find(u => u.username === username);
}

// Session Management
function loginUser(username) {
    const sessionData = {
        username: username,
        loginTime: new Date().getTime(), // Timestamp
        expiry: new Date().getTime() + (30 * 60 * 1000) // 30 minutes
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

function getSession() {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    
    const session = JSON.parse(sessionStr);
    const now = new Date().getTime();

    // Check expiration
    if (now > session.expiry) {
        logoutUser();
        return null;
    }
    return session;
}

function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
}
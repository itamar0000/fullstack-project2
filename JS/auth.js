/**
 * auth.js
 * Handles Form Validation, Regex, and Login Logic.
 * Concepts: Events, DOM Value access, Regular Expressions (Unit 12).
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');

    // --- REGISTRATION LOGIC ---
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('reg-username').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            const errorDiv = document.getElementById('reg-error');

            // 1. Regex Validation (Unit 12)
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            
            // סיסמה חזקה: לפחות אות קטנה, אות גדולה, מספר, ומינימום 6 תווים
            // (?=.*[a-z]) -> Lookahead: מוודא שיש אות קטנה
            // (?=.*[A-Z]) -> Lookahead: מוודא שיש אות גדולה
            // (?=.*\d)    -> Lookahead: מוודא שיש ספרה
            const strongPassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

            if (!emailRegex.test(email)) {
                errorDiv.innerText = "Invalid Email Format";
                return;
            }

            if (!strongPassRegex.test(password)) {
                errorDiv.innerText = "Password must verify: 1 Uppercase, 1 Lowercase, 1 Number, 6+ chars";
                return;
            }

            // 2. Check Duplicates
            if (findUser(username)) {
                errorDiv.innerText = "Username already taken";
                return;
            }

            // 3. Create User Object
            const newUser = {
                username: username,
                email: email,
                password: password,
                score: 0,
                gamesPlayed: 0,
                levelScores: { easy: 0, medium: 0, hard: 0 }, // הכנה למשחק 1
                lastLogin: null,
                failedAttempts: 0,
                lockUntil: null
            };

            saveUser(newUser);
            alert("Registration Successful!");
            window.location.href = 'login.html';
        });
    }

    // --- LOGIN LOGIC ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('login-error');

            const user = findUser(username);

            if (!user) {
                errorDiv.innerText = "User not found";
                return;
            }

            // Check Lockout
            const now = new Date().getTime();
            if (user.lockUntil && now < user.lockUntil) {
                const remaining = Math.ceil((user.lockUntil - now) / 1000);
                errorDiv.innerText = `Account locked. Try again in ${remaining}s`;
                return;
            }

            if (user.password === password) {
                updateUser(username, { 
                    failedAttempts: 0, 
                    lockUntil: null, 
                    lastLogin: new Date().toISOString() 
                });
                loginUser(username);
                window.location.href = 'main.html';
            } else {
                let newAttempts = (user.failedAttempts || 0) + 1;
                let updates = { failedAttempts: newAttempts };

                if (newAttempts >= 3) {
                    updates.lockUntil = now + (30 * 1000); 
                    errorDiv.innerText = "Too many failed attempts. Locked for 30s.";
                } else {
                    errorDiv.innerText = `Wrong password. Attempt ${newAttempts}/3`;
                }
                updateUser(username, updates);
            }
        });
    }
});
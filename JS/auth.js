/**
 * auth.js
 * Handles Form Validation, Regex, and Login Logic.
 * Concepts: Events, DOM Value access, Regular Expressions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Determine which form is currently on screen
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');

    // --- REGISTRATION LOGIC ---
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload

            const username = document.getElementById('reg-username').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            const errorDiv = document.getElementById('reg-error');

            // 1. Regex Validation
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            const passRegex = /.{6,}/; // Min 6 chars

            if (!emailRegex.test(email)) {
                errorDiv.innerText = "Invalid Email Format";
                return;
            }
            if (!passRegex.test(password)) {
                errorDiv.innerText = "Password must be 6+ chars";
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
                password: password, // In real app, hash this!
                score: 0,
                gamesPlayed: 0,
                lastLogin: null,
                failedAttempts: 0,
                lockUntil: null
            };

            saveUser(newUser);
            alert("Registration Successful!");
            window.location.href = 'login.html'; // Redirect
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

            // 1. Check if user exists
            if (!user) {
                errorDiv.innerText = "User not found";
                return;
            }

            // 2. Check Lockout (Date comparison)
            const now = new Date().getTime();
            if (user.lockUntil && now < user.lockUntil) {
                const remaining = Math.ceil((user.lockUntil - now) / 1000);
                errorDiv.innerText = `Account locked. Try again in ${remaining}s`;
                return;
            }

            // 3. Validate Password
            if (user.password === password) {
                // Success: Reset failed attempts
                updateUser(username, { 
                    failedAttempts: 0, 
                    lockUntil: null, 
                    lastLogin: new Date().toISOString() 
                });
                
                loginUser(username);
                window.location.href = 'main.html';
            } else {
                // Failure: Increment attempts
                let newAttempts = (user.failedAttempts || 0) + 1;
                let updates = { failedAttempts: newAttempts };

                // Lock logic after 3 fails
                if (newAttempts >= 3) {
                    updates.lockUntil = now + (30 * 1000); // Lock for 30 seconds
                    errorDiv.innerText = "Too many failed attempts. Locked for 30s.";
                } else {
                    errorDiv.innerText = `Wrong password. Attempt ${newAttempts}/3`;
                }
                updateUser(username, updates);
            }
        });
    }
});
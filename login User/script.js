document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get user input
    const usernameOrEmail = document.getElementById("username").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();
    const rememberMe = document.getElementById("rememberMe").checked;

    // Retrieve stored users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the user exists
    const user = users.find(u => 
        (u.username.toLowerCase() === usernameOrEmail || u.email.toLowerCase() === usernameOrEmail)
    );

    if (!user) {
        alert("Account not found! Please sign up first.");
        window.location.href = "../sign up/index.html";
        return;
    }

    // Check if password matches
    if (user.password !== password) {
        alert("Incorrect password. Please try again.");
        return;
    }

    // Successful login
    alert("Login successful!");

    // Retrieve the current logged-in users
    const loggedInUsers = JSON.parse(localStorage.getItem("loggedInUsers")) || [];

    // Check if the user is already logged in
    const isAlreadyLoggedIn = loggedInUsers.some(loggedInUser => loggedInUser.username === user.username);

    if (!isAlreadyLoggedIn) {
        // Add the user to the logged-in users list
        loggedInUsers.push({ username: user.username, email: user.email });
        localStorage.setItem("loggedInUsers", JSON.stringify(loggedInUsers));
    }

    // Store the current user for session management
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Remember the user if "Remember Me" is checked
    if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify({ username: user.username, password }));
    } else {
        localStorage.removeItem("rememberedUser");
    }

    window.location.href = "../dashboard/index.html";
});

// Toggle password visibility
document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});
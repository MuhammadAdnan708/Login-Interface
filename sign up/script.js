document.getElementById('signupForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Get input values
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const gender = document.getElementById('gender').value;
  const question1 = document.getElementById('question1').value;
  const answer1 = document.getElementById('answer1').value;

  // Regular expressions
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Error messages
  let hasError = false;

  function showError(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.innerText = message;
    errorElement.style.display = "block";
    hasError = true;
  }

  function clearError(id) {
    document.getElementById(id).innerText = "";
  }

  // Clear previous errors
  document.querySelectorAll(".error-message").forEach(e => e.style.display = "none");

  // Validation checks
  if (!username) showError("username-error", "Username is required.");
  if (!email) showError("email-error", "Email is required.");
  else if (!emailPattern.test(email)) showError("email-error", "Invalid email format.");
  
  if (!password) showError("password-error", "Password is required.");
  else if (password.length < 8) showError("password-error", "Password must be at least 8 characters.");
  
  if (!confirmPassword) showError("confirmPassword-error", "Please confirm your password.");
  else if (password !== confirmPassword) showError("confirmPassword-error", "Passwords do not match.");
  
  if (!gender) showError("gender-error", "Please select your gender.");
  if (!question1) showError("question1-error", "Please select a security question.");
  if (!answer1) showError("answer1-error", "Please provide an answer.");

  if (hasError) return;

  // Check if email is already registered
  let users = localStorage.getItem("users");
  users = users ? JSON.parse(users) : [];
  const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    showError("email-error", "This email is already registered.");
    return;
  }

  // Save user data
  const newUser = {
    username,
    email,
    password,
    gender,
    securityQuestions: [{ question: question1, answer: answer1 }]
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Sign-up successful!");
  window.location.href = "../login User/index.html";
});
document.getElementById("loginBtn").addEventListener("click", function () {
  window.location.href = "../login User/index.html";
});
// Toggle password visibility
document.querySelectorAll(".password-group i").forEach(icon => {
  icon.addEventListener("click", function () {
    const input = document.getElementById(this.previousElementSibling.id);
    input.type = input.type === "password" ? "text" : "password";
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });
});

document.addEventListener("DOMContentLoaded", function () {
    // Show security question modal when the form is submitted
    document.getElementById("forgotForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("emailOrUsername").value.trim();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(user => user.email === email);

        if (!user) {
            alert("No account found with that email.");
            return;
        }

        // Populate the dropdown with the user's security questions
        const questionDropdown = document.getElementById("selectedQuestion");
        questionDropdown.innerHTML = ""; // Clear existing options
        user.securityQuestions.forEach((q, index) => {
            const option = document.createElement("option");
            option.value = index; // Use the question's index to identify it
            option.textContent = q.question;
            questionDropdown.appendChild(option);
        });

        // Show the security question modal and blur the background
        const modal = document.getElementById("securityModal");
        modal.style.display = "block";
        document.body.classList.add("modal-active");
    });

    // Validate security question answer and show the password creation modal
    document.getElementById("securityForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("emailOrUsername").value.trim();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(user => user.email === email);

        const selectedQuestionIndex = document.getElementById("selectedQuestion").value;
        const providedAnswer = document.getElementById("securityAnswer").value.trim();

        if (!selectedQuestionIndex) {
            alert("Please select a security question.");
            return;
        }

        const correctAnswer = user.securityQuestions[selectedQuestionIndex].answer;

        if (providedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            // Close the security question modal
            closeModal();

            // Show the new password modal
            const passwordModal = document.getElementById("passwordModal");
            passwordModal.style.display = "block";
        } else {
            alert("Incorrect answer. Please try again.");
        }
    });

    // Close any open modal and remove blur
    function closeModal() {
        const modals = document.querySelectorAll(".modal");
        modals.forEach(modal => modal.style.display = "none");
        document.body.classList.remove("modal-active");
    }

    // Attach the closeModal function to all cancel buttons
    document.querySelectorAll(".cancel-button").forEach(button => {
        button.addEventListener("click", closeModal);
    });

    // New Password Form Submission
    document.getElementById("newPasswordForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("emailOrUsername").value.trim();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(user => user.email === email);

        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        // Clear previous error messages
        document.getElementById("newPasswordError").textContent = "";
        document.getElementById("confirmPasswordError").textContent = "";

        // Validate password length
        if (newPassword.length < 8) {
            document.getElementById("newPasswordError").textContent = "Password must be at least 8 characters long.";
            return;
        }

        // Validate password match
        if (newPassword !== confirmPassword) {
            document.getElementById("confirmPasswordError").textContent = "Passwords do not match. Please try again.";
            return;
        }

        // Update user password
        user.password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));

        alert("Password updated successfully. You can now log in with your new password.");
        window.location.href = "../login User/index.html"; // Redirect to login page
    });

    // Toggle visibility for the new password field
    document.getElementById("toggleNewPassword").addEventListener("click", function () {
        const newPasswordInput = document.getElementById("newPassword");
        const icon = this;

        // Toggle password visibility
        if (newPasswordInput.type === "password") {
            newPasswordInput.type = "text"; // Show password
            icon.classList.remove("fa-eye"); // Change icon to "eye-slash"
            icon.classList.add("fa-eye-slash");
        } else {
            newPasswordInput.type = "password"; // Hide password
            icon.classList.remove("fa-eye-slash"); // Change icon back to "eye"
            icon.classList.add("fa-eye");
        }
    });

    // Toggle visibility for the confirm password field
    document.getElementById("toggleConfirmPassword").addEventListener("click", function () {
        const confirmPasswordInput = document.getElementById("confirmPassword");
        const icon = this;

        // Toggle password visibility
        if (confirmPasswordInput.type === "password") {
            confirmPasswordInput.type = "text"; // Show password
            icon.classList.remove("fa-eye"); // Change icon to "eye-slash"
            icon.classList.add("fa-eye-slash");
        } else {
            confirmPasswordInput.type = "password"; // Hide password
            icon.classList.remove("fa-eye-slash"); // Change icon back to "eye"
            icon.classList.add("fa-eye");
        }
    });
});
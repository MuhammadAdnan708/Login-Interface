document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Redirect to login if no user is logged in
    if (!currentUser) {
        window.location.href = "../login User/index.html";
        return;
    }

    // Display user details
    document.getElementById("usernameDisplay").textContent = currentUser.username;
    document.getElementById("emailDisplay").textContent = currentUser.email;

    // Display profile picture (fetch from localStorage)
    const profilePicElement = document.getElementById("profilePic");
    const savedProfilePic = localStorage.getItem(`profilePic_${currentUser.username}`) || "defaultProfilePic.jpg";
    profilePicElement.src = savedProfilePic;

    // Show Home section by default
    showSection('homeContent');

    // Add event listeners for navigation
    document.getElementById('homeLink').addEventListener('click', function () {
        showSection('homeContent');
    });

    document.getElementById('settingsLink').addEventListener('click', function () {
        showSection('settingsContent');
    });

    document.getElementById('coursesLink').addEventListener('click', function () {
        showSection('coursesContent');
    });

    // Function to show/hide sections
    function showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(function (section) {
            section.style.display = 'none';
        });

        // Show the selected section
        document.getElementById(sectionId).style.display = 'block';
    }

    // Handle logout
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("currentUser"); // Remove current user but keep profile picture
        window.location.href = "../login User/index.html";
    });

    // Handle username and password update
    const settingsForm = document.getElementById("settingsForm");
    settingsForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const newUsername = document.getElementById("newUsername").value;
        const newPassword = document.getElementById("newPassword").value;

        if (!newUsername && !newPassword) {
            alert("Please enter a new username or password.");
            return;
        }

        // Store the old username for updating in the users list
        const oldUsername = currentUser.username;

        // Retrieve the current profile picture before updating
        const currentProfilePic = localStorage.getItem(`profilePic_${oldUsername}`);

        if (newUsername) {
            currentUser.username = newUsername;
        }

        if (newPassword) {
            currentUser.password = newPassword;
        }

        // Save updated user info to localStorage
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        // Update the users array in localStorage
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Remove old user entry and add updated one
        users = users.filter(user => user.username !== oldUsername);
        users.push(currentUser);

        // Save the updated users array to localStorage
        localStorage.setItem("users", JSON.stringify(users));

        // If profile picture exists for the old username, update it with the new username
        if (currentProfilePic) {
            localStorage.setItem(`profilePic_${newUsername}`, currentProfilePic);
            localStorage.removeItem(`profilePic_${oldUsername}`); // Remove old profile pic entry
        }

        // Show confirmation message
        const stayOnPage = confirm("Your details have been updated successfully!\n\nDo you want to stay on this page? Click 'OK' to stay, or 'Back' to log in again.");

        if (!stayOnPage) {
            // Redirect to login page if user chooses to log in again
            window.location.href = "../login User/index.html";
        } else {
            // Update the displayed username if staying on the page
            document.getElementById("usernameDisplay").textContent = currentUser.username;

            // Update the displayed profile picture
            profilePicElement.src = currentProfilePic || "defaultProfilePic.jpg";
        }
    });

    // Update Profile Picture
    profilePicElement.addEventListener("click", function () {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
    
        fileInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = function () {
                    const profilePicUrl = reader.result;
    
                    // Save the new profile picture in localStorage with the current username
                    localStorage.setItem(`profilePic_${currentUser.username}`, profilePicUrl);
    
                    // Update the profile picture element
                    profilePicElement.src = profilePicUrl;
    
                    // Show success message
                    alert("Profile picture updated successfully!");
                };
                reader.readAsDataURL(file);
            }
        });
    
        fileInput.click(); // Open file dialog
    });
    
// File upload and preview functionality
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

// Modal elements
const modal = document.getElementById("fileModal");
const modalContent = document.getElementById("modalContent");
const closeModalBtn = document.querySelector(".close-btn");



// Open modal with file preview
function openFilePreview(file) {
    modalContent.innerHTML = ""; // Clear previous content

    if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.style.maxWidth = "100%";
        img.style.borderRadius = "8px";
        modalContent.appendChild(img);
    } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.controls = true;
        video.style.maxWidth = "100%";
        modalContent.appendChild(video);
    } else {
        modalContent.innerHTML = `<p>Preview not available for this file type.</p>`;
    }

    modal.style.display = "block"; // Show modal
}

uploadBtn.addEventListener("click", function () {
    fileInput.click();
});

 // Load stored files from localStorage
 let uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
// Close modal
closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

    // Save only metadata to localStorage
    function saveFilesToStorage() {
        const fileMetadata = uploadedFiles.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
            url: file.url
        }));
        localStorage.setItem("uploadedFiles", JSON.stringify(fileMetadata));
    }

    // Display stored files on page load
    function displayStoredFiles() {
        fileList.innerHTML = ""; // Clear the file list
        uploadedFiles.forEach((file, index) => {
            createFileListItem(file, index); // Create a list item for each file
        });
    }


    // Function to create a file list item
   function createFileListItem(file, index) {
    const listItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.index = index;

    const fileName = document.createElement("span");
    fileName.textContent = file.name;
    fileName.style.cursor = "pointer";

    // Double-click to preview or download
    fileName.addEventListener("dblclick", function () {
        handleFileDoubleClick(file);
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(fileName);
    fileList.appendChild(listItem);
}

    // Handle search input
    document.getElementById("fileSearchInput").addEventListener("input", function (event) {
        const query = event.target.value.toLowerCase();
        const filteredFiles = uploadedFiles.filter(file => file.name.toLowerCase().includes(query));

        displayFilteredFiles(filteredFiles);

        if (filteredFiles.length === 0) {
            fileList.innerHTML = "<li>No files found</li>";
        }
    });

    // Function to display the filtered files
    function displayFilteredFiles(files) {
        fileList.innerHTML = "";
        files.forEach((file, index) => {
            createFileListItem(file, index);
        });
    }

  // Handle file upload
fileInput.addEventListener("change", function (event) {
    const newFiles = Array.from(event.target.files).map(file => {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onloadend = function () {
                resolve({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    url: reader.result
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file); // Convert file to Data URL
        });
    });

    Promise.all(newFiles)
        .then((processedFiles) => {
            uploadedFiles = [...uploadedFiles, ...processedFiles]; // Add new files to the list
            saveFilesToStorage(); // Save files to localStorage
            displayStoredFiles(); // Update the UI
        })
        .catch((error) => {
            console.error("Error reading file:", error);
            alert("An error occurred while processing the files. Please try again.");
        });
});


    // Handle file double-click for preview or download
    function handleFileDoubleClick(file) {
        const modalContent = document.getElementById("modalContent");
        modalContent.innerHTML = "";

        if (file.type.startsWith("image/")) {
            modalContent.innerHTML = `<img src="${file.url}" alt="${file.name}" style="max-width: 100%; height: 200px; object-fit: contain;">`;
            modal.style.display = "block";
        } else if (file.type.startsWith("video/")) {
            modalContent.innerHTML = `
                <video controls style="max-width: 100%; height: 200px; object-fit: contain;">
                    <source src="${file.url}" type="${file.type}">
                    Your browser does not support the video tag.
                </video>`;
            modal.style.display = "block";
        } else {
            downloadFile(file.name, file.url);
        }
    }

    // Function to trigger file download
    function downloadFile(fileName, fileData) {
        const link = document.createElement("a");
        link.href = fileData;
        link.download = fileName;
        link.click();
    }

    // Display stored files on page load
    displayStoredFiles();

    // Handle Delete button click
    document.getElementById("deleteBtn").addEventListener("click", function () {
        const selectedFiles = Array.from(fileList.querySelectorAll("input[type='checkbox']:checked"));
        selectedFiles.forEach(checkbox => {
            const index = checkbox.dataset.index;
            uploadedFiles.splice(index, 1);
        });
        saveFilesToStorage();
        displayStoredFiles();
    });

    // Handle Rename button click
    document.getElementById("renameBtn").addEventListener("click", function () {
        const selectedFiles = Array.from(fileList.querySelectorAll("input[type='checkbox']:checked"));
        if (selectedFiles.length !== 1) {
            alert("Please select exactly one file to rename.");
            return;
        }
        const index = selectedFiles[0].dataset.index;
        const newName = prompt("Enter new name for the file:");
        if (newName) {
            uploadedFiles[index].name = newName;
            saveFilesToStorage();
            displayStoredFiles();
        }
    });

    // Handle Share button click
    const shareModal = document.createElement("div");
    shareModal.id = "shareModal";
    shareModal.style.display = "none";
    shareModal.style.position = "fixed";
    shareModal.style.top = "50%";
    shareModal.style.left = "50%";
    shareModal.style.transform = "translate(-50%, -50%)";
    shareModal.style.backgroundColor = "#2c2f38";
    shareModal.style.color = "white";
    shareModal.style.padding = "20px";
    shareModal.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    shareModal.style.zIndex = "1000";
    shareModal.style.borderRadius = "10px";
    shareModal.innerHTML = `
        <h3>Choose a platform to share:</h3>
        <button id="whatsappBtn" class="share-option whatsapp">
            <i class="fab fa-whatsapp"></i> WhatsApp
        </button>
        <button id="wechatBtn" class="share-option wechat">
            <i class="fab fa-weixin"></i> WeChat
        </button>
        <button id="tiktokBtn" class="share-option tiktok">
            <i class="fab fa-tiktok"></i> TikTok
        </button>
        <button id="instagramBtn" class="share-option instagram">
            <i class="fab fa-instagram"></i> Instagram
        </button>
        <button id="closeShareModal" style="margin-top: 10px; display: block; background-color: #e53935; color: white; padding: 8px 15px; border-radius: 5px; cursor: pointer; width: 100%;">Close</button>
    `;
    document.body.appendChild(shareModal);

    document.getElementById("closeShareModal").addEventListener("click", function () {
        shareModal.style.display = "none";
    });

    // Handle Share button click
    document.getElementById("shareBtn").addEventListener("click", function () {
        const selectedFiles = Array.from(fileList.querySelectorAll("input[type='checkbox']:checked"));
        if (selectedFiles.length === 0) {
            alert("Please select at least one file to share.");
            return;
        }

        const fileLinks = selectedFiles.map(checkbox => {
            const index = checkbox.dataset.index;
            return uploadedFiles[index].url;
        });

        shareModal.style.display = "block";

        document.getElementById("whatsappBtn").addEventListener("click", function () {
            shareOnSocialMedia("whatsapp", fileLinks);
        });

        document.getElementById("wechatBtn").addEventListener("click", function () {
            shareOnSocialMedia("wechat", fileLinks);
        });

        document.getElementById("tiktokBtn").addEventListener("click", function () {
            shareOnSocialMedia("tiktok", fileLinks);
        });

        document.getElementById("instagramBtn").addEventListener("click", function () {
            shareOnSocialMedia("instagram", fileLinks);
        });
    });

    // Function to handle sharing on different platforms
    function shareOnSocialMedia(platform, fileLinks) {
        let shareUrl = "";

        if (platform === "whatsapp") {
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fileLinks.join("\n"))}`;
        } else if (platform === "wechat") {
            shareUrl = `weixin://dl/officialaccounts?scene=108&need_open_webview=1&url=${encodeURIComponent(fileLinks.join("\n"))}`;
        } else if (platform === "tiktok") {
            shareUrl = `https://www.tiktok.com/share?url=${encodeURIComponent(fileLinks.join("\n"))}`;
        } else if (platform === "instagram") {
            shareUrl = `https://www.instagram.com/?url=${encodeURIComponent(fileLinks.join("\n"))}`;
        }

        window.open(shareUrl, "_blank");
        shareModal.style.display = "none";
    }

    // Handle Download button click
    document.getElementById("downloadBtn").addEventListener("click", function () {
        const selectedFiles = Array.from(fileList.querySelectorAll("input[type='checkbox']:checked"));
        if (selectedFiles.length === 0) {
            alert("Please select at least one file to download.");
            return;
        }
        selectedFiles.forEach(checkbox => {
            const index = checkbox.dataset.index;
            const file = uploadedFiles[index];
            const link = document.createElement("a");
            link.href = file.url;
            link.download = file.name;
            link.click();
        });
    });
});
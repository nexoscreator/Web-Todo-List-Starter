// Function to toggle dark mode
function toggleDarkMode() {
  const body = document.body;
  const isDarkMode = body.classList.toggle('dark-mode'); // Toggle dark mode class
  localStorage.setItem('darkMode', isDarkMode); // Save preference to localStorage
}

// Function to apply dark mode based on user preference
function applyDarkModePreference() {
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'true') {
    document.body.classList.add('dark-mode'); // Apply dark mode class
  }
}

// Event listener for dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', toggleDarkMode);

// Apply dark mode preference when the page loads
document.addEventListener('DOMContentLoaded', applyDarkModePreference);
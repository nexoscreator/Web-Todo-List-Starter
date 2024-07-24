// Function to toggle dark mode
function toggleDarkMode() {
  const body = document.body;
  const isDarkMode = body.classList.toggle('dark-mode'); // Toggle dark mode class
  localStorage.setItem('darkMode', isDarkMode); // Save preference to localStorage
}

// Function to apply dark mode based on user preference
function loadDarkModePreference() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-mode'); // Apply dark mode class
  }
}

// Function to set up event listener for dark mode toggle
function setupDarkModeToggle() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', toggleDarkMode);
  }
}

// Apply dark mode preference and set up toggle when the page loads
document.addEventListener('DOMContentLoaded', () => {
  loadDarkModePreference();
  setupDarkModeToggle();
});
// Dark Mode Toggle Functionality
(function() {
    'use strict';
    
    // Get theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Get saved theme from localStorage or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme on page load
    function applyTheme(theme) {
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
        }
    }
    
    // Initialize theme
    applyTheme(currentTheme);
    
    // Toggle theme function
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add animation effect
        html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }
    
    // Add click event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes (optional)
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Only apply system preference if no manual preference is set
        if (!localStorage.getItem('theme')) {
            mediaQuery.addEventListener('change', function(e) {
                applyTheme(e.matches ? 'dark' : 'light');
            });
        }
    }
})();


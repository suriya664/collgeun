// Dark Mode Toggle Functionality - 2025 Academic Theme
(function() {
    'use strict';
    
    // Get theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Get saved theme from localStorage or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme on page load
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
        }
    }
    
    // Initialize theme immediately to prevent flash
    applyTheme(currentTheme);
    
    // Toggle theme function
    function toggleTheme() {
        const isDark = body.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Smooth transition
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
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
            // Apply system preference on load
            applyTheme(mediaQuery.matches ? 'dark' : 'light');
            
            // Listen for system theme changes
            mediaQuery.addEventListener('change', function(e) {
                if (!localStorage.getItem('theme')) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
})();


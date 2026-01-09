// ===== IRONGATE UNIVERSITY - MAIN JAVASCRIPT =====

// ===== CURSOR GLOW EFFECT (Desktop Only) =====
if (window.innerWidth > 1024) {
    const cursorGlow = document.getElementById('cursor-glow');
    
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
        
        // Add hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn-neo, .neo-card, .nav-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorGlow.classList.remove('hover');
            });
        });
    }
}

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
// Only apply to anchor links that are NOT in the navbar (to avoid interfering with navigation)
document.querySelectorAll('a[href^="#"]:not(.navbar a)').forEach(anchor => {
    // Skip if it's a nav link or dropdown item
    if (anchor.closest('.navbar')) return;
    
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== LETTER-BY-LETTER ANIMATION =====
function animateText(element, text, delay = 100) {
    if (!element) return;
    element.innerHTML = '';
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        element.appendChild(span);
        
        setTimeout(() => {
            span.style.transition = 'opacity 0.3s ease';
            span.style.opacity = '1';
        }, index * delay);
    });
}

// ===== NUMBER COUNTER ANIMATION =====
function formatNumber(num, prefix = '', suffix = '') {
    // Add commas for thousands
    const formatted = num.toLocaleString('en-US');
    return prefix + formatted + suffix;
}

function animateCounter(element, target, duration = 2000) {
    if (!element) return;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target, prefix, suffix);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current), prefix, suffix);
        }
    }, 16);
}

// Initialize counters when in viewport
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            if (target && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target, target);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-number, .stat-value-large').forEach(stat => {
    counterObserver.observe(stat);
});

// ===== FORM FLOATING LABELS (Login Page) =====
function initFloatingLabels() {
    const inputs = document.querySelectorAll('.floating-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// Initialize floating labels when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingLabels);
} else {
    initFloatingLabels();
}

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN =====
function initMobileMenuToggle() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (!navbarCollapse || !navbarToggler) return;
    
    // Ensure Bootstrap collapse is initialized
    if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
        // Initialize collapse if not already initialized
        if (!bootstrap.Collapse.getInstance(navbarCollapse)) {
            new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
        }
    }
    
    // Handle body scroll lock when menu opens/closes
    const handleMenuToggle = function() {
        setTimeout(() => {
            const isOpen = navbarCollapse.classList.contains('show');
            
            if (isOpen) {
                // Force visibility
                navbarCollapse.style.visibility = 'visible';
                navbarCollapse.style.opacity = '1';
                navbarCollapse.style.pointerEvents = 'auto';
                
                // Ensure all menu items are clickable
                navbarCollapse.querySelectorAll('.nav-link, .dropdown-item').forEach(item => {
                    item.style.pointerEvents = 'auto';
                    item.style.cursor = 'pointer';
                });
                
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            } else {
                navbarCollapse.style.visibility = 'hidden';
                navbarCollapse.style.opacity = '0';
                navbarCollapse.style.pointerEvents = 'none';
                
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            }
        }, 50);
    };
    
    // Listen for Bootstrap collapse events
    navbarCollapse.addEventListener('shown.bs.collapse', handleMenuToggle);
    navbarCollapse.addEventListener('hidden.bs.collapse', handleMenuToggle);
    
    
    navbarToggler.addEventListener('click', function(e) {
        setTimeout(function() {
            handleMenuToggle();
            setTimeout(function() {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.style.display = 'block';
                    navbarCollapse.style.visibility = 'visible';
                    navbarCollapse.style.opacity = '1';
                }
            }, 200);
        }, 100);
    });
    
    // Close menu on window resize if it's open
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    });
    
    // Add overlay element for better UX
    if (!document.querySelector('.navbar-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'navbar-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1039;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
            pointer-events: none;
        `;
        
        document.body.appendChild(overlay);
        
        // Show/hide overlay when menu opens/closes
        navbarCollapse.addEventListener('shown.bs.collapse', function() {
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            // CRITICAL: Use pointer-events: none to avoid blocking menu clicks
            overlay.style.pointerEvents = 'none';
        });
        
        navbarCollapse.addEventListener('hidden.bs.collapse', function() {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
        });
        
        // Close menu when clicking overlay - handle manually since pointer-events is none
        document.addEventListener('click', function(e) {
            if (window.innerWidth > 991) return;
            if (!navbarCollapse.classList.contains('show')) return;
            
            // If clicking on overlay (not menu content), close menu
            if (e.target === overlay || e.target.classList.contains('navbar-overlay')) {
                if (!e.target.closest('.navbar-collapse')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            }
        }, false);
    }
}

// ===== MOBILE/TABLET NAVIGATION HANDLING =====
// Clean implementation that doesn't interfere with navigation

let mobileNavInitialized = false;

function initMobileNavigation() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (!navbarCollapse) return;
    
    // Prevent duplicate initialization
    if (mobileNavInitialized && window.innerWidth <= 991) return;
    
    // Only handle mobile/tablet
    if (window.innerWidth > 991) {
        // Re-enable Bootstrap dropdowns on desktop
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.setAttribute('data-bs-toggle', 'dropdown');
            if (toggle.getAttribute('href') === 'javascript:void(0);') {
                toggle.setAttribute('href', '#');
            }
        });
        mobileNavInitialized = false;
        return;
    }
    
    mobileNavInitialized = true;
    
    // Handle dropdown toggles
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.removeAttribute('data-bs-toggle');
        if (toggle.getAttribute('href') === '#') {
            toggle.setAttribute('href', 'javascript:void(0);');
        }
        
        // Remove old listener if exists
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        
        newToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = newToggle.closest('.dropdown');
            const menu = dropdown ? dropdown.querySelector('.dropdown-menu') : null;
            
            if (menu) {
                const isOpen = menu.classList.contains('show');
                
                // Close all other dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
                    if (otherMenu !== menu) {
                        otherMenu.classList.remove('show');
                    }
                });
                
                // Toggle current dropdown
                if (!isOpen) {
                    menu.classList.add('show');
                    newToggle.setAttribute('aria-expanded', 'true');
                } else {
                    menu.classList.remove('show');
                    newToggle.setAttribute('aria-expanded', 'false');
                }
            }
        }, false);
    });
}

// Single event listener for closing menu on navigation (added once)
if (!window.mobileNavCloseHandlerAdded) {
    window.mobileNavCloseHandlerAdded = true;
    
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 991) return;
        
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (!navbarCollapse || !navbarCollapse.classList.contains('show')) return;
        
        const clickedLink = e.target.closest('a');
        if (!clickedLink) return;
        
        // Check if it's a nav link or dropdown item in the mobile menu
        const isNavLink = clickedLink.classList.contains('nav-link') && 
                          !clickedLink.classList.contains('dropdown-toggle') &&
                          clickedLink.closest('.navbar-collapse');
        const isDropdownItem = clickedLink.classList.contains('dropdown-item') &&
                               clickedLink.closest('.navbar-collapse');
        
        if (isNavLink || isDropdownItem) {
            const href = clickedLink.getAttribute('href');
            // Only close menu for real navigation links
            if (href && href !== '#' && href !== 'javascript:void(0);') {
                // CRITICAL: Don't prevent default - let browser navigate
                // Close menu AFTER navigation starts
                setTimeout(() => {
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        }
                    }
                }, 150);
            }
        }
    }, false);
}

// Ensure hamburger menu works properly
function ensureHamburgerMenuWorks() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (!navbarToggler || !navbarCollapse) return;
    
    if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
        if (!navbarToggler.hasAttribute('data-bs-toggle')) {
            navbarToggler.setAttribute('data-bs-toggle', 'collapse');
        }
        if (!navbarToggler.hasAttribute('data-bs-target')) {
            navbarToggler.setAttribute('data-bs-target', '#navbarNav');
        }
        if (!navbarToggler.hasAttribute('aria-controls')) {
            navbarToggler.setAttribute('aria-controls', 'navbarNav');
        }
        if (!navbarToggler.hasAttribute('aria-expanded')) {
            navbarToggler.setAttribute('aria-expanded', 'false');
        }
        
        if (!bootstrap.Collapse.getInstance(navbarCollapse)) {
            new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
        }
        
        navbarToggler.style.pointerEvents = 'auto';
        navbarToggler.style.cursor = 'pointer';
    }
}

// Initialize once on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenuToggle();
        ensureHamburgerMenuWorks();
        initMobileNavigation();
    });
} else {
    initMobileMenuToggle();
    ensureHamburgerMenuWorks();
    initMobileNavigation();
}

// Re-initialize on resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        initMobileNavigation();
        ensureHamburgerMenuWorks();
    }, 150);
});
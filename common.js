// Mobile navigation toggle functionality
document.addEventListener("DOMContentLoaded", function () {
    // Create menu toggle button if it doesn't exist
    if (!document.querySelector('.menu-toggle')) {
        const nav = document.querySelector('nav');
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Insert before the nav element
        if (nav) {
            nav.parentNode.insertBefore(menuToggle, nav);
        }
    }

    // Add functionality to menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Toggle icon between bars and times
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }
    
    // Fix image errors
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = function() {
            this.src = 'images/fallback.jpg';
            this.onerror = null;
        }
    });
});

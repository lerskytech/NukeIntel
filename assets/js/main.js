/**
 * NukeIntel.com - Main JavaScript
 * Handles form submission and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Form submission handler
    const contactForm = document.getElementById('contact-form');
    const formContainer = document.getElementById('form-container');
    const thankYouMessage = document.getElementById('thank-you-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission (would require backend)
            
            // Simple client-side validation
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            
            // Basic validation
            if (!nameField.value.trim() || !emailField.value.trim() || !messageField.value.trim()) {
                alert('Please fill in all fields');
                return;
            }
            
            // In a real implementation, you would send the form data to a server
            // Since this is a static site for GitHub Pages, we'll just show the thank you message
            
            // Hide the form and show thank you message
            formContainer.style.display = 'none';
            thankYouMessage.style.display = 'block';
            
            // Scroll to the thank you message
            thankYouMessage.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

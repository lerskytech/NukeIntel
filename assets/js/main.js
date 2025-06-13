/**
 * NukeIntel.com JavaScript - Carousel and Form Handling
 */

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    initCarousel();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize form handling
    initContactForm();
});

/**
 * Carousel Functionality
 */
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) return; // Exit if carousel track doesn't exist
    
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);
    
    // Set slide width and position slides side by side
    const slideWidth = slides[0].getBoundingClientRect().width;
    
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    
    slides.forEach(setSlidePosition);
    
    // Move to selected slide
    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };
    
    // Update dots
    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('active');
        targetDot.classList.add('active');
    };
    
    // Hide/show arrows based on position
    const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
        if (targetIndex === 0) {
            prevButton.classList.add('is-hidden');
            nextButton.classList.remove('is-hidden');
        } else if (targetIndex === slides.length - 1) {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.add('is-hidden');
        } else {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.remove('is-hidden');
        }
    };
    
    // Set initial active slide
    slides[0].classList.add('current-slide');
    dots[0].classList.add('active');
    
    // Click handlers for prev/next buttons
    if (prevButton) {
        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1]; // Loop to end
            const currentDot = dotsNav.querySelector('.active');
            const prevDot = currentDot.previousElementSibling || dots[dots.length - 1];
            const prevIndex = slides.findIndex(slide => slide === prevSlide);
            
            moveToSlide(track, currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
            hideShowArrows(slides, prevButton, nextButton, prevIndex);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling || slides[0]; // Loop to start
            const currentDot = dotsNav.querySelector('.active');
            const nextDot = currentDot.nextElementSibling || dots[0];
            const nextIndex = slides.findIndex(slide => slide === nextSlide);
            
            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
            hideShowArrows(slides, prevButton, nextButton, nextIndex);
        });
    }
    
    // Click handlers for nav dots
    if (dotsNav) {
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('div');
            
            if (!targetDot) return;
            
            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.active');
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            const targetSlide = slides[targetIndex];
            
            moveToSlide(track, currentSlide, targetSlide);
            updateDots(currentDot, targetDot);
            hideShowArrows(slides, prevButton, nextButton, targetIndex);
        });
    }
    
    // Auto-advance carousel every 5 seconds (if not interacted with)
    let autoAdvance = setInterval(() => {
        if (document.querySelector(".carousel-container:hover")) return; // Don't advance if user is hovering
        
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling || slides[0]; // Loop to start
        const currentDot = dotsNav.querySelector('.active');
        const nextDot = currentDot.nextElementSibling || dots[0];
        const nextIndex = slides.findIndex(slide => slide === nextSlide);
        
        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
        hideShowArrows(slides, prevButton, nextButton, nextIndex);
    }, 5000);
    
    // Swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.active');
        let targetSlide, targetDot, targetIndex;
        
        if (touchEndX < touchStartX - 50) { // Swipe left (next)
            targetSlide = currentSlide.nextElementSibling || slides[0];
            targetDot = currentDot.nextElementSibling || dots[0];
        } else if (touchEndX > touchStartX + 50) { // Swipe right (prev)
            targetSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
            targetDot = currentDot.previousElementSibling || dots[dots.length - 1];
        } else {
            return; // Not a significant swipe
        }
        
        targetIndex = slides.findIndex(slide => slide === targetSlide);
        
        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
        hideShowArrows(slides, prevButton, nextButton, targetIndex);
    }
}

/**
 * Form Handling
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formContainer = document.getElementById('form-container');
    const thankYouMessage = document.getElementById('thank-you-message');
    const errorMessage = document.getElementById('error-message');
    
    if (!form) return;
    
    if (form) {
        form.addEventListener('submit', function(event) {
            // No preventDefault since we want Formspree to handle the submission
            
            // Simple client-side validation
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            
            // Basic validation
            if (nameField && emailField && messageField) {
                if (!nameField.value.trim() || !emailField.value.trim() || !messageField.value.trim()) {
                    alert('Please fill in all fields');
                    event.preventDefault();
                    return;
                }
            }
            
            // Set up listeners for Formspree responses
            form.addEventListener('formspree:submit', function() {
                // Hide form and show thank you message
                if (formContainer) formContainer.style.display = 'none';
                if (thankYouMessage) {
                    thankYouMessage.style.display = 'block';
                    
                    // Add a subtle fade-in animation for the thank you message
                    thankYouMessage.style.opacity = '0';
                    setTimeout(() => {
                        thankYouMessage.style.transition = 'opacity 0.5s ease-in';
                        thankYouMessage.style.opacity = '1';
                    }, 10);
                    
                    // Scroll to the thank you message
                    thankYouMessage.scrollIntoView({ behavior: 'smooth' });
                }
            });
            
            // Handle form errors
            form.addEventListener('formspree:error', function() {
                // Show error message but keep form visible
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                    
                    // Hide error after 5 seconds
                    setTimeout(() => {
                        errorMessage.style.display = 'none';
                    }, 5000);
                }
            });
        });
    }
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smooth scroll to element
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

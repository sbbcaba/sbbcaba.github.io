document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    feather.replace();

    // Elements
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progress-bar');
    const dotsContainer = document.getElementById('pagination-dots');
    const notesToggle = document.getElementById('notesToggle');
    const notesPanel = document.getElementById('notesPanel');
    const closeNotesBtn = document.getElementById('closeNotesBtn');
    const notesContent = document.getElementById('notes-content');

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Initialize UI
    function init() {
        createPaginationDots();
        updateUI();
        
        // Ensure first slide contents inject if needed
        setTimeout(() => {
            slides[0].classList.add('active');
        }, 100);
    }

    // Pagination Dots
    function createPaginationDots() {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            
            // Allow clicking dots to navigate
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            
            dotsContainer.appendChild(dot);
        }
    }

    // Navigation Logic
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        // Direction class for sliding animations
        const direction = index > currentSlide ? 'slide-next' : 'slide-prev';
        
        // Hide current
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.remove('slide-next');
        slides[currentSlide].classList.remove('slide-prev');
        
        // Update index
        currentSlide = index;
        
        // Show new
        slides[currentSlide].classList.add('active');
        
        updateUI();
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    // Update UI elements based on current slide
    function updateUI() {
        // Update Progress Bar
        const progress = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;

        // Update Dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update speaker notes content
        const slideId = currentSlide + 1;
        if (typeof slideNotes !== 'undefined' && slideNotes[slideId]) {
            notesContent.innerHTML = `<p>${slideNotes[slideId]}</p>`;
        } else {
            notesContent.innerHTML = `<p><em>No speaker notes for this slide.</em></p>`;
        }

        // Button states
        prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentSlide === 0 ? 'none' : 'auto';
        
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentSlide === totalSlides - 1 ? 'none' : 'auto';
    }

    // Speaker Notes Toggle
    function toggleNotes() {
        notesPanel.classList.toggle('open');
    }

    // Event Listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    notesToggle.addEventListener('click', toggleNotes);
    closeNotesBtn.addEventListener('click', () => notesPanel.classList.remove('open'));

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'n' || e.key === 'N') {
            // Toggle notes with 'N'
            toggleNotes();
        } else if (e.key === 'Escape') {
            // Close notes on Escape
            notesPanel.classList.remove('open');
        }
    });

    // Touch/Swipe Navigation Support
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            // Swipe Left -> Next
            nextSlide();
        }
        if (touchEndX > touchStartX + threshold) {
            // Swipe Right -> Prev
            prevSlide();
        }
    }

    // Let's also support mouse scroll for navigation (with debounce)
    let isScrolling = false;
    document.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        
        // Ignore scroll inside notes panel
        if (notesPanel.classList.contains('open') && e.target.closest('#notesPanel')) {
            return;
        }

        isScrolling = true;
        
        if (e.deltaY > 0) {
            nextSlide();
        } else if (e.deltaY < 0) {
            prevSlide();
        }

        setTimeout(() => {
            isScrolling = false;
        }, 1000); // 1s cooldown between scrolls
    }, { passive: true });

    // Run Initialization
    init();
});

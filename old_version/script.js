document.addEventListener('DOMContentLoaded', () => {

    // 1. Loading Screen
    const loader = document.getElementById('loader');
    const progress = document.querySelector('.loader-progress');
    
    // Simulate loading
    setTimeout(() => { progress.style.width = '30%'; }, 200);
    setTimeout(() => { progress.style.width = '70%'; }, 500);
    setTimeout(() => { 
        progress.style.width = '100%'; 
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.visibility = 'hidden'; }, 800);
        }, 500);
    }, 800);

    // 2. Initialize Icons
    lucide.createIcons();

    // 3. Navigation Bar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // 4. Hero Slider Logic
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);

    // 5. Featured Section Slider
    const fSlides = document.querySelectorAll('.f-slide');
    const fPrev = document.querySelector('.prev-btn');
    const fNext = document.querySelector('.next-btn');
    let curFSlide = 0;

    function goFSlide(index) {
        fSlides[curFSlide].classList.remove('active');
        curFSlide = index;
        if(curFSlide < 0) curFSlide = fSlides.length - 1;
        if(curFSlide >= fSlides.length) curFSlide = 0;
        fSlides[curFSlide].classList.add('active');
    }

    fNext.addEventListener('click', () => goFSlide(curFSlide + 1));
    fPrev.addEventListener('click', () => goFSlide(curFSlide - 1));

    // 6. Portfolio Simple Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            masonryItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; }, 50);
                } else {
                    if (item.classList.contains(filter)) {
                        item.style.display = 'block';
                        setTimeout(() => { item.style.opacity = '1'; }, 50);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => { item.style.display = 'none'; }, 300);
                    }
                }
            });
        });
    });

    // 7. Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const items = document.querySelectorAll('.masonry-item img');

    items.forEach(img => {
        img.parentNode.addEventListener('click', (e) => {
            e.preventDefault();
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scrolling
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 8. Parallax Element Follow
    const parallaxElements = document.querySelectorAll('.parallax');
    document.addEventListener('mousemove', (e) => {
        const mx = e.clientX / window.innerWidth - 0.5;
        const my = e.clientY / window.innerHeight - 0.5;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0;
            const x = mx * speed * 1000;
            const y = my * speed * 1000;
            el.style.transform = `translate(${x}px, ${y}px) ${el.classList.contains('fd-1') ? 'rotate(-10deg)' : ''} ${el.classList.contains('fd-2') ? 'rotate(15deg)' : ''}`;
        });
    });

    // 9. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');
    
    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const boxTop = el.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', checkReveal);
    // Trigger once on load
    setTimeout(checkReveal, 800);

});

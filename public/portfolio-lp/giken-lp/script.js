document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');

    function reveal() {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach(revealElement => {
            const elementTop = revealElement.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                revealElement.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    // Trigger once on load
    reveal();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

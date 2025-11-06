document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const testimonialContainer = document.getElementById('testimonialContainer');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    const appointmentForm = document.getElementById('appointmentForm');

    let currentSlide = 0;
    const totalSlides = testimonialCards.length;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            scrollTopBtn.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            scrollTopBtn.classList.remove('show');
        }

        updateActiveNavLink();
    });

    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    function showSlide(index) {
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        testimonialCards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === currentSlide) {
                card.classList.add('active');
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === currentSlide) {
                dot.classList.add('active');
            }
        });
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            showSlide(currentSlide - 1);
        });

        nextBtn.addEventListener('click', function() {
            showSlide(currentSlide + 1);
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
        });
    });

    setInterval(function() {
        showSlide(currentSlide + 1);
    }, 6000);

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formMessage = document.getElementById('formMessage');
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;

            formMessage.style.display = 'block';

            if (name && email && phone && service) {
                formMessage.className = 'form-message success';
                formMessage.textContent = 'Thank you for your consultation request! Our billing specialist will contact you within 24 hours to discuss your practice needs.';
                
                appointmentForm.reset();

                setTimeout(function() {
                    formMessage.className = 'form-message';
                    formMessage.style.display = 'none';
                }, 8000);
            } else {
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Please fill in all required fields.';
            }
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.service-card, .why-card, .team-card, .info-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    showSlide(0);
});
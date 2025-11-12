document.addEventListener('DOMContentLoaded', function() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const floatingBookBtn = document.getElementById('floatingBookBtn');
    const testimonialContainer = document.getElementById('testimonialContainer');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    const appointmentForm = document.getElementById('appointmentForm');
    const scheduleMeetBtn = document.getElementById('scheduleMeetBtn');

    let currentSlide = 0;
    const totalSlides = testimonialCards.length;

    window.addEventListener('scroll', function() {
        if (header && window.scrollY > 100) {
            header.classList.add('scrolled');
        } else if (header) {
            header.classList.remove('scrolled');
        }

        updateActiveNavLink();
    });

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection && header) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    if (navMenu) {
                        navMenu.classList.remove('active');
                    }
                    if (navToggle) {
                        navToggle.classList.remove('active');
                    }
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
        appointmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formMessage = document.getElementById('formMessage');
            const submitBtn = appointmentForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };

            // Validate
            if (!formData.name || !formData.email || !formData.phone || !formData.service) {
                formMessage.style.display = 'block';
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Please fill in all required fields.';
                return;
            }

            // Show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formMessage.style.display = 'none';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                formMessage.style.display = 'block';

                if (result.success) {
                    formMessage.className = 'form-message success';
                    formMessage.textContent = 'Thank you for your consultation request! Our billing specialist will contact you within 24 hours to discuss your practice needs.';
                    appointmentForm.reset();
                } else {
                    formMessage.className = 'form-message error';
                    formMessage.textContent = 'There was an error sending your message. Please try again or call us directly.';
                }

                setTimeout(function() {
                    formMessage.style.display = 'none';
                }, 8000);
                
            } catch (error) {
                console.error('Form submission error:', error);
                formMessage.style.display = 'block';
                formMessage.className = 'form-message error';
                formMessage.textContent = 'There was an error sending your message. Please try again or call us directly.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
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

    if (scheduleMeetBtn) {
        scheduleMeetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Open the booking modal instead of Google Calendar
            const bookingModal = document.getElementById('bookingModal');
            if (bookingModal) {
                bookingModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    showSlide(0);
});
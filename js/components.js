function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (elementId === 'header-placeholder') {
                initializeNav();
            }
        })
        .catch(error => console.error('Error loading component:', error));
}

function initializeNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const header = document.getElementById('header');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    highlightActiveLink();
    
    window.addEventListener('hashchange', highlightActiveLink);
}

function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-link');
    
    console.log('Current Page:', currentPage, 'Current Hash:', currentHash);
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        const linkPage = href.split('#')[0];
        const linkHash = href.includes('#') ? '#' + href.split('#')[1] : '';
        
        let shouldHighlight = false;
        
        if (linkHash) {
            shouldHighlight = (linkPage === currentPage && linkHash === currentHash);
        } else {
            shouldHighlight = (linkPage === currentPage && !currentHash) || 
                            (currentPage === '' && linkPage === 'index.html');
        }
        
        if (shouldHighlight) {
            link.classList.add('active');
            console.log('Highlighting:', href);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-placeholder', 'header.html');
    loadComponent('footer-placeholder', 'footer.html');
    
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});

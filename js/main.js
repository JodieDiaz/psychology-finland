/**
 * Psychology Finland - Main JavaScript
 * Multi-language support and interactive features
 */

// ==========================================
// LANGUAGE SWITCHER
// ==========================================

class LanguageSwitcher {
    constructor() {
        this.currentLang = this.getStoredLanguage() || 'es';
        this.init();
    }

    init() {
        // Set initial language
        this.setLanguage(this.currentLang, false);

        // Add event listeners to language buttons
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });
    }

    setLanguage(lang, save = true) {
        this.currentLang = lang;

        // Update button states
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update all elements with language attributes
        this.updateContent(lang);

        // Save to localStorage
        if (save) {
            localStorage.setItem('preferredLanguage', lang);
        }

        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }

    updateContent(lang) {
        // Update elements with data-es and data-en attributes
        const elements = document.querySelectorAll('[data-es][data-en]');

        elements.forEach(element => {
            const spanishText = element.dataset.es;
            const englishText = element.dataset.en;

            // Special handling for visibility attributes
            if (spanishText === 'visible' || spanishText === 'hidden') {
                if (lang === 'es') {
                    element.style.display = spanishText === 'visible' ? 'block' : 'none';
                } else {
                    element.style.display = englishText === 'visible' ? 'block' : 'none';
                }
            } else {
                // Regular text content - ensure element is visible
                if (element.style.display === 'none') {
                    element.style.display = '';
                }

                const text = lang === 'es' ? spanishText : englishText;

                // Check if element has children or is just text
                if (element.children.length === 0 || element.tagName === 'SPAN') {
                    element.textContent = text;
                } else {
                    // For elements with children, only update direct text nodes
                    const firstTextNode = Array.from(element.childNodes).find(
                        node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
                    );
                    if (firstTextNode) {
                        firstTextNode.textContent = text;
                    }
                }
            }
        });
    }

    getStoredLanguage() {
        return localStorage.getItem('preferredLanguage');
    }
}

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================

class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.nav = document.getElementById('mainNav');
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.nav) return;

        this.menuToggle.addEventListener('click', () => {
            this.toggle();
        });

        // Close menu when clicking on a link
        const navLinks = this.nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.close();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.close();
            }
        });
    }

    toggle() {
        this.menuToggle.classList.toggle('active');
        this.nav.classList.toggle('active');
    }

    close() {
        this.menuToggle.classList.remove('active');
        this.nav.classList.remove('active');
    }
}

// ==========================================
// SMOOTH SCROLL
// ==========================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe service cards
        document.querySelectorAll('.service-card').forEach(card => {
            observer.observe(card);
        });
    }
}

// ==========================================
// HEADER SCROLL EFFECT
// ==========================================

class HeaderScroll {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        if (!this.header) return;

        let ticking = false;

        // Check initial state
        this.checkScroll();

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.checkScroll();
                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    checkScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}

// ==========================================
// INITIALIZE ALL COMPONENTS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize language switcher
    new LanguageSwitcher();

    // Initialize mobile menu
    new MobileMenu();

    // Initialize smooth scroll
    new SmoothScroll();

    // Initialize scroll animations
    new ScrollAnimations();

    // Initialize header scroll effect
    new HeaderScroll();

    // Add loaded class to body for CSS animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for potential testing or external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LanguageSwitcher,
        MobileMenu,
        SmoothScroll,
        ScrollAnimations,
        HeaderScroll
    };
}

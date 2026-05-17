/* ==========================================
   AURELIA Studio — Global JavaScript
   Handles:
     - Mobile navigation toggle
     - Navbar scroll effect
     - Scroll animations
     - Gallery filtering
     - Form validation & local storage
     - Review system
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.textContent = '☰';
            });
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Scroll Animations ---
    function animateOnScroll() {
        const elements = document.querySelectorAll(
            '.featured-card, .gallery-item, .review-card, ' +
            '.timeline-step, .process-step, .behind-item, .about-image, .about-text'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    animateOnScroll();

    // --- Gallery Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Filter items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');

                    if (filter === 'all' || filter === category) {
                        item.classList.remove('fade-out');
                        item.classList.add('fade-in');
                        item.style.display = 'block';
                    } else {
                        item.classList.remove('fade-in');
                        item.classList.add('fade-out');
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // --- Order Form Validation & Local Storage ---
    const orderForm = document.getElementById('orderForm');
    const orderSuccess = document.getElementById('orderSuccess');

    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;

            // Clear previous errors
            document.querySelectorAll('.error-msg').forEach(msg => msg.textContent = '');

            // Validate name
            const name = document.getElementById('name').value.trim();
            if (name === '') {
                document.getElementById('nameError').textContent = 'Name is required';
                isValid = false;
            } else if (name.length < 2) {
                document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
                isValid = false;
            }

            // Validate email
            const email = document.getElementById('email').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === '') {
                document.getElementById('emailError').textContent = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(email)) {
                document.getElementById('emailError').textContent = 'Please enter a valid email';
                isValid = false;
            }

            // Validate type
            if (document.getElementById('type').value === '') {
                document.getElementById('typeError').textContent = 'Please select an art type';
                isValid = false;
            }

            // Validate size
            if (document.getElementById('size').value === '') {
                document.getElementById('sizeError').textContent = 'Please select a size';
                isValid = false;
            }

            if (isValid) {
                // Store order in local storage
                const orders = JSON.parse(localStorage.getItem('aurelia_orders') || '[]');
                const newOrder = {
                    id: Date.now(),
                    name: name,
                    email: email,
                    type: document.getElementById('type').value,
                    size: document.getElementById('size').value,
                    message: document.getElementById('message').value,
                    date: new Date().toLocaleDateString()
                };

                orders.push(newOrder);
                localStorage.setItem('aurelia_orders', JSON.stringify(orders));

                // Show success message
                orderSuccess.classList.remove('hidden');
                orderForm.reset();

                // Refresh saved orders
                displayOrders();

                // Hide success after 5 seconds
                setTimeout(() => {
                    orderSuccess.classList.add('hidden');
                }, 5000);
            }
        });
    }

    // --- Display Saved Orders ---
    function displayOrders() {
        const ordersList = document.getElementById('ordersList');
        const clearBtn = document.getElementById('clearOrders');
        if (!ordersList) return;

        const orders = JSON.parse(localStorage.getItem('aurelia_orders') || '[]');

        if (orders.length === 0) {
            ordersList.innerHTML = '<p class="empty-state">No orders yet.</p>';
            if (clearBtn) clearBtn.classList.add('hidden');
            return;
        }

        ordersList.innerHTML = '';
        orders.slice(-5).reverse().forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
                <p><strong>${order.name}</strong> — ${capitalize(order.type)}</p>
                <p>Size: ${capitalize(order.size)}</p>
                <p class="order-date">${order.date}</p>
            `;
            ordersList.appendChild(card);
        });

        if (clearBtn) clearBtn.classList.remove('hidden');
    }

    // --- Clear Orders ---
    const clearOrdersBtn = document.getElementById('clearOrders');
    if (clearOrdersBtn) {
        clearOrdersBtn.addEventListener('click', function() {
            localStorage.removeItem('aurelia_orders');
            displayOrders();
        });
    }

    // Display orders on store page load
    displayOrders();

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const cName = document.getElementById('cName').value.trim();
            const cEmail = document.getElementById('cEmail').value.trim();
            const cMessage = document.getElementById('cMessage').value.trim();

            if (cName && cEmail && cMessage) {
                contactSuccess.classList.remove('hidden');
                contactForm.reset();

                setTimeout(() => {
                    contactSuccess.classList.add('hidden');
                }, 5000);
            }
        });
    }

    // --- Review Form ---
    const reviewForm = document.getElementById('reviewForm');
    const reviewSuccess = document.getElementById('reviewSuccess');

    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const rName = document.getElementById('rName').value.trim();
            const rReview = document.getElementById('rReview').value.trim();

            if (rName && rReview) {
                // Store review
                const reviews = JSON.parse(localStorage.getItem('aurelia_reviews') || '[]');
                reviews.push({
                    name: rName,
                    text: rReview,
                    date: new Date().toLocaleDateString()
                });
                localStorage.setItem('aurelia_reviews', JSON.stringify(reviews));

                reviewSuccess.classList.remove('hidden');
                reviewForm.reset();

                setTimeout(() => {
                    reviewSuccess.classList.add('hidden');
                }, 5000);
            }
        });
    }

    // --- Utility: Capitalize ---
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
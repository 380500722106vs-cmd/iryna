// Dropdown menus
document.addEventListener('DOMContentLoaded', function() {
    // Toggle dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    });

    // Reviews slider (carousel - one slide at a time)
    const slider = document.querySelector('.reviews-slider');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const reviewCards = document.querySelectorAll('.review-card');
    let currentSlide = 0;
    const totalSlides = reviewCards.length;

    function updateSlider() {
        const offset = -(currentSlide * 100);
        slider.style.transform = `translateX(${offset}%)`;
        updateDots();
    }

    function updateDots() {
        const dotsContainer = document.querySelector('.slider-dots');
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${i === currentSlide ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = totalSlides - 1;
            }
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            currentSlide++;
            if (currentSlide >= totalSlides) {
                currentSlide = 0;
            }
            updateSlider();
        });
    }

    // Initialize
    updateSlider();

    // Auto-play carousel
    let autoPlayInterval = setInterval(() => {
        currentSlide++;
        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        }
        updateSlider();
    }, 5000);

    // Pause auto-play on hover
    const reviewsContainer = document.querySelector('.reviews-container');
    if (reviewsContainer) {
        reviewsContainer.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        reviewsContainer.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => {
                currentSlide++;
                if (currentSlide >= totalSlides) {
                    currentSlide = 0;
                }
                updateSlider();
            }, 5000);
        });
    }

    // Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');

            // Close all accordions
            document.querySelectorAll('.accordion-item').forEach(acc => {
                acc.classList.remove('active');
                acc.querySelector('.accordion-content').style.maxHeight = null;
            });

            // Open clicked accordion if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Topic selection
    const topicSelect = document.getElementById('topics');
    const selectedTopicsContainer = document.getElementById('selectedTopics');
    const selectedTopics = new Set();

    if (topicSelect) {
        topicSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            if (value && !selectedTopics.has(value)) {
                selectedTopics.add(value);
                renderSelectedTopics();
            }
            e.target.value = '';
        });
    }

    function renderSelectedTopics() {
        selectedTopicsContainer.innerHTML = '';
        selectedTopics.forEach(topic => {
            const tag = document.createElement('div');
            tag.className = 'topic-tag';
            tag.innerHTML = `
                <span>${topic}</span>
                <button type="button" class="remove-topic" data-topic="${topic}">−</button>
            `;
            selectedTopicsContainer.appendChild(tag);
        });

        // Add remove listeners
        document.querySelectorAll('.remove-topic').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedTopics.delete(btn.dataset.topic);
                renderSelectedTopics();
            });
        });
    }

    // Modal video
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalClose = document.querySelector('.modal-close');

    window.openVideo = function(videoUrl) {
        const videoId = videoUrl.split('/').pop().split('?')[0];
        modalVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function closeModal() {
        modal.classList.remove('active');
        modalVideo.src = '';
        document.body.style.overflow = '';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const messengers = [];
            document.querySelectorAll('input[name="messengers"]:checked').forEach(cb => {
                messengers.push(cb.value);
            });
            
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                messengers: messengers,
                topics: Array.from(selectedTopics)
            };

            try {
                const response = await fetch('https://db.life-navigator-xxi.com/db.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    showMessage('Ваше повідомлення відправлено!');
                    contactForm.reset();
                    selectedTopics.clear();
                    renderSelectedTopics();
                } else {
                    showMessage('Помилка відправки. Спробуйте ще раз.');
                }
            } catch (error) {
                showMessage('Помилка відправки. Спробуйте ще раз.');
            }
        });
    }

    // Messenger buttons
    window.sendViaMessenger = function(messenger) {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const topics = Array.from(selectedTopics).join(', ');
        
        if (!name || !phone) {
            showMessage('Будь ласка, заповніть ім\'я та телефон');
            return;
        }

        const message = `Ім'я: ${name}\nТелефон: ${phone}\nТеми: ${topics}`;
        const encodedMessage = encodeURIComponent(message);
        
        let url = '';
        switch(messenger) {
            case 'whatsapp':
                url = `https://wa.me/?text=${encodedMessage}`;
                break;
            case 'viber':
                url = `viber://forward?text=${encodedMessage}`;
                break;
            case 'telegram':
                url = `https://t.me/share/url?url=&text=${encodedMessage}`;
                break;
            case 'email':
                url = `mailto:?subject=Запит&body=${encodedMessage}`;
                break;
        }
        
        if (url) {
            window.open(url, '_blank');
        }
    };

    function showMessage(text) {
        const messageModal = document.createElement('div');
        messageModal.className = 'modal active';
        messageModal.innerHTML = `
            <div class="modal-content" style="background: white; padding: 2rem; text-align: center; max-width: 400px;">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">${text}</p>
                <button onclick="this.closest('.modal').remove()" style="padding: 0.75rem 2rem; background: var(--primary-color); color: white; border-radius: 5px; font-weight: bold;">OK</button>
            </div>
        `;
        document.body.appendChild(messageModal);
        
        setTimeout(() => {
            messageModal.remove();
        }, 3000);
    }
});

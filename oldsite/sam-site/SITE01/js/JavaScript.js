// js/script.js
document.addEventListener('DOMContentLoaded', function() {
    // Language switching functionality
    const languageSelect = document.getElementById('language-select');
    const languageElements = document.querySelectorAll('[data-lang]');
    
    languageSelect.addEventListener('change', function() {
        const selectedLang = this.value;
        
        // Hide all language elements
        languageElements.forEach(el => {
            el.style.display = 'none';
        });
        
        // Show elements for selected language
        document.querySelectorAll(`[data-lang="${selectedLang}"]`).forEach(el => {
            el.style.display = 'block';
        });
        
        // Special handling for buttons that need to remain visible
        document.querySelectorAll(`[data-lang="${selectedLang}"]`).forEach(el => {
            if (el.tagName === 'BUTTON') {
                el.style.display = 'inline-block';
            }
        });
    });
    
    // Video modal functionality
    const modal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('video-frame');
    const closeBtn = document.querySelector('.close');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    testimonialCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video');
            // Convert YouTube URL to embed format
            const embedUrl = videoUrl.replace("watch?v=", "embed/");
            videoFrame.src = embedUrl;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        videoFrame.src = '';
        document.body.style.overflow = 'auto'; // Enable scrolling
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            videoFrame.src = '';
            document.body.style.overflow = 'auto'; // Enable scrolling
        }
    });
    
    // Testimonial navigation
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    const testimonialsContainer = document.querySelector('.testimonials-container');
    
    if (prevBtn && nextBtn && testimonialsContainer) {
        prevBtn.addEventListener('click', function() {
            testimonialsContainer.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', function() {
            testimonialsContainer.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });
    }
    
    // Topic selection functionality
    const topicSelect = document.getElementById('topic');
    const selectedTopicsContainer = document.getElementById('selected-topics');
    const selectedTopics = [];
    
    topicSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        const selectedText = this.options[this.selectedIndex].text;
        
        if (selectedValue && !selectedTopics.includes(selectedValue)) {
            selectedTopics.push(selectedValue);
            
            const topicElement = document.createElement('div');
            topicElement.className = 'selected-topic';
            topicElement.innerHTML = `
                ${selectedText}
                <button class="remove-topic" data-value="${selectedValue}">×</button>
            `;
            
            selectedTopicsContainer.appendChild(topicElement);
            
            // Add event listener to remove button
            const removeBtn = topicElement.querySelector('.remove-topic');
            removeBtn.addEventListener('click', function() {
                const valueToRemove = this.getAttribute('data-value');
                const index = selectedTopics.indexOf(valueToRemove);
                if (index > -1) {
                    selectedTopics.splice(index, 1);
                }
                topicElement.remove();
            });
        }
        
        // Reset select
        this.selectedIndex = 0;
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, you would send the form data to the server
            alert('Форма відправлена! (Form submitted!)');
        });
    }
});
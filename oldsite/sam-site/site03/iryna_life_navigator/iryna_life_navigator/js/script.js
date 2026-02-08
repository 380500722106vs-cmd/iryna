document.addEventListener('DOMContentLoaded', function() {
    // Video modal functionality
    const modal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('video-frame');
    const closeBtn = document.querySelector('.close');
    const videoButtons = document.querySelectorAll('.video-btn, .testimonial-card');
    
    videoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video');
            videoFrame.src = videoUrl;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        videoFrame.src = '';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            videoFrame.src = '';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Topic selection functionality
    const topicSelect = document.getElementById('topic');
    const selectedTopicsContainer = document.getElementById('selected-topics');
    const allTopicsInput = document.getElementById('all-topics-input');
    const selectedTopics = [];
    
    if (topicSelect) {
        topicSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            const selectedText = this.options[this.selectedIndex].text;
            
            if (selectedValue && !selectedTopics.includes(selectedValue)) {
                selectedTopics.push(selectedValue);
                
                const topicTag = document.createElement('span');
                topicTag.className = 'topic-tag';
                topicTag.innerHTML = `
                    ${selectedText}
                    <span class="remove-topic" data-value="${selectedValue}" style="margin-left: 5px; cursor: pointer;">×</span>
                `;
                
                selectedTopicsContainer.appendChild(topicTag);
                
                // Update hidden input
                allTopicsInput.value = selectedTopics.join(', ');
                
                // Add event listener to remove button
                const removeBtn = topicTag.querySelector('.remove-topic');
                removeBtn.addEventListener('click', function() {
                    const valueToRemove = this.getAttribute('data-value');
                    const index = selectedTopics.indexOf(valueToRemove);
                    if (index > -1) {
                        selectedTopics.splice(index, 1);
                    }
                    topicTag.remove();
                    allTopicsInput.value = selectedTopics.join(', ');
                });
            }
            
            // Reset select
            this.selectedIndex = 0;
        });
    }
    
    // Form submission handling
    const contactForms = document.querySelectorAll('.contact-form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, you would send the form data to the server
            alert('Форма відправлена! (Form submitted!)');
        });
    });
});

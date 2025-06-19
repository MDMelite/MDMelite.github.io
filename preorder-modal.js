/**
 * Pre-order Modal Module
 * Handles the pre-order interest form modal functionality
 */
(function() {
    'use strict';
    
    function initPreorderModal() {
        const modal = document.getElementById('preorder-modal');
        const modalBackdrop = document.getElementById('preorder-modal-backdrop');
        const openButton = document.getElementById('preorder-btn');
        const closeButton = document.getElementById('preorder-close-btn');
        const modalContent = document.querySelector('#preorder-modal .modal-content');
        
        if (!modal || !openButton) {
            console.warn('Pre-order modal elements not found');
            return;
        }
        
        // Open modal
        function openModal() {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
            
            // Animate in
            setTimeout(() => {
                modalBackdrop.classList.add('opacity-100');
                modalContent.classList.add('opacity-100', 'scale-100');
            }, 10);
        }
        
        // Close modal
        function closeModal() {
            modalBackdrop.classList.remove('opacity-100');
            modalContent.classList.remove('opacity-100', 'scale-100');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = '';
            }, 300);
        }
        
        // Event listeners
        openButton.addEventListener('click', openModal);
        
        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }
        
        // Close on backdrop click
        modalBackdrop.addEventListener('click', closeModal);
        
        // Prevent closing when clicking modal content
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPreorderModal);
    } else {
        initPreorderModal();
    }
})();
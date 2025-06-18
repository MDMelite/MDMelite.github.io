// Audio Player JavaScript - The Child of Comedy
// Custom HTML5 audio player with progress memory and enhanced controls

(function() {
    'use strict';
    
    // Audio Player Implementation
    function initAudioPlayer() {
        // Audio Player Elements
        const audio = document.getElementById('audiobook-player');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const playIcon = playPauseBtn?.querySelector('.play-icon');
        const pauseIcon = playPauseBtn?.querySelector('.pause-icon');
        const progressBar = document.querySelector('.progress-bar');
        const progressFill = document.querySelector('.progress-bar-fill');
        const progressHandle = document.querySelector('.progress-bar-handle');
        const currentTimeEl = document.getElementById('current-time');
        const durationEl = document.getElementById('duration');
        const volumeBtn = document.getElementById('volume-btn');
        const volumeIcon = volumeBtn?.querySelector('.volume-icon');
        const muteIcon = volumeBtn?.querySelector('.mute-icon');
        const volumeSlider = document.getElementById('volume-slider');
        const speedSelect = document.getElementById('speed-select');
        const playerContainer = document.querySelector('.audio-player-container');
        
        // Check if audio player exists on page
        if (!audio || !playerContainer) {
            console.log('Audio player not found on this page');
            return;
        }
        
        // State
        let isDragging = false;
        let lastVolume = 0.7;
        
        // Format time helper
        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
        
        // Load saved preferences
        function loadPreferences() {
            const savedVolume = localStorage.getItem('audiobook_volume');
            const savedSpeed = localStorage.getItem('audiobook_speed');
            
            if (savedVolume) {
                audio.volume = parseFloat(savedVolume);
                volumeSlider.value = audio.volume * 100;
                lastVolume = audio.volume;
            } else {
                audio.volume = 0.7;
                lastVolume = 0.7;
            }
            
            if (savedSpeed) {
                audio.playbackRate = parseFloat(savedSpeed);
                speedSelect.value = savedSpeed;
            }
        }
        
        // Event Handlers
        function onLoadedMetadata() {
            durationEl.textContent = formatTime(audio.duration);
            playerContainer.classList.remove('loading');
            
            // Restore saved position
            const savedPosition = localStorage.getItem('audiobook_position');
            if (savedPosition && parseFloat(savedPosition) < audio.duration) {
                audio.currentTime = parseFloat(savedPosition);
            }
        }
        
        function onTimeUpdate() {
            if (!isDragging && audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = percent + '%';
                progressHandle.style.left = percent + '%';
                currentTimeEl.textContent = formatTime(audio.currentTime);
                
                // Save position every 5 seconds
                if (Math.floor(audio.currentTime) % 5 === 0) {
                    localStorage.setItem('audiobook_position', audio.currentTime);
                }
            }
        }
        
        function onPlay() {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            playPauseBtn.setAttribute('aria-label', 'Pause audio');
        }
        
        function onPause() {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            playPauseBtn.setAttribute('aria-label', 'Play audio');
            // Save position on pause
            localStorage.setItem('audiobook_position', audio.currentTime);
        }
        
        function onEnded() {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            playPauseBtn.setAttribute('aria-label', 'Play audio');
            // Reset position
            localStorage.removeItem('audiobook_position');
        }
        
        function onError(e) {
            console.error('Audio error:', e);
            playerContainer.classList.remove('loading');
            showError('Unable to load audio. Please try again later.');
        }
        
        function onWaiting() {
            playerContainer.classList.add('loading');
        }
        
        function onCanPlay() {
            playerContainer.classList.remove('loading');
        }
        
        // Control Functions
        function togglePlayPause() {
            if (audio.paused) {
                audio.play().catch(e => {
                    console.error('Play error:', e);
                    showError('Unable to play audio. Please try again.');
                });
            } else {
                audio.pause();
            }
        }
        
        function seekTo(e) {
            const rect = progressBar.getBoundingClientRect();
            const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const percent = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
            audio.currentTime = percent * audio.duration;
        }
        
        function startDragging(e) {
            isDragging = true;
            seekTo(e);
        }
        
        function drag(e) {
            if (isDragging) {
                seekTo(e);
            }
        }
        
        function stopDragging() {
            isDragging = false;
        }
        
        function toggleMute() {
            if (audio.muted || audio.volume === 0) {
                audio.muted = false;
                audio.volume = lastVolume || 0.7;
                volumeSlider.value = audio.volume * 100;
                volumeIcon.classList.remove('hidden');
                muteIcon.classList.add('hidden');
            } else {
                lastVolume = audio.volume;
                audio.muted = true;
                volumeIcon.classList.add('hidden');
                muteIcon.classList.remove('hidden');
            }
        }
        
        function changeVolume(e) {
            const volume = e.target.value / 100;
            audio.volume = volume;
            audio.muted = false;
            
            if (volume === 0) {
                volumeIcon.classList.add('hidden');
                muteIcon.classList.remove('hidden');
            } else {
                volumeIcon.classList.remove('hidden');
                muteIcon.classList.add('hidden');
                lastVolume = volume;
            }
            
            localStorage.setItem('audiobook_volume', volume);
        }
        
        function changeSpeed(e) {
            audio.playbackRate = parseFloat(e.target.value);
            localStorage.setItem('audiobook_speed', e.target.value);
        }
        
        function showError(message) {
            const existingError = playerContainer.querySelector('.audio-error');
            if (existingError) {
                existingError.remove();
            }
            
            const errorEl = document.createElement('div');
            errorEl.className = 'audio-error';
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            playerContainer.appendChild(errorEl);
            
            setTimeout(() => {
                errorEl.style.opacity = '0';
                setTimeout(() => errorEl.remove(), 300);
            }, 5000);
        }
        
        // Keyboard controls
        function handleKeyboard(e) {
            // Check if user is typing in an input or textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            // Check if audio player is in view
            const playerRect = playerContainer.getBoundingClientRect();
            const isInView = playerRect.top < window.innerHeight && playerRect.bottom > 0;
            
            if (!isInView) return;
            
            switch(e.key) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    audio.currentTime = Math.max(0, audio.currentTime - 10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
                    changeVolume({ target: volumeSlider });
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
                    changeVolume({ target: volumeSlider });
                    break;
                case 'm':
                    e.preventDefault();
                    toggleMute();
                    break;
            }
        }
        
        // Set up event listeners
        function setupEventListeners() {
            // Audio events
            audio.addEventListener('loadedmetadata', onLoadedMetadata);
            audio.addEventListener('timeupdate', onTimeUpdate);
            audio.addEventListener('play', onPlay);
            audio.addEventListener('pause', onPause);
            audio.addEventListener('ended', onEnded);
            audio.addEventListener('error', onError);
            audio.addEventListener('waiting', onWaiting);
            audio.addEventListener('canplay', onCanPlay);
            
            // Control events
            playPauseBtn.addEventListener('click', togglePlayPause);
            progressBar.addEventListener('click', seekTo);
            progressBar.addEventListener('mousedown', startDragging);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDragging);
            
            // Touch events for mobile
            progressBar.addEventListener('touchstart', startDragging, { passive: true });
            document.addEventListener('touchmove', drag, { passive: true });
            document.addEventListener('touchend', stopDragging);
            
            // Volume and speed controls
            volumeBtn.addEventListener('click', toggleMute);
            volumeSlider.addEventListener('input', changeVolume);
            speedSelect.addEventListener('change', changeSpeed);
            
            // Keyboard controls
            document.addEventListener('keydown', handleKeyboard);
        }
        
        // Initialize
        loadPreferences();
        setupEventListeners();
        
        // Show loading state initially
        playerContainer.classList.add('loading');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAudioPlayer);
    } else {
        initAudioPlayer();
    }
})();
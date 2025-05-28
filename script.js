// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const navLinks = document.querySelectorAll('.navbar-links a');
    
    // Modals
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const aiAssistantBtn = document.querySelector('.ai-assistant-btn');
    const aiAssistantMobileBtn = document.querySelector('.ai-assistant-mobile-btn');
    const aiAssistantModal = document.getElementById('ai-assistant-modal');
    const wearablesBtn = document.querySelector('.wearables-btn');
    const wearablesMobileBtn = document.querySelector('.wearables-mobile-btn');
    const wearablesModal = document.getElementById('wearables-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    
    // Emergency Report Form
    const emergencyForm = document.getElementById('emergency-form');
    const nameInput = document.getElementById('name');
    const emergencyTypeSelect = document.getElementById('emergency-type');
    const locationInput = document.getElementById('location');
    const addressContainer = document.getElementById('address-container');
    const addressInput = document.getElementById('address');
    const descriptionInput = document.getElementById('description');
    const contactNumberInput = document.getElementById('contact-number');
    const fileUploadInput = document.getElementById('file-upload-input');
    const fileList = document.getElementById('file-list');
    const submitReportBtn = document.getElementById('submit-report');
    const buttonText = document.querySelector('.button-text');
    const buttonLoader = document.querySelector('.button-loader');
    const alertContainer = document.getElementById('alert-container');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    // AI Chat
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message');
    
    // Wearable Devices
    const deviceConnectBtns = document.querySelectorAll('.device-connect-btn');
    const heartRate = document.getElementById('heart-rate');
    const stepsCount = document.getElementById('steps-count');
    const lastUpdatedTime = document.getElementById('last-updated-time');
    
    // Map Elements
    const mapContainer = document.getElementById('map');
    const myLocationBtn = document.getElementById('my-location-btn');
    const mapSearchInput = document.getElementById('map-search-input');
    const mapSearchBtn = document.getElementById('map-search-btn');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const recenterMapBtn = document.getElementById('recenter-map');
    const reportEmergencyBtn = document.getElementById('report-emergency-btn');
    
    // Initialize Maps
    let map, marker;
    
    if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', function() {
                homeMap.zoomOut();
            });
        }
        
        if (recenterMapBtn) {
            recenterMapBtn.addEventListener('click', function() {
                homeMap.setView([19.0760, 72.8777], 12);
            });
        }
        
        if (reportEmergencyBtn) {
            reportEmergencyBtn.addEventListener('click', function() {
                // Scroll to emergency report section
                const reportSection = document.getElementById('report');
                if (reportSection) {
                    reportSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }
    
    // Initialize Emergency Report Map
    if (mapContainer) {
        // Initialize the map with a default view of India
        map = L.map('map').setView([20.5937, 78.9629], 5);
        
        // Add the tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Handle map click events to set the marker
        map.on('click', function(e) {
            setMarkerPosition(e.latlng);
        });
        
        // My Location button functionality
        if (myLocationBtn) {
            myLocationBtn.addEventListener('click', function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        const latlng = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        map.setView(latlng, 15);
                        setMarkerPosition(latlng);
                    }, function(error) {
                        showAlert('Unable to get your location. Please try again or set it manually on the map.', 'error');
                    });
                } else {
                    showAlert('Geolocation is not supported by your browser.', 'error');
                }
            });
        }
        
        // Map search functionality
        if (mapSearchBtn) {
            mapSearchBtn.addEventListener('click', searchLocation);
        }
        
        if (mapSearchInput) {
            mapSearchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    searchLocation();
                }
            });
        }
    }
    
    // Function to search for a location on the map
    function searchLocation() {
        const searchValue = mapSearchInput.value.trim();
        if (!searchValue) return;
        
        // Using Nominatim OpenStreetMap search API
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    const latlng = { lat: parseFloat(lat), lng: parseFloat(lon) };
                    map.setView(latlng, 15);
                    setMarkerPosition(latlng);
                } else {
                    showAlert('Location not found. Please try a different search term.', 'error');
                }
            })
            .catch(error => {
                console.error('Error searching location:', error);
                showAlert('Error searching for location. Please try again.', 'error');
            });
    }
    
    // Function to set marker position and update form
    function setMarkerPosition(latlng) {
        // Remove existing marker if any
        if (marker) {
            map.removeLayer(marker);
        }
        
        // Add new marker
        marker = L.marker(latlng).addTo(map);
        
        // Update location input
        locationInput.value = `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
        
        // Fetch address for the coordinates
        fetchReverseGeocode(latlng);
    }
    
    // Function to get address from coordinates
    function fetchReverseGeocode(latlng) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
                if (data && data.display_name) {
                    addressInput.value = data.display_name;
                    addressContainer.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error fetching address:', error);
            });
    }
    
    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.add('active');
        });
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    }
    
    // Navigation Active State
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            mobileMenu.classList.remove('active');
        });
    });
    
    // Modal Functionality
    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }
    
    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            openModal('login-modal');
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            openModal('register-modal');
        });
    }
    
    if (aiAssistantBtn) {
        aiAssistantBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('ai-assistant-modal');
        });
    }
    
    if (aiAssistantMobileBtn) {
        aiAssistantMobileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('ai-assistant-modal');
            mobileMenu.classList.remove('active');
        });
    }
    
    if (wearablesBtn) {
        wearablesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('wearables-modal');
        });
    }
    
    if (wearablesMobileBtn) {
        wearablesMobileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('wearables-modal');
            mobileMenu.classList.remove('active');
        });
    }
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Switch between login and register
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('login-modal');
            openModal('register-modal');
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('register-modal');
            openModal('login-modal');
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // File Upload Handling
    if (fileUploadInput) {
        fileUploadInput.addEventListener('change', function() {
            const files = Array.from(this.files);
            const totalSize = files.reduce((acc, file) => acc + file.size, 0);
            const maxSize = 20 * 1024 * 1024; // 20MB max size
            
            if (totalSize > maxSize) {
                showAlert('Total file size should not exceed 20MB', 'error');
                this.value = '';
                return;
            }
            
            if (files.length > 3) {
                showAlert('You can only upload up to 3 files', 'error');
                this.value = '';
                return;
            }
            
            const invalidFiles = files.filter(file => {
                const fileType = file.type.toLowerCase();
                const fileName = file.name.toLowerCase();
                const isPDF = fileType === 'application/pdf' || fileName.endsWith('.pdf');
                const isImage = fileType.startsWith('image/');
                const isDoc = fileType === 'application/msword' ||
                    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                    fileName.endsWith('.doc') ||
                    fileName.endsWith('.docx');
                
                return !(isPDF || isImage || isDoc);
            });
            
            if (invalidFiles.length > 0) {
                showAlert('Only PDF, images, and Word documents are allowed', 'error');
                this.value = '';
                return;
            }
            
            // Display selected files
            fileList.innerHTML = '';
            files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <span>${file.name}</span>
                    <button type="button" class="remove-file">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                fileList.appendChild(fileItem);
                
                // Remove file functionality
                const removeBtn = fileItem.querySelector('.remove-file');
                removeBtn.addEventListener('click', function() {
                    fileItem.remove();
                    // Note: This doesn't actually remove the file from the input
                    // In a real app, you would need to handle this differently
                });
            });
        });
    }
    
    // Emergency Form Submission
    if (emergencyForm) {
        emergencyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateEmergencyForm()) {
                return;
            }
            
            // Show loading state
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'inline-block';
            submitReportBtn.disabled = true;
            
            // Simulate form submission (in a real app, this would be an API call)
            setTimeout(function() {
                // Hide loading state
                buttonText.style.display = 'inline-block';
                buttonLoader.style.display = 'none';
                submitReportBtn.disabled = false;
                
                // Show success message
                showToast('Emergency report submitted successfully');
                
                // Reset form
                emergencyForm.reset();
                fileList.innerHTML = '';
                addressContainer.style.display = 'none';
                if (marker) {
                    map.removeLayer(marker);
                    marker = null;
                }
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 2000);
        });
    }
    
    // Validate Emergency Form
    function validateEmergencyForm() {
        // Reset previous errors
        alertContainer.innerHTML = '';
        
        // Check required fields
        if (!nameInput.value.trim()) {
            showAlert('Full Name is required', 'error');
            nameInput.focus();
            return false;
        }
        
        if (!emergencyTypeSelect.value) {
            showAlert('Emergency Type is required', 'error');
            emergencyTypeSelect.focus();
            return false;
        }
        
        if (!locationInput.value.trim()) {
            showAlert('Location is required. Please select a location on the map.', 'error');
            return false;
        }
        
        if (!descriptionInput.value.trim()) {
            showAlert('Description is required', 'error');
            descriptionInput.focus();
            return false;
        }
        
        if (!contactNumberInput.value.trim()) {
            showAlert('Contact Number is required', 'error');
            contactNumberInput.focus();
            return false;
        }
        
        return true;
    }
    
    // Show Alert Message
    function showAlert(message, type = 'info') {
        alertContainer.innerHTML = `
            <div class="alert alert-${type}">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Scroll to alert
        alertContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show Toast Notification
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(function() {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // AI Chat Functionality
    if (sendMessageBtn && chatInput) {
        sendMessageBtn.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            } else if (message.toLowerCase().includes('fire')) {
                response = "If there's a fire, evacuate the area immediately and call 101. Do not attempt to fight a large fire yourself.";
            } else if (message.toLowerCase().includes('police')) {
                response = "For police assistance, you can call 100. If you're in immediate danger, call 112.";
            } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                response = "Hello! I'm your AI Emergency Assistant. How can I help you today?";
            } else {
                response = "I'm here to help with emergency-related questions. Could you provide more details about your situation so I can assist you better?";
            }
            
            addChatMessage(response, 'ai');
        }, 1000);
    }
    
    function addChatMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Wearable Devices Functionality
    deviceConnectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('connected')) {
                this.classList.remove('connected');
                this.textContent = 'Connect';
            } else {
                this.classList.add('connected');
                this.textContent = 'Connected';
            }
        });
    });
    
    // Simulate health data updates
    function updateHealthData() {
        if (heartRate && stepsCount && lastUpdatedTime) {
            // Simulate heart rate varying by +/- 5 bpm
            const currentHeartRate = parseInt(heartRate.textContent);
            const newHeartRate = currentHeartRate + Math.floor(Math.random() * 11) - 5;
            heartRate.textContent = `${newHeartRate} BPM`;
            
            // Simulate steps increasing by 50-150
            const currentSteps = parseInt(stepsCount.textContent.replace(/,/g, ''));
            const newSteps = currentSteps + Math.floor(Math.random() * 101) + 50;
            stepsCount.textContent = newSteps.toLocaleString();
            
            // Update time
            const now = new Date();
            lastUpdatedTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }
    
    // Update health data every 30 seconds
    setInterval(updateHealthData, 30000);
    
    // Emergency Call Confirmation
    window.confirmEmergencyCall = function(number) {
        return confirm(`Are you sure you want to call ${number}? Only use for real emergencies.`);
    };
    
    // Helper function to get the appropriate icon for each emergency type
    function getEmergencyIcon(type) {
        switch(type) {
            case 'fire':
                return 'fa-fire';
            case 'medical':
                return 'fa-ambulance';
            case 'police':
                return 'fa-shield-alt';
            case 'disaster':
                return 'fa-exclamation-triangle';
            default:
                return 'fa-exclamation-circle';
        }
    }
    
    // Helper function to generate random report times for demo purposes
    function getRandomReportTime() {
        const now = new Date();
        const minutesAgo = Math.floor(Math.random() * 60);
        now.setMinutes(now.getMinutes() - minutesAgo);
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
});

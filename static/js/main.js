// Theme Management
const themeToggle = document.getElementById('themeToggle');
const themeOptions = document.querySelectorAll('.theme-option');

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'auto') {
        document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Update theme buttons
    themeOptions.forEach(option => {
        if (option.dataset.theme === savedTheme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// Toggle theme
themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme buttons
    themeOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.theme === newTheme);
    });
});

// Set specific theme
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        
        themeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        if (theme === 'auto') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        
        localStorage.setItem('theme', theme);
    });
});

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks?.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
        navLinks?.classList.remove('active');
    }
});

// Settings Modal
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');

settingsBtn?.addEventListener('click', () => {
    settingsModal.classList.add('active');
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// API Key visibility toggle
function toggleApiKey() {
    const input = document.getElementById('apiKeyInput');
    const button = event.currentTarget;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Save settings
function saveSettings() {
    const apiKey = document.getElementById('apiKeyInput').value;
    const aiModel = document.getElementById('aiModelSelect').value;
    const creativity = document.getElementById('creativitySlider').value;
    
    // In production, this would be sent to the backend
    localStorage.setItem('marketai_settings', JSON.stringify({
        apiKey: apiKey ? '••••••••' : '',
        aiModel,
        creativity
    }));
    
    alert('Settings saved! (API key is stored locally in this demo)');
    closeModal('settingsModal');
}

// Load saved settings
function loadSettings() {
    const saved = JSON.parse(localStorage.getItem('marketai_settings') || '{}');
    
    if (saved.apiKey) {
        document.getElementById('apiKeyInput').value = saved.apiKey;
    }
    
    if (saved.aiModel) {
        document.getElementById('aiModelSelect').value = saved.aiModel;
    }
    
    if (saved.creativity) {
        document.getElementById('creativitySlider').value = saved.creativity;
    }
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// System preferences listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'auto') {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadSettings();
    
    // Add current year to footer
    document.querySelector('.footer-bottom p').innerHTML = 
        document.querySelector('.footer-bottom p').innerHTML.replace('2024', new Date().getFullYear());
    
    // Health check
    checkBackendHealth();
});

// Backend health check
async function checkBackendHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        if (data.status === 'healthy') {
            console.log('Backend connected:', data);
        }
    } catch (error) {
        console.warn('Backend health check failed:', error);
    }
}

// Utility function for notifications (can be used across all pages)
function showGlobalNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.global-notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `global-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
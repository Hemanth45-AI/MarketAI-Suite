// Dashboard-specific JavaScript

// Update current date
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    const dayElement = document.querySelector('.day');
    const dateElement = document.querySelector('.date');
    
    if (dayElement && dateElement) {
        dayElement.textContent = day;
        dateElement.textContent = dateStr.split(', ')[1] + ', ' + dateStr.split(', ')[2];
    }
}

// Animate elements on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    }, observerOptions);
    
    // Observe all cards
    document.querySelectorAll('.stat-card, .feature-card, .activity-item, .ai-assistant-widget').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });
}

// Load sample activities
function loadSampleActivities() {
    const activitiesList = document.querySelector('.activities-list');
    if (!activitiesList) return;
    
    // Sample activities data
    const sampleActivities = [
        {
            type: 'campaign',
            title: 'Campaign Launched',
            description: 'Summer Sale 2023 campaign is now live',
            time: '2 hours ago',
            icon: 'fa-rocket'
        },
        {
            type: 'lead',
            title: 'Lead Qualified',
            description: '45 new leads scored and categorized',
            time: '4 hours ago',
            icon: 'fa-filter'
        },
        {
            type: 'pitch',
            title: 'Pitch Generated',
            description: 'B2B sales pitch created for TechCorp',
            time: 'Yesterday',
            icon: 'fa-bullhorn'
        },
        {
            type: 'campaign',
            title: 'Performance Update',
            description: 'Campaign ROI increased by 24%',
            time: '2 days ago',
            icon: 'fa-chart-line'
        }
    ];
    
    // Clear existing content
    activitiesList.innerHTML = '';
    
    // Add activities
    sampleActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon ${activity.type}">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;
        activitiesList.appendChild(activityItem);
    });
}

// Initialize dashboard
function initDashboard() {
    // Update date
    updateDate();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Load activities if empty
    const emptyActivities = document.querySelector('.empty-activities');
    if (emptyActivities) {
        // Check if we should load sample data
        setTimeout(() => {
            loadSampleActivities();
        }, 1000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Call main.js initialization first
    if (typeof initApp === 'function') {
        initApp();
    }
    
    // Then initialize dashboard
    initDashboard();
    
    // Add event listeners for quick action cards
    document.querySelectorAll('.quick-action-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.getAttribute('data-action');
            if (action) {
                console.log('Quick action:', action);
                // You can add specific actions here
            }
        });
    });
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateDate,
        initDashboard,
        loadSampleActivities
    };
}
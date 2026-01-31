// DOM Elements
const campaignForm = document.getElementById('campaignForm');
const sections = document.querySelectorAll('.form-section');
const loadingState = document.getElementById('loadingState');
const resultsContent = document.getElementById('resultsContent');
const errorState = document.getElementById('errorState');
const resultsActions = document.getElementById('resultsActions');

// Form Data
let currentSection = 0;
let formData = {
    product: '',
    description: '',
    goal: 'awareness',
    budget: '5K-20K',
    audience: '',
    platforms: [],
    tone: 'professional',
    notes: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateCharCounters();
    updateSummary();
});

// Event Listeners
function setupEventListeners() {
    // Character counters
    document.getElementById('productDescription').addEventListener('input', updateCharCounters);
    document.getElementById('targetAudience').addEventListener('input', updateCharCounters);
    
    // Platform selection
    document.querySelectorAll('.platform-card input').forEach(input => {
        input.addEventListener('change', updatePlatforms);
    });
    
    // Tone selection
    document.querySelectorAll('input[name="tone"]').forEach(radio => {
        radio.addEventListener('change', updateTone);
    });
    
    // Budget slider
    document.getElementById('campaignBudget').addEventListener('input', updateBudget);
    
    // Goal select
    document.getElementById('campaignGoal').addEventListener('change', updateGoal);
    
    // Form submission
    campaignForm.addEventListener('submit', generateCampaign);
}

// Section Navigation
function nextSection() {
    if (!validateCurrentSection()) return;
    
    sections[currentSection].classList.remove('active');
    currentSection = Math.min(currentSection + 1, 2);
    sections[currentSection].classList.add('active');
    updateSummary();
}

function prevSection() {
    sections[currentSection].classList.remove('active');
    currentSection = Math.max(currentSection - 1, 0);
    sections[currentSection].classList.add('active');
}

function validateCurrentSection() {
    const section = sections[currentSection];
    
    if (currentSection === 0) {
        const productName = document.getElementById('productName').value.trim();
        const productDesc = document.getElementById('productDescription').value.trim();
        
        if (!productName || !productDesc) {
            showNotification('Please fill in all required fields', 'error');
            return false;
        }
        
        formData.product = productName;
        formData.description = productDesc;
    }
    
    if (currentSection === 1) {
        const audience = document.getElementById('targetAudience').value.trim();
        const platforms = Array.from(document.querySelectorAll('.platform-card input:checked'));
        
        if (!audience || platforms.length === 0) {
            showNotification('Please select at least one platform and describe your audience', 'error');
            return false;
        }
        
        formData.audience = audience;
    }
    
    return true;
}

// Form Updates
function updateCharCounters() {
    const desc = document.getElementById('productDescription');
    const audience = document.getElementById('targetAudience');
    
    document.getElementById('descCount').textContent = `${desc.value.length}/500`;
    document.getElementById('audienceCount').textContent = `${audience.value.length}/300`;
    
    if (desc.value.trim()) formData.description = desc.value.trim();
    if (audience.value.trim()) formData.audience = audience.value.trim();
}

function updatePlatforms() {
    formData.platforms = Array.from(document.querySelectorAll('.platform-card input:checked'))
        .map(input => input.value);
    updateSummary();
}

function updateTone() {
    const selectedTone = document.querySelector('input[name="tone"]:checked');
    if (selectedTone) {
        formData.tone = selectedTone.value;
        updateSummary();
    }
}

function updateBudget() {
    const budgetSlider = document.getElementById('campaignBudget');
    const budgetLabels = ['Under $1K', '$1K-5K', '$5K-20K', '$20K-100K', '$100K+'];
    formData.budget = budgetLabels[budgetSlider.value];
    updateSummary();
}

function updateGoal() {
    formData.goal = document.getElementById('campaignGoal').value;
    updateSummary();
}

function updateSummary() {
    document.getElementById('summaryProduct').textContent = formData.product || '-';
    document.getElementById('summaryGoal').textContent = getGoalLabel(formData.goal);
    document.getElementById('summaryAudience').textContent = formData.audience ? formData.audience.substring(0, 50) + '...' : '-';
    document.getElementById('summaryPlatforms').textContent = formData.platforms.join(', ') || '-';
    document.getElementById('summaryTone').textContent = formData.tone.charAt(0).toUpperCase() + formData.tone.slice(1);
}

function getGoalLabel(value) {
    const goals = {
        'awareness': 'Brand Awareness',
        'leads': 'Lead Generation',
        'sales': 'Direct Sales',
        'engagement': 'Customer Engagement',
        'launch': 'Product Launch'
    };
    return goals[value] || value;
}

// Campaign Generation
async function generateCampaign(e) {
    e.preventDefault();
    
    // Get final data
    formData.product = document.getElementById('productName').value.trim();
    formData.description = document.getElementById('productDescription').value.trim();
    formData.audience = document.getElementById('targetAudience').value.trim();
    formData.notes = document.getElementById('additionalNotes').value.trim();
    
    // Validation
    if (!formData.product || !formData.description || !formData.audience || formData.platforms.length === 0) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading
    showLoading();
    
    try {
        const response = await fetch('/api/generate/campaign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product: formData.product + ': ' + formData.description,
                audience: formData.audience,
                platforms: formData.platforms,
                tone: formData.tone,
                goal: formData.goal,
                budget: formData.budget,
                notes: formData.notes
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResults(data.result);
        } else {
            showError(data.error || 'Failed to generate campaign');
        }
    } catch (error) {
        showError('Network error. Please check your connection.');
        console.error('Generation error:', error);
    }
}

function showLoading() {
    loadingState.style.display = 'block';
    resultsContent.style.display = 'none';
    errorState.style.display = 'none';
    resultsActions.style.display = 'none';
}

function displayResults(html) {
    loadingState.style.display = 'none';
    resultsContent.style.display = 'block';
    errorState.style.display = 'none';
    resultsActions.style.display = 'flex';
    
    resultsContent.innerHTML = `
        <div class="campaign-results">
            <div class="campaign-header">
                <div class="campaign-meta">
                    <span class="campaign-product">${formData.product}</span>
                    <span class="campaign-goal">${getGoalLabel(formData.goal)}</span>
                </div>
                <div class="campaign-stats">
                    <div class="stat">
                        <i class="fas fa-users"></i>
                        <span>${formData.platforms.length} Platforms</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-palette"></i>
                        <span>${formData.tone.charAt(0).toUpperCase() + formData.tone.slice(1)} Tone</span>
                    </div>
                </div>
            </div>
            
            <div class="campaign-content">
                ${html}
            </div>
            
            <div class="campaign-actions">
                <div class="action-group">
                    <h5><i class="fas fa-clock"></i> Next Steps</h5>
                    <ul>
                        <li>Review and customize the generated content</li>
                        <li>Schedule posts according to platform best practices</li>
                        <li>Set up tracking for key metrics mentioned</li>
                        <li>Prepare visuals and assets needed</li>
                    </ul>
                </div>
                
                <div class="action-group">
                    <h5><i class="fas fa-chart-line"></i> Tracking Metrics</h5>
                    <div class="metrics-grid">
                        <div class="metric">
                            <span class="metric-label">Engagement Rate</span>
                            <span class="metric-value">Target: >3%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Click-Through Rate</span>
                            <span class="metric-value">Target: >2%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Conversion Rate</span>
                            <span class="metric-value">Target: >1%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">ROI</span>
                            <span class="metric-value">Target: 300%+</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Scroll to results
    resultsContent.scrollIntoView({ behavior: 'smooth' });
    
    // Save to local storage
    saveToHistory();
}

function showError(message) {
    loadingState.style.display = 'none';
    resultsContent.style.display = 'none';
    errorState.style.display = 'block';
    resultsActions.style.display = 'none';
    
    document.getElementById('errorMessage').textContent = message;
}

function retryGeneration() {
    generateCampaign(new Event('submit'));
}

// Templates
function loadTemplate(templateName) {
    const templates = {
        saas: {
            productName: "AI Marketing Assistant Pro",
            productDescription: "An intelligent marketing platform that uses AI to generate content, optimize campaigns, and analyze performance across all channels. Features include predictive analytics, automated A/B testing, and personalized customer journey mapping.",
            targetAudience: "Marketing managers and directors in mid-to-large tech companies (50-5000 employees), ages 30-50, focused on data-driven decision making and ROI optimization. They struggle with content creation at scale and measuring campaign effectiveness.",
            goal: "leads",
            platforms: ["LinkedIn", "Email", "Google Ads"],
            tone: "professional"
        },
        ecommerce: {
            productName: "Eco-Friendly Yoga Collection",
            productDescription: "Sustainable yoga apparel made from organic cotton and recycled materials. Features moisture-wicking technology, comfortable fit for all body types, and carbon-neutral production process. Includes yoga mats, clothing, and accessories.",
            targetAudience: "Environmentally conscious yoga practitioners, ages 25-45, primarily female, urban dwellers, active on Instagram and Pinterest. They value sustainability, quality, and brand ethics over price.",
            goal: "sales",
            platforms: ["Instagram", "Facebook", "Email"],
            tone: "casual"
        },
        b2b: {
            productName: "Enterprise Security Suite",
            productDescription: "Comprehensive cybersecurity solution for large enterprises, featuring AI-powered threat detection, 24/7 monitoring, compliance automation, and incident response. Protects against ransomware, data breaches, and insider threats.",
            targetAudience: "CISOs and IT Directors in financial services, healthcare, and government sectors (1000+ employees). Highly regulated environments, budget $100K+, decision timeline 3-6 months, involve multiple stakeholders.",
            goal: "leads",
            platforms: ["LinkedIn", "Twitter", "Email"],
            tone: "authoritative"
        }
    };
    
    const template = templates[templateName];
    if (!template) return;
    
    // Fill form
    document.getElementById('productName').value = template.productName;
    document.getElementById('productDescription').value = template.productDescription;
    document.getElementById('targetAudience').value = template.targetAudience;
    document.getElementById('campaignGoal').value = template.goal;
    
    // Select platforms
    document.querySelectorAll('.platform-card input').forEach(input => {
        input.checked = template.platforms.includes(input.value);
    });
    
    // Select tone
    document.querySelector(`input[name="tone"][value="${template.tone}"]`).checked = true;
    
    // Update form data
    formData = { ...formData, ...template };
    formData.platforms = template.platforms;
    formData.tone = template.tone;
    
    updateCharCounters();
    updatePlatforms();
    updateTone();
    
    showNotification(`Loaded ${templateName} template`, 'success');
}

// Form Management
function clearForm() {
    if (confirm('Are you sure you want to clear all form data?')) {
        campaignForm.reset();
        currentSection = 0;
        sections.forEach((section, index) => {
            section.classList.toggle('active', index === 0);
        });
        
        formData = {
            product: '',
            description: '',
            goal: 'awareness',
            budget: '5K-20K',
            audience: '',
            platforms: [],
            tone: 'professional',
            notes: ''
        };
        
        updateCharCounters();
        updateSummary();
        
        resultsContent.innerHTML = `
            <div class="empty-results">
                <div class="empty-icon">
                    <i class="fas fa-bullhorn"></i>
                </div>
                <h3>Ready to Create Magic?</h3>
                <p>Fill in the campaign details and click "Generate with AI" to create your marketing strategy.</p>
                <div class="empty-features">
                    <div class="feature">
                        <i class="fas fa-bolt"></i>
                        <span>Instant AI Generation</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-chart-line"></i>
                        <span>Data-Driven Strategies</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-copy"></i>
                        <span>Ready-to-Use Content</span>
                    </div>
                </div>
            </div>
        `;
        
        resultsActions.style.display = 'none';
        
        showNotification('Form cleared successfully', 'success');
    }
}

function newCampaign() {
    clearForm();
}

// Results Actions
function copyResults() {
    const text = resultsContent.innerText;
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Campaign copied to clipboard!', 'success');
    });
}

function exportPDF() {
    showNotification('PDF export feature coming soon!', 'info');
    // In production: Use jsPDF or similar library
}

function saveCampaign() {
    const campaignData = {
        ...formData,
        generatedAt: new Date().toISOString(),
        content: resultsContent.innerHTML
    };
    
    localStorage.setItem(`campaign_${Date.now()}`, JSON.stringify(campaignData));
    showNotification('Campaign saved locally!', 'success');
}

function shareCampaign() {
    if (navigator.share) {
        navigator.share({
            title: `Campaign: ${formData.product}`,
            text: `Check out this marketing campaign generated by MarketAI Suite!`,
            url: window.location.href
        });
    } else {
        showNotification('Share this URL with your team', 'info');
    }
}

// History
function viewHistory() {
    loadHistory();
    openModal('historyModal');
}

function loadHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    const activities = JSON.parse(localStorage.getItem('campaign_activities') || '[]');
    
    if (activities.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history"></i>
                <p>No campaign history yet</p>
            </div>
        `;
        return;
    }
    
    activities.reverse().forEach(activity => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-content">
                <div class="history-header">
                    <h5>${activity.product}</h5>
                    <span class="history-date">${new Date(activity.timestamp).toLocaleDateString()}</span>
                </div>
                <p class="history-preview">${activity.preview}</p>
                <div class="history-tags">
                    <span class="tag">${activity.platforms?.length || 0} platforms</span>
                    <span class="tag tone-${activity.tone}">${activity.tone}</span>
                    <span class="tag">${activity.goal}</span>
                </div>
            </div>
            <div class="history-actions">
                <button class="btn-icon" onclick="loadHistoryItem('${activity.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" onclick="deleteHistoryItem('${activity.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        historyList.appendChild(historyItem);
    });
}

function saveToHistory() {
    const activity = {
        id: Date.now(),
        product: formData.product,
        platforms: formData.platforms,
        tone: formData.tone,
        goal: formData.goal,
        preview: document.querySelector('.campaign-results h2')?.textContent || 'Campaign generated',
        timestamp: new Date().toISOString()
    };
    
    const activities = JSON.parse(localStorage.getItem('campaign_activities') || '[]');
    activities.push(activity);
    localStorage.setItem('campaign_activities', JSON.stringify(activities));
}

function loadHistoryItem(id) {
    // Implementation for loading history items
    showNotification('Loading campaign...', 'info');
}

function deleteHistoryItem(id) {
    if (confirm('Delete this campaign from history?')) {
        const activities = JSON.parse(localStorage.getItem('campaign_activities') || '[]');
        const filtered = activities.filter(a => a.id !== id);
        localStorage.setItem('campaign_activities', JSON.stringify(filtered));
        loadHistory();
        showNotification('Campaign deleted', 'success');
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
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
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (currentSection === 2) {
            generateCampaign(new Event('submit'));
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});
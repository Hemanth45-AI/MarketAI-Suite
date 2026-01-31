// DOM Elements
const pitchForm = document.getElementById('pitchForm');
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
    features: [],
    competitors: [],
    customer: '',
    role: '',
    industry: '',
    companySize: '',
    challenges: '',
    goals: '',
    budget: '',
    pitchType: 'email',
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
    // Helper to safely add event listeners
    const safeAddListener = (id, event, handler) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, handler);
    };

    // Character counters
    safeAddListener('productDescription', 'input', updateCharCounters);
    safeAddListener('challenges', 'input', updateCharCounters);
    safeAddListener('keyFeatures', 'input', updateFeatures);

    // Pitch type selection (radio buttons use querySelectorAll, already safer)
    document.querySelectorAll('input[name="pitchType"]').forEach(radio => {
        radio.addEventListener('change', updatePitchType);
    });

    // Competitors input
    safeAddListener('competitors', 'change', updateCompetitors);

    // Form submission
    if (pitchForm) {
        pitchForm.addEventListener('submit', generatePitch);
    } else {
        const fallbackForm = document.getElementById('pitchForm');
        if (fallbackForm) fallbackForm.addEventListener('submit', generatePitch);
    }
}

// Section Navigation
function nextSection() {
    if (!validateCurrentSection()) return;

    sections[currentSection].classList.remove('active');

    // Update step indicators
    const steps = document.querySelectorAll('.step');
    if (steps[currentSection]) steps[currentSection].classList.remove('active');

    currentSection = Math.min(currentSection + 1, 2);

    sections[currentSection].classList.add('active');
    if (steps[currentSection]) steps[currentSection].classList.add('active');

    updateSummary();
}

function prevSection() {
    sections[currentSection].classList.remove('active');

    // Update step indicators
    const steps = document.querySelectorAll('.step');
    if (steps[currentSection]) steps[currentSection].classList.remove('active');

    currentSection = Math.max(currentSection - 1, 0);

    sections[currentSection].classList.add('active');
    if (steps[currentSection]) steps[currentSection].classList.add('active');
}

function validateCurrentSection() {
    const section = sections[currentSection];

    if (currentSection === 0) {
        const productName = document.getElementById('productName')?.value.trim();
        const productDesc = document.getElementById('productDescription')?.value.trim();

        if (!productName || !productDesc) {
            showNotification('Please fill in product name and description', 'error');
            return false;
        }

        formData.product = productName;
        formData.description = productDesc;
    }

    if (currentSection === 1) {
        const customerName = document.getElementById('customerName')?.value.trim();
        // Fix: customerRole is a radio button group, not a single ID
        const customerRoleElement = document.querySelector('input[name="customerRole"]:checked');
        const customerRole = customerRoleElement ? customerRoleElement.value : 'director';

        // Fix: ID is 'challenges', not 'customerChallenges'
        const challenges = document.getElementById('challenges')?.value.trim();

        if (!customerName || !challenges) {
            showNotification('Please fill in customer name and challenges', 'error');
            return false;
        }

        formData.customer = customerName;
        formData.role = customerRole;
        formData.challenges = challenges;
        formData.goals = document.getElementById('goals')?.value.trim() || '';
        formData.budget = document.getElementById('budgetRange')?.value || 'medium';

        // Capture other fields if they exist
        const industry = document.getElementById('industry');
        if (industry) formData.industry = industry.value;

        const companySize = document.getElementById('companySize');
        if (companySize) formData.companySize = companySize.value;
    }

    return true;
}

// Form Updates
function updateCharCounters() {
    const desc = document.getElementById('productDescription');
    const challenges = document.getElementById('challenges'); // Fix: changed from customerChallenges

    if (desc) {
        const descCount = document.getElementById('descCount');
        if (descCount) descCount.textContent = `${desc.value.length}/500`;
        if (desc.value.trim()) formData.description = desc.value.trim();
    }

    if (challenges) {
        const challengesCount = document.getElementById('challengesCount');
        if (challengesCount) challengesCount.textContent = `${challenges.value.length}/400`;
        if (challenges.value.trim()) formData.challenges = challenges.value.trim();
    }
}

function updateFeatures() {
    // Only try to update if element exists
    const keyFeatures = document.getElementById('keyFeatures');
    if (keyFeatures) {
        const featuresText = keyFeatures.value;
        formData.features = featuresText.split('\\n').filter(f => f.trim()).map(f => f.trim());
    } else {
        // Fallback for list based features if implemented
        const features = [];
        document.querySelectorAll('#featuresList input').forEach(input => {
            if (input.value.trim()) features.push(input.value.trim());
        });
        if (features.length > 0) formData.features = features;
    }
}

function updateCompetitors() {
    const competitorsElem = document.getElementById('competitors');
    if (competitorsElem) {
        const competitorsText = competitorsElem.value;
        formData.competitors = competitorsText.split(',').filter(c => c.trim()).map(c => c.trim());
    }
}

function updatePitchType() {
    const selectedType = document.querySelector('input[name="pitchType"]:checked');
    if (selectedType) {
        formData.pitchType = selectedType.value;
    }
}

function updateSummary() {
    const summaryProduct = document.getElementById('summaryProduct');
    const summaryCustomer = document.getElementById('summaryCustomer');
    const summaryRole = document.getElementById('summaryRole');
    const summaryIndustry = document.getElementById('summaryIndustry');
    const summaryChallenges = document.getElementById('summaryChallenges');
    const summaryBudget = document.getElementById('summaryBudget');

    if (summaryProduct) summaryProduct.textContent = formData.product || '-';
    if (summaryCustomer) summaryCustomer.textContent = formData.customer || '-';
    if (summaryRole) summaryRole.textContent = formData.role || '-';
    if (summaryIndustry) summaryIndustry.textContent = formData.industry || '-';
    if (summaryBudget) summaryBudget.textContent = getBudgetLabel(formData.budget) || '-';
    if (summaryChallenges) summaryChallenges.textContent = formData.challenges ? formData.challenges.substring(0, 50) + '...' : '-';
}

function getBudgetLabel(value) {
    const budgets = {
        'low': 'Under $5K',
        'medium': '$5K - $50K',
        'high': '$50K - $200K',
        'enterprise': '$200K+',
        'unknown': 'Not specified'
    };
    return budgets[value] || value;
}

// Pitch Generation
async function generatePitch(e) {
    e.preventDefault();

    // Get final data - with safety checks
    formData.product = document.getElementById('productName')?.value.trim() || '';
    formData.description = document.getElementById('productDescription')?.value.trim() || '';
    formData.customer = document.getElementById('customerName')?.value.trim() || '';

    const roleElem = document.querySelector('input[name="customerRole"]:checked');
    formData.role = roleElem ? roleElem.value : 'director';

    formData.industry = document.getElementById('industry')?.value || 'tech';
    formData.companySize = document.getElementById('companySize')?.value || 'medium';
    formData.challenges = document.getElementById('challenges')?.value.trim() || '';

    // These fields might not exist in all versions of the HTML
    const goalsElem = document.getElementById('goals');
    formData.goals = goalsElem ? goalsElem.value.trim() : '';

    // Provide defaults for optional fields or fix ID references
    const budgetElem = document.getElementById('budgetRange'); // This ID might be missing in your HTML, check it
    formData.budget = budgetElem ? budgetElem.value : 'medium';

    const toneElem = document.querySelector('input[name="tone"]:checked');
    formData.tone = toneElem ? toneElem.value : 'professional';

    const formatElem = document.querySelector('input[name="format"]:checked');
    formData.pitchType = formatElem ? formatElem.value : 'email';

    formData.notes = document.getElementById('additionalNotes')?.value.trim() || '';

    updateFeatures();

    // safely update competitors if element exists
    const competitorsElem = document.getElementById('competitors');
    if (competitorsElem) {
        updateCompetitors();
    }

    // Validation
    if (!formData.product || !formData.customer || !formData.challenges) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Show loading
    showLoading();

    try {
        const response = await fetch('/api/generate/pitch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product: formData.product + ': ' + formData.description,
                customer: `${formData.customer} (${formData.role})`,
                industry: formData.industry,
                company_size: formData.companySize,
                budget: formData.budget,
                challenges: formData.challenges,
                goals: formData.goals,
                features: formData.features,
                competitors: formData.competitors,
                pitch_type: formData.pitchType,
                tone: formData.tone,
                notes: formData.notes
            })
        });

        const data = await response.json();

        if (data.success) {
            displayResults(data.result);
        } else {
            showError(data.error || 'Failed to generate pitch');
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
        <div class="pitch-results">
            <div class="pitch-header">
                <div class="pitch-meta">
                    <span class="pitch-to">To: ${formData.customer}</span>
                    <span class="pitch-type">${formData.pitchType.charAt(0).toUpperCase() + formData.pitchType.slice(1)} Pitch</span>
                </div>
                <div class="pitch-stats">
                    <div class="stat">
                        <i class="fas fa-industry"></i>
                        <span>${formData.industry || 'Not specified'}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-users"></i>
                        <span>${formData.companySize || 'Not specified'}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-palette"></i>
                        <span>${formData.tone.charAt(0).toUpperCase() + formData.tone.slice(1)} Tone</span>
                    </div>
                </div>
            </div>
            
            <div class="pitch-content">
                ${html}
            </div>
            
            <div class="pitch-actions">
                <div class="action-group">
                    <h5><i class="fas fa-clock"></i> Recommended Follow-up</h5>
                    <ul>
                        <li>Send this pitch within 24 hours</li>
                        <li>Follow up in 3-5 days if no response</li>
                        <li>Prepare for potential objections mentioned</li>
                        <li>Schedule a demo or meeting</li>
                    </ul>
                </div>
                
                <div class="action-group">
                    <h5><i class="fas fa-chart-line"></i> Success Metrics</h5>
                    <div class="metrics-grid">
                        <div class="metric">
                            <span class="metric-label">Response Rate</span>
                            <span class="metric-value">Target: 15-25%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Meeting Booked</span>
                            <span class="metric-value">Target: 5-10%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Conversion Rate</span>
                            <span class="metric-value">Target: 2-5%</span>
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
    generatePitch(new Event('submit'));
}

// Templates
function loadTemplate(templateName) {
    const templates = {
        saas: {
            productName: "AI Sales Assistant Pro",
            productDescription: "An intelligent sales platform that uses AI to generate personalized pitches, track engagement, and predict conversion likelihood. Features include email automation, meeting scheduling, and performance analytics.",
            customerName: "Sarah Johnson at GrowthTech",
            customerRole: "Sales Director",
            companyIndustry: "saas",
            companySize: "medium",
            customerChallenges: "Struggling with low email response rates (under 5%), difficulty personalizing outreach at scale, and tracking which pitches are most effective. Spending too much time on manual outreach.",
            budget: "medium"
        },
        enterprise: {
            productName: "Enterprise Security Suite",
            productDescription: "Comprehensive cybersecurity solution with AI-powered threat detection, 24/7 monitoring, and compliance automation. Protects against ransomware, data breaches, and insider threats.",
            customerName: "Michael Chen at GlobalBank",
            customerRole: "CISO",
            companyIndustry: "finance",
            companySize: "enterprise",
            customerChallenges: "Increasing regulatory requirements, frequent security audits, need for real-time threat detection, and managing security across multiple regions. Current solution is outdated and requires manual monitoring.",
            budget: "enterprise"
        },
        consulting: {
            productName: "Digital Transformation Consulting",
            productDescription: "End-to-end digital transformation services including strategy development, implementation, and change management. Specialized in helping traditional businesses adopt modern technologies.",
            customerName: "Robert Williams at Classic Manufacturing",
            customerRole: "CEO",
            companyIndustry: "manufacturing",
            companySize: "large",
            customerChallenges: "Struggling to compete with digital-native companies, outdated processes causing inefficiencies, difficulty attracting younger talent, and need to modernize customer experience.",
            budget: "high"
        }
    };

    const template = templates[templateName];
    if (!template) return;

    // Fill form
    const productName = document.getElementById('productName');
    if (productName) productName.value = template.productName;

    const productDesc = document.getElementById('productDescription');
    if (productDesc) productDesc.value = template.productDescription;

    const customerName = document.getElementById('customerName');
    if (customerName) customerName.value = template.customerName;

    // For radio buttons (role)
    const roleRadios = document.querySelectorAll(`input[name="customerRole"][value="${template.customerRole}"]`);
    if (roleRadios.length > 0) roleRadios[0].checked = true;

    const industry = document.getElementById('industry');
    if (industry) industry.value = template.companyIndustry;

    const companySize = document.getElementById('companySize');
    if (companySize) companySize.value = template.companySize;

    const challenges = document.getElementById('challenges');
    if (challenges) challenges.value = template.customerChallenges;

    const budget = document.getElementById('budgetRange');
    if (budget) budget.value = template.budget;

    // Update form data
    formData = { ...formData, ...template };
    // Map template fields to formData correctly
    formData.role = template.customerRole;
    formData.industry = template.companyIndustry;
    formData.challenges = template.customerChallenges;

    updateCharCounters();
    updateSummary();

    showNotification(`Loaded ${templateName} template`, 'success');
}

// Form Management
function clearForm() {
    if (confirm('Are you sure you want to clear all form data?')) {
        pitchForm.reset();
        currentSection = 0;
        sections.forEach((section, index) => {
            section.classList.toggle('active', index === 0);
        });

        formData = {
            product: '',
            description: '',
            features: [],
            competitors: [],
            customer: '',
            role: '',
            industry: '',
            companySize: '',
            challenges: '',
            goals: '',
            budget: '',
            pitchType: 'email',
            tone: 'professional',
            notes: ''
        };

        updateCharCounters();
        updateSummary();

        resultsContent.innerHTML = `
            <div class="empty-results">
                <div class="empty-icon">
                    <i class="fas fa-microphone"></i>
                </div>
                <h3>Ready to Impress?</h3>
                <p>Fill in the pitch details and click "Generate Pitch with AI" to create your perfect sales pitch.</p>
                <div class="empty-features">
                    <div class="feature">
                        <i class="fas fa-bolt"></i>
                        <span>Personalized AI Generation</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-user-check"></i>
                        <span>Customer-Focused Content</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-copy"></i>
                        <span>Multiple Format Options</span>
                    </div>
                </div>
            </div>
        `;

        resultsActions.style.display = 'none';

        showNotification('Form cleared successfully', 'success');
    }
}

function newPitch() {
    clearForm();
}

// Results Actions
function copyResults() {
    const text = resultsContent.innerText;
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Pitch copied to clipboard!', 'success');
    });
}

function exportPDF() {
    showNotification('PDF export feature coming soon!', 'info');
}

function savePitch() {
    const pitchData = {
        ...formData,
        generatedAt: new Date().toISOString(),
        content: resultsContent.innerHTML
    };

    localStorage.setItem(`pitch_${Date.now()}`, JSON.stringify(pitchData));
    showNotification('Pitch saved locally!', 'success');
}

function sharePitch() {
    if (navigator.share) {
        navigator.share({
            title: `Pitch for ${formData.customer}`,
            text: `Check out this sales pitch generated by MarketAI Suite!`,
            url: window.location.href
        });
    } else {
        showNotification('Share this URL with your team', 'info');
    }
}

// History
function viewPitchHistory() {
    loadHistory();
    openModal('historyModal');
}

function loadHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    const activities = JSON.parse(localStorage.getItem('pitch_activities') || '[]');

    if (activities.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history"></i>
                <p>No pitch history yet</p>
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
                    <span class="tag">${activity.customer}</span>
                    <span class="tag">${activity.pitchType}</span>
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
        customer: formData.customer,
        pitchType: formData.pitchType,
        preview: document.querySelector('.pitch-results h2')?.textContent || 'Pitch generated',
        timestamp: new Date().toISOString()
    };

    const activities = JSON.parse(localStorage.getItem('pitch_activities') || '[]');
    activities.push(activity);
    localStorage.setItem('pitch_activities', JSON.stringify(activities));
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
            generatePitch(new Event('submit'));
        }
    }

    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});
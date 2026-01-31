// DOM Elements
const leadForm = document.getElementById('leadForm');
const sections = document.querySelectorAll('.form-section');
const loadingState = document.getElementById('loadingState');
const resultsContent = document.getElementById('resultsContent');
const errorState = document.getElementById('errorState');
const resultsActions = document.getElementById('resultsActions');

// Form Data
let currentSection = 0;
let formData = {
    name: '',
    company: '',
    role: '',
    industry: '',
    companySize: '',
    need: '',
    budgetAvailability: '',
    budgetRange: '',
    timeline: '',
    urgency: 'medium',
    decisionMakers: '',
    competitors: [],
    challenges: '',
    additionalContext: '',
    scoringMethod: 'bant'
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
    document.getElementById('businessNeed').addEventListener('input', updateCharCounters);
    document.getElementById('challenges').addEventListener('input', updateCharCounters);
    
    // Urgency selection
    document.querySelectorAll('input[name="urgency"]').forEach(radio => {
        radio.addEventListener('change', updateUrgency);
    });
    
    // Scoring method selection
    document.querySelectorAll('input[name="scoringMethod"]').forEach(radio => {
        radio.addEventListener('change', updateScoringMethod);
    });
    
    // Competitors input
    document.getElementById('competitors').addEventListener('change', updateCompetitors);
    
    // Form submission
    leadForm.addEventListener('submit', scoreLead);
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
        const leadName = document.getElementById('leadName').value.trim();
        const companyName = document.getElementById('companyName').value.trim();
        
        if (!leadName || !companyName) {
            showNotification('Please fill in lead name and company', 'error');
            return false;
        }
        
        formData.name = leadName;
        formData.company = companyName;
    }
    
    if (currentSection === 1) {
        const businessNeed = document.getElementById('businessNeed').value.trim();
        
        if (!businessNeed) {
            showNotification('Please describe the business need', 'error');
            return false;
        }
        
        formData.need = businessNeed;
    }
    
    return true;
}

// Form Updates
function updateCharCounters() {
    const need = document.getElementById('businessNeed');
    const challenges = document.getElementById('challenges');
    
    document.getElementById('needCount').textContent = `${need.value.length}/300`;
    document.getElementById('challengesCount').textContent = `${challenges.value.length}/400`;
    
    if (need.value.trim()) formData.need = need.value.trim();
    if (challenges.value.trim()) formData.challenges = challenges.value.trim();
}

function updateUrgency() {
    const selectedUrgency = document.querySelector('input[name="urgency"]:checked');
    if (selectedUrgency) {
        formData.urgency = selectedUrgency.value;
    }
}

function updateScoringMethod() {
    const selectedMethod = document.querySelector('input[name="scoringMethod"]:checked');
    if (selectedMethod) {
        formData.scoringMethod = selectedMethod.value;
    }
}

function updateCompetitors() {
    const competitorsText = document.getElementById('competitors').value;
    formData.competitors = competitorsText.split(',').filter(c => c.trim()).map(c => c.trim());
}

function updateSummary() {
    document.getElementById('summaryLead').textContent = formData.name || '-';
    document.getElementById('summaryCompany').textContent = formData.company || '-';
    document.getElementById('summaryNeed').textContent = formData.need ? formData.need.substring(0, 30) + '...' : '-';
    document.getElementById('summaryBudget').textContent = getBudgetLabel(formData.budgetRange) || '-';
    document.getElementById('summaryTimeline').textContent = getTimelineLabel(formData.timeline) || '-';
}

function getBudgetLabel(value) {
    const budgets = {
        'under5k': 'Under $5K',
        '5k-20k': '$5K - $20K',
        '20k-50k': '$20K - $50K',
        '50k-100k': '$50K - $100K',
        '100k+': '$100K+'
    };
    return budgets[value] || value;
}

function getTimelineLabel(value) {
    const timelines = {
        'immediate': 'Immediate (0-30 days)',
        'short': 'Short-term (1-3 months)',
        'medium': 'Medium-term (3-6 months)',
        'long': 'Long-term (6+ months)',
        'unknown': 'Unknown'
    };
    return timelines[value] || value;
}

// Lead Scoring
async function scoreLead(e) {
    e.preventDefault();
    
    // Get final data
    formData.name = document.getElementById('leadName').value.trim();
    formData.company = document.getElementById('companyName').value.trim();
    formData.role = document.getElementById('leadRole').value;
    formData.industry = document.getElementById('companyIndustry').value;
    formData.companySize = document.getElementById('companySize').value;
    formData.need = document.getElementById('businessNeed').value.trim();
    formData.budgetAvailability = document.getElementById('budgetAvailability').value;
    formData.budgetRange = document.getElementById('budgetRange').value;
    formData.timeline = document.getElementById('timeline').value;
    formData.decisionMakers = document.getElementById('decisionMakers').value;
    formData.challenges = document.getElementById('challenges').value.trim();
    formData.additionalContext = document.getElementById('additionalContext').value.trim();
    
    updateCompetitors();
    
    // Validation
    if (!formData.name || !formData.company || !formData.need) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading
    showLoading();
    
    try {
        const response = await fetch('/api/score/lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.name,
                company: formData.company,
                role: formData.role,
                budget: formData.budgetRange,
                need: formData.need,
                urgency: formData.urgency,
                timeline: formData.timeline,
                decision_makers: formData.decisionMakers,
                challenges: formData.challenges,
                industry: formData.industry,
                company_size: formData.companySize,
                budget_availability: formData.budgetAvailability,
                competitors: formData.competitors,
                additional_context: formData.additionalContext,
                scoring_method: formData.scoringMethod
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResults(data.result, data.score);
        } else {
            showError(data.error || 'Failed to score lead');
        }
    } catch (error) {
        showError('Network error. Please check your connection.');
        console.error('Scoring error:', error);
    }
}

function showLoading() {
    loadingState.style.display = 'block';
    resultsContent.style.display = 'none';
    errorState.style.display = 'none';
    resultsActions.style.display = 'none';
}

function displayResults(html, score) {
    loadingState.style.display = 'none';
    resultsContent.style.display = 'block';
    errorState.style.display = 'none';
    resultsActions.style.display = 'flex';
    
    // Determine lead status
    let status = 'cold';
    let statusColor = '#ef4444';
    let statusIcon = 'snowflake';
    
    if (score >= 70) {
        status = 'hot';
        statusColor = '#10b981';
        statusIcon = 'fire';
    } else if (score >= 40) {
        status = 'warm';
        statusColor = '#f59e0b';
        statusIcon = 'sun';
    }
    
    resultsContent.innerHTML = `
        <div class="leadscore-results">
            <div class="leadscore-header">
                <div class="leadscore-meta">
                    <span class="lead-name">${formData.name}</span>
                    <span class="lead-company">${formData.company}</span>
                </div>
                <div class="leadscore-score">
                    <div class="score-circle" style="--score: ${score}; --color: ${statusColor};">
                        <span class="score-value">${score}</span>
                        <span class="score-label">/100</span>
                    </div>
                    <div class="score-status">
                        <span class="status-badge" style="background: ${statusColor};">
                            <i class="fas fa-${statusIcon}"></i> ${status.toUpperCase()} LEAD
                        </span>
                        <p>${getStatusDescription(status, score)}</p>
                    </div>
                </div>
            </div>
            
            <div class="leadscore-content">
                ${html}
            </div>
            
            <div class="leadscore-actions">
                <div class="action-group">
                    <h5><i class="fas fa-clock"></i> Recommended Next Steps</h5>
                    <ul>
                        ${getNextSteps(status, score)}
                    </ul>
                </div>
                
                <div class="action-group">
                    <h5><i class="fas fa-chart-line"></i> Follow-up Schedule</h5>
                    <div class="followup-grid">
                        ${getFollowupSchedule(status)}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Scroll to results
    resultsContent.scrollIntoView({ behavior: 'smooth' });
    
    // Save to local storage
    saveToHistory(score, status);
}

function getStatusDescription(status, score) {
    const descriptions = {
        'hot': `High priority! This lead has a ${score}% probability of conversion. Immediate follow-up recommended.`,
        'warm': `Medium priority. This lead has a ${score}% probability of conversion. Nurture with regular follow-ups.`,
        'cold': `Low priority. This lead has a ${score}% probability of conversion. Consider long-term nurturing.`
    };
    return descriptions[status] || '';
}

function getNextSteps(status, score) {
    const steps = {
        'hot': [
            'Contact within 24 hours',
            'Schedule a demo or meeting',
            'Prepare proposal with pricing',
            'Involve senior team members if needed'
        ],
        'warm': [
            'Send additional resources',
            'Schedule a discovery call',
            'Add to regular nurturing sequence',
            'Follow up in 3-5 days'
        ],
        'cold': [
            'Add to monthly newsletter',
            'Share educational content',
            'Re-engage in 30 days',
            'Monitor for trigger events'
        ]
    };
    
    return (steps[status] || steps.cold).map(step => `<li>${step}</li>`).join('');
}

function getFollowupSchedule(status) {
    const schedules = {
        'hot': `
            <div class="followup-item">
                <span class="followup-day">Day 1</span>
                <span class="followup-action">Initial contact</span>
            </div>
            <div class="followup-item">
                <span class="followup-day">Day 2</span>
                <span class="followup-action">Follow-up call</span>
            </div>
            <div class="followup-item">
                <span class="followup-day">Day 3</span>
                <span class="followup-action">Proposal sent</span>
            </div>
            <div class="followup-item">
                <span class="followup-day">Day 7</span>
                <span class="followup-action">Final follow-up</span>
            </div>
        `,
        'warm': `
            <div class="followup-item">
                <span class="followup-day">Week 1</span>
                <span class="followup-action">Initial contact</span>
            </div>
            <div class="followup-item">
                <span class="followup-day">Week 2</span>
                <span class="followup-action">Educational content</span>
            </div>
            <div class="followup-item">
                <span class="followup-day">Week 3</span>
                <span class="followup-action">Follow-up call</span>
            </div>
            <div class="followup-item">
                <span class="followup-day">Month 1</span>
                <span class="followup-action">Re-assessment</span>
            </div>
        `,
        'cold': `
            <div class="followup-item">
                <span class="followup-day">Month 1</span>
                <span class="followup-action">Newsletter</span>
            </div>
            <div class="followup-item">
                <span class="followup-day">Month 2</span>
                <span class="followup-action">Check-in email</span>
            </div>
            <div class="followup-item">
                <span class="followup-day">Month 3</span>
                <span class="followup-action">Value content</span>
            </div>
            <div class="followup-item">
                <span class="followup-day">Month 6</span>
                <span class="followup-action">Re-engagement</span>
            </div>
        `
    };
    
    return schedules[status] || schedules.cold;
}

function showError(message) {
    loadingState.style.display = 'none';
    resultsContent.style.display = 'none';
    errorState.style.display = 'block';
    resultsActions.style.display = 'none';
    
    document.getElementById('errorMessage').textContent = message;
}

function retryGeneration() {
    scoreLead(new Event('submit'));
}

// Templates
function loadTemplate(templateName) {
    const templates = {
        hot: {
            leadName: "Alex Johnson",
            companyName: "GrowthTech Solutions",
            leadRole: "executive",
            companyIndustry: "tech",
            companySize: "medium",
            businessNeed: "Need to implement a comprehensive marketing automation platform to scale lead generation by 300% in next 6 months. Current manual processes are inefficient.",
            budgetAvailability: "approved",
            budgetRange: "50k-100k",
            timeline: "immediate",
            urgency: "high",
            decisionMakers: "single",
            challenges: "Rapid growth causing lead management chaos, missed opportunities, lack of tracking"
        },
        warm: {
            leadName: "Maria Garcia",
            companyName: "EcoRetail Inc",
            leadRole: "director",
            companyIndustry: "retail",
            companySize: "large",
            businessNeed: "Exploring customer analytics solutions to improve personalization and increase repeat purchases. Currently using basic tools.",
            budgetAvailability: "allocated",
            budgetRange: "20k-50k",
            timeline: "short",
            urgency: "medium",
            decisionMakers: "committee",
            challenges: "Data siloed across departments, difficulty measuring ROI on marketing spend, customer churn increasing"
        },
        cold: {
            leadName: "David Wilson",
            companyName: "Traditional Manufacturing Co",
            leadRole: "manager",
            companyIndustry: "manufacturing",
            companySize: "medium",
            businessNeed: "Considering digital transformation but not urgent. Looking at options for future planning.",
            budgetAvailability: "potential",
            budgetRange: "under5k",
            timeline: "long",
            urgency: "low",
            decisionMakers: "multiple",
            challenges: "Resistance to change from leadership, legacy systems, limited IT resources"
        }
    };
    
    const template = templates[templateName];
    if (!template) return;
    
    // Fill form
    document.getElementById('leadName').value = template.leadName;
    document.getElementById('companyName').value = template.companyName;
    document.getElementById('leadRole').value = template.leadRole;
    document.getElementById('companyIndustry').value = template.companyIndustry;
    document.getElementById('companySize').value = template.companySize;
    document.getElementById('businessNeed').value = template.businessNeed;
    document.getElementById('budgetAvailability').value = template.budgetAvailability;
    document.getElementById('budgetRange').value = template.budgetRange;
    document.getElementById('timeline').value = template.timeline;
    document.getElementById('decisionMakers').value = template.decisionMakers;
    document.getElementById('challenges').value = template.challenges;
    
    // Set urgency
    document.querySelector(`input[name="urgency"][value="${template.urgency}"]`).checked = true;
    
    // Update form data
    formData = { ...formData, ...template };
    formData.urgency = template.urgency;
    
    updateCharCounters();
    updateUrgency();
    updateSummary();
    
    showNotification(`Loaded ${templateName} lead template`, 'success');
}

// Form Management
function clearForm() {
    if (confirm('Are you sure you want to clear all form data?')) {
        leadForm.reset();
        currentSection = 0;
        sections.forEach((section, index) => {
            section.classList.toggle('active', index === 0);
        });
        
        formData = {
            name: '',
            company: '',
            role: '',
            industry: '',
            companySize: '',
            need: '',
            budgetAvailability: '',
            budgetRange: '',
            timeline: '',
            urgency: 'medium',
            decisionMakers: '',
            competitors: [],
            challenges: '',
            additionalContext: '',
            scoringMethod: 'bant'
        };
        
        updateCharCounters();
        updateSummary();
        
        resultsContent.innerHTML = `
            <div class="empty-results">
                <div class="empty-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <h3>Ready to Qualify?</h3>
                <p>Fill in the lead details and click "Score Lead with AI" to get your qualification analysis.</p>
                <div class="empty-features">
                    <div class="feature">
                        <i class="fas fa-bolt"></i>
                        <span>AI-Powered Scoring</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-chart-pie"></i>
                        <span>Detailed Analysis</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-lightbulb"></i>
                        <span>Actionable Insights</span>
                    </div>
                </div>
            </div>
        `;
        
        resultsActions.style.display = 'none';
        
        showNotification('Form cleared successfully', 'success');
    }
}

function newLead() {
    clearForm();
}

// Results Actions
function copyResults() {
    const text = resultsContent.innerText;
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Lead score copied to clipboard!', 'success');
    });
}

function exportPDF() {
    showNotification('PDF export feature coming soon!', 'info');
}

function saveLead() {
    const leadData = {
        ...formData,
        generatedAt: new Date().toISOString(),
        content: resultsContent.innerHTML
    };
    
    localStorage.setItem(`lead_${Date.now()}`, JSON.stringify(leadData));
    showNotification('Lead score saved locally!', 'success');
}

function shareLead() {
    if (navigator.share) {
        navigator.share({
            title: `Lead Score: ${formData.name}`,
            text: `Check out this lead qualification generated by MarketAI Suite!`,
            url: window.location.href
        });
    } else {
        showNotification('Share this URL with your team', 'info');
    }
}

// History
function viewLeadHistory() {
    loadHistory();
    openModal('historyModal');
}

function loadHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    const activities = JSON.parse(localStorage.getItem('leadscore_activities') || '[]');
    
    if (activities.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history"></i>
                <p>No lead score history yet</p>
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
                    <h5>${activity.name}</h5>
                    <span class="history-date">${new Date(activity.timestamp).toLocaleDateString()}</span>
                </div>
                <p class="history-preview">${activity.preview}</p>
                <div class="history-tags">
                    <span class="tag score-${activity.score >= 70 ? 'hot' : activity.score >= 40 ? 'warm' : 'cold'}">
                        Score: ${activity.score}/100
                    </span>
                    <span class="tag">${activity.company}</span>
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

function saveToHistory(score, status) {
    const activity = {
        id: Date.now(),
        name: formData.name,
        company: formData.company,
        score: score,
        status: status,
        preview: `Lead scored ${score}/100 - ${status.toUpperCase()}`,
        timestamp: new Date().toISOString()
    };
    
    const activities = JSON.parse(localStorage.getItem('leadscore_activities') || '[]');
    activities.push(activity);
    localStorage.setItem('leadscore_activities', JSON.stringify(activities));
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
            scoreLead(new Event('submit'));
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});
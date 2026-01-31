from flask import Flask, render_template, request, jsonify, session, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
from datetime import datetime
import groq
import markdown2

load_dotenv()

app = Flask(__name__, 
            static_folder='static',
            static_url_path='/static',
            template_folder='templates')

app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
CORS(app)

# Initialize Groq client
client = groq.Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Store activities in session
def init_activities():
    if 'activities' not in session:
        session['activities'] = []

def add_activity(activity_type, data, result_preview):
    activity = {
        'type': activity_type,
        'data': data,
        'preview': result_preview,
        'timestamp': datetime.now().isoformat(),
        'id': len(session['activities']) + 1
    }
    session['activities'].append(activity)
    session.modified = True

# CONTEXT PROCESSOR - This makes 'activities' available in ALL templates
@app.context_processor
def inject_common_data():
    """Inject common data into all templates"""
    init_activities()  # Ensure activities are initialized
    
    return {
        'activities': session.get('activities', [])[:5],
        'current_year': datetime.now().year,
        'app_name': 'MarketAI Suite'
    }

@app.route('/debug-static')
def debug_static():
    """Debug page to check if static files are loading"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Debug Static Files</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .test-box { padding: 20px; margin: 10px; border: 1px solid #ccc; }
            .success { background: #d4edda; color: #155724; }
            .error { background: #f8d7da; color: #721c24; }
            .loading { background: #fff3cd; color: #856404; }
        </style>
    </head>
    <body>
        <h1>Static Files Debug</h1>
        
        <div class="test-box">
            <h3>Test CSS Files:</h3>
            <p id="css-status" class="loading">Testing style.css...</p>
            <p id="dashboard-css-status" class="loading">Testing dashboard.css...</p>
        </div>
        
        <div class="test-box">
            <h3>Test JavaScript Files:</h3>
            <p id="js-status" class="loading">Testing main.js...</p>
        </div>
        
        <div class="test-box">
            <h3>Direct Links:</h3>
            <ul>
                <li><a href="/static/css/style.css" target="_blank">style.css</a></li>
                <li><a href="/static/css/dashboard.css" target="_blank">dashboard.css</a></li>
                <li><a href="/static/js/main.js" target="_blank">main.js</a></li>
                <li><a href="/" target="_blank">Back to Home</a></li>
            </ul>
        </div>
        
        <script>
            // Test CSS files
            fetch('/static/css/style.css')
                .then(r => {
                    document.getElementById('css-status').className = r.ok ? 'success' : 'error';
                    document.getElementById('css-status').textContent = 
                        r.ok ? '✅ style.css loaded successfully!' : '❌ style.css failed to load';
                })
                .catch(e => {
                    document.getElementById('css-status').className = 'error';
                    document.getElementById('css-status').textContent = '❌ Error: ' + e.message;
                });
            
            fetch('/static/css/dashboard.css')
                .then(r => {
                    document.getElementById('dashboard-css-status').className = r.ok ? 'success' : 'error';
                    document.getElementById('dashboard-css-status').textContent = 
                        r.ok ? '✅ dashboard.css loaded successfully!' : '❌ dashboard.css failed to load';
                })
                .catch(e => {
                    document.getElementById('dashboard-css-status').className = 'error';
                    document.getElementById('dashboard-css-status').textContent = '❌ Error: ' + e.message;
                });
            
            // Test JS files
            fetch('/static/js/main.js')
                .then(r => {
                    document.getElementById('js-status').className = r.ok ? 'success' : 'error';
                    document.getElementById('js-status').textContent = 
                        r.ok ? '✅ main.js loaded successfully!' : '❌ main.js failed to load';
                })
                .catch(e => {
                    document.getElementById('js-status').className = 'error';
                    document.getElementById('js-status').textContent = '❌ Error: ' + e.message;
                });
        </script>
    </body>
    </html>
    '''

@app.route('/')
def index():
    init_activities()
    # No need to pass activities explicitly anymore (context processor handles it)
    return render_template('index.html')

@app.route('/campaign')
def campaign():
    # No need to pass activities explicitly anymore (context processor handles it)
    return render_template('campaign.html')

@app.route('/pitch')
def pitch():
    # No need to pass activities explicitly anymore (context processor handles it)
    return render_template('pitch.html')

@app.route('/leadscore')
def leadscore():
    # No need to pass activities explicitly anymore (context processor handles it)
    return render_template('leadscore.html')

# Add this route to serve CSS files directly (helpful for debugging)
@app.route('/static/css/<filename>')
def serve_css(filename):
    return send_from_directory('static/css', filename)

# Add this route to serve JS files directly
@app.route('/static/js/<filename>')
def serve_js(filename):
    return send_from_directory('static/js', filename)

# Your existing API routes remain exactly the same...
@app.route('/api/generate/campaign', methods=['POST'])
def generate_campaign_api():
    try:
        data = request.json
        
        prompt = f"""Create a comprehensive marketing campaign with these details:

PRODUCT/SERVICE: {data.get('product', '')}
TARGET AUDIENCE: {data.get('audience', '')}
PLATFORMS: {', '.join(data.get('platforms', []))}
TONE: {data.get('tone', 'professional')}
GOAL: {data.get('goal', 'increase awareness')}

Please provide a structured response with these sections:

## 🎯 CAMPAIGN OBJECTIVES
- List 3-5 specific, measurable objectives

## 📱 PLATFORM-SPECIFIC STRATEGY
- Detailed strategy for each selected platform
- Content types and formats
- Posting frequency and timing

## ✨ CONTENT IDEAS (5-7 ideas)
- Specific content concepts with descriptions
- Visual suggestions
- Engagement tactics

## 📝 AD COPY VARIATIONS (3 variations)
- Variation 1: Problem-Agitate-Solve format
- Variation 2: Social proof format  
- Variation 3: Urgency/Scarcity format

## 🔗 CALL-TO-ACTION SUGGESTIONS
- Primary CTA for each platform
- Secondary CTAs for different funnel stages

## 📊 TRACKING & MEASUREMENT
- Key metrics to track
- Success indicators
- Optimization suggestions

Make it practical, actionable, and data-driven. Use markdown formatting for better readability."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert marketing strategist with 15+ years experience."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2500
        )
        
        result = response.choices[0].message.content
        html_result = markdown2.markdown(result, extras=["tables", "fenced-code-blocks"])
        
        # Add activity
        add_activity('campaign', {
            'product': data.get('product', ''),
            'platforms': data.get('platforms', [])
        }, result[:150] + '...')
        
        return jsonify({
            'success': True,
            'result': html_result,
            'raw': result
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/generate/pitch', methods=['POST'])
def generate_pitch_api():
    try:
        data = request.json
        
        prompt = f"""Create a compelling, personalized sales pitch based on the following details:

PROMPT INPUTS:
- PRODUCT/SERVICE: {data.get('product', '')}
- KEY FEATURES: {', '.join(data.get('features', [])) if isinstance(data.get('features'), list) else data.get('features', 'Not specified')}
- CUSTOMER: {data.get('customer', '')}
- INDUSTRY: {data.get('industry', '')}
- COMPANY SIZE: {data.get('company_size', '')}
- CHALLENGES: {data.get('challenges', '')}
- GOALS: {data.get('goals', '')}
- COMPETITORS: {', '.join(data.get('competitors', [])) if isinstance(data.get('competitors'), list) else data.get('competitors', 'Not specified')}
- PITCH TYPE: {data.get('pitch_type', 'sales pitch')}
- DESIRED TONE: {data.get('tone', 'professional')}
- ADDITIONAL NOTES: {data.get('notes', 'None')}

Please provide a highly structured and persuasive response with these sections:

## 🏷️ PRODUCT OVERVIEW
- A comprehensive description of the product/service
- How it specifically addresses the industry landscape
- The core value it provides

## 🎯 30-SECOND ELEVATOR PITCH
- Concise, engaging opening
- Immediate value proposition focused on the customer's challenges

## 💡 VALUE PROPOSITION
- Clear business benefits (quantify when possible)
- ROI justification
- Problem-solution fit for {data.get('company_size', 'their company size')}

## ⚡ KEY DIFFERENTIATORS & FEATURES
- What makes this unique vs {data.get('competitors', 'competitors')}
- Highlight these key features: {', '.join(data.get('features', [])) if isinstance(data.get('features'), list) else 'the features provided'}

## 🎯 TARGETED SOLUTIONS
- Specific solutions to: {data.get('challenges', 'the customer challenges')}
- Detailed implementation recommendations
- Key success metrics

## 📞 CALL-TO-ACTION (CTA)
- Specific next steps for a {data.get('pitch_type', 'follow-up')}
- Timeline suggestions and offer details

## 📧 COMMUNICATION TEMPLATES
- Optimized {data.get('pitch_type', 'message')} template
- LinkedIn outreach variation
- 2-step follow-up sequence

Make the content deeply personalized and highly persuasive. Use professional markdown formatting with icons."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert sales strategist with 10+ years experience."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        result = response.choices[0].message.content
        html_result = markdown2.markdown(result, extras=["tables", "fenced-code-blocks"])
        
        add_activity('pitch', {
            'product': data.get('product', ''),
            'customer': data.get('customer', '')[:50]
        }, result[:150] + '...')
        
        return jsonify({
            'success': True,
            'result': html_result,
            'raw': result
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/score/lead', methods=['POST'])
def score_lead_api():
    try:
        data = request.json
        
        prompt = f"""Analyze and score this lead with professional sales qualification:

LEAD DETAILS:
- Name: {data.get('name', '')}
- Company: {data.get('company', '')}
- Role: {data.get('role', '')}
- Budget: {data.get('budget', '')}
- Business Need: {data.get('need', '')}
- Urgency: {data.get('urgency', '')}
- Timeline: {data.get('timeline', '')}
- Decision Makers: {data.get('decision_makers', '')}
- Challenges: {data.get('challenges', '')}

Score this lead across these dimensions (provide scores 0-100):

1. BUDGET (30 points):
   - Availability of funds
   - Spending authority
   - Budget alignment

2. NEED (30 points):
   - Problem clarity
   - Solution fit
   - Pain intensity

3. AUTHORITY (20 points):
   - Decision-making power
   - Buying process influence
   - Stakeholder access

4. TIMELINE (20 points):
   - Implementation urgency
   - Decision timeline
   - Project priority

Provide this structured response:

## 📊 LEAD SCORECARD
- Total Score: X/100
- Qualification: Hot/Warm/Cold
- Probability of Conversion: X%

## 🔍 SCORING BREAKDOWN
### Budget: X/30
[Detailed analysis]

### Need: X/30  
[Detailed analysis]

### Authority: X/20
[Detailed analysis]

### Timeline: X/20
[Detailed analysis]

## 🎯 RECOMMENDATIONS
- Immediate next steps
- Follow-up strategy
- Resources to provide
- Potential objections to address

## 📈 CONVERSION PROBABILITY
- Estimated likelihood: X%
- Factors increasing probability
- Risk factors to mitigate

Use markdown formatting and provide actionable insights."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert sales qualification specialist."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.6,
            max_tokens=1800
        )
        
        result = response.choices[0].message.content
        html_result = markdown2.markdown(result, extras=["tables", "fenced-code-blocks"])
        
        # Extract score for visualization
        import re
        score_match = re.search(r'Total Score:\s*(\d+)/100', result)
        score = int(score_match.group(1)) if score_match else 0
        
        add_activity('leadscore', {
            'name': data.get('name', ''),
            'company': data.get('company', '')
        }, f"Score: {score}/100")
        
        return jsonify({
            'success': True,
            'result': html_result,
            'score': score,
            'raw': result
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/activities')
def get_activities():
    return jsonify(session.get('activities', []))

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'MarketAI Suite',
        'version': '1.0.0',
        'ai_model': 'LLaMA 3.3 70B',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    # Ensure directories exist
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('static/assets', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    
    print("Starting MarketAI Suite...")
    print("Open your browser and visit:")
    print("1. http://localhost:5000 - Main application")
    print("2. http://localhost:5000/debug-static - Debug static files")
    print("3. http://localhost:5000/static/css/style.css - Direct CSS test")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
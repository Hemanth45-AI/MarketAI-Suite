# 🚀 MarketAI Suite

**MarketAI Suite** is an AI-powered marketing and sales toolkit that helps you generate campaigns, create personalized pitches, and score leads using advanced AI technology powered by Groq's LLaMA 3.3 70B model.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.1.2-green.svg)
![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## ✨ Features

### 📱 Campaign Generator
- Create comprehensive marketing campaigns tailored to your product and audience
- Multi-platform strategy (Social Media, Email, Content Marketing, etc.)
- Generate platform-specific content ideas and ad copy variations
- Includes tracking metrics and optimization suggestions

### 💼 Pitch Generator
- Generate personalized sales pitches for specific customers
- Industry-specific value propositions
- ROI justification and differentiators
- Ready-to-use email and LinkedIn templates

### 📊 Lead Scoring
- AI-powered lead qualification using BANT framework (Budget, Authority, Need, Timeline)
- Detailed scoring breakdown with actionable recommendations
- Conversion probability estimation
- Follow-up strategy suggestions

### 📈 Activity Dashboard
- Track all your generated campaigns, pitches, and lead scores
- Real-time activity feed
- Quick access to recent work

---

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **AI Model**: Groq LLaMA 3.3 70B Versatile
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Custom CSS with modern design
- **API**: RESTful API endpoints

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** ([Download Python](https://www.python.org/downloads/))
- **pip** (Python package manager - comes with Python)
- **Groq API Key** ([Get your free API key](https://console.groq.com/keys))

---

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
cd marketai-suite
```

### 2. Create a Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```env
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your_secret_key_here
FLASK_ENV=development
FLASK_DEBUG=1
```

**Important:** Replace `your_groq_api_key_here` with your actual Groq API key from [console.groq.com/keys](https://console.groq.com/keys)

To generate a secure `SECRET_KEY`, run:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 5. Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

---

## 🎯 Usage

### Campaign Generator
1. Navigate to **Campaign Generator** from the dashboard
2. Fill in the form:
   - Product/Service description
   - Target audience
   - Select platforms (Facebook, Instagram, LinkedIn, etc.)
   - Choose tone (Professional, Casual, Friendly, etc.)
   - Define your goal
3. Click **Generate Campaign**
4. Review your comprehensive marketing campaign with strategies, content ideas, and ad copy

### Pitch Generator
1. Navigate to **Pitch Generator**
2. Enter details:
   - Product/Service
   - Customer information
   - Industry and company size
   - Budget range
   - Customer challenges
3. Click **Generate Pitch**
4. Get a personalized sales pitch with elevator pitch, value proposition, and email templates

### Lead Scoring
1. Navigate to **Lead Score**
2. Fill in lead information:
   - Name and company
   - Role and budget
   - Business need and urgency
   - Timeline and decision makers
3. Click **Score Lead**
4. Receive a detailed score (0-100) with breakdown and recommendations

---

## 📁 Project Structure

```
marketai-suite/
│
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (create this)
├── README.md              # This file
│
├── static/                # Static assets
│   ├── css/
│   │   ├── style.css      # Main stylesheet
│   │   └── dashboard.css  # Dashboard styles
│   ├── js/
│   │   └── main.js        # JavaScript functionality
│   └── assets/            # Images and other assets
│
└── templates/             # HTML templates
    ├── index.html         # Dashboard/Home page
    ├── campaign.html      # Campaign generator
    ├── pitch.html         # Pitch generator
    └── leadscore.html     # Lead scoring
```

---

## 🔧 API Endpoints

### Campaign Generation
```http
POST /api/generate/campaign
Content-Type: application/json

{
  "product": "Your product description",
  "audience": "Target audience",
  "platforms": ["Facebook", "Instagram"],
  "tone": "professional",
  "goal": "increase awareness"
}
```

### Pitch Generation
```http
POST /api/generate/pitch
Content-Type: application/json

{
  "product": "Your product",
  "customer": "Customer name",
  "industry": "Industry",
  "company_size": "50-100",
  "budget": "$10k-$50k",
  "challenges": "Customer challenges"
}
```

### Lead Scoring
```http
POST /api/score/lead
Content-Type: application/json

{
  "name": "Lead name",
  "company": "Company name",
  "role": "Decision maker role",
  "budget": "Budget range",
  "need": "Business need",
  "urgency": "High/Medium/Low",
  "timeline": "Timeline",
  "decision_makers": "Decision maker info",
  "challenges": "Current challenges"
}
```

### Health Check
```http
GET /api/health
```

### Get Activities
```http
GET /api/activities
```

---

## 🐛 Troubleshooting

### Issue: "Invalid API Key" Error (401)

**Solution:**
1. Verify your Groq API key is correct in the `.env` file
2. Get a new API key from [console.groq.com/keys](https://console.groq.com/keys)
3. Ensure the `.env` file is named correctly (not `.env.txt`)
4. Restart the Flask application after updating the `.env` file

### Issue: Static Files Not Loading

**Solution:**
1. Visit `http://localhost:5000/debug-static` to test static file loading
2. Ensure the `static/` folder structure is correct
3. Clear browser cache and hard refresh (Ctrl+F5)

### Issue: Module Not Found Errors

**Solution:**
```bash
pip install -r requirements.txt --upgrade
```

### Issue: Port Already in Use

**Solution:**
Change the port in `app.py` (line 432):
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Changed from 5000 to 5001
```

---

## 🔐 Security Notes

- **Never commit your `.env` file** to version control
- Keep your Groq API key confidential
- Use strong `SECRET_KEY` values in production
- Set `FLASK_DEBUG=0` in production environments

---

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GROQ_API_KEY` | Your Groq API key | ✅ Yes | None |
| `SECRET_KEY` | Flask secret key for sessions | ✅ Yes | `dev-secret-key` |
| `FLASK_ENV` | Environment (development/production) | ❌ No | `development` |
| `FLASK_DEBUG` | Enable debug mode (1/0) | ❌ No | `1` |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Groq** for providing the LLaMA 3.3 70B AI model
- **Flask** for the web framework
- All open-source contributors

---

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [Groq Documentation](https://console.groq.com/docs)
3. Open an issue on the project repository

---

## 🎉 Getting Started Checklist

- [ ] Python 3.8+ installed
- [ ] Virtual environment created and activated
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] `.env` file created with valid Groq API key
- [ ] Application running on `http://localhost:5000`
- [ ] Tested campaign generation
- [ ] Tested pitch generation
- [ ] Tested lead scoring

---

**Made with ❤️ using AI-powered technology**

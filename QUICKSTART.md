# 🚀 Quick Start Guide - MarketAI Suite

## 5-Minute Setup

### Step 1: Get Your Groq API Key (2 minutes)
1. Visit [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up or log in
3. Click "Create API Key"
4. Copy your new API key

### Step 2: Configure Environment (1 minute)
1. Open the `.env` file in the project folder
2. Replace `your_groq_api_key_here` with your actual API key
3. Save the file

### Step 3: Install Dependencies (1 minute)
Open terminal/command prompt in the project folder and run:
```bash
pip install -r requirements.txt
```

### Step 4: Run the Application (1 minute)
```bash
python app.py
```

### Step 5: Open in Browser
Visit: [http://localhost:5000](http://localhost:5000)

---

## 🎯 First Use

### Try the Campaign Generator:
1. Click "Campaign Generator"
2. Enter:
   - **Product**: "AI-powered CRM software"
   - **Audience**: "Small business owners"
   - **Platforms**: Select "LinkedIn" and "Email"
   - **Tone**: "Professional"
   - **Goal**: "Generate leads"
3. Click "Generate Campaign"
4. Watch the AI create your marketing campaign!

---

## ⚠️ Common Issues

### "Invalid API Key" Error
- **Fix**: Update your `.env` file with a valid Groq API key
- Get a new key at [console.groq.com/keys](https://console.groq.com/keys)

### "Module Not Found" Error
- **Fix**: Run `pip install -r requirements.txt`

### Port Already in Use
- **Fix**: Close other applications using port 5000, or change the port in `app.py`

---

## 📚 Need More Help?

See the full [README.md](README.md) for detailed documentation.

---

**Happy Marketing! 🎉**

# 📡 API Documentation - MarketAI Suite

## Base URL
```
http://localhost:5000
```

---

## Endpoints

### 1. Health Check

**GET** `/api/health`

Check if the API is running and get service information.

**Response:**
```json
{
  "status": "healthy",
  "service": "MarketAI Suite",
  "version": "1.0.0",
  "ai_model": "LLaMA 3.3 70B",
  "timestamp": "2026-01-31T11:37:08.123456"
}
```

---

### 2. Generate Marketing Campaign

**POST** `/api/generate/campaign`

Generate a comprehensive marketing campaign using AI.

**Request Body:**
```json
{
  "product": "AI-powered CRM software",
  "audience": "Small business owners aged 30-50",
  "platforms": ["Facebook", "LinkedIn", "Email"],
  "tone": "professional",
  "goal": "increase awareness"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product` | string | Yes | Product or service description |
| `audience` | string | Yes | Target audience description |
| `platforms` | array | Yes | Marketing platforms (Facebook, Instagram, LinkedIn, Twitter, Email, Content Marketing, Video Marketing) |
| `tone` | string | Yes | Campaign tone (professional, casual, friendly, authoritative, playful) |
| `goal` | string | Yes | Campaign goal (increase awareness, generate leads, drive sales, build community, educate market) |

**Response:**
```json
{
  "success": true,
  "result": "<html formatted campaign>",
  "raw": "## 🎯 CAMPAIGN OBJECTIVES\n- Objective 1\n..."
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

### 3. Generate Sales Pitch

**POST** `/api/generate/pitch`

Generate a personalized sales pitch for a specific customer.

**Request Body:**
```json
{
  "product": "AI-powered CRM software",
  "customer": "John Doe, CEO of TechCorp",
  "industry": "Technology",
  "company_size": "50-100 employees",
  "budget": "$10,000 - $50,000",
  "challenges": "Manual data entry, poor lead tracking, no automation"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product` | string | Yes | Product or service name |
| `customer` | string | Yes | Customer name and role |
| `industry` | string | Yes | Customer's industry |
| `company_size` | string | Yes | Company size range |
| `budget` | string | Yes | Budget range |
| `challenges` | string | Yes | Customer's current challenges |

**Response:**
```json
{
  "success": true,
  "result": "<html formatted pitch>",
  "raw": "## 🎯 30-SECOND ELEVATOR PITCH\n..."
}
```

---

### 4. Score Lead

**POST** `/api/score/lead`

Score and qualify a sales lead using BANT framework.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "company": "Acme Corp",
  "role": "VP of Sales",
  "budget": "$50,000 - $100,000",
  "need": "Need better sales automation and reporting",
  "urgency": "High - Q1 implementation required",
  "timeline": "Decision in 2-4 weeks",
  "decision_makers": "VP Sales, CTO, CFO involved",
  "challenges": "Current system is outdated, manual processes"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Lead's name |
| `company` | string | Yes | Company name |
| `role` | string | Yes | Lead's role/title |
| `budget` | string | Yes | Available budget |
| `need` | string | Yes | Business need description |
| `urgency` | string | Yes | Urgency level |
| `timeline` | string | Yes | Decision timeline |
| `decision_makers` | string | Yes | Decision maker information |
| `challenges` | string | Yes | Current challenges |

**Response:**
```json
{
  "success": true,
  "result": "<html formatted score>",
  "score": 85,
  "raw": "## 📊 LEAD SCORECARD\nTotal Score: 85/100\n..."
}
```

---

### 5. Get Activities

**GET** `/api/activities`

Retrieve all user activities (campaigns, pitches, lead scores).

**Response:**
```json
[
  {
    "type": "campaign",
    "data": {
      "product": "AI CRM",
      "platforms": ["LinkedIn", "Email"]
    },
    "preview": "Create a comprehensive marketing campaign...",
    "timestamp": "2026-01-31T11:37:08.123456",
    "id": 1
  }
]
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid API key |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting is implemented. This is a development version.

---

## Authentication

The API uses Groq API key authentication configured in the `.env` file. No user authentication is required for local development.

---

## Example Usage

### Using cURL

**Generate Campaign:**
```bash
curl -X POST http://localhost:5000/api/generate/campaign \
  -H "Content-Type: application/json" \
  -d '{
    "product": "AI CRM",
    "audience": "Small businesses",
    "platforms": ["LinkedIn"],
    "tone": "professional",
    "goal": "generate leads"
  }'
```

### Using JavaScript (Fetch)

```javascript
const response = await fetch('http://localhost:5000/api/generate/campaign', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    product: 'AI CRM',
    audience: 'Small businesses',
    platforms: ['LinkedIn'],
    tone: 'professional',
    goal: 'generate leads'
  })
});

const data = await response.json();
console.log(data);
```

### Using Python (Requests)

```python
import requests

url = 'http://localhost:5000/api/generate/campaign'
payload = {
    'product': 'AI CRM',
    'audience': 'Small businesses',
    'platforms': ['LinkedIn'],
    'tone': 'professional',
    'goal': 'generate leads'
}

response = requests.post(url, json=payload)
print(response.json())
```

---

## Response Format

All successful responses follow this structure:
```json
{
  "success": true,
  "result": "<formatted HTML content>",
  "raw": "Raw markdown content",
  "score": 85  // Only for lead scoring
}
```

All error responses:
```json
{
  "success": false,
  "error": "Error description"
}
```

---

## Notes

- All endpoints return JSON responses
- HTML content is generated from markdown using markdown2
- The AI model used is Groq's LLaMA 3.3 70B Versatile
- Response times vary based on AI processing (typically 2-10 seconds)

---

**For more information, see the main [README.md](README.md)**

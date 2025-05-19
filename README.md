# 🌿 Environmental Impact Analyzer

> **Live Demo:** [https://lens2199.github.io/environmental-impact-analyzer](https://lens2199.github.io/environmental-impact-analyzer)

An AI-powered full-stack web application that helps users evaluate the environmental impact of consumer products based on their materials, manufacturing, transportation, and end-of-life practices.

---

## ✨ Features

♻️ **Product Search** – Browse and filter by name, category, or material  
📊 **AI-Powered Analysis** – Get detailed sustainability scores using OpenAI  
📉 **Impact Breakdown** – Scores for:
- Carbon Footprint  
- Water Usage  
- Resource Consumption  
🆚 **Product Comparison** – Compare eco-scores side-by-side  
💡 **Improvement Suggestions** – AI recommends more sustainable choices  

---

## 🖼️ Screenshots

### 🔰 Home Page
![Home](./frontend/src/assets/hometab%202.png)

### 🔍 Product Search
![Product Search](./frontend/src/assets/productsearchtap%202.png)

### 📈 Analyze Impact
![Analyzer](./frontend/src/assets/analazertap%202.png)

### 🆚 Compare Products
![Compare](./frontend/src/assets/comparasontap%202.png)

## 🧠 How It Works

The app analyzes product data (text descriptions, materials, supply chain info) using an OpenAI-powered prompt. Based on sustainability best practices and lifecycle factors, it returns a JSON with category scores and a summary.

---

## 🏗️ Architecture


[ React (Frontend) ] --> [ Express (API) ] --> [ Supabase (Postgres) ]
↓
[ OpenAI GPT (Analysis) ]


- **Frontend**: React + Material UI, Chart.js for data visualization
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API (GPT-4)
- **Hosting**: GitHub Pages (frontend) + Render (backend)

---

## ⚙️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai)
![Chart.js](https://img.shields.io/badge/Chart.js-F5788D?style=for-the-badge&logo=chartdotjs)

---

## 🧪 Local Development

### 🔧 Prerequisites
- Node.js 16+
- Supabase account
- OpenAI API Key

### 🚀 Setup

```bash
git clone https://github.com/Lens2199/environmental-impact-analyzer.git
cd environmental-impact-analyzer

cd frontend
npm install
# .env
REACT_APP_API_URL=http://localhost:5010/api
REACT_APP_USE_MOCK_DATA=true
npm start

cd ../backend
npm install
# .env
PORT=5010
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_api_key
CORS_ORIGIN=http://localhost:3000
npm start

| Service      | URL          |
| ------------ | ------------ |
| **Frontend** | GitHub Pages |
| **Backend**  | Render       |
| **Database** | Supabase     |

📊 API Endpoints
Products API
GET /api/products – List products

GET /api/products/:id – Get product by ID

GET /api/products/search/:query – Search products

Analysis API
POST /api/analysis/analyze-text – Analyze from text

POST /api/analysis/analyze-product/:id – Analyze by product ID

POST /api/analysis/compare – Compare multiple products

GET /api/analysis/history – Get user analysis history

📝 License
MIT

🙏 Acknowledgements
OpenAI – AI Analysis

Supabase – Database + Auth

Material UI – Design system

Chart.js – Data visualization


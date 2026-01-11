# WikiCap

WikiCap is a web application that lets you enter any year and fetch nostalgic data such as news, top music and popular movies.
The results are presented in an artsy, interactive timeline.

---

## Table of Contents

- [Background](#background)
- [Functions](#functions)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Get Started](#get-started)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Run Locally](#run-locally)
- [Enviroment Variables](#enviroment-variables)
- [Troubleshooting](#troubleshooting)

---

## Background

WikiCap is a projekt in making a REST API for a mashup site.
It works as an small "year recap machine" fetching multiple sources of data in to one response

---

## Functions

Depending on the year, WikiCap fetches and renders:

- **Notable events & year context** (Wikipedia)
- **Nobel prize winners** (Wikipedia)
- **Top music and artistists** (artists / tracks via Last.fm and Spotify)
- **Popular movies and series** (via TMDB)
- **Oscars awards** (Via TheAward API)

---

## Tech Stack

### Backend

- **Python** – FastAPI (API layer / data aggregation)
- **Node.js** - For tailwind
- **httpx** (HTTP client)
- **BeautifulSoup4** (HTML parsing/scraping where needed)
- **python-dotenv** (environment variables)
- **Jinja2** (templating if used for HTML responses)

### Backend dependencies

- fastapi==0.115.0
- uvicorn[standard]==0.30.0
- python-dotenv==1.0.1
- jinja2==3.1.4
- httpx==0.27.0
- pydantic==2.10.6
- beautifulsoup4==4.12.3

### Frontend

- HTML
- CSS – Tailwind CSS
- JavaScript – Vanilla JS

### External APIs

- Wikipedia API – for notable events & general info
- Last.fm API – for top tracks / artists by year
- TMDB API – for popular movies by year
- Theawards API - for Academy awards
- Spotify API - for top tracks / artists by year

---

## Project Structure

```text
.
├── .venv/
├── .envScriptsactivate
├── backend/
│   ├── __pycache__/
│   ├── app/
│   │   ├── __pycache__/
│   │   ├── api/
│   │   ├── clients/
│   │   ├── core/
│   │   ├── services/
│   │   ├── tests/
│   │   ├── utils/
│   │   ├── __init__.py
│   │   └── main.py
│   ├── README.md
│   ├── __init__.py
│   ├── .env
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── dist/
│   ├── node_modules/
│   ├── src/
│   │   ├── css/
│   │   ├── img/
│   │   ├── img 2/
│   │   ├── JS/
│   │   ├── logo/
│   │   └── logo 2/
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
└── .gitignore
```

---

## Get Started

### Requirements

#### Python Version: Ensure you have [Python](https://www.python.org/downloads/) 3.10 or higher installed. Check your version by running:

   ```bash
   python3 --version
   ```
   or
   ```bash
   python --version
   ```

#### **Node and Npm**

  ```bash
  node --version
  npm --version
  ```

---

## Installation

## 1. **Clone repository**

git clone <your-repo-url>
cd <your-repo-folder>

## 2. **Create Backend and activate Venv**

### MacOS / Linux

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

### **Windows**

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate.ps1
```

## 3. **Install backend dependencies**

```bash
pip install -r requirements.txt
```

---

## 4. **Create your .env file in the backend folder**

Create `backend/.env` and add your API keys.
Create backend/.env and add your API keys [See Enviorment Variables](#enviroment-variables)


---

## 5. **Install frontend dependencies**

```bash
cd frontend
npm install
```

## 6. **Compile Tailwind**

```bash
npx tailwindcss \
  -i frontend/src/css/input.css \
  -o frontend/dist/output.css \
  --watch
```
---

## 7. **Run locally**

**Start the FastAPI server**

```bash
cd backend
uvicorn app.main:app --reload
```

---

## 8. **Enviroment Variables**

#### Create ´backend/.env``

# Last.fm
LASTFM_API_KEY=YOUR_LASTFM_KEY

# TMDB
TMDB_API_KEY=YOUR_TMDB_KEY


Notes:

-Wikipedia endpoints usually don’t require an API key.

-Keep .env out of git (add it to .gitignore).

---
## 9. **Troubleshooting**

**Open your frontend (depending on your setup):**

**If you use a static HTML file: open frontend/index.html**

**Or if you use a dev server: follow the URL printed in the terminal**

---

# InvestIQ — Intelligent Equity & Portfolio Architecture

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-8ea86f.svg)](LICENSE)

> **InvestIQ** is a modern, high-precision stock watchlist, trade execution ledger, and portfolio intelligence platform. Built with an enterprise-grade **FastAPI + PostgreSQL** backend and a luxury **Gen-Z aesthetic minimalist React** frontend inspired by dark obsidian velvet and muted sage green typography.

---

## 🌟 Key Features

- **3-Second Animated Splash Engine**: Dynamic intro loader displaying the InvestIQ circular emblem and a smooth glowing progress bar before gracefully transitioning to the workspace.
- **Real-Time Portfolio Accounting**: Computes real-time valuation, net invested capital, unrealized P&L, and returns using **Weighted Average Cost Basis** across historical BUY and SELL executions.
- **Resilient Market Intelligence (Alpha Vantage)**: Live ticker search, spot quotes, and 100-day historical trend charts with an **in-memory TTL cache & fallback engine** to prevent API rate-limit exhaustion.
- **Interactive SIP Wealth Growth Engine**: Simulates compound growth ($FV = P \times \frac{(1+r)^n - 1}{r} \times (1+r)$) with interactive horizon and yield sliders paired with Recharts area projections.
- **Selective Watchlists**: Track high-conviction equities with quick-action links to charts and instant order executions.
- **Trade Execution Ledger**: Comprehensive audit trail for all order fills with date, volume, and pricing records.
- **Security & Session Persistence**: Secure JWT Bearer token authentication, bcrypt password hashing, and clean session restoration.
- **Luxury Editorial Dark Aesthetic**: Custom obsidian `#08090a` theme with olive/sage `#8ea86f` accents, glassmorphism cards, and Poppins / Playfair Display typography.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Client (React 18 + Vite)"]
        UI["Obsidian UI & Pages (Dashboard, Search, SIP)"]
        SPLASH["3-Second Intro Loader Engine"]
        CLIENT_API["Native Fetch API Client (Bearer Token)"]
    end

    subgraph Backend["Backend API (FastAPI)"]
        ROUTERS["API v1 Routers (Auth, Portfolio, Market, SIP)"]
        SEC["JWT Security & Auth Middleware"]
        CACHE["In-Memory TTL Cache & Fallback"]
        MATH["Portfolio & SIP Math Services"]
    end

    subgraph External["External Services & DB"]
        AV["Alpha Vantage API (Quotes & History)"]
        PG[("PostgreSQL Database (Alembic Migrations)")]
    end

    UI --> CLIENT_API
    SPLASH --> UI
    CLIENT_API --> ROUTERS
    ROUTERS --> SEC
    ROUTERS --> MATH
    ROUTERS --> CACHE
    CACHE <--> AV
    SEC --> PG
    MATH --> PG
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database ORM**: SQLAlchemy 2.0 (Mapped Declarative)
- **Database**: PostgreSQL with UUID primary keys
- **Schema & Validation**: Pydantic v2
- **Migrations**: Alembic
- **Security**: Passlib (bcrypt) + python-jose (JWT)
- **HTTP Client**: HTTPX (async-ready requests with timeout safeguards)

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Data Visualization**: Recharts (Custom Sage Green Gradient Area Charts)
- **Styling**: Vanilla CSS Design System with Glassmorphism, CSS Variables, and Google Fonts (*Poppins* & *Playfair Display*)
- **State Management**: React Context (`AuthContext`)

---

## 📁 Project Structure

```
InvestIQ/
├── backend/
│   ├── alembic/                 # Database migration scripts
│   ├── app/
│   │   ├── api/v1/              # FastAPI route endpoints
│   │   │   ├── auth.py          # User registration & login
│   │   │   ├── dashboard.py     # Aggregated workspace summary
│   │   │   ├── market.py        # Alpha Vantage proxy endpoints
│   │   │   ├── portfolio.py     # Portfolio holdings & valuation
│   │   │   ├── sip.py           # Compound interest simulation
│   │   │   ├── stocks.py        # Stock master catalogue
│   │   │   ├── transactions.py  # BUY / SELL executions
│   │   │   └── watchlist.py     # Saved tickers
│   │   ├── core/                # Configuration & JWT security
│   │   ├── db/                  # Database engine & session maker
│   │   ├── models/              # SQLAlchemy database models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Business logic, caching & market math
│   │   └── main.py              # Application entry point & CORS
│   ├── alembic.ini              # Alembic configuration
│   ├── requirements.txt         # Backend Python dependencies
│   └── .env                     # Backend environment secrets
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, ProtectedRoute, SplashScreen
│   │   ├── context/             # AuthContext provider
│   │   ├── pages/               # 8 Core application pages
│   │   ├── services/            # Native fetch API client
│   │   ├── utils/               # Auth storage & currency formatters
│   │   ├── App.jsx              # Main routing & splash orchestration
│   │   ├── index.css            # Obsidian & Sage Green design system
│   │   └── main.jsx             # React DOM entry
│   ├── index.html               # HTML shell & Google Fonts imports
│   ├── package.json             # NPM dependencies & scripts
│   ├── vite.config.js           # Vite build configuration
│   └── .env.example             # Frontend environment example
│
└── README.md                    # Project documentation
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: v18 or higher (with `npm`)
- **PostgreSQL**: Running instance with a database created (e.g. `investiq`)

---

### 2. Backend Setup

1. **Navigate to backend and create virtual environment**:
   ```bash
   cd backend
   python -m venv venv
   ```

2. **Activate the virtual environment**:
   - **Windows**:
     ```powershell
     .\venv\Scripts\activate
     ```
   - **Linux / macOS**:
     ```bash
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure `.env`**:
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/investiq
   SECRET_KEY=your_super_secret_jwt_key_here
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
   ```

5. **Run database migrations**:
   ```bash
   alembic upgrade head
   ```

6. **Start FastAPI development server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *The interactive Swagger documentation will be available at `http://localhost:8000/docs`.*

---

### 3. Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install NPM packages**:
   ```bash
   npm install
   ```

3. **Configure environment (Optional)**:
   Create a `.env` file (or copy from `.env.example`):
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

4. **Start Vite development server**:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173` in your browser.*

---

## 📡 REST API Reference

| Method | Endpoint | Description | Protected |
|---|---|---|:---:|
| `POST` | `/api/v1/auth/register` | Register a new investor account | No |
| `POST` | `/api/v1/auth/login` | Authenticate and obtain JWT access token | No |
| `GET` | `/api/v1/auth/me` | Fetch active user profile from token | Yes |
| `GET` | `/api/v1/dashboard/` | Portfolio aggregates, watchlist count & recent trades | Yes |
| `GET` | `/api/v1/portfolio/` | Detailed holdings with live quotes & unrealized P&L | Yes |
| `GET` | `/api/v1/stocks/` | List all tracked equity securities in master table | Yes |
| `POST` | `/api/v1/stocks/` | Register or lookup a security ticker | Yes |
| `GET` | `/api/v1/watchlist/` | Retrieve personal watchlist | Yes |
| `POST` | `/api/v1/watchlist/` | Save a security to watchlist | Yes |
| `DELETE`| `/api/v1/watchlist/{id}` | Remove a security from watchlist | Yes |
| `GET` | `/api/v1/transactions/` | View audited historical trade ledger | Yes |
| `POST` | `/api/v1/transactions/` | Record a new BUY or SELL execution | Yes |
| `GET` | `/api/v1/market/search` | Search tickers by keyword (cached) | No |
| `GET` | `/api/v1/market/{sym}/quote` | Get live spot pricing (cached / resilient) | No |
| `GET` | `/api/v1/market/{sym}/history` | Get 100-day historical time series for charts | No |
| `POST` | `/api/v1/sip/calculate` | Calculate compound future value for SIP | No |

---

## 🎨 Design Philosophy

InvestIQ embraces an **editorial, dark-mode minimalist aesthetic**:
- **Palette**: Deep matte obsidian `#08090a` velvet surfaces paired with an organic olive/sage `#8ea86f` highlight.
- **Typography Pairing**: *Poppins* provides crisp, geometric clarity for financial numbers and dense data grids, while italicized *Playfair Display* brings editorial elegance to key hero statements and metrics.
- **Micro-Interactions**: Subtle glassmorphism borders (`rgba(255, 255, 255, 0.08)`), glowing status indicators, and responsive pill-style buttons.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.


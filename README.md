# Trading Journal

A modern trading journal to track, analyze, and improve your trading performance.

## ✨ Features

- **Trade Management**: Add, close, delete trades with smart exit logic
- **Trading Checklist**: Quality assessment with A-D grading system
- **Analytics Dashboard**: P&L charts, win rate, max drawdown, grade distribution
- **Lot Size Support**: Flexible sizing for different markets
- **Real-time Updates**: Instant trade updates with React Query
- **Light/Dark Mode**: Complete theme switching with persistent user preferences
- **Advanced Metrics**: Comprehensive performance analytics and trade quality scoring

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + React Query
- **Backend**: FastAPI + PostgreSQL + Docker

## 🚀 Quick Start

1. **Backend** (FastAPI)

   ```bash
   cd backend
   # Create .env file with database configuration
   # See backend/.env.example for required variables
   docker-compose up -d
   ```

2. **Frontend** (React)

   ```bash
   cd frontend/trading-journal-frontend
   npm install
   npm run dev
   ```

3. **Open**: http://localhost:3000

## ⚙️ Configuration

### Backend Environment Variables

The backend requires a `.env` file in the `backend/` directory with the following variables:

```env
DATABASE__HOST=db
DATABASE__PORT=5432
DATABASE__NAME=app_db
DATABASE__USER=postgres
DATABASE__PASSWORD=password
API__TITLE=Trading Journal API
API__VERSION=1.0.0
API__PREFIX=/api/v1
API__DEBUG=true
LOG_LEVEL=INFO
RUN_MIGRATIONS_ON_STARTUP=true
```

**Note**: The `.env` file is required for the backend to start properly.

## 📁 Structure

```
trading-journal/
├── backend/          # FastAPI + PostgreSQL
└── frontend/         # React + Vite
```

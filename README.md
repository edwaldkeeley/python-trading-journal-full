# Trading Journal

A modern trading journal to track, analyze, and improve your trading performance.

## ✨ Features

- **Trade Management**: Add, close, delete trades with smart exit logic
- **Trading Checklist**: Quality assessment with A-D grading system
- **Analytics Dashboard**: P&L charts, win rate, max drawdown, grade distribution
- **Lot Size Support**: Flexible sizing for different markets
- **Real-time Updates**: Instant trade updates with React Query

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + React Query
- **Backend**: FastAPI + PostgreSQL + Docker

## 🚀 Quick Start

1. **Backend** (FastAPI)
   ```bash
   cd backend
   docker-compose up -d
   ```

2. **Frontend** (React)
   ```bash
   cd frontend/trading-journal-frontend
   npm install
   npm run dev
   ```

3. **Open**: http://localhost:3000

## 📁 Structure

```
trading-journal/
├── backend/          # FastAPI + PostgreSQL
└── frontend/         # React + Vite
```

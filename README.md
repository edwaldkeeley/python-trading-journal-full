# 📈 Trading Journal

A full-stack trading journal built with React and FastAPI to track and analyze trading performance.

## Features

- **Trade Management**: Add, close, and delete trades with validation
- **Trading Checklist**: 6-point quality assessment with smart grading
- **Analytics**: P&L charts, win rate, max drawdown, grade distribution
- **Lot Size Support**: Different lot sizes for stocks, crypto, forex
- **Pagination**: Handle large datasets efficiently

## Tech Stack

- **Backend**: FastAPI + PostgreSQL + Docker
- **Frontend**: React 19 + Vite + React Query

## Quick Start

1. **Start backend**
   ```bash
   cd backend
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Start frontend**
   ```bash
   cd frontend/trading-journal-frontend
   npm install
   npm run dev
   ```

3. **Access**: http://localhost:3000

## Project Structure

```
trading-journal/
├── backend/          # FastAPI backend
└── frontend/         # React frontend
```

Built for traders who want data-driven insights.
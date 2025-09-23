import React from 'react'
import Header from '../Layout/Header'
import SummaryCards from '../Layout/SummaryCards'
import { useTrades } from '../../hooks/useTrades'
import { TopSymbolsWidget, PerformanceOverviewWidget } from '../Dashboard'

const DashboardPage = ({ onAddTrade, onGenerateData, onClearAll }) => {
  const { data: tradesData = { trades: [] } } = useTrades()
  const trades = tradesData.trades || []

  // Calculate stats properly
  const openTrades = trades.filter((trade) => trade.status === 'open')
  const closedTrades = trades.filter((trade) => trade.status === 'closed')
  const winningTrades = closedTrades.filter((trade) => (trade.pnl || 0) > 0)
  const losingTrades = closedTrades.filter((trade) => (trade.pnl || 0) < 0)

  const stats = {
    totalTrades: trades.length,
    openTrades: openTrades.length,
    closedTrades: closedTrades.length,
    totalPnL: trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0),
    winRate:
      closedTrades.length > 0
        ? (winningTrades.length / closedTrades.length) * 100
        : 0,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
  }

  return (
    <div className="page-content">
      <Header
        onAddTrade={onAddTrade}
        onGenerateData={onGenerateData}
        onClearAll={onClearAll}
      />
      <SummaryCards stats={stats} />

      <div className="dashboard-grid">
        <div className="dashboard-row">
          <TopSymbolsWidget trades={trades} />
          <PerformanceOverviewWidget trades={trades} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

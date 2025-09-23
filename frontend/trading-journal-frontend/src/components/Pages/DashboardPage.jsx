import React from 'react'
import Header from '../Layout/Header'
import SummaryCards from '../Layout/SummaryCards'
import { useTrades } from '../../hooks/useTrades'

const DashboardPage = ({ onAddTrade, onGenerateData, onClearAll }) => {
  const { data: tradesData = { trades: [] } } = useTrades()
  const trades = tradesData.trades || []

  const stats = {
    totalTrades: trades.length,
    openTrades: trades.filter((trade) => trade.status === 'open').length,
    closedTrades: trades.filter((trade) => trade.status === 'closed').length,
    totalPnL: trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0),
  }

  return (
    <div className="page-content">
      <Header
        onAddTrade={onAddTrade}
        onGenerateData={onGenerateData}
        onClearAll={onClearAll}
      />
      <SummaryCards stats={stats} />
    </div>
  )
}

export default DashboardPage

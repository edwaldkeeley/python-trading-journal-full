import React from 'react'

const SummaryCards = ({ stats }) => {
  // Convert win rate to decimal if it's a string percentage
  const winRate =
    typeof stats.winRate === 'string'
      ? parseFloat(stats.winRate) / 100
      : stats.winRate

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <h3>Total Trades</h3>
        <p className="number">{stats.totalTrades}</p>
      </div>
      <div className="summary-card">
        <h3>Open Positions</h3>
        <p className="number">{stats.openTrades}</p>
      </div>
      <div className="summary-card">
        <h3>Closed Trades</h3>
        <p className="number">{stats.closedTrades}</p>
      </div>
      <div className="summary-card">
        <h3>Total P&L</h3>
        <p
          className={`number ${stats.totalPnL >= 0 ? 'positive' : 'negative'}`}
        >
          ${stats.totalPnL.toFixed(2)}
        </p>
      </div>
      <div className="summary-card">
        <h3>Win Rate</h3>
        <p className="number">{(winRate * 100).toFixed(1)}%</p>
      </div>
    </div>
  )
}

export default SummaryCards

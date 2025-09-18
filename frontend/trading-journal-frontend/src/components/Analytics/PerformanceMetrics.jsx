import React from 'react'

const PerformanceMetrics = ({ analytics }) => {
  // Convert win rate to decimal if it's a string percentage
  const winRate =
    typeof analytics.winRate === 'string'
      ? parseFloat(analytics.winRate) / 100
      : analytics.winRate

  return (
    <div className="analytics-card">
      <h3>Performance Metrics</h3>

      <div className="metrics-section">
        <div className="metric">
          <span className="label">Win Rate:</span>
          <span className={`value ${winRate >= 0.5 ? 'positive' : 'negative'}`}>
            {(winRate * 100).toFixed(1)}%
          </span>
        </div>
        <div className="metric">
          <span className="label">Total P&L:</span>
          <span
            className={`value ${
              analytics.totalPnL >= 0 ? 'positive' : 'negative'
            }`}
          >
            ${analytics.totalPnL.toFixed(2)}
          </span>
        </div>
        <div className="metric">
          <span className="label">Avg Win:</span>
          <span className="value positive">${analytics.avgWin.toFixed(2)}</span>
        </div>
        <div className="metric">
          <span className="label">Avg Loss:</span>
          <span className="value negative">
            ${analytics.avgLoss.toFixed(2)}
          </span>
        </div>
        <div className="metric">
          <span className="label">Max Drawdown:</span>
          <span className="value negative">
            ${analytics.maxDrawdown.toFixed(2)}
          </span>
        </div>
        <div className="metric">
          <span className="label">Total Trades:</span>
          <span className="value">{analytics.totalTrades}</span>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMetrics

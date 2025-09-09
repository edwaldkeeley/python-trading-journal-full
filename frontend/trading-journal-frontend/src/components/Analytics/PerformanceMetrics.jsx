import React, { useState } from 'react'

const PerformanceMetrics = ({ analytics }) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Calculate advanced metrics
  const calculateAdvancedMetrics = () => {
    const {
      totalPnL,
      avgWin,
      avgLoss,
      maxDrawdown,
      closedTrades,
      totalTrades,
    } = analytics

    // Profit Factor
    const grossProfit =
      analytics.avgWin * (analytics.winRate / 100) * closedTrades
    const grossLoss =
      Math.abs(analytics.avgLoss) *
      ((100 - analytics.winRate) / 100) *
      closedTrades
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0

    // Risk-Reward Ratio
    const riskRewardRatio =
      Math.abs(analytics.avgLoss) > 0
        ? Math.abs(analytics.avgWin) / Math.abs(analytics.avgLoss)
        : 0

    // Expectancy
    const expectancy =
      (analytics.winRate / 100) * analytics.avgWin +
      ((100 - analytics.winRate) / 100) * analytics.avgLoss

    // Recovery Factor
    const recoveryFactor =
      Math.abs(totalPnL) > 0 && Math.abs(maxDrawdown) > 0
        ? Math.abs(totalPnL) / Math.abs(maxDrawdown)
        : 0

    // Average Trade Duration (simplified - would need actual trade data)
    const avgTradeDuration = 1 // Placeholder

    // Sharpe Ratio (simplified - would need risk-free rate and standard deviation)
    const sharpeRatio = 0 // Placeholder

    // Sortino Ratio (simplified)
    const sortinoRatio = 0 // Placeholder

    // Calmar Ratio
    const calmarRatio =
      Math.abs(maxDrawdown) > 0 ? totalPnL / Math.abs(maxDrawdown) : 0

    return {
      profitFactor,
      riskRewardRatio,
      expectancy,
      recoveryFactor,
      avgTradeDuration,
      sharpeRatio,
      sortinoRatio,
      calmarRatio,
    }
  }

  const advancedMetrics = calculateAdvancedMetrics()

  const getMetricColor = (value, type = 'default') => {
    if (type === 'ratio') {
      if (value >= 2) return 'excellent'
      if (value >= 1.5) return 'good'
      if (value >= 1) return 'fair'
      return 'poor'
    }
    if (type === 'percentage') {
      if (value >= 70) return 'excellent'
      if (value >= 60) return 'good'
      if (value >= 50) return 'fair'
      return 'poor'
    }
    if (type === 'pnl') {
      return value >= 0 ? 'positive' : 'negative'
    }
    return 'default'
  }

  const getMetricGrade = (value, type = 'default') => {
    const color = getMetricColor(value, type)
    const grades = {
      excellent: 'A+',
      good: 'B+',
      fair: 'C+',
      poor: 'D+',
      positive: 'A+',
      negative: 'F',
    }
    return grades[color] || 'N/A'
  }

  return (
    <div className="analytics-card">
      <div className="metrics-header">
        <h3>Performance Metrics</h3>
        <button
          className="toggle-advanced-btn"
          onClick={() => setShowAdvanced(!showAdvanced)}
          title={
            showAdvanced ? 'Hide advanced metrics' : 'Show advanced metrics'
          }
        >
          {showAdvanced ? '−' : '+'}
        </button>
      </div>

      {/* Basic Metrics */}
      <div className="metrics-section">
        <div className="metric">
          <span className="label">Win Rate:</span>
          <span
            className={`value ${getMetricColor(
              analytics.winRate,
              'percentage'
            )}`}
          >
            {analytics.winRate}%
            <span className="metric-grade">
              {getMetricGrade(analytics.winRate, 'percentage')}
            </span>
          </span>
        </div>
        <div className="metric">
          <span className="label">Total P&L:</span>
          <span
            className={`value ${getMetricColor(analytics.totalPnL, 'pnl')}`}
          >
            ${analytics.totalPnL.toFixed(2)}
            <span className="metric-grade">
              {getMetricGrade(analytics.totalPnL, 'pnl')}
            </span>
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
      </div>

      {/* Advanced Metrics */}
      {showAdvanced && (
        <div className="advanced-metrics">
          <h4>Advanced Metrics</h4>
          <div className="metrics-grid">
            <div className="metric">
              <span className="label">Profit Factor:</span>
              <span
                className={`value ${getMetricColor(
                  advancedMetrics.profitFactor,
                  'ratio'
                )}`}
              >
                {advancedMetrics.profitFactor.toFixed(2)}
                <span className="metric-grade">
                  {getMetricGrade(advancedMetrics.profitFactor, 'ratio')}
                </span>
              </span>
            </div>
            <div className="metric">
              <span className="label">Risk-Reward Ratio:</span>
              <span
                className={`value ${getMetricColor(
                  advancedMetrics.riskRewardRatio,
                  'ratio'
                )}`}
              >
                {advancedMetrics.riskRewardRatio.toFixed(2)}
                <span className="metric-grade">
                  {getMetricGrade(advancedMetrics.riskRewardRatio, 'ratio')}
                </span>
              </span>
            </div>
            <div className="metric">
              <span className="label">Expectancy:</span>
              <span
                className={`value ${getMetricColor(
                  advancedMetrics.expectancy,
                  'pnl'
                )}`}
              >
                ${advancedMetrics.expectancy.toFixed(2)}
                <span className="metric-grade">
                  {getMetricGrade(advancedMetrics.expectancy, 'pnl')}
                </span>
              </span>
            </div>
            <div className="metric">
              <span className="label">Recovery Factor:</span>
              <span
                className={`value ${getMetricColor(
                  advancedMetrics.recoveryFactor,
                  'ratio'
                )}`}
              >
                {advancedMetrics.recoveryFactor.toFixed(2)}
                <span className="metric-grade">
                  {getMetricGrade(advancedMetrics.recoveryFactor, 'ratio')}
                </span>
              </span>
            </div>
            <div className="metric">
              <span className="label">Calmar Ratio:</span>
              <span
                className={`value ${getMetricColor(
                  advancedMetrics.calmarRatio,
                  'ratio'
                )}`}
              >
                {advancedMetrics.calmarRatio.toFixed(2)}
                <span className="metric-grade">
                  {getMetricGrade(advancedMetrics.calmarRatio, 'ratio')}
                </span>
              </span>
            </div>
            <div className="metric">
              <span className="label">Total Trades:</span>
              <span className="value">{analytics.totalTrades}</span>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="performance-summary">
            <h5>Performance Summary</h5>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Overall Grade:</span>
                <span
                  className={`summary-value ${getMetricColor(
                    analytics.winRate,
                    'percentage'
                  )}`}
                >
                  {getMetricGrade(analytics.winRate, 'percentage')}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Risk Level:</span>
                <span
                  className={`summary-value ${getMetricColor(
                    advancedMetrics.recoveryFactor,
                    'ratio'
                  )}`}
                >
                  {advancedMetrics.recoveryFactor >= 2
                    ? 'Low'
                    : advancedMetrics.recoveryFactor >= 1
                    ? 'Medium'
                    : 'High'}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Consistency:</span>
                <span
                  className={`summary-value ${getMetricColor(
                    advancedMetrics.profitFactor,
                    'ratio'
                  )}`}
                >
                  {advancedMetrics.profitFactor >= 2
                    ? 'High'
                    : advancedMetrics.profitFactor >= 1.5
                    ? 'Medium'
                    : 'Low'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PerformanceMetrics

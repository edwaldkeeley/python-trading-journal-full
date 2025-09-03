import React from 'react';

const PerformanceMetrics = ({ analytics }) => {
  return (
    <div className="analytics-card">
      <h3>Performance Metrics</h3>
      <div className="metric">
        <span className="label">Win Rate:</span>
        <span className="value">{analytics.winRate}%</span>
      </div>
      <div className="metric">
        <span className="label">Total P&L:</span>
        <span className={`value ${analytics.totalPnL >= 0 ? 'positive' : 'negative'}`}>
          ${analytics.totalPnL.toFixed(2)}
        </span>
      </div>
      <div className="metric">
        <span className="label">Avg Win:</span>
        <span className="value positive">${analytics.avgWin.toFixed(2)}</span>
      </div>
      <div className="metric">
        <span className="label">Avg Loss:</span>
        <span className="value negative">${analytics.avgLoss.toFixed(2)}</span>
      </div>
      <div className="metric">
        <span className="label">Max Drawdown:</span>
        <span className="value negative">${analytics.maxDrawdown.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PerformanceMetrics;

import React from 'react';

const Analytics = ({ trades }) => {
    // Generate SVG path for line chart
  const generateLinePath = (months, monthlyPnL) => {
    if (months.length < 2) return '';

    const maxValue = Math.max(...Object.values(monthlyPnL).map(Math.abs));
    if (maxValue === 0) return '';

    let path = '';
    months.forEach((month, index) => {
      const x = 30 + (index / (months.length - 1)) * 240;
      const y = 100 - ((monthlyPnL[month] / maxValue) * 50);

      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  };

  // Calculate analytics data
  const calculateAnalytics = () => {
    if (!trades || trades.length === 0) return null;

    const closedTrades = trades.filter(trade => trade.is_closed);
    const openTrades = trades.filter(trade => !trade.is_closed);

    // Monthly P&L data
    const monthlyPnL = {};
    closedTrades.forEach(trade => {
      const month = new Date(trade.exit_time).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      monthlyPnL[month] = (monthlyPnL[month] || 0) + (trade.pnl || 0);
    });

    // Win/Loss analysis
    const winningTrades = closedTrades.filter(trade => trade.pnl > 0);
    const losingTrades = closedTrades.filter(trade => trade.pnl < 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length * 100).toFixed(1) : 0;

    // Average P&L
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length : 0;

    // Risk metrics
    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

    // Calculate true max drawdown (peak-to-trough)
    let maxDrawdown = 0;
    if (closedTrades.length > 0) {
      // Sort trades by exit time to get chronological order
      const sortedTrades = [...closedTrades].sort((a, b) => new Date(a.exit_time) - new Date(b.exit_time));

      let runningBalance = 0;
      let peak = 0;
      let maxDrawdownValue = 0;

      sortedTrades.forEach(trade => {
        runningBalance += (trade.pnl || 0);

        // Update peak if we hit a new high
        if (runningBalance > peak) {
          peak = runningBalance;
        }

        // Calculate drawdown from current peak
        const drawdown = peak - runningBalance;
        if (drawdown > maxDrawdownValue) {
          maxDrawdownValue = drawdown;
        }
      });

      maxDrawdown = maxDrawdownValue;
    }

    // Grade distribution
    const gradeDistribution = {};
    trades.forEach(trade => {
      const grade = trade.checklist_grade || 'No Grade';
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
    });

    // Calculate grade statistics
    const totalGradedTrades = trades.filter(t => t.checklist_grade).length;
    const aGrades = trades.filter(t => t.checklist_grade && t.checklist_grade.startsWith('A')).length;
    const bGrades = trades.filter(t => t.checklist_grade && t.checklist_grade.startsWith('B')).length;
    const cGrades = trades.filter(t => t.checklist_grade && t.checklist_grade.startsWith('C')).length;
    const dGrades = trades.filter(t => t.checklist_grade && t.checklist_grade.startsWith('D')).length;
    const noGrades = trades.filter(t => !t.checklist_grade).length;

    return {
      monthlyPnL,
      winRate,
      avgWin,
      avgLoss,
      totalPnL,
      maxDrawdown,
      totalTrades: trades.length,
      closedTrades: closedTrades.length,
      openTrades: openTrades.length,
      gradeDistribution,
      totalGradedTrades,
      aGrades,
      bGrades,
      cGrades,
      dGrades,
      noGrades
    };
  };

  const analytics = calculateAnalytics();

  if (!analytics) {
    return (
      <div className="analytics-section">
        <h2>Analytics</h2>
        <p>No trades available for analysis.</p>
      </div>
    );
  }

  const months = Object.keys(analytics.monthlyPnL).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });

  return (
    <div className="analytics-section">
      <h2>Analytics & Performance</h2>

      <div className="analytics-grid">
        {/* Performance Metrics */}
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

                {/* Monthly P&L Chart */}
        <div className="analytics-card">
          <h3>Monthly P&L</h3>
          <div className="monthly-chart">
            <svg className="line-chart" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              <line x1="0" y1="100" x2="300" y2="100" stroke="#e9ecef" strokeWidth="1" strokeDasharray="3,3"/>
              <line x1="0" y1="50" x2="300" y2="50" stroke="#e9ecef" strokeWidth="1" strokeDasharray="3,3"/>
              <line x1="0" y1="150" x2="300" y2="150" stroke="#e9ecef" strokeWidth="1" strokeDasharray="3,3"/>

              {/* Y-axis labels */}
              <text x="5" y="105" fontSize="10" fill="#6c757d">$0</text>
              <text x="5" y="55" fontSize="10" fill="#6c757d">$+</text>
              <text x="5" y="155" fontSize="10" fill="#6c757d">$-</text>

              {/* Line chart */}
              {months.length > 1 && (
                <path
                  className="line-path"
                  d={generateLinePath(months, analytics.monthlyPnL)}
                  fill="none"
                  stroke="#3498db"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {months.map((month, index) => {
                const x = 30 + (index / (months.length - 1)) * 240;
                const maxValue = Math.max(...Object.values(analytics.monthlyPnL).map(Math.abs));
                const y = 100 - ((analytics.monthlyPnL[month] / maxValue) * 50);

                return (
                  <g key={month}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill={analytics.monthlyPnL[month] >= 0 ? "#27ae60" : "#e74c3c"}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y="190"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#6c757d"
                      fontWeight="500"
                    >
                      {month}
                    </text>
                    <text
                      x={x}
                      y={y > 100 ? y - 15 : y + 20}
                      textAnchor="middle"
                      fontSize="10"
                      fill={analytics.monthlyPnL[month] >= 0 ? "#27ae60" : "#e74c3c"}
                      fontWeight="600"
                    >
                      ${analytics.monthlyPnL[month].toFixed(0)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Trade Distribution */}
        <div className="analytics-card">
          <h3>Trade Distribution</h3>
          <div className="distribution-chart">
            <div className="pie-chart">
              <div className="pie-segment closed" style={{
                transform: `rotate(${analytics.closedTrades / analytics.totalTrades * 360}deg)`
              }}></div>
              <div className="pie-segment open" style={{
                transform: `rotate(${analytics.openTrades / analytics.totalTrades * 360}deg)`
              }}></div>
            </div>
            <div className="legend">
              <div className="legend-item">
                <span className="legend-color closed"></span>
                <span>Closed: {analytics.closedTrades}</span>
              </div>
              <div className="legend-item">
                <span className="legend-color open"></span>
                <span>Open: {analytics.openTrades}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="analytics-card">
          <h3>Grade Distribution</h3>
          <div className="grade-stats">
            <div className="grade-metric">
              <span className="grade-label">A Grades:</span>
              <span className="grade-value a-grade">{analytics.aGrades}</span>
              <span className="grade-percentage">
                ({analytics.totalTrades > 0 ? ((analytics.aGrades / analytics.totalTrades) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="grade-metric">
              <span className="grade-label">B Grades:</span>
              <span className="grade-value b-grade">{analytics.bGrades}</span>
              <span className="grade-percentage">
                ({analytics.totalTrades > 0 ? ((analytics.bGrades / analytics.totalTrades) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="grade-metric">
              <span className="grade-label">C Grades:</span>
              <span className="grade-value c-grade">{analytics.cGrades}</span>
              <span className="grade-percentage">
                ({analytics.totalTrades > 0 ? ((analytics.cGrades / analytics.totalTrades) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="grade-metric">
              <span className="grade-label">D Grades:</span>
              <span className="grade-value d-grade">{analytics.dGrades}</span>
              <span className="grade-percentage">
                ({analytics.totalTrades > 0 ? ((analytics.dGrades / analytics.totalTrades) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="grade-metric">
              <span className="grade-label">No Grade:</span>
              <span className="grade-value no-grade">{analytics.noGrades}</span>
              <span className="grade-percentage">
                ({analytics.totalTrades > 0 ? ((analytics.noGrades / analytics.totalTrades) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
          <div className="grade-summary">
            <div className="summary-item">
              <span className="summary-label">Graded Trades:</span>
              <span className="summary-value">{analytics.totalGradedTrades}/{analytics.totalTrades}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

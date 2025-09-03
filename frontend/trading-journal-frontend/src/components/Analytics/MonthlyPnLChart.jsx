import React from 'react';

const MonthlyPnLChart = ({ monthlyPnL }) => {
  // Generate SVG path for line chart
  const generateLinePath = (months, monthlyPnL) => {
    if (months.length === 0) return '';

    let path = '';
    months.forEach((month, index) => {
      // Safety check for x coordinate calculation
      const x = months.length <= 1 ? 200 : 40 + (index / (months.length - 1)) * 320;

      // Safety check for maxValue calculation
      const values = Object.values(monthlyPnL).map(Math.abs);
      const maxValue = values.length > 0 ? Math.max(...values) : 1;

      // Safety check for y coordinate calculation
      const y = maxValue === 0 ? 150 : 150 - ((monthlyPnL[month] / maxValue) * 100);

      // Additional safety check to ensure coordinates are valid numbers
      const safeX = isNaN(x) || !isFinite(x) ? 200 : x;
      const safeY = isNaN(y) || !isFinite(y) ? 150 : y;

      if (index === 0) {
        path += `M ${safeX} ${safeY}`;
      } else {
        path += ` L ${safeX} ${safeY}`;
      }
    });

    return path;
  };

  const months = Object.keys(monthlyPnL).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });

  // Safety check: ensure all values are valid numbers
  const validMonthlyPnL = {};
  Object.keys(monthlyPnL).forEach(month => {
    const value = monthlyPnL[month];
    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
      validMonthlyPnL[month] = value;
    } else {
      validMonthlyPnL[month] = 0;
    }
  });

  return (
    <div className="analytics-card">
      <h3>Monthly P&L</h3>
      <div className="monthly-chart">
        {months.length === 0 ? (
          <div className="no-data-message">
            <p>No trade data available for monthly P&L chart</p>
          </div>
        ) : (
          <svg className="line-chart" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          <line x1="0" y1="150" x2="400" y2="150" stroke="#e9ecef" strokeWidth="1" strokeDasharray="3,3"/>
          <line x1="0" y1="100" x2="400" y2="100" stroke="#e9ecef" strokeWidth="1" strokeDasharray="3,3"/>
          <line x1="0" y1="200" x2="400" y2="200" stroke="#e9ecef" strokeWidth="1" strokeDasharray="3,3"/>

          {/* Y-axis labels */}
          <text x="8" y="155" fontSize="12" fill="#6c757d">$0</text>
          <text x="8" y="105" fontSize="12" fill="#6c757d">$+</text>
          <text x="8" y="205" fontSize="12" fill="#6c757d">$-</text>

          {/* Line chart */}
          {months.length > 0 && (
            <path
              className="line-path"
              d={generateLinePath(months, validMonthlyPnL)}
              fill="none"
              stroke="#3498db"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data points */}
          {months.map((month, index) => {
            // Safety check for x coordinate calculation
            const x = months.length <= 1 ? 200 : 40 + (index / (months.length - 1)) * 320;

            // Safety check for maxValue calculation
            const values = Object.values(validMonthlyPnL).map(Math.abs);
            const maxValue = values.length > 0 ? Math.max(...values) : 1;

            // Safety check for y coordinate calculation
            const y = maxValue === 0 ? 150 : 150 - ((validMonthlyPnL[month] / maxValue) * 100);

            // Additional safety check to ensure coordinates are valid numbers
            const safeX = isNaN(x) || !isFinite(x) ? 200 : x;
            const safeY = isNaN(y) || !isFinite(y) ? 150 : y;

            return (
              <g key={month}>
                <circle
                  cx={safeX}
                  cy={safeY}
                  r="5"
                  fill={validMonthlyPnL[month] >= 0 ? "#27ae60" : "#e74c3c"}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={safeX}
                  y="280"
                  textAnchor="middle"
                  fontSize="13"
                  fill="#6c757d"
                  fontWeight="500"
                >
                  {month}
                </text>
                <text
                  x={safeX}
                  y={safeY > 150 ? safeY - 20 : safeY + 25}
                  textAnchor="middle"
                  fontSize="12"
                  fill={validMonthlyPnL[month] >= 0 ? "#27ae60" : "#e74c3c"}
                  fontWeight="600"
                >
                  ${validMonthlyPnL[month].toFixed(0)}
                </text>
              </g>
            );
          })}
        </svg>
        )}
      </div>
    </div>
  );
};

export default MonthlyPnLChart;

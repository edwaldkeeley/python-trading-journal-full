import React, { useState, useEffect } from 'react'

const MonthlyPnLChart = ({ monthlyPnL }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [animationProgress, setAnimationProgress] = useState(0)

  // Generate SVG path for line chart with animation support
  const generateLinePath = (months, monthlyPnL, progress = 1) => {
    if (months.length === 0) return ''

    let path = ''
    const totalPoints = months.length
    const visiblePoints = Math.ceil(totalPoints * progress)

    months.slice(0, visiblePoints).forEach((month, index) => {
      // Safety check for x coordinate calculation
      const x =
        months.length <= 1 ? 200 : 40 + (index / (months.length - 1)) * 320

      // Safety check for maxValue calculation
      const values = Object.values(monthlyPnL).map(Math.abs)
      const maxValue = values.length > 0 ? Math.max(...values) : 1

      // Safety check for y coordinate calculation
      const y =
        maxValue === 0 ? 150 : 150 - (monthlyPnL[month] / maxValue) * 100

      // Additional safety check to ensure coordinates are valid numbers
      const safeX = isNaN(x) || !isFinite(x) ? 200 : x
      const safeY = isNaN(y) || !isFinite(y) ? 150 : y

      if (index === 0) {
        path += `M ${safeX} ${safeY}`
      } else {
        path += ` L ${safeX} ${safeY}`
      }
    })

    return path
  }

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1)
    }, 100)
    return () => clearTimeout(timer)
  }, [monthlyPnL])

  const months = Object.keys(monthlyPnL).sort((a, b) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA - dateB
  })

  // Safety check: ensure all values are valid numbers
  const validMonthlyPnL = {}
  Object.keys(monthlyPnL).forEach((month) => {
    const value = monthlyPnL[month]
    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
      validMonthlyPnL[month] = value
    } else {
      validMonthlyPnL[month] = 0
    }
  })

  return (
    <div className="analytics-card">
      <h3>Monthly P&L</h3>
      <div className="monthly-chart">
        {months.length === 0 ? (
          <div className="no-data-message">
            <p>No trade data available for monthly P&L chart</p>
          </div>
        ) : (
          <svg
            className="line-chart"
            viewBox="0 0 400 300"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines with animation */}
            <line
              x1="0"
              y1="150"
              x2="400"
              y2="150"
              stroke="var(--border-color, #e9ecef)"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <line
              x1="0"
              y1="100"
              x2="400"
              y2="100"
              stroke="var(--border-color, #e9ecef)"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <line
              x1="0"
              y1="200"
              x2="400"
              y2="200"
              stroke="var(--border-color, #e9ecef)"
              strokeWidth="1"
              strokeDasharray="3,3"
            />

            {/* Y-axis labels */}
            <text x="8" y="155" fontSize="12" fill="var(--text-muted, #6c757d)">
              $0
            </text>
            <text x="8" y="105" fontSize="12" fill="var(--text-muted, #6c757d)">
              $+
            </text>
            <text x="8" y="205" fontSize="12" fill="var(--text-muted, #6c757d)">
              $-
            </text>

            {/* Gradient definitions */}
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor="var(--accent-primary, #3498db)"
                  stopOpacity="0.8"
                />
                <stop
                  offset="100%"
                  stopColor="var(--accent-success, #27ae60)"
                  stopOpacity="0.8"
                />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Area under the curve */}
            {months.length > 0 && (
              <path
                d={`${generateLinePath(
                  months,
                  validMonthlyPnL,
                  animationProgress
                )} L ${
                  40 + ((months.length - 1) / (months.length - 1)) * 320
                } 150 L 40 150 Z`}
                fill="url(#lineGradient)"
                fillOpacity="0.1"
                className="area-path"
                style={{
                  transition: 'all 0.8s ease-in-out',
                  opacity: animationProgress,
                }}
              />
            )}

            {/* Line chart with animation */}
            {months.length > 0 && (
              <path
                className="line-path"
                d={generateLinePath(months, validMonthlyPnL, animationProgress)}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                style={{
                  transition: 'all 0.8s ease-in-out',
                  strokeDasharray: '1000',
                  strokeDashoffset: animationProgress === 1 ? '0' : '1000',
                  animation:
                    animationProgress === 1
                      ? 'drawLine 1.5s ease-in-out forwards'
                      : 'none',
                }}
              />
            )}

            {/* Data points with hover effects */}
            {months.map((month, index) => {
              // Safety check for x coordinate calculation
              const x =
                months.length <= 1
                  ? 200
                  : 40 + (index / (months.length - 1)) * 320

              // Safety check for maxValue calculation
              const values = Object.values(validMonthlyPnL).map(Math.abs)
              const maxValue = values.length > 0 ? Math.max(...values) : 1

              // Safety check for y coordinate calculation
              const y =
                maxValue === 0
                  ? 150
                  : 150 - (validMonthlyPnL[month] / maxValue) * 100

              // Additional safety check to ensure coordinates are valid numbers
              const safeX = isNaN(x) || !isFinite(x) ? 200 : x
              const safeY = isNaN(y) || !isFinite(y) ? 150 : y

              const isHovered = hoveredPoint === index
              const isVisible =
                index < Math.ceil(months.length * animationProgress)

              return (
                <g
                  key={month}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Hover area */}
                  <circle
                    cx={safeX}
                    cy={safeY}
                    r="15"
                    fill="transparent"
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ cursor: 'pointer' }}
                  />

                  {/* Data point */}
                  <circle
                    cx={safeX}
                    cy={safeY}
                    r={isHovered ? '8' : '5'}
                    fill={
                      validMonthlyPnL[month] >= 0
                        ? 'var(--accent-success, #27ae60)'
                        : 'var(--accent-danger, #e74c3c)'
                    }
                    stroke="var(--bg-primary, white)"
                    strokeWidth="2"
                    style={{
                      transition: 'all 0.3s ease',
                      filter: isHovered
                        ? 'drop-shadow(0 0 8px rgba(52, 152, 219, 0.6))'
                        : 'none',
                    }}
                  />

                  {/* Month labels */}
                  <text
                    x={safeX}
                    y="280"
                    textAnchor="middle"
                    fontSize="13"
                    fill="var(--text-muted, #6c757d)"
                    fontWeight="500"
                  >
                    {month}
                  </text>

                  {/* Value labels - only show on hover */}
                  {isHovered && (
                    <g>
                      <rect
                        x={safeX - 25}
                        y={safeY > 150 ? safeY - 35 : safeY + 15}
                        width="50"
                        height="20"
                        fill="var(--bg-secondary, #f8f9fa)"
                        stroke="var(--border-color, #dee2e6)"
                        strokeWidth="1"
                        rx="4"
                      />
                      <text
                        x={safeX}
                        y={safeY > 150 ? safeY - 20 : safeY + 30}
                        textAnchor="middle"
                        fontSize="11"
                        fill={
                          validMonthlyPnL[month] >= 0
                            ? 'var(--accent-success, #27ae60)'
                            : 'var(--accent-danger, #e74c3c)'
                        }
                        fontWeight="600"
                      >
                        ${validMonthlyPnL[month].toFixed(0)}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        )}
      </div>
    </div>
  )
}

export default MonthlyPnLChart

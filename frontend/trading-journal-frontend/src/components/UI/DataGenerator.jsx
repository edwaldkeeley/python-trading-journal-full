import React, { useState } from 'react'
import useModalAnimation from '../../hooks/useModalAnimation'
import {
  generateTradeData,
  generateScenarios,
} from '../../utils/tradeDataGenerator'

const DataGenerator = ({ onGenerateTrades, isOpen, onClose }) => {
  const { isClosing, handleClose } = useModalAnimation(onClose)

  const [scenario, setScenario] = useState('profitable')
  const [customOptions, setCustomOptions] = useState({
    totalTrades: 50,
    closedTradesRatio: 0.85,
    winRate: 0.65,
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const scenarios = [
    {
      key: 'profitable',
      name: 'Profitable Trader',
      description: 'High win rate, many closed trades',
    },
    {
      key: 'struggling',
      name: 'Struggling Trader',
      description: 'Low win rate, high volatility',
    },
    {
      key: 'breakeven',
      name: 'Break-even Trader',
      description: '50% win rate, moderate performance',
    },
    {
      key: 'newbie',
      name: 'New Trader',
      description: 'Few trades, learning phase',
    },
    {
      key: 'experienced',
      name: 'Experienced Trader',
      description: 'Many trades, consistent performance',
    },
    {
      key: 'custom',
      name: 'Custom Scenario',
      description: 'Define your own parameters',
    },
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      let trades

      if (scenario === 'custom') {
        trades = generateTradeData(customOptions)
      } else {
        trades = generateScenarios[scenario]()
      }

      // Show progress for large datasets
      if (trades.length > 50) {
        // Simulate processing time for large datasets
        await new Promise((resolve) => setTimeout(resolve, 1500))
      } else {
        // Quick processing for smaller datasets
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      onGenerateTrades(trades)
      onClose()
    } catch (error) {
      console.error('Error generating trades:', error)
      alert('Error generating trades. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCustomOptionChange = (key, value) => {
    setCustomOptions((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }))
  }

  if (!isOpen) return null

  return (
    <div
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`modal data-generator-modal ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Generate Sample Trade Data</h2>
          <button
            className="btn btn-icon btn-sm"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="generator-section">
            <h3>Choose a Scenario</h3>
            <div className="scenario-grid">
              {scenarios.map((s) => (
                <div
                  key={s.key}
                  className={`scenario-card ${
                    scenario === s.key ? 'selected' : ''
                  }`}
                  onClick={() => setScenario(s.key)}
                >
                  <h4>{s.name}</h4>
                  <p>{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {scenario === 'custom' && (
            <div className="generator-section">
              <h3>Custom Parameters</h3>
              <div className="custom-options">
                <div className="form-group">
                  <label>Total Trades</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={customOptions.totalTrades}
                    onChange={(e) =>
                      handleCustomOptionChange('totalTrades', e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Closed Trades Ratio</label>
                  <input
                    type="number"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={customOptions.closedTradesRatio}
                    onChange={(e) =>
                      handleCustomOptionChange(
                        'closedTradesRatio',
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Win Rate</label>
                  <input
                    type="number"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={customOptions.winRate}
                    onChange={(e) =>
                      handleCustomOptionChange('winRate', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <div className="generator-section">
            <h3>What Will Be Generated</h3>
            <ul className="feature-list">
              <li>
                Realistic trade data with various symbols (EURUSD, GBPUSD, etc.)
              </li>
              <li>Both buy and sell trades with proper P&L calculations</li>
              <li>Checklist scores and grades based on performance</li>
              <li>Entry and exit times spanning the last 90 days</li>
              <li>Take profit and stop loss levels for open trades</li>
              <li>Fees and realistic trading costs</li>
            </ul>

            {scenario !== 'custom' && (
              <div className="scenario-preview">
                <h4>
                  Preview: {scenarios.find((s) => s.key === scenario)?.name}
                </h4>
                <div className="preview-stats">
                  <div className="stat">
                    <span className="stat-label">Total Trades:</span>
                    <span className="stat-value">
                      {scenario === 'profitable'
                        ? '100'
                        : scenario === 'struggling'
                        ? '80'
                        : scenario === 'breakeven'
                        ? '60'
                        : scenario === 'newbie'
                        ? '20'
                        : scenario === 'experienced'
                        ? '200'
                        : '50'}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Win Rate:</span>
                    <span className="stat-value">
                      {scenario === 'profitable'
                        ? '75%'
                        : scenario === 'struggling'
                        ? '35%'
                        : scenario === 'breakeven'
                        ? '50%'
                        : scenario === 'newbie'
                        ? '40%'
                        : scenario === 'experienced'
                        ? '65%'
                        : '60%'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              'Generate Trades'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataGenerator

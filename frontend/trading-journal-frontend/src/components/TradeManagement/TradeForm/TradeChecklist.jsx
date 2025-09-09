import React from 'react'
import {
  calculateChecklistScore,
  getLetterGrade,
  getScoreClass,
  getScoreMessage,
} from './tradeFormUtils'

const TradeChecklist = ({ checklistData, onChecklistChange }) => {
  const score = calculateChecklistScore(checklistData)
  const grade = getLetterGrade(checklistData)
  const scoreClass = getScoreClass(checklistData)
  const scoreMessage = getScoreMessage(checklistData)

  const checklistItems = [
    {
      key: 'asianSession',
      label: 'Asian Session',
      description: 'Trading during Asian market hours',
    },
    {
      key: 'openLine',
      label: 'Open Line',
      description: 'Price near opening levels',
    },
    {
      key: 'fibo62',
      label: '62 Fibo',
      description: 'Price near 61.8% Fibonacci level',
    },
    {
      key: 'averageLine',
      label: 'Average Line',
      description: 'Price near moving average',
    },
    {
      key: 'movingAverage3',
      label: 'Moving Average 3',
      description: '3-period moving average signal',
    },
    {
      key: 'movingAverage4',
      label: 'Moving Average 4',
      description: '4-period moving average signal',
    },
  ]

  return (
    <div className="checklist-section">
      <h3>Trading Checklist</h3>
      <div className="checklist-items">
        {checklistItems.map((item) => (
          <div
            key={item.key}
            className={`checklist-item ${
              checklistData[item.key] ? 'checked' : ''
            }`}
            onClick={() => onChecklistChange(item.key)}
          >
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={checklistData[item.key]}
                onChange={() => onChecklistChange(item.key)}
              />
              <span className="checkmark"></span>
              <div className="checklist-content">
                <span className="checklist-label">{item.label}</span>
                <small className="checklist-description">
                  {item.description}
                </small>
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className={`score-display ${scoreClass}`}>
        <div className="score-header">
          <span className="score-label">Checklist Score:</span>
          <span className={`score-value ${scoreClass}`}>
            {grade} ({score}%)
          </span>
        </div>
        <div className="score-message">{scoreMessage}</div>
      </div>
    </div>
  )
}

export default TradeChecklist

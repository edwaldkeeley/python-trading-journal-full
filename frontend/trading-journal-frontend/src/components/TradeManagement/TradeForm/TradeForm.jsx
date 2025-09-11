import React, { useState } from 'react'
import TradeFormFields from './TradeFormFields'
import TradeChecklist from './TradeChecklist'
import RiskRewardDisplay from './RiskRewardDisplay'
import useModalAnimation from '../../../hooks/useModalAnimation'
import {
  validateTradePosition,
  calculateChecklistScore,
  getLetterGrade,
} from './tradeFormUtils'

const TradeForm = ({ isOpen, onClose, onSubmit, isLoading, error }) => {
  const { isClosing, handleClose } = useModalAnimation(onClose)

  const [formData, setFormData] = useState({
    symbol: '',
    side: 'buy',
    quantity: '',
    lot_size: '1',
    entry_price: '',
    stop_loss: '',
    take_profit: '',
    notes: '',
  })

  const [checklistData, setChecklistData] = useState({
    asianSession: false,
    openLine: false,
    fibo62: false,
    averageLine: false,
    movingAverage3: false,
    movingAverage4: false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleChecklistChange = (checklistItem) => {
    setChecklistData((prev) => ({
      ...prev,
      [checklistItem]: !prev[checklistItem],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (
      !formData.symbol ||
      !formData.quantity ||
      !formData.entry_price ||
      !formData.stop_loss ||
      !formData.take_profit
    ) {
      alert(
        'Please fill in all required fields including Stop Loss and Take Profit'
      )
      return
    }

    // Validate trade position logic
    const validation = validateTradePosition(formData)
    if (!validation.isValid) {
      alert(
        `❌ Invalid Trade Position:\n\n${validation.error}\n\nPlease correct your Stop Loss and Take Profit levels.`
      )
      return
    }

    try {
      // Include checklist data and grade in the trade submission
      const tradeData = {
        ...formData,
        checklist_grade: getLetterGrade(checklistData),
        checklist_score: calculateChecklistScore(checklistData),
        checklist_data: checklistData,
      }

      await onSubmit(tradeData)

      // Reset form and checklist
      setFormData({
        symbol: '',
        side: 'buy',
        quantity: '',
        lot_size: '1',
        entry_price: '',
        stop_loss: '',
        take_profit: '',
        notes: '',
      })
      setChecklistData({
        asianSession: false,
        openLine: false,
        fibo62: false,
        averageLine: false,
        movingAverage3: false,
        movingAverage4: false,
      })
      onClose()
    } catch (error) {
      // Error is handled by the mutation
      console.error('Error submitting trade:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`modal ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Add New Trade</h2>
          <button
            className="btn btn-icon btn-sm"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">Error: {error.message}</div>}

          <form className="trade-form" onSubmit={handleSubmit}>
            <TradeFormFields
              formData={formData}
              onInputChange={handleInputChange}
              isLoading={isLoading}
            />

            <RiskRewardDisplay formData={formData} />

            <TradeChecklist
              checklistData={checklistData}
              onChecklistChange={handleChecklistChange}
            />
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Trade'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TradeForm

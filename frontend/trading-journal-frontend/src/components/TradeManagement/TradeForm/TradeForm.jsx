import React, { useState, useEffect, useRef } from 'react'
import TradeFormFields from './TradeFormFields'
import TradeChecklist from './TradeChecklist'
import RiskRewardDisplay from './RiskRewardDisplay'
import useModalAnimation from '../../../hooks/useModalAnimation'
import { useScrollToModalError } from '../../../hooks/useScrollToTop'
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

  const [validationError, setValidationError] = useState('')
  const errorRef = useRef(null)

  // Scroll to modal top when there's an error
  useScrollToModalError(!!(error || validationError), '.modal')

  // Focus on error message when it appears
  useEffect(() => {
    if ((error || validationError) && errorRef.current) {
      // Small delay to ensure the error message is rendered
      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        })
      }, 100)
    }
  }, [error, validationError])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('')
    }
  }

  const handleChecklistChange = (checklistItem) => {
    setChecklistData((prev) => ({
      ...prev,
      [checklistItem]: !prev[checklistItem],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous validation errors
    setValidationError('')

    // Validate required fields
    if (
      !formData.symbol ||
      !formData.quantity ||
      !formData.entry_price ||
      !formData.stop_loss ||
      !formData.take_profit
    ) {
      setValidationError(
        'Please fill in all required fields including Stop Loss and Take Profit'
      )
      return
    }

    // Validate trade position logic
    const validation = validateTradePosition(formData)
    if (!validation.isValid) {
      setValidationError(validation.error)
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
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-trade-title"
    >
      <div
        className={`modal ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="add-trade-title">Add New Trade</h2>
          <button
            className="btn btn-icon btn-sm"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div ref={errorRef} className="error-message">
              Error: {error.message}
            </div>
          )}
          {validationError && (
            <div ref={errorRef} className="error-message">
              {validationError}
            </div>
          )}

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
            type="button"
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

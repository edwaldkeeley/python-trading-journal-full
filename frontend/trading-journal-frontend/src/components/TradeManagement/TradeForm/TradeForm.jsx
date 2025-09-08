import React, { useState } from 'react'
import TradeFormFields from './TradeFormFields'
import TradeChecklist from './TradeChecklist'
import RiskRewardDisplay from './RiskRewardDisplay'
import {
  validateTradePosition,
  calculateChecklistScore,
  getLetterGrade,
} from './tradeFormUtils'
import { useErrorHandler } from '../../../hooks/useErrorHandler'
import { ErrorMessage } from '../../UI'

const TradeForm = ({ isOpen, onClose, onSubmit, isLoading, error }) => {
  const {
    error: formError,
    clearError,
    executeWithErrorHandling,
  } = useErrorHandler()
  const [validationErrors, setValidationErrors] = useState({})

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

  const validateForm = () => {
    const errors = {}

    // Required field validation
    if (!formData.symbol.trim()) {
      errors.symbol = 'Symbol is required'
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      errors.quantity = 'Quantity must be greater than 0'
    }
    if (!formData.entry_price || parseFloat(formData.entry_price) <= 0) {
      errors.entry_price = 'Entry price must be greater than 0'
    }
    if (!formData.stop_loss || parseFloat(formData.stop_loss) <= 0) {
      errors.stop_loss = 'Stop loss must be greater than 0'
    }
    if (!formData.take_profit || parseFloat(formData.take_profit) <= 0) {
      errors.take_profit = 'Take profit must be greater than 0'
    }

    // Price relationship validation
    const entryPrice = parseFloat(formData.entry_price)
    const stopLoss = parseFloat(formData.stop_loss)
    const takeProfit = parseFloat(formData.take_profit)

    if (formData.side === 'buy') {
      if (stopLoss >= entryPrice) {
        errors.stop_loss = 'Stop loss must be below entry price for buy trades'
      }
      if (takeProfit <= entryPrice) {
        errors.take_profit =
          'Take profit must be above entry price for buy trades'
      }
    } else {
      if (stopLoss <= entryPrice) {
        errors.stop_loss = 'Stop loss must be above entry price for sell trades'
      }
      if (takeProfit >= entryPrice) {
        errors.take_profit =
          'Take profit must be below entry price for sell trades'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }

    // Clear form error when user makes changes
    if (formError) {
      clearError()
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
    clearError()

    // Client-side validation
    if (!validateForm()) {
      return
    }

    // Validate trade position logic
    const validation = validateTradePosition(formData)
    if (!validation.isValid) {
      setValidationErrors({
        stop_loss: validation.error.includes('Stop Loss')
          ? validation.error
          : null,
        take_profit: validation.error.includes('Take Profit')
          ? validation.error
          : null,
      })
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Trade</h2>

        {/* Display API errors */}
        {error && (
          <ErrorMessage
            error={error}
            onDismiss={clearError}
            showDetails={true}
          />
        )}

        {/* Display form validation errors */}
        {formError && (
          <ErrorMessage
            error={formError}
            onDismiss={clearError}
            showDetails={true}
          />
        )}

        <form className="trade-form" onSubmit={handleSubmit}>
          <TradeFormFields
            formData={formData}
            onInputChange={handleInputChange}
            isLoading={isLoading}
            validationErrors={validationErrors}
          />

          <RiskRewardDisplay formData={formData} />

          <TradeChecklist
            checklistData={checklistData}
            onChecklistChange={handleChecklistChange}
          />

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TradeForm

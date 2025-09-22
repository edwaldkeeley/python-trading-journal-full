import {
  validateTradePosition,
  calculateChecklistScore,
  getLetterGrade,
} from '../tradeFormUtils'

describe('tradeFormUtils', () => {
  describe('validateTradePosition', () => {
    test('validates buy trade with correct price levels', () => {
      const formData = {
        side: 'buy',
        entry_price: '1.0850',
        stop_loss: '1.0800',
        take_profit: '1.0900',
        lot_size: '1',
      }

      const result = validateTradePosition(formData)
      expect(result.isValid).toBe(true)
    })

    test('validates sell trade with correct price levels', () => {
      const formData = {
        side: 'sell',
        entry_price: '1.0850',
        stop_loss: '1.0900',
        take_profit: '1.0800',
        lot_size: '1',
      }

      const result = validateTradePosition(formData)
      expect(result.isValid).toBe(true)
    })

    test('rejects buy trade with stop loss above entry price', () => {
      const formData = {
        side: 'buy',
        entry_price: '1.0850',
        stop_loss: '1.0900', // Invalid: stop loss above entry for buy
        take_profit: '1.0900',
        lot_size: '1',
      }

      const result = validateTradePosition(formData)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Stop loss must be below entry price')
    })

    test('rejects sell trade with stop loss below entry price', () => {
      const formData = {
        side: 'sell',
        entry_price: '1.0850',
        stop_loss: '1.0800', // Invalid: stop loss below entry for sell
        take_profit: '1.0800',
        lot_size: '1',
      }

      const result = validateTradePosition(formData)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Stop loss must be above entry price')
    })

    test('rejects buy trade with take profit below entry price', () => {
      const formData = {
        side: 'buy',
        entry_price: '1.0850',
        stop_loss: '1.0800',
        take_profit: '1.0800', // Invalid: take profit below entry for buy
        lot_size: '1',
      }

      const result = validateTradePosition(formData)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Take profit must be above entry price')
    })

    test('rejects sell trade with take profit above entry price', () => {
      const formData = {
        side: 'sell',
        entry_price: '1.0850',
        stop_loss: '1.0900',
        take_profit: '1.0900', // Invalid: take profit above entry for sell
        lot_size: '1',
      }

      const result = validateTradePosition(formData)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Take profit must be below entry price')
    })

    test('rejects invalid lot size', () => {
      const formData = {
        side: 'buy',
        entry_price: '1.0850',
        stop_loss: '1.0800',
        take_profit: '1.0900',
        lot_size: '0', // Invalid: lot size must be > 0
      }

      const result = validateTradePosition(formData)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Lot size must be greater than 0')
    })

    test('rejects excessive lot size', () => {
      const formData = {
        side: 'buy',
        entry_price: '1.0850',
        stop_loss: '1.0800',
        take_profit: '1.0900',
        lot_size: '1000', // Invalid: exceeds max lot size
      }

      const result = validateTradePosition(formData)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Lot size cannot exceed')
    })
  })

  describe('calculateChecklistScore', () => {
    test('calculates score for empty checklist', () => {
      const checklistData = {
        asianSession: false,
        openLine: false,
        fibo62: false,
        averageLine: false,
        movingAverage3: false,
        movingAverage4: false,
      }

      const score = calculateChecklistScore(checklistData)
      expect(score).toBe(0)
    })

    test('calculates score for partial checklist', () => {
      const checklistData = {
        asianSession: true,
        openLine: true,
        fibo62: false,
        averageLine: false,
        movingAverage3: false,
        movingAverage4: false,
      }

      const score = calculateChecklistScore(checklistData)
      expect(score).toBe(2)
    })

    test('calculates score for complete checklist', () => {
      const checklistData = {
        asianSession: true,
        openLine: true,
        fibo62: true,
        averageLine: true,
        movingAverage3: true,
        movingAverage4: true,
      }

      const score = calculateChecklistScore(checklistData)
      expect(score).toBe(6)
    })
  })

  describe('getLetterGrade', () => {
    test('returns F for score 0', () => {
      const checklistData = {
        asianSession: false,
        openLine: false,
        fibo62: false,
        averageLine: false,
        movingAverage3: false,
        movingAverage4: false,
      }

      const grade = getLetterGrade(checklistData)
      expect(grade).toBe('F')
    })

    test('returns D for score 1-2', () => {
      const checklistData = {
        asianSession: true,
        openLine: true,
        fibo62: false,
        averageLine: false,
        movingAverage3: false,
        movingAverage4: false,
      }

      const grade = getLetterGrade(checklistData)
      expect(grade).toBe('D')
    })

    test('returns C for score 3-4', () => {
      const checklistData = {
        asianSession: true,
        openLine: true,
        fibo62: true,
        averageLine: true,
        movingAverage3: false,
        movingAverage4: false,
      }

      const grade = getLetterGrade(checklistData)
      expect(grade).toBe('C')
    })

    test('returns B for score 5', () => {
      const checklistData = {
        asianSession: true,
        openLine: true,
        fibo62: true,
        averageLine: true,
        movingAverage3: true,
        movingAverage4: false,
      }

      const grade = getLetterGrade(checklistData)
      expect(grade).toBe('B')
    })

    test('returns A for score 6', () => {
      const checklistData = {
        asianSession: true,
        openLine: true,
        fibo62: true,
        averageLine: true,
        movingAverage3: true,
        movingAverage4: true,
      }

      const grade = getLetterGrade(checklistData)
      expect(grade).toBe('A')
    })
  })
})


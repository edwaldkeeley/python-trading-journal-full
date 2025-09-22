import { generateSampleTrades } from '../tradeDataGenerator'

describe('tradeDataGenerator', () => {
  describe('generateSampleTrades', () => {
    test('generates correct number of trades', () => {
      const trades = generateSampleTrades(10)
      expect(trades).toHaveLength(10)
    })

    test('generates trades with required properties', () => {
      const trades = generateSampleTrades(5)

      trades.forEach((trade) => {
        expect(trade).toHaveProperty('id')
        expect(trade).toHaveProperty('symbol')
        expect(trade).toHaveProperty('side')
        expect(trade).toHaveProperty('quantity')
        expect(trade).toHaveProperty('lot_size')
        expect(trade).toHaveProperty('entry_price')
        expect(trade).toHaveProperty('stop_loss')
        expect(trade).toHaveProperty('take_profit')
        expect(trade).toHaveProperty('entry_time')
        expect(trade).toHaveProperty('checklist_grade')
        expect(trade).toHaveProperty('checklist_score')
        expect(trade).toHaveProperty('checklist_data')
        expect(trade).toHaveProperty('notes')
        expect(trade).toHaveProperty('fees')
      })
    })

    test('generates valid symbols', () => {
      const trades = generateSampleTrades(20)
      const symbols = trades.map((trade) => trade.symbol)

      // Check that all symbols are valid forex pairs
      const validSymbols = [
        'EURUSD',
        'GBPUSD',
        'USDJPY',
        'AUDUSD',
        'USDCAD',
        'NZDUSD',
        'USDCHF',
      ]
      symbols.forEach((symbol) => {
        expect(validSymbols).toContain(symbol)
      })
    })

    test('generates valid sides', () => {
      const trades = generateSampleTrades(20)
      const sides = trades.map((trade) => trade.side)

      sides.forEach((side) => {
        expect(['buy', 'sell']).toContain(side)
      })
    })

    test('generates valid quantities', () => {
      const trades = generateSampleTrades(20)

      trades.forEach((trade) => {
        expect(trade.quantity).toBeGreaterThan(0)
        expect(trade.quantity).toBeLessThanOrEqual(1000)
        expect(Number.isInteger(trade.quantity)).toBe(true)
      })
    })

    test('generates valid lot sizes', () => {
      const trades = generateSampleTrades(20)

      trades.forEach((trade) => {
        expect(trade.lot_size).toBeGreaterThan(0)
        expect(trade.lot_size).toBeLessThanOrEqual(10)
        expect(Number.isInteger(trade.lot_size)).toBe(true)
      })
    })

    test('generates valid entry prices', () => {
      const trades = generateSampleTrades(20)

      trades.forEach((trade) => {
        expect(trade.entry_price).toBeGreaterThan(0)
        expect(trade.entry_price).toMatch(/^\d+\.\d{4}$/) // 4 decimal places for forex
      })
    })

    test('generates valid stop loss and take profit prices', () => {
      const trades = generateSampleTrades(20)

      trades.forEach((trade) => {
        expect(trade.stop_loss).toBeGreaterThan(0)
        expect(trade.take_profit).toBeGreaterThan(0)
        expect(trade.stop_loss).toMatch(/^\d+\.\d{4}$/)
        expect(trade.take_profit).toMatch(/^\d+\.\d{4}$/)

        // For buy trades: stop loss < entry < take profit
        if (trade.side === 'buy') {
          expect(parseFloat(trade.stop_loss)).toBeLessThan(
            parseFloat(trade.entry_price)
          )
          expect(parseFloat(trade.entry_price)).toBeLessThan(
            parseFloat(trade.take_profit)
          )
        }

        // For sell trades: take profit < entry < stop loss
        if (trade.side === 'sell') {
          expect(parseFloat(trade.take_profit)).toBeLessThan(
            parseFloat(trade.entry_price)
          )
          expect(parseFloat(trade.entry_price)).toBeLessThan(
            parseFloat(trade.stop_loss)
          )
        }
      })
    })

    test('generates valid checklist grades', () => {
      const trades = generateSampleTrades(20)

      trades.forEach((trade) => {
        expect(['A', 'B', 'C', 'D', 'F']).toContain(trade.checklist_grade)
      })
    })

    test('generates valid checklist scores', () => {
      const trades = generateSampleTrades(20)

      trades.forEach((trade) => {
        expect(trade.checklist_score).toBeGreaterThanOrEqual(0)
        expect(trade.checklist_score).toBeLessThanOrEqual(6)
        expect(Number.isInteger(trade.checklist_score)).toBe(true)
      })
    })

    test('generates valid checklist data', () => {
      const trades = generateSampleTrades(20)

      trades.forEach((trade) => {
        expect(trade.checklist_data).toHaveProperty('asianSession')
        expect(trade.checklist_data).toHaveProperty('openLine')
        expect(trade.checklist_data).toHaveProperty('fibo62')
        expect(trade.checklist_data).toHaveProperty('averageLine')
        expect(trade.checklist_data).toHaveProperty('movingAverage3')
        expect(trade.checklist_data).toHaveProperty('movingAverage4')

        // All properties should be booleans
        Object.values(trade.checklist_data).forEach((value) => {
          expect(typeof value).toBe('boolean')
        })
      })
    })

    test('generates valid entry times', () => {
      const trades = generateSampleTrades(20)

      trades.forEach((trade) => {
        const entryTime = new Date(trade.entry_time)
        expect(entryTime).toBeInstanceOf(Date)
        expect(entryTime.getTime()).not.toBeNaN()
      })
    })

    test('generates valid fees', () => {
      const trades = generateSampleTrades(20)

      trades.forEach((trade) => {
        expect(trade.fees).toBeGreaterThan(0)
        expect(trade.fees).toBeLessThan(20)
        expect(typeof trade.fees).toBe('number')
      })
    })

    test('generates some closed trades', () => {
      const trades = generateSampleTrades(50)
      const closedTrades = trades.filter((trade) => trade.is_closed)

      // Should have some closed trades (not all open)
      expect(closedTrades.length).toBeGreaterThan(0)
      expect(closedTrades.length).toBeLessThan(50)
    })

    test('generates valid P&L for closed trades', () => {
      const trades = generateSampleTrades(50)
      const closedTrades = trades.filter((trade) => trade.is_closed)

      closedTrades.forEach((trade) => {
        expect(trade.pnl).not.toBeNull()
        expect(typeof trade.pnl).toBe('number')
        expect(trade.exit_price).not.toBeNull()
        expect(trade.exit_time).not.toBeNull()
        expect(trade.exit_reason).not.toBeNull()
        expect(['take_profit', 'stop_loss', 'manual']).toContain(
          trade.exit_reason
        )
      })
    })

    test('generates different trade data on multiple calls', () => {
      const trades1 = generateSampleTrades(10)
      const trades2 = generateSampleTrades(10)

      // Should generate different data (very high probability)
      const symbols1 = trades1.map((t) => t.symbol)
      const symbols2 = trades2.map((t) => t.symbol)

      expect(symbols1).not.toEqual(symbols2)
    })
  })
})


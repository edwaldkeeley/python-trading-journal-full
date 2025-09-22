import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TradesTable from '../TradesTable'

// Mock the modal components
vi.mock('../CloseTradeModal', () => ({
  default: ({ isOpen, trade, onClose, onSubmit }) =>
    isOpen ? (
      <div data-testid="close-trade-modal">
        <h2>Close Trade</h2>
        <p>Symbol: {trade?.symbol}</p>
        <button onClick={onClose}>Cancel</button>
        <button
          onClick={() => onSubmit({ tradeId: trade?.id, exitPrice: 1.09 })}
        >
          Close Trade
        </button>
      </div>
    ) : null,
}))

vi.mock('../DeleteTradeModal', () => ({
  default: ({ isOpen, trade, onClose, onConfirm }) =>
    isOpen ? (
      <div data-testid="delete-trade-modal">
        <h2>Delete Trade</h2>
        <p>Symbol: {trade?.symbol}</p>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Delete</button>
      </div>
    ) : null,
}))

vi.mock('../NotesModal', () => ({
  default: ({ isOpen, trade, onClose }) =>
    isOpen ? (
      <div data-testid="notes-modal">
        <h2>Trade Notes</h2>
        <p>Symbol: {trade?.symbol}</p>
        <p>Notes: {trade?.notes}</p>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}))

// Mock the Pagination component
vi.mock('../../UI/Pagination', () => ({
  Pagination: ({ currentPage, totalPages, onPageChange }) => (
    <div data-testid="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  ),
}))

describe('TradesTable', () => {
  const mockTrades = [
    {
      id: 1,
      symbol: 'EURUSD',
      side: 'buy',
      quantity: 100,
      lot_size: 1,
      entry_price: '1.0850',
      stop_loss: '1.0800',
      take_profit: '1.0900',
      exit_price: null,
      exit_time: null,
      pnl: null,
      is_closed: false,
      checklist_grade: 'A',
      notes: 'Test trade notes',
      entry_time: '2024-01-01T10:00:00Z',
      exit_reason: null,
    },
    {
      id: 2,
      symbol: 'GBPUSD',
      side: 'sell',
      quantity: 50,
      lot_size: 1,
      entry_price: '1.2700',
      stop_loss: '1.2750',
      take_profit: '1.2650',
      exit_price: '1.2650',
      exit_time: '2024-01-01T12:00:00Z',
      pnl: 25.0,
      is_closed: true,
      checklist_grade: 'B',
      notes: 'Closed trade notes',
      entry_time: '2024-01-01T11:00:00Z',
      exit_reason: 'take_profit',
    },
  ]

  const mockOnCloseTrade = vi.fn()
  const mockOnDeleteTrade = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders trades table with correct headers', () => {
    render(
      <TradesTable
        trades={mockTrades}
        onCloseTrade={mockOnCloseTrade}
        onDeleteTrade={mockOnDeleteTrade}
      />
    )

    expect(screen.getByText('Trade History')).toBeInTheDocument()
    expect(screen.getByText('Symbol')).toBeInTheDocument()
    expect(screen.getByText('Side')).toBeInTheDocument()
    expect(screen.getByText('Quantity')).toBeInTheDocument()
    expect(screen.getByText('P&L')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  test('renders trade data correctly', () => {
    render(
      <TradesTable
        trades={mockTrades}
        onCloseTrade={mockOnCloseTrade}
        onDeleteTrade={mockOnDeleteTrade}
      />
    )

    expect(screen.getByText('EURUSD')).toBeInTheDocument()
    expect(screen.getByText('GBPUSD')).toBeInTheDocument()
    expect(screen.getByText('BUY')).toBeInTheDocument()
    expect(screen.getByText('SELL')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  test('shows close button for open trades only', () => {
    render(
      <TradesTable
        trades={mockTrades}
        onCloseTrade={mockOnCloseTrade}
        onDeleteTrade={mockOnDeleteTrade}
      />
    )

    const closeButtons = screen.getAllByText('Close')
    expect(closeButtons).toHaveLength(1) // Only for open trade
  })

  test('shows delete button for all trades', () => {
    render(
      <TradesTable
        trades={mockTrades}
        onCloseTrade={mockOnCloseTrade}
        onDeleteTrade={mockOnDeleteTrade}
      />
    )

    const deleteButtons = screen.getAllByText('Delete')
    expect(deleteButtons).toHaveLength(2) // For both trades
  })

  test('opens close trade modal when close button is clicked', () => {
    render(
      <TradesTable
        trades={mockTrades}
        onCloseTrade={mockOnCloseTrade}
        onDeleteTrade={mockOnDeleteTrade}
      />
    )

    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)

    expect(screen.getByTestId('close-trade-modal')).toBeInTheDocument()
    expect(screen.getByText('Symbol: EURUSD')).toBeInTheDocument()
  })

  test('opens delete trade modal when delete button is clicked', () => {
    render(
      <TradesTable
        trades={mockTrades}
        onCloseTrade={mockOnCloseTrade}
        onDeleteTrade={mockOnDeleteTrade}
      />
    )

    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])

    expect(screen.getByTestId('delete-trade-modal')).toBeInTheDocument()
    expect(screen.getByText('Symbol: EURUSD')).toBeInTheDocument()
  })

  test('opens notes modal when notes are clicked', () => {
    render(
      <TradesTable
        trades={mockTrades}
        onCloseTrade={mockOnCloseTrade}
        onDeleteTrade={mockOnDeleteTrade}
      />
    )

    const notesElement = screen.getByText('Test trade notes')
    fireEvent.click(notesElement)

    expect(screen.getByTestId('notes-modal')).toBeInTheDocument()
    expect(screen.getByText('Symbol: EURUSD')).toBeInTheDocument()
    expect(screen.getByText('Notes: Test trade notes')).toBeInTheDocument()
  })

  test('supports keyboard navigation for notes', () => {
    render(
      <TradesTable
        trades={mockTrades}
        onCloseTrade={mockOnCloseTrade}
        onDeleteTrade={mockOnDeleteTrade}
      />
    )

    const notesElement = screen.getByText('Test trade notes')

    // Focus the element
    notesElement.focus()
    expect(notesElement).toHaveFocus()

    // Press Enter to open notes modal
    fireEvent.keyDown(notesElement, { key: 'Enter' })
    expect(screen.getByTestId('notes-modal')).toBeInTheDocument()
  })

  test('displays P&L correctly for closed trades', () => {
    render(
      <TradesTable
        trades={mockTrades}
        onCloseTrade={mockOnCloseTrade}
        onDeleteTrade={mockOnDeleteTrade}
      />
    )

    expect(screen.getByText('$25.00')).toBeInTheDocument() // P&L for closed trade
    expect(screen.getByText('-')).toBeInTheDocument() // P&L for open trade
  })

  test('displays status correctly', () => {
    render(
      <TradesTable
        trades={mockTrades}
        onCloseTrade={mockOnCloseTrade}
        onDeleteTrade={mockOnDeleteTrade}
      />
    )

    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  test('displays exit reason for closed trades', () => {
    render(
      <TradesTable
        trades={mockTrades}
        onCloseTrade={mockOnCloseTrade}
        onDeleteTrade={mockOnDeleteTrade}
      />
    )

    expect(screen.getByText('TAKE PROFIT')).toBeInTheDocument()
  })

  test('renders pagination component', () => {
    render(
      <TradesTable
        trades={mockTrades}
        onCloseTrade={mockOnCloseTrade}
        onDeleteTrade={mockOnDeleteTrade}
      />
    )

    expect(screen.getByTestId('pagination')).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument()
  })

  test('has proper accessibility attributes', () => {
    render(
      <TradesTable
        trades={mockTrades}
        onCloseTrade={mockOnCloseTrade}
        onDeleteTrade={mockOnDeleteTrade}
      />
    )

    // Check table headers have scope attributes
    const headers = screen.getAllByRole('columnheader')
    headers.forEach((header) => {
      expect(header).toHaveAttribute('scope', 'col')
    })

    // Check action buttons have proper labels
    const closeButton = screen.getByText('Close')
    expect(closeButton).toHaveAttribute('aria-label', 'Close trade EURUSD buy')

    const deleteButtons = screen.getAllByText('Delete')
    expect(deleteButtons[0]).toHaveAttribute(
      'aria-label',
      'Delete trade EURUSD buy'
    )
  })
})


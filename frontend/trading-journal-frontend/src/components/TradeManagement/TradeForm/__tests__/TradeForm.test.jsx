import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TradeForm from '../TradeForm'

// Mock the modal animation hook
vi.mock('../../../hooks/useModalAnimation', () => ({
  default: () => ({
    isClosing: false,
    handleClose: vi.fn(),
  }),
}))

// Mock the form fields component
vi.mock('../TradeFormFields', () => ({
  default: ({ formData, onInputChange, isLoading }) => (
    <div data-testid="trade-form-fields">
      <input
        name="symbol"
        value={formData.symbol}
        onChange={onInputChange}
        placeholder="Symbol"
        disabled={isLoading}
      />
      <input
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={onInputChange}
        placeholder="Quantity"
        disabled={isLoading}
      />
      <input
        name="entry_price"
        type="number"
        value={formData.entry_price}
        onChange={onInputChange}
        placeholder="Entry Price"
        disabled={isLoading}
      />
      <input
        name="stop_loss"
        type="number"
        value={formData.stop_loss}
        onChange={onInputChange}
        placeholder="Stop Loss"
        disabled={isLoading}
      />
      <input
        name="take_profit"
        type="number"
        value={formData.take_profit}
        onChange={onInputChange}
        placeholder="Take Profit"
        disabled={isLoading}
      />
    </div>
  ),
}))

// Mock the checklist component
vi.mock('../TradeChecklist', () => ({
  default: ({ checklistData, onChecklistChange }) => (
    <div data-testid="trade-checklist">
      <input
        type="checkbox"
        name="asianSession"
        checked={checklistData.asianSession}
        onChange={(e) => onChecklistChange('asianSession')}
      />
      <label>Asian Session</label>
    </div>
  ),
}))

// Mock the risk reward display component
vi.mock('../RiskRewardDisplay', () => ({
  default: () => (
    <div data-testid="risk-reward-display">Risk/Reward Display</div>
  ),
}))

describe('TradeForm', () => {
  const mockOnClose = vi.fn()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders form when open', () => {
    render(
      <TradeForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
        error={null}
      />
    )

    expect(screen.getByText('Add New Trade')).toBeInTheDocument()
    expect(screen.getByTestId('trade-form-fields')).toBeInTheDocument()
    expect(screen.getByTestId('trade-checklist')).toBeInTheDocument()
    expect(screen.getByTestId('risk-reward-display')).toBeInTheDocument()
  })

  test('does not render when closed', () => {
    render(
      <TradeForm
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
        error={null}
      />
    )

    expect(screen.queryByText('Add New Trade')).not.toBeInTheDocument()
  })

  test('shows error message when provided', () => {
    const error = { message: 'Test error message' }

    render(
      <TradeForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
        error={error}
      />
    )

    expect(screen.getByText('Error: Test error message')).toBeInTheDocument()
  })

  test('shows loading state on submit button when loading', () => {
    render(
      <TradeForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={true}
        error={null}
      />
    )

    expect(screen.getByText('Adding...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Trade' })).toBeDisabled()
  })

  test('has proper accessibility attributes', () => {
    render(
      <TradeForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
        error={null}
      />
    )

    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-modal', 'true')
    expect(modal).toHaveAttribute('aria-labelledby', 'add-trade-title')

    const title = screen.getByText('Add New Trade')
    expect(title).toHaveAttribute('id', 'add-trade-title')
  })

  test('calls onSubmit when form is submitted with valid data', async () => {
    const user = userEvent.setup()

    render(
      <TradeForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
        error={null}
      />
    )

    // Fill in the form
    const symbolInput = screen.getByPlaceholderText('Symbol')
    const quantityInput = screen.getByPlaceholderText('Quantity')
    const entryPriceInput = screen.getByPlaceholderText('Entry Price')
    const stopLossInput = screen.getByPlaceholderText('Stop Loss')
    const takeProfitInput = screen.getByPlaceholderText('Take Profit')

    await user.type(symbolInput, 'EURUSD')
    await user.type(quantityInput, '100')
    await user.type(entryPriceInput, '1.0850')
    await user.type(stopLossInput, '1.0800')
    await user.type(takeProfitInput, '1.0900')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Add Trade' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          symbol: 'EURUSD',
          quantity: '100',
          entry_price: '1.0850',
          stop_loss: '1.0800',
          take_profit: '1.0900',
          checklist_grade: expect.any(String),
          checklist_score: expect.any(Number),
          checklist_data: expect.any(Object),
        })
      )
    })
  })

  test('shows validation error for missing required fields', async () => {
    const user = userEvent.setup()

    render(
      <TradeForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
        error={null}
      />
    )

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: 'Add Trade' })
    await user.click(submitButton)

    expect(
      screen.getByText(/Please fill in all required fields/)
    ).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
})

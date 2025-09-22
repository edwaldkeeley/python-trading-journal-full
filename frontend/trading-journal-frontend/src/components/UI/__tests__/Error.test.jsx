import { render, screen, fireEvent } from '@testing-library/react'
import Error from '../Error'

// Mock window.location.reload
const mockReload = vi.fn()
Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload,
  },
  writable: true,
})

describe('Error', () => {
  const mockOnRetry = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders with default title and message', () => {
    render(<Error onRetry={mockOnRetry} />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(
      screen.getByText(
        'An unexpected error occurred while loading your trading journal.'
      )
    ).toBeInTheDocument()
  })

  test('renders with custom title and error message', () => {
    render(
      <Error
        error="Network connection failed"
        onRetry={mockOnRetry}
        title="Custom Error"
      />
    )

    expect(screen.getByText('Custom Error')).toBeInTheDocument()
    expect(screen.getByText('Network connection failed')).toBeInTheDocument()
  })

  test('renders error icon', () => {
    render(<Error onRetry={mockOnRetry} />)

    expect(screen.getByText('⚠️')).toBeInTheDocument()
  })

  test('renders retry and refresh buttons', () => {
    render(<Error onRetry={mockOnRetry} />)

    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('Refresh Page')).toBeInTheDocument()
  })

  test('calls onRetry when Try Again button is clicked', () => {
    render(<Error onRetry={mockOnRetry} />)

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    expect(mockOnRetry).toHaveBeenCalledTimes(1)
  })

  test('calls window.location.reload when Refresh Page button is clicked', () => {
    render(<Error onRetry={mockOnRetry} />)

    const refreshButton = screen.getByText('Refresh Page')
    fireEvent.click(refreshButton)

    expect(mockReload).toHaveBeenCalledTimes(1)
  })

  test('renders help section with troubleshooting steps', () => {
    render(<Error onRetry={mockOnRetry} />)

    expect(
      screen.getByText('If the problem persists, please:')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Check your internet connection')
    ).toBeInTheDocument()
    expect(screen.getByText('Try refreshing the page')).toBeInTheDocument()
    expect(screen.getByText('Clear your browser cache')).toBeInTheDocument()
    expect(
      screen.getByText('Contact support if the issue continues')
    ).toBeInTheDocument()
  })

  test('has proper accessibility attributes', () => {
    render(<Error onRetry={mockOnRetry} />)

    const retryButton = screen.getByText('Try Again')
    const refreshButton = screen.getByText('Refresh Page')

    expect(retryButton).toHaveAttribute('type', 'button')
    expect(refreshButton).toHaveAttribute('type', 'button')
  })

  test('buttons have proper styling classes', () => {
    render(<Error onRetry={mockOnRetry} />)

    const retryButton = screen.getByText('Try Again')
    const refreshButton = screen.getByText('Refresh Page')

    expect(retryButton).toHaveClass('btn', 'btn-primary')
    expect(refreshButton).toHaveClass('btn', 'btn-secondary')
  })

  test('renders button icons', () => {
    render(<Error onRetry={mockOnRetry} />)

    const icons = screen.getAllByText('🔄')
    expect(icons).toHaveLength(2) // One for each button
  })

  test('handles missing error message gracefully', () => {
    render(<Error onRetry={mockOnRetry} error={null} />)

    expect(
      screen.getByText(
        'An unexpected error occurred while loading your trading journal.'
      )
    ).toBeInTheDocument()
  })

  test('handles empty error message gracefully', () => {
    render(<Error onRetry={mockOnRetry} error="" />)

    expect(
      screen.getByText(
        'An unexpected error occurred while loading your trading journal.'
      )
    ).toBeInTheDocument()
  })
})


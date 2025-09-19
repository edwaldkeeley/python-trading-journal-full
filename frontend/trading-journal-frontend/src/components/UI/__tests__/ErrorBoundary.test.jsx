import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../ErrorBoundary'

describe('ErrorBoundary', () => {
  const mockOnRetry = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders with default title and message', () => {
    render(<ErrorBoundary onRetry={mockOnRetry} />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(
      screen.getByText('An unexpected error occurred.')
    ).toBeInTheDocument()
  })

  test('renders with custom error message', () => {
    const errorMessage = 'Failed to fetch data from server'
    render(
      <ErrorBoundary
        error={errorMessage}
        onRetry={mockOnRetry}
        title="Custom Error"
      />
    )

    expect(screen.getByText('Custom Error')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test('shows error details section when error is provided', () => {
    const errorMessage = 'Network Error: Connection timeout'
    render(<ErrorBoundary error={errorMessage} onRetry={mockOnRetry} />)

    expect(screen.getByText('Error Details:')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test('does not show error details section when no error provided', () => {
    render(<ErrorBoundary onRetry={mockOnRetry} />)

    expect(screen.queryByText('Error Details:')).not.toBeInTheDocument()
  })

  test('renders network error type correctly', () => {
    const errorMessage = 'Failed to connect to server'
    render(
      <ErrorBoundary
        error={errorMessage}
        onRetry={mockOnRetry}
        type="network"
      />
    )

    expect(screen.getByText('Connection Problem')).toBeInTheDocument()
    expect(screen.getByText('🌐')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test('renders server error type correctly', () => {
    const errorMessage = 'Internal Server Error 500'
    render(
      <ErrorBoundary error={errorMessage} onRetry={mockOnRetry} type="server" />
    )

    expect(screen.getByText('Server Error')).toBeInTheDocument()
    expect(screen.getByText('🔧')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test('renders validation error type correctly', () => {
    const errorMessage = 'Invalid input data'
    render(
      <ErrorBoundary
        error={errorMessage}
        onRetry={mockOnRetry}
        type="validation"
      />
    )

    expect(screen.getByText('Validation Error')).toBeInTheDocument()
    expect(screen.getByText('⚠️')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test('renders retry and refresh buttons', () => {
    render(<ErrorBoundary onRetry={mockOnRetry} />)

    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('Refresh Page')).toBeInTheDocument()
  })

  test('renders help section with suggestions', () => {
    render(<ErrorBoundary onRetry={mockOnRetry} />)

    expect(
      screen.getByText('If the problem persists, please:')
    ).toBeInTheDocument()
    expect(screen.getByText('Try refreshing the page')).toBeInTheDocument()
    expect(screen.getByText('Clear your browser cache')).toBeInTheDocument()
  })

  test('renders network-specific suggestions for network errors', () => {
    render(
      <ErrorBoundary
        error="Network error"
        onRetry={mockOnRetry}
        type="network"
      />
    )

    expect(
      screen.getByText('Check your internet connection')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Check if the server is running')
    ).toBeInTheDocument()
  })

  test('renders server-specific suggestions for server errors', () => {
    render(
      <ErrorBoundary error="Server error" onRetry={mockOnRetry} type="server" />
    )

    expect(
      screen.getByText('Wait a few minutes and try again')
    ).toBeInTheDocument()
    expect(screen.getByText('Check server status')).toBeInTheDocument()
  })

  test('renders validation-specific suggestions for validation errors', () => {
    render(
      <ErrorBoundary
        error="Validation error"
        onRetry={mockOnRetry}
        type="validation"
      />
    )

    expect(screen.getByText('Check your input for errors')).toBeInTheDocument()
    expect(
      screen.getByText('Make sure all required fields are filled')
    ).toBeInTheDocument()
  })

  test('has proper accessibility attributes', () => {
    render(<ErrorBoundary onRetry={mockOnRetry} />)

    const retryButton = screen.getByText('Try Again')
    const refreshButton = screen.getByText('Refresh Page')

    expect(retryButton).toHaveAttribute('type', 'button')
    expect(refreshButton).toHaveAttribute('type', 'button')
  })

  test('buttons have proper styling classes', () => {
    render(<ErrorBoundary onRetry={mockOnRetry} />)

    const retryButton = screen.getByText('Try Again')
    const refreshButton = screen.getByText('Refresh Page')

    expect(retryButton).toHaveClass('btn', 'btn-primary')
    expect(refreshButton).toHaveClass('btn', 'btn-secondary')
  })

  test('renders button icons', () => {
    render(<ErrorBoundary onRetry={mockOnRetry} />)

    const icons = screen.getAllByText('🔄')
    expect(icons).toHaveLength(2) // One for each button
  })

  test('handles long error messages gracefully', () => {
    const longErrorMessage =
      'This is a very long error message that should be handled gracefully and not break the layout or cause any visual issues with the error boundary component'
    render(<ErrorBoundary error={longErrorMessage} onRetry={mockOnRetry} />)

    expect(screen.getByText(longErrorMessage)).toBeInTheDocument()
    expect(screen.getByText('Error Details:')).toBeInTheDocument()
  })
})

import { render, screen, fireEvent } from '@testing-library/react'
import NotificationModal from '../NotificationModal'

// Mock the modal animation hook
vi.mock('../../hooks/useModalAnimation', () => ({
  default: () => ({
    isClosing: false,
    handleClose: vi.fn(),
  }),
}))

describe('NotificationModal', () => {
  const mockOnClose = vi.fn()
  const mockOnConfirm = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders when open', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Title"
        message="Test message"
      />
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  test('does not render when closed', () => {
    render(
      <NotificationModal
        isOpen={false}
        onClose={mockOnClose}
        title="Test Title"
        message="Test message"
      />
    )

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })

  test('renders success notification with correct icon and styling', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        type="success"
        title="Success!"
        message="Operation completed successfully"
      />
    )

    expect(screen.getByText('✅')).toBeInTheDocument()
    expect(screen.getByText('Success!')).toBeInTheDocument()
    expect(
      screen.getByText('Operation completed successfully')
    ).toBeInTheDocument()
  })

  test('renders error notification with correct icon and styling', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        type="error"
        title="Error!"
        message="Something went wrong"
      />
    )

    expect(screen.getByText('❌')).toBeInTheDocument()
    expect(screen.getByText('Error!')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  test('renders warning notification with correct icon and styling', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        type="warning"
        title="Warning!"
        message="Please be careful"
      />
    )

    expect(screen.getByText('⚠️')).toBeInTheDocument()
    expect(screen.getByText('Warning!')).toBeInTheDocument()
    expect(screen.getByText('Please be careful')).toBeInTheDocument()
  })

  test('renders info notification with correct icon and styling', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        type="info"
        title="Info"
        message="Here is some information"
      />
    )

    expect(screen.getByText('ℹ️')).toBeInTheDocument()
    expect(screen.getByText('Info')).toBeInTheDocument()
    expect(screen.getByText('Here is some information')).toBeInTheDocument()
  })

  test('shows only confirm button by default', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test"
        message="Test message"
      />
    )

    expect(screen.getByText('OK')).toBeInTheDocument()
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
  })

  test('shows both confirm and cancel buttons when showCancel is true', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test"
        message="Test message"
        showCancel={true}
        confirmText="Yes"
        cancelText="No"
      />
    )

    expect(screen.getByText('Yes')).toBeInTheDocument()
    expect(screen.getByText('No')).toBeInTheDocument()
  })

  test('calls onConfirm when confirm button is clicked', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test"
        message="Test message"
        onConfirm={mockOnConfirm}
      />
    )

    const confirmButton = screen.getByText('OK')
    fireEvent.click(confirmButton)

    expect(mockOnConfirm).toHaveBeenCalled()
  })

  test('calls onCancel when cancel button is clicked', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test"
        message="Test message"
        showCancel={true}
        onCancel={mockOnCancel}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  test('calls onClose when confirm button is clicked and no onConfirm provided', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test"
        message="Test message"
      />
    )

    const confirmButton = screen.getByText('OK')
    fireEvent.click(confirmButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  test('calls onClose when cancel button is clicked and no onCancel provided', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test"
        message="Test message"
        showCancel={true}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  test('shows loading state on confirm button', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test"
        message="Test message"
        isLoading={true}
      />
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeDisabled()
  })

  test('disables buttons when loading', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test"
        message="Test message"
        showCancel={true}
        isLoading={true}
      />
    )

    expect(screen.getByText('Loading...')).toBeDisabled()
    expect(screen.getByText('Cancel')).toBeDisabled()
  })

  test('uses custom button text', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test"
        message="Test message"
        confirmText="Custom OK"
        showCancel={true}
        cancelText="Custom Cancel"
      />
    )

    expect(screen.getByText('Custom OK')).toBeInTheDocument()
    expect(screen.getByText('Custom Cancel')).toBeInTheDocument()
  })

  test('has proper accessibility attributes', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Title"
        message="Test message"
      />
    )

    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-modal', 'true')
    expect(modal).toHaveAttribute('aria-labelledby', 'notification-title')

    const title = screen.getByText('Test Title')
    expect(title).toHaveAttribute('id', 'notification-title')
  })

  test('error type uses danger button styling', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        type="error"
        title="Error"
        message="Error message"
      />
    )

    const confirmButton = screen.getByText('OK')
    expect(confirmButton).toHaveClass('btn-danger')
  })

  test('non-error types use primary button styling', () => {
    render(
      <NotificationModal
        isOpen={true}
        onClose={mockOnClose}
        type="success"
        title="Success"
        message="Success message"
      />
    )

    const confirmButton = screen.getByText('OK')
    expect(confirmButton).toHaveClass('btn-primary')
  })
})

import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../../contexts/ThemeContext'
import ThemeToggle from '../ThemeToggle'

// Helper function to render component with theme context
const renderWithTheme = (component) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear()
  })

  test('renders theme toggle button', () => {
    renderWithTheme(<ThemeToggle />)

    const toggleButton = screen.getByRole('switch')
    expect(toggleButton).toBeInTheDocument()
    expect(toggleButton).toHaveAttribute('aria-checked', 'false')
  })

  test('shows correct initial theme icon', () => {
    renderWithTheme(<ThemeToggle />)

    const icon = screen.getByText('☀️')
    expect(icon).toBeInTheDocument()
  })

  test('toggles theme when clicked', async () => {
    renderWithTheme(<ThemeToggle />)

    const toggleButton = screen.getByRole('switch')

    // Initial state
    expect(toggleButton).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByText('☀️')).toBeInTheDocument()

    // Click to toggle
    fireEvent.click(toggleButton)

    // Should show dark mode icon
    expect(screen.getByText('🌙')).toBeInTheDocument()
    expect(toggleButton).toHaveAttribute('aria-checked', 'true')
  })

  test('has proper accessibility attributes', () => {
    renderWithTheme(<ThemeToggle />)

    const toggleButton = screen.getByRole('switch')
    expect(toggleButton).toHaveAttribute('aria-label', 'Switch to dark mode')
    expect(toggleButton).toHaveAttribute('aria-checked', 'false')
  })

  test('supports keyboard navigation', () => {
    renderWithTheme(<ThemeToggle />)

    const toggleButton = screen.getByRole('switch')

    // Focus the button
    toggleButton.focus()
    expect(toggleButton).toHaveFocus()

    // Press Enter to toggle
    fireEvent.keyDown(toggleButton, { key: 'Enter' })
    expect(screen.getByText('🌙')).toBeInTheDocument()
  })

  test('applies custom className', () => {
    renderWithTheme(<ThemeToggle className="custom-class" />)

    const container = screen
      .getByRole('switch')
      .closest('.theme-slider-container')
    expect(container).toHaveClass('custom-class')
  })
})

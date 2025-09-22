# Testing Guide

This document provides a comprehensive guide for testing the Trading Journal application.

## Test Setup

The application uses the following testing stack:

- **Vitest** - Fast unit test runner
- **@testing-library/react** - React component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom Jest matchers for DOM testing
- **jsdom** - DOM environment for Node.js

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
src/
├── test/
│   ├── setup.js              # Test configuration and mocks
│   └── README.md             # This file
├── components/
│   ├── UI/
│   │   └── __tests__/
│   │       └── ThemeToggle.test.jsx
│   ├── TradeManagement/
│   │   ├── __tests__/
│   │   │   └── TradesTable.test.jsx
│   │   └── TradeForm/
│   │       └── __tests__/
│   │           ├── TradeForm.test.jsx
│   │           └── tradeFormUtils.test.js
│   └── utils/
│       └── __tests__/
│           └── tradeDataGenerator.test.js
```

## Test Categories

### 1. Unit Tests

- **Utility Functions**: `tradeFormUtils.test.js`, `tradeDataGenerator.test.js`
- **Component Logic**: Individual component behavior testing
- **Hook Testing**: Custom hooks like `useModalAnimation`

### 2. Integration Tests

- **Component Integration**: How components work together
- **Form Submissions**: End-to-end form workflows
- **Modal Interactions**: Modal opening, closing, and data flow

### 3. Accessibility Tests

- **ARIA Attributes**: Proper labeling and roles
- **Keyboard Navigation**: Tab order and keyboard interactions
- **Screen Reader Support**: Semantic HTML structure

### 4. Responsive Design Tests

- **Breakpoint Testing**: Different screen sizes
- **Mobile Interactions**: Touch and mobile-specific behaviors
- **Layout Validation**: CSS Grid and Flexbox layouts

## Test Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Writing Tests

### Component Testing

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  test('handles user interactions', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(screen.getByText('Updated Text')).toBeInTheDocument()
  })
})
```

### Utility Function Testing

```javascript
import { myUtilityFunction } from '../myUtility'

describe('myUtilityFunction', () => {
  test('returns expected result for valid input', () => {
    const result = myUtilityFunction('valid input')
    expect(result).toBe('expected output')
  })

  test('handles edge cases', () => {
    expect(() => myUtilityFunction(null)).toThrow('Invalid input')
  })
})
```

## Mocking

### API Calls

```javascript
// Mock fetch globally
global.fetch = vi.fn()

// Mock specific API responses
fetch.mockResolvedValueOnce({
  ok: true,
  json: () => Promise.resolve({ data: 'mock data' }),
})
```

### React Context

```javascript
const renderWithTheme = (component, { theme = 'light' } = {}) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}
```

### Local Storage

```javascript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test Accessibility**: Include ARIA attributes and keyboard navigation tests
4. **Mock External Dependencies**: Keep tests isolated and fast
5. **Use Descriptive Test Names**: Make test failures easy to understand
6. **Test Edge Cases**: Include error states, empty data, and boundary conditions
7. **Keep Tests Simple**: One assertion per test when possible
8. **Use Data Test IDs Sparingly**: Only when semantic queries aren't available

## Continuous Integration

Tests run automatically on:

- Pull request creation
- Code push to main branch
- Manual trigger via GitHub Actions

## Debugging Tests

```bash
# Run specific test file
npm run test -- TradesTable.test.jsx

# Run tests matching pattern
npm run test -- --grep "ThemeToggle"

# Run tests with verbose output
npm run test -- --reporter=verbose
```

## Performance Testing

For performance-critical components, consider:

- Rendering time tests
- Memory leak detection
- Animation performance
- Large dataset handling

## Future Enhancements

- **E2E Testing**: Add Playwright or Cypress for full application testing
- **Visual Regression Testing**: Screenshot comparison for UI changes
- **Performance Testing**: Bundle size and runtime performance monitoring
- **Accessibility Testing**: Automated a11y testing with axe-core


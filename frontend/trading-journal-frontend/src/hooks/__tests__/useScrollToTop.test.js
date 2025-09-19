import { renderHook } from '@testing-library/react'
import {
  useScrollToTop,
  useScrollToModalError,
  useScrollToElement,
} from '../useScrollToTop'

// Mock window.scrollTo
const mockScrollTo = vi.fn()
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
})

// Mock scrollIntoView
const mockScrollIntoView = vi.fn()
Element.prototype.scrollIntoView = mockScrollIntoView

describe('useScrollToTop', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useScrollToTop', () => {
    test('scrolls to top when hasError is true', () => {
      renderHook(() => useScrollToTop(true))

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    })

    test('scrolls to top with instant behavior when smooth is false', () => {
      renderHook(() => useScrollToTop(true, false))

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        left: 0,
        behavior: 'instant',
      })
    })

    test('does not scroll when hasError is false', () => {
      renderHook(() => useScrollToTop(false))

      expect(mockScrollTo).not.toHaveBeenCalled()
    })

    test('scrolls again when hasError changes from false to true', () => {
      const { rerender } = renderHook(
        ({ hasError }) => useScrollToTop(hasError),
        { initialProps: { hasError: false } }
      )

      expect(mockScrollTo).not.toHaveBeenCalled()

      rerender({ hasError: true })

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    })
  })

  describe('useScrollToModalError', () => {
    beforeEach(() => {
      // Mock document.querySelector
      document.querySelector = vi.fn()
    })

    test('scrolls modal to top when hasError is true and modal exists', () => {
      const mockModal = {
        scrollTo: vi.fn(),
        scrollIntoView: vi.fn(),
      }
      document.querySelector.mockReturnValue(mockModal)

      renderHook(() => useScrollToModalError(true))

      expect(mockModal.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      })
      expect(mockModal.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    })

    test('falls back to window scroll when modal not found', () => {
      document.querySelector.mockReturnValue(null)

      renderHook(() => useScrollToModalError(true))

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    })

    test('uses custom modal selector', () => {
      const mockModal = {
        scrollTo: vi.fn(),
        scrollIntoView: vi.fn(),
      }
      document.querySelector.mockReturnValue(mockModal)

      renderHook(() => useScrollToModalError(true, '.custom-modal'))

      expect(document.querySelector).toHaveBeenCalledWith('.custom-modal')
    })

    test('does not scroll when hasError is false', () => {
      renderHook(() => useScrollToModalError(false))

      expect(document.querySelector).not.toHaveBeenCalled()
      expect(mockScrollTo).not.toHaveBeenCalled()
    })
  })

  describe('useScrollToElement', () => {
    beforeEach(() => {
      // Mock document.getElementById
      document.getElementById = vi.fn()
    })

    test('scrolls to element when hasError is true and element exists', () => {
      const mockElement = {
        scrollIntoView: vi.fn(),
      }
      document.getElementById.mockReturnValue(mockElement)

      renderHook(() => useScrollToElement(true, 'test-element'))

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    })

    test('does not scroll when element not found', () => {
      document.getElementById.mockReturnValue(null)

      renderHook(() => useScrollToElement(true, 'nonexistent'))

      expect(mockScrollIntoView).not.toHaveBeenCalled()
    })

    test('does not scroll when hasError is false', () => {
      renderHook(() => useScrollToElement(false, 'test-element'))

      expect(document.getElementById).not.toHaveBeenCalled()
    })

    test('uses instant behavior when smooth is false', () => {
      const mockElement = {
        scrollIntoView: vi.fn(),
      }
      document.getElementById.mockReturnValue(mockElement)

      renderHook(() => useScrollToElement(true, 'test-element', false))

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'instant',
        block: 'start',
        inline: 'nearest',
      })
    })
  })
})

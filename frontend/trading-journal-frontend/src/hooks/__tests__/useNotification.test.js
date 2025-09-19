import { renderHook, act } from '@testing-library/react'
import { useNotification } from '../useNotification'

describe('useNotification', () => {
  test('initial state is closed', () => {
    const { result } = renderHook(() => useNotification())

    expect(result.current.notification.isOpen).toBe(false)
  })

  test('showNotification opens modal with correct data', () => {
    const { result } = renderHook(() => useNotification())

    act(() => {
      result.current.showNotification({
        type: 'success',
        title: 'Success!',
        message: 'Operation completed successfully',
        confirmText: 'Great!',
      })
    })

    expect(result.current.notification).toEqual({
      isOpen: true,
      type: 'success',
      title: 'Success!',
      message: 'Operation completed successfully',
      confirmText: 'Great!',
      showCancel: false,
      cancelText: 'Cancel',
      onConfirm: null,
      onCancel: null,
      isLoading: false,
    })
  })

  test('hideNotification closes modal', () => {
    const { result } = renderHook(() => useNotification())

    // First show notification
    act(() => {
      result.current.showNotification({
        type: 'error',
        title: 'Error!',
        message: 'Something went wrong',
      })
    })

    expect(result.current.notification.isOpen).toBe(true)

    // Then hide it
    act(() => {
      result.current.hideNotification()
    })

    expect(result.current.notification.isOpen).toBe(false)
  })

  test('showSuccess sets correct type and default values', () => {
    const { result } = renderHook(() => useNotification())

    act(() => {
      result.current.showSuccess('Success!', 'Operation completed')
    })

    expect(result.current.notification.type).toBe('success')
    expect(result.current.notification.title).toBe('Success!')
    expect(result.current.notification.message).toBe('Operation completed')
    expect(result.current.notification.confirmText).toBe('OK')
    expect(result.current.notification.showCancel).toBe(false)
  })

  test('showError sets correct type and default values', () => {
    const { result } = renderHook(() => useNotification())

    act(() => {
      result.current.showError('Error!', 'Something went wrong')
    })

    expect(result.current.notification.type).toBe('error')
    expect(result.current.notification.title).toBe('Error!')
    expect(result.current.notification.message).toBe('Something went wrong')
    expect(result.current.notification.confirmText).toBe('OK')
  })

  test('showWarning sets correct type and default values', () => {
    const { result } = renderHook(() => useNotification())

    act(() => {
      result.current.showWarning('Warning!', 'Please be careful')
    })

    expect(result.current.notification.type).toBe('warning')
    expect(result.current.notification.title).toBe('Warning!')
    expect(result.current.notification.message).toBe('Please be careful')
  })

  test('showInfo sets correct type and default values', () => {
    const { result } = renderHook(() => useNotification())

    act(() => {
      result.current.showInfo('Info', 'Here is some information')
    })

    expect(result.current.notification.type).toBe('info')
    expect(result.current.notification.title).toBe('Info')
    expect(result.current.notification.message).toBe('Here is some information')
  })

  test('showConfirmation sets up confirmation dialog', () => {
    const { result } = renderHook(() => useNotification())
    const mockOnConfirm = vi.fn()

    act(() => {
      result.current.showConfirmation(
        'Confirm Action',
        'Are you sure you want to proceed?',
        mockOnConfirm
      )
    })

    expect(result.current.notification.type).toBe('warning')
    expect(result.current.notification.title).toBe('Confirm Action')
    expect(result.current.notification.message).toBe(
      'Are you sure you want to proceed?'
    )
    expect(result.current.notification.showCancel).toBe(true)
    expect(result.current.notification.confirmText).toBe('Yes')
    expect(result.current.notification.cancelText).toBe('No')
    expect(typeof result.current.notification.onConfirm).toBe('function')
    expect(typeof result.current.notification.onCancel).toBe('function')
  })

  test('showConfirmation onConfirm calls callback and closes modal', () => {
    const { result } = renderHook(() => useNotification())
    const mockOnConfirm = vi.fn()

    act(() => {
      result.current.showConfirmation(
        'Confirm Action',
        'Are you sure?',
        mockOnConfirm
      )
    })

    // Simulate confirm button click
    act(() => {
      result.current.notification.onConfirm()
    })

    expect(mockOnConfirm).toHaveBeenCalled()
    expect(result.current.notification.isOpen).toBe(false)
  })

  test('showConfirmation onCancel closes modal without calling callback', () => {
    const { result } = renderHook(() => useNotification())
    const mockOnConfirm = vi.fn()

    act(() => {
      result.current.showConfirmation(
        'Confirm Action',
        'Are you sure?',
        mockOnConfirm
      )
    })

    // Simulate cancel button click
    act(() => {
      result.current.notification.onCancel()
    })

    expect(mockOnConfirm).not.toHaveBeenCalled()
    expect(result.current.notification.isOpen).toBe(false)
  })

  test('custom options override defaults', () => {
    const { result } = renderHook(() => useNotification())

    act(() => {
      result.current.showSuccess('Custom', 'Message', {
        confirmText: 'Custom OK',
        showCancel: true,
        cancelText: 'Custom Cancel',
        isLoading: true,
      })
    })

    expect(result.current.notification.confirmText).toBe('Custom OK')
    expect(result.current.notification.showCancel).toBe(true)
    expect(result.current.notification.cancelText).toBe('Custom Cancel')
    expect(result.current.notification.isLoading).toBe(true)
  })
})

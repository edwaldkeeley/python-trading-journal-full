# Notification System Documentation

This document explains how to use the notification system to replace `alert()` calls with professional modal components.

## Overview

The notification system provides a modern, accessible alternative to browser `alert()` and `confirm()` dialogs. It includes:

- **NotificationModal** - A reusable modal component for displaying messages
- **useNotification** - A custom hook for managing notification state
- **Multiple notification types** - Success, error, warning, and info
- **Confirmation dialogs** - Replace `confirm()` with styled modals
- **Accessibility support** - ARIA attributes and keyboard navigation

## Quick Start

### 1. Import the hook and component

```javascript
import { useNotification } from '../../hooks/useNotification'
import { NotificationModal } from '../UI'
```

### 2. Use in your component

```javascript
const MyComponent = () => {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmation,
    notification,
    hideNotification,
  } = useNotification()

  const handleAction = async () => {
    try {
      await someAsyncOperation()
      showSuccess('Success!', 'Operation completed successfully')
    } catch (error) {
      showError('Error!', 'Something went wrong')
    }
  }

  return (
    <div>
      {/* Your component content */}

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        confirmText={notification.confirmText}
        showCancel={notification.showCancel}
        cancelText={notification.cancelText}
        onConfirm={notification.onConfirm}
        onCancel={notification.onCancel}
        isLoading={notification.isLoading}
      />
    </div>
  )
}
```

## API Reference

### useNotification Hook

#### Methods

- **`showSuccess(title, message, options?)`** - Show success notification
- **`showError(title, message, options?)`** - Show error notification
- **`showWarning(title, message, options?)`** - Show warning notification
- **`showInfo(title, message, options?)`** - Show info notification
- **`showConfirmation(title, message, onConfirm, options?)`** - Show confirmation dialog
- **`showNotification(options)`** - Show custom notification
- **`hideNotification()`** - Hide current notification

#### State

- **`notification`** - Current notification state object

### NotificationModal Component

#### Props

| Prop          | Type     | Default  | Description                                              |
| ------------- | -------- | -------- | -------------------------------------------------------- |
| `isOpen`      | boolean  | false    | Whether modal is visible                                 |
| `onClose`     | function | -        | Called when modal should close                           |
| `type`        | string   | 'info'   | Notification type: 'success', 'error', 'warning', 'info' |
| `title`       | string   | -        | Modal title                                              |
| `message`     | string   | -        | Modal message content                                    |
| `confirmText` | string   | 'OK'     | Confirm button text                                      |
| `showCancel`  | boolean  | false    | Whether to show cancel button                            |
| `cancelText`  | string   | 'Cancel' | Cancel button text                                       |
| `onConfirm`   | function | -        | Called when confirm button is clicked                    |
| `onCancel`    | function | -        | Called when cancel button is clicked                     |
| `isLoading`   | boolean  | false    | Whether buttons should show loading state                |

## Examples

### Basic Notifications

```javascript
// Success notification
showSuccess(
  'Trade Added',
  'Your trade has been successfully added to the journal.'
)

// Error notification
showError(
  'Failed to Save',
  'There was an error saving your trade. Please try again.'
)

// Warning notification
showWarning('Low Balance', 'Your account balance is getting low.')

// Info notification
showInfo('New Feature', 'Check out the new analytics dashboard!')
```

### Confirmation Dialogs

```javascript
// Simple confirmation
showConfirmation(
  'Delete Trade',
  'Are you sure you want to delete this trade? This action cannot be undone.',
  () => {
    // User confirmed - proceed with deletion
    deleteTrade(tradeId)
  }
)

// Confirmation with custom options
showConfirmation(
  'Clear All Data',
  'This will permanently delete all your trades. Are you sure?',
  () => clearAllTrades(),
  {
    confirmText: 'Yes, Delete All',
    cancelText: 'Keep Data',
    type: 'error',
  }
)
```

### Custom Notifications

```javascript
// Custom notification with all options
showNotification({
  type: 'warning',
  title: 'Maintenance Mode',
  message: 'The system will be under maintenance from 2-4 AM EST.',
  confirmText: 'Got It',
  showCancel: true,
  cancelText: 'Remind Me Later',
  onConfirm: () => console.log('User acknowledged'),
  onCancel: () => scheduleReminder(),
  isLoading: false,
})
```

### Loading States

```javascript
// Show loading notification
showNotification({
  type: 'info',
  title: 'Processing',
  message: 'Please wait while we process your request...',
  confirmText: 'Cancel',
  isLoading: true,
  onConfirm: () => cancelOperation(),
})

// Update to success when done
showSuccess('Complete!', 'Your request has been processed successfully.')
```

## Replacing alert() and confirm()

### Before (using alert)

```javascript
// Old way
const handleDelete = () => {
  if (confirm('Are you sure you want to delete this trade?')) {
    deleteTrade(tradeId)
  }
}

const handleError = () => {
  alert('An error occurred!')
}
```

### After (using notifications)

```javascript
// New way
const handleDelete = () => {
  showConfirmation(
    'Delete Trade',
    'Are you sure you want to delete this trade? This action cannot be undone.',
    () => deleteTrade(tradeId)
  )
}

const handleError = () => {
  showError('Error', 'An error occurred!')
}
```

## Styling

The notification system includes built-in styling for all notification types:

- **Success**: Green border and checkmark icon
- **Error**: Red border and X icon
- **Warning**: Yellow border and warning icon
- **Info**: Blue border and info icon

### Custom Styling

You can override styles by targeting the notification classes:

```css
.notification-modal {
  /* Custom modal styles */
}

.notification-success {
  /* Custom success styles */
}

.notification-error {
  /* Custom error styles */
}
```

## Accessibility

The notification system is fully accessible:

- **ARIA attributes** - Proper `role="dialog"` and `aria-modal="true"`
- **Keyboard navigation** - Tab order and Enter/Escape key support
- **Screen reader support** - Proper labeling and announcements
- **Focus management** - Focus returns to trigger element when closed

## Testing

The notification system includes comprehensive tests:

- **Hook tests** - `useNotification.test.js`
- **Component tests** - `NotificationModal.test.jsx`

Run tests with:

```bash
npm run test -- useNotification
npm run test -- NotificationModal
```

## Best Practices

1. **Use appropriate types** - Success for positive actions, error for failures, etc.
2. **Keep messages concise** - Users should quickly understand the message
3. **Provide clear actions** - Make it obvious what the user should do next
4. **Handle loading states** - Show progress for long-running operations
5. **Test accessibility** - Ensure screen readers can access notifications
6. **Avoid overuse** - Don't show notifications for every minor action

## Migration Guide

### Step 1: Replace alert() calls

```javascript
// Before
alert('Success!')

// After
showSuccess('Success!', 'Operation completed successfully')
```

### Step 2: Replace confirm() calls

```javascript
// Before
if (confirm('Are you sure?')) {
  doSomething()
}

// After
showConfirmation('Confirm Action', 'Are you sure?', () => {
  doSomething()
})
```

### Step 3: Add NotificationModal to your component

```javascript
// Add to your component's JSX
<NotificationModal
  isOpen={notification.isOpen}
  onClose={hideNotification}
  type={notification.type}
  title={notification.title}
  message={notification.message}
  confirmText={notification.confirmText}
  showCancel={notification.showCancel}
  cancelText={notification.cancelText}
  onConfirm={notification.onConfirm}
  onCancel={notification.onCancel}
  isLoading={notification.isLoading}
/>
```

## Troubleshooting

### Common Issues

1. **Modal not showing** - Ensure `isOpen` is true and component is rendered
2. **Styling issues** - Check that CSS classes are properly imported
3. **Accessibility problems** - Verify ARIA attributes are present
4. **Tests failing** - Make sure mocks are properly set up

### Debug Tips

```javascript
// Log notification state
console.log('Notification state:', notification)

// Check if modal is rendered
console.log('Modal in DOM:', document.querySelector('.notification-modal'))
```

## Future Enhancements

- **Toast notifications** - Non-blocking notifications that auto-dismiss
- **Progress indicators** - Show progress for long operations
- **Sound notifications** - Audio feedback for important messages
- **Notification history** - Keep track of recent notifications
- **Custom animations** - More sophisticated entrance/exit animations

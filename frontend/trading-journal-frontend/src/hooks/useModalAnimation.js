import { useState, useCallback } from 'react'

const useModalAnimation = (onClose) => {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = useCallback(() => {
    if (isClosing) return // Prevent multiple close calls

    setIsClosing(true)
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 150) // Match animation duration
  }, [onClose, isClosing])

  return {
    isClosing,
    handleClose,
  }
}

export default useModalAnimation

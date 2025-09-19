import { useEffect } from 'react'

/**
 * Custom hook that scrolls to the top of the page when an error occurs
 * @param {boolean} hasError - Whether there's currently an error
 * @param {boolean} smooth - Whether to use smooth scrolling (default: true)
 */
export const useScrollToTop = (hasError, smooth = true) => {
  useEffect(() => {
    if (hasError) {
      // Scroll to top when error occurs
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: smooth ? 'smooth' : 'instant',
      })
    }
  }, [hasError, smooth])
}

/**
 * Custom hook that scrolls to error messages within modals
 * @param {boolean} hasError - Whether there's currently an error
 * @param {string} modalSelector - CSS selector for the modal container
 * @param {boolean} smooth - Whether to use smooth scrolling (default: true)
 */
export const useScrollToModalError = (
  hasError,
  modalSelector = '.modal',
  smooth = true
) => {
  useEffect(() => {
    if (hasError) {
      // Find the modal and scroll to the top of it
      const modal = document.querySelector(modalSelector)
      if (modal) {
        modal.scrollTo({
          top: 0,
          behavior: smooth ? 'smooth' : 'instant',
        })

        // Also scroll the page to make the modal visible
        modal.scrollIntoView({
          behavior: smooth ? 'smooth' : 'instant',
          block: 'center',
          inline: 'nearest',
        })
      } else {
        // Fallback to page scroll if no modal found
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: smooth ? 'smooth' : 'instant',
        })
      }
    }
  }, [hasError, modalSelector, smooth])
}

/**
 * Custom hook that scrolls to a specific element when an error occurs
 * @param {boolean} hasError - Whether there's currently an error
 * @param {string} elementId - ID of the element to scroll to
 * @param {boolean} smooth - Whether to use smooth scrolling (default: true)
 */
export const useScrollToElement = (hasError, elementId, smooth = true) => {
  useEffect(() => {
    if (hasError && elementId) {
      const element = document.getElementById(elementId)
      if (element) {
        element.scrollIntoView({
          behavior: smooth ? 'smooth' : 'instant',
          block: 'start',
          inline: 'nearest',
        })
      }
    }
  }, [hasError, elementId, smooth])
}

export default useScrollToTop

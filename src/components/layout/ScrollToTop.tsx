import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Ensures that on mobile and desktop navigation, the window scrolls
 * to the top immediately without leaving the user stranded halfway down the page.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [pathname])

  return null
}

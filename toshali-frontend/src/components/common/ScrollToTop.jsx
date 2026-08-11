import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router does NOT automatically scroll to top on navigation.
// Without this, clicking a link (like the logo) can feel like "nothing
// happened" if you were scrolled down on the previous page.
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
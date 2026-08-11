import React from 'react'
import { useLocation } from 'react-router-dom'

// Wraps whatever page is currently rendered and fades it in smoothly on
// every route change. `key={pathname}` forces React to treat each route
// as a fresh mount, which re-triggers the CSS animation every time.
const PageTransition = ({ children }) => {
  const { pathname } = useLocation()

  return (
    <div key={pathname} className="toshali-page-fade">
      {children}
      <style>{`
        @keyframes toshaliPageFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .toshali-page-fade {
          animation: toshaliPageFadeIn 0.35s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default PageTransition
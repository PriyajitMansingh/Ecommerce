import React, { useState, useEffect } from 'react'
import almond from '../../assets/images/almond.png'
import cashew from '../../assets/images/cashew.png'
import makhana from '../../assets/images/makhana.png'

// Sample data — replace with real order data later (see note at bottom of file)
const notifications = [
  { name: 'Priya S.', city: 'Bhubaneswar', product: 'California Almonds 500g', image: almond, minutesAgo: 3 },
  { name: 'Rahul M.', city: 'Mumbai', product: 'Cashew Nuts 500g', image: cashew, minutesAgo: 7 },
  { name: 'Ananya D.', city: 'Bengaluru', product: 'Phool Makhana 200g', image: makhana, minutesAgo: 12 },
  { name: 'Vikram T.', city: 'Delhi', product: 'California Almonds 500g', image: almond, minutesAgo: 18 },
  { name: 'Sneha R.', city: 'Pune', product: 'Cashew Nuts 500g', image: cashew, minutesAgo: 24 },
]

const SHOW_AFTER_MS = 6000     // wait before the first popup appears
const VISIBLE_FOR_MS = 6000    // how long each popup stays visible
const GAP_BETWEEN_MS = 12000   // pause between one popup disappearing and the next appearing
const FADE_OUT_MS = 500        // must match the CSS transition duration below

const RecentSalesNotification = () => {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let showTimer, hideTimer, swapTimer

    const cycle = (delay) => {
      showTimer = setTimeout(() => {
        if (dismissed) return
        setVisible(true)
        hideTimer = setTimeout(() => {
          // Start the fade-out first. The content (name/product/image) is
          // NOT changed yet — the card is still visible at this instant,
          // so swapping it here would flash new content while fading,
          // which is what caused the "shake" feeling.
          setVisible(false)

          // Only swap to the next notification's content once the fade-out
          // has fully finished (card is now invisible) — safe to change
          // anything at this point since nothing is visible.
          swapTimer = setTimeout(() => {
            setIndex((prev) => (prev + 1) % notifications.length)
            cycle(GAP_BETWEEN_MS)
          }, FADE_OUT_MS)
        }, VISIBLE_FOR_MS)
      }, delay)
    }

    cycle(SHOW_AFTER_MS)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
      clearTimeout(swapTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dismissed])

  if (dismissed) return null

  const current = notifications[index]

  return (
    <div
      className={`fixed bottom-5 left-4 right-20 sm:right-auto sm:left-5 z-40 max-w-[280px] sm:max-w-xs bg-white rounded-2xl shadow-lg border border-[#3d2a1a]/10 p-4 flex items-start gap-3 transition-[opacity,transform] duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ willChange: 'opacity, transform', contain: 'layout paint' }}
    >
      <img
        src={current.image}
        alt={current.product}
        className="w-12 h-12 object-contain flex-shrink-0 mt-0.5"
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#3d2a1a] leading-snug">
          <span className="font-bold">{current.name}</span> in {current.city} just bought
        </p>
        <p className="text-sm font-semibold text-[#3d2a1a] leading-snug mb-1.5">
          {current.product}
        </p>
        <div className="flex items-center gap-2 text-[11px] text-[#a89c8a]">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
          {current.minutesAgo} minutes ago
          <span className="flex items-center gap-1 text-[#3a8a5a] font-medium">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Verified
          </span>
        </div>
      </div>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="text-[#a89c8a] hover:text-[#3d2a1a] transition-colors flex-shrink-0 -mt-1 -mr-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Progress bar — fills from start to end over VISIBLE_FOR_MS,
          so the user can see exactly how long this popup has left */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3d2a1a]/5 rounded-b-2xl overflow-hidden">
        <div
          className="h-full bg-[#D4AF37]"
          style={{
            width: visible ? '100%' : '0%',
            transition: visible ? `width ${VISIBLE_FOR_MS}ms linear` : 'none',
          }}
        />
      </div>
    </div>
  )
}

export default RecentSalesNotification

// ─────────────────────────────────────────────────────────────
// NOTE for later: once the backend is live, replace the hardcoded
// `notifications` array above with real recent-order data fetched
// from your orders API, e.g.:
//
//   const [notifications, setNotifications] = useState([])
//   useEffect(() => {
//     fetch('/api/orders/recent-public').then(r => r.json()).then(setNotifications)
//   }, [])
//
// Never show a customer's full name or exact address — first name +
// initial and city only, like the sample data here.
// ─────────────────────────────────────────────────────────────
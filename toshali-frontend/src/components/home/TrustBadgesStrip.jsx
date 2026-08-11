import React from 'react'

const badges = [
  {
    label: '100% Natural',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M12 2C8 6 6 10 6 13a6 6 0 0012 0c0-3-2-7-6-11z" />
      </svg>
    ),
  },
  {
    label: 'FSSAI Certified',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M12 2l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V5l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Free Shipping ₹499+',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M1 3h15v13H1V3zm15 5h4l3 3v5h-7V8zM6 19a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    ),
  },
  {
    label: 'Secure Payments',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <rect x="3" y="10" width="18" height="10" rx="2" />
        <path d="M7 10V7a5 5 0 0110 0v3" />
      </svg>
    ),
  },
  {
    label: 'Easy Returns',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M3 12a9 9 0 1015-6.7M3 12V5m0 7h7" />
      </svg>
    ),
  },
]

const TrustBadgesStrip = () => {
  return (
    <section className="bg-[#3d2a1a] py-4 md:py-6 px-6 md:px-12 border-b border-white/5">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-x-4 sm:gap-x-10 gap-y-3 sm:gap-y-4">
        {badges.map((b) => (
          <div key={b.label} className="flex items-center gap-2 sm:gap-2.5 text-[#f0e6d2]">
            <span className="text-[#D4AF37] flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-6 sm:[&>svg]:h-6">{b.icon}</span>
            <span className="text-xs sm:text-sm font-medium">{b.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrustBadgesStrip
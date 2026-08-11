import React, { useState } from 'react'

// Drop your official logo images here (Vite public folder — referenced by
// absolute path, so the build never breaks even if a file is missing; a
// fallback text badge shows instead until you add the real logo).
// Recommended size: 200x80px, transparent background .png, under ~40KB each.
//   public/images/marketplaces/amazon.png
//   public/images/marketplaces/flipkart.png
//   public/images/marketplaces/jiomart.png
const marketplaces = [
  { name: 'Amazon', logo: '/images/marketplaces/amazon.png' },
  { name: 'Flipkart', logo: '/images/marketplaces/flipkart.png' },
  { name: 'JioMart', logo: '/images/marketplaces/jiomart.png' },
]

// Shows the marketplace logo; if it's missing/not-yet-added, falls back to
// a plain text badge instead of a broken-image icon.
const MarketplaceLogo = ({ src, name }) => {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return <span className="text-sm font-semibold text-[#3d2a1a]">{name}</span>
  }
  return (
    <img
      src={src}
      alt={name}
      className="h-9 md:h-11 w-auto object-contain"
      onError={() => setFailed(true)}
    />
  )
}

// NOTE: logos are currently display-only (no click action), per client's
// request — wire up real store links here once confirmed:
//   <a href="https://amazon.in/..." target="_blank" rel="noopener noreferrer">
const AlsoAvailableOn = () => {
  return (
    <section className="bg-[#FBF9F2] py-8 px-6 border-t border-[#3d2a1a]/10">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B8860B] mb-6">
          We Are Also Available On
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {marketplaces.map((m) => (
            <MarketplaceLogo key={m.name} src={m.logo} name={m.name} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AlsoAvailableOn
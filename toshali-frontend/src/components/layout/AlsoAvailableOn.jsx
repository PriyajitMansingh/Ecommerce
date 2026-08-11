

import React, { useState } from 'react'

const marketplaces = [
  { name: 'Amazon', logo: '/images/marketplaces/amazon.png' },
  { name: 'Flipkart', logo: '/images/marketplaces/flipkart.png' },
  { name: 'JioMart', logo: '/images/marketplaces/jiomart.png' },
  { name: 'Meesho', logo: '/images/marketplaces/meesho.png' },
]

const MarketplaceLogo = ({ src, name }) => {
  const [failed, setFailed] = useState(false)
  return (
    <div className="flex items-center justify-center h-16 w-28 sm:h-20 sm:w-36 md:h-24 md:w-44 flex-shrink-0">
      {failed ? (
        <span className="text-sm sm:text-base font-bold text-[#3d2a1a] whitespace-nowrap">
          {name}
        </span>
      ) : (
        <img
          src={src}
          alt={name}
          className="max-h-full max-w-full object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

const AlsoAvailableOn = () => {
  return (
    <section className="bg-[#FBF9F2] py-12 px-6 border-t border-[#3d2a1a]/10">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6E1F2F] mb-8">
          We Are Also Available On
        </p>
        <div className="flex flex-nowrap items-center justify-center gap-3 sm:gap-6 md:gap-10 overflow-x-auto">
          {marketplaces.map((m) => (
            <MarketplaceLogo key={m.name} src={m.logo} name={m.name} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AlsoAvailableOn
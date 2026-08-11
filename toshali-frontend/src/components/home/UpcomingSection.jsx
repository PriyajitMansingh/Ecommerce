
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'
import almondFallback from '../../assets/images/almond.png'

const UpcomingSection = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    axiosInstance
      .get('/products/upcoming')
      .then(({ data }) => { if (mounted) setProducts(data) })
      .catch(() => mounted && setProducts([]))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section className="bg-[#FBF9F2] py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Section heading - reduced spacing */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3">
            <span className="w-1 h-1 rounded-full bg-[#D4AF37] animate-pulse" />
            Coming Soon
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-[#3d2a1a] mt-1">
            Upcoming Products
          </h2>
          <p className="mt-1 text-xs text-[#6b5940]">
            Sneak peek at what's arriving in our catalogue next
          </p>
        </div>

        {/* Cards grid - reduced gap */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-[#F3E4C8] aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="group relative bg-white rounded-xl border border-[#3d2a1a]/8 shadow-[0_1px_3px_rgba(61,42,26,0.06)] hover:shadow-[0_8px_20px_rgba(61,42,26,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Coming Soon badge - smaller */}
                <span className="absolute top-2 left-2 z-10 bg-[#D4AF37] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
                  Coming Soon
                </span>

                {/* Image - smaller */}
                <div className="w-full aspect-square bg-gradient-to-br from-[#F7F1E6] to-[#F0E5D2] flex items-center justify-center overflow-hidden p-6 relative">
                  <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/30 pointer-events-none" />
                  <img
                    src={product.imageUrl || almondFallback}
                    alt={product.name}
                    onError={(e) => { e.currentTarget.src = almondFallback }}
                    className="w-full h-full object-contain opacity-55 blur-[2px] group-hover:blur-0 group-hover:opacity-90 transition-all duration-500 scale-105 group-hover:scale-110 drop-shadow-lg relative z-[1]"
                    loading="lazy"
                  />
                </div>

                {/* Info - compact padding */}
                <div className="flex flex-col flex-1 px-3 pt-3 pb-3 space-y-1.5">
                  {/* Brand / Category name - smaller */}
                  {product.categoryId?.name && (
                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#B8860B]">
                      {product.categoryId.name}
                    </p>
                  )}

                  {/* Product name - smaller */}
                  <h3 className="text-sm font-bold text-[#3d2a1a] leading-tight line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Heading description - smaller */}
                  {product.headingDescription && (
                    <p className="text-[10px] text-[#6b5940] leading-relaxed line-clamp-2">
                      {product.headingDescription}
                    </p>
                  )}

                  {/* MRP - compact */}
                  {product.mrpPrice > 0 && (
                    <div className="pt-0.5 flex items-center gap-2">
                      <span className="text-[8px] text-[#a89c8a] uppercase tracking-wide">MRP</span>
                      <span className="text-base font-bold text-[#3d2a1a]">₹{product.mrpPrice}</span>
                    </div>
                  )}

                  {/* Notify CTA - smaller */}
                  <button
                    type="button"
                    className="mt-1 w-full text-[10px] font-bold py-2 rounded-lg border-2 border-[#3d2a1a]/20 text-[#3d2a1a] hover:bg-[#3d2a1a] hover:text-white hover:border-[#3d2a1a] transition-all duration-300"
                  >
                    Notify Me
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default UpcomingSection
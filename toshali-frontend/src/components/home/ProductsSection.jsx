
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import almondFallback from '../../assets/images/almond.png'
import SectionHeading from '../common/SectionHeading'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import axiosInstance from '../../api/axiosInstance'

const MAX_DISPLAY = 3

const ProductsSection = () => {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [justAdded, setJustAdded] = useState(null)

  useEffect(() => {
    axiosInstance
      .get('/products')
      .then(({ data }) => setProducts(data.filter((p) => p.isFeatured)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    setJustAdded(product._id)
    setTimeout(() => setJustAdded(null), 1800)
  }

  const visibleProducts = products.slice(0, MAX_DISPLAY)
  const hasMore = products.length > MAX_DISPLAY

  if (loading) {
    return (
      <section id="bestsellers" className="bg-[#FBF9F2] pt-8 md:pt-16 pb-16 px-4 md:px-8">
        <SectionHeading eyebrow="Our Bestsellers" title="Handpicked, Just for You" className="mb-6 md:mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {Array.from({ length: MAX_DISPLAY }).map((_, i) => (
            <div key={i} className="rounded-xl bg-[#F3E4C8] aspect-[3/4] animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#FBF9F2] pt-8 md:pt-16 pb-16 px-4 md:px-8">
      <SectionHeading eyebrow="Our Bestsellers" title="Handpicked, Just for You" className="mb-6 md:mb-12" />

      <div
        id="bestsellers"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto scroll-mt-[130px] md:scroll-mt-[220px]"
      >
        {visibleProducts.length === 0 && (
          <p className="col-span-full text-center text-sm text-[#a89c8a]">No products available right now.</p>
        )}

        {visibleProducts.map((product) => {
          const added = justAdded === product._id
          const image = product.imageUrl || almondFallback

          const hasDiscount = product.mrpPrice > 0 && product.mrpPrice > product.price
          const savings = hasDiscount ? (product.mrpPrice - product.price).toFixed(0) : null
          const savingsPercent = hasDiscount
            ? Math.round(((product.mrpPrice - product.price) / product.mrpPrice) * 100)
            : null

          return (
            <div
              key={product._id}
              className="group bg-white rounded-xl border border-[#3d2a1a]/8 shadow-[0_1px_3px_rgba(61,42,26,0.06)] hover:shadow-[0_8px_20px_rgba(61,42,26,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative"
            >
              {/* Top badge - smaller */}
              {product.isOnSale ? (
                <span className="absolute top-0 left-0 z-10 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white text-[8px] font-black px-3 py-1.5 rounded-br-xl tracking-wide uppercase shadow-sm">
                  On Sale
                </span>
              ) : hasDiscount ? (
                <span className="absolute top-2 left-2 z-10 bg-[#3a8a5a] text-white text-[8px] font-bold px-2 py-1 rounded-full shadow-sm">
                  {savingsPercent}% OFF
                </span>
              ) : null}

              {/* Wishlist button - smaller */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Toggle wishlist"
                className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm transition-all hover:scale-110 ${
                  isInWishlist(product.name) ? 'bg-red-50 text-red-500' : 'bg-white/90 text-[#a89c8a] hover:text-red-500'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill={isInWishlist(product.name) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
                </svg>
              </button>

              {/* Image - smaller padding */}
              <Link to={'/product/' + product._id} className="block">
                <div className="w-full aspect-square bg-gradient-to-br from-[#F7F1E6] to-[#F0E5D2] overflow-hidden flex items-center justify-center p-6 relative">
                  <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/30 pointer-events-none" />
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 drop-shadow-md relative z-[1]"
                    onError={(e) => { e.currentTarget.src = almondFallback }}
                    loading="lazy"
                  />
                </div>
              </Link>

              {/* Info - compact padding */}
              <div className="flex flex-col flex-1 px-3 pt-3 pb-3.5 text-center">
                {/* Rating - smaller */}
                <div className="flex items-center justify-center gap-1 mb-1.5">
                  <span className="text-[#D4AF37] text-[10px]">★★★★★</span>
                  <span className="text-[9px] text-[#a89c8a] font-medium">(120)</span>
                </div>

                {/* Product name - smaller */}
                <Link to={'/product/' + product._id}>
                  <h3 className="text-sm font-bold text-[#3d2a1a] mb-1 hover:text-[#B8860B] transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Category - smaller */}
                <p className="text-[9px] uppercase tracking-[0.15em] text-[#a89c8a] mb-3">
                  {product.categoryId?.name || 'General'}{product.subcategoryId?.name ? ` / ${product.subcategoryId.name}` : ''}
                  {product.weight ? ` · ${product.weight}` : ''}
                </p>

                {/* Price block - smaller */}
                <div className="mb-1 flex items-end justify-center gap-2">
                  <span className="text-lg font-bold text-[#B8860B]">₹{product.price}</span>
                  {hasDiscount && (
                    <span className="text-xs text-[#a89c8a] line-through decoration-[#a89c8a]/70">₹{product.mrpPrice}</span>
                  )}
                </div>

                {hasDiscount ? (
                  <p className="text-[9px] font-semibold text-[#3a8a5a] mb-3">
                    Save ₹{savings} ({savingsPercent}%)
                  </p>
                ) : (
                  <div className="mb-3 h-3" />
                )}

                {/* Buttons - smaller */}
                {product.stockQty === 0 ? (
                  <div className="flex gap-2 mt-auto">
                    <span className="flex-1 text-[10px] font-bold py-2.5 rounded-lg bg-gray-100 text-gray-400 text-center">
                      Out of Stock
                    </span>
                    <Link
                      to={'/product/' + product._id}
                      className="flex-1 text-[10px] font-bold py-2.5 rounded-lg border border-[#3d2a1a]/15 text-[#3d2a1a] hover:bg-[#F3E4C8] hover:border-[#B8860B]/30 transition-colors text-center flex items-center justify-center"
                    >
                      Details
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={added}
                      className={`relative flex-1 text-[10px] font-bold py-2.5 rounded-lg transition-colors duration-300 flex items-center justify-center gap-1.5 overflow-hidden group/btn ${
                        added ? 'bg-[#3a8a5a] text-white' : 'bg-[#3d2a1a] text-white'
                      }`}
                    >
                      {!added && (
                        <span className="absolute inset-0 bg-[#B8860B] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out" />
                      )}
                      <span className="relative z-10 flex items-center gap-1">
                        {added ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                            Added
                          </>
                        ) : (
                          'Add to Cart'
                        )}
                      </span>
                    </button>
                    <Link
                      to={'/product/' + product._id}
                      className="flex-1 text-[10px] font-bold py-2.5 rounded-lg border border-[#3d2a1a]/15 text-[#3d2a1a] hover:bg-[#F3E4C8] hover:border-[#B8860B]/30 transition-colors text-center flex items-center justify-center"
                    >
                      Details
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* View More - smaller button */}
      {hasMore && (
        <div className="flex justify-center mt-8 md:mt-12">
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 bg-white border-2 border-[#3d2a1a] text-[#3d2a1a] text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#3d2a1a] hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            View More Products
            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </section>
  )
}

export default ProductsSection
import React from 'react'
import Navbar from '../../components/layout/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import almondFallback from '../../assets/images/almond.png'
import makhanaLoose from '../../assets/images/makhana-loose.png'
import almondLoose from '../../assets/images/almond-loose.png'

const WishlistPage = () => {
  const navigate = useNavigate()
  const { items, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (product) => {
    addToCart(product, 1)
    removeFromWishlist(product.name)
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 bg-[#FBF9F2] text-center overflow-hidden">
          <img src={almondLoose} alt="" className="hidden md:block absolute top-16 left-10 w-24 rotate-[-15deg] opacity-70 pointer-events-none drop-shadow-lg" />
          <img src={makhanaLoose} alt="" className="hidden md:block absolute bottom-16 right-10 w-20 rotate-[12deg] opacity-60 pointer-events-none drop-shadow-lg" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F3E4C8] to-[#EAD4A0] flex items-center justify-center text-[#B8860B] mb-6 shadow-sm">
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-[#3d2a1a] mb-2 tracking-tight">Your wishlist is empty</h2>
          <p className="text-sm text-[#6b5940] mb-8 max-w-sm">
            Tap the heart icon on any product to save it here for later.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/#bestsellers"
              className="bg-gradient-to-r from-[#3d2a1a] to-[#2b1d14] text-white text-sm font-bold px-7 py-3.5 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Explore Products
            </Link>
            <Link to="/" className="text-sm font-semibold text-[#6b5940] hover:text-[#B8860B] transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-[70vh] bg-[#FBF9F2] px-6 md:px-12 py-12 overflow-hidden">
        <img src={almondLoose} alt="" className="hidden lg:block absolute top-10 left-8 w-20 rotate-[-15deg] opacity-60 pointer-events-none drop-shadow-lg" />
        <img src={makhanaLoose} alt="" className="hidden lg:block absolute bottom-10 right-8 w-20 rotate-[12deg] opacity-60 pointer-events-none drop-shadow-lg" />
        <div className="max-w-6xl mx-auto relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b5940] hover:text-[#B8860B] transition-colors mb-8"
          >
            <span className="w-8 h-8 rounded-full bg-white border border-[#3d2a1a]/10 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </span>
            Back
          </button>

          <h1 className="font-serif text-3xl text-[#3d2a1a] mb-10 tracking-tight">
            Your Wishlist <span className="text-base font-sans font-normal text-[#a89c8a]">({items.length} items)</span>
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((product) => {
              // FIX: ProductsSection now saves the full product object (imageUrl,
              // mrpPrice, isOnSale, etc.) into the wishlist instead of the old
              // { name, price, image } shape. These fallbacks handle both shapes
              // so older saved items and new ones render correctly.
              const image = product.imageUrl || product.image || almondFallback
              const hasDiscount = product.mrpPrice > 0 && product.mrpPrice > product.price
              const savings = hasDiscount ? (product.mrpPrice - product.price).toFixed(0) : null
              const savingsPercent = hasDiscount
                ? Math.round(((product.mrpPrice - product.price) / product.mrpPrice) * 100)
                : null
              const oldPrice = product.mrpPrice || product.oldPrice

              return (
                <div
                  key={product.name}
                  className="group bg-white rounded-[22px] border border-[#3d2a1a]/8 shadow-[0_1px_4px_rgba(61,42,26,0.06)] hover:shadow-[0_16px_32px_rgba(61,42,26,0.14)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden relative"
                >
                  {/* Badge */}
                  {product.isOnSale ? (
                    <span className="absolute top-0 left-0 z-10 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white text-[10px] font-black px-3.5 py-2 rounded-br-2xl tracking-wide uppercase shadow-sm">
                      On Sale
                    </span>
                  ) : hasDiscount ? (
                    <span className="absolute top-3.5 left-3.5 z-10 bg-[#3a8a5a] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-sm">
                      {savingsPercent}% OFF
                    </span>
                  ) : null}

                  {/* Remove */}
                  <button
                    onClick={() => removeFromWishlist(product.name)}
                    aria-label="Remove from wishlist"
                    className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-50 shadow-sm transition-all hover:scale-110"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
                    </svg>
                  </button>

                  {/* Image */}
                  <div className="w-full aspect-square bg-gradient-to-br from-[#F7F1E6] to-[#F0E5D2] overflow-hidden flex items-center justify-center p-8 relative">
                    <span className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/30 pointer-events-none" />
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 drop-shadow-xl relative z-[1]"
                      onError={(e) => { e.currentTarget.src = almondFallback }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 px-6 pt-5 pb-6 text-center">
                    <h3 className="text-base font-bold text-[#3d2a1a] mb-2">{product.name}</h3>

                    <div className="mb-1 flex items-end justify-center gap-2">
                      <span className="text-xl font-bold text-[#B8860B]">₹{product.price}</span>
                      {hasDiscount && (
                        <span className="text-sm text-[#a89c8a] line-through decoration-[#a89c8a]/70">₹{oldPrice}</span>
                      )}
                    </div>

                    {hasDiscount ? (
                      <p className="text-[11px] font-semibold text-[#3a8a5a] mb-5">
                        You save ₹{savings} ({savingsPercent}%)
                      </p>
                    ) : (
                      <div className="mb-5 h-4" />
                    )}

                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="relative w-full bg-[#3d2a1a] text-white text-sm font-bold py-3.5 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 overflow-hidden group/btn mt-auto"
                    >
                      <span className="absolute inset-0 bg-[#B8860B] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out" />
                      <span className="relative z-10">Add to Cart</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default WishlistPage
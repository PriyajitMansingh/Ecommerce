import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import almondFallback from '../../assets/images/almond.png'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import axiosInstance from '../../api/axiosInstance'

// Now fully dynamic — reads the occasion slug from the URL (/gifts/:slug)
// and fetches the occasion + its products from the backend. No more
// hardcoded occasion prop or placeholder product list.
const GiftOccasionPage = () => {
  const navigate = useNavigate()
  const { slug } = useParams()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const [occasion, setOccasion] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [justAdded, setJustAdded] = useState(null)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    axiosInstance
      .get(`/gift-occasions/${slug}`)
      .then(({ data }) => {
        setOccasion(data.occasion)
        setProducts(data.products || [])
      })
      .catch((error) => {
        if (error.response?.status === 404) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = (product) => {
    addToCart(product, 1, 'gift')
    setJustAdded(product._id)
    setTimeout(() => setJustAdded(null), 1800)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-[#FBF9F2]">
          <div className="w-9 h-9 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    )
  }

  if (notFound || !occasion) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FBF9F2] px-6 text-center">
          <p className="text-4xl mb-4">🎁</p>
          <h2 className="font-serif text-2xl text-[#3d2a1a] mb-2">Occasion not found</h2>
          <p className="text-sm text-[#6b5940] mb-6">This gifting collection may have been removed or renamed.</p>
          <Link to="/gifts" className="bg-[#3d2a1a] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#2b1d14] transition-colors">
            View All Occasions
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <section className="bg-[#FBF9F2] min-h-screen pb-20">
        {/* Occasion hero banner */}
        <div className="relative bg-[#3d2a1a] text-white py-14 px-6 md:px-16 overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <button
              onClick={() => navigate('/gifts')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              All Gift Occasions
            </button>
            <p className="text-xs font-semibold text-[#D4AF37] tracking-[0.22em] uppercase mb-3">
              Gifting Collection
            </p>
            <h1 className="font-serif text-3xl md:text-5xl mb-4">{occasion.title}</h1>
            {occasion.tagline && <p className="text-white/80 text-sm md:text-base max-w-xl">{occasion.tagline}</p>}
            {occasion.description && <p className="text-white/60 text-sm mt-2 max-w-xl">{occasion.description}</p>}
          </div>
        </div>

        {/* Products for this occasion */}
        <div className="max-w-6xl mx-auto px-6 md:px-16 pt-12">
          {products.length === 0 ? (
            <p className="text-sm text-[#a89c8a] text-center py-10">No products added to this occasion yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product) => {
                const added = justAdded === product._id
                const image = product.image || almondFallback
                return (
                  <div
                    key={product._id}
                    className="group bg-white rounded-2xl border border-[#3d2a1a]/10 p-6 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative shadow-sm"
                  >
                    {product.weight && (
                      <span className="absolute top-4 left-4 bg-[#FBF9F2] text-[#B8860B] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm z-10">
                        {product.weight}
                      </span>
                    )}

                    <button
                      onClick={() => toggleWishlist(product)}
                      aria-label="Toggle wishlist"
                      className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 transition-colors ${
                        isInWishlist(product.name) ? 'bg-red-50 text-red-500' : 'bg-white text-[#a89c8a] hover:text-red-500'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={isInWishlist(product.name) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
                      </svg>
                    </button>

                    <div className="relative w-full h-56 mb-5 mt-8">
                      <img src={image} alt={product.name} className="w-full h-full object-contain drop-shadow-lg" onError={(e) => { e.currentTarget.src = almondFallback }} />
                    </div>

                    <h3 className="text-base font-bold text-[#3d2a1a] mb-2">{product.name}</h3>

                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-xl font-bold text-[#B8860B]">₹{product.price}</span>
                      {product.oldPrice && (
                        <span className="text-sm text-[#a89c8a] line-through">₹{product.oldPrice}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={added}
                      className={`relative w-full text-sm font-bold py-3.5 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 overflow-hidden group/btn ${
                        added ? 'bg-[#3a8a5a] text-white' : 'bg-[#3d2a1a] text-white'
                      }`}
                    >
                      {!added && (
                        <span className="absolute inset-0 bg-[#B8860B] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out" />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        {added ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                            Added to Cart
                          </>
                        ) : (
                          'Add to Cart'
                        )}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default GiftOccasionPage
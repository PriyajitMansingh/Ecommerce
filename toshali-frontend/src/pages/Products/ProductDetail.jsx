import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import CheckoutModal from '../../components/common/CheckoutModal'
import Navbar from '../../components/layout/Navbar'
import almondFallback from '../../assets/images/almond.png'

const toastStyle = {
  style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
}

const DETAIL_LABELS = {
  healthBenefits: 'Health Benefits',
  countryOfOrigin: 'Country of Origin',
  processingMethod: 'Processing Method',
  shelfLife: 'Shelf Life',
  manufactured: 'Manufactured By',
  storageInstructions: 'Storage Instructions',
}

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, clearCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [categoryProducts, setCategoryProducts] = useState([])

  useEffect(() => {
    setLoading(true)
    setError(null)
    axiosInstance
      .get('/products/' + id)
      .then(({ data }) => {
        setProduct(data)
        // Fetch other products from the same category for "More from this category"
        if (data.categoryId?._id) {
          axiosInstance
            .get('/products')
            .then(({ data: all }) => {
              setCategoryProducts(
                all
                  .filter((p) => p.categoryId?._id === data.categoryId._id && p._id !== data._id)
                  .slice(0, 4)
              )
            })
            .catch(() => {})
        }
      })
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, qty)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
  }

  const handleBuyNow = async () => {
    try {
      setCheckingAuth(true)
      await axiosInstance.get('/auth/me')
      await clearCart()
      await addToCart(product, qty)
      setShowCheckout(true)
    } catch (error) {
      const message = error?.response?.status === 401
        ? 'Please log in to continue checkout.'
        : 'Unable to start checkout right now.'
      toast.error(message, toastStyle)
      navigate('/login')
    } finally {
      setCheckingAuth(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FBF9F2]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#a89c8a]">Loading product…</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FBF9F2] px-6">
        <div className="text-center">
          <p className="text-lg font-serif text-[#3d2a1a] mb-4">Product not found.</p>
          <button onClick={() => navigate(-1)} className="text-sm font-semibold text-[#B8860B] hover:underline">
            ← Go back
          </button>
        </div>
      </div>
    )
  }

  const image = product.imageUrl || almondFallback
  const inWishlist = isInWishlist(product.name)
  const hasDetails = product.productDetails &&
    Object.values(product.productDetails).some((v) => v?.trim())

  return (
    <div className="bg-[#FBF9F2] min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs text-[#a89c8a] flex-wrap">
          <Link to="/" className="hover:text-[#B8860B] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#B8860B] transition-colors">Products</Link>
          {product.categoryId && (
            <>
              <span>/</span>
              <Link to={'/category/' + product.categoryId._id} className="hover:text-[#B8860B] transition-colors">
                {product.categoryId.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#3d2a1a] font-medium truncate max-w-[160px]">{product.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* LEFT — image */}
          <div className="flex items-start justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl border border-[#3d2a1a]/10 shadow-sm p-8 flex items-center justify-center aspect-square">
              <img
                src={image}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-xl"
                onError={(e) => { e.currentTarget.src = almondFallback }}
              />
            </div>
          </div>

          {/* RIGHT — details */}
          <div className="flex flex-col">
            {/* Category / subcategory tag */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {product.categoryId && (
                <Link
                  to={'/category/' + product.categoryId._id}
                  className="text-xs font-semibold text-[#B8860B] bg-[#F3E4C8] px-3 py-1 rounded-full hover:bg-[#E8D4A8] transition-colors"
                >
                  {product.categoryId.name}
                </Link>
              )}
              {product.subcategoryId && (
                <span className="text-xs font-medium text-[#6b5940] bg-[#F7F2EA] px-3 py-1 rounded-full">
                  {product.subcategoryId.name}
                </span>
              )}
              {product.weight && (
                <span className="text-xs font-medium text-[#6b5940] bg-[#F7F2EA] px-3 py-1 rounded-full">
                  {product.weight}
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#3d2a1a] mb-2 leading-tight">
              {product.name}
            </h1>

            {product.headingDescription && (
              <p className="text-sm text-[#6b5940] mb-4 leading-relaxed">{product.headingDescription}</p>
            )}

            {/* Rating placeholder */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[#D4AF37] text-sm tracking-wide">★★★★★</span>
              <span className="text-xs text-[#a89c8a] font-medium">(120 reviews)</span>
            </div>

            {/* Price block — MRP + actual price + savings */}
            {(() => {
              const hasDiscount = product.mrpPrice > 0 && product.mrpPrice > product.price
              const savings = hasDiscount ? (product.mrpPrice - product.price).toFixed(0) : null
              const savingsPct = hasDiscount
                ? Math.round(((product.mrpPrice - product.price) / product.mrpPrice) * 100)
                : null
              return (
                <div className="mb-6">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    {hasDiscount && (
                      <span className="text-sm text-[#a89c8a] line-through decoration-[#a89c8a]/70">
                        MRP ₹{product.mrpPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-[#B8860B]">₹{product.price}</span>
                    {hasDiscount && (
                      <span className="text-xs font-bold text-white bg-[#3a8a5a] px-2.5 py-1 rounded-full">
                        {savingsPct}% OFF
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <p className="text-xs font-semibold text-[#3a8a5a]">
                      You save ₹{savings} on this item
                    </p>
                  )}
                  <div className="mt-2">
                    {product.stockQty > 0 ? (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                        In Stock ({product.stockQty} left)
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              )
            })()}

            {/* Qty + Add to Cart */}
            {product.stockQty > 0 ? (
              <div className="flex items-center gap-3 mb-4">
                {/* Quantity stepper */}
                <div className="flex items-center border border-[#3d2a1a]/15 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-12 flex items-center justify-center text-[#3d2a1a] hover:bg-[#F3E4C8] transition-colors text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="w-10 h-12 flex items-center justify-center text-sm font-bold text-[#3d2a1a]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stockQty, q + 1))}
                    className="w-10 h-12 flex items-center justify-center text-[#3d2a1a] hover:bg-[#F3E4C8] transition-colors text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={justAdded}
                  className={`flex-1 h-12 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    justAdded
                      ? 'bg-[#3a8a5a] text-white'
                      : 'bg-[#3d2a1a] text-white hover:bg-[#B8860B]'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={checkingAuth}
                  className="h-12 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-[#B8860B] text-white hover:bg-[#3d2a1a] disabled:opacity-70"
                >
                  {checkingAuth ? 'Checking…' : 'Buy Now'}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="Toggle wishlist"
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                    inWishlist
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-white border-[#3d2a1a]/15 text-[#a89c8a] hover:text-red-500 hover:border-red-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="w-full h-12 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400 mb-4">
                Out of Stock
              </div>
            )}

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-[#a89c8a] mb-6">SKU: <span className="font-mono">{product.sku}</span></p>
            )}

            {/* Short description */}
            {product.shortDescription && (
              <p className="text-sm text-[#6b5940] bg-[#F7F2EA] rounded-xl px-4 py-3 border border-[#3d2a1a]/10">
                {product.shortDescription}
              </p>
            )}
          </div>
        </div>

        {/* Product Details table */}
        {hasDetails && (
          <div className="mt-14">
            <h2 className="font-serif text-2xl text-[#3d2a1a] mb-6">Product Details</h2>
            <div className="bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm overflow-hidden">
              {Object.entries(DETAIL_LABELS).map(([key, label], i) => {
                const value = product.productDetails?.[key]
                if (!value?.trim()) return null
                return (
                  <div
                    key={key}
                    className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0 px-6 py-4 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-[#FBF9F2]'
                    }`}
                  >
                    <span className="sm:w-48 flex-shrink-0 text-xs font-bold text-[#3d2a1a] uppercase tracking-wide">
                      {label}
                    </span>
                    <span className="text-sm text-[#6b5940] leading-relaxed">{value}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Long description */}
        {product.longDescription && (
          <div className="mt-10">
            <h2 className="font-serif text-2xl text-[#3d2a1a] mb-4">About this Product</h2>
            <p className="text-sm text-[#6b5940] leading-relaxed whitespace-pre-line bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm px-6 py-5">
              {product.longDescription}
            </p>
          </div>
        )}

        {/* More from this category */}
        {categoryProducts.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-[#3d2a1a]">
                More from {product.categoryId?.name}
              </h2>
              {product.categoryId && (
                <Link
                  to={'/category/' + product.categoryId._id}
                  className="text-sm font-semibold text-[#B8860B] hover:underline"
                >
                  View all →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {categoryProducts.map((p) => (
                <Link
                  key={p._id}
                  to={'/product/' + p._id}
                  className="group bg-white rounded-2xl border border-[#3d2a1a]/10 p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-square bg-[#F7F1E6] rounded-xl mb-3 overflow-hidden flex items-center justify-center">
                    <img
                      src={p.imageUrl || almondFallback}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
                      onError={(e) => { e.currentTarget.src = almondFallback }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-[#3d2a1a] line-clamp-2 mb-1">{p.name}</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {p.mrpPrice > 0 && p.mrpPrice > p.price && (
                      <span className="text-xs text-[#a89c8a] line-through">₹{p.mrpPrice}</span>
                    )}
                    <span className="text-sm font-bold text-[#B8860B]">₹{p.price}</span>
                    {p.mrpPrice > 0 && p.mrpPrice > p.price && (
                      <span className="text-[10px] font-bold text-white bg-[#3a8a5a] px-1.5 py-0.5 rounded-full">
                        {Math.round(((p.mrpPrice - p.price) / p.mrpPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </div>
  )
}

export default ProductDetail

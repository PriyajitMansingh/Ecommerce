
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import almondFallback from '../../assets/images/almond.png'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import axiosInstance from '../../api/axiosInstance'
import Navbar from '../../components/layout/Navbar'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A → Z' },
  { value: 'discount', label: 'Best Discount' },
]

const UpcomingCard = ({ product }) => {
  const image = product.imageUrl || almondFallback
  return (
    <div className="group relative bg-white rounded-[20px] border border-[#3d2a1a]/8 shadow-[0_1px_4px_rgba(61,42,26,0.06)] hover:shadow-[0_16px_32px_rgba(61,42,26,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badge */}
      <span className="absolute top-3.5 left-3.5 z-10 bg-[#D4AF37] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
        Coming Soon
      </span>

      {/* Blurred image */}
      <div className="w-full aspect-square bg-gradient-to-br from-[#F7F1E6] to-[#F0E5D2] flex items-center justify-center overflow-hidden p-6 relative">
        <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/30 pointer-events-none" />
        <img
          src={image}
          alt={product.name}
          onError={(e) => { e.currentTarget.src = almondFallback }}
          className="w-full h-full object-contain opacity-55 blur-[3px] group-hover:blur-0 group-hover:opacity-90 transition-all duration-500 scale-105 group-hover:scale-110 drop-shadow-xl relative z-[1]"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-4 pt-3.5 pb-4 space-y-1.5">
        {/* Brand / Category */}
        {product.categoryId?.name && (
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">
            {product.categoryId.name}
          </p>
        )}
        {/* Name */}
        <h3 className="text-sm font-bold text-[#3d2a1a] leading-snug line-clamp-2">
          {product.name}
        </h3>
        {/* Heading description */}
        {product.headingDescription && (
          <p className="text-[11px] text-[#6b5940] leading-relaxed line-clamp-2">
            {product.headingDescription}
          </p>
        )}
        {/* MRP */}
        {product.mrpPrice > 0 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[10px] text-[#a89c8a] uppercase tracking-wide">MRP</span>
            <span className="text-base font-bold text-[#3d2a1a]">₹{product.mrpPrice}</span>
          </div>
        )}
        {/* CTA */}
        <button
          type="button"
          className="mt-auto w-full text-[11px] font-bold py-2.5 rounded-xl border-2 border-[#3d2a1a]/20 text-[#3d2a1a] hover:bg-[#3d2a1a] hover:text-white transition-all duration-300"
        >
          Notify Me When Available
        </button>
      </div>
    </div>
  )
}

const ProductCard = ({ product, onAddToCart, justAdded }) => {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const image = product.imageUrl || almondFallback
  const added = justAdded === product._id
  const hasDiscount = product.mrpPrice > 0 && product.mrpPrice > product.price
  const savingsPct = hasDiscount
    ? Math.round(((product.mrpPrice - product.price) / product.mrpPrice) * 100)
    : null
  const savings = hasDiscount ? (product.mrpPrice - product.price).toFixed(0) : null
 if (product.isUpcoming) {
    return <UpcomingCard product={product} />
  }

  return (
    <div className="group bg-white rounded-[22px] border border-[#3d2a1a]/8 shadow-[0_1px_4px_rgba(61,42,26,0.06)] hover:shadow-[0_12px_28px_rgba(61,42,26,0.14)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden relative">

      {/* Badge */}
      {product.isOnSale ? (
        <span className="absolute top-0 left-0 z-10 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white text-[10px] font-black px-3.5 py-2 rounded-br-2xl tracking-wide uppercase shadow-sm">
          On Sale
        </span>
      ) : hasDiscount ? (
        <span className="absolute top-3 left-3 z-10 bg-[#3a8a5a] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-sm">
          {savingsPct}% OFF
        </span>
      ) : null}

      {/* Weight Badge - positioned at top left if no discount, otherwise at bottom left of image */}
      {product.weight && !product.isOnSale && !hasDiscount && (
        <span className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm text-[#3d2a1a] text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-sm border border-[#3d2a1a]/10">
          {product.weight}
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={() => toggleWishlist(product)}
        aria-label="Toggle wishlist"
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm transition-all hover:scale-110 ${
          isInWishlist(product.name) ? 'bg-red-50 text-red-500' : 'bg-white/85 text-[#a89c8a] hover:text-red-500'
        }`}
      >
        <svg className="w-4 h-4" fill={isInWishlist(product.name) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
        </svg>
      </button>

      {/* Image */}
      <Link to={'/product/' + product._id} className="block">
        <div className="w-full aspect-square bg-gradient-to-br from-[#F7F1E6] to-[#F0E5D2] overflow-hidden flex items-center justify-center p-6 relative">
          <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/30 pointer-events-none" />
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 drop-shadow-lg relative z-[1]"
            onError={(e) => { e.currentTarget.src = almondFallback }}
          />
          
         
          
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 px-4 pt-3.5 pb-4">
        {/* Category */}
        <p className="text-[10px] uppercase tracking-wider text-[#a89c8a] font-semibold mb-1">
          {product.categoryId?.name || ''}
        </p>

        {/* Weight Tag - standalone with icon */}
        {product.weight && (
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3.5 h-3.5 text-[#a89c8a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-xs font-semibold text-[#6b5940] bg-[#F3E4C8] px-2 py-0.5 rounded-full">
              {product.weight}
            </span>
          </div>
        )}

        <Link to={'/product/' + product._id}>
          <h3 className="text-sm font-bold text-[#3d2a1a] line-clamp-2 mb-2 hover:text-[#B8860B] transition-colors leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-lg font-bold text-[#B8860B]">₹{product.price}</span>
          {hasDiscount && (
            <span className="text-xs text-[#a89c8a] line-through">₹{product.mrpPrice}</span>
          )}
        </div>
        {hasDiscount ? (
          <p className="text-[11px] text-[#3a8a5a] font-semibold mb-3 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
            You save ₹{savings}
          </p>
        ) : (
          <div className="mb-3 h-4" />
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {product.stockQty === 0 ? (
            <span className="flex-1 text-center text-xs font-bold py-2.5 rounded-xl bg-gray-100 text-gray-400">
              Out of Stock
            </span>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              disabled={added}
              className={`relative flex-1 text-xs font-bold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 overflow-hidden group/btn ${
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
                ) : 'Add to Cart'}
              </span>
            </button>
          )}
          <Link
            to={'/product/' + product._id}
            className="flex-1 text-xs font-bold py-2.5 rounded-xl border border-[#3d2a1a]/15 text-[#3d2a1a] hover:bg-[#F3E4C8] hover:border-[#B8860B]/30 transition-colors text-center"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}

const ProductList = () => {
  const { addToCart } = useCart()
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [justAdded, setJustAdded] = useState(null)

  // Filter + sort state
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sort, setSort] = useState('newest')
  const [onSaleOnly, setOnSaleOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/products'),
      axiosInstance.get('/categories'),
    ])
      .then(([prodRes, catRes]) => {
        setAllProducts(prodRes.data)
        setCategories(catRes.data.filter((c) => !c.parentCategoryId))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    setJustAdded(product._id)
    setTimeout(() => setJustAdded(null), 1800)
  }

  const filtered = useMemo(() => {
    let list = [...allProducts]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryId?.name?.toLowerCase().includes(q) ||
          p.weight?.toLowerCase().includes(q)
      )
    }

    if (selectedCategory !== 'all') {
      list = list.filter(
        (p) =>
          p.categoryId?._id === selectedCategory ||
          p.subcategoryId?._id === selectedCategory
      )
    }

    if (onSaleOnly) list = list.filter((p) => p.isOnSale)
    if (inStockOnly) list = list.filter((p) => p.stockQty > 0)

    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'discount':
        list.sort((a, b) => {
          const da = a.mrpPrice > 0 ? (a.mrpPrice - a.price) / a.mrpPrice : 0
          const db = b.mrpPrice > 0 ? (b.mrpPrice - b.price) / b.mrpPrice : 0
          return db - da
        })
        break
      default: // newest — backend already returns newest-first
        break
    }

    return list
  }, [allProducts, search, selectedCategory, sort, onSaleOnly, inStockOnly])

  const activeFilterCount = [
    selectedCategory !== 'all',
    onSaleOnly,
    inStockOnly,
    search.trim() !== '',
  ].filter(Boolean).length

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('all')
    setOnSaleOnly(false)
    setInStockOnly(false)
    setSort('newest')
  }

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <p className="text-xs font-bold text-[#3d2a1a] uppercase tracking-wide mb-2">Search</p>
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#a89c8a] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-[#3d2a1a]/15 rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-[#FCFAF7] focus:bg-white transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#3d2a1a]/10 hover:bg-[#3d2a1a]/20 flex items-center justify-center text-[#3d2a1a] transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-bold text-[#3d2a1a] uppercase tracking-wide mb-2">Category</p>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#3d2a1a] text-white font-semibold'
                : 'text-[#6b5940] hover:bg-[#F3E4C8]'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedCategory(c._id)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === c._id
                  ? 'bg-[#3d2a1a] text-white font-semibold'
                  : 'text-[#6b5940] hover:bg-[#F3E4C8]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div>
        <p className="text-xs font-bold text-[#3d2a1a] uppercase tracking-wide mb-2">Filter</p>
        <div className="space-y-2">
          {[
            { label: 'On Sale only', value: onSaleOnly, set: setOnSaleOnly },
            { label: 'In Stock only', value: inStockOnly, set: setInStockOnly },
          ].map(({ label, value, set }) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => set((v) => !v)}
                className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 relative cursor-pointer ${
                  value ? 'bg-[#3d2a1a]' : 'bg-[#e0d4c0]'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm text-[#6b5940] group-hover:text-[#3d2a1a] transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full text-xs font-semibold text-red-500 hover:text-red-600 border border-red-200 rounded-xl py-2 hover:bg-red-50 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="bg-[#FBF9F2] min-h-screen">
      {/* Page header */}
      <Navbar />
      <div className="bg-white border-b border-[#3d2a1a]/8 px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-[#a89c8a] mb-3">
            <Link to="/" className="hover:text-[#B8860B] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#3d2a1a] font-medium">All Products</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-[#3d2a1a] mb-1 tracking-tight">All Products</h1>
              <p className="text-sm text-[#6b5940]">
                {loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}${activeFilterCount > 0 ? ' matching filters' : ''}`}
              </p>
            </div>

            {/* Sort — always visible */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#a89c8a] font-medium whitespace-nowrap">Sort by:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-[#3d2a1a]/15 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-[#3d2a1a] font-semibold"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="lg:hidden flex items-center gap-1.5 border border-[#3d2a1a]/15 rounded-xl px-3 py-2 text-sm font-semibold text-[#3d2a1a] hover:bg-[#F3E4C8] transition-colors relative"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#B8860B] text-white text-[9px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
        <div className="flex gap-8 items-start">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0 bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm p-5 sticky top-28">
            <FilterPanel />
          </aside>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-serif text-lg text-[#3d2a1a]">Filters</p>
                  <button onClick={() => setSidebarOpen(false)} className="text-[#a89c8a] hover:text-[#3d2a1a]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-[22px] bg-[#F3E4C8] aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <p className="font-serif text-xl text-[#3d2a1a] mb-2">No products found</p>
                <p className="text-sm text-[#6b5940] mb-5">Try adjusting your filters or search term.</p>
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold text-[#B8860B] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {filtered.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    justAdded={justAdded}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList
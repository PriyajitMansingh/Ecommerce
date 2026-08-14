

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosInstance'
import almondFallback from '../../assets/images/almond.png'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

// Dropdowns show at most this many items, plus a final "View All" tile
const MAX_DROPDOWN_ITEMS = 4

const B2B_WHATSAPP_NUMBER = '919560771457'
const b2bWhatsAppHref = `https://wa.me/${B2B_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hi, I am interested in bulk / B2B orders from House of Toshali. Please share details.'
)}`

const GiftThumb = ({ src, alt, className }) => {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`${className} bg-[#F3E4C8] flex items-center justify-center`}>
        <svg className="w-6 h-6 text-[#B8860B]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M20 12v10H4V12M2 7h20v5H2V7zM12 22V7M12 7C10.5 7 8 6 8 4a2.5 2.5 0 015 0c0-1.5 1.5-2 2.5-2A2 2 0 0117.5 4c0 2-2.5 3-5.5 3z" />
        </svg>
      </div>
    )
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
}

// ── Reusable, wired-up search box (desktop pill or mobile full-width) ──
const SearchBox = ({ variant = 'desktop', onNavigate }) => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      setOpen(false)
      return
    }

    setLoading(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get('/products/search', { params: { q: query.trim() } })
        setResults(data)
        setOpen(true)
        setActiveIndex(-1)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const goToResults = (q) => {
    if (!q.trim()) return
    navigate(`/products?search=${encodeURIComponent(q.trim())}`)
    setOpen(false)
    onNavigate?.()
  }

  const goToProduct = (product) => {
    navigate(`/product/${product._id}`)
    setOpen(false)
    setQuery('')
    onNavigate?.()
  }

  const handleKeyDown = (e) => {
    if (!open || results.length === 0) {
      if (e.key === 'Enter') goToResults(query)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && results[activeIndex]) {
        goToProduct(results[activeIndex])
      } else {
        goToResults(query)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const isMobile = variant === 'mobile'

  return (
    <div ref={wrapperRef} className={`relative ${isMobile ? 'w-full' : 'w-full max-w-[160px] xl:max-w-[220px]'}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim() && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={isMobile ? 'Search for Almonds, Cashews, Makhana...' : 'Search...'}
        className={
          isMobile
            ? 'w-full bg-[#F3E4C8] text-[#3d2a1a] placeholder-[#a89376] text-sm rounded-lg py-2.5 pl-5 pr-11 outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all'
            : 'w-full bg-white text-[#3d2a1a] placeholder-[#a89376] text-sm rounded-lg py-2.5 pl-5 pr-11 outline-none shadow-inner focus:ring-2 focus:ring-[#D4AF37] transition-all'
        }
      />

      {loading ? (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] border-2 border-[#3d2a1a]/30 border-t-[#3d2a1a] rounded-full animate-spin" />
      ) : query ? (
        <button
          onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
          aria-label="Clear search"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-[#3d2a1a]/50 hover:text-[#3d2a1a]"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <svg
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-[#3d2a1a]/50 pointer-events-none"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      )}

      {open && (
        <div className={`absolute ${isMobile ? 'left-0 right-0' : 'left-0 right-0'} top-full mt-2 bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-xl z-40 overflow-hidden ${isMobile ? '' : 'w-[280px]'}`}>
          {results.length === 0 && !loading ? (
            <p className="text-sm text-[#a89c8a] px-4 py-5 text-center">No products found for "{query}"</p>
          ) : (
            <>
              <div className="max-h-80 overflow-y-auto">
                {results.map((product, i) => (
                  <button
                    key={product._id}
                    onClick={() => goToProduct(product)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      activeIndex === i ? 'bg-[#F3E4C8]' : 'hover:bg-[#FBF9F2]'
                    }`}
                  >
                    <img
                      src={product.imageUrl || almondFallback}
                      alt={product.name}
                      className="w-10 h-10 object-contain rounded-lg bg-[#FBF9F2] p-1 flex-shrink-0"
                      onError={(e) => { e.currentTarget.src = almondFallback }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#3d2a1a] truncate">{product.name}</p>
                      <p className="text-xs text-[#B8860B] font-bold">₹{product.price}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => goToResults(query)}
                className="w-full text-center text-xs font-bold text-[#B8860B] hover:text-[#3d2a1a] py-3 border-t border-[#3d2a1a]/8 bg-[#FBF9F2] transition-colors"
              >
                See all results for "{query}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [giftMenuOpen, setGiftMenuOpen] = useState(false)
  const [mobileGiftOpen, setMobileGiftOpen] = useState(false)
  const [catMenuOpen, setCatMenuOpen] = useState(false)
  const [mobileCatOpen, setMobileCatOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [giftOccasions, setGiftOccasions] = useState([])
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const fixedWrapperRef = useRef(null)
  const [navHeight, setNavHeight] = useState(150)

  useEffect(() => {
    axiosInstance
      .get('/categories')
      .then(({ data }) => setCategories(data.filter((c) => !c.parentCategoryId)))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    axiosInstance
      .get('/gift-occasions')
      .then(({ data }) => setGiftOccasions(data))
      .catch(() => setGiftOccasions([]))
  }, [])

  useLayoutEffect(() => {
    const measure = () => {
      if (fixedWrapperRef.current) {
        setNavHeight(fixedWrapperRef.current.offsetHeight)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [isOpen])

  const goHome = (e) => {
    e.preventDefault()
    navigate('/')
    window.scrollTo(0, 0)
  }

  const scrollToBestsellers = (e) => {
    e.preventDefault()
    setIsOpen(false)
    const target = document.getElementById('bestsellers')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.location.href = '/#bestsellers'
    }
  }

  // Dropdowns/accordions only ever show MAX_DROPDOWN_ITEMS, with a "View All"
  // tile taking the final slot whenever there are more items than that.
  const visibleCategories = categories.slice(0, MAX_DROPDOWN_ITEMS)
  const visibleGiftOccasions = giftOccasions.slice(0, MAX_DROPDOWN_ITEMS)

  return (
    <div className="w-full">
      <div ref={fixedWrapperRef} className="fixed top-0 left-0 w-full z-50">
        <div className="bg-gradient-to-r from-[#C89B3C] via-[#E8C766] to-[#C89B3C] text-[#3d2a1a] text-xs font-semibold py-2.5 overflow-hidden whitespace-nowrap">
          <div className="flex animate-toshali-marquee">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="flex items-center gap-2 px-8 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M1 3h15v13H1V3zm15 5h4l3 3v5h-7V8zM6 19a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                FREE SHIPPING ON ORDERS ABOVE ₹499
              </span>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes toshali-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-toshali-marquee {
            animation: toshali-marquee 18s linear infinite;
            width: max-content;
          }
        `}</style>

        <nav className="relative px-6 md:px-10 py-3 bg-[#F3E4C8] shadow-md border-b border-[#3d2a1a]/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <Link to="/" onClick={goHome} className="flex items-center gap-2 flex-shrink-0">
              <img src={logo} alt="House of Toshali" className="h-20 md:h-24 w-auto object-contain block cursor-pointer" />
            </Link>

            <div className="hidden lg:flex items-center gap-5 xl:gap-6 whitespace-nowrap">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-[#3d2a1a] hover:text-[#B8860B] transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Categories dropdown — max 4 + View All */}
              <div
                className="relative"
                onMouseEnter={() => setCatMenuOpen(true)}
                onMouseLeave={() => setCatMenuOpen(false)}
              >
                <button
                  onClick={() => setCatMenuOpen((v) => !v)}
                  className="text-sm font-bold text-[#B8860B] hover:text-[#3d2a1a] transition-colors flex items-center gap-1"
                  aria-expanded={catMenuOpen}
                >
                  Explore By Category
                  <svg className={`w-3.5 h-3.5 transition-transform flex-shrink-0 ${catMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {catMenuOpen && categories.length > 0 && (
                  <div className="absolute top-full left-0 pt-2 z-30">
                    <div className="bg-[#FBF3E3] rounded-2xl shadow-xl border border-[#3d2a1a]/15 p-4">
                      <div className="flex items-start gap-3">
                        {visibleCategories.map((cat) => (
                          <Link
                            key={cat._id}
                            to={'/category/' + cat._id}
                            onClick={() => setCatMenuOpen(false)}
                            className="group flex flex-col items-center gap-2 rounded-xl p-2 hover:bg-[#F3E4C8] transition-colors w-[90px] flex-shrink-0"
                          >
                            <div className="w-full aspect-square rounded-lg overflow-hidden bg-[#F3E4C8] flex items-center justify-center">
                              {cat.image ? (
                                <img
                                  src={cat.image}
                                  alt={cat.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              ) : (
                                <span className="text-2xl select-none">🛍️</span>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-[#3d2a1a] text-center leading-snug group-hover:text-[#B8860B] transition-colors line-clamp-2">
                              {cat.name}
                            </span>
                          </Link>
                        ))}
                        <div className="w-px self-stretch bg-[#3d2a1a]/10 flex-shrink-0" />
                        <Link
                          to="/categories"
                          onClick={() => setCatMenuOpen(false)}
                          className="group flex flex-col items-center justify-center gap-2 rounded-xl p-2 hover:bg-[#F3E4C8] transition-colors w-[90px] flex-shrink-0"
                        >
                          <div className="w-full aspect-square rounded-lg bg-[#F3E4C8] flex items-center justify-center">
                            <span className="text-[#B8860B] text-2xl">→</span>
                          </div>
                          <span className="text-xs font-bold text-[#B8860B] text-center leading-snug">
                            All Categories
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/bulk-order"
                className="text-sm font-semibold text-[#3d2a1a] hover:text-[#B8860B] transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M3 21l1.65-4.95A9 9 0 1112 21H3z" />
                </svg>
                Bulk Order/B2B
              </Link>

              {/* Gifts dropdown — max 4 + View All */}
              <div
                className="relative"
                onMouseEnter={() => setGiftMenuOpen(true)}
                onMouseLeave={() => setGiftMenuOpen(false)}
              >
                <button
                  onClick={() => setGiftMenuOpen((v) => !v)}
                  className="text-sm font-semibold text-[#3d2a1a] hover:text-[#B8860B] transition-colors flex items-center gap-1.5"
                  aria-expanded={giftMenuOpen}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M20 12v10H4V12M2 7h20v5H2V7zM12 22V7M12 7C10.5 7 8 6 8 4a2.5 2.5 0 015 0c0-1.5 1.5-2 2.5-2A2 2 0 0117.5 4c0 2-2.5 3-5.5 3z" />
                  </svg>
                  Gifts
                  <svg className={`w-3.5 h-3.5 transition-transform flex-shrink-0 ${giftMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {giftMenuOpen && giftOccasions.length > 0 && (
                  <div className="absolute top-full right-0 pt-2 z-30">
                    <div className="bg-[#FBF3E3] rounded-2xl shadow-xl border border-[#3d2a1a]/15 p-4">
                      <div className="flex items-start gap-3">
                        {visibleGiftOccasions.map((item) => (
                          <Link
                            key={item._id}
                            to={`/gifts/${item.slug}`}
                            onClick={() => setGiftMenuOpen(false)}
                            className="group flex flex-col items-center gap-2 rounded-xl p-2 hover:bg-[#F3E4C8] transition-colors w-[100px] flex-shrink-0"
                          >
                            <GiftThumb
                              src={item.image}
                              alt={item.title}
                              className="w-full aspect-[4/3] object-cover rounded-lg"
                            />
                            <span className="text-xs font-semibold text-[#3d2a1a] text-center leading-snug group-hover:text-[#B8860B] transition-colors line-clamp-2">
                              {item.title}
                            </span>
                          </Link>
                        ))}

                        <div className="w-px self-stretch bg-[#3d2a1a]/10 flex-shrink-0" />

                        <Link
                          to="/gifts"
                          onClick={() => setGiftMenuOpen(false)}
                          className="group flex flex-col items-center justify-center gap-2 rounded-xl p-2 hover:bg-[#F3E4C8] transition-colors w-[100px] flex-shrink-0"
                        >
                          <div className="w-full aspect-[4/3] rounded-lg bg-[#F3E4C8] flex items-center justify-center">
                            <span className="text-[#B8860B] text-lg">→</span>
                          </div>
                          <span className="text-xs font-bold text-[#B8860B] text-center leading-snug">
                            View All
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — search + modernized icon cluster */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <SearchBox variant="desktop" />

              <div className="flex items-center gap-1.5 pl-1.5 ml-1 border-l border-[#3d2a1a]/12">
                <Link
                  to="/wishlist"
                  className="group relative w-10 h-10 rounded-xl bg-white/70 hover:bg-white flex items-center justify-center text-[#3d2a1a] transition-all hover:shadow-md flex-shrink-0"
                  aria-label="Wishlist"
                >
                  <svg className="w-[19px] h-[19px] transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#E8C766] to-[#B8860B] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold ring-2 ring-[#F3E4C8] shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="group relative w-10 h-10 rounded-xl bg-white/70 hover:bg-white flex items-center justify-center text-[#3d2a1a] transition-all hover:shadow-md flex-shrink-0"
                  aria-label="Cart / Checkout"
                >
                  <svg className="w-[19px] h-[19px] transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#E8C766] to-[#B8860B] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold ring-2 ring-[#F3E4C8] shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to={isAuthenticated ? '/account' : '/login'}
                  className="group w-10 h-10 rounded-xl bg-[#3d2a1a] hover:bg-[#2b1d14] flex items-center justify-center text-white transition-all hover:shadow-md flex-shrink-0 ml-0.5"
                  aria-label={isAuthenticated ? 'My Account' : 'Login'}
                >
                  {isAuthenticated ? (
                    <span className="text-sm font-bold">{user?.name?.charAt(0)}</span>
                  ) : (
                    <svg className="w-[18px] h-[18px] transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                  )}
                </Link>
              </div>
            </div>

            {/* Mobile hamburger — modernized icon */}
            <button
              className="md:hidden w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center text-[#3d2a1a] flex-shrink-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu overlay — modernized rows + icon-based quick actions */}
        {isOpen && (
          <div className="md:hidden fixed left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto" style={{ top: `${navHeight}px` }}>
            <div className="p-5 flex flex-col gap-5">
              <SearchBox variant="mobile" onNavigate={() => setIsOpen(false)} />

              {/* Quick action icon row */}
              <div className="grid grid-cols-4 gap-2.5">
                <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="relative flex flex-col items-center gap-1.5 bg-[#FBF9F2] rounded-2xl py-3.5 border border-[#3d2a1a]/8"
                >
                  <svg className="w-5 h-5 text-[#3d2a1a]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
                  </svg>
                  <span className="text-[10px] font-semibold text-[#3d2a1a]">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="absolute top-2 right-2 bg-gradient-to-br from-[#E8C766] to-[#B8860B] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="relative flex flex-col items-center gap-1.5 bg-[#FBF9F2] rounded-2xl py-3.5 border border-[#3d2a1a]/8"
                >
                  <svg className="w-5 h-5 text-[#3d2a1a]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6" />
                  </svg>
                  <span className="text-[10px] font-semibold text-[#3d2a1a]">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute top-2 right-2 bg-gradient-to-br from-[#E8C766] to-[#B8860B] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to={isAuthenticated ? '/account' : '/login'}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col items-center gap-1.5 bg-[#FBF9F2] rounded-2xl py-3.5 border border-[#3d2a1a]/8"
                >
                  {isAuthenticated ? (
                    <span className="w-5 h-5 rounded-full bg-[#3d2a1a] text-white text-[10px] font-bold flex items-center justify-center">
                      {user?.name?.charAt(0)}
                    </span>
                  ) : (
                    <svg className="w-5 h-5 text-[#3d2a1a]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                  )}
                  <span className="text-[10px] font-semibold text-[#3d2a1a]">
                    {isAuthenticated ? 'Account' : 'Login'}
                  </span>
                </Link>

                <Link
                  to="/track-order"
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col items-center gap-1.5 bg-[#FBF9F2] rounded-2xl py-3.5 border border-[#3d2a1a]/8"
                >
                  <svg className="w-5 h-5 text-[#3d2a1a]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" />
                  </svg>
                  <span className="text-[10px] font-semibold text-[#3d2a1a]">Track</span>
                </Link>
              </div>

              <div className="flex flex-col gap-4 pt-1">
                {navLinks.map((link) => (
                  <Link key={link.label} to={link.href} onClick={() => setIsOpen(false)} className="text-sm font-medium text-[#3d2a1a]">
                    {link.label}
                  </Link>
                ))}

                {/* Categories — accordion, max 4 + View All */}
                <div className="border-b border-[#3d2a1a]/10 pb-3">
                  <button
                    onClick={() => setMobileCatOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-sm font-bold text-[#B8860B]"
                    aria-expanded={mobileCatOpen}
                  >
                    Explore By Category
                    <svg className={`w-4 h-4 transition-transform ${mobileCatOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {mobileCatOpen && categories.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-3 pl-1">
                      {visibleCategories.map((cat) => (
                        <Link
                          key={cat._id}
                          to={'/category/' + cat._id}
                          onClick={() => { setIsOpen(false); setMobileCatOpen(false) }}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <div className="w-full aspect-square rounded-lg overflow-hidden bg-[#F3E4C8] flex items-center justify-center">
                            {cat.image ? (
                              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl select-none">🛍️</span>
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-[#3d2a1a] text-center leading-snug line-clamp-2">
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                      <Link
                        to="/products"
                        onClick={() => { setIsOpen(false); setMobileCatOpen(false) }}
                        className="flex flex-col items-center justify-center gap-1.5"
                      >
                        <div className="w-full aspect-square rounded-lg bg-[#F3E4C8] flex items-center justify-center">
                          <span className="text-[#B8860B] text-xl">→</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#B8860B] text-center">All Categories</span>
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/bulk-order"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-[#3d2a1a] flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 21l1.65-4.95A9 9 0 1112 21H3z" />
                  </svg>
                  Bulk Order / B2B
                </Link>

                {/* Gifts — accordion, max 4 + View All */}
                <div className="border-t border-[#3d2a1a]/10 pt-3">
                  <button
                    onClick={() => setMobileGiftOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-sm font-semibold text-[#3d2a1a]"
                    aria-expanded={mobileGiftOpen}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M20 12v10H4V12M2 7h20v5H2V7zM12 22V7M12 7C10.5 7 8 6 8 4a2.5 2.5 0 015 0c0-1.5 1.5-2 2.5-2A2 2 0 0117.5 4c0 2-2.5 3-5.5 3z" />
                      </svg>
                      Gifts
                    </span>
                    <svg className={`w-4 h-4 transition-transform ${mobileGiftOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {mobileGiftOpen && giftOccasions.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-3 pl-2">
                      {visibleGiftOccasions.map((item) => (
                        <Link
                          key={item._id}
                          to={`/gifts/${item.slug}`}
                          onClick={() => {
                            setIsOpen(false)
                            setMobileGiftOpen(false)
                          }}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <GiftThumb
                            src={item.image}
                            alt={item.title}
                            className="w-full aspect-[4/3] object-cover rounded-lg"
                          />
                          <span className="text-[11px] font-medium text-[#3d2a1a]/80 text-center leading-snug line-clamp-2">
                            {item.title}
                          </span>
                        </Link>
                      ))}
                      <Link
                        to="/gifts"
                        onClick={() => {
                          setIsOpen(false)
                          setMobileGiftOpen(false)
                        }}
                        className="flex flex-col items-center justify-center gap-1.5 text-center"
                      >
                        <div className="w-full aspect-[4/3] rounded-lg bg-[#F3E4C8] flex items-center justify-center">
                          <span className="text-[#B8860B] text-lg">→</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#B8860B]">View All</span>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#3d2a1a]/10 pt-3" />
                <Link to={isAuthenticated ? '/account' : '/login'} onClick={() => setIsOpen(false)} className="text-sm font-medium text-[#3d2a1a]">
                  {isAuthenticated ? `Hi, ${user?.name?.split(' ')[0]}` : 'Login / Account'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ height: `${navHeight}px` }} />
    </div>
  )
}

export default Navbar
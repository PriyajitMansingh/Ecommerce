import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'

const MAX_DISPLAY = 5

const CategoriesSection = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    axiosInstance
      .get('/categories')
      .then(({ data }) => {
        if (mounted) {
          // Show only top-level categories (no parent)
          setCategories(data.filter((c) => !c.parentCategoryId))
        }
      })
      .catch(() => mounted && setCategories([]))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  // Only ever render up to MAX_DISPLAY cards here — full list lives on /categories
  const visibleCategories = categories.slice(0, MAX_DISPLAY)
  const hasMore = categories.length > MAX_DISPLAY

  if (loading) {
    return (
      <section className="bg-[#FBF9F2] py-14 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: MAX_DISPLAY }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-[#EFE3C8] aspect-square"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) return null

  return (
    <section className="bg-[#FBF9F2] py-14 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="mb-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-[#3d2a1a]">
            Shop by Category
          </h2>
          <p className="mt-2 text-sm text-[#6b5940]">
            Explore our handpicked range of premium offerings
          </p>
        </div>

        {/* Category cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {visibleCategories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat._id}`}
              className="group flex flex-col items-center bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Image area — fixed square ratio */}
              <div className="w-full aspect-square bg-[#F7F1E6] overflow-hidden flex items-center justify-center">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                {/* Fallback placeholder shown when no image or image fails */}
                <span
                  className="text-4xl select-none"
                  style={{ display: cat.image ? 'none' : 'flex' }}
                >
                  🛍️
                </span>
              </div>

              {/* Category name */}
              <div className="w-full px-3 py-3 text-center">
                <p className="font-serif text-sm md:text-base text-[#3d2a1a] font-semibold leading-tight line-clamp-2">
                  {cat.name}
                </p>
                {cat.subcategories?.length > 0 && (
                  <p className="mt-0.5 text-[11px] text-[#a89c8a]">
                    {cat.subcategories.length} varieties
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* View More — only shown if there are more than MAX_DISPLAY categories */}
        {hasMore && (
          <div className="flex justify-center mt-10">
            <Link
              to="/categories"
              className="group inline-flex items-center gap-2.5 bg-white border-2 border-[#3d2a1a] text-[#3d2a1a] text-sm font-bold px-7 py-3.5 rounded-2xl hover:bg-[#3d2a1a] hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              View More Categories
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default CategoriesSection







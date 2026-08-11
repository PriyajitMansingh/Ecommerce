import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { useCart } from '../../context/CartContext'
import almondFallback from '../../assets/images/almond.png'


const UpcomingCard = ({ product }) => {
  const image = product.imageUrl || almondFallback
  return (
    <div className="group relative bg-white rounded-2xl border border-[#3d2a1a]/8 shadow-[0_1px_4px_rgba(61,42,26,0.06)] hover:shadow-[0_16px_32px_rgba(61,42,26,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badge */}
      <span className="absolute top-3.5 left-3.5 z-10 bg-[#D4AF37] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
        Coming Soon
      </span>

      {/* Blurred / teaser image */}
      <div className="w-full aspect-square bg-gradient-to-br from-[#F7F1E6] to-[#F0E5D2] flex items-center justify-center overflow-hidden p-4 relative">
        <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/30 pointer-events-none" />
        <img
          src={image}
          alt={product.name}
          onError={(e) => { e.currentTarget.src = almondFallback }}
          className="w-full h-full object-contain opacity-55 blur-[3px] group-hover:blur-0 group-hover:opacity-90 transition-all duration-500 scale-105 group-hover:scale-110 drop-shadow-lg relative z-[1]"
        />
      </div>

      {/* Info — MRP, brand, heading description only */}
      <div className="flex flex-col flex-1 p-4 space-y-1.5">
        {product.categoryId?.name && (
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">
            {product.categoryId.name}
          </p>
        )}
        <h3 className="text-sm font-bold text-[#3d2a1a] leading-snug line-clamp-2">
          {product.name}
        </h3>
        {product.headingDescription && (
          <p className="text-[11px] text-[#6b5940] leading-relaxed line-clamp-2">
            {product.headingDescription}
          </p>
        )}
        {product.mrpPrice > 0 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[10px] text-[#a89c8a] uppercase tracking-wide">MRP</span>
            <span className="text-base font-bold text-[#3d2a1a]">₹{product.mrpPrice}</span>
          </div>
        )}
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


const CategoryPage = () => {
  const { categoryId } = useParams()
  const { addToCart } = useCart()
  const [category, setCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [justAdded, setJustAdded] = useState(null)

  const isCategoriesIndex = !categoryId

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    if (isCategoriesIndex) {
      axiosInstance
        .get('/categories')
        .then(({ data }) => {
          if (!mounted) return
          setCategory(null)
          setProducts([])
          setCategories((data || []).filter((c) => !c.parentCategoryId))
        })
        .catch(() => mounted && setError('Could not load categories.'))
        .finally(() => mounted && setLoading(false))

      return () => {
        mounted = false
      }
    }

    Promise.all([
      axiosInstance.get('/categories/' + categoryId),
      axiosInstance.get('/products'),
    ])
      .then(([catRes, prodRes]) => {
        if (!mounted) return
        setCategory(catRes.data)
        setCategories([])
        const subIds = catRes.data.subcategories?.map((s) => s._id) || []
        const filtered = prodRes.data.filter(
          (p) =>
            p.categoryId?._id === categoryId ||
            p.subcategoryId?._id === categoryId ||
            subIds.includes(p.categoryId?._id) ||
            subIds.includes(p.subcategoryId?._id)
        )
        setProducts(filtered)
      })
      .catch(() => mounted && setError('Could not load this category.'))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [categoryId, isCategoriesIndex])

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    setJustAdded(product._id)
    setTimeout(() => setJustAdded(null), 1800)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FBF9F2]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#a89c8a]">Loading…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FBF9F2] px-6">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  if (isCategoriesIndex) {
    return (
      <section className="bg-[#FBF9F2] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-6 pb-10">
          <nav className="flex items-center gap-2 text-xs text-[#a89c8a] flex-wrap mb-6">
            <Link to="/" className="hover:text-[#B8860B] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#3d2a1a] font-medium">Categories</span>
          </nav>

          <div className="mb-8">
            <h1 className="font-serif text-2xl md:text-4xl text-[#3d2a1a]">All Categories</h1>
            <p className="text-sm text-[#6b5940] mt-2">Browse our full collection of curated categories.</p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-[#a89c8a]">No categories available right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat._id}`}
                  className="group flex flex-col items-center bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
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
                    <span
                      className="text-4xl select-none"
                      style={{ display: cat.image ? 'none' : 'flex' }}
                    >
                      🛍️
                    </span>
                  </div>
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
          )}
        </div>
      </section>
    )
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FBF9F2] px-6">
        <p className="text-sm text-red-500">Category not found.</p>
      </div>
    )
  }

  const hasSubcategories = category.subcategories?.length > 0

  return (
    <section className="bg-[#FBF9F2] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs text-[#a89c8a] flex-wrap">
          <Link to="/" className="hover:text-[#B8860B] transition-colors">Home</Link>
          <span>/</span>
          {category.parentCategoryId ? (
            <>
              <Link
                to={'/category/' + category.parentCategoryId._id}
                className="hover:text-[#B8860B] transition-colors"
              >
                {category.parentCategoryId.name}
              </Link>
              <span>/</span>
            </>
          ) : null}
          <span className="text-[#3d2a1a] font-medium">{category.name}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-6 pb-10">
        <div className="flex items-center gap-5 mb-8">
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="w-16 h-16 rounded-2xl object-cover border border-[#3d2a1a]/10 shadow-sm flex-shrink-0"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          )}
          <div>
            <h1 className="font-serif text-2xl md:text-4xl text-[#3d2a1a]">{category.name}</h1>
            {category.description && (
              <p className="text-sm text-[#6b5940] mt-1">{category.description}</p>
            )}
          </div>
        </div>

        {hasSubcategories && (
          <div className="flex flex-wrap gap-2 mb-10">
            {category.subcategories.map((sub) => (
              <Link
                key={sub._id}
                to={'/category/' + sub._id}
                className="text-xs font-semibold text-[#3d2a1a] bg-white border border-[#3d2a1a]/15 rounded-full px-4 py-2 hover:bg-[#F3E4C8] hover:border-[#B8860B] transition-all"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-[#a89c8a]">No products in this category yet.</p>
            <Link to="/products" className="text-sm font-semibold text-[#B8860B] hover:underline mt-3 inline-block">
              Browse all products →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-[#a89c8a] mb-5">{products.length} product{products.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {products.map((product) => {
                const added = justAdded === product._id
                const image = product.imageUrl 
                if (product.isUpcoming) {
                  return <UpcomingCard key={product._id} product={product} />
                }
                return (
                  <div
                    key={product._id}
                    className="group bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    <Link to={'/product/' + product._id} className="block">
                      <div className="w-full aspect-square bg-[#F7F1E6] overflow-hidden flex items-center justify-center p-4">
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.currentTarget.src = almondFallback }}
                        />
                      </div>
                    </Link>

                    <div className="flex flex-col flex-1 p-4">
                      <Link to={'/product/' + product._id}>
                        <h3 className="text-sm font-semibold text-[#3d2a1a] mb-1 line-clamp-2 hover:text-[#B8860B] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      {product.weight && (
                        <span className="text-[11px] text-[#a89c8a] mb-2">{product.weight}</span>
                      )}
                      <p className="text-base font-bold text-[#B8860B] mb-3">₹{product.price}</p>

                      <div className="flex gap-2 mt-auto">
                        {product.stockQty === 0 ? (
                          <span className="flex-1 text-center text-xs font-bold py-2.5 rounded-lg bg-gray-100 text-gray-400">
                            Out of Stock
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={added}
                            className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-colors duration-300 ${
                              added
                                ? 'bg-[#3a8a5a] text-white'
                                : 'bg-[#3d2a1a] text-white hover:bg-[#B8860B]'
                            }`}
                          >
                            {added ? '✓ Added' : 'Add to Cart'}
                          </button>
                        )}
                        <Link
                          to={'/product/' + product._id}
                          className="flex-1 text-xs font-bold py-2.5 rounded-lg border border-[#3d2a1a]/20 text-[#3d2a1a] hover:bg-[#F3E4C8] transition-colors text-center"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default CategoryPage

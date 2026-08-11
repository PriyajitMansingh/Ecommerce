import GiftOccasion from '../models/GiftOccasion.js'
import GiftProduct from '../models/GiftProduct.js'

// ─── PUBLIC ─────────────────────────────────────────────────────────────────

// GET /api/gift-occasions
export const getPublicOccasions = async (req, res) => {
  try {
    const occasions = await GiftOccasion.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 })
    res.json(occasions)
  } catch (err) {
    console.error('getPublicOccasions error:', err)
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

// GET /api/gift-occasions/:slug
export const getPublicOccasionBySlug = async (req, res) => {
  try {
    const occasion = await GiftOccasion.findOne({ slug: req.params.slug, isActive: true })
    if (!occasion) return res.status(404).json({ message: 'Gift occasion not found.' })

    const products = await GiftProduct.find({ occasionId: occasion._id }).sort({ sortOrder: 1, createdAt: -1 })
    res.json({ occasion, products })
  } catch (err) {
    console.error('getPublicOccasionBySlug error:', err)
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

// ─── ADMIN — OCCASIONS ───────────────────────────────────────────────────────

// GET /api/admin/gift-occasions
export const adminGetOccasions = async (req, res) => {
  try {
    const occasions = await GiftOccasion.find().sort({ sortOrder: 1, createdAt: -1 })

    // Attach product counts
    const withCount = await Promise.all(
      occasions.map(async (occ) => {
        const productCount = await GiftProduct.countDocuments({ occasionId: occ._id })
        return { ...occ.toObject(), productCount }
      })
    )
    res.json(withCount)
  } catch (err) {
    console.error('adminGetOccasions error:', err)
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

// GET /api/admin/gift-occasions/:id
export const adminGetOccasionById = async (req, res) => {
  try {
    const occasion = await GiftOccasion.findById(req.params.id)
    if (!occasion) return res.status(404).json({ message: 'Gift occasion not found.' })
    res.json(occasion)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

// POST /api/admin/gift-occasions
export const adminCreateOccasion = async (req, res) => {
  try {
    const { title, slug, tagline, description, image, sortOrder } = req.body
    if (!title?.trim() || !slug?.trim()) {
      return res.status(400).json({ message: 'Title and slug are required.' })
    }
    const normalized = slug.trim().toLowerCase().replace(/\s+/g, '-')
    const existing = await GiftOccasion.findOne({ slug: normalized })
    if (existing) return res.status(409).json({ message: 'An occasion with this slug already exists.' })

    const occasion = await GiftOccasion.create({
      title: title.trim(),
      slug: normalized,
      tagline: tagline?.trim() || '',
      description: description?.trim() || '',
      image: image?.trim() || '',
      sortOrder: sortOrder || 0,
    })
    res.status(201).json(occasion)
  } catch (err) {
    console.error('adminCreateOccasion error:', err)
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

// PUT /api/admin/gift-occasions/:id
export const adminUpdateOccasion = async (req, res) => {
  try {
    const occasion = await GiftOccasion.findById(req.params.id)
    if (!occasion) return res.status(404).json({ message: 'Gift occasion not found.' })

    const { title, slug, tagline, description, image, sortOrder } = req.body
    if (title !== undefined) occasion.title = title.trim()
    if (slug !== undefined) occasion.slug = slug.trim().toLowerCase().replace(/\s+/g, '-')
    if (tagline !== undefined) occasion.tagline = tagline.trim()
    if (description !== undefined) occasion.description = description.trim()
    if (image !== undefined) occasion.image = image.trim()
    if (sortOrder !== undefined) occasion.sortOrder = sortOrder

    await occasion.save()
    res.json(occasion)
  } catch (err) {
    console.error('adminUpdateOccasion error:', err)
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

// DELETE /api/admin/gift-occasions/:id
export const adminDeleteOccasion = async (req, res) => {
  try {
    const occasion = await GiftOccasion.findById(req.params.id)
    if (!occasion) return res.status(404).json({ message: 'Gift occasion not found.' })

    await GiftProduct.deleteMany({ occasionId: occasion._id })
    await GiftOccasion.findByIdAndDelete(occasion._id)
    res.json({ message: `"${occasion.title}" and its products deleted.` })
  } catch (err) {
    console.error('adminDeleteOccasion error:', err)
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

// PATCH /api/admin/gift-occasions/:id/toggle-active
export const adminToggleOccasionActive = async (req, res) => {
  try {
    const occasion = await GiftOccasion.findById(req.params.id)
    if (!occasion) return res.status(404).json({ message: 'Gift occasion not found.' })
    occasion.isActive = !occasion.isActive
    await occasion.save()
    res.json(occasion)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

// ─── ADMIN — GIFT PRODUCTS ───────────────────────────────────────────────────

// GET /api/admin/gift-occasions/:occasionId/products
export const adminGetProducts = async (req, res) => {
  try {
    const products = await GiftProduct.find({ occasionId: req.params.occasionId }).sort({ sortOrder: 1, createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

// POST /api/admin/gift-occasions/:occasionId/products
export const adminAddProduct = async (req, res) => {
  try {
    const occasion = await GiftOccasion.findById(req.params.occasionId)
    if (!occasion) return res.status(404).json({ message: 'Gift occasion not found.' })

    const { name, price, oldPrice, weight, image } = req.body
    if (!name?.trim() || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required.' })
    }
    const product = await GiftProduct.create({
      occasionId: occasion._id,
      name: name.trim(),
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      weight: weight?.trim() || '',
      image: image?.trim() || '',
    })
    res.status(201).json(product)
  } catch (err) {
    console.error('adminAddProduct error:', err)
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

// PUT /api/admin/gift-products/:id
export const adminUpdateProduct = async (req, res) => {
  try {
    const product = await GiftProduct.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Gift product not found.' })

    const { name, price, oldPrice, weight, image } = req.body
    if (name !== undefined) product.name = name.trim()
    if (price !== undefined) product.price = Number(price)
    if (oldPrice !== undefined) product.oldPrice = oldPrice ? Number(oldPrice) : null
    if (weight !== undefined) product.weight = weight.trim()
    if (image !== undefined) product.image = image.trim()

    await product.save()
    res.json(product)
  } catch (err) {
    console.error('adminUpdateProduct error:', err)
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

// DELETE /api/admin/gift-products/:id
export const adminDeleteProduct = async (req, res) => {
  try {
    const product = await GiftProduct.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Gift product not found.' })
    await GiftProduct.findByIdAndDelete(product._id)
    res.json({ message: `"${product.name}" deleted.` })
  } catch (err) {
    console.error('adminDeleteProduct error:', err)
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

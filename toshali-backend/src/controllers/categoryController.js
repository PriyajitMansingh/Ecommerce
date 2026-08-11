import Category from '../models/Category.js'
import Product from '../models/Product.js'

const buildSlug = (value) => {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const ensureUniqueSlug = async (baseSlug) => {
  let slug = buildSlug(baseSlug)
  if (!slug) {
    slug = `category-${Date.now()}`
  }

  let candidate = slug
  let counter = 1
  while (await Category.findOne({ slug: candidate })) {
    candidate = `${slug}-${counter}`
    counter += 1
  }

  return candidate
}

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, parentCategoryId } = req.body

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Category name is required.' })
    }

    const normalizedName = String(name).trim()
    let normalizedSlug = buildSlug(slug || normalizedName)

    if (!normalizedSlug) {
      return res.status(400).json({ message: 'A valid category slug is required.' })
    }

    normalizedSlug = await ensureUniqueSlug(normalizedSlug)

    if (parentCategoryId) {
      const parentCategory = await Category.findById(parentCategoryId)
      if (!parentCategory) {
        return res.status(404).json({ message: 'Parent category not found.' })
      }
    }

    const category = await Category.create({
      name: normalizedName,
      slug: normalizedSlug,
      description: description?.trim() || '',
      image: image?.trim() || '',
      parentCategoryId: parentCategoryId || null,
    })

    if (parentCategoryId) {
      await Category.findByIdAndUpdate(parentCategoryId, { $addToSet: { subcategories: category._id } })
    }

    res.status(201).json(category)
  } catch (error) {
    console.error('createCategory error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parentCategoryId', 'name slug')
      .populate('subcategories', 'name slug')
      .sort({ name: 1 })

    res.status(200).json(categories)
  } catch (error) {
    console.error('getCategories error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId)
      .populate('parentCategoryId', 'name slug')
      .populate('subcategories', 'name slug')

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' })
    }

    res.status(200).json(category)
  } catch (error) {
    console.error('getCategoryById error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId)
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' })
    }

    const { name, slug, description, image, parentCategoryId, isActive } = req.body

    if (name !== undefined && String(name).trim()) {
      category.name = String(name).trim()
    }

    if (slug !== undefined) {
      category.slug = buildSlug(slug || category.name)
    }

    if (description !== undefined) {
      category.description = String(description).trim()
    }

    if (image !== undefined) {
      category.image = String(image).trim()
    }

    if (parentCategoryId !== undefined) {
      if (parentCategoryId) {
        const parentCategory = await Category.findById(parentCategoryId)
        if (!parentCategory) {
          return res.status(404).json({ message: 'Parent category not found.' })
        }
      }
      category.parentCategoryId = parentCategoryId || null
    }

    if (isActive !== undefined) {
      category.isActive = Boolean(isActive)
    }

    await category.save()
    res.status(200).json(category)
  } catch (error) {
    console.error('updateCategory error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId)
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' })
    }

    const subcategoriesCount = await Category.countDocuments({ parentCategoryId: category._id })
    const productsCount = await Product.countDocuments({ categoryId: category._id })

    if (subcategoriesCount > 0 || productsCount > 0) {
      return res.status(409).json({ message: 'Cannot delete a category that still has subcategories or products.' })
    }

    if (category.parentCategoryId) {
      await Category.findByIdAndUpdate(category.parentCategoryId, { $pull: { subcategories: category._id } })
    }

    await Category.findByIdAndDelete(category._id)
    res.status(200).json({ message: 'Category deleted successfully.' })
  } catch (error) {
    console.error('deleteCategory error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

export const createSubcategory = async (req, res) => {
  try {
    const parentCategory = await Category.findById(req.params.categoryId)
    if (!parentCategory) {
      return res.status(404).json({ message: 'Parent category not found.' })
    }

    const { name, slug, description, image } = req.body
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Subcategory name is required.' })
    }

    const normalizedName = String(name).trim()
    const normalizedSlug = buildSlug(slug || normalizedName)

    const existing = await Category.findOne({ $or: [{ name: normalizedName }, { slug: normalizedSlug }] })
    if (existing) {
      const fallbackSlug = await ensureUniqueSlug(normalizedSlug)
      const subcategory = await Category.create({
        name: normalizedName,
        slug: fallbackSlug,
        description: description?.trim() || '',
        image: image?.trim() || '',
        parentCategoryId: parentCategory._id,
      })

      parentCategory.subcategories.push(subcategory._id)
      await parentCategory.save()

      return res.status(201).json(subcategory)
    }

    const subcategory = await Category.create({
      name: normalizedName,
      slug: normalizedSlug,
      description: description?.trim() || '',
      image: image?.trim() || '',
      parentCategoryId: parentCategory._id,
    })

    parentCategory.subcategories.push(subcategory._id)
    await parentCategory.save()

    res.status(201).json(subcategory)
  } catch (error) {
    console.error('createSubcategory error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}
import express from 'express'
import {
  createCategory,
  createSubcategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryController.js'
import { protect, adminOnly } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getCategories)
router.get('/:categoryId', getCategoryById)
router.post('/', protect, adminOnly, createCategory)
router.put('/:categoryId', protect, adminOnly, updateCategory)
router.delete('/:categoryId', protect, adminOnly, deleteCategory)
router.post('/:categoryId/subcategories', protect, adminOnly, createSubcategory)

export default router
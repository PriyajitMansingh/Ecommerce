import express from 'express'
import {
  createProduct,
  getAllProducts,
  getAllProductsAdmin,
  getProductByIdAdmin,
  getProductHistory,
  updateProduct,
  toggleProductActive,
  toggleProductSale,
  deleteProduct,
  uploadProductImage as uploadImageController,
  getProductById,
  getUpcomingProducts,
  searchProducts,
} from '../controllers/productController.js'
import { protect, adminOnly } from '../middlewares/authMiddleware.js'
import { uploadProductImage } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

// ===== ADMIN-ONLY routes — declared before /:id to avoid slug collision =====
router.get('/admin/all', protect, adminOnly, getAllProductsAdmin)
router.get('/admin/:id/history', protect, adminOnly, getProductHistory)
router.get('/admin/:id', protect, adminOnly, getProductByIdAdmin)

// Image upload — multer middleware processes the multipart file, then controller returns the URL
router.post(
  '/upload-image',
  protect,
  adminOnly,
  uploadProductImage.single('image'),
  uploadImageController
)

router.post('/', protect, adminOnly, createProduct)
router.put('/:id', protect, adminOnly, updateProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)
router.patch('/:id/toggle-active', protect, adminOnly, toggleProductActive)
router.patch('/:id/toggle-sale', protect, adminOnly, toggleProductSale)

// ===== PUBLIC routes =====
router.get('/', getAllProducts)
router.get('/search', searchProducts)
router.get('/upcoming', getUpcomingProducts)
router.get('/:id', getProductById)
export default router

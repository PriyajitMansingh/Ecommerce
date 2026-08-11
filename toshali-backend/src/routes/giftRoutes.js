import express from 'express'
import {
  getPublicOccasions,
  getPublicOccasionBySlug,
  adminGetOccasions,
  adminGetOccasionById,
  adminCreateOccasion,
  adminUpdateOccasion,
  adminDeleteOccasion,
  adminToggleOccasionActive,
  adminGetProducts,
  adminAddProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from '../controllers/giftController.js'
import { protect, adminOnly as adminAuth } from '../middlewares/authMiddleware.js'

// ─── Public Routes ────────────────────────────────────────────────────────────
// Mounted at /api/gift-occasions
export const publicGiftRouter = express.Router()
publicGiftRouter.get('/', getPublicOccasions)              // GET /api/gift-occasions
publicGiftRouter.get('/:slug', getPublicOccasionBySlug)    // GET /api/gift-occasions/:slug

// ─── Admin Occasion Routes ────────────────────────────────────────────────────
// Mounted at /api/admin/gift-occasions
export const adminGiftRouter = express.Router()
adminGiftRouter.get('/', protect, adminAuth, adminGetOccasions)
adminGiftRouter.post('/', protect, adminAuth, adminCreateOccasion)

// Product sub-routes MUST come before /:id routes to avoid Express
// matching "/:id/products" as /:id with literal "products" as the id.
adminGiftRouter.get('/:occasionId/products', protect, adminAuth, adminGetProducts)
adminGiftRouter.post('/:occasionId/products', protect, adminAuth, adminAddProduct)

adminGiftRouter.get('/:id', protect, adminAuth, adminGetOccasionById)
adminGiftRouter.put('/:id', protect, adminAuth, adminUpdateOccasion)
adminGiftRouter.delete('/:id', protect, adminAuth, adminDeleteOccasion)
adminGiftRouter.patch('/:id/toggle-active', protect, adminAuth, adminToggleOccasionActive)

// ─── Admin Gift Product Routes ────────────────────────────────────────────────
// Mounted at /api/admin/gift-products
export const adminGiftProductRouter = express.Router()
adminGiftProductRouter.put('/:id', protect, adminAuth, adminUpdateProduct)
adminGiftProductRouter.delete('/:id', protect, adminAuth, adminDeleteProduct)

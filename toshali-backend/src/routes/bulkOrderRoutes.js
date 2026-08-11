import express from 'express'
import { createBulkOrder, getAllBulkOrdersAdmin, updateBulkOrderAdmin } from '../controllers/bulkOrderController.js'
import { protect, adminOnly } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', createBulkOrder)

router.use(protect, adminOnly)
router.get('/admin/all', getAllBulkOrdersAdmin)
router.put('/admin/:bulkOrderId', updateBulkOrderAdmin)

export default router

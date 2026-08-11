import express from 'express'
import { getAddresses, addAddress, updateAddress, deleteAddress, setPrimaryAddress} from '../controllers/addressController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/', getAddresses)
router.post('/', addAddress)
router.patch('/:addressId', updateAddress)
router.delete('/:addressId', deleteAddress)
router.patch('/:addressId/primary', setPrimaryAddress)
router.patch('/addresses/:addressId/primary', setPrimaryAddress)
export default router
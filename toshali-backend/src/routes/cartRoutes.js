import express from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart, mergeCart } from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/merge', mergeCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeCartItem);
router.delete('/', clearCart);

export default router;
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import GiftProduct from '../models/GiftProduct.js';

async function findOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

async function toCartResponse(cart) {
  const items = [];

  for (const entry of cart.items || []) {
    const productType = entry.productType || 'product';
    let productDoc = null;

    if (productType === 'gift') {
      productDoc = await GiftProduct.findById(entry.product);
    } else {
      productDoc = await Product.findById(entry.product);
      if (productDoc && !productDoc.isActive) productDoc = null;
    }

    if (!productDoc) continue;

    items.push({
      productId: productDoc._id,
      productType,
      name: productDoc.name,
      price: productDoc.price,
      imageUrl: productDoc.imageUrl || productDoc.image || '',
      quantity: entry.quantity,
      lineTotal: productDoc.price * entry.quantity,
    });
  }

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  return { items, subtotal };
}

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const cart = await findOrCreateCart(req.user._id);
    res.json(await toCartResponse(cart));
  } catch (error) {
    console.error('getCart failed:', error.message);
    res.status(500).json({ message: 'Failed to load cart.', debug: error.message });
  }
};

// POST /api/cart/add   { productId, quantity }
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, productType = 'product' } = req.body;
    const normalizedType = productType === 'gift' ? 'gift' : 'product';

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    let product = null;
    if (normalizedType === 'gift') {
      product = await GiftProduct.findById(productId);
    } else {
      product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (quantity > product.stockQty) {
        return res.status(400).json({ message: 'Not enough stock' });
      }
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await findOrCreateCart(req.user._id);
    const existing = cart.items.find((i) => i.product.toString() === productId && (i.productType || 'product') === normalizedType);

    if (existing) existing.quantity += quantity;
    else cart.items.push({ product: productId, productType: normalizedType, quantity });

    await cart.save();
    res.status(201).json({ message: 'Added to cart', cart: await toCartResponse(cart) });
  } catch (error) {
    console.error('addToCart failed:', error.message);
    res.status(500).json({ message: 'Failed to add to cart.', debug: error.message });
  }
};

// PUT /api/cart/:productId   { quantity }
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await findOrCreateCart(req.user._id);
    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.quantity = quantity;
    await cart.save();
    res.json({ message: 'Cart updated', cart: await toCartResponse(cart) });
  } catch (error) {
    console.error('updateCartItem failed:', error.message);
    res.status(500).json({ message: 'Failed to update cart.', debug: error.message });
  }
};

// DELETE /api/cart/:productId
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await findOrCreateCart(req.user._id);
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    res.json({ message: 'Item removed', cart: await toCartResponse(cart) });
  } catch (error) {
    console.error('removeCartItem failed:', error.message);
    res.status(500).json({ message: 'Failed to remove item.', debug: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await findOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared', cart: await toCartResponse(cart) });
  } catch (error) {
    console.error('clearCart failed:', error.message);
    res.status(500).json({ message: 'Failed to clear cart.', debug: error.message });
  }
};

export { findOrCreateCart, toCartResponse };
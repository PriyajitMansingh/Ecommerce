// src/controllers/wishlistController.js
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

async function findOrCreateWishlist(userId) {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });
  return wishlist;
}

async function toWishlistResponse(wishlist) {
  const populated = await wishlist.populate('products');
  const products = populated.products.filter((p) => p && p.isActive);
  return { products };
}

// GET /api/wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await findOrCreateWishlist(req.user._id);
    const payload = await toWishlistResponse(wishlist);
    res.json({ wishlist: payload });
  } catch (error) {
    console.error('getWishlist failed:', error.message);
    res.status(500).json({ message: 'Failed to load wishlist.', debug: error.message });
  }
};

// POST /api/wishlist/add   { productId }
export const addToWishlist = async (req, res) => {
  try { 
    console.log("it is reaching")
    console.log(req.body)
    const { productId } = req.body;
    console.log(productId)
    const product = await Product.findById(productId);
    console.log(product)
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log("reached")

    const wishlist = await findOrCreateWishlist(req.user._id);
    const alreadyIn = wishlist.products.some((p) => p.toString() === productId);
    if (!alreadyIn) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const payload = await toWishlistResponse(wishlist);
    res.status(201).json({ message: 'Added to wishlist', wishlist: payload });
  } catch (error) {
    console.error('addToWishlist failed:', error.message);
    res.status(500).json({ message: 'Failed to add to wishlist.', debug: error.message });
  }
};

// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await findOrCreateWishlist(req.user._id);
    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
    await wishlist.save();
    const payload = await toWishlistResponse(wishlist);
    res.json({ message: 'Removed from wishlist', wishlist: payload });
  } catch (error) {
    console.error('removeFromWishlist failed:', error.message);
    res.status(500).json({ message: 'Failed to remove from wishlist.', debug: error.message });
  }
};
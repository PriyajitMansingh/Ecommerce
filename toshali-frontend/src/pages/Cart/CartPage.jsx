
import React, { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import CheckoutModal from '../../components/common/CheckoutModal'
import axiosInstance from '../../api/axiosInstance'
import almondLoose from '../../assets/images/almond-loose.png'
import cashewLoose from '../../assets/images/cashew-loose.png'

const LoginRequiredModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-7 text-center">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 text-[#a89c8a] hover:text-[#3d2a1a] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="w-16 h-16 mx-auto rounded-full bg-[#F3E4C8] flex items-center justify-center text-[#B8860B] mb-5">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect x="3" y="10" width="18" height="10" rx="2" />
          <path d="M7 10V7a5 5 0 0110 0v3" />
        </svg>
      </div>

      <h3 className="font-serif text-xl text-[#3d2a1a] mb-2">Please log in to continue</h3>
      <p className="text-sm text-[#6b5940] mb-7">
        You need to be signed in to place an order. Log in or create an account to proceed to checkout.
      </p>

      <div className="flex flex-col gap-3">
        <Link
          to="/login"
          className="w-full bg-[#3d2a1a] text-white text-sm font-bold py-3 rounded-lg hover:bg-[#2b1d14] transition-colors"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="w-full border border-[#3d2a1a]/15 text-[#3d2a1a] text-sm font-bold py-3 rounded-lg hover:bg-[#F3E4C8] transition-colors"
        >
          Create Account
        </Link>
        <button
          onClick={onClose}
          className="text-xs font-semibold text-[#a89c8a] hover:text-[#3d2a1a] transition-colors mt-1"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(false)

  const originalTotal = items.reduce(
    (sum, item) => sum + (item.oldPrice || item.price) * item.quantity,
    0
  )
  const discount = originalTotal - cartTotal
  const shipping = cartTotal >= 499 || cartTotal === 0 ? 0 : 49
  const grandTotal = cartTotal + shipping

  const handleProceedToCheckout = async () => {
    setCheckingAuth(true)
    try {
      await axiosInstance.get('/auth/me')
      // User is authenticated
      setShowCheckout(true)
    } catch (err) {
      // 401/403 -> not logged in. Any other error also falls back to login prompt.
      setShowLoginPrompt(true)
    } finally {
      setCheckingAuth(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 bg-[#FBF9F2] overflow-hidden">
        <img src={almondLoose} alt="" className="hidden md:block absolute top-16 left-10 w-24 rotate-[-15deg] opacity-70 pointer-events-none drop-shadow-lg" />
        <img src={cashewLoose} alt="" className="hidden md:block absolute bottom-16 right-10 w-24 rotate-[12deg] opacity-70 pointer-events-none drop-shadow-lg" />
        <div className="w-20 h-20 rounded-full bg-[#F3E4C8] flex items-center justify-center text-[#B8860B] mb-6">
          <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-[#3d2a1a] mb-2">Your cart is empty</h2>
        <p className="text-sm text-[#6b5940] mb-8">Looks like you haven't added anything yet.</p>
        <div className="flex items-center gap-4">
          <Link
            to="/products"
            className="bg-[#3d2a1a] text-white text-sm font-bold px-7 py-3.5 rounded-full hover:bg-[#2b1d14] transition-colors"
          >
            Start Shopping
          </Link>
          <Link
            to="/"
            className="text-sm font-semibold text-[#6b5940] hover:text-[#B8860B] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-[70vh] bg-[#FBF9F2] px-6 md:px-12 py-14 overflow-hidden">
      <img src={almondLoose} alt="" className="hidden lg:block absolute top-10 left-6 w-20 rotate-[-15deg] opacity-60 pointer-events-none drop-shadow-lg" />
      <img src={cashewLoose} alt="" className="hidden lg:block absolute bottom-10 right-6 w-20 rotate-[12deg] opacity-60 pointer-events-none drop-shadow-lg" />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Page header with step indicator, like a real checkout flow */}
        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-[#3d2a1a] mb-3">Your Cart</h1>
          <div className="flex items-center gap-2 text-xs text-[#a89c8a]">
            <span className="font-bold text-[#3d2a1a]">1. Cart</span>
            <span>→</span>
            <span>2. Payment</span>
            <span>→</span>
            <span>3. Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* Cart items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl border border-[#3d2a1a]/10 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 rounded-xl bg-[#FBF9F2] flex items-center justify-center flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-contain" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-[#3d2a1a] mb-1">{item.name}</h3>
                  <p className="text-xs text-[#a89c8a] mb-2">{item.shortDescription}</p>
                  <p className="text-base font-bold text-[#B8860B]">₹{item.price}</p>
                </div>

                <div className="flex items-center border border-[#3d2a1a]/15 rounded-lg flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, item.name, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-[#3d2a1a] hover:bg-[#F3E4C8] transition-colors rounded-l-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-[#3d2a1a]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.name, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#3d2a1a] hover:bg-[#F3E4C8] transition-colors rounded-r-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <p className="w-20 text-right text-sm font-bold text-[#3d2a1a] flex-shrink-0">
                  ₹{item.price * item.quantity}
                </p>

                <button
                  onClick={() => removeFromCart(item.productId, item.name)}
                  aria-label="Remove item"
                  className="text-[#a89c8a] hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            <div className="flex items-center gap-5 mt-2">
              <Link
                to="/#bestsellers"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b5940] hover:text-[#B8860B] transition-colors"
              >
                ← Continue Shopping
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b5940] hover:text-[#B8860B] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M3 12l9-9 9 9M5 10v10h14V10" />
                </svg>
                Home
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-[#3d2a1a]/10 p-6 shadow-sm h-fit sticky top-24">
            <h3 className="font-serif text-lg text-[#3d2a1a] mb-5">Order Summary</h3>

            <div className="space-y-3 text-sm text-[#6b5940] mb-5">
              <div className="flex justify-between">
                <span>Subtotal (MRP)</span>
                <span className="font-semibold text-[#3d2a1a]">₹{originalTotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="font-semibold text-[#3a8a5a]">− ₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium text-[#a89c8a]">Inclusive of all taxes</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-[#3d2a1a]">
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[11px] text-[#B8860B] bg-[#F3E4C8] px-3 py-2 rounded-lg">
                  Add ₹{499 - cartTotal} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-[#3d2a1a]/10 pt-4 mb-6 flex justify-between">
              <span className="font-bold text-[#3d2a1a]">Total</span>
              <span className="font-bold text-lg text-[#B8860B]">₹{grandTotal}</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={checkingAuth}
              className="w-full bg-[#3d2a1a] text-white text-sm font-bold py-3.5 rounded-lg hover:bg-[#2b1d14] hover:shadow-lg transition-all mb-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checkingAuth ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Checking...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-[#a89c8a]">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="10" width="18" height="10" rx="2" />
                  <path d="M7 10V7a5 5 0 0110 0v3" />
                </svg>
                Secure Checkout
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 12a9 9 0 1015-6.7M3 12V5m0 7h7" />
                </svg>
                Easy Returns
              </span>
            </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} />
      )}

      {showLoginPrompt && (
        <LoginRequiredModal onClose={() => setShowLoginPrompt(false)} />
      )}
    </div>
    </>
  )
}

export default CartPage
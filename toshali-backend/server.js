import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './src/config/db.js'
import authRoutes from './src/routes/authRoutes.js'
import categoryRoutes from './src/routes/categoryRoutes.js'
import productRoutes from './src/routes/productRoutes.js'
import utilRoutes from './src/routes/utilRoutes.js'
import accountRoutes from './src/routes/accountRoutes.js'
import cartRoutes from './src/routes/cartRoutes.js'
import orderRoutes from './src/routes/orderRoutes.js'
import bulkOrderRoutes from './src/routes/bulkOrderRoutes.js'
import paymentRoutes from './src/routes/paymentRoutes.js'
import { publicGiftRouter, adminGiftRouter, adminGiftProductRouter } from './src/routes/giftRoutes.js'
import wishlistRoutes from './src/routes/wishlistRoutes.js'
import addressRoutes from './src/routes/addressRoutes.js'
import couponRoutes from './src/routes/couponRoutes.js'
import dns from 'dns'

dns.setServers(["8.8.8.8", "8.8.4.4"]); // Google DNS
dotenv.config()
connectDB()

const app = express()

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
   'https://ecommerce-mpvq.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true)

      // Allow listed origins or any localhost/127.0.0.1 origin in dev
      const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      if (allowedOrigins.includes(origin) || isLocalhost) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)

app.use(express.json())
app.use(cookieParser())

// Serve uploaded product images statically
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')))

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'House of Toshali API is running' })
})

app.get('/', (req, res) => {
  res.send('House of Toshali Backend is live 🚀')
})

app.use('/api/auth', authRoutes)
app.use('/api/address', addressRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/admin/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/utils', utilRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/bulk-orders', bulkOrderRoutes)
app.use('/api/checkout', orderRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/gift-occasions', publicGiftRouter)
app.use('/api/admin/gift-occasions', adminGiftRouter)
app.use('/api/admin/gift-products', adminGiftProductRouter)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/coupon', couponRoutes)


app.use((err, req, res, next) => {
  console.error('Unhandled error:', err) 
  res.status(500).json({ message: 'Something went wrong. Please try again later.' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
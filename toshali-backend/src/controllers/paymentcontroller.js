// import crypto from 'crypto'
// import Razorpay from 'razorpay'
// import Order from '../models/Order.js'
// import Payment from '../models/Payment.js'

// const getRazorpayInstance = () => {
//   const keyId = process.env.RAZORPAY_KEY_ID
//   const keySecret = process.env.RAZORPAY_KEY_SECRET
//   if (!keyId || !keySecret) {
//     return null
//   }
//   return new Razorpay({ key_id: keyId, key_secret: keySecret })
// }

// // POST /api/payments/create — initiate a payment for an order
// export const createPayment = async (req, res) => {
//   try {
//     const { orderId, method, upiId } = req.body

//     if (!orderId || !method) {
//       return res.status(400).json({ message: 'orderId and method are required.' })
//     }

//     const order = await Order.findOne({ _id: orderId, userId: req.user._id })
//     if (!order) return res.status(404).json({ message: 'Order not found.' })
//     if (order.paymentStatus === 'paid') {
//       return res.status(400).json({ message: 'This order has already been paid.' })
//     }

//     // Check if a payment record already exists for this order
//     let payment = await Payment.findOne({ orderId: order._id })

//     const attempt = {
//       method,
//       amount: order.grandTotal,
//       status: 'initiated',
//       attemptedAt: new Date(),
//     }

//     let gatewayOrderId = ''

//     // For online payment methods, create a Razorpay Order
//     if (method !== 'cod') {
//       const razorpay = getRazorpayInstance()
//       if (razorpay) {
//         try {
//           const rzpOrder = await razorpay.orders.create({
//             amount: Math.round(order.grandTotal * 100), // in paise
//             currency: 'INR',
//             receipt: `rcpt_${order._id.toString().slice(-10)}`,
//             notes: {
//               orderNumber: order.orderNumber,
//               userId: req.user._id.toString(),
//             },
//           })
//           gatewayOrderId = rzpOrder.id
//         } catch (err) {
//           console.error('Razorpay order creation error:', err)
//           gatewayOrderId = `order_rzp_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`
//         }
//       } else {
//         gatewayOrderId = `order_rzp_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`
//       }
//     }

//     if (payment) {
//       payment.method = method
//       payment.upiId = upiId || ''
//       if (gatewayOrderId) payment.gatewayOrderId = gatewayOrderId
//       payment.attempts.push(attempt)
//       await payment.save()
//     } else {
//       payment = await Payment.create({
//         orderId: order._id,
//         userId: req.user._id,
//         amount: order.grandTotal,
//         method,
//         upiId: upiId || '',
//         gatewayOrderId,
//         status: 'pending',
//         attempts: [attempt],
//       })
//     }

//     // For COD — mark order as confirmed immediately
//     if (method === 'cod') {
//       payment.status = 'success'
//       payment.attempts[payment.attempts.length - 1].status = 'success'
//       await payment.save()

//       order.paymentStatus = 'paid'
//       order.orderStatus = 'confirmed'
//       order.statusHistory.push({ status: 'confirmed', note: 'Cash on Delivery confirmed.' })
//       await order.save()

//       return res.json({
//         paymentId: payment._id,
//         status: 'success',
//         method: 'cod',
//         orderNumber: order.orderNumber,
//         message: 'Cash on Delivery order confirmed.',
//       })
//     }

//     // For UPI / Card / Netbanking / Wallet
//     const upiVpa = process.env.RAZORPAY_UPI_VPA || 'houseoftoshali@upi'
//     const upiString = `upi://pay?pa=${upiVpa}&pn=HouseOfToshali&am=${order.grandTotal}&cu=INR&tn=Order-${order.orderNumber}`

//     res.json({
//       paymentId: payment._id,
//       orderId: order._id,
//       orderNumber: order.orderNumber,
//       amount: Math.round(order.grandTotal * 100), // in paise
//       amountInRupees: order.grandTotal,
//       currency: 'INR',
//       method,
//       status: 'pending',
//       razorpayOrderId: payment.gatewayOrderId || gatewayOrderId,
//       razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_toshali_default',
//       upiString: method === 'upi' ? upiString : null,
//       customerName: req.user.name || order.shippingAddress.fullName,
//       customerEmail: req.user.email || '',
//       customerMobile: order.shippingAddress.mobile || '',
//     })
//   } catch (error) {
//     console.error('createPayment error:', error)
//     res.status(500).json({ message: 'Could not initiate payment.' })
//   }
// }

// // POST /api/payments/verify — mark payment success after verification
// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       paymentId,
//       gatewayOrderId,
//       gatewayPaymentId,
//       gatewaySignature,
//       status,
//       reason,
//     } = req.body

//     const payment = await Payment.findById(paymentId)
//     if (!payment) return res.status(404).json({ message: 'Payment record not found.' })

//     const order = await Order.findOne({ _id: payment.orderId, userId: req.user._id })
//     if (!order) return res.status(404).json({ message: 'Order not found.' })

//     let isSignatureValid = false

//     if (gatewayOrderId && gatewayPaymentId && gatewaySignature && process.env.RAZORPAY_KEY_SECRET) {
//       const generatedSignature = crypto
//         .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//         .update(`${gatewayOrderId}|${gatewayPaymentId}`)
//         .digest('hex')

//       isSignatureValid = generatedSignature === gatewaySignature
//     } else {
//       isSignatureValid = status === 'success'
//     }

//     const resolvedStatus = isSignatureValid ? 'success' : 'failed'

//     payment.status = resolvedStatus
//     if (gatewayOrderId) payment.gatewayOrderId = gatewayOrderId
//     payment.gatewayPaymentId = gatewayPaymentId || payment.gatewayPaymentId || `pay_${Date.now()}`
//     if (gatewaySignature) payment.gatewaySignature = gatewaySignature

//     // Update last attempt
//     if (payment.attempts.length > 0) {
//       payment.attempts[payment.attempts.length - 1].status = resolvedStatus
//       payment.attempts[payment.attempts.length - 1].gatewayRef = payment.gatewayPaymentId
//       if (resolvedStatus === 'failed') {
//         payment.attempts[payment.attempts.length - 1].failureReason = reason || 'Payment verification failed'
//       }
//     }

//     await payment.save()

//     if (resolvedStatus === 'success') {
//       order.paymentStatus = 'paid'
//       order.orderStatus = 'confirmed'
//       order.statusHistory.push({
//         status: 'confirmed',
//         note: `Payment verified via ${payment.method.toUpperCase()} (${payment.gatewayPaymentId}).`,
//       })
//       await order.save()
//     }

//     res.json({
//       paymentId: payment._id,
//       status: resolvedStatus,
//       orderNumber: order.orderNumber,
//       orderStatus: order.orderStatus,
//       paymentStatus: order.paymentStatus,
//       gatewayPaymentId: payment.gatewayPaymentId,
//     })
//   } catch (error) {
//     console.error('verifyPayment error:', error)
//     res.status(500).json({ message: 'Could not verify payment.' })
//   }
// }

// // GET /api/payments/:orderId/status
// export const getPaymentStatus = async (req, res) => {
//   try {
//     const order = await Order.findOne({ _id: req.params.orderId })
//       .select('orderNumber paymentStatus orderStatus grandTotal paymentMethod')
//     if (!order) return res.status(404).json({ message: 'Order not found.' })

//     const payment = await Payment.findOne({ orderId: order._id })
//       .select('status method amount gatewayOrderId gatewayPaymentId gatewaySignature updatedAt')

//     res.json({
//       orderNumber: order.orderNumber,
//       paymentStatus: order.paymentStatus,
//       orderStatus: order.orderStatus,
//       grandTotal: order.grandTotal,
//       paymentMethod: order.paymentMethod,
//       paymentRecord: payment || null,
//     })
//   } catch (error) {
//     res.status(500).json({ message: 'Could not fetch payment status.' })
//   }
// }

// // GET /api/payments/:orderId/attempts
// export const getPaymentAttempts = async (req, res) => {
//   try {
//     const order = await Order.findOne({ _id: req.params.orderId })
//     if (!order) return res.status(404).json({ message: 'Order not found.' })

//     const payment = await Payment.findOne({ orderId: order._id }).select('attempts status')
//     res.json({ attempts: payment?.attempts || [], status: payment?.status || 'none' })
//   } catch (error) {
//     res.status(500).json({ message: 'Could not fetch payment attempts.' })
//   }
// }












import crypto from 'crypto'
import Razorpay from 'razorpay'
import Order from '../models/Order.js'
import Payment from '../models/Payment.js'
import mongoose from 'mongoose'

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return null
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

// POST /api/payments/create — initiate a payment for an order
export const createPayment = async (req, res) => {
  try {
    const { orderId, method, upiId } = req.body

    if (!orderId || !method) {
      return res.status(400).json({ message: 'orderId and method are required.' })
    }

    // Validate payment method
    const validMethods = ['cod', 'upi', 'card', 'netbanking', 'wallet']
    if (!validMethods.includes(method)) {
      return res.status(400).json({ message: 'Invalid payment method.' })
    }

    const order = await Order.findOne({ _id: orderId, userId: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'This order has already been paid.' })
    }

    // Check if payment record exists with pending status
    let payment = await Payment.findOne({ 
      orderId: order._id,
      status: { $in: ['pending', 'initiated'] }
    })

    // If pending payment exists, return it instead of creating new
    if (payment) {
      // For COD, handle separately
      if (method === 'cod') {
        return res.status(400).json({ 
          message: 'Payment already initiated. Please check your payment status.' 
        })
      }

      // Return existing payment details
      const upiVpa = process.env.RAZORPAY_UPI_VPA || 'houseoftoshali@upi'
      const upiString = `upi://pay?pa=${upiVpa}&pn=HouseOfToshali&am=${order.grandTotal}&cu=INR&tn=Order-${order.orderNumber}`

      return res.json({
        paymentId: payment._id,
        orderId: order._id,
        orderNumber: order.orderNumber,
        amount: Math.round(order.grandTotal * 100),
        amountInRupees: order.grandTotal,
        currency: 'INR',
        method: payment.method,
        status: payment.status,
        razorpayOrderId: payment.gatewayOrderId,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        upiString: method === 'upi' ? upiString : null,
        customerName: req.user.name || order.shippingAddress.fullName,
        customerEmail: req.user.email || '',
        customerMobile: order.shippingAddress.mobile || '',
      })
    }

    const attempt = {
      method,
      amount: order.grandTotal,
      status: 'initiated',
      attemptedAt: new Date(),
    }

    let gatewayOrderId = ''

    // For online payment methods, create a Razorpay Order
    if (method !== 'cod') {
      const razorpay = getRazorpayInstance()
      if (!razorpay) {
        return res.status(503).json({ 
          message: 'Payment system is not properly configured.' 
        })
      }

      try {
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(order.grandTotal * 100),
          currency: 'INR',
          receipt: `rcpt_${order._id.toString().slice(-10)}`,
          notes: {
            orderNumber: order.orderNumber,
            userId: req.user._id.toString(),
          },
        })
        gatewayOrderId = rzpOrder.id
      } catch (err) {
        console.error('Razorpay order creation error:', err)
        return res.status(503).json({ 
          message: 'Payment gateway is temporarily unavailable. Please try again later.' 
        })
      }
    }

    // Create new payment record
    payment = await Payment.create({
      orderId: order._id,
      userId: req.user._id,
      amount: order.grandTotal,
      method,
      upiId: upiId || '',
      gatewayOrderId,
      status: method === 'cod' ? 'success' : 'pending',
      attempts: [attempt],
    })

    // For COD — mark order as confirmed immediately
    if (method === 'cod') {
      payment.attempts[0].status = 'success'
      await payment.save()

      order.paymentStatus = 'paid'
      order.orderStatus = 'confirmed'
      order.statusHistory.push({ status: 'confirmed', note: 'Cash on Delivery confirmed.' })
      await order.save()

      return res.json({
        paymentId: payment._id,
        status: 'success',
        method: 'cod',
        orderNumber: order.orderNumber,
        message: 'Cash on Delivery order confirmed.',
      })
    }

    // For UPI / Card / Netbanking / Wallet
    const upiVpa = process.env.RAZORPAY_UPI_VPA || 'houseoftoshali@upi'
    const upiString = `upi://pay?pa=${upiVpa}&pn=HouseOfToshali&am=${order.grandTotal}&cu=INR&tn=Order-${order.orderNumber}`

    res.json({
      paymentId: payment._id,
      orderId: order._id,
      orderNumber: order.orderNumber,
      amount: Math.round(order.grandTotal * 100),
      amountInRupees: order.grandTotal,
      currency: 'INR',
      method,
      status: 'pending',
      razorpayOrderId: gatewayOrderId,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      upiString: method === 'upi' ? upiString : null,
      customerName: req.user.name || order.shippingAddress.fullName,
      customerEmail: req.user.email || '',
      customerMobile: order.shippingAddress.mobile || '',
    })
  } catch (error) {
    console.error('createPayment error:', error)
    res.status(500).json({ message: 'Could not initiate payment.' })
  }
}

// POST /api/payments/verify — mark payment success after verification
export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const {
      paymentId,
      gatewayOrderId,
      gatewayPaymentId,
      gatewaySignature,
      status,
      reason,
    } = req.body

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required.' })
    }

    // Find payment with atomic update - only if pending
    const payment = await Payment.findOneAndUpdate(
      { 
        _id: paymentId, 
        status: { $in: ['pending', 'initiated'] }
      },
      { $set: { status: 'processing' } },
      { new: true, session }
    )

    if (!payment) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ 
        message: 'Payment record not found or already processed.' 
      })
    }

    // Verify signature
    let isSignatureValid = false
    if (gatewayOrderId && gatewayPaymentId && gatewaySignature && process.env.RAZORPAY_KEY_SECRET) {
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${gatewayOrderId}|${gatewayPaymentId}`)
        .digest('hex')
      isSignatureValid = generatedSignature === gatewaySignature
    } else {
      // Fallback for testing - only in development
      isSignatureValid = process.env.NODE_ENV === 'development' && status === 'success'
    }

    const resolvedStatus = isSignatureValid ? 'success' : 'failed'

    // Update payment with final status
    const updatedPayment = await Payment.findByIdAndUpdate(
      payment._id,
      {
        $set: {
          status: resolvedStatus,
          gatewayOrderId: gatewayOrderId || payment.gatewayOrderId,
          gatewayPaymentId: gatewayPaymentId || payment.gatewayPaymentId || `pay_${Date.now()}`,
          gatewaySignature: gatewaySignature || payment.gatewaySignature,
          'attempts.$[lastAttempt].status': resolvedStatus,
          'attempts.$[lastAttempt].gatewayRef': gatewayPaymentId || payment.gatewayPaymentId,
          'attempts.$[lastAttempt].failureReason': resolvedStatus === 'failed' 
            ? (reason || 'Payment verification failed') 
            : null,
        }
      },
      {
        arrayFilters: [{ 'lastAttempt': { $exists: true } }],
        new: true,
        session
      }
    )

    // Find and update order if payment successful
    if (resolvedStatus === 'success') {
      const order = await Order.findOneAndUpdate(
        { _id: payment.orderId, paymentStatus: { $ne: 'paid' } },
        {
          $set: {
            paymentStatus: 'paid',
            orderStatus: 'confirmed',
          },
          $push: {
            statusHistory: {
              status: 'confirmed',
              note: `Payment verified via ${payment.method.toUpperCase()} (${gatewayPaymentId || payment.gatewayPaymentId}).`,
            }
          }
        },
        { new: true, session }
      )

      if (!order) {
        // Order might already be paid, but payment is verified
        await session.commitTransaction()
        session.endSession()
        return res.json({
          paymentId: updatedPayment._id,
          status: resolvedStatus,
          message: 'Payment verified but order already processed.',
        })
      }

      await session.commitTransaction()
      session.endSession()

      return res.json({
        paymentId: updatedPayment._id,
        status: resolvedStatus,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        gatewayPaymentId: updatedPayment.gatewayPaymentId,
      })
    }

    // Payment failed
    await session.commitTransaction()
    session.endSession()

    res.json({
      paymentId: updatedPayment._id,
      status: resolvedStatus,
      message: 'Payment verification failed.',
      gatewayPaymentId: updatedPayment.gatewayPaymentId,
    })

  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    console.error('verifyPayment error:', error)
    res.status(500).json({ message: 'Could not verify payment.' })
  }
}

// GET /api/payments/:orderId/status
export const getPaymentStatus = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id })
      .select('orderNumber paymentStatus orderStatus grandTotal paymentMethod')
    if (!order) return res.status(404).json({ message: 'Order not found.' })

    const payment = await Payment.findOne({ orderId: order._id })
      .select('status method amount gatewayOrderId gatewayPaymentId gatewaySignature updatedAt')

    res.json({
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      grandTotal: order.grandTotal,
      paymentMethod: order.paymentMethod,
      paymentRecord: payment || null,
    })
  } catch (error) {
    console.error('getPaymentStatus error:', error)
    res.status(500).json({ message: 'Could not fetch payment status.' })
  }
}

// GET /api/payments/:orderId/attempts
export const getPaymentAttempts = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found.' })

    const payment = await Payment.findOne({ orderId: order._id }).select('attempts status')
    res.json({ attempts: payment?.attempts || [], status: payment?.status || 'none' })
  } catch (error) {
    console.error('getPaymentAttempts error:', error)
    res.status(500).json({ message: 'Could not fetch payment attempts.' })
  }
}

// POST /api/payments/webhook - Razorpay webhook handler
export const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    
    // Skip signature verification in development
    if (process.env.NODE_ENV !== 'development') {
      const signature = req.headers['x-razorpay-signature']
      if (!signature || !webhookSecret) {
        return res.status(401).json({ message: 'Webhook signature missing' })
      }

      const body = JSON.stringify(req.body)
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex')

      if (signature !== expectedSignature) {
        return res.status(401).json({ message: 'Invalid webhook signature' })
      }
    }

    const { event, payload } = req.body

    if (event === 'payment.captured') {
      const paymentData = payload.payment.entity
      
      // Find payment by gateway order ID
      const payment = await Payment.findOne({ 
        gatewayOrderId: paymentData.order_id,
        status: 'pending'
      })

      if (payment) {
        const order = await Order.findById(payment.orderId)
        if (order && order.paymentStatus !== 'paid') {
          // Update payment
          payment.status = 'success'
          payment.gatewayPaymentId = paymentData.id
          payment.gatewaySignature = 'webhook_verified'
          if (payment.attempts.length > 0) {
            payment.attempts[payment.attempts.length - 1].status = 'success'
            payment.attempts[payment.attempts.length - 1].gatewayRef = paymentData.id
          }
          await payment.save()

          // Update order
          order.paymentStatus = 'paid'
          order.orderStatus = 'confirmed'
          order.statusHistory.push({
            status: 'confirmed',
            note: `Payment captured via webhook (${paymentData.id}).`,
          })
          await order.save()
        }
      }
    }

    if (event === 'payment.failed') {
      const paymentData = payload.payment.entity
      
      const payment = await Payment.findOne({ 
        gatewayOrderId: paymentData.order_id,
        status: 'pending'
      })

      if (payment) {
        payment.status = 'failed'
        if (payment.attempts.length > 0) {
          payment.attempts[payment.attempts.length - 1].status = 'failed'
          payment.attempts[payment.attempts.length - 1].failureReason = paymentData.error_description || 'Payment failed'
        }
        await payment.save()
      }
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ message: 'Webhook processing failed' })
  }
}
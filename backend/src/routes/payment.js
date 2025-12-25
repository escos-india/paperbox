const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { body } = require('express-validator');
const { validate, validators } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const { Payment, Order } = require('../models');
const { PAYMENT_STATUS, ORDER_STATUS } = require('../config/constants');
const { getConfig } = require('../config/env.config');

// @route   POST /api/payment/webhook
// @desc    Razorpay webhook handler
// @access  Public (verified by signature)
router.post('/webhook', asyncHandler(async (req, res) => {
  const webhookSecret = getConfig('ADMIN_RAZORPAY_KEY_SECRET');
  const signature = req.headers['x-razorpay-signature'];
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (signature !== expectedSignature) {
    console.warn('⚠️ Invalid webhook signature');
    return res.status(400).json({ error: 'Invalid signature' });
  }
  
  const event = req.body.event;
  const payload = req.body.payload;
  
  console.log(`📨 Webhook received: ${event}`);
  
  switch (event) {
    case 'payment.captured':
      await handlePaymentCaptured(payload.payment.entity);
      break;
      
    case 'payment.failed':
      await handlePaymentFailed(payload.payment.entity);
      break;
      
    case 'refund.created':
      await handleRefundCreated(payload.refund.entity);
      break;
      
    case 'refund.processed':
      await handleRefundProcessed(payload.refund.entity);
      break;
      
    default:
      console.log(`Unhandled webhook event: ${event}`);
  }
  
  res.json({ status: 'ok' });
}));

// Webhook handlers
async function handlePaymentCaptured(payment) {
  try {
    const paymentRecord = await Payment.findOne({
      razorpayOrderId: payment.order_id
    });
    
    if (!paymentRecord) {
      console.warn(`Payment record not found for order: ${payment.order_id}`);
      return;
    }
    
    paymentRecord.razorpayPaymentId = payment.id;
    paymentRecord.status = PAYMENT_STATUS.SUCCESS;
    paymentRecord.method = payment.method;
    paymentRecord.bank = payment.bank;
    paymentRecord.wallet = payment.wallet;
    paymentRecord.vpa = payment.vpa;
    paymentRecord.webhookData = payment;
    paymentRecord.paidToVendor = true;
    await paymentRecord.save();
    
    // Update order status
    const order = await Order.findById(paymentRecord.orderId);
    if (order && order.status === ORDER_STATUS.PLACED) {
      order.updateStatus(ORDER_STATUS.CONFIRMED, 'Payment confirmed via webhook');
      await order.save();
    }
    
    console.log(`✅ Payment captured: ${payment.id}`);
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(payment) {
  try {
    const paymentRecord = await Payment.findOne({
      razorpayOrderId: payment.order_id
    });
    
    if (!paymentRecord) return;
    
    paymentRecord.status = PAYMENT_STATUS.FAILED;
    paymentRecord.errorCode = payment.error_code;
    paymentRecord.errorDescription = payment.error_description;
    paymentRecord.webhookData = payment;
    await paymentRecord.save();
    
    console.log(`❌ Payment failed: ${payment.id}`);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handleRefundCreated(refund) {
  try {
    const paymentRecord = await Payment.findOne({
      razorpayPaymentId: refund.payment_id
    });
    
    if (!paymentRecord) return;
    
    paymentRecord.refundId = refund.id;
    paymentRecord.refundAmount = refund.amount / 100;
    await paymentRecord.save();
    
    console.log(`💰 Refund created: ${refund.id}`);
  } catch (error) {
    console.error('Error handling refund created:', error);
  }
}

async function handleRefundProcessed(refund) {
  try {
    const paymentRecord = await Payment.findOne({
      razorpayPaymentId: refund.payment_id
    });
    
    if (!paymentRecord) return;
    
    paymentRecord.status = PAYMENT_STATUS.REFUNDED;
    paymentRecord.refundedAt = new Date();
    await paymentRecord.save();
    
    console.log(`✅ Refund processed: ${refund.id}`);
  } catch (error) {
    console.error('Error handling refund processed:', error);
  }
}

module.exports = router;

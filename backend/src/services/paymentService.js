const Razorpay = require('razorpay');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const { getConfig } = require('../config/env.config');
const User = require('../models/User');

class PaymentService {
  constructor() {
    this.encryptionKey = getConfig('ENCRYPTION_KEY');
    
    // Admin's Razorpay instance (for subscription payments)
    this.adminRazorpay = new Razorpay({
      key_id: getConfig('ADMIN_RAZORPAY_KEY_ID'),
      key_secret: getConfig('ADMIN_RAZORPAY_KEY_SECRET')
    });
  }

  // Encrypt vendor's Razorpay keys before storing
  encryptKey(text) {
    return CryptoJS.AES.encrypt(text, this.encryptionKey).toString();
  }

  // Decrypt vendor's Razorpay keys
  decryptKey(ciphertext) {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  // Get vendor's Razorpay instance
  async getVendorRazorpay(vendorId) {
    const vendor = await User.findById(vendorId).select('+razorpayKeyId +razorpayKeySecret');
    
    if (!vendor || !vendor.razorpayKeyId || !vendor.razorpayKeySecret) {
      throw new Error('Vendor Razorpay credentials not found');
    }

    const keyId = this.decryptKey(vendor.razorpayKeyId);
    const keySecret = this.decryptKey(vendor.razorpayKeySecret);

    if (!keyId || !keySecret) {
      throw new Error('Failed to decrypt vendor Razorpay credentials');
    }

    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }

  // Create order for product purchase (using vendor's Razorpay)
  async createProductOrder(vendorId, amount, orderId, notes = {}) {
    try {
      const vendorRazorpay = await this.getVendorRazorpay(vendorId);
      
      const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency: 'INR',
        receipt: orderId,
        notes: {
          orderId,
          vendorId: vendorId.toString(),
          type: 'product_purchase',
          ...notes
        }
      };

      const order = await vendorRazorpay.orders.create(options);
      
      // Get vendor's public key for frontend
      const vendor = await User.findById(vendorId).select('+razorpayKeyId');
      const publicKeyId = this.decryptKey(vendor.razorpayKeyId);
      
      return {
        ...order,
        keyId: publicKeyId // Frontend needs this to open Razorpay checkout
      };
    } catch (error) {
      console.error('Create product order error:', error);
      throw error;
    }
  }

  // Verify payment signature (for product purchase)
  async verifyProductPayment(vendorId, razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const vendor = await User.findById(vendorId).select('+razorpayKeySecret');
    const keySecret = this.decryptKey(vendor.razorpayKeySecret);

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpaySignature;
  }

  // Create order for subscription payment (using Admin's Razorpay)
  async createSubscriptionOrder(vendorId, planId, amount, notes = {}) {
    try {
      const options = {
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `sub_${vendorId}_${Date.now()}`,
        notes: {
          vendorId: vendorId.toString(),
          planId: planId.toString(),
          type: 'subscription_payment',
          ...notes
        }
      };

      const order = await this.adminRazorpay.orders.create(options);
      
      return {
        ...order,
        keyId: getConfig('ADMIN_RAZORPAY_KEY_ID')
      };
    } catch (error) {
      console.error('Create subscription order error:', error);
      throw error;
    }
  }

  // Verify subscription payment signature (using Admin's secret)
  verifySubscriptionPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', getConfig('ADMIN_RAZORPAY_KEY_SECRET'))
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpaySignature;
  }

  // Process refund (using vendor's Razorpay)
  async processRefund(vendorId, paymentId, amount, notes = {}) {
    try {
      const vendorRazorpay = await this.getVendorRazorpay(vendorId);
      
      const refund = await vendorRazorpay.payments.refund(paymentId, {
        amount: Math.round(amount * 100),
        notes
      });

      return refund;
    } catch (error) {
      console.error('Process refund error:', error);
      throw error;
    }
  }

  // Get payment details
  async getPaymentDetails(vendorId, paymentId) {
    try {
      const vendorRazorpay = await this.getVendorRazorpay(vendorId);
      return await vendorRazorpay.payments.fetch(paymentId);
    } catch (error) {
      console.error('Get payment details error:', error);
      throw error;
    }
  }

  // Mock payment for development (when no real Razorpay keys)
  createMockOrder(amount, receipt) {
    const mockOrderId = `order_mock_${Date.now()}`;
    return {
      id: mockOrderId,
      entity: 'order',
      amount: Math.round(amount * 100),
      amount_paid: 0,
      amount_due: Math.round(amount * 100),
      currency: 'INR',
      receipt,
      status: 'created',
      keyId: 'rzp_test_mock',
      mock: true
    };
  }

  // Mock payment verification for development
  verifyMockPayment() {
    return true;
  }
}

module.exports = new PaymentService();

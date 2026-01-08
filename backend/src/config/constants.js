// Application Constants

// User Roles
const ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor',
  BUYER: 'buyer'
};

// User Status
const USER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  BLOCKED: 'blocked'
};

// Product Categories
const CATEGORIES = {
  ELECTRONICS: 'electronics',
  LAPTOPS: 'laptops',
  KEYBOARDS: 'keyboards',
  ACCESSORIES: 'accessories',
  PHONES: 'phones',
  SERVERS: 'servers',
  NETWORKING: 'networking',
  OTHER: 'other'
};

// Product Conditions
const CONDITIONS = {
  NEW: 'new',
  LIKE_NEW: 'like-new',
  REFURBISHED: 'refurbished',
  USED: 'used'
};

// Order Statuses
const ORDER_STATUS = {
  PLACED: 'placed',
  CONFIRMED: 'confirmed',
  ACCEPTED: 'accepted',
  PICKED_PACKED: 'picked_packed',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
  REFUND_REQUESTED: 'REFUND_REQUESTED',
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_PENDING_LEGACY: 'PAYMENT_PENDING'
};

// Payment Statuses
const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// OTP Types
const OTP_TYPES = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  DELIVERY: 'delivery',
  FORGOT_PASSWORD: 'forgot_password'
};

// Refund Statuses
const REFUND_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Subscription Statuses
const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
};

module.exports = {
  ROLES,
  USER_STATUS,
  CATEGORIES,
  CONDITIONS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  OTP_TYPES,
  REFUND_STATUS,
  SUBSCRIPTION_STATUS
};

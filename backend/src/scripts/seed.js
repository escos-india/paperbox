require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const { getConfig } = require('../config/env.config');
const { ROLES, USER_STATUS, CATEGORIES, CONDITIONS, SUBSCRIPTION_STATUS } = require('../config/constants');
const { User, Product, SubscriptionPlan, Subscription } = require('../models');
const paymentService = require('../services/paymentService');

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');
    
    await connectDB();
    
    // Clear existing data (optional - comment out in production)
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await SubscriptionPlan.deleteMany({});
    await Subscription.deleteMany({});
    
    // ==================== CREATE ADMIN ====================
    console.log('\n👤 Creating admin user...');
    const admin = await User.create({
      name: 'Paperbox Admin',
      email: getConfig('ADMIN_EMAIL'),
      phone: getConfig('ADMIN_PHONE'),
      password: getConfig('ADMIN_PASSWORD'),
      secretKey: getConfig('ADMIN_SECRET_KEY'),
      role: ROLES.ADMIN,
      status: USER_STATUS.APPROVED
    });
    console.log(`   ✅ Admin created: ${admin.email}`);
    
    // ==================== CREATE VENDORS ====================
    console.log('\n🏪 Creating vendors...');
    
    // Encrypt mock Razorpay keys for demo
    const mockKeyId = paymentService.encryptKey('rzp_test_demo_vendor_key');
    const mockKeySecret = paymentService.encryptKey('demo_vendor_secret');
    
    const vendor1 = await User.create({
      name: 'Tech Solutions',
      phone: '9876543210',
      email: 'vendor1@demo.com',
      businessName: 'Tech Solutions Pvt Ltd',
      gstNumber: '29ABCDE1234F1Z5',
      role: ROLES.VENDOR,
      status: USER_STATUS.APPROVED,
      razorpayKeyId: mockKeyId,
      razorpayKeySecret: mockKeySecret,
      address: {
        street: '123 Tech Park',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      }
    });
    
    const vendor2 = await User.create({
      name: 'Digital Hub',
      phone: '9876543211',
      email: 'vendor2@demo.com',
      businessName: 'Digital Hub Electronics',
      role: ROLES.VENDOR,
      status: USER_STATUS.APPROVED,
      razorpayKeyId: mockKeyId,
      razorpayKeySecret: mockKeySecret,
      address: {
        street: '456 IT Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    });
    
    const vendor3 = await User.create({
      name: 'Server World',
      phone: '9876543212',
      email: 'vendor3@demo.com',
      businessName: 'Server World Systems',
      role: ROLES.VENDOR,
      status: USER_STATUS.PENDING, // Pending approval
      razorpayKeyId: mockKeyId,
      razorpayKeySecret: mockKeySecret
    });
    
    console.log(`   ✅ Created ${3} vendors (1 pending approval)`);
    
    // ==================== CREATE BUYERS ====================
    console.log('\n🛒 Creating buyer users...');
    
    const buyer1 = await User.create({
      name: 'John Doe',
      phone: '9988776655',
      email: 'buyer1@demo.com',
      role: ROLES.BUYER,
      status: USER_STATUS.APPROVED,
      address: {
        street: '789 Main Street',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      }
    });
    
    const buyer2 = await User.create({
      name: 'Jane Smith',
      phone: '9988776656',
      email: 'buyer2@demo.com',
      role: ROLES.BUYER,
      status: USER_STATUS.APPROVED
    });
    
    console.log(`   ✅ Created ${2} buyers`);
    
    // ==================== CREATE SUBSCRIPTION PLANS ====================
    console.log('\n📋 Creating subscription plans...');
    
    const plans = await SubscriptionPlan.create([
      {
        name: 'Basic',
        description: 'Perfect for getting started',
        price: 499,
        duration: 30,
        maxProducts: 10,
        commissionRate: 5,
        priority: 1,
        features: [
          'List up to 10 products',
          'Basic analytics',
          'Email support',
          '5% commission on sales'
        ]
      },
      {
        name: 'Pro',
        description: 'Best for growing businesses',
        price: 999,
        duration: 30,
        maxProducts: 50,
        commissionRate: 3,
        priority: 2,
        isPopular: true,
        features: [
          'List up to 50 products',
          'Advanced analytics',
          'Priority support',
          '3% commission on sales',
          'Featured listings'
        ]
      },
      {
        name: 'Premium',
        description: 'For high-volume sellers',
        price: 1999,
        duration: 30,
        maxProducts: 999,
        commissionRate: 1,
        priority: 3,
        features: [
          'Unlimited products',
          'Real-time analytics',
          '24/7 dedicated support',
          '1% commission on sales',
          'Featured listings',
          'Priority in search results'
        ]
      }
    ]);
    
    console.log(`   ✅ Created ${plans.length} subscription plans`);
    
    // ==================== CREATE SUBSCRIPTIONS ====================
    console.log('\n📝 Creating vendor subscriptions...');
    
    const proPlan = plans.find(p => p.name === 'Pro');
    
    await Subscription.create({
      vendorId: vendor1._id,
      planId: proPlan._id,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      payments: [{
        razorpayPaymentId: 'pay_demo_123',
        razorpayOrderId: 'order_demo_123',
        amount: proPlan.price,
        paidAt: new Date(),
        status: 'success'
      }]
    });
    
    await Subscription.create({
      vendorId: vendor2._id,
      planId: plans[0]._id, // Basic plan
      status: SUBSCRIPTION_STATUS.ACTIVE,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    
    console.log(`   ✅ Created subscriptions for vendors`);
    
    // ==================== CREATE PRODUCTS ====================
    console.log('\n📦 Creating products...');
    
    const products = await Product.create([
      // Vendor 1 products
      {
        vendorId: vendor1._id,
        name: 'Dell PowerEdge R750 Server',
        description: 'Enterprise-grade 2U rack server with dual Intel Xeon processors. Perfect for data center consolidation or virtualization workloads.',
        brand: 'Dell',
        category: CATEGORIES.SERVERS,
        condition: CONDITIONS.REFURBISHED,
        reasonForSelling: 'Data center consolidation surplus',
        price: 450000,
        originalPrice: 650000,
        quantity: 3,
        images: ['/images/products/server.png'],
        specifications: {
          'Processor': '2x Intel Xeon Gold 6330',
          'RAM': '128GB DDR4 ECC',
          'Storage': '2x 960GB SSD SAS',
          'Form Factor': '2U Rack'
        },
        isFeatured: true
      },
      {
        vendorId: vendor1._id,
        name: 'HP EliteBook 840 G8',
        description: 'Premium business laptop with 11th gen Intel processor. Corporate lease return in excellent condition.',
        brand: 'HP',
        category: CATEGORIES.LAPTOPS,
        condition: CONDITIONS.REFURBISHED,
        reasonForSelling: 'Corporate lease return',
        price: 65000,
        originalPrice: 95000,
        quantity: 10,
        images: ['/images/products/laptop.png'],
        specifications: {
          'Processor': 'Intel Core i7-1165G7',
          'RAM': '16GB DDR4',
          'Storage': '512GB NVMe SSD',
          'Display': '14-inch FHD IPS'
        },
        isFeatured: true
      },
      {
        vendorId: vendor1._id,
        name: 'Logitech MX Keys Keyboard',
        description: 'Premium wireless illuminated keyboard. Barely used, like new condition.',
        brand: 'Logitech',
        category: CATEGORIES.KEYBOARDS,
        condition: CONDITIONS.LIKE_NEW,
        price: 8500,
        originalPrice: 12000,
        quantity: 5,
        images: [],
        specifications: {
          'Connectivity': 'Bluetooth + USB',
          'Battery': 'Rechargeable, 10 days',
          'Backlight': 'White LED'
        }
      },
      
      // Vendor 2 products
      {
        vendorId: vendor2._id,
        name: 'Cisco Catalyst 9300 Switch',
        description: '48-port enterprise network switch with PoE+. New, sealed box unit.',
        brand: 'Cisco',
        category: CATEGORIES.NETWORKING,
        condition: CONDITIONS.NEW,
        reasonForSelling: 'Overstock inventory',
        price: 185000,
        quantity: 2,
        images: ['/images/products/switch.png'],
        specifications: {
          'Ports': '48x 1G PoE+',
          'Uplink': '4x 10G SFP+',
          'Layer': 'Layer 3',
          'Stackable': 'Yes'
        },
        isFeatured: true
      },
      {
        vendorId: vendor2._id,
        name: 'Fortinet FortiGate 60F',
        description: 'Next-generation firewall for small to medium businesses. New sealed unit.',
        brand: 'Fortinet',
        category: CATEGORIES.NETWORKING,
        condition: CONDITIONS.NEW,
        price: 42000,
        quantity: 4,
        images: ['/images/products/firewall.png'],
        specifications: {
          'Throughput': '10 Gbps',
          'VPN': '6.5 Gbps',
          'Ports': '10x GE RJ45',
          'Form Factor': 'Desktop'
        }
      },
      {
        vendorId: vendor2._id,
        name: 'Samsung Galaxy S23 Ultra',
        description: 'Flagship smartphone in excellent condition. Comes with original box and accessories.',
        brand: 'Samsung',
        category: CATEGORIES.PHONES,
        condition: CONDITIONS.LIKE_NEW,
        reasonForSelling: 'Upgraded to new model',
        price: 75000,
        originalPrice: 125000,
        quantity: 1,
        images: [],
        specifications: {
          'Display': '6.8" Dynamic AMOLED 2X',
          'Processor': 'Snapdragon 8 Gen 2',
          'RAM': '12GB',
          'Storage': '256GB'
        }
      },
      {
        vendorId: vendor2._id,
        name: 'Apple MacBook Pro 14" M2 Pro',
        description: 'Latest MacBook Pro with M2 Pro chip. Used for 2 months, perfect condition.',
        brand: 'Apple',
        category: CATEGORIES.LAPTOPS,
        condition: CONDITIONS.LIKE_NEW,
        price: 165000,
        originalPrice: 220000,
        quantity: 1,
        images: [],
        specifications: {
          'Chip': 'Apple M2 Pro',
          'RAM': '16GB Unified',
          'Storage': '512GB SSD',
          'Display': '14.2" Liquid Retina XDR'
        },
        isFeatured: true
      }
    ]);
    
    console.log(`   ✅ Created ${products.length} products`);
    
    // ==================== SUMMARY ====================
    console.log('\n' + '='.repeat(50));
    console.log('✅ Database seeded successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - 1 Admin: ${admin.email} / ${getConfig('ADMIN_PASSWORD')}`);
    console.log(`   - 3 Vendors (2 approved, 1 pending)`);
    console.log(`   - 2 Buyers`);
    console.log(`   - 3 Subscription Plans`);
    console.log(`   - ${products.length} Products`);
    console.log('\n🔑 Login Credentials:');
    console.log(`   Admin: ${admin.email} | Password: ${getConfig('ADMIN_PASSWORD')} | Secret: ${getConfig('ADMIN_SECRET_KEY')}`);
    console.log(`   Vendor: Phone 9876543210 (use OTP)`);
    console.log(`   Buyer: Phone 9988776655 (use OTP)`);
    console.log('='.repeat(50) + '\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();

// Environment configuration template
// Copy this to a .env file in the backend folder and fill in your values

module.exports = {
  // These are the environment variables needed for the backend
  // Create a .env file with these values:
  
  /*
  PORT=5000
  NODE_ENV=development
  
  # MongoDB (Local)
  MONGODB_URI=mongodb://localhost:27017/paperbox
  
  # JWT Configuration
  JWT_SECRET=paperbox-super-secret-jwt-key-2024
  JWT_EXPIRES_IN=7d
  
  # Cloudinary (Image Storage)
  CLOUDINARY_CLOUD_NAME=dvk9z3jp4
  CLOUDINARY_API_KEY=121225712596776
  CLOUDINARY_API_SECRET=Kxf_U7Rpp2h3Vrvl4hAVuvbMASc
  
  # Encryption key for storing vendor Razorpay secrets (32 characters)
  ENCRYPTION_KEY=paperbox-encryption-key-32chars!
  
  # Admin's Razorpay (Mock/Test Mode for subscription payments)
  ADMIN_RAZORPAY_KEY_ID=rzp_test_mock_admin_key
  ADMIN_RAZORPAY_KEY_SECRET=mock_admin_secret_key
  
  # Fast2SMS - Free OTP Provider
  FAST2SMS_API_KEY=your-fast2sms-api-key-here
  
  # Admin Seed Credentials
  ADMIN_PHONE=9999999999
  ADMIN_EMAIL=admin@paperbox.com
  ADMIN_PASSWORD=Admin@123
  ADMIN_SECRET_KEY=PAPERBOX-ADMIN-2024
  
  # Frontend URL (for CORS)
  FRONTEND_URL=http://localhost:3000
  */
};

// Default values for development (when .env is not available)
const defaults = {
  PORT: 5000,
  NODE_ENV: 'development',
  MONGODB_URI: 'mongodb://localhost:27017/paperbox',
  JWT_SECRET: 'paperbox-super-secret-jwt-key-2024',
  JWT_EXPIRES_IN: '7d',
  CLOUDINARY_CLOUD_NAME: 'dvk9z3jp4',
  CLOUDINARY_API_KEY: '121225712596776',
  CLOUDINARY_API_SECRET: 'Kxf_U7Rpp2h3Vrvl4hAVuvbMASc',
  ENCRYPTION_KEY: 'paperbox-encryption-key-32chars!',
  ADMIN_RAZORPAY_KEY_ID: 'rzp_test_mock_admin_key',
  ADMIN_RAZORPAY_KEY_SECRET: 'mock_admin_secret_key',
  FAST2SMS_API_KEY: '',
  ADMIN_PHONE: '9999999999',
  ADMIN_EMAIL: 'admin@paperbox.com',
  ADMIN_PASSWORD: 'Admin@123',
  ADMIN_SECRET_KEY: 'PAPERBOX-ADMIN-2024',
  FRONTEND_URL: 'http://localhost:3000'
};

// Export a function to get config values
const getConfig = (key) => {
  return process.env[key] || defaults[key];
};

module.exports = { defaults, getConfig };

const mongoose = require('mongoose');
const { getConfig } = require('./env.config');

const connectDB = async () => {
  try {
    const mongoURI = getConfig('MONGODB_URI');
    
    const conn = await mongoose.connect(mongoURI, {
      // Mongoose 8+ doesn't need these options anymore, but keeping for compatibility
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

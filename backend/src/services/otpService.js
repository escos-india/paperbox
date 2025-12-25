const axios = require('axios');
const OTP = require('../models/OTP');
const { getConfig } = require('../config/env.config');
const { OTP_TYPES } = require('../config/constants');

class OTPService {
  constructor() {
    const key = getConfig('FAST2SMS_API_KEY');
    this.apiKey = key ? key.trim() : '';
    console.log("DEBUG: OTP Service API Key loaded:", this.apiKey ? (this.apiKey.substring(0, 5) + "...") : "NULL/EMPTY");
    this.baseUrl = 'https://www.fast2sms.com/dev/bulkV2';
  }

  // Generate a random 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create and store OTP in database
  async createOTP(phone, type = OTP_TYPES.LOGIN) {
    // Delete any existing OTPs for this phone and type
    await OTP.deleteMany({ phone, type });

    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const otpDoc = await OTP.create({
      phone,
      otp,
      type,
      expiresAt
    });

    return { otp, otpDoc };
  }

  // Send OTP via Fast2SMS
  async sendOTP(phone, otp) {
    // If no valid API key is provided, use mock mode (log to console)
    // We allow real SMS even in development if a key is present
    if (!this.apiKey || this.apiKey === 'your-fast2sms-api-key-here') {
      console.log(`📱 [DEV MODE] OTP for ${phone}: ${otp}`);
      return { success: true, mock: true };
    }

    try {
      // Trying compatible approach: Header for Auth, Query Params for Data
      const response = await axios.post(this.baseUrl, null, {
          params: {
            route: 'otp',
            variables_values: otp,
            flash: 0,
            numbers: phone
          },
          headers: {
            "authorization": this.apiKey
          }
      });

      if (response.data.return === true) {
        console.log(`✅ OTP sent to ${phone}`);
        return { success: true, data: response.data };
      } else {
        console.error(`❌ Failed to send OTP:`, response.data);
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error(`❌ OTP sending error:`, error.message);
      
      // In case of API failure, log OTP for testing
      console.log(`📱 [FALLBACK] OTP for ${phone}: ${otp}`);
      return { success: true, mock: true, fallback: true };
    }
  }

  // Verify OTP
  async verifyOTP(phone, inputOtp, type = OTP_TYPES.LOGIN) {
    console.log(`🔍 Verifying OTP: Phone=${phone}, OTP=${inputOtp}, Type=${type}`);
    
    // Ensure phone is string
    phone = String(phone).trim();
    inputOtp = String(inputOtp).trim();

    const otpDoc = await OTP.findOne({ phone, type }).sort({ createdAt: -1 });
    // sort by latest because createOTP only deletes "type" matching, ensuring we get the newest if race condition
    
    if (!otpDoc) {
      console.log(`❌ OTP Verification Failed: No record found for ${phone}`);
      return { valid: false, message: 'OTP not found. Please request a new one.' };
    }

    console.log(`FOUND OTP Record: ID=${otpDoc._id}, Expected=${otpDoc.otp}, Attempts=${otpDoc.attempts}`);

    if (otpDoc.isExpired()) {
      console.log(`❌ OTP Verification Failed: Expired`);
      await OTP.deleteOne({ _id: otpDoc._id });
      return { valid: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (otpDoc.hasExceededAttempts()) {
      console.log(`❌ OTP Verification Failed: Too many attempts`);
      await OTP.deleteOne({ _id: otpDoc._id });
      return { valid: false, message: 'Too many attempts. Please request a new OTP.' };
    }

    if (otpDoc.otp !== inputOtp) {
      console.log(`❌ OTP Verification Failed: Mismatch (Input: ${inputOtp} !== Expected: ${otpDoc.otp})`);
      await otpDoc.incrementAttempts();
      return { 
        valid: false, 
        message: 'Invalid OTP. Please try again.',
        attemptsLeft: otpDoc.maxAttempts - otpDoc.attempts
      };
    }

    // OTP is valid - mark as verified and delete
    console.log(`✅ OTP Verification SUCCESS`);
    await OTP.deleteOne({ _id: otpDoc._id });
    
    return { valid: true, message: 'OTP verified successfully' };
  }

  // Generate delivery OTP (4 digits for simplicity)
  generateDeliveryOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}

module.exports = new OTPService();

const axios = require('axios');
const nodemailer = require('nodemailer');
const OTP = require('../models/OTP');
const { getConfig } = require('../config/env.config');
const { OTP_TYPES } = require('../config/constants');

class OTPService {
  constructor() {
    // SMS Config
    const key = getConfig('FAST2SMS_API_KEY');
    this.apiKey = key ? key.trim() : '';
    this.baseUrl = 'https://www.fast2sms.com/dev/bulkV2';

    // Email Config
    this.emailUser = getConfig('SMTP_USER');
    this.transporter = nodemailer.createTransport({
        host: getConfig('SMTP_HOST'),
        port: getConfig('SMTP_PORT'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: this.emailUser,
            pass: getConfig('SMTP_PASS')
        }
    });

    console.log("DEBUG: OTP Service Initialized. Email User:", this.emailUser || "Not Configured");
  }

  // Generate a random 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Helper to determine if identifier is email
  isEmail(identifier) {
      return /^\S+@\S+\.\S+$/.test(identifier);
  }

  // Create and store OTP in database
  async createOTP(identifier, type = OTP_TYPES.LOGIN) {
    const isEmail = this.isEmail(identifier);
    const query = { type };
    if (isEmail) query.email = identifier;
    else query.phone = identifier;

    // Delete any existing OTPs for this identifier and type
    await OTP.deleteMany(query);

    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const otpData = {
      otp,
      type,
      expiresAt
    };

    if (isEmail) otpData.email = identifier;
    else otpData.phone = identifier;

    const otpDoc = await OTP.create(otpData);

    return { otp, otpDoc };
  }

  // Send OTP (Route to SMS or Email)
  async sendOTP(identifier, otp) {
      if (this.isEmail(identifier)) {
          return this.sendEmailOTP(identifier, otp);
      } else {
          return this.sendSMS(identifier, otp);
      }
  }

  // Send OTP via Email
  async sendEmailOTP(email, otp) {
      if (!this.emailUser) {
          console.error("❌ Email Service Error: Missing 'SMTP_USER' or 'SMTP_PASS' in environment variables");
          return { success: false, error: "Email service not configured" };
      }

      try {
          const info = await this.transporter.sendMail({
              from: `"Paperbox" <${this.emailUser}>`,
              to: email,
              subject: "Your Paperbox Login OTP",
              text: `Your OTP for Paperbox is ${otp}. It is valid for 5 minutes.`,
              html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                  <h2 style="color: #333;">Paperbox Login Verification</h2>
                  <p>Hello,</p>
                  <p>Your One-Time Password (OTP) for logging in to Paperbox is:</p>
                  <h1 style="color: #007bff; letter-spacing: 5px;">${otp}</h1>
                  <p>This OTP is valid for 5 minutes. Do not share this with anyone.</p>
                  <p style="font-size: 12px; color: #888;">If you did not request this, please ignore this email.</p>
                </div>
              `
          });

          console.log(`✅ Email OTP sent to ${email}: ${info.messageId}`);
          return { success: true, method: 'email' };
      } catch (error) {
          console.error("❌ Email sending failed:", error);
          // Fallback to mock if in dev and email fails? No, let's report error.
          // But for strict "dev mode" without credentials, maybe log it.
           if (getConfig('NODE_ENV') === 'development') {
              console.log(`📧 [MOCK EMAIL] OTP for ${email}: ${otp}`);
              return { success: true, mock: true, devOtp: otp };
           }

          return { success: false, error: "Failed to send email OTP" };
      }
  }

  // Send OTP via Fast2SMS
  async sendSMS(phone, otp) {
    // Check for API key
    if (!this.apiKey || this.apiKey === 'your-fast2sms-api-key-here') {
       console.error("❌ SMS Service Error: Missing 'FAST2SMS_API_KEY' in environment variables.");
       return { success: false, error: "SMS service not configured" };
    }

    try {
      const dltTemplateId = getConfig('FAST2SMS_DLT_TEMPLATE_ID');
      const senderId = getConfig('FAST2SMS_SENDER_ID'); 

      let params = {};
      
      if (dltTemplateId && senderId) {
          params = {
            route: 'dlt',
            sender_id: senderId,
            message: dltTemplateId,
            variables_values: otp,
            flash: 0,
            numbers: phone
          };
      } else {
          params = {
            route: 'otp',
            variables_values: otp,
            flash: 0,
            numbers: phone
          };
      }

      const response = await axios.post(this.baseUrl, null, {
          params: params,
          headers: { "Authorization": this.apiKey }
      });

      if (response.data.return === true) {
        console.log(`✅ SMS sent to ${phone}`);
        return { success: true, data: response.data, method: 'sms' };
      } else {
        console.error(`❌ Failed to send SMS:`, response.data);
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error(`❌ SMS sending error:`, error.message);
      if (error.response) console.error(`❌ API Response Data:`, JSON.stringify(error.response.data, null, 2));
      return { success: false, error: error.response?.data?.message || "Failed to send SMS" };
    }
  }

  // Verify OTP
  async verifyOTP(identifier, inputOtp, type = OTP_TYPES.LOGIN) {
    console.log(`🔍 Verifying OTP: ID=${identifier}, OTP=${inputOtp}, Type=${type}`);
    
    // Ensure strings
    identifier = String(identifier).trim();
    inputOtp = String(inputOtp).trim();
    const isEmail = this.isEmail(identifier);

    const query = { type };
    if (isEmail) {
        query.email = identifier.toLowerCase();
    } else {
        query.phone = identifier;
    }

    const otpDoc = await OTP.findOne(query).sort({ createdAt: -1 });
    
    if (!otpDoc) {
      return { valid: false, message: 'OTP not found or expired. Please request a new one.' };
    }

    if (otpDoc.isExpired()) {
      await OTP.deleteOne({ _id: otpDoc._id });
      return { valid: false, message: 'OTP has expired.' };
    }

    if (otpDoc.hasExceededAttempts()) {
      await OTP.deleteOne({ _id: otpDoc._id });
      return { valid: false, message: 'Too many attempts.' };
    }

    if (otpDoc.otp !== inputOtp) {
      await otpDoc.incrementAttempts();
      return { valid: false, message: 'Invalid OTP.', attemptsLeft: otpDoc.maxAttempts - otpDoc.attempts };
    }

    // Success
    await OTP.deleteOne({ _id: otpDoc._id });
    return { valid: true, message: 'OTP verified successfully' };
  }

  generateDeliveryOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}

module.exports = new OTPService();

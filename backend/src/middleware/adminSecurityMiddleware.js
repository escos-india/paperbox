const { getConfig } = require('../config/env.config');
const nodemailer = require('nodemailer');

// In-memory store for failed login attempts
// Key: IP address, Value: { attempts: number, lockedUntil: Date | null }
const loginAttempts = new Map();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Email transporter for alerts
const getTransporter = () => {
    return nodemailer.createTransport({
        host: getConfig('SMTP_HOST'),
        port: getConfig('SMTP_PORT'),
        secure: false,
        auth: {
            user: getConfig('SMTP_USER'),
            pass: getConfig('SMTP_PASS')
        }
    });
};

/**
 * Send a security alert email to the admin
 * @param {string} type - 'ACCESS' | 'LOCKOUT' | 'FAILED_ATTEMPT'
 * @param {string} ip - The IP address
 * @param {object} details - Additional details
 */
const sendSecurityAlert = async (type, ip, details = {}) => {
    const adminEmail = getConfig('SMTP_USER'); // Send to the configured SMTP user
    const transporter = getTransporter();
    
    console.log(`🔔 Attempting to send ${type} alert to ${adminEmail} for IP: ${ip}`);
    
    let subject, htmlContent;
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    switch (type) {
        case 'ACCESS':
            subject = '🔐 Admin Login Page Accessed - Paperbox';
            htmlContent = `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                    <h2 style="color: #007bff;">Admin Login Page Accessed</h2>
                    <p>Someone has accessed the admin login page.</p>
                    <table style="border-collapse: collapse; width: 100%;">
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>IP Address:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${ip}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Time:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${timestamp}</td></tr>
                    </table>
                    <p style="font-size: 12px; color: #888; margin-top: 20px;">This is an automated security alert from Paperbox.</p>
                </div>
            `;
            break;
        case 'LOCKOUT':
            subject = '🚨 SECURITY ALERT: IP Locked Out - Paperbox';
            htmlContent = `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #dc3545; border-radius: 5px;">
                    <h2 style="color: #dc3545;">⚠️ IP Address Locked Out</h2>
                    <p>An IP address has been locked out due to multiple failed login attempts on the admin page.</p>
                    <table style="border-collapse: collapse; width: 100%;">
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>IP Address:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${ip}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Failed Attempts:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${details.attempts || MAX_ATTEMPTS}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Lockout Duration:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">15 minutes</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Time:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${timestamp}</td></tr>
                    </table>
                    <p style="color: #dc3545; font-weight: bold;">If this was not you, someone may be attempting to access your admin panel!</p>
                    <p style="font-size: 12px; color: #888; margin-top: 20px;">This is an automated security alert from Paperbox.</p>
                </div>
            `;
            break;
        default:
            console.log(`⚠️ Unknown alert type: ${type}`);
            return;
    }
    
    try {
        console.log(`📧 Sending email from: ${adminEmail} to: ${adminEmail}`);
        const info = await transporter.sendMail({
            from: `"Paperbox Security" <${adminEmail}>`,
            to: adminEmail,
            subject,
            html: htmlContent
        });
        console.log(`✅ Security alert email sent: ${type} from IP ${ip}. MessageID: ${info.messageId}`);
    } catch (error) {
        console.error(`❌ Failed to send security alert email:`, error.message);
        console.error(`❌ Full error:`, error);
    }
};

/**
 * Get the current status of an IP
 * @param {string} ip 
 * @returns {{ isLocked: boolean, attemptsLeft: number, lockedUntil: Date | null }}
 */
const getIPStatus = (ip) => {
    const data = loginAttempts.get(ip);
    
    if (!data) {
        return { isLocked: false, attemptsLeft: MAX_ATTEMPTS, lockedUntil: null };
    }
    
    // Check if lockout has expired
    if (data.lockedUntil && new Date() > data.lockedUntil) {
        // Reset the attempts
        loginAttempts.delete(ip);
        return { isLocked: false, attemptsLeft: MAX_ATTEMPTS, lockedUntil: null };
    }
    
    return {
        isLocked: !!data.lockedUntil,
        attemptsLeft: MAX_ATTEMPTS - data.attempts,
        lockedUntil: data.lockedUntil
    };
};

/**
 * Record a failed login attempt
 * @param {string} ip 
 * @returns {{ isLocked: boolean, attemptsLeft: number }}
 */
const recordFailedAttempt = async (ip) => {
    let data = loginAttempts.get(ip) || { attempts: 0, lockedUntil: null };
    
    data.attempts += 1;
    
    if (data.attempts >= MAX_ATTEMPTS) {
        data.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
        loginAttempts.set(ip, data);
        
        // Send lockout email alert
        await sendSecurityAlert('LOCKOUT', ip, { attempts: data.attempts });
        
        return { isLocked: true, attemptsLeft: 0 };
    }
    
    loginAttempts.set(ip, data);
    return { isLocked: false, attemptsLeft: MAX_ATTEMPTS - data.attempts };
};

/**
 * Reset attempts for an IP after successful login
 * @param {string} ip 
 */
const resetAttempts = (ip) => {
    loginAttempts.delete(ip);
};

/**
 * Middleware to check if IP is locked out
 */
const checkRateLimit = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const status = getIPStatus(ip);
    
    if (status.isLocked) {
        const remainingMs = status.lockedUntil - new Date();
        const remainingMinutes = Math.ceil(remainingMs / 60000);
        
        return res.status(429).json({
            success: false,
            message: `Too many failed attempts. Please try again in ${remainingMinutes} minutes.`,
            lockedUntil: status.lockedUntil
        });
    }
    
    next();
};

module.exports = {
    sendSecurityAlert,
    getIPStatus,
    recordFailedAttempt,
    resetAttempts,
    checkRateLimit,
    MAX_ATTEMPTS,
    LOCKOUT_DURATION_MS
};

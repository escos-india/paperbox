require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');
const { ROLES } = require('../config/constants');

async function debugLogin() {
    try {
        console.log('🔍 Starting Debug Login...');
        await connectDB();

        const email = 'admin@paperbox.com';
        const password = 'Admin@123';
        const secretKey = 'PAPERBOX-ADMIN-2024';

        console.log(`\nTesting Credentials:`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`Secret: ${secretKey}`);

        // 1. Find User
        const admin = await User.findOne({ email, role: ROLES.ADMIN }).select('+password +secretKey');
        
        if (!admin) {
            console.log('\n❌ ERROR: Admin user not found in DB!');
            const anyUser = await User.findOne({ email });
            if (anyUser) {
                console.log(`   Found user with email ${email} but role is ${anyUser.role} (Expected: ${ROLES.ADMIN})`);
            } else {
                console.log('   No user found with this email at all.');
            }
            process.exit(1);
        }
        console.log('\n✅ User found in DB.');
        console.log(`   ID: ${admin._id}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Stored Secret: ${admin.secretKey}`);

        // 2. Secret Key Check
        if (admin.secretKey !== secretKey) {
            console.log(`\n❌ Secret Key Mismatch!`);
            console.log(`   Expected: '${secretKey}'`);
            console.log(`   Actual:   '${admin.secretKey}'`);
            console.log(`   Equal?:   ${admin.secretKey === secretKey}`);
            console.log(`   Lengths:  ${admin.secretKey.length} vs ${secretKey.length}`);
        } else {
            console.log('\n✅ Secret Key Matches.');
        }

        // 3. Password Check
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            console.log('\n❌ Password Mismatch!');
            // Manually re-hash to see what it should look like
            const bcrypt = require('bcryptjs');
            const newHash = await bcrypt.hash(password, 12);
            console.log(`   Stored Hash: ${admin.password}`);
            console.log(`   New Hash of '${password}': ${newHash}`);
        } else {
            console.log('\n✅ Password Matches.');
        }

        if (admin && admin.secretKey === secretKey && isMatch) {
            console.log('\n🎉 SUCCESS: These credentials SHOULD work.');
        } else {
            console.log('\n💀 FAILURE: Authentication failed in debug script.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Debug verify error:', error);
        process.exit(1);
    }
}

debugLogin();

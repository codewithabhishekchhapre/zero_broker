const express = require('express');
const router = express.Router();
const { sendOtpToUser } = require('../controllers/otpController');

router.post('/send-otp', sendOtpToUser);

module.exports = router;

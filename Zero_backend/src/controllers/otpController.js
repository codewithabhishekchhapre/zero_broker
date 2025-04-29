// const twilio = require('twilio');

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken  = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// const client = new twilio(accountSid, authToken);

// const sendOtpViaSms = async (mobile, otp) => {
//   try {
//     const message = await client.messages.create({
//       body: `Your OTP is ${otp}`,
//       from: twilioPhone,
//       to: `+91${mobile}`,  // Adjust for your country code
//     });
//     return { success: true, sid: message.sid };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// };
// const generateOtp = () => {
//      return Math.floor(100000 + Math.random() * 900000).toString();
//    };
// const sendOtpToUser = async (req, res) => {
//   try {
//     const { mobile } = req.body;

//     if (!mobile || mobile.length !== 10) {
//       return res.status(400).json({ status: "failed", message: "Invalid mobile number" });
//     }

//     const otp = generateOtp();

//     const result = await sendOtpViaSms(mobile, otp);

//     if (result.success) {
//       // Store OTP in DB or cache here if needed
//       return res.status(200).json({ status: "success", message: "OTP sent successfully" });
//     } else {
//       return res.status(500).json({ status: "failed", message: "Failed to send OTP", error: result.error });
//     }
//   } catch (error) {
//     return res.status(500).json({ status: "failed", message: "Server error", error: error.message });
//   }
// };

// module.exports = { sendOtpToUser };

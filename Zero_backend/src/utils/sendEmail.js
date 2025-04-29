const sgMail = require("@sendgrid/mail");

// Set API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOtpEmail = async (to, otp) => {
    try {
        const msg = {
            to,
            from: process.env.EMAIL_FROM, // Your verified SendGrid sender email
            subject: "Your OTP Code for Verification",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #2c3e50; text-align: center;">OTP Verification</h2>
                    <p>Hello,</p>
                    <p>Thank you for signing up. Please use the OTP below to verify your email:</p>
                    <div style="font-size: 24px; font-weight: bold; text-align: center; padding: 15px; background: #f4f4f4; border-radius: 5px;">
                        ${otp}
                    </div>
                    <p style="margin-top: 20px;">If you didn’t request this, please ignore this email.</p>
                    
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                    
                    <h3 style="color: #2c3e50;">Need Help?</h3>
                    <p>If you have any questions or need assistance, feel free to reach out to our support team:</p>
                    <p>
                        📧 Email: <a href="mailto:zerobroker8134@gmail.com" style="color: #3498db;">zerobroker8134@gmail.com</a>
                    </p>
                    
                    <p>Best Regards, <br> <strong>Zero Broker</strong></p>
                </div>
            `,
        };

        await sgMail.send(msg);
        console.log("OTP Email sent successfully to:", to);
    } catch (error) {
        console.error("SendGrid Error:", error.response?.body || error.message);
        throw new Error("Email could not be sent.");
    }
};

module.exports = sendOtpEmail;

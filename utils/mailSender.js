const nodemailer = require("nodemailer");
const otpEmailTemplate = require('./otpEmailTemplate');
require('dotenv').config();

async function sendMail(email, otp) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: '"TypingMonk" <9431pk7@gmail.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "OTP verification from TypingMonk", // Subject line
        html: otpEmailTemplate(otp), // html body
    });

    return info;
}
module.exports = sendMail;
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create reusable transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT, 
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME, 
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Setup email data with unicode symbols
    let mailOptions = {
        from: `"Personal Fitness Tracker App" <${process.env.EMAIL_FROM}>`, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        html: options.html, // html body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

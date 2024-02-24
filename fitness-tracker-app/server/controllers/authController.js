const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation/userValidation');
const crypto = require('crypto'); // For generating the reset token
const sendEmail = require('../utils/emailService');

exports.register = async (req, res) => {
    try {
        // Validate user input
        const { error } = registerValidation(req.body);
        if (error) throw { status: 400, message: error.details[0].message };

        // Checking if email exists
        const emailExist = await User.findByEmail(req.body.email);
        if (emailExist) throw { status: 400, message: 'Email already exists' };

        // Create user 
        const newUser = await User.create(req.body);
        const newUserId = newUser.id;
        res.json({ user: newUserId });
    } catch (err) {
        res.status(err.status || 500).send(err.message || 'Server error');
    }
};

exports.login = async (req, res) => {
    // Validate user input
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the email exists
    const user = await User.findByEmail(req.body.email);
    if (!user) return res.status(400).send('Email or password is wrong');

    // Password is incorrect
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    // Create and assign a token
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send('Logged in!');
};

// Handle password reset request
exports.requestReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
        return res.status(200).send('If an account with that email exists, we have sent a password reset email.');
    }

    try {
        const resetToken = await User.generateResetToken(email);
        // Same host and password reset route as front-end
        const resetUrl = `${req.protocol}://localhost:3000/password-reset?token=${resetToken}`;

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message: 'You are receiving this email because we received a password reset request for your account.',
            html: `Please click on the following link, or paste it into your browser to complete the process: <a href="${resetUrl}">${resetUrl}</a>`
        });

        res.status(200).send('Password reset token has been sent to your email.');
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).send('Error sending password reset email.');
    }
};

// Handle password resetting
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        // Requesting token and newPassword from user
        const user = await User.resetPassword(token, newPassword);
        res.status(200).send('Your password has been updated.');
    } catch (error) {
        res.status(400).send(error.message);
    }
};


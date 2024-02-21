const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('server/validation/userValidation');
const crypto = require('crypto'); // For generating the reset token
const sendEmail = require('../utils/emailService');

exports.register = async (req, res) => {
    // Validate the user input
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the user is already in the database
    const emailExist = await User.findByEmail(req.body.email);
    if (emailExist) return res.status(400).send('Email already exists');

    // Create a new user
    try {
        const newUser = await User.create(req.body);
        res.send({ user: newUser.id });
    } catch (err) {
        res.status(400).send(err);
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
        // To avoid email enumeration, you might want to always return a success message
        return res.status(200).send('If an account with that email exists, we have sent a password reset email.');
    }

    // Generate a reset token
    const resetToken = await User.generateResetToken(email);
    // Here, you should send the resetToken to the user's email
    // For simplicity, we'll just log it
    console.log(`Generated reset token for ${email}: ${resetToken}`);

    res.status(200).send('Password reset token has been sent to your email.');
};

// Handle password resetting
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User.resetPassword(token, newPassword);
        res.status(200).send('Your password has been updated.');
    } catch (error) {
        res.status(400).send(error.message);
    }
};


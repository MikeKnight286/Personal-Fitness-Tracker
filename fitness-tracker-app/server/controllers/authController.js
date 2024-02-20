const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('server/validation/userValidation');

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

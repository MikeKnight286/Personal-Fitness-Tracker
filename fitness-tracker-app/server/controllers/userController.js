const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).send('User not found');
        // Exclude password and other sensitive info from the response
        const { password, ...userInfo } = user;
        res.json(userInfo);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await User.update(req.user.id, req.body);
        const { password, ...updatedUserInfo } = updatedUser;
        res.json(updatedUserInfo);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

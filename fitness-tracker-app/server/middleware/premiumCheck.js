const User = require('../models/User');

const premiumCheck = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id); // req.user set by verifyToken.js
        if (!user.isPremium) {
            return res.status(403).send('This feature requires a premium subscription.');
        }
        next();
    } catch (error) {
        res.status(500).send('Failed to verify user subscription status.');
    }
};

module.exports = premiumCheck;

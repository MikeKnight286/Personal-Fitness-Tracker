const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Adjust the header to match the standard 'Authorization' header format
    const authHeader = req.header('Authorization');
    // Standard format is "Bearer [token]", so we split by space and take the second part
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('Access Denied: No token provided');
        return res.status(401).send('Access Denied: No token provided');
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified; // Sets the user details in req.user

        // Debugging log to show the token is verified and user is set
        console.log('Token verified, user set in request:', req.user);

        next();
    } catch (err) {
        console.log('Invalid Token:', err.message); // Debugging log for invalid token
        res.status(400).send('Invalid Token');
    }
};


const pool = require('../config/db.js');

const adminCheck = async (req, res, next) => {
    // No user credentials in request
    if (!req.user) {
        return res.status(401).send('Access Denied: No credentials sent!');
    }

    try {
        // Query whether user is admin
        const { rows } = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
        if (rows.length > 0 && rows[0].is_admin) {
            next();
        } else {
            return res.status(403).send('Access Denied: Requires admin privileges!');
        }
    } catch (error) {
        return res.status(400).send('Error checking admin status');
    }
};

module.exports = adminCheck;

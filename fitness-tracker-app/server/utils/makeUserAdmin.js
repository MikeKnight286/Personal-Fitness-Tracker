const pool = require('server/config/db');

// Utility function to make a user admin
const makeUserAdmin = async (email) => {
    console.log(`Attempting to make user admin: ${email}`);
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      console.error(`User not found with email: ${email}, cannot make admin.`);
      return;
    }
    
    await pool.query('UPDATE users SET is_admin = TRUE WHERE email = $1', [email]);
    
    const checkAdminRes = await pool.query('SELECT is_admin FROM users WHERE email = $1', [email]);
    if (checkAdminRes.rows[0].is_admin) {
      console.log(`User ${email} successfully made admin.`);
    } else {
      console.error(`Failed to make user ${email} admin.`);
    }
  };
  

module.exports = makeUserAdmin;
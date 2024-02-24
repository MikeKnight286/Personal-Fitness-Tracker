const pool = require('../config/db.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For generating the password reset token

class User {
    static async findByEmail(email) {
        try {
            const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            return rows[0];
        } catch (error) {
            throw new Error('Error fetching user by email');
        }
    }

    static async findById(id) {
        try {
            const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            return rows[0];
        } catch (error) {
            throw new Error('Error fetching user by ID');
        }
    }

    static async create(userData) {
        const { username, email, password, firstName, lastName, dateOfBirth, gender, heightCm, weightKg, goal, isAdmin = false, isPremium = false } = userData; // Default to false if not provided
        const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password

        try {
            const { rows } = await pool.query(
                'INSERT INTO users (username, email, password, first_name, last_name, date_of_birth, gender, height_cm, weight_kg, goal, is_admin, is_premium) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
                [username, email, hashedPassword, firstName, lastName, dateOfBirth, gender, heightCm, weightKg, goal, isAdmin, isPremium]
            );
            return rows[0];
        } catch (error) {
            throw new Error('Error creating new user');
        }
    }

    static async update(id, updateData) {
        // Include isAdmin and isPremium in the update, ensure this method is protected and only accessible by superadmins
        const { firstName, lastName, gender, heightCm, weightKg, goal, isAdmin, isPremium } = updateData;
        try {
            const { rows } = await pool.query(
                'UPDATE users SET first_name = $1, last_name = $2, gender = $3, height_cm = $4, weight_kg = $5, goal = $6, is_admin = $7, is_premium = $8 WHERE id = $9 RETURNING *',
                [firstName, lastName, gender, heightCm, weightKg, goal, isAdmin, isPremium, id]
            );
            return rows[0];
        } catch (error) {
            throw new Error('Error updating user');
        }
    }

    static async delete(id) {
        try {
            await pool.query('DELETE FROM users WHERE id = $1', [id]);
        } catch (error) {
            throw new Error('Error deleting user');
        }
    }

    // Generate a password reset token and save it with the user
    static async generateResetToken(email) {
        const resetToken = crypto.randomBytes(20).toString('hex');
        const expireTime = Date.now() + 3600000; // 1 hour from now

        try {
            await pool.query('UPDATE users SET reset_token = $1, reset_token_expire = $2 WHERE email = $3', [resetToken, new Date(expireTime), email]);
            return resetToken;
        } catch (error) {
            throw new Error('Error generating password reset token');
        }
    }

    // Reset the password using the token
    static async resetPassword(token, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update the password when token is not yet expired 
        try {
            const { rows } = await pool.query('UPDATE users SET password = $1, reset_token = NULL, reset_token_expire = NULL WHERE reset_token = $2 AND reset_token_expire > NOW() RETURNING *', [hashedPassword, token]);
            if (rows.length === 0) {
                throw new Error('Password reset token is invalid or has expired.');
            }
            return rows[0];
        } catch (error) {
            throw new Error('Error resetting password');
        }
    }
}

module.exports = User;

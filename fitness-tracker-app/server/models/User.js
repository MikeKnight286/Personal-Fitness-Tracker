const pool = require('server/config/db.js');
const bcrypt = require('bcrypt');

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
        const { username, email, password, firstName, lastName, dateOfBirth, gender, heightCm, weightKg, goal } = userData;
        const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password

        try {
            const { rows } = await pool.query(
                'INSERT INTO users (username, email, password, first_name, last_name, date_of_birth, gender, height_cm, weight_kg, goal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
                [username, email, hashedPassword, firstName, lastName, dateOfBirth, gender, heightCm, weightKg, goal]
            );
            return rows[0];
        } catch (error) {
            throw new Error('Error creating new user');
        }
    }

    static async update(id, updateData) {
        // Dynamically build the update query based on provided data
        const { firstName, lastName, gender, heightCm, weightKg, goal } = updateData;
        try {
            const { rows } = await pool.query(
                'UPDATE users SET first_name = $1, last_name = $2, gender = $3, height_cm = $4, weight_kg = $5, goal = $6 WHERE id = $7 RETURNING *',
                [firstName, lastName, gender, heightCm, weightKg, goal, id]
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
}

module.exports = User;

const pool = require('../config/db.js');

class Activity {
    static async findAll() {
        const { rows } = await pool.query('SELECT * FROM activities');
        return rows;
    }

    static async findById(id) {
        const { rows } = await pool.query('SELECT * FROM activities WHERE id = $1', [id]);
        return rows[0];
    }

    // Admin-only method
    static async create(name, caloriesBurnedPerMinute) {
        const { rows } = await pool.query(
            'INSERT INTO activities (name, calories_burned_per_minute) VALUES ($1, $2) RETURNING *',
            [name, caloriesBurnedPerMinute]
        );
        return rows[0];
    }
}
module.exports = Activity;

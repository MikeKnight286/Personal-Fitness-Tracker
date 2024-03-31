const pool = require('../config/db'); 

class WaterIntake {
    // Insert a new water intake record
    static async create({ userId, amountMl, intakeDate, intakeTime }) {
        const query = {
            text: `INSERT INTO water_intake (user_id, amount_ml, intake_date, intake_time) VALUES ($1, $2, $3, $4) RETURNING *;`,
            values: [userId, amountMl, intakeDate, intakeTime],
        };

        try {
            const { rows } = await pool.query(query);
            return rows[0];
        } catch (error) {
            throw new Error(`Unable to create water intake record: ${error.message}`);
        }
    }

    // Retrieve water intake records by user ID
    static async findByUserId(userId) {
        const query = {
            text: `SELECT * FROM water_intake WHERE user_id = $1 ORDER BY intake_date DESC, intake_time DESC;`,
            values: [userId],
        };

        try {
            const { rows } = await pool.query(query);
            return rows;
        } catch (error) {
            throw new Error(`Unable to retrieve water intake records: ${error.message}`);
        }
    }

    // Update a water intake record by ID
    static async update(id, { amountMl, intakeDate, intakeTime }) {
        const query = {
            text: `UPDATE water_intake SET amount_ml = $2, intake_date = $3, intake_time = $4 WHERE id = $1 RETURNING *;`,
            values: [id, amountMl, intakeDate, intakeTime],
        };

        try {
            const { rows } = await pool.query(query);
            return rows[0];
        } catch (error) {
            throw new Error(`Unable to update water intake record: ${error.message}`);
        }
    }

    // Delete a water intake record by ID
    static async delete(id) {
        const query = {
            text: `DELETE FROM water_intake WHERE id = $1 RETURNING *;`,
            values: [id],
        };

        try {
            const { rows } = await pool.query(query);
            return rows[0];
        } catch (error) {
            throw new Error(`Unable to delete water intake record: ${error.message}`);
        }
    }
}

module.exports = WaterIntake;

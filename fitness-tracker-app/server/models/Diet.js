// server/models/Diet.js
const pool = require('../config/db.js');

class Diet {
    static async addDietEntry({ userId, foodName, calories, protein_g, carbs_g, fats_g, fiber_g, sugar_g, sodium_mg, cholesterol_mg, serving_size, meal_date, meal_type, notes }) {
        const { rows } = await pool.query(
            `INSERT INTO user_diets 
            (user_id, food_name, calories, protein_g, carbs_g, fats_g, fiber_g, sugar_g, sodium_mg, cholesterol_mg, serving_size, meal_date, meal_type, notes) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
            RETURNING *`,
            [userId, foodName, calories, protein_g, carbs_g, fats_g, fiber_g, sugar_g, sodium_mg, cholesterol_mg, serving_size, meal_date, meal_type, notes]
        );
        return rows[0];
    }

    static async findDietEntriesByUserId(userId) {
        const { rows } = await pool.query(
            'SELECT * FROM user_diets WHERE user_id = $1',
            [userId]
        );
        return rows;
    }

    static async updateDietEntry(id, { calories, protein_g, carbs_g, fats_g, fiber_g, sugar_g, sodium_mg, cholesterol_mg, serving_size, meal_type, notes }) {
        const { rows } = await pool.query(
            `UPDATE user_diets 
            SET calories = $2, protein_g = $3, carbs_g = $4, fats_g = $5, fiber_g = $6, sugar_g = $7, sodium_mg = $8, cholesterol_mg = $9, serving_size = $10, meal_type = $11, notes = $12, updated_at = NOW()
            WHERE id = $1 
            RETURNING *`,
            [id, calories, protein_g, carbs_g, fats_g, fiber_g, sugar_g, sodium_mg, cholesterol_mg, serving_size, meal_type, notes]
        );
        return rows[0];
    }

    static async deleteDietEntry(id) {
        const { rows } = await pool.query(
            'DELETE FROM user_diets WHERE id = $1 RETURNING *',
            [id]
        );
        return rows[0];
    }
}

module.exports = Diet;

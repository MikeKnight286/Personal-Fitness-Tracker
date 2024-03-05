const pool = require('../config/db.js');

class Diet {
    static async addDietEntry({ userId, food_name, calories, protein_g, carbs_g, fats_g, fiber_g, sugar_g, sodium_mg, cholesterol_mg, serving_size, meal_date, meal_type, notes }) {
        const { rows } = await pool.query(
            `INSERT INTO user_diets 
            (user_id, food_name, calories, protein_g, carbs_g, fats_g, fiber_g, sugar_g, sodium_mg, cholesterol_mg, serving_size, meal_date, meal_type, notes) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
            RETURNING *`,
            [userId, food_name, calories, protein_g, carbs_g, fats_g, fiber_g, sugar_g, sodium_mg, cholesterol_mg, serving_size, meal_date, meal_type, notes]
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

    static async updateDietEntry(id, { food_name, calories, protein_g, carbs_g, fats_g, fiber_g, sugar_g, sodium_mg, cholesterol_mg, serving_size, meal_date, meal_type, notes }) {
        const { rows } = await pool.query(
            `UPDATE user_diets 
            SET food_name = $2, calories = $3, protein_g = $4, carbs_g = $5, fats_g = $6, fiber_g = $7, sugar_g = $8, sodium_mg = $9, cholesterol_mg = $10, serving_size = $11, meal_date = $12, meal_type = $13, notes = $14, updated_at = NOW()
            WHERE id = $1 
            RETURNING *`,
            [id, food_name, calories, protein_g, carbs_g, fats_g, fiber_g, sugar_g, sodium_mg, cholesterol_mg, serving_size, meal_date, meal_type, notes]
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

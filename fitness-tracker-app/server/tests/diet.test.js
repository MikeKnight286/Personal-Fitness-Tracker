const request = require('supertest');
const app = require('../index'); 
const pool = require('../config/db');
const server_port = require('../index'); 

// Cleanup function to delete test diets and users
const cleanUpDatabase = async () => {
    await pool.query('DELETE FROM user_diets');
    await pool.query('DELETE FROM users WHERE email IN ($1, $2)', ['user@example.com', 'admin@example.com']);
};

// Sleep function to put gaps between processes
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Diet Endpoints', () => {
    let userToken;
    let userId; // To store user ID
    let dietEntryId; // To store diet ID

    beforeAll(async () => {
        // Clean database before tests
        await cleanUpDatabase();

        // Create a user
        const userRes = await request(app).post('/api/users/register').send({
            username: 'testUser',
            email: 'user@example.com',
            password: 'password123',
        });
        userId = userRes.body.user;

        await sleep(1000); // Sleep for 1 second

        // Login as user to get token
        const userLoginRes = await request(app).post('/api/users/login').send({ 
            email: 'user@example.com', 
            password: 'password123' 
        });
        userToken = userLoginRes.headers['auth-token'];
    });

    it('should allow user to add a diet entry', async () => {
        const res = await request(app)
            .post('/api/diets/user-diets')
            .set('auth-token', userToken)
            .send({
                food_name: 'Banana',
                calories: 105,
                protein_g: 1.3,
                carbs_g: 27,
                fats_g: 0.3,
                meal_date: '2024-02-28',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        dietEntryId = res.body.id; // Store diet ID
    });

    it('should allow user to get their diet entries', async () => {
        const res = await request(app)
            .get(`/api/diets/user-diets/${userId}`)
            .set('auth-token', userToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should allow user to update a diet entry', async () => {
        const updateRes = await request(app)
            .put(`/api/diets/user-diets/${dietEntryId}`) 
            .set('auth-token', userToken)
            .send({
                // Different Values
                food_name: 'Updated Banana',
                calories: 110,
                protein_g: 1.5,
                carbs_g: 28,
                fats_g: 0.4,
                meal_date: '2024-02-29', 
            });
        expect(updateRes.statusCode).toEqual(200);
        expect(updateRes.body).toHaveProperty('id');
        expect(updateRes.body.food_name).toEqual('Updated Banana');
    });
    
    it('should allow user to delete a diet entry', async () => {
        const deleteRes = await request(app)
            .delete(`/api/diets/user-diets/${dietEntryId}`) 
            .set('auth-token', userToken);
        expect(deleteRes.statusCode).toEqual(204); // No Content on successful delete
    });

    afterAll(async () => {
        await cleanUpDatabase(); // Clean the database
        await pool.end(); // Properly close the pool connection
        server_port.close(); 
    });
});

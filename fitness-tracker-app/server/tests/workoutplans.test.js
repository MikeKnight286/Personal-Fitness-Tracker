const request = require('supertest');
const app = require('../index');
const pool = require('../config/db');
const server_port = require('../index');

// Cleanup function to delete test workout plans and users
const cleanUpDatabase = async () => {
    await pool.query('DELETE FROM workout_plans');
    await pool.query('DELETE FROM users WHERE email IN ($1, $2)', ['test@example.com', 'admin@example.com']);
};

describe('Workout Plan Endpoints', () => {
    let adminToken;
    let workoutPlanId;

    beforeAll(async () => {
        // Clean database before tests
        await cleanUpDatabase();

        // Create an admin user and login to get token
        await request(app).post('/api/users/register').send({
            username: 'adminUser',
            email: 'admin@example.com',
            password: 'adminPassword',
        });

        const adminLoginRes = await request(app).post('/api/users/login').send({
            email: 'admin@example.com',
            password: 'adminPassword',
        });

        adminToken = adminLoginRes.body.token;
    });

    it('should allow admin to create a new workout plan', async () => {
        const res = await request(app)
            .post('/api/workoutplans')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Test Plan',
                description: 'Test plan description',
                target_goal: 'muscle gain',
                difficulty_level: 'beginner',
                duration_weeks: 4,
                sessions_per_week: 3,
                premium_only: false,
                video_url: 'http://example.com/video',
                prerequisites: 'None',
                tags: ['muscle', 'beginner']
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        workoutPlanId = res.body.id
        console.log(workoutPlanId);
    });

    it('should allow user to get all workout plans', async () => {
        const res = await request(app)
            .get('/api/workoutplans')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        console.log('All Plans', res.body);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // Add a new test case to explicitly request premium plans
    it('should allow user to get only premium workout plans if specified', async () => {
        const res = await request(app)
            .get('/api/workoutplans?premiumOnly=true')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        console.log('Premium Plans', res.body);
        // This check depends on the actual data in your database
        expect(res.body.every(plan => plan.premium_only)).toBe(true);
    });

    it('should allow user to get a specific workout plan by ID', async () => {
        const res = await request(app)
            .get(`/api/workoutplans/${workoutPlanId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
    });

    it('should allow admin to update a workout plan', async () => {
        const res = await request(app)
            .put(`/api/workoutplans/${workoutPlanId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Updated Test Plan',
                description: 'Test plan description',
                target_goal: 'muscle gain',
                difficulty_level: 'beginner',
                duration_weeks: 4,
                sessions_per_week: 3,
                premium_only: false,
                video_url: 'http://example.com/video',
                prerequisites: 'None',
                tags: ['muscle', 'beginner']
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Updated Test Plan');
    });

    it('should allow admin to delete a workout plan', async () => {
        const res = await request(app)
            .delete(`/api/workoutplans/${workoutPlanId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', workoutPlanId);
    });

    afterAll(async () => {
        await cleanUpDatabase();
        await pool.end();
        server_port.close(); // Close the server
    });
});

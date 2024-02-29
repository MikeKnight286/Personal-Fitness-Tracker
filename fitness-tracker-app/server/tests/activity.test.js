const request = require('supertest');
const app = require('../index'); 
const pool = require('../config/db');
const makeUserAdmin = require('../utils/makeUserAdmin');
const server_port = require('../index');

// Cleanup function to delete test users
const cleanUpDatabase = async () => {
    await pool.query('DELETE FROM user_activities');
    await pool.query('DELETE FROM activities');
    await pool.query('DELETE FROM users WHERE email IN ($1, $2)', ['regular@example.com', 'admin@example.com']);
};

// Sleep function to put gaps between processes
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Activity Endpoints', () => {
    let adminToken, userToken;
    let adminUserId, regularUserId; // To store user IDs
    let activityId; // To store created activity ID

  beforeAll(async () => {
    // Clean database before tests
    await cleanUpDatabase(); 

    // Create a regular user
    const regularUserRes = await request(app).post('/api/users/register').send({
        username: 'regularUser',
        email: 'regular@example.com',
        password: 'password123',
    });
    regularUserId = regularUserRes.body.user;

    // Create an admin user
    const adminUserRes = await request(app).post('/api/users/register').send({
        username: 'adminUser',
        email: 'admin@example.com',
        password: 'password123',
    });
    adminUserId = adminUserRes.body.user;

    await sleep(3000); // Sleep for 3 seconds
    // Assign it admin role
    await makeUserAdmin('admin@example.com');
    
    // Login as admin to get token
    const adminLoginRes = await request(app).post('/api/users/login').send({ 
        email: 'admin@example.com', 
        password: 'password123' 
    });
    adminToken = adminLoginRes.headers['auth-token']; 

    // Login as regular user to get token
    const userLoginRes = await request(app).post('/api/users/login').send({ 
        email: 'regular@example.com', 
        password: 'password123' 
    });
    userToken = userLoginRes.headers['auth-token']; 
  });

  it('should allow admin to create a new activity', async () => {
    const res = await request(app)
      .post('/api/activities/create-activity')
      .set('auth-token', adminToken)
      .send({ name: 'Running', caloriesBurnedPerMinute: 10 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    activityId = res.body.id; // Store activiity ID
    console.log(`Admin created a new activity with ID: ${activityId}`);
  });

  it('should allow admin to get all activities', async () => {
    const res = await request(app)
      .get('/api/activities/all-activities')
      .set('auth-token', adminToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    console.log('Admin received all activities')

  });

  it('should deny regular user access to create a new activity', async () => {
    const res = await request(app)
      .post('/api/activities/create-activity')
      .set('auth-token', userToken)
      .send({ name: 'Swimming', caloriesBurnedPerMinute: 8 });
    expect(res.statusCode).toEqual(403);
    console.log('Denied access from regular user')
  });

  it('should allow user to add an activity to their record', async () => {
    expect(activityId).toBeDefined();
    expect(regularUserId).toBeDefined();

    const res = await request(app)
      .post('/api/activities/add-user-activity')
      .set('auth-token', userToken)
      .send({ userId: regularUserId, activityId: activityId, durationMinutes: 30 }); 
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('calories_burned');
  });

  it('should allow user to get their activities', async () => {
    const res = await request(app)
      .get(`/api/activities/user-activities/${regularUserId}`)
      .set('auth-token', userToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await cleanUpDatabase(); // Clean the database
    await pool.end(); // Properly close the pool connection
    server_port.close(); // Close the server
  });
});

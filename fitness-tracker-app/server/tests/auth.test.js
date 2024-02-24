const request = require('supertest');
const app = require('../index'); 
const pool = require('server/config/db'); // For database cleanup
const testemail = process.env.TEST_EMAIL // Load test email from environment variables
const server_port = require('../index');
const makeUserAdmin = require('../utils/makeUserAdmin');

// Cleanup function to delete test users
const cleanUpDatabase = async () => {
  await pool.query('DELETE FROM users WHERE email IN ($1, $2, $3)', [testemail, 'regular@example.com', 'admin@example.com']);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    await cleanUpDatabase(); // Delete the test user before the tests
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: testemail,
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testemail,
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.headers).toHaveProperty('auth-token');
  });
});

describe('Password Reset Endpoints', () => {
  let resetToken; // Variable to store the reset token for use in resetting password

  it('should request a password reset link for an existing user', async () => {
      // Assuming the user already exists from the previous test
      const res = await request(app)
          .post('/api/users/reset-request')
          .send({ email: testemail });

      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('Password reset token has been sent to your email.');

      // In a real application, retrieve the token from the mocked email service
      // For testing purposes, access the password reset token from database
      // Since there are no real emails in this test, simulate obtaining a token
      // This would be replaced with the method of retrieving the token
      const dbResponse = await pool.query('SELECT reset_token FROM users WHERE email = $1', [testemail]);
      resetToken = dbResponse.rows[0].reset_token;
      expect(resetToken).not.toBeNull();
  }, 20000);

  it('should reset the password using the reset token', async () => {
      const newPassword = 'newSecurePassword123';
      const res = await request(app)
          .post('/api/users/reset-password')
          .send({
              token: resetToken, // Use the token obtained in the previous step
              newPassword: newPassword,
          });

      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('Your password has been updated.');

      // Try logging in with the new password to verify the reset was successful
      const loginResponse = await request(app)
          .post('/api/users/login')
          .send({
              email: testemail,
              password: newPassword,
          });

      expect(loginResponse.statusCode).toEqual(200);
      expect(loginResponse.headers).toHaveProperty('auth-token');
  }, 10000 );
});

describe('Admin Access Endpoints', () => {
  let userToken; // Token for the regular user
  let adminToken; // Token for the admin user

  beforeAll(async () => {
      // Create a regular user
      await request(app).post('/api/users/register').send({
          username: 'regularUser',
          email: 'regular@example.com',
          password: 'password123',
      });

      // Create another user to be made admin
      await request(app).post('/api/users/register').send({
          username: 'adminUser',
          email: 'admin@example.com',
          password: 'password123',
      });

      await sleep(3000); // Sleep for 3 seconds
      // Make the second user an admin
      await makeUserAdmin('admin@example.com');

      // Login as the regular user to obtain a token
      const userLoginRes = await request(app).post('/api/users/login').send({
          email: 'regular@example.com',
          password: 'password123',
      });
      userToken = userLoginRes.headers['auth-token'];

      // Login as the admin user to obtain a token
      const adminLoginRes = await request(app).post('/api/users/login').send({
          email: 'admin@example.com',
          password: 'password123',
      });
      console.log(`Admin login response: ${adminLoginRes.statusCode}, body: ${JSON.stringify(adminLoginRes.body)}`);
      adminToken = adminLoginRes.headers['auth-token'];

      // Log to ensure the tokens are not undefined
      console.log(`User Token: ${userToken}`);
      console.log(`Admin Token: ${adminToken}`);
  }, 100000);

  it('should deny access to a regular user for admin routes', async () => {
      const res = await request(app)
          .get('/api/users/admin/all-users') // Test admin route
          .set('auth-token', userToken);
      
      expect(res.statusCode).toEqual(403);
  },100000);

  it('should allow access to an admin user for admin routes', async () => {
      const res = await request(app)
          .get('/api/users/admin/all-users') // Test admin route
          .set('auth-token', adminToken);
      
      expect(res.statusCode).toEqual(200);
  },100000);

  afterAll(async () => {
    // Cleanup: delete the test users
    await cleanUpDatabase();
    await pool.end(); // Close the pool connection after tests
    server_port.close(); // Close the server after tests
  });
});


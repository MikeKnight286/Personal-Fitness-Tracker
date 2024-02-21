const request = require('supertest');
const app = require('server/index'); // Adjust this path to where your Express app is exported
const pool = require('server/config/db'); // For database cleanup

// Cleanup function to delete test users
const cleanUpDatabase = async () => {
    await pool.query('DELETE FROM users WHERE email = $1', ['testuser@example.com']);
};

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    await cleanUpDatabase(); // Delete the test user before the tests
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.headers).toHaveProperty('auth-token');
  });
});

describe('Password Reset Endpoints', () => {
  let resetToken; // Variable to store the reset token for use in resetting password

  afterAll(async () => {
    await cleanUpDatabase();
    await pool.end(); // Properly close the pool connection after tests
  });

  it('should request a password reset link for an existing user', async () => {
      // Assuming the user already exists from the previous test
      const res = await request(app)
          .post('/api/users/reset-request')
          .send({ email: 'testuser@example.com' });

      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('Password reset token has been sent to your email.');

      // In a real application, retrieve the token from the mocked email service
      // For testing purposes, access the password reset token from database
      // Since there are no real emails in this test, simulate obtaining a token
      // This would be replaced with the method of retrieving the token
      const dbResponse = await pool.query('SELECT reset_token FROM users WHERE email = $1', ['testuser@example.com']);
      resetToken = dbResponse.rows[0].reset_token;
      expect(resetToken).not.toBeNull();
  });

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
              email: 'testuser@example.com',
              password: newPassword,
          });

      expect(loginResponse.statusCode).toEqual(200);
      expect(loginResponse.headers).toHaveProperty('auth-token');
  }, 10000 );
});

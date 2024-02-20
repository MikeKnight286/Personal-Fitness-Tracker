const request = require('supertest');
const app = require('server/index'); // Adjust this path to where your Express app is exported
const pool = require('server/config/db'); // For database cleanup

// Cleanup function to delete test users
const cleanUpDatabase = async () => {
    await pool.query('DELETE FROM users WHERE email = $1', ['testuser@example.com']);
};

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    await cleanUpDatabase();
  });

  afterAll(async () => {
    await cleanUpDatabase();
    await pool.end(); // Properly close the pool connection after tests
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

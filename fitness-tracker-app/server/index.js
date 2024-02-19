/* Necessary Modules and Initiation */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001; 

/* Parse incoming request */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Simple route for testing */
app.get('/', (req, res) => {
    res.send('Hello World from the Fitness Tracker App Server!');
  });

/* Listening on the port */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


/* Database client */
const { Pool } = require('pg');

const pool = new Pool({
user: 'postgres',
host: 'localhost',
database: 'fitness_tracker_app',
password: 'nxnH9807B',
port: 5432, // Default PostgreSQL port
});

module.exports = pool;

/* Database test */
// Query example
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  pool.end();
});

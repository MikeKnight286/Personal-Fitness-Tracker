require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // For authorized sharing resources from external API
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

// Modularized Routes
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const dietRoutes = require('./routes/dietRoutes');
const workoutPlansRoutes = require('./routes/workoutplansRoutes');
const userWorkoutPlansRoutes = require('./routes/userworkoutplansRoutes');
// const waterIntakeRoutes = require('./routes/waterIntakeRoutes');
// const subscriptionRoutes = require('./routes/subscriptionRoutes');

// Middleware
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Using modularized routes
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/diets', dietRoutes);
app.use('/api/workoutplans', workoutPlansRoutes);
app.use('/api/userworkoutplans', userWorkoutPlansRoutes);
// app.use('/api/waterIntakes', waterIntakeRoutes);
// app.use('/api/subscriptions', subscriptionRoutes);

// Simple route for testing
app.get('/', (req, res) => {
    res.send('Hello World from the Fitness Tracker App Server!');
});

// Serves static files
app.use(express.static(path.join(__dirname, '..', '..', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'build', 'index.html'));
});

// Listening on the port
const server_port = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
module.exports = server_port;
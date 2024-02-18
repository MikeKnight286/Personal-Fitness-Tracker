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
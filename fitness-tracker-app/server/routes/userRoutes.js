const express = require('express');
const router = express.Router();

// Define some routes
router.get('/', (req, res) => {
  res.send('User route');
});

// Export the router
module.exports = router;
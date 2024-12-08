const express = require('express');
const User = require('../models/User');
const router = express.Router();
router.get('/current-user', (req, res) => {
    if (!req.user) {  // If there's no user object attached to the request
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    res.status(200).json({ role: user.role });
  });
  
  module.exports = router;
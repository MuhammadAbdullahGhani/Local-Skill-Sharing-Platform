const jwt = require('jsonwebtoken');

// Middleware to authenticate and decode the JWT token
const authenticateToken = (req, res, next) => {
  // Get token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from 'Bearer token'

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification failed:', err.message); // Log JWT error
      return res.status(403).json({ message: 'Forbidden - Invalid token' });
    }

    // Successfully decoded the token, attach the user data to the request
    req.user = user;

    next();
  });
};

module.exports = authenticateToken;

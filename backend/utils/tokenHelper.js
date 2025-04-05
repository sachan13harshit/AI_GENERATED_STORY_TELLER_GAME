const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Generate JWT Token
exports.generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

// Verify JWT Token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};
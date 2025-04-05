const express = require('express');
const {
  getCurrentUser,
  updateUser,
  updatePassword,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// All routes require authentication (applied in server.js)
router.get('/me', getCurrentUser);
router.put('/me', updateUser);
router.put('/password', updatePassword);
router.delete('/me', deleteUser);

module.exports = router;
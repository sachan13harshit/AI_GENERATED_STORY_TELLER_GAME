const express = require('express');
const {
  generateStory,
  continueStory,
  getUserStories,
  getStory,
  saveStory,
  shareStory,
  getSharedStory,
  deleteStory
} = require('../controllers/storyController');

const router = express.Router();

// All routes require authentication (applied in server.js)
router.post('/generate', generateStory);
router.post('/:id/continue', continueStory);
router.get('/', getUserStories);
router.get('/:id', getStory);
router.put('/:id', saveStory);
router.post('/:id/share', shareStory);
router.get('/shared/:shareId', getSharedStory);
router.delete('/:id', deleteStory);

module.exports = router;
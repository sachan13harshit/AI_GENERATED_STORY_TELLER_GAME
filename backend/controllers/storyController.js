// controllers/storyController.js
const crypto = require('crypto');
const Story = require('../models/Story');
const StorySegment = require('../models/StorySegment');
const { asyncHandler } = require('../utils/errorHandler');
const aiService = require('../services/aiService');

// @desc    Generate a new story from prompt
// @route   POST /api/stories/generate
// @access  Private
exports.generateStory = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a prompt'
    });
  }

  // Generate story using AI service
  const storyData = await aiService.generateStoryStart(prompt);
  
  // Create new story in database
  const story = await Story.create({
    title: storyData.title,
    user: req.user.id,
    initialPrompt: prompt,
    preview: storyData.content.substring(0, 150) + '...'
  });

  // Create first story segment
  const segment = await StorySegment.create({
    story: story._id,
    content: storyData.content,
    prompt: prompt,
    choices: storyData.choices,
    sequence: 1
  });

  // Return the story data
  res.status(201).json({
    success: true,
    id: story._id,
    title: story.title,
    content: segment.content,
    choices: segment.choices
  });
});

// @desc    Continue a story with a selected choice
// @route   POST /api/stories/:id/continue
// @access  Private
exports.continueStory = asyncHandler(async (req, res) => {
  const { choice } = req.body;
  
  if (!choice) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a choice'
    });
  }

  // Find the story
  const story = await Story.findById(req.params.id);
  
  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    });
  }
  
  // Check ownership
  if (story.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this story'
    });
  }

  // Find the latest segment
  const latestSegment = await StorySegment.findOne({
    story: story._id
  }).sort({ sequence: -1 });

  // Generate continuation using AI service
  const continuation = await aiService.continueStory(
    latestSegment.content,
    choice
  );

  // Create new story segment
  const newSegment = await StorySegment.create({
    story: story._id,
    content: continuation.content,
    prompt: choice,
    choices: continuation.choices,
    parentSegment: latestSegment._id,
    choiceMade: choice,
    sequence: latestSegment.sequence + 1
  });

  // Update story segment count
  await Story.findByIdAndUpdate(story._id, {
    segmentCount: story.segmentCount + 1,
    updatedAt: Date.now()
  });

  // Return the continuation data
  res.status(200).json({
    success: true,
    id: newSegment._id,
    content: newSegment.content,
    choices: newSegment.choices
  });
});

// @desc    Get all stories for the current user
// @route   GET /api/stories
// @access  Private
exports.getUserStories = asyncHandler(async (req, res) => {
  const stories = await Story.find({ user: req.user.id })
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    count: stories.length,
    data: stories.map(story => ({
      id: story._id,
      title: story.title,
      preview: story.preview,
      segmentCount: story.segmentCount,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt
    }))
  });
});

// @desc    Get a single story by ID
// @route   GET /api/stories/:id
// @access  Private
exports.getStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  
  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    });
  }
  
  // Check ownership unless story is public
  if (!story.isPublic && story.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this story'
    });
  }

  // Get all segments for the story
  const segments = await StorySegment.find({ story: story._id })
    .sort({ sequence: 1 });

  res.status(200).json({
    success: true,
    id: story._id,
    title: story.title,
    initialPrompt: story.initialPrompt,
    segments: segments.map(segment => ({
      id: segment._id,
      content: segment.content,
      choices: segment.choices,
      choiceMade: segment.choiceMade,
      sequence: segment.sequence
    }))
  });
});

// @desc    Save/update a story
// @route   PUT /api/stories/:id
// @access  Private
exports.saveStory = asyncHandler(async (req, res) => {
  const { title, preview, segments } = req.body;
  
  let story = await Story.findById(req.params.id);
  
  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    });
  }
  
  // Check ownership
  if (story.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this story'
    });
  }

  // Update story
  story = await Story.findByIdAndUpdate(
    req.params.id,
    { 
      title,
      preview,
      segmentCount: segments ? segments.length : story.segmentCount,
      updatedAt: Date.now()
    },
    { new: true, runValidators: true }
  );

  // Update or create story segments if provided
  if (segments && Array.isArray(segments)) {
    // Delete existing segments
    await StorySegment.deleteMany({ story: story._id });
    
    // Create new segments
    await Promise.all(segments.map((segment, index) => 
      StorySegment.create({
        story: story._id,
        content: segment.content,
        prompt: segment.prompt,
        choices: segment.choices || [],
        sequence: index + 1
      })
    ));
  }

  // Get updated segments
  const updatedSegments = await StorySegment.find({ story: story._id })
    .sort({ sequence: 1 });

  res.status(200).json({
    success: true,
    data: {
      _id: story._id,
      title: story.title,
      preview: story.preview,
      segmentCount: story.segmentCount,
      segments: updatedSegments.map(segment => ({
        content: segment.content,
        prompt: segment.prompt,
        choices: segment.choices,
        sequence: segment.sequence
      })),
      createdAt: story.createdAt,
      updatedAt: story.updatedAt
    }
  });
});

// @desc    Generate a share link for a story
// @route   POST /api/stories/:id/share
// @access  Private
exports.shareStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  
  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    });
  }
  
  // Check ownership
  if (story.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to share this story'
    });
  }

  // Generate unique share ID if doesn't exist
  if (!story.shareId) {
    story.shareId = crypto.randomBytes(10).toString('hex');
    story.isPublic = true;
    await story.save();
  }

  // Construct share URL
  const shareUrl = `${req.protocol}://${req.get('host')}/story/shared/${story.shareId}`;

  res.status(200).json({
    success: true,
    shareUrl
  });
});

// @desc    Get a story by share ID
// @route   GET /api/stories/shared/:shareId
// @access  Public
exports.getSharedStory = asyncHandler(async (req, res) => {
  const story = await Story.findOne({ shareId: req.params.shareId });
  
  if (!story || !story.isPublic) {
    return res.status(404).json({
      success: false,
      message: 'Shared story not found'
    });
  }

  // Get all segments for the story
  const segments = await StorySegment.find({ story: story._id })
    .sort({ sequence: 1 });

  res.status(200).json({
    success: true,
    id: story._id,
    title: story.title,
    initialPrompt: story.initialPrompt,
    segments: segments.map(segment => ({
      id: segment._id,
      content: segment.content,
      choices: segment.choices,
      choiceMade: segment.choiceMade,
      sequence: segment.sequence
    }))
  });
});

// @desc    Delete a story
// @route   DELETE /api/stories/:id
// @access  Private
exports.deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  
  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    });
  }
  
  // Check ownership
  if (story.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this story'
    });
  }

  // Delete all segments
  await StorySegment.deleteMany({ story: story._id });
  
  // Delete story
  await story.remove();

  res.status(200).json({
    success: true,
    message: 'Story deleted successfully'
  });
});
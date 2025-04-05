// controllers/userController.js
const User = require('../models/User');
const Story = require('../models/Story');
const { asyncHandler } = require('../utils/errorHandler');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get story count
  const storyCount = await Story.countDocuments({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      storyCount,
      createdAt: user.createdAt
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // Build update object
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  // Update user
  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate request
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password'
    });
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Get token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/me
// @access  Private
exports.deleteUser = asyncHandler(async (req, res) => {
  // Delete all user stories and segments
  // This would typically be handled with a pre-remove middleware
  // or a cascade delete in the database
  
  // For now, we'll handle it manually
  const stories = await Story.find({ user: req.user.id });
  
  // Remove all stories (story segments will be deleted by a cascade)
  await Story.deleteMany({ user: req.user.id });
  
  // Delete user
  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({
    success: true,
    message: 'User account deleted successfully'
  });
});
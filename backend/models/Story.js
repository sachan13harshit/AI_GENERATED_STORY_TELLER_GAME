const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  initialPrompt: {
    type: String,
    required: [true, 'Please provide an initial prompt']
  },
  preview: {
    type: String,
    required: [true, 'Story preview is required']
  },
  segmentCount: {
    type: Number,
    default: 1
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  shareId: {
    type: String,
    unique: true,
    sparse: true // Only enforce uniqueness if field exists
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp when story is modified
StorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Story', StorySchema);
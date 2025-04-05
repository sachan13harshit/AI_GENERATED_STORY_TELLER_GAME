const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySegmentSchema = new Schema({
  story: {
    type: Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Segment content is required']
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required']
  },
  choices: {
    type: [String],
    default: []
  },
  parentSegment: {
    type: Schema.Types.ObjectId,
    ref: 'StorySegment',
    default: null
  },
  choiceMade: {
    type: String,
    default: null
  },
  sequence: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StorySegment', StorySegmentSchema);
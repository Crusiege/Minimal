const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    minlength: [1, 'Content must be at least 1 character'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  readTime: {
    type: Number, // in minutes
    default: 1
  },
  featuredImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ likes: 1 });
postSchema.index({ views: -1 });
postSchema.index({ status: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ title: 'text', content: 'text' }); // Text search

// Virtual for likes count
postSchema.virtual('likesCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for formatted date
postSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Pre-save middleware to generate excerpt and calculate read time
postSchema.pre('save', function(next) {
  // Generate excerpt if not provided
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + (this.content.length > 150 ? '...' : '');
  }
  
  // Calculate read time (average 200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  
  next();
});

// Instance method to check if user liked the post
postSchema.methods.isLikedBy = function(userId) {
  return this.likes.includes(userId);
};

// Instance method to toggle like
postSchema.methods.toggleLike = function(userId) {
  const isLiked = this.isLikedBy(userId);
  
  if (isLiked) {
    this.likes = this.likes.filter(id => !id.equals(userId));
  } else {
    this.likes.push(userId);
  }
  
  return !isLiked; // Return new like status
};

// Static method to get popular posts
postSchema.statics.getPopular = function(limit = 10) {
  return this.find({ status: 'published' })
    .sort({ views: -1, likesCount: -1 })
    .limit(limit)
    .populate('author', 'name avatar');
};

// Static method to get recent posts
postSchema.statics.getRecent = function(limit = 10) {
  return this.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('author', 'name avatar');
};

module.exports = mongoose.model('Post', postSchema); 
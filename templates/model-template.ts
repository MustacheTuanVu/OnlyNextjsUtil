import mongoose, { Schema, Document } from 'mongoose';

// Interface định nghĩa TypeScript cho entity
export interface IEntityName extends Document {
  // Required fields
  title: string;
  userId: mongoose.Types.ObjectId;
  
  // Optional fields
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  
  // Auto-generated timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition cho MongoDB
const EntityNameSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  
  // Reference to User model (required for multi-tenant data)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true // Index for performance
  }
  
  // Add more fields as needed
  // tags: [{
  //   type: String,
  //   trim: true
  // }],
  
  // priority: {
  //   type: String,
  //   enum: ['low', 'medium', 'high'],
  //   default: 'medium'
  // }
  
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
EntityNameSchema.index({ userId: 1, createdAt: -1 });
EntityNameSchema.index({ userId: 1, status: 1 });

// Virtual fields (computed properties)
EntityNameSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

// Instance methods
EntityNameSchema.methods.markAsArchived = function() {
  this.status = 'archived';
  return this.save();
};

// Static methods
EntityNameSchema.statics.findActiveByUser = function(userId: string) {
  return this.find({ userId, status: 'active' });
};

// Pre-save middleware
EntityNameSchema.pre('save', function(next) {
  // Add any pre-save logic here
  // Example: Auto-generate slug, validate business rules, etc.
  next();
});

// Export model (handles both development and production)
export default mongoose.models.EntityName || mongoose.model<IEntityName>('EntityName', EntityNameSchema); 
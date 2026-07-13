import mongoose from 'mongoose';

const adminAccessLogSchema = new mongoose.Schema({
  adminEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  
  attemptType: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  },
  
  ipAddress: String,
  userAgent: String,
  
  lockoutActive: {
    type: Boolean,
    default: false
  },
  
  attemptCount: {
    type: Number,
    default: 0
  },
  
  lockedUntil: Date,
  
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // Auto-delete after 30 days
  }
});

// Indexes
adminAccessLogSchema.index({ adminEmail: 1 });
adminAccessLogSchema.index({ createdAt: 1 });

export const AdminAccessLog = mongoose.model('AdminAccessLog', adminAccessLogSchema);

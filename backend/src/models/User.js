import mongoose from 'mongoose';

const { Schema } = mongoose;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_RE, 'Invalid email']
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['client', 'va', 'admin'],
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'deactivated'],
      default: 'active',
      index: true
    },
    phone: { type: String, trim: true, default: '' },
    avatarUrl: { type: String, default: '' },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false, default: null },
    emailVerificationExpires: { type: Date, select: false, default: null },
    passwordResetToken: { type: String, select: false, default: null },
    passwordResetExpires: { type: Date, select: false, default: null },
    lastLoginAt: { type: Date, default: null },
    suspensionReason: { type: String, default: '' },
    suspendedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

userSchema.index({ role: 1, status: 1 });

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject({ virtuals: false });
  delete obj.passwordHash;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpires;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.__v;
  return obj;
};

export const User = mongoose.model('User', userSchema);
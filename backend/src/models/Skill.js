import mongoose from 'mongoose';

const { Schema } = mongoose;

const skillSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: {
      type: String,
      enum: [
        'listing',
        'store_management',
        'customer_support',
        'inventory',
        'order_returns',
        'ppc',
        'creative'
      ],
      required: true,
      index: true
    },
    description: { type: String, default: '', maxlength: 2000 },
    platform: {
      type: String,
      enum: ['amazon', 'shopify', 'both', 'other'],
      default: 'both'
    },
    active: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

export const Skill = mongoose.model('Skill', skillSchema);
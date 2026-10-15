import mongoose from 'mongoose';

const { Schema } = mongoose;

const clientProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    companyName: { type: String, trim: true, default: '' },
    website: { type: String, trim: true, default: '' },
    platform: {
      type: String,
      enum: ['amazon', 'shopify', 'both', 'other', ''],
      default: ''
    },
    country: { type: String, trim: true, default: '' },
    timezone: { type: String, trim: true, default: '' },
    contactEmail: { type: String, trim: true, default: '' },
    about: { type: String, default: '', maxlength: 4000 },
    categories: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export const ClientProfile = mongoose.model('ClientProfile', clientProfileSchema);
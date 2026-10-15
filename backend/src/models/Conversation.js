import mongoose from 'mongoose';

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }],
    participantRoles: [{ type: String, enum: ['client', 'va', 'admin'] }],
    clientUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vaUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lastMessage: {
      content: { type: String, default: '' },
      sender: { type: Schema.Types.ObjectId, ref: 'User', default: null },
      createdAt: { type: Date, default: null }
    },
    unreadByUser: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        count: { type: Number, default: 0 }
      }
    ]
  },
  { timestamps: true }
);

conversationSchema.index({ clientUser: 1, vaUser: 1 }, { unique: true });

export const Conversation = mongoose.model('Conversation', conversationSchema);
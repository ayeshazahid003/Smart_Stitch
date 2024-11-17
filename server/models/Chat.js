import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    }
  ],
  unreadMessages: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      count: { type: Number, default: 0 },
    }
  ],
  readStatus: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      lastReadMessageId: { type: mongoose.Schema.Types.ObjectId },
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Chat', ChatSchema);

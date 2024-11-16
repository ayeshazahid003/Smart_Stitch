import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Sender of the message
      message: { type: String, required: true }, // Message content
      timestamp: { type: Date, default: Date.now } // Timestamp of the message
    }
  ],
  readStatus: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User whose read status is tracked
      lastReadMessageId: { type: mongoose.Schema.Types.ObjectId } // Reference to the last message read by this user
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Chat', ChatSchema);

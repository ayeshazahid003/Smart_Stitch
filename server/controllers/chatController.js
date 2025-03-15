import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming `req.user._id` is populated after authentication

    // Fetch all chats where the user is a participant
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email") // Populate participants' details (e.g., name, email)
      .populate("messages.senderId", "name email") // Populate sender details in messages
      .sort({ updatedAt: -1 }); // Sort by the most recently updated chats

    res.status(200).json({
      success: true,
      message: "Chats retrieved successfully.",
      chats,
    });
  } catch (error) {
    console.error("Error retrieving chats:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving chats.",
      error: error.message,
    });
  }
};

export const getChatParticipants = async (req, res) => {
  try {
    const userId = req.user._id; // Get the authenticated user ID

    // Find all chats where the user is a participant
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email") // Populate participant details
      .lean(); // Convert Mongoose documents to plain objects

    // Extract unique chat participants excluding the requesting user
    const uniqueParticipants = new Map();

    chats.forEach((chat) => {
      chat.participants.forEach((participant) => {
        if (participant._id.toString() !== userId.toString()) {
          uniqueParticipants.set(participant._id.toString(), {
            _id: participant._id,
            name: participant.name,
            email: participant.email,
          });
        }
      });
    });

    // Convert map values to an array
    const chatParticipants = Array.from(uniqueParticipants.values());

    return res.status(200).json({
      success: true,
      message: "Chat participants retrieved successfully.",
      chatParticipants,
    });
  } catch (error) {
    console.error("Error retrieving chat participants:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving chat participants.",
      error: error.message,
    });
  }
};

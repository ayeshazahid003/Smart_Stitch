import Chat from "../models/Chat.js";

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

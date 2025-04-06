// src/pages/chat/ChatWindow.jsx
import React from "react";
import { MoreVertical } from "lucide-react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({ contact, messages, onSendMessage, currentUserId }) {
  if (!contact) {
    return (
      <div className="w-full flex flex-col bg-gray-50 h-full shadow-md items-center justify-center">
        <p className="text-gray-500">Please select a user to view chats.</p>
      </div>
    );
  }

  // Find the other participant
  const otherParticipant = contact.participants?.find(
    (p) => p._id !== currentUserId
  );

  console.log("Other participant:", otherParticipant);
  const name =
    otherParticipant?.name ||
    contact.name ||
    "Unknown User";
  const avatar =
    otherParticipant?.profilePicture ||
    contact.avatar ||
    "https://via.placeholder.com/40";

  return (
    <div className="w-full flex flex-col bg-gray-50 h-full shadow-md">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full border border-gray-200 shadow-sm"
          />
          <div>
            <p className="font-semibold text-gray-800 text-lg">{name}</p>
            {/* If you had lastSeen, you could show it here */}
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
        <MessageList messages={messages} currentUserId={currentUserId} />
      </div>

      {/* Input Section */}
      <div className="p-4 bg-white border-t shadow-md">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}

export default ChatWindow;

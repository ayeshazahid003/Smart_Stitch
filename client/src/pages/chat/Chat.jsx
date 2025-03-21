// src/components/Chat.js

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

// Import your API functions
import { getUserChats, getChatParticipants } from '../../hooks/chatHooks';

export default function Chat() {
  // State for storing all user chats
  const [chats, setChats] = useState([]);
  // State for storing participants (optional, based on your use case)
  const [participants, setParticipants] = useState([]);

  // State for the currently selected chat
  const [selectedChat, setSelectedChat] = useState(null);
  // State for messages in the currently selected chat
  const [messages, setMessages] = useState([]);

  // Fetch user chats and participants on mount
  useEffect(() => {
    fetchChats();
    fetchChatParticipants();
  }, []);

  // Fetch all chats for the logged-in user
  const fetchChats = async () => {
    try {
      const response = await getUserChats();
      if (response.success) {
        setChats(response.chats);
      } else {
        console.error('Failed to fetch chats:', response.message);
      }
    } catch (error) {
      console.error('An error occurred while fetching chats:', error);
    }
  };

  // Fetch unique participants across all chats (if needed)
  const fetchChatParticipants = async () => {
    try {
      const response = await getChatParticipants();
      if (response.success) {
        setParticipants(response.chatParticipants);
      } else {
        console.error('Failed to fetch participants:', response.message);
      }
    } catch (error) {
      console.error('An error occurred while fetching participants:', error);
    }
  };

  // When a user selects a chat in the sidebar
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    // Load that chat's messages
    setMessages(chat.messages || []);
  };

  // Handle sending a new message (currently local-only)
  const handleSendMessage = (messageText) => {
    // Here, you might call an API to send the message, then update state with the new message
    const newMessage = {
      senderId: 'you', 
      text: messageText,
      createdAt: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        contacts={chats}
        onSelectContact={handleSelectChat}
      />
      {selectedChat && (
        <ChatWindow
          contact={selectedChat}     // For display, can rename or adapt
          messages={messages}        // The messages in the selected chat
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}

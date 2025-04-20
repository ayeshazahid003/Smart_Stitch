// src/pages/chat/Chat.js

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { getUserChats, getChatParticipants } from '../../hooks/chatHooks';
import { useSocket } from '../../context/SocketContext';

// Minimal normalization: keep participants as objects
function normalizeChat(chat) {
  chat.id = chat._id || chat.id;
  // If the server has already populated "participants", do NOT overwrite them.
  // Just ensure there's an 'id' for the chat itself.
  // Also, fix timestamps if needed:
  if (Array.isArray(chat.messages)) {
    chat.messages = chat.messages.map((m) => {
      if (!m.timestamp && m.createdAt) {
        m.timestamp = m.createdAt;
      }
      return m;
    });
  }
  return chat;
}

export default function Chat() {
  const location = useLocation();
  const incomingChat = location.state; // Possibly from TailorProfile
  const { getSocket } = useSocket();
  const socket = getSocket(); // Get the socket instance from context
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')); // Logged-in user data

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user || !user._id) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  console.log('Socket:', socket);

  const [chats, setChats] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  // 1) Fetch chats & participants on mount
  useEffect(() => {
    if (!user || !user._id) return; // guard
    fetchChats();
    fetchChatParticipants();
    console.log('Incoming chat:', incomingChat);
  }, [user, incomingChat]);

  // 2) Join the chat room and listen for messages when selected
  useEffect(() => {
    if (!socket || !selectedChat) return;

    socket.emit('joinChat', selectedChat.id);

    socket.on('messageReceived', (data) => {
      if (data.chatId === selectedChat.id) {
        // Only from other participants (we used socket.broadcast on server)
        setMessages((prev) => [...prev, data.message]);
      }
    });

    return () => {
      socket.off('messageReceived');
    };
  }, [socket, selectedChat]);

  // 3) Listen for notifications
  useEffect(() => {
    if (!socket) return;

    socket.on('newMessageNotification', (data) => {
      console.log('New message notification:', data);
      // Optionally refresh chat list or show a toast
    });

    return () => {
      socket.off('newMessageNotification');
    };
  }, [socket]);

  // 4) Fetch chats from the API and store them
  const fetchChats = async () => {
    try {
      const response = await getUserChats();
      if (response.success) {
        let updatedChats = response.chats.map(normalizeChat);

        // If user came from tailor profile with an incomingChat
        if (incomingChat) {
          const normalizedIncoming = normalizeChat(incomingChat);

          // If no participants, create them
          if (!normalizedIncoming.participants) {
            normalizedIncoming.participants = [
              { _id: user._id },
              { _id: normalizedIncoming.id },
            ];
          }

          // Check if a chat exists for these participants
          const existingChat = updatedChats.find((c) => {
            const participantIds = c.participants.map((p) => p._id.toString());
            return (
              participantIds.includes(user._id) &&
              participantIds.includes(normalizedIncoming.id)
            );
          });

          if (!existingChat) {
            // Prepend and select
            updatedChats = [normalizedIncoming, ...updatedChats];
            setSelectedChat(normalizedIncoming);
            setMessages([]);
          } else {
            // Chat exists, select it
            setSelectedChat(existingChat);
            setMessages(existingChat.messages || []);
          }
        }

        setChats(updatedChats);
      } else {
        console.error('Failed to fetch chats:', response.message);
      }
    } catch (error) {
      console.error('An error occurred while fetching chats:', error);
    }
  };

  // 5) Fetch participants (optional, if you need a list)
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

  // 6) When a user selects a chat in the sidebar
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages || []);
  };

  // 7) Send a new message
  const handleSendMessage = (messageText) => {
    const newMessage = {
      senderId: user._id,
      message: messageText,
      timestamp: new Date().toISOString(),
    };

    if (socket && selectedChat) {
      console.log('Sending message:', newMessage);
      socket.emit('sendMessage', {
        chatId: selectedChat.id,
        senderId: user._id,
        message: messageText,
        participants: selectedChat.participants.map((p) => p._id),
      });
    }

    // Optimistic update
    setMessages((prev) => [...prev, newMessage]);
  };

  // If redirecting, do not render chat UI
  if (!user || !user._id) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        contacts={chats}
        onSelectContact={handleSelectChat}
        currentUserId={user._id}
      />
      {selectedChat && (
        <ChatWindow
          contact={selectedChat}
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUserId={user._id}
        />
      )}
    </div>
  );
}

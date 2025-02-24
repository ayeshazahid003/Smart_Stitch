import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

const initialContacts = [
  {
    id: 1,
    name: 'Customer A',
    avatar: 'https://via.placeholder.com/40',
    lastMessage: 'Ok, see you later',
    lastSeen: '10 mins ago',
  },
  {
    id: 2,
    name: 'Customer B',
    avatar: 'https://via.placeholder.com/40',
    lastMessage: "You: I don't remember anything 😌",
    lastSeen: '5 mins ago',
  },
];

const initialMessages = [
  { sender: 'customer', text: 'Hello, how are you?' },
  { sender: 'you', text: "Yeah, I'm fine" },
  { sender: 'you', text: "I don't remember anything 😌" },
];

export default function Chat() {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedContact, setSelectedContact] = useState(contacts[1]);
  const [messages, setMessages] = useState(initialMessages);

  const handleSendMessage = (messageText) => {
    setMessages([...messages, { sender: 'you', text: messageText }]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar contacts={contacts} onSelectContact={setSelectedContact} />
      <ChatWindow
        contact={selectedContact}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

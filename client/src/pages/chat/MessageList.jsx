// src/pages/chat/MessageList.jsx
import React, { useEffect, useRef } from 'react';

function MessageList({ messages, currentUserId }) {
  // Ref to the dummy div at the bottom of the messages list
  const messageEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      {/* Example date separator */}
      <div className="flex justify-center">
        <span className="bg-blue-200 text-xs px-3 py-1 rounded-full">
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-4 scrollbar-none">
        {messages.map((msg, index) => {
          // Determine the sender id whether it's a string or an object
          const senderId =
            typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
          const isOwnMessage = senderId === currentUserId;

          return (
            <div
              key={index}
              className={`${
                isOwnMessage ? 'self-end bg-purple-300' : 'self-start bg-purple-200'
              } p-2 rounded-lg max-w-xs`}
            >
              {msg.message}
            </div>
          );
        })}

        {/* Dummy div to scroll into view */}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
}

export default MessageList;

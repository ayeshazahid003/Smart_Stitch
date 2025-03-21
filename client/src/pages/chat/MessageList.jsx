import React, { useEffect, useRef } from 'react';

function MessageList({ messages }) {
  // Ref to the dummy div at the bottom of the messages list
  const messageEndRef = useRef(null);

  // Scrolls to bottom whenever messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      <div className="flex justify-center">
        <span className="bg-blue-200 text-xs px-3 py-1 rounded-full">Today</span>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.sender === 'you'
                ? 'self-end bg-purple-300'
                : 'self-start bg-purple-200'
            } p-2 rounded-lg max-w-xs`}
          >
            {msg.text}
          </div>
        ))}

        {/* Dummy div to scroll to */}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
}

export default MessageList;

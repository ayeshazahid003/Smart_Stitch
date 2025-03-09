import React from 'react';

function MessageList({ messages }) {
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
      </div>
    </div>
  );
}

export default MessageList;

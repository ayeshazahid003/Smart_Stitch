import React, { useState } from 'react';
import { Search, Menu } from 'lucide-react';

function Sidebar({ contacts, onSelectContact, currentUserId }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`bg-white border-r p-4 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-1/4'
      }`}
    >
      {/* Header (toggle + search) */}
      <div className="flex items-center gap-2 p-2 bg-gray-200 rounded-lg">
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          <Menu className="w-5 h-5 text-gray-500" />
        </button>
        {!isCollapsed && (
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none flex-1"
            />
          </div>
        )}
      </div>

      {/* Chats List */}
      <div className="mt-4">
        {contacts.length === 0 ? (
          !isCollapsed && (
            <div className="text-center text-gray-500 mt-8">
              No chats available. You can visit any tailor profile and start messaging.
            </div>
          )
        ) : (
          contacts.map((chat, index) => {
            // Find the participant who is NOT the current user
            const otherParticipant = chat.participants?.find(
              (p) => p._id !== currentUserId
            );

            // UPDATED LINES:
            const name =
              otherParticipant?.name ||
              chat.name ||
              'Unknown User';
            const avatar =
              otherParticipant?.profilePicture ||
              chat.avatar ||
              'https://via.placeholder.com/40';

            const lastMessage = chat.messages?.length
              ? chat.messages[chat.messages.length - 1].message
              : 'No messages yet';

            return (
              <div
                key={chat.id || index}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => onSelectContact(chat)}
              >
                <img
                  src={avatar}
                  alt={name}
                  className="w-10 h-10 rounded-full"
                />
                {!isCollapsed && (
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-gray-500">{lastMessage}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Sidebar;

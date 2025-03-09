import React, { useState } from 'react';
import { Search, Menu } from 'lucide-react';

function Sidebar({ contacts, onSelectContact }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-white border-r p-4 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-1/4'}`}>
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
      <div className="mt-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            onClick={() => onSelectContact(contact)}
          >
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-10 h-10 rounded-full"
            />
            {!isCollapsed && (
              <div>
                <p className="font-semibold">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.lastMessage}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;

import React from 'react';
import { Scissors, ShoppingBag, Users, Calendar, Settings } from 'lucide-react';

export function Sidebar() {
  const menuItems = [
    { icon: ShoppingBag, label: 'Orders', href: '#' },
    { icon: Users, label: 'Customers', href: '#' },
    { icon: Calendar, label: 'Appointments', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ];

  return (
    <aside className="bg-primary text-primary-foreground w-64 min-h-screen p-4">
      <div className="flex items-center space-x-2 mb-6">
        <Scissors className="h-6 w-6" />
        <span className="text-xl font-bold">Tailor's Delight</span>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary-foreground hover:text-primary transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}


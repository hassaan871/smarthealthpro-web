import React, { useState } from 'react';
import { Calendar, Users, User, LogOut } from 'lucide-react';

const Nav = () => {
  const [activeItem, setActiveItem] = useState('Appointments');

  const navItems = [
    { name: 'Appointments', icon: Calendar },
    { name: 'Patients', icon: Users },
    { name: 'Profile', icon: User },
    { name: 'Logout', icon: LogOut },
  ];

  return (
    <nav className="bg-[#34495E] text-[#ECF0F1] p-4 w-full shadow-lg">
      <ul className="flex justify-between items-center max-w-4xl mx-auto">
        {navItems.map((item) => (
          <li key={item.name} className="flex-1 mx-1">
            <button
              onClick={() => setActiveItem(item.name)}
              className={`nav-item flex flex-col items-center justify-center w-full p-3 rounded-lg transition-all ${
                activeItem === item.name
                  ? 'bg-[#3498DB] shadow-md transform scale-105'
                  : 'hover:bg-[#3498DB]/30'
              }`}
            >
              <item.icon className="nav-icon mb-2" size={28} />
              <span className="nav-text text-sm font-medium">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
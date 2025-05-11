
import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNavigation = () => {
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/writing', label: 'Writing' },
    { path: '/work-in-progress', label: 'WIP' },
    { path: '/desserts', label: 'Desserts' },
  ];

  return (
    <div className="fixed bottom-2 left-2 right-2 md:hidden">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center justify-center py-3 px-4 m-1 rounded-full text-base font-medium transition-colors ${
                isActive 
                  ? 'bg-[#333] text-white' 
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;

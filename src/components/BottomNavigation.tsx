
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  CakeIcon,
  ClockIcon,
  PencilIcon,
} from '@heroicons/react/24/solid';

const BottomNavigation = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/writing', label: 'Writing', icon: PencilIcon },
    { path: '/work-in-progress', label: 'WIP', icon: ClockIcon },
    { path: '/desserts', label: 'Desserts', icon: CakeIcon },
  ];

  return (
    <div className="fixed bottom-2 left-2 right-2 md:hidden">
      <div className="bg-portfolio-sidebar rounded-lg shadow-lg border border-[#333]">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex flex-col items-center py-3 px-1 ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;

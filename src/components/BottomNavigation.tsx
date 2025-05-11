
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNavigation = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/writing', label: 'Writing' },
    { path: '/work-in-progress', label: 'WIP' },
    { path: '/desserts', label: 'Desserts' },
  ];

  return (
    <div className="fixed bottom-4 left-2 right-2 md:hidden">
      <div className="bg-portfolio-sidebar rounded-full shadow-lg border border-[#333] relative">
        <div className="flex justify-around relative py-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center justify-center py-3 px-4 rounded-full text-base font-medium transition-colors z-10 relative text-gray-400 hover:text-white"
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#333] rounded-full"
                    initial={false}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 30,
                      mass: 1
                    }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;

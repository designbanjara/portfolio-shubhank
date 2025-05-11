
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  const [activeTabRect, setActiveTabRect] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/writing', label: 'Writing' },
    { path: '/work-in-progress', label: 'WIP' },
    { path: '/desserts', label: 'Desserts' },
  ];

  useEffect(() => {
    // Find the currently active tab and get its position
    const activeIndex = navItems.findIndex(item => item.path === location.pathname);
    if (activeIndex >= 0 && tabRefs.current[activeIndex]) {
      const activeTab = tabRefs.current[activeIndex];
      if (activeTab) {
        const rect = activeTab.getBoundingClientRect();
        const parentRect = activeTab.parentElement?.getBoundingClientRect();
        if (parentRect) {
          setActiveTabRect({
            left: rect.left - parentRect.left,
            width: rect.width,
          });
        }
      }
    }
  }, [location.pathname]);

  return (
    <div className="fixed bottom-2 left-2 right-2 md:hidden">
      <div className="bg-portfolio-sidebar rounded-full shadow-lg border border-[#333] relative">
        {/* Animated background for selected tab */}
        <div 
          className="absolute h-[calc(100%-8px)] top-1 rounded-full bg-[#333] transition-all duration-300 ease-in-out"
          style={{ 
            left: `${activeTabRect.left + 4}px`, 
            width: `${activeTabRect.width - 8}px` 
          }}
        />
        
        <div className="flex justify-around relative z-10">
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              ref={el => tabRefs.current[index] = el}
              className={({ isActive }) => 
                `flex items-center justify-center py-3 px-4 m-1 rounded-full text-base font-medium transition-colors ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;

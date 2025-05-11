
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  const [activeTabRect, setActiveTabRect] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const [previousTabRect, setPreviousTabRect] = useState<{ left: number; width: number } | null>(null);
  const [animating, setAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'right' | 'left' | null>(null);
  const [previousPathname, setPreviousPathname] = useState(location.pathname);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const initialRender = useRef(true);
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/writing', label: 'Writing' },
    { path: '/work-in-progress', label: 'WIP' },
    { path: '/desserts', label: 'Desserts' },
  ];

  // Function to calculate tab position
  const getTabPosition = (index: number) => {
    if (index >= 0 && tabRefs.current[index]) {
      const tab = tabRefs.current[index];
      if (tab) {
        const rect = tab.getBoundingClientRect();
        const parentRect = tab.parentElement?.getBoundingClientRect();
        if (parentRect) {
          return {
            left: rect.left - parentRect.left,
            width: rect.width
          };
        }
      }
    }
    return null;
  };

  // Effect for initialization and tab measurement
  useEffect(() => {
    // Initialize positions when tabs are mounted
    if (initialRender.current) {
      const activeIndex = navItems.findIndex(item => item.path === location.pathname);
      const position = getTabPosition(activeIndex);
      
      if (position) {
        setActiveTabRect(position);
        setPreviousTabRect(position); // Initially, previous is the same as current
      }
      
      initialRender.current = false;
      return;
    }
    
    const previousIndex = navItems.findIndex(item => item.path === previousPathname);
    const activeIndex = navItems.findIndex(item => item.path === location.pathname);
    
    // Only animate if we're changing tabs
    if (previousIndex !== activeIndex) {
      // Store the previous position
      const prevPosition = getTabPosition(previousIndex);
      if (prevPosition) {
        setPreviousTabRect(prevPosition);
      }
      
      // Get the new position
      const newPosition = getTabPosition(activeIndex);
      if (newPosition && prevPosition) {
        // Determine animation direction
        const direction = previousIndex < activeIndex ? 'right' : 'left';
        setAnimationDirection(direction);
        
        // Start animation sequence
        setAnimating(true);
        
        // Set the new position and reset animation state after animation completes
        setTimeout(() => {
          setActiveTabRect(newPosition);
          
          // Animation complete
          setTimeout(() => {
            setAnimating(false);
            setAnimationDirection(null);
          }, 500); // Match duration with CSS animation
        }, 50);
      }
    }
    
    // Update previous pathname for next animation
    setPreviousPathname(location.pathname);
  }, [location.pathname]);

  return (
    <div className="fixed bottom-2 left-2 right-2 md:hidden">
      <div className="bg-portfolio-sidebar rounded-full shadow-lg border border-[#333] relative">
        {/* Animated background for selected tab */}
        {previousTabRect && (
          <div 
            className={`absolute h-[calc(100%-8px)] top-1 rounded-full bg-[#333] transition-all duration-300 ease-out ${
              animating && animationDirection === 'right' ? 'animate-[expand-right_0.5s_ease-out_forwards]' : 
              animating && animationDirection === 'left' ? 'animate-[expand-left_0.5s_ease-out_forwards]' : ''
            }`}
            style={{ 
              left: `${activeTabRect.left + 4}px`,
              width: `${activeTabRect.width - 8}px`,
            }}
          />
        )}
        
        <div className="flex justify-around relative z-10">
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              ref={el => tabRefs.current[index] = el}
              className={({ isActive }) => 
                `flex items-center justify-center py-3 px-4 rounded-full text-base font-medium transition-colors ${
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

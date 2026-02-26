
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useProjectsPasscode } from '@/contexts/ProjectsPasscodeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isProjectsUnlocked, requestProjectsUnlock } = useProjectsPasscode();
  const shouldReduceMotion = useReducedMotion();
  const { theme, toggle } = useTheme();

  const navItems = [
    { path: '/',        label: 'Home'     },
    { path: '/projects', label: 'Projects' },
    { path: '/writing',  label: 'Writing'  },
  ];

  return (
    <div className="fixed left-2 right-2 md:hidden" style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}>
      <div className="bg-portfolio-sidebar rounded-full shadow-lg border border-border relative overflow-hidden transition-colors duration-200">
        <div className="flex justify-around relative py-1">
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center justify-center py-3 w-full rounded-full text-base font-medium transition-colors z-10 relative text-muted-foreground hover:text-foreground mx-[4px]"
                onClick={(e) => {
                  if (item.path === '/projects' && !isProjectsUnlocked) {
                    e.preventDefault();
                    requestProjectsUnlock(() => navigate(item.path));
                  }
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600/20 rounded-full w-full h-full z-[-1]"
                    style={{ boxShadow: '0 0 0 1px rgba(37,99,235,0.25)' }}
                    initial={false}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 500, damping: 30, mass: 1 }
                    }
                  />
                )}
                <span className={`relative z-10 ${isActive ? 'text-blue-500 dark:text-blue-400' : ''}`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}

          {/* Theme toggle as the last pill item */}
          <button
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center py-3 w-12 flex-shrink-0 rounded-full text-muted-foreground hover:text-foreground transition-colors z-10 relative mx-[4px]"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;

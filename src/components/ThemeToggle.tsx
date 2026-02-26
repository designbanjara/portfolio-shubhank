import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="
        flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium
        text-[#888] dark:text-[#666]
        hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5
        transition-colors duration-150
      "
      style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
    >
      {theme === 'dark' ? (
        <SunIcon className="h-4 w-4 flex-shrink-0" />
      ) : (
        <MoonIcon className="h-4 w-4 flex-shrink-0" />
      )}
      <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
};

export default ThemeToggle;

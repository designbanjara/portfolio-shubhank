import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  /** Icon-only button, for the floating corner placement on the single-page layout. */
  compact?: boolean;
}

const ThemeToggle = ({ compact = false }: ThemeToggleProps) => {
  const { theme, toggle } = useTheme();

  const Icon = theme === 'dark' ? SunIcon : MoonIcon;
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-label={label}
        className="
          flex items-center justify-center h-9 w-9 rounded-full
          bg-portfolio-sidebar border border-border shadow-sm
          text-muted-foreground hover:text-foreground
          transition-colors duration-150
         ease-smooth"
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={label}
      className="
        flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium
        text-[#888] dark:text-[#666]
        hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5
        transition-colors duration-150
       ease-smooth"
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
};

export default ThemeToggle;

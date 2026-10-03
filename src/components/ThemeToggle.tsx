import React from 'react';
import MaterialIcon from './MaterialIcon';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  /** Icon-only button, for the floating corner placement on the single-page layout. */
  compact?: boolean;
}

const ThemeToggle = ({ compact = false }: ThemeToggleProps) => {
  const { theme, toggle } = useTheme();

  const iconName = theme === 'dark' ? 'wb_sunny' : 'dark_mode';
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-label={label}
        className="
          flex items-center justify-center h-10 w-10 rounded-full
          bg-muted text-muted-foreground hover:text-foreground
          transition-colors duration-150 ease-out-quad
        "
      >
        <MaterialIcon name={iconName} className="text-[24px]" />
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
       ease-out-quad"
    >
      <MaterialIcon name={iconName} className="text-[20px] flex-shrink-0" />
      <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
};

export default ThemeToggle;

import React from 'react';
import ThemeToggle from './ThemeToggle';

/**
 * With the sidebar and bottom nav gone, the theme control lives in the
 * top-right corner on every route.
 */
const FloatingThemeToggle = () => (
  <div
    className="fixed right-4 z-50"
    style={{ top: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
  >
    <ThemeToggle compact />
  </div>
);

export default FloatingThemeToggle;

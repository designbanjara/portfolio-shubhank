import React from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

/** /writing/<slug> and /projects/<slug>, but not the sections themselves. */
const ARTICLE_ROUTE = /^\/(writing|projects)\/[^/]+$/;

/**
 * With the sidebar and bottom nav gone, the theme control lives in the
 * top-right corner.
 *
 * Not on article pages: those already carry a Back control in that corner of
 * the screen, and a floating button there sits on top of the writing rather
 * than beside it.
 */
const FloatingThemeToggle = () => {
  const { pathname } = useLocation();

  if (ARTICLE_ROUTE.test(pathname)) return null;

  return (
    <div
      className="fixed right-4 z-50"
      style={{ top: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
    >
      <ThemeToggle compact />
    </div>
  );
};

export default FloatingThemeToggle;

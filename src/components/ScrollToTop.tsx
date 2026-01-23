import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router does not reset scroll on navigation by default.
 * This component restores the expected "new page starts at top" behavior.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    // If a hash is present, prefer scrolling to the target element.
    if (hash) {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: "start" });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search, hash]);

  return null;
}


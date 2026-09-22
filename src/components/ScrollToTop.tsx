import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router does not reset scroll on navigation by default.
 * This component restores the expected "new page starts at top" behavior.
 *
 * For hash links (the single page's #hello / #projects / #writing sections) it
 * re-aligns for a short while, because images below the fold finish loading
 * after the first scroll and shift the target out from under us.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = hash.slice(1);
    let frame = 0;
    let cancelled = false;

    const align = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: "start" });
      // Keep correcting for ~1s while late-loading media reflows the page.
      if (frame < 60) {
        frame += 1;
        requestAnimationFrame(align);
      }
    };

    align();

    // Any deliberate scroll by the user stops us fighting them for the position.
    const stop = () => {
      cancelled = true;
    };
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchstart", stop, { passive: true, once: true });
    window.addEventListener("keydown", stop, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [pathname, search, hash]);

  return null;
}

/**
 * Analytics wrapper (Umami Cloud).
 *
 * Umami is cookieless and stores no persistent visitor ID, so the site needs
 * no consent banner. The tracker script lives in index.html; everything here
 * is the thin layer around it.
 *
 * Every call site goes through track() rather than touching window.umami, so
 * swapping tools later is a one-file change.
 *
 * Opt-out: Umami's own `umami.disabled` flag suppresses automatic pageviews
 * but NOT explicit umami.track() calls, so track() checks the flag itself.
 * See https://github.com/umami-software/umami/issues/3031
 */

const OPT_OUT_KEY = 'umami.disabled';

declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: Record<string, unknown>) => void;
    };
  }
}

/** True when this browser has opted out via ?notrack=1. */
export function isOptedOut(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    // localStorage throws in some privacy modes — treat as opted in.
    return false;
  }
}

/**
 * Record a custom event. Silently does nothing when the tracker is absent
 * (ad blocker, or local dev where data-domains suppresses it) or opted out.
 */
export function track(name: string, data?: Record<string, unknown>): void {
  if (isOptedOut()) return;
  try {
    window.umami?.track(name, data);
  } catch {
    // Analytics must never break the page.
  }
}

/**
 * Minimal self-contained confirmation banner.
 *
 * Deliberately not the app's Sonner toaster: that dependency renders nothing
 * in this app, and this needs to be reliable on a phone, which is where the
 * opt-out link is actually used.
 */
function showBanner(message: string): void {
  const el = document.createElement('div');
  el.textContent = message;
  el.setAttribute('role', 'status');
  el.style.cssText = [
    'position:fixed',
    'left:50%',
    'bottom:24px',
    'transform:translateX(-50%)',
    'z-index:9999',
    'max-width:calc(100vw - 32px)',
    'padding:10px 16px',
    'border-radius:8px',
    'font:500 14px/1.4 system-ui,sans-serif',
    'text-align:center',
    'background:#1c1c1c',
    'color:#fff',
    'box-shadow:0 4px 16px rgba(0,0,0,.3)',
  ].join(';');

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

/**
 * Handle ?notrack=1 (exclude this device) and ?notrack=0 (re-enable).
 * Usable on phones, where there is no console to set the flag by hand.
 * Returns a message to surface to the user, or null.
 */
function handleOptOutParam(): string | null {
  const value = new URLSearchParams(window.location.search).get('notrack');
  if (value === null) return null;

  try {
    if (value === '0') {
      localStorage.removeItem(OPT_OUT_KEY);
      return 'Analytics re-enabled on this device.';
    }
    localStorage.setItem(OPT_OUT_KEY, '1');
    return 'This device is now excluded from analytics.';
  } catch {
    return 'Could not change the setting — storage is unavailable.';
  }
}

/** Track clicks on links leaving the site, via one delegated listener. */
function trackOutboundClicks(): void {
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element | null)?.closest?.('a');
      if (!link) return;

      const href = link.getAttribute('href') || '';
      if (!href) return;

      // mailto:/tel: count as outbound; in-page and internal links do not.
      const isMailOrTel = /^(mailto|tel):/i.test(href);
      const isExternal =
        /^https?:\/\//i.test(href) && link.hostname !== window.location.hostname;

      if (!isMailOrTel && !isExternal) return;

      track('outbound_click', {
        href,
        label: link.textContent?.trim().slice(0, 50) || '',
      });
    },
    { capture: true },
  );
}

/** Wire up analytics. Call once on app start. */
export function initAnalytics(): void {
  const message = handleOptOutParam();
  if (message) showBanner(message);
  trackOutboundClicks();
}

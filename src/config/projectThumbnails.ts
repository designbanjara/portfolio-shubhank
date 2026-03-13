/**
 * Per-project thumbnail overrides.
 *
 * Map project slug → local asset path (string) or { dark, light } variants.
 * Slug is derived from the project title via getPostSlug(project.title),
 * which lowercases and hyphenates the title.
 * e.g. "Revamping the Ticket Creation Experience" → "revamping-the-ticket-creation-experience"
 *
 * Overrides take priority over images embedded in Craft content.
 *
 * Workflow for a new project:
 * 1. Drop the asset(s) in /public/projects/
 *    - Dark only:  my-project.png
 *    - Both modes: my-project.png + my-project-light.png
 * 2. Add an entry below:
 *    - Single asset:  'my-project-slug': '/projects/my-project.png'
 *    - Theme-aware:   'my-project-slug': { dark: '/projects/my-project.png', light: '/projects/my-project-light.png' }
 */
export type ThumbnailOverride = string | { dark: string; light: string };

export const projectThumbnailOverrides: Record<string, ThumbnailOverride> = {
  'simple-and-faster-way-to-place-orders-to-exchange': {
    dark:  '/projects/tata-motors-order.png',
    light: '/projects/tata-motors-order-light.png',
  },
  'automating-investments-through-sips': {
    dark:  '/projects/Stock-sip.png',
    light: '/projects/Stock-sip-light.png',
  },
  'revamping-the-ticket-creation-experience': {
    dark:  '/projects/rzp-care.png',
    light: '/projects/rzp-care-light.png',
  },
  'failed-experiment-accept-payments-from-phone-through-cards': {
    dark:  '/projects/rzp-tog.png',
    light: '/projects/rzp-tog-light.png',
  },
};

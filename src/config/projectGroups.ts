import { ThumbnailOverride } from './projectThumbnails';

/**
 * Company groupings and card copy for the Projects ("Work") section.
 *
 * Craft has no company field and its blurbs are not the sentences the design
 * uses, so both live here — same pattern as projectThumbnails.ts. Captions
 * below are copied verbatim from the Figma frame
 * "Desktop / Projects / light" (node 15:6761).
 *
 * Any published project not claimed by a group still renders, in a trailing
 * "Other work" group using its Craft title and blurb, so nothing silently
 * disappears from the site.
 */
export interface GroupCard {
  /** Project slug, from getPostSlug(project.title). The card links here. */
  slug: string;
  /** Bold lead-in, where the design sets one. */
  lead?: string;
  /** Caption, verbatim from Figma. Falls back to the Craft blurb if omitted. */
  caption?: string;
  /** Per-card art. Falls back to projectThumbnails, then the Craft image. */
  image?: ThumbnailOverride;
}

export interface ProjectGroup {
  id: string;
  /** Group heading — the company or team. */
  company: string;
  /** One-line context under the heading. */
  description: string;
  cards: GroupCard[];
}

export const projectGroups: ProjectGroup[] = [
  {
    id: 'phonepe',
    company: 'PhonePe Invest',
    description:
      'I managed Tools and few post-transaction pod efforts that drive more than 70% of the revenue',
    cards: [
      {
        slug: 'simple-and-faster-way-to-place-orders-to-exchange',
        lead: 'Order form revamp',
        caption:
          'gave 10% order placement uplift along with adding pro-trader order types',
      },
      {
        slug: 'automating-investments-through-sips',
      },
    ],
  },
  {
    id: 'razorpay',
    company: 'Razorpay',
    description:
      'I was the POC for Razorpay mobile app and Care pod. One of the first projects to be built completely on the new Blade Design System',
    cards: [
      {
        slug: 'revamping-the-ticket-creation-experience',
        caption:
          'Care revamp reduced 30% tickets on self-serve features and simplified the ticket creation experience',
      },
      {
        slug: 'failed-experiment-accept-payments-from-phone-through-cards',
        caption: 'Mobile app re-design to accommodate new ways to accept payments',
      },
    ],
  },
];

/**
 * Two cards in the Figma frame have no Craft project behind them, so they have
 * neither a page to link to nor an image in /public/projects. Add the project
 * to Craft and drop its art in, then move the entry into the group above:
 *
 *   { slug: '<new-slug>', caption: 'About 30% of users who trade are using one of the 4 tools to create, analyse and implement trading strategies' }
 *   { slug: '<new-slug>', caption: 'Worked on Portfolio Optimizer. One of the first brokers who identify whats wrong and fix portfolio in a seamless flow' }
 */

/** Group used for published projects that no group above claims. */
export const fallbackGroup = {
  id: 'other',
  company: 'Other work',
  description: '',
} as const;

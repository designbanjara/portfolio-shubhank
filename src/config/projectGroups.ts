/**
 * Company groupings and card copy for the Work section.
 *
 * The carousel is driven entirely from here rather than from Craft: the card
 * captions are not the project titles, and two of the cards have no Craft
 * project behind them at all. Craft is still the source for the page a card
 * links to.
 *
 * Captions use *asterisks* to mark the bold run, which can sit anywhere in
 * the sentence — see renderCaption in ProjectCarousel.
 *
 * Art lives in /public/projects as a dark/light pair. `size` is the art's
 * intrinsic pixel size; the card reserves its width from that ratio so the
 * row does not reflow as images load.
 */
export interface GroupCard {
  /** Stable key, also used for the React list key. */
  id: string;
  /** Caption, with *bold* runs marked. */
  caption: string;
  image: { dark: string; light: string };
  size: { width: number; height: number };
  /**
   * Project slug to link to, from getPostSlug(project.title). This is the
   * Craft page's own title, which deliberately differs from the caption
   * above. Omit when no project page exists — the card then renders unlinked.
   */
  slug?: string;
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
        id: 'order-form',
        slug: 'simple-and-faster-way-to-place-orders-to-exchange',
        caption:
          '*Order form* revamp gave 10% order placement uplift along with adding pro-trader order types.',
        image: { dark: '/projects/Orderform-dark.png', light: '/projects/Orderform-light.png' },
        size: { width: 1488, height: 1200 },
      },
      {
        id: 'trading-tools',
        slug: 'wip-trading-tools',
        caption:
          'About 30% of users who trade are using one of the 4 *Tools* to create, analyse and implement trading strategies',
        image: { dark: '/projects/Tradingtools-dark.png', light: '/projects/Tradingtools-light.png' },
        size: { width: 1820, height: 1200 },
      },
      {
        id: 'portfolio-optimiser',
        slug: 'wip-portfolio-optimiser',
        caption:
          'Take a look at Portfolio Optimizer. One of the first brokers who identify whats wrong and fix portfolio in a seamless flow',
        image: { dark: '/projects/Optimiser-dark.png', light: '/projects/Optimiser-light.png' },
        size: { width: 1820, height: 1200 },
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
        id: 'care-revamp',
        slug: 'revamping-the-ticket-creation-experience',
        caption:
          'Care revamp reduced 30% tickets on self-serve features and simplified the ticket creation experience',
        image: { dark: '/projects/rzp-care-dark.png', light: '/projects/rzp-care-light.png' },
        size: { width: 1820, height: 1200 },
      },
      {
        id: 'rzp-app',
        slug: 'failed-experiment-accept-payments-from-phone-through-cards',
        caption: 'Mobile app re-design to accommodate new ways to accept payments',
        image: { dark: '/projects/rzp-app-dark.png', light: '/projects/rzp-app-light.png' },
        size: { width: 1488, height: 1200 },
      },
    ],
  },
];

/** Group used for published projects no card above claims. */
export const fallbackGroup = {
  id: 'other',
  company: 'Other work',
  description: '',
} as const;

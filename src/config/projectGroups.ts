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
/** A card inside a project's highlights modal. */
export interface HighlightCard {
  id: string;
  /** Caption, with *bold* runs marked, same as a group card. */
  caption: string;
  image: { dark: string; light: string };
  size: { width: number; height: number };
}

/**
 * The full-screen story behind a project. Copy is taken verbatim from the
 * Figma frame "Order form revamp Highlights" (node 8:2928).
 */
export interface Highlights {
  title: string;
  description: string;
  cards: HighlightCard[];
}

export interface GroupCard {
  /** Stable key, also used for the React list key. */
  id: string;
  /** Caption, with *bold* runs marked. */
  caption: string;
  image: { dark: string; light: string };
  size: { width: number; height: number };
  /**
   * Opening the card shows these highlights in a full-screen modal. A card
   * without them is not interactive.
   */
  highlights?: Highlights;
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
        caption:
          '*Order form* revamp gave 10% order placement uplift along with adding pro-trader order types.',
        image: { dark: '/projects/Orderform-dark.png', light: '/projects/Orderform-light.png' },
        size: { width: 1488, height: 1200 },
        highlights: {
          title: 'Order form revamp Highlights',
          description:
            'PhonePe is a leading fin-tech within P2P payments space which has over 600 million registered users. Share.market is a stock-broking app, a new initiative from PhonePe to solve for the untapped 80% of Indians who are yet to open a Demat account.',
          cards: [
            {
              id: 'usability',
              caption:
                'Solves major issues raised during Usability testing of the previous order form',
              image: {
                dark: '/projects/orderform/usability-dark.png',
                light: '/projects/orderform/usability-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: 'speed',
              caption: 'Improved speed of execution from 9 seconds to 3 seconds',
              image: {
                dark: '/projects/orderform/speed-dark.png',
                light: '/projects/orderform/speed-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: 'framework',
              caption:
                'New order form adds framework that unlocks all types of orders and instructions, from 3 to 8+',
              image: {
                dark: '/projects/orderform/framework-dark.png',
                light: '/projects/orderform/framework-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: 'ai-prototypes',
              caption:
                'AI assisted web prototypes helped close the design with confidence. Use \u201Ci\u201D to explore other approaches',
              image: {
                dark: '/projects/orderform/ai-prototypes-dark.png',
                light: '/projects/orderform/ai-prototypes-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: 'web',
              caption: 'Similar experience designed for web platform',
              image: {
                dark: '/projects/orderform/web-dark.png',
                light: '/projects/orderform/web-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
          ],
        },
      },
      {
        id: 'trading-tools',
        caption:
          'About 30% of users who trade are using one of the 4 *Tools* to create, analyse and implement trading strategies',
        image: { dark: '/projects/Tradingtools-dark.png', light: '/projects/Tradingtools-light.png' },
        size: { width: 1820, height: 1200 },
      },
      {
        id: 'portfolio-optimiser',
        caption:
          'Take a look at *Portfolio Optimizer*. One of the first brokers who identify whats wrong and fix portfolio in a seamless flow',
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
        caption:
          '*Care revamp* reduced 30% tickets on self-serve features and simplified the ticket creation experience',
        image: { dark: '/projects/rzp-care-dark.png', light: '/projects/rzp-care-light.png' },
        size: { width: 1820, height: 1200 },
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

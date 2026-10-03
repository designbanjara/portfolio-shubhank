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

/**
 * Modal intros. Shared because the PhonePe projects all open with the same
 * context; keeping one copy means they cannot drift apart.
 *
 * The Razorpay figure is Razorpay's own public claim from razorpay.com/about
 * ("50,00,000+ businesses powering payments with Razorpay"), checked October
 * 2026. Third-party trackers quote anywhere from 8 to 12 million and disagree
 * with each other, so the first-party number is the defensible one. It will
 * date — worth re-checking before any significant update.
 */
const PHONEPE_INTRO =
  'PhonePe is a leading fin-tech within P2P payments space which has over 600 million registered users. Share.market is a stock-broking app, a new initiative from PhonePe to solve for the untapped 80% of Indians who are yet to open a Demat account.';

const RAZORPAY_INTRO =
  'Razorpay is India\u2019s leading payment aggregator that provides checkout experiences for end-customers and merchant experience for business owners, powering payments for over 50,00,000 businesses across India.';

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
        size: { width: 1820, height: 1200 },
        highlights: {
          title: 'Order form revamp Highlights',
          description: PHONEPE_INTRO,
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
              caption: 'Reduced time spent on the form from 9 seconds to 6 seconds, while seeing a 10% uplift in orders.',
              image: {
                dark: '/projects/orderform/speed-dark.png',
                light: '/projects/orderform/speed-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: 'framework',
              caption:
                'Designed a framework that unlocks all types of orders and instructions, from 3 to 8+.',
              image: {
                dark: '/projects/orderform/framework-dark.png',
                light: '/projects/orderform/framework-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: 'ai-prototypes',
              caption:
                'AI assisted web prototypes helped close the design with confidence. Quick iterations helped closing the Market - limit switcher within couple of days',
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
          '*Tools* are used by 30% of traders to create, analyse and implement trading strategies',
        image: { dark: '/projects/Tradingtools-dark.png', light: '/projects/Tradingtools-light.png' },
        size: { width: 1820, height: 1200 },
        highlights: {
          title: 'Tools Highlights',
          description: PHONEPE_INTRO,
          cards: [
            {
              id: '01',
              caption:
                'Designed and iterated on multiple tools for trading: Few of them are Strategy builder, OI Analysis, Trading panel',
              image: {
                dark: '/projects/trading-tools/01-dark.png',
                light: '/projects/trading-tools/01-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: '02',
              caption:
                'Implemented interactions that solve for information dense Futures and Options domain',
              image: {
                dark: '/projects/trading-tools/02-dark.png',
                light: '/projects/trading-tools/02-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: '03',
              caption:
                'Influenced in enhancing subtler experiences compared to competitors like including intraday payoff, brokerage in P/L Analysis',
              image: {
                dark: '/projects/trading-tools/03-dark.png',
                light: '/projects/trading-tools/03-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: '04',
              caption:
                'Iterated the tools periodically to improve clarity and speed. Reducing steps in bulk orders, Compactness in trading panel etc',
              image: {
                dark: '/projects/trading-tools/04-dark.png',
                light: '/projects/trading-tools/04-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: '05',
              caption:
                'Similar experiences designed for web platform',
              image: {
                dark: '/projects/trading-tools/05-dark.png',
                light: '/projects/trading-tools/05-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
          ],
        },
      },
      {
        id: 'portfolio-optimiser',
        caption:
          '*Optimizer* fixes ones portfolio to be healthy. It is one of the three pillars for marketing PhonePe invest',
        image: { dark: '/projects/Optimiser-dark.png', light: '/projects/Optimiser-light.png' },
        size: { width: 1820, height: 1200 },
        highlights: {
          title: 'Optimizer Highlights',
          description: PHONEPE_INTRO,
          cards: [
            {
              id: '01',
              caption:
                'Influenced the product direction heavily by mentioning the constraints and limitations early in the process',
              image: {
                dark: '/projects/portfolio-optimiser/01-dark.png',
                light: '/projects/portfolio-optimiser/01-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: '02',
              caption:
                'Clarity and auto-select defaults made sure the flow does not feel longer and intimidating',
              image: {
                dark: '/projects/portfolio-optimiser/02-dark.png',
                light: '/projects/portfolio-optimiser/02-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: '03',
              caption:
                'Decided on metrics that assisted users with their decision to buy or sell a particular stock',
              image: {
                dark: '/projects/portfolio-optimiser/03-dark.png',
                light: '/projects/portfolio-optimiser/03-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: '04',
              caption:
                'Later in the design process, included heavy compliance requirements like Editing amount and quantity without affecting the majority of flows',
              image: {
                dark: '/projects/portfolio-optimiser/04-dark.png',
                light: '/projects/portfolio-optimiser/04-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: '05',
              caption:
                'Similar experience designed for web platform',
              image: {
                dark: '/projects/portfolio-optimiser/05-dark.png',
                light: '/projects/portfolio-optimiser/05-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
          ],
        },
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
        highlights: {
          title: 'Care revamp Highlights',
          description: RAZORPAY_INTRO,
          cards: [
            {
              id: '01',
              caption:
                'About 20% of merchants have interacted with Help section. Solved major issues faced by merchants from data insights and user research calls',
              image: {
                dark: '/projects/care-revamp/01-dark.png',
                light: '/projects/care-revamp/01-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: '02',
              caption:
                'Solving for comprehension: Condensed 90 topics and sub-topics to 6 Topics and not more than 5 options in each',
              image: {
                dark: '/projects/care-revamp/02-dark.png',
                light: '/projects/care-revamp/02-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: '03',
              caption:
                'Quick actions are high frequency tickets that can be managed by user without Agent intervention. Open tickets with contextual status keeps track of existing tickets. Solving for Self-serve and duplication',
              image: {
                dark: '/projects/care-revamp/03-dark.png',
                light: '/projects/care-revamp/03-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
            {
              id: '04',
              caption:
                'Each topic is contextual along with timelines, charges breakdowns and statuses. And Merchant can always create ticket from anywhere',
              image: {
                dark: '/projects/care-revamp/04-dark.png',
                light: '/projects/care-revamp/04-light.png',
              },
              size: { width: 1820, height: 1200 },
            },
          ],
        },
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

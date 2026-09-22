/**
 * Company groupings for the Projects section.
 *
 * Craft has no "company" field on a project, so the grouping lives here —
 * same pattern as projectThumbnails.ts. Slugs are derived from the project
 * title via getPostSlug(project.title).
 *
 * Any published project whose slug is not listed below still renders, in a
 * trailing "Other work" group, so nothing silently disappears from the site.
 */
export interface ProjectGroup {
  id: string;
  /** Group heading, e.g. the company or team. */
  company: string;
  /** One-line context shown under the heading. */
  description: string;
  /** Project slugs, in the order they should appear in the carousel. */
  slugs: string[];
}

export const projectGroups: ProjectGroup[] = [
  {
    id: 'phonepe',
    company: 'PhonePe Invest',
    description:
      'I managed Tools and few post-transaction pod efforts that drive more than 70% of the revenue',
    slugs: [
      'simple-and-faster-way-to-place-orders-to-exchange',
      'automating-investments-through-sips',
    ],
  },
  {
    id: 'razorpay',
    company: 'Razorpay',
    description:
      'I was the POC for Razorpay mobile app and Care pod. One of the first projects to be built completely on the new Blade Design System',
    slugs: [
      'revamping-the-ticket-creation-experience',
      'failed-experiment-accept-payments-from-phone-through-cards',
    ],
  },
];

/** Group used for published projects that no group above claims. */
export const fallbackGroup = {
  id: 'other',
  company: 'Other work',
  description: '',
} as const;

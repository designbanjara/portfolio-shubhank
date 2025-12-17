/**
 * Social Media Links Configuration
 * 
 * Update these with your actual social media handles and email.
 * Set `enabled: false` for any links you don't want to display.
 */

export interface SocialLink {
  name: string;
  action: string;
  href: string;
  enabled: boolean;
}

export const socialLinksConfig = {
  twitter: {
    name: 'X',
    action: 'Follow',
    href: 'https://x.com/designbanjara',
    enabled: true,
  },
  linkedin: {
    name: 'LinkedIn',
    action: 'Follow',
    href: 'https://www.linkedin.com/in/shubhank-pawar-51139194/',
    enabled: true,
  },
  github: {
    name: 'GitHub',
    action: 'Follow',
    href: 'https://github.com/designbanjara',
    enabled: true,
  },
  email: {
    name: 'Mail',
    action: 'Contact',
    href: 'mailto:pawarshubhank@gmail.com',
    enabled: true,
  },
} as const;

/**
 * Helper function to get only enabled social links
 */
export const getEnabledSocialLinks = () => {
  return Object.entries(socialLinksConfig)
    .filter(([_, link]) => link.enabled)
    .map(([key, link]) => ({ ...link, key }));
};


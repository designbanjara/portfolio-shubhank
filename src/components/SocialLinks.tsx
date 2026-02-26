
import React from 'react';
import { Separator } from './ui/separator';
import {
  EnvelopeIcon,
  ChevronRightIcon,
  NewspaperIcon,
} from '@heroicons/react/24/solid';
import LinkedinIcon from './icons/LinkedinIcon';
import XIcon from './icons/XIcon';

interface SocialLinkProps {
  name: string;
  action: string;
  icon: React.ElementType;
  href: string;
  subtext?: string;
}

const SocialLink = ({ name, action, icon: Icon, href, subtext }: SocialLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-between items-center py-2.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors duration-150 rounded-lg px-3 -mx-3 cursor-pointer group"
      style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
    >
      <div className="text-foreground flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-150" />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium">{name}</span>
          {subtext && (
            <span className="text-xs text-muted-foreground">{subtext}</span>
          )}
        </div>
      </div>
      <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-150 flex items-center text-sm">
        {action}
        <ChevronRightIcon className="h-3 w-3 ml-0.5" />
      </div>
    </a>
  );
};

const SocialLinks = () => {
  return (
    <div className="mt-10">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3 px-0">Connect</p>
      <SocialLink name="X" action="Follow" icon={XIcon} href="https://x.com/designbanjara" />
      <Separator className="my-1 opacity-[0.12]" />
      <SocialLink name="LinkedIn" action="Follow" icon={LinkedinIcon} href="https://www.linkedin.com/in/shubhank-pawar-51139194/" />
      <Separator className="my-1 opacity-[0.12]" />
      <SocialLink name="Mail" action="Contact" icon={EnvelopeIcon} href="mailto:pawarshubhank@gmail.com" />
      <Separator className="my-1 opacity-[0.12]" />
      <SocialLink
        name="Newsletter"
        action="Subscribe"
        icon={NewspaperIcon}
        href="https://designbanjara.substack.com/"
        subtext="Redirects to Substack"
      />
    </div>
  );
};

export default SocialLinks;

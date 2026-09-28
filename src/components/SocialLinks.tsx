import React from 'react';
import { Separator } from './ui/separator';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

interface SocialLinkProps {
  name: string;
  action: string;
  href: string;
  subtext?: string;
}

const SocialLink = ({ name, action, href, subtext }: SocialLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-between items-center py-2.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors duration-150 rounded-lg px-3 -mx-3 cursor-pointer group ease-out-quad"
    >
      <div className="flex flex-col min-w-0 text-foreground">
        <span className="text-base font-medium">{name}</span>
        {subtext && <span className="text-xs text-muted-foreground">{subtext}</span>}
      </div>
      <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-150 flex items-center text-base">
        {action}
        <ChevronRightIcon className="h-3.5 w-3.5 ml-0.5" />
      </div>
    </a>
  );
};

const SocialLinks = () => {
  return (
    <div>
      <p
        id="connect-heading"
        className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3"
      >
        Connect
      </p>
      <SocialLink name="X" action="Follow" href="https://x.com/designbanjara" />
      <Separator className="my-1 opacity-[0.12]" />
      <SocialLink
        name="LinkedIn"
        action="Follow"
        href="https://www.linkedin.com/in/shubhank-pawar-51139194/"
      />
      <Separator className="my-1 opacity-[0.12]" />
      <SocialLink name="Mail" action="Contact" href="mailto:pawarshubhank@gmail.com" />
    </div>
  );
};

export default SocialLinks;


import React from 'react';
import { Separator } from './ui/separator';
import { 
  EnvelopeIcon,
  ChevronRightIcon, 
} from '@heroicons/react/24/solid';
import LinkedinIcon from './icons/LinkedinIcon';
import XIcon from './icons/XIcon';

interface SocialLinkProps {
  name: string;
  action: string;
  icon: React.ElementType;
  href: string;
}

const SocialLink = ({ name, action, icon: Icon, href }: SocialLinkProps) => {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-between items-center py-2 hover:bg-white/5 transition-colors duration-200 rounded-lg px-3 -mx-3 cursor-pointer group"
    >
      <div className="text-white flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span>{name}</span>
      </div>
      <div className="text-gray-400 group-hover:text-white transition-colors flex items-center">
        {action}
        <ChevronRightIcon className="h-3 w-3 ml-1" />
      </div>
    </a>
  );
};

const SocialLinks = () => {
  return (
    <div className="mt-10">
      <SocialLink name="X" action="Follow" icon={XIcon} href="https://x.com/designbanjara" />
      <Separator className="my-2 border-dotted opacity-40" />
      <SocialLink name="LinkedIn" action="Follow" icon={LinkedinIcon} href="https://www.linkedin.com/in/shubhank-pawar-51139194/" />
      <Separator className="my-2 border-dotted opacity-40" />
      <SocialLink name="Mail" action="Contact" icon={EnvelopeIcon} href="mailto:pawarshubhank@gmail.com" />
    </div>
  );
};

export default SocialLinks;

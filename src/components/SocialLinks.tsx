
import React from 'react';
import { Separator } from './ui/separator';
import { 
  EnvelopeIcon,
  ChevronRightIcon, 
  CodeBracketIcon,
} from '@heroicons/react/24/solid';
import LinkedinIcon from './icons/LinkedinIcon';
import XIcon from './icons/XIcon';

interface SocialLinkProps {
  name: string;
  action: string;
  icon: React.ElementType;
}

const SocialLink = ({ name, action, icon: Icon }: SocialLinkProps) => {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="text-white flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span>{name}</span>
      </div>
      <div className="text-gray-400 hover:text-white cursor-pointer flex items-center">
        {action}
        <ChevronRightIcon className="h-3 w-3 ml-1" />
      </div>
    </div>
  );
};

const SocialLinks = () => {
  return (
    <div className="mt-10">
      <SocialLink name="X" action="Follow" icon={XIcon} />
      <Separator className="my-2 border-dotted opacity-40" />
      <SocialLink name="LinkedIn" action="Follow" icon={LinkedinIcon} />
      <Separator className="my-2 border-dotted opacity-40" />
      <SocialLink name="GitHub" action="Follow" icon={CodeBracketIcon} />
      <Separator className="my-2 border-dotted opacity-40" />
      <SocialLink name="Mail" action="Contact" icon={EnvelopeIcon} />
    </div>
  );
};

export default SocialLinks;

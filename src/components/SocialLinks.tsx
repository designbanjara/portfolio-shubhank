
import React from 'react';
import { Separator } from './ui/separator';
import { 
  GlobeAltIcon, 
  ChevronRightIcon, 
  VideoCameraIcon,
  CodeBracketIcon,
  SwatchIcon
} from '@heroicons/react/24/solid';

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
      <SocialLink name="Online" action="Follow" icon={GlobeAltIcon} />
      <Separator className="my-2 border-dotted opacity-40" />
      <SocialLink name="Threads" action="Follow" icon={GlobeAltIcon} />
      <Separator className="my-2 border-dotted opacity-40" />
      <SocialLink name="YouTube" action="Subscribe" icon={VideoCameraIcon} />
      <Separator className="my-2 border-dotted opacity-40" />
      <SocialLink name="GitHub" action="Follow" icon={CodeBracketIcon} />
      <Separator className="my-2 border-dotted opacity-40" />
      <SocialLink name="Figma" action="Follow" icon={SwatchIcon} />
    </div>
  );
};

export default SocialLinks;

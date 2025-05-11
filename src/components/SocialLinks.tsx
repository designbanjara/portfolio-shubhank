
import React from 'react';
import { Separator } from './ui/separator';

interface SocialLinkProps {
  name: string;
  action: string;
}

const SocialLink = ({ name, action }: SocialLinkProps) => {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="text-white">{name}</div>
      <div className="text-gray-400 hover:text-white cursor-pointer">{action}</div>
    </div>
  );
};

const SocialLinks = () => {
  return (
    <div className="mt-10">
      <SocialLink name="Online" action="Follow" />
      <Separator className="my-2 border-dotted opacity-40" />
      <SocialLink name="Threads" action="Follow" />
      <Separator className="my-2 border-dotted opacity-40" />
      <SocialLink name="YouTube" action="Subscribe" />
      <Separator className="my-2 border-dotted opacity-40" />
      <SocialLink name="GitHub" action="Follow" />
      <Separator className="my-2 border-dotted opacity-40" />
      <SocialLink name="Figma" action="Follow" />
    </div>
  );
};

export default SocialLinks;

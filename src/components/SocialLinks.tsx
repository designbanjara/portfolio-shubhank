
import React from 'react';

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
      <SocialLink name="Threads" action="Follow" />
      <SocialLink name="YouTube" action="Subscribe" />
      <SocialLink name="GitHub" action="Follow" />
      <SocialLink name="Figma" action="Follow" />
    </div>
  );
};

export default SocialLinks;

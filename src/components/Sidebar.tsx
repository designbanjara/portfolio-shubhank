
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  PencilIcon, 
  BookmarkIcon, 
  Square3Stack3DIcon, 
  HomeModernIcon, 
  SquaresPlusIcon, 
  CubeIcon, 
  ShieldCheckIcon, 
  NewspaperIcon, 
  ViewColumnsIcon 
} from '@heroicons/react/24/solid';
import { 
  GlobeAltIcon,
  VideoCameraIcon,
  CodeBracketIcon,
  SwatchIcon
} from '@heroicons/react/24/solid';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  external?: boolean;
}

const SidebarItem = ({ to, icon: Icon, children, external }: SidebarItemProps) => {
  const content = (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#333333] text-gray-300">
      <Icon className="h-4 w-4" />
      <span>{children}</span>
      {external && <span className="ml-auto text-xs">↗</span>}
    </div>
  );

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "block bg-[#333333] rounded-md" : "block"
      }
    >
      {content}
    </NavLink>
  );
};

const SidebarSection = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className="mt-6">
    {title && <div className="px-3 mb-1 text-xs text-gray-500">{title}</div>}
    {children}
  </div>
);

const Sidebar = () => {
  return (
    <div className="w-56 bg-portfolio-sidebar border-r border-[#333] overflow-y-auto">
      <div className="p-3">
        <div className="font-medium text-white mb-4">Brian Lovin</div>

        <SidebarSection>
          <SidebarItem to="/" icon={HomeIcon}>Home</SidebarItem>
          <SidebarItem to="/writing" icon={PencilIcon}>Writing</SidebarItem>
        </SidebarSection>

        <SidebarSection title="Me">
          <SidebarItem to="/bookmarks" icon={BookmarkIcon}>Bookmarks</SidebarItem>
          <SidebarItem to="/ama" icon={ViewColumnsIcon}>AMA</SidebarItem>  
          <SidebarItem to="/stack" icon={Square3Stack3DIcon}>Stack</SidebarItem>
        </SidebarSection>

        <SidebarSection title="Projects">
          <SidebarItem to="/campsite" icon={HomeModernIcon} external>Campsite</SidebarItem>
          <SidebarItem to="/design-details" icon={SquaresPlusIcon} external>Design Details</SidebarItem>
          <SidebarItem to="/staff-design" icon={CubeIcon} external>Staff Design</SidebarItem>
          <SidebarItem to="/figma-plugins" icon={SwatchIcon} external>Figma Plugins</SidebarItem>
          <SidebarItem to="/security-checklist" icon={ShieldCheckIcon}>Security Checklist</SidebarItem>
          <SidebarItem to="/hacker-news" icon={NewspaperIcon}>Hacker News</SidebarItem>
          <SidebarItem to="/app-dissection" icon={ViewColumnsIcon}>App Dissection</SidebarItem>
        </SidebarSection>

        <SidebarSection title="Online">
          <SidebarItem to="/twitter" icon={GlobeAltIcon} external>Twitter</SidebarItem>
          <SidebarItem to="/youtube" icon={VideoCameraIcon} external>YouTube</SidebarItem>
          <SidebarItem to="/github" icon={CodeBracketIcon} external>GitHub</SidebarItem>
          <SidebarItem to="/figma" icon={SwatchIcon} external>Figma</SidebarItem>
        </SidebarSection>
      </div>
    </div>
  );
};

export default Sidebar;


import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  PencilIcon, 
  GlobeAltIcon,
} from '@heroicons/react/24/solid';
import { 
  LinkedinIcon,
  MailIcon,
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  external?: boolean;
}

const SidebarItem = ({ to, icon: Icon, children, external }: SidebarItemProps) => {
  const content = (
    <div className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-[#333333] text-gray-300">
      <Icon className="h-4 w-4" />
      <span>{children}</span>
      {external && <span className="ml-auto text-xs">↗</span>}
    </div>
  );

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="block mb-3">
        {content}
      </a>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "block bg-[#333333] rounded-md mb-3" : "block mb-3"
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
        <div className="font-custom font-bold text-white mb-6 text-lg">Shubhank Pawar</div>

        <SidebarSection>
          <SidebarItem to="/" icon={HomeIcon}>Home</SidebarItem>
          <SidebarItem to="/writing" icon={PencilIcon}>Writing</SidebarItem>
          <SidebarItem to="/work-in-progress" icon={PencilIcon}>Work in Progress</SidebarItem>
          <SidebarItem to="/desserts" icon={PencilIcon}>Desserts</SidebarItem>
        </SidebarSection>

        <SidebarSection title="Online">
          <SidebarItem to="/linkedin" icon={LinkedinIcon} external>LinkedIn</SidebarItem>
          <SidebarItem to="/mail" icon={MailIcon} external>Mail</SidebarItem>
        </SidebarSection>
      </div>
    </div>
  );
};

export default Sidebar;

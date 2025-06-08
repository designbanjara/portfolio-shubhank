import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  CakeIcon,
  ClockIcon,
  EnvelopeIcon,
  PencilIcon,
  BookOpenIcon,
} from '@heroicons/react/24/solid';
import LinkedinIcon from './icons/LinkedinIcon';
import XIcon from './icons/XIcon';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  external?: boolean;
  exact?: boolean;
}

const SidebarItem = ({ to, icon: Icon, children, external, exact = false }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
  
  const content = (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#333333] ${isActive ? 'bg-[#333333] text-white' : 'text-gray-300'}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{children}</span>
      {external && <span className="ml-auto text-xs">↗</span>}
    </div>
  );

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="block mb-1">
        {content}
      </a>
    );
  }

  return (
    <NavLink
      to={to}
      className="block mb-1"
      end={exact}
    >
      {content}
    </NavLink>
  );
};

const SidebarSection = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className="mt-3">
    {title && <div className="px-3 mb-1 text-xs text-gray-500">{title}</div>}
    {children}
  </div>
);

const Sidebar = () => {
  return (
    <div className="w-56 bg-portfolio-sidebar border-r border-[#333] fixed h-screen flex flex-col">
      <div className="p-4 flex-grow">
        <div className="font-custom font-bold text-white mb-5 text-2xl">Shubhank Pawar</div>

        <SidebarSection>
          <SidebarItem to="/" icon={HomeIcon} exact>Home</SidebarItem>
          <SidebarItem to="/writing" icon={PencilIcon}>Writing</SidebarItem>
          <SidebarItem to="/reading-list" icon={BookOpenIcon}>Reading List</SidebarItem>
          <SidebarItem to="/work-in-progress" icon={ClockIcon}>Work in Progress</SidebarItem>
          <SidebarItem to="/desserts" icon={CakeIcon}>Desserts</SidebarItem>
        </SidebarSection>
      </div>

      <div className="p-4 mt-auto">
        <SidebarSection title="Online">
          <SidebarItem to="https://linkedin.com" icon={LinkedinIcon} external>LinkedIn</SidebarItem>
          <SidebarItem to="https://x.com/designbanjara" icon={XIcon} external>X</SidebarItem>
          <SidebarItem to="mailto:contact@example.com" icon={EnvelopeIcon} external>Mail</SidebarItem>
        </SidebarSection>
      </div>
    </div>
  );
};

export default Sidebar;

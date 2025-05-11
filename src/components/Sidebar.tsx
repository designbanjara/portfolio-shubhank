
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  PencilIcon, 
  CakeIcon,
  ClockIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/solid';
import { 
  Linkedin,
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  external?: boolean;
  exact?: boolean;
}

const SidebarItem = ({ to, icon: Icon, children, external, exact = false }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to) && to !== '/writing';
  
  // Special handling for writing section
  const isWriting = to === '/writing';
  const inWritingSubPage = location.pathname === '/writing' || location.pathname.startsWith('/writing/');
  const writeActive = isWriting && inWritingSubPage && location.pathname === '/writing';
  
  const activeState = isWriting ? writeActive : isActive;
  
  const content = (
    <div className={`flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#333333] ${activeState ? 'bg-[#333333] text-white' : 'text-gray-300'}`}>
      <Icon className="h-4 w-4" />
      <span>{children}</span>
      {external && <span className="ml-auto text-xs">↗</span>}
    </div>
  );

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="block mb-4">
        {content}
      </a>
    );
  }

  return (
    <NavLink
      to={to}
      className="block mb-4"
      end={exact}
    >
      {content}
    </NavLink>
  );
};

const SidebarSection = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className="mt-6">
    {title && <div className="px-3 mb-2 text-xs text-gray-500">{title}</div>}
    {children}
  </div>
);

const Sidebar = () => {
  return (
    <div className="w-56 bg-portfolio-sidebar border-r border-[#333] overflow-y-auto">
      <div className="p-3">
        <div className="font-custom font-bold text-white mb-6 text-2xl">Shubhank Pawar</div>

        <SidebarSection>
          <SidebarItem to="/" icon={HomeIcon} exact>Home</SidebarItem>
          <SidebarItem to="/writing" icon={PencilIcon} exact>Writing</SidebarItem>
          <SidebarItem to="/work-in-progress" icon={ClockIcon}>Work in Progress</SidebarItem>
          <SidebarItem to="/desserts" icon={CakeIcon}>Desserts</SidebarItem>
        </SidebarSection>

        <SidebarSection title="Online">
          <SidebarItem to="https://linkedin.com" icon={Linkedin} external>LinkedIn</SidebarItem>
          <SidebarItem to="mailto:contact@example.com" icon={EnvelopeIcon} external>Mail</SidebarItem>
        </SidebarSection>
      </div>
    </div>
  );
};

export default Sidebar;

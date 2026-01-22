
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  PencilIcon,
  BriefcaseIcon,
  PhotoIcon,
} from '@heroicons/react/24/solid';

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
  
  // Determine which image to show based on route
  const getImageSrc = () => {
    if (to === '/projects') {
      return isActive ? '/projects-active.png' : '/projects-inactive.png';
    } else if (to === '/showcase') {
      return isActive ? '/showcase-active.png' : '/showcase-inactive.png';
    } else if (to === '/writing') {
      return isActive ? '/writing-active.png' : '/writing-inactive.png';
    }
    return null;
  };

  const imageSrc = getImageSrc();
  
  const content = (
    <div className={`flex flex-col items-start gap-1 rounded-md hover:bg-[#333333] ${isActive ? 'text-white' : 'text-gray-300 bg-[#2a2a2a]'}`} style={{ paddingTop: '8px', paddingBottom: '0px', paddingLeft: '12px', paddingRight: '12px', height: '120px', backgroundColor: isActive ? 'rgba(37, 99, 235, 1)' : 'rgba(42, 42, 42, 1)', border: 'none' }}>
      <div className="flex items-start gap-1 w-full">
        <Icon className="h-6 w-6" style={{ paddingTop: '4px', paddingBottom: '4px' }} />
        <span className="text-base font-medium">{children}</span>
        {external && <span className="ml-auto text-xs">↗</span>}
      </div>
      {imageSrc && (
        <div className="mt-auto w-full">
          <img src={imageSrc} alt={children?.toString()} className="w-full h-auto" />
        </div>
      )}
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
  <div className="mt-3 flex flex-col gap-3" style={{ gap: '12px' }}>
    {title && <div className="px-3 mb-1 text-xs text-gray-500">{title}</div>}
    {children}
  </div>
);

const Sidebar = () => {
  return (
    <div className="w-56 bg-portfolio-sidebar border-r border-[#333] fixed h-screen flex flex-col">
      <div className="p-4 flex-grow mt-0">
        <div className="font-custom font-bold text-white mb-5 text-lg">Shubhank Pawar</div>

        <SidebarSection>
          <SidebarItem to="/" icon={HomeIcon} exact>Home</SidebarItem>
          <SidebarItem to="/projects" icon={BriefcaseIcon}>Projects</SidebarItem>
          <SidebarItem to="/writing" icon={PencilIcon}>Writing</SidebarItem>
          <SidebarItem to="/showcase" icon={PhotoIcon}>Showcase</SidebarItem>
        </SidebarSection>
      </div>
    </div>
  );
};

export default Sidebar;

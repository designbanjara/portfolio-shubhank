
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  PencilIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/solid';
import { useProjectsPasscode } from '@/contexts/ProjectsPasscodeContext';
import ThemeToggle from './ThemeToggle';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  external?: boolean;
  exact?: boolean;
}

const SidebarItem = ({ to, icon: Icon, children, external, exact = false }: SidebarItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isProjectsUnlocked, requestProjectsUnlock } = useProjectsPasscode();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  // Determine which image to show based on route
  const getImageSrc = () => {
    if (to === '/projects') {
      return isActive ? '/projects-active.png' : '/projects-inactive.png';
    } else if (to === '/writing') {
      return isActive ? '/writing-active.png' : '/writing-inactive.png';
    }
    return null;
  };

  const imageSrc = getImageSrc();

  const content = (
    <div
      className={`flex flex-col items-start gap-1 rounded-md transition-colors duration-150 ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'bg-[hsl(var(--sidebar-accent))] text-foreground/70 hover:bg-[hsl(var(--sidebar-border))]'
      }`}
      style={{ paddingTop: '8px', paddingBottom: '0px', paddingLeft: '12px', paddingRight: '12px', height: '120px' }}
    >
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
      onClick={(e) => {
        if (to === '/projects' && !isProjectsUnlocked) {
          e.preventDefault();
          requestProjectsUnlock(() => navigate(to));
        }
      }}
    >
      {content}
    </NavLink>
  );
};

const SidebarSection = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className="mt-3 flex flex-col gap-3" style={{ gap: '12px' }}>
    {title && <div className="px-3 mb-1 text-xs text-muted-foreground">{title}</div>}
    {children}
  </div>
);

const Sidebar = () => {
  return (
    <div className="w-56 bg-portfolio-sidebar border-r border-border fixed h-screen flex flex-col transition-colors duration-200">
      <div className="p-4 flex-grow mt-0">
        <div className="font-custom font-bold text-foreground mb-5 text-lg">Shubhank Pawar</div>

        <SidebarSection>
          <SidebarItem to="/" icon={HomeIcon} exact>Home</SidebarItem>
          <SidebarItem to="/writing" icon={PencilIcon}>Writing</SidebarItem>
          <SidebarItem to="/projects" icon={BriefcaseIcon}>Projects</SidebarItem>
        </SidebarSection>
      </div>

      {/* Theme toggle pinned to bottom */}
      <div className="p-3 border-t border-border">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebar;

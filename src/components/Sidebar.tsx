
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

  const content = (
    <div
      className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors duration-150 ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'bg-transparent text-foreground/70 hover:bg-[hsl(var(--sidebar-border))]'
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="text-sm font-medium">{children}</span>
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
      className="block"
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
  <div className="flex flex-col gap-1">
    {title && <div className="px-3 mb-1 text-xs text-muted-foreground">{title}</div>}
    {children}
  </div>
);

const Sidebar = () => {
  return (
    <div className="w-56 bg-portfolio-sidebar fixed h-screen flex flex-col transition-colors duration-200">
      <div className="p-4 flex-grow">
        <div className="font-custom font-bold text-foreground mb-5 text-lg">Shubhank Pawar</div>

        <SidebarSection>
          <SidebarItem to="/" icon={HomeIcon} exact>Home</SidebarItem>
          <SidebarItem to="/writing" icon={PencilIcon}>Writing</SidebarItem>
          <SidebarItem to="/projects" icon={BriefcaseIcon}>Projects</SidebarItem>
        </SidebarSection>
      </div>

      {/* Theme toggle pinned to bottom */}
      <div className="p-3">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebar;

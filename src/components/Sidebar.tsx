
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Pencil, Bookmark, Layers, CampingTent, Box } from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  external?: boolean;
}

const SidebarItem = ({ to, icon: Icon, children, external }: SidebarItemProps) => {
  const content = (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#333333] text-gray-300">
      <Icon size={16} />
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
          <SidebarItem to="/" icon={Home}>Home</SidebarItem>
          <SidebarItem to="/writing" icon={Pencil}>Writing</SidebarItem>
        </SidebarSection>

        <SidebarSection title="Me">
          <SidebarItem to="/bookmarks" icon={Bookmark}>Bookmarks</SidebarItem>
          <SidebarItem to="/ama" icon={Box}>AMA</SidebarItem>  
          <SidebarItem to="/stack" icon={Layers}>Stack</SidebarItem>
        </SidebarSection>

        <SidebarSection title="Projects">
          <SidebarItem to="/campsite" icon={CampingTent} external>Campsite</SidebarItem>
          <SidebarItem to="/design-details" icon={Box} external>Design Details</SidebarItem>
          <SidebarItem to="/staff-design" icon={Box} external>Staff Design</SidebarItem>
          <SidebarItem to="/figma-plugins" icon={Box} external>Figma Plugins</SidebarItem>
          <SidebarItem to="/security-checklist" icon={Box}>Security Checklist</SidebarItem>
          <SidebarItem to="/hacker-news" icon={Box}>Hacker News</SidebarItem>
          <SidebarItem to="/app-dissection" icon={Box}>App Dissection</SidebarItem>
        </SidebarSection>

        <SidebarSection title="Online">
          <SidebarItem to="/twitter" icon={Box} external>Twitter</SidebarItem>
          <SidebarItem to="/youtube" icon={Box} external>YouTube</SidebarItem>
          <SidebarItem to="/github" icon={Box} external>GitHub</SidebarItem>
          <SidebarItem to="/figma" icon={Box} external>Figma</SidebarItem>
        </SidebarSection>
      </div>
    </div>
  );
};

export default Sidebar;

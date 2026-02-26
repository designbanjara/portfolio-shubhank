import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectsContent from '../components/ProjectsContent';
import BottomNavigation from '../components/BottomNavigation';

const Projects = () => {
  useEffect(() => {
    document.title = 'Projects \u2014 Shubhank Pawar';
  }, []);

  return (
    <div className="min-h-screen bg-portfolio-dark text-foreground">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content - responsive padding without card treatment */}
      <main id="main-content" className="md:ml-56 pb-20 md:pb-6">
        <ProjectsContent />
      </main>

      {/* Bottom navigation for mobile */}
      <BottomNavigation />
    </div>
  );
};

export default Projects;


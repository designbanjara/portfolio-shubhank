
import React from 'react';
import Sidebar from '../components/Sidebar';
import BottomNavigation from '../components/BottomNavigation';
import CraftDocsFloat from '../components/CraftDocsFloat';
import { useIsMobile } from '../hooks/use-mobile';

const WorkInProgress = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`min-h-screen ${isMobile ? 'bg-[#222222]' : 'bg-portfolio-dark'} text-white`}>
      {/* Floating Craft docs component */}
      <CraftDocsFloat />
      
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content - responsive width */}
      <main className="md:ml-56">
        <div className="w-full h-[calc(100vh-60px)] md:h-screen">
          <iframe 
            src="https://writings.werkinprogress.design?theme=dark&color-scheme=dark" 
            title="Werk in Progress Writings" 
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </main>

      {/* Bottom navigation for mobile */}
      <BottomNavigation />
    </div>
  );
};

export default WorkInProgress;

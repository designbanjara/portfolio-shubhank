
import React from 'react';
import Sidebar from '../components/Sidebar';
import BottomNavigation from '../components/BottomNavigation';

const WorkInProgress = () => {
  return (
    <div className="min-h-screen bg-portfolio-dark text-white">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content - responsive width */}
      <main className="md:ml-56">
        <div className="w-full h-[calc(100vh-60px)] md:h-screen">
          <iframe 
            src="https://writings.werkinprogress.design" 
            title="Werk in Progress Writings" 
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
          />
        </div>
      </main>

      {/* Bottom navigation for mobile */}
      <BottomNavigation />
    </div>
  );
};

export default WorkInProgress;

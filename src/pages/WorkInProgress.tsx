
import React from 'react';
import Sidebar from '../components/Sidebar';
import MobileHeader from '../components/MobileHeader';

const WorkInProgress = () => {
  return (
    <div className="min-h-screen bg-portfolio-dark text-white">
      {/* Mobile Header - visible only on small screens */}
      <MobileHeader />
      
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
    </div>
  );
};

export default WorkInProgress;


import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProfileContent from '../components/ProfileContent';
import MobileHeader from '../components/MobileHeader';
import BottomNavigation from '../components/BottomNavigation';

const Index = () => {
  useEffect(() => {
    document.title = 'Shubhank Pawar \u2014 Designer';
  }, []);

  return (
    <div className="min-h-screen bg-portfolio-dark text-foreground">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content - responsive padding without card treatment */}
      <main id="main-content" className="md:ml-56 pb-20 md:pb-6">
        <ProfileContent />
      </main>

      {/* Bottom navigation for mobile */}
      <BottomNavigation />
    </div>
  );
};

export default Index;

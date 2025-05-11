
import React from 'react';
import Sidebar from '../components/Sidebar';
import ProfileContent from '../components/ProfileContent';
import MobileHeader from '../components/MobileHeader';
import BottomNavigation from '../components/BottomNavigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-portfolio-dark text-white">
      {/* Mobile Header - visible only on small screens */}
      <MobileHeader />
      
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content - responsive padding with floating treatment */}
      <main className="md:ml-56 pb-20 md:pb-6">
        <div className="max-w-3xl mx-auto py-6 md:py-10 px-4 bg-portfolio-sidebar m-2 rounded-lg border border-[#333]">
          <ProfileContent />
        </div>
      </main>

      {/* Bottom navigation for mobile */}
      <BottomNavigation />
    </div>
  );
};

export default Index;

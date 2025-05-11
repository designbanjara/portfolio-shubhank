
import React from 'react';
import Sidebar from '../components/Sidebar';
import ProfileContent from '../components/ProfileContent';
import MobileHeader from '../components/MobileHeader';

const Index = () => {
  return (
    <div className="min-h-screen bg-portfolio-dark text-white">
      {/* Mobile Header - visible only on small screens */}
      <MobileHeader />
      
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content - responsive padding */}
      <main className="md:ml-56">
        <div className="max-w-3xl mx-auto py-6 md:py-10 px-4">
          <ProfileContent />
        </div>
      </main>
    </div>
  );
};

export default Index;

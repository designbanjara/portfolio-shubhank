
import React from 'react';
import Sidebar from '../components/Sidebar';
import MobileHeader from '../components/MobileHeader';

const Bookmarks = () => {
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
        <div className="p-4 md:p-8">
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          <p className="mt-4">This page would contain Brian's bookmarked content.</p>
        </div>
      </main>
    </div>
  );
};

export default Bookmarks;

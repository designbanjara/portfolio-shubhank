
import React, { useEffect } from 'react';
import MobileHeader from '../components/MobileHeader';

const Bookmarks = () => {
  useEffect(() => {
    document.title = 'Bookmarks \u2014 Shubhank Pawar';
  }, []);

  return (
    <div className="min-h-screen bg-portfolio-dark text-foreground">
      {/* Mobile Header - visible only on small screens */}
      <MobileHeader />
      
      
      {/* Main content - responsive padding */}
      <main id="main-content">
        <div className="p-4 md:p-8">
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          <p className="mt-4">This page would contain Brian's bookmarked content.</p>
        </div>
      </main>
    </div>
  );
};

export default Bookmarks;

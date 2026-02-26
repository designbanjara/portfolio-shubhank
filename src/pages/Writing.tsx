
import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import WritingContent from '../components/WritingContent';
import BottomNavigation from '../components/BottomNavigation';

const Writing = () => {
  useEffect(() => {
    document.title = 'Writing \u2014 Shubhank Pawar';
  }, []);

  return (
    <div className="min-h-screen bg-portfolio-dark text-foreground">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content - responsive padding without card treatment */}
      <main id="main-content" className="md:ml-56 pb-20 md:pb-6">
        <WritingContent />
      </main>

      {/* Bottom navigation for mobile */}
      <BottomNavigation />
    </div>
  );
};

export default Writing;

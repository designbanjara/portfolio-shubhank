
import React from 'react';
import Sidebar from '../components/Sidebar';
import BottomNavigation from '../components/BottomNavigation';

const Stack = () => {
  return (
    <div className="min-h-screen bg-portfolio-dark text-white">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content - responsive padding without card treatment */}
      <main className="md:ml-56 pb-20 md:pb-6">
        <div className="max-w-3xl mx-auto py-6 md:py-10 px-4">
          <h1 className="text-2xl font-bold">Stack</h1>
          <p className="mt-4">This page would contain information about Brian's technology stack.</p>
        </div>
      </main>

      {/* Bottom navigation for mobile */}
      <BottomNavigation />
    </div>
  );
};

export default Stack;

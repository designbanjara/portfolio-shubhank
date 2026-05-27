import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PlaygroundContent from '../components/PlaygroundContent';
import BottomNavigation from '../components/BottomNavigation';

const Playground = () => {
  useEffect(() => {
    document.title = 'Playground — Shubhank Pawar';
  }, []);

  return (
    <div className="min-h-screen bg-portfolio-dark text-foreground">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main id="main-content" className="md:ml-56 pb-20 md:pb-6">
        <PlaygroundContent />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Playground;

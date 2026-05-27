import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BellandurTrafficContent from '../components/playground/BellandurTrafficContent';
import BottomNavigation from '../components/BottomNavigation';

const BellandurTraffic = () => {
  useEffect(() => {
    document.title = 'Bellandur Traffic — Shubhank Pawar';
  }, []);

  return (
    <div className="min-h-screen bg-portfolio-dark text-foreground">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main id="main-content" className="md:ml-56 pb-20 md:pb-6">
        <BellandurTrafficContent />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default BellandurTraffic;

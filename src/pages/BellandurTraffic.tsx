import React, { useEffect } from 'react';
import BellandurTrafficContent from '../components/playground/BellandurTrafficContent';

const BellandurTraffic = () => {
  useEffect(() => {
    document.title = 'Bellandur Traffic — Shubhank Pawar';
  }, []);

  return (
    <div className="min-h-screen bg-portfolio-dark text-foreground">
      <main id="main-content" className="pb-6">
        <BellandurTrafficContent />
      </main>
    </div>
  );
};

export default BellandurTraffic;

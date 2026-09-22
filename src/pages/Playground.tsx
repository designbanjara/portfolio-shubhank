import React, { useEffect } from 'react';
import PlaygroundContent from '../components/PlaygroundContent';

const Playground = () => {
  useEffect(() => {
    document.title = 'Playground — Shubhank Pawar';
  }, []);

  return (
    <div className="min-h-screen bg-portfolio-dark text-foreground">

      <main id="main-content" className="pb-6">
        <PlaygroundContent />
      </main>

    </div>
  );
};

export default Playground;

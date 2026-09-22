
import React, { useEffect } from 'react';

const Stack = () => {
  useEffect(() => {
    document.title = 'Stack \u2014 Shubhank Pawar';
  }, []);

  return (
    <div className="min-h-screen bg-portfolio-dark text-foreground">
      
            <main id="main-content" className="pb-6">
        <div className="max-w-3xl mx-auto py-6 md:py-10 px-4">
          <h1 className="text-2xl font-bold">Stack</h1>
          <p className="mt-4">This page would contain information about Brian's technology stack.</p>
        </div>
      </main>

    </div>
  );
};

export default Stack;


import React from 'react';
import ShowcaseContent from '../components/ShowcaseContent';

const Showcase = () => {
  return (
    <div className="min-h-screen bg-portfolio-dark text-foreground">
      
            <main className="pb-6">
        <div className="max-w-3xl mx-auto py-6 md:py-10 px-4">
          <ShowcaseContent />
        </div>
      </main>

    </div>
  );
};

export default Showcase;


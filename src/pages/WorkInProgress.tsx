
import React from 'react';
import Sidebar from '../components/Sidebar';

const WorkInProgress = () => {
  return (
    <div className="min-h-screen flex bg-portfolio-dark text-white">
      <Sidebar />
      <div className="flex-1 ml-56">
        <div className="w-full h-screen">
          <iframe 
            src="https://writings.werkinprogress.design" 
            title="Werk in Progress Writings" 
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default WorkInProgress;

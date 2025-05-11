
import React from 'react';
import Sidebar from '../components/Sidebar';

const Desserts = () => {
  return (
    <div className="min-h-screen flex bg-portfolio-dark text-white">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-custom font-bold mb-6">Desserts</h1>
          <div className="space-y-6">
            <p className="text-lg">Explore Shubhank's favorite desserts and recipes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Desserts;

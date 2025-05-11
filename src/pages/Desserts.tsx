
import React from 'react';
import Sidebar from '../components/Sidebar';
import DessertsContent from '../components/DessertsContent';

const Desserts = () => {
  return (
    <div className="min-h-screen flex bg-portfolio-dark text-white">
      <Sidebar />
      <main className="flex-1 ml-56">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <DessertsContent />
        </div>
      </main>
    </div>
  );
};

export default Desserts;

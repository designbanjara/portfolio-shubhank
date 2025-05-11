
import React from 'react';
import Sidebar from '../components/Sidebar';
import ProfileContent from '../components/ProfileContent';

const Index = () => {
  return (
    <div className="min-h-screen flex bg-portfolio-dark text-white">
      <Sidebar />
      <main className="flex-1 ml-56">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <ProfileContent />
        </div>
      </main>
    </div>
  );
};

export default Index;

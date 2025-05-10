
import React from 'react';
import Sidebar from '../components/Sidebar';
import ProfileContent from '../components/ProfileContent';

const Index = () => {
  return (
    <div className="min-h-screen flex bg-portfolio-dark text-white">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <ProfileContent />
      </div>
    </div>
  );
};

export default Index;

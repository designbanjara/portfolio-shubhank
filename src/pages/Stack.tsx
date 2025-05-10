
import React from 'react';
import Sidebar from '../components/Sidebar';

const Stack = () => {
  return (
    <div className="min-h-screen flex bg-portfolio-dark text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Stack</h1>
        <p className="mt-4">This page would contain information about Brian's technology stack.</p>
      </div>
    </div>
  );
};

export default Stack;

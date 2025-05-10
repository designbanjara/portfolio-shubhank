
import React from 'react';
import Sidebar from '../components/Sidebar';

const Writing = () => {
  return (
    <div className="min-h-screen flex bg-portfolio-dark text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Writing</h1>
        <p className="mt-4">This page would contain Brian's articles and blog posts.</p>
      </div>
    </div>
  );
};

export default Writing;

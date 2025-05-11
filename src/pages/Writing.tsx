
import React from 'react';
import Sidebar from '../components/Sidebar';
import WritingContent from '../components/WritingContent';

const Writing = () => {
  return (
    <div className="min-h-screen flex bg-portfolio-dark text-white">
      <Sidebar />
      <main className="flex-1 ml-56">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <WritingContent />
        </div>
      </main>
    </div>
  );
};

export default Writing;

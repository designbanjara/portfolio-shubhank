
import React from 'react';
import Sidebar from '../components/Sidebar';

const Writings = () => {
  return (
    <div className="min-h-screen flex bg-portfolio-dark text-white">
      <Sidebar />
      <main className="flex-1 ml-56">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-custom font-bold mb-6">Writings</h1>
          <div className="space-y-6">
            <p className="text-lg">Collection of articles written by Shubhank on various topics.</p>
            
            <div className="grid grid-cols-1 gap-6 mt-8">
              <div className="border border-[#333] rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">The Art of Product Design</h2>
                <p className="text-gray-400 text-sm mb-3">May 15, 2025</p>
                <p className="text-gray-300 mb-4">Exploring the principles that make digital products intuitive and enjoyable.</p>
              </div>
              <div className="border border-[#333] rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">User Testing: Beyond the Basics</h2>
                <p className="text-gray-400 text-sm mb-3">May 12, 2025</p>
                <p className="text-gray-300 mb-4">Advanced techniques for gathering meaningful user feedback.</p>
              </div>
              <div className="border border-[#333] rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">Design Systems in Practice</h2>
                <p className="text-gray-400 text-sm mb-3">May 9, 2025</p>
                <p className="text-gray-300 mb-4">How to implement and maintain effective design systems at scale.</p>
              </div>
              <div className="border border-[#333] rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">Mobile UX Patterns</h2>
                <p className="text-gray-400 text-sm mb-3">May 5, 2025</p>
                <p className="text-gray-300 mb-4">An analysis of successful interaction patterns in mobile applications.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Writings;

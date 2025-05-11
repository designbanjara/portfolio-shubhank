
import React from 'react';
import Sidebar from '../components/Sidebar';

const Writing2 = () => {
  return (
    <div className="min-h-screen flex bg-portfolio-dark text-white">
      <Sidebar />
      <main className="flex-1 ml-56">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-custom font-bold mb-6">Writing</h1>
          <div className="space-y-6">
            <p className="text-lg">Explore Shubhank's thoughts and articles on various topics.</p>
            
            <div className="grid grid-cols-1 gap-6 mt-8">
              <div className="border border-[#333] rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">Typography Guide: Making Your Content Shine</h2>
                <p className="text-gray-400 text-sm mb-3">May 10, 2025</p>
                <p className="text-gray-300 mb-4">A comprehensive guide to web typography and how to use it effectively.</p>
              </div>
              <div className="border border-[#333] rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">Building Responsive Interfaces with Tailwind CSS</h2>
                <p className="text-gray-400 text-sm mb-3">May 8, 2025</p>
                <p className="text-gray-300 mb-4">Learn how to create beautiful, responsive designs using Tailwind CSS.</p>
              </div>
              <div className="border border-[#333] rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">React Hooks: A Deep Dive</h2>
                <p className="text-gray-400 text-sm mb-3">May 5, 2025</p>
                <p className="text-gray-300 mb-4">Understanding React hooks and how they can simplify your components.</p>
              </div>
              <div className="border border-[#333] rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">The Future of Web Development</h2>
                <p className="text-gray-400 text-sm mb-3">May 1, 2025</p>
                <p className="text-gray-300 mb-4">Exploring upcoming trends and technologies in web development.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Writing2;

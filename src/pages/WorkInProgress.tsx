
import React from 'react';
import Sidebar from '../components/Sidebar';

const WorkInProgress = () => {
  return (
    <div className="min-h-screen flex bg-portfolio-dark text-white">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-custom font-bold mb-6">Work in Progress</h1>
          
          <div className="space-y-6 mt-8">
            {/* Web page iframe */}
            <div className="mt-4 mb-8">
              <p className="text-lg mb-4">You can explore my work in progress design site below:</p>
              <div className="w-full h-[600px] border border-[#333] rounded-lg overflow-hidden">
                <iframe 
                  src="https://werkinprogress.design" 
                  title="Werk in Progress" 
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                />
              </div>
            </div>
            
            <div className="border border-[#333] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-3">Portfolio 2.0</h2>
              <div className="bg-[#333] h-4 rounded-full mb-3">
                <div className="bg-blue-500 h-4 rounded-full w-3/4"></div>
              </div>
              <p className="text-gray-400 mb-2">75% Complete</p>
              <p className="text-gray-300">Redesigning personal portfolio with new tech stack and improved UI/UX.</p>
            </div>
            
            <div className="border border-[#333] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-3">Recipe App</h2>
              <div className="bg-[#333] h-4 rounded-full mb-3">
                <div className="bg-blue-500 h-4 rounded-full w-2/5"></div>
              </div>
              <p className="text-gray-400 mb-2">40% Complete</p>
              <p className="text-gray-300">Building a mobile app for storing and sharing favorite recipes.</p>
            </div>
            
            <div className="border border-[#333] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-3">Data Visualization Tool</h2>
              <div className="bg-[#333] h-4 rounded-full mb-3">
                <div className="bg-blue-500 h-4 rounded-full w-1/4"></div>
              </div>
              <p className="text-gray-400 mb-2">25% Complete</p>
              <p className="text-gray-300">Creating an interactive dashboard for visualizing complex datasets.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkInProgress;

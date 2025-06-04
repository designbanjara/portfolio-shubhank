
import React from 'react';
import Sidebar from '../components/Sidebar';
import MobileHeader from '../components/MobileHeader';
import BottomNavigation from '../components/BottomNavigation';

const ReadingList = () => {
  return (
    <div className="min-h-screen bg-portfolio-dark text-white">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content - responsive padding without card treatment */}
      <main className="md:ml-56 pb-20 md:pb-6">
        <div className="max-w-3xl mx-auto py-6 md:py-10 px-4">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Reading List</h1>
              <p className="text-gray-400">Books, articles, and resources I'm currently reading or recommend.</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                <h3 className="text-lg font-semibold text-white mb-2">Currently Reading</h3>
                <p className="text-gray-400">No books currently being read.</p>
              </div>
              
              <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                <h3 className="text-lg font-semibold text-white mb-2">Want to Read</h3>
                <p className="text-gray-400">Reading list coming soon.</p>
              </div>
              
              <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                <h3 className="text-lg font-semibold text-white mb-2">Recommended Articles</h3>
                <p className="text-gray-400">Curated articles and resources coming soon.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom navigation for mobile */}
      <BottomNavigation />
    </div>
  );
};

export default ReadingList;

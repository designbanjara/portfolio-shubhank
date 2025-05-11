
import React from 'react';

const WritingContent = () => {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-custom font-bold mb-6">Writing</h1>
      <div className="space-y-6">
        <p className="text-lg">Explore Shubhank's thoughts, articles and essays.</p>
        
        <div className="space-y-8 mt-8">
          <article className="border-b border-[#333] pb-6">
            <h2 className="text-2xl font-bold mb-2">
              <a href="#" className="text-[#F97316] hover:underline">The Art of Mindful Coding</a>
            </h2>
            <div className="text-gray-400 mb-3">March 15, 2025</div>
            <p className="text-gray-300">An exploration of how mindfulness practices can improve focus and creativity in software development.</p>
          </article>
          
          <article className="border-b border-[#333] pb-6">
            <h2 className="text-2xl font-bold mb-2">
              <a href="#" className="text-[#F97316] hover:underline">Design Systems That Scale</a>
            </h2>
            <div className="text-gray-400 mb-3">February 28, 2025</div>
            <p className="text-gray-300">Lessons learned from building design systems that grow with your organization.</p>
          </article>
          
          <article className="border-b border-[#333] pb-6">
            <h2 className="text-2xl font-bold mb-2">
              <a href="#" className="text-[#F97316] hover:underline">The Future of Web Interaction</a>
            </h2>
            <div className="text-gray-400 mb-3">January 12, 2025</div>
            <p className="text-gray-300">Exploring emerging patterns in user interfaces and interaction design for the next generation of web applications.</p>
          </article>
        </div>
      </div>
    </div>
  );
};

export default WritingContent;


import React from 'react';

const WritingContent = () => {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-custom font-bold mb-6">Writing</h1>
      <div className="space-y-6">
        <p className="text-lg">Explore Shubhank's thoughts, articles and essays.</p>
        
        <div className="space-y-8 mt-8">
          <article className="border-b border-[#333] pb-6">
            <a href="#" className="block group hover:bg-[#1f1f1f] p-4 -m-4 rounded-lg transition-colors">
              <h2 className="text-xl font-bold mb-3 text-white group-hover:text-gray-100">
                The Art of Mindful Coding
              </h2>
              <p className="text-gray-300">An exploration of how mindfulness practices can improve focus and creativity in software development.</p>
            </a>
          </article>
          
          <article className="border-b border-[#333] pb-6">
            <a href="#" className="block group hover:bg-[#1f1f1f] p-4 -m-4 rounded-lg transition-colors">
              <h2 className="text-xl font-bold mb-3 text-white group-hover:text-gray-100">
                Design Systems That Scale
              </h2>
              <p className="text-gray-300">Lessons learned from building design systems that grow with your organization.</p>
            </a>
          </article>
          
          <article className="border-b border-[#333] pb-6">
            <a href="#" className="block group hover:bg-[#1f1f1f] p-4 -m-4 rounded-lg transition-colors">
              <h2 className="text-xl font-bold mb-3 text-white group-hover:text-gray-100">
                The Future of Web Interaction
              </h2>
              <p className="text-gray-300">Exploring emerging patterns in user interfaces and interaction design for the next generation of web applications.</p>
            </a>
          </article>
        </div>
      </div>
    </div>
  );
};

export default WritingContent;

import React from 'react';
const WritingContent = () => {
  return <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-custom font-bold mb-6">Writing</h1>
      <div className="space-y-6">
        <p className="text-base">Each article features distinct visual or interaction styles. I use them as a space to explore different design approaches in context</p>
        
        <div className="space-y-8 mt-8">
          <article className="border-b border-[#333] pb-6">
            <a href="#" className="block group hover:bg-[#1f1f1f] p-4 -m-4 rounded-lg transition-colors">
              <div className="flex gap-4">
                <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=80&h=80&fit=crop&crop=center" alt="The story of my experiments with Bellandur traffic" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold mb-1 text-white group-hover:text-gray-100 text-lg">
                    The story of my experiments with Bellandur traffic
                  </h2>
                  <p className="text-gray-300 text-base">An exploration of how mindfulness practices can improve focus and creativity in software development.</p>
                </div>
              </div>
            </a>
          </article>
          
          <article className="border-b border-[#333] pb-6">
            <a href="#" className="block group hover:bg-[#1f1f1f] p-4 -m-4 rounded-lg transition-colors">
              <div className="flex gap-4">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=80&h=80&fit=crop&crop=center" alt="Design Systems That Scale" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h2 className="mb-1 text-white group-hover:text-gray-100 font-bold text-lg">
                    Design Systems That Scale
                  </h2>
                  <p className="text-gray-300">Lessons learned from building design systems that grow with your organization.</p>
                </div>
              </div>
            </a>
          </article>
          
          <article className="border-b border-[#333] pb-6">
            <a href="#" className="block group hover:bg-[#1f1f1f] p-4 -m-4 rounded-lg transition-colors">
              <div className="flex gap-4">
                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=80&h=80&fit=crop&crop=center" alt="The Future of Web Interaction" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h2 className="mb-1 text-white group-hover:text-gray-100 font-bold text-lg">
                    The Future of Web Interaction
                  </h2>
                  <p className="text-gray-300">Exploring emerging patterns in user interfaces and interaction design for the next generation of web applications.</p>
                </div>
              </div>
            </a>
          </article>
        </div>
      </div>
    </div>;
};
export default WritingContent;
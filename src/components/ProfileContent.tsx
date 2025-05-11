
import React from 'react';
import SocialLinks from './SocialLinks';

const ProfileContent = () => {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-custom font-bold mb-6">Brian Lovin</h1>
      <div className="space-y-6">
        <p className="text-lg">
          Hey, I'm Brian. I'm a designer, <a href="#" className="text-portfolio-link hover:underline">software engineer</a>, <a href="#" className="text-portfolio-link hover:underline">podcaster</a>, and <a href="#" className="text-portfolio-link hover:underline">writer</a>. I'm currently designing products at <a href="#" className="text-portfolio-link hover:underline">Notion</a>. Before Notion, I was the co-founder and CEO at <a href="#" className="text-portfolio-link hover:underline">Campsite</a>, an app that combined posts, docs, calls, and chat to enable thoughtful team collaboration.
        </p>

        <p className="text-lg">
          Before Campsite, I spent four years designing the <a href="#" className="text-portfolio-link hover:underline">GitHub Mobile apps</a>. I joined GitHub after they acquired my first startup, <a href="#" className="text-portfolio-link hover:underline">Spectrum</a>, a platform for large-scale communities to have better public conversations.
        </p>

        <p className="text-lg">
          Before Spectrum I designed payments experiences at Facebook, working across Facebook, Messenger, WhatsApp, and Instagram. I originally cut my teeth as the first product designer at <a href="#" className="text-portfolio-link hover:underline">Buffer</a>.
        </p>

        <p className="text-lg">
          I also co-host the <a href="#" className="text-portfolio-link hover:underline">Design Details Podcast</a>, a weekly conversation about design process and culture.
        </p>

        <SocialLinks />
      </div>
    </div>
  );
};

export default ProfileContent;

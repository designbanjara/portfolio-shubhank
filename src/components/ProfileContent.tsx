
import React from 'react';
import SocialLinks from './SocialLinks';

const ProfileContent = () => {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-custom font-bold mb-6">Brian Lovin</h1>
      <div className="space-y-6">
        <p className="text-lg">
          Hey, I'm Shubhank. I'm a digital designer, based out of Bangalore, India.
          I'm currently designing products at <a href="#" className="text-portfolio-link hover:underline">PhonePe</a>.
        </p>

        <p className="text-lg">
          Before PhonePe, I spent couple of years designing at <a href="#" className="text-portfolio-link hover:underline">Razorpay</a>. Majorly working on their mobile app and merchant experience
        </p>

        <p className="text-lg">
          Before Razorpay, I designed experiences for social media and mobility domains. 
        </p>

        <p className="text-lg">
          I plan to write honestly about Design, AI in Design and the industry in India.
        </p>

        <SocialLinks />
      </div>
    </div>
  );
};

export default ProfileContent;

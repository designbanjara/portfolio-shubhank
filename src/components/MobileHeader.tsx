import React from 'react';

const MobileHeader = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[#333] bg-portfolio-sidebar md:hidden">
      {/* Empty header for mobile - keeping the height but removing content */}
      <div className="h-6"></div>
    </div>
  );
};

export default MobileHeader;


import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const CraftDocsFloat = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 md:left-[calc(50%+7rem)] transform -translate-x-1/2 z-50 bg-card border border-border rounded-lg shadow-lg max-w-xs">
      <div className="flex items-start justify-between p-3 px-[8px] py-[4px]">
        <p className="text-sm text-foreground pr-2">
          This is a iframe of Craft docs.{' '}
          <a href="#" className="text-accent hover:text-accent/80 underline transition-colors">
            Why?
          </a>
        </p>
        <button 
          onClick={() => setIsVisible(false)} 
          className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors" 
          aria-label="Dismiss"
        >
          <XMarkIcon className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default CraftDocsFloat;

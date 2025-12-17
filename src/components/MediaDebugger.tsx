import React, { useState } from 'react';
import { CraftBlock } from '../services/craftApi';

interface MediaDebuggerProps {
  blocks: CraftBlock[];
}

/**
 * Debug component to help troubleshoot media loading issues
 * To use: Add <MediaDebugger blocks={post.content} /> temporarily to BlogPost.tsx
 */
const MediaDebugger: React.FC<MediaDebuggerProps> = ({ blocks }) => {
  const [isOpen, setIsOpen] = useState(false);

  const findMediaBlocks = (blocks: CraftBlock[]): CraftBlock[] => {
    const media: CraftBlock[] = [];
    
    const traverse = (blocks: CraftBlock[]) => {
      blocks.forEach((block) => {
        if (['image', 'video', 'file'].includes(block.type)) {
          media.push(block);
        }
        if (block.content) {
          traverse(block.content);
        }
      });
    };
    
    traverse(blocks);
    return media;
  };

  const mediaBlocks = findMediaBlocks(blocks);

  if (mediaBlocks.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        🐛 Media Debug ({mediaBlocks.length})
      </button>
      
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-96 max-h-96 overflow-auto bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-bold">Media Blocks Found</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            {mediaBlocks.map((block, index) => (
              <div key={block.id || index} className="bg-gray-800 p-3 rounded text-xs">
                <div className="text-blue-400 font-bold mb-1">
                  {block.type.toUpperCase()} #{index + 1}
                </div>
                
                <div className="space-y-1 text-gray-300">
                  <div>
                    <span className="text-gray-500">ID:</span> {block.id}
                  </div>
                  
                  {block.url && (
                    <div className="break-all">
                      <span className="text-gray-500">URL:</span>{' '}
                      <a
                        href={block.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {block.url}
                      </a>
                    </div>
                  )}
                  
                  {block.markdown && (
                    <div className="break-all">
                      <span className="text-gray-500">Markdown:</span> {block.markdown.substring(0, 100)}
                    </div>
                  )}
                  
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <button
                      onClick={() => {
                        if (block.url) {
                          window.open(block.url, '_blank');
                        }
                      }}
                      className="text-blue-400 hover:text-blue-300 text-xs"
                      disabled={!block.url}
                    >
                      Test URL in new tab →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-700 text-gray-400 text-xs">
            Check browser console for load errors
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaDebugger;


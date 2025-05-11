
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  content?: React.ReactNode;
};

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Typography Guide: Making Your Content Shine',
    excerpt: 'A comprehensive guide to web typography and how to use it effectively.',
    date: 'May 10, 2025',
    content: (
      <div className="space-y-6">
        <img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" alt="Laptop with code" className="w-full h-64 object-cover rounded-lg mb-6" />
        
        <h1 className="text-4xl font-custom font-bold mb-4">Typography Guide: Making Your Content Shine</h1>
        <p className="text-gray-400 mb-6">May 10, 2025 • 8 min read</p>
        
        <h2 className="text-3xl font-bold mt-8 mb-4">Headings</h2>
        <p className="mb-4">Headings help structure your content and improve readability. Here are examples of different heading levels:</p>
        
        <div className="bg-[#222] p-6 rounded-lg mb-8">
          <h1 className="text-4xl font-custom font-bold mb-4">Heading 1</h1>
          <h2 className="text-3xl mb-4">Heading 2</h2>
          <h3 className="text-2xl mb-4">Heading 3</h3>
          <h4 className="text-xl mb-4">Heading 4</h4>
          <h5 className="text-lg mb-4">Heading 5</h5>
          <h6 className="text-base">Heading 6</h6>
        </div>
        
        <h2 className="text-3xl mt-8 mb-4">Color Palette</h2>
        <p className="mb-4">A consistent color palette helps establish visual harmony in your designs. Here's our recommended palette:</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-[#8B5CF6] text-white text-center">
            <span>#8B5CF6</span>
            <p className="text-xs mt-1">Vivid Purple</p>
          </div>
          <div className="p-4 rounded-lg bg-[#D946EF] text-white text-center">
            <span>#D946EF</span>
            <p className="text-xs mt-1">Magenta Pink</p>
          </div>
          <div className="p-4 rounded-lg bg-[#F97316] text-white text-center">
            <span>#F97316</span>
            <p className="text-xs mt-1">Bright Orange</p>
          </div>
          <div className="p-4 rounded-lg bg-[#0EA5E9] text-white text-center">
            <span>#0EA5E9</span>
            <p className="text-xs mt-1">Ocean Blue</p>
          </div>
          <div className="p-4 rounded-lg bg-[#403E43] text-white text-center">
            <span>#403E43</span>
            <p className="text-xs mt-1">Charcoal Gray</p>
          </div>
          <div className="p-4 rounded-lg bg-[#E5DEFF] text-gray-800 text-center">
            <span>#E5DEFF</span>
            <p className="text-xs mt-1">Soft Purple</p>
          </div>
          <div className="p-4 rounded-lg bg-[#FFDEE2] text-gray-800 text-center">
            <span>#FFDEE2</span>
            <p className="text-xs mt-1">Soft Pink</p>
          </div>
          <div className="p-4 rounded-lg bg-[#D3E4FD] text-gray-800 text-center">
            <span>#D3E4FD</span>
            <p className="text-xs mt-1">Soft Blue</p>
          </div>
        </div>
        
        <h2 className="text-3xl mt-8 mb-4">Left Navigation Padding Guide</h2>
        <p className="mb-4">Consistent padding in navigation elements creates visual rhythm and improves user experience:</p>
        
        <div className="bg-[#222] p-6 rounded-lg mb-8">
          <div className="mb-4">
            <strong>Sidebar Container:</strong> p-4 (padding: 1rem)
          </div>
          <div className="mb-4">
            <strong>Navigation Items:</strong> px-3 py-2 (horizontal: 0.75rem, vertical: 0.5rem)
          </div>
          <div>
            <strong>Section Spacing:</strong> mt-3 (margin-top: 0.75rem)
          </div>
        </div>
        
        <h2 className="text-3xl mt-8 mb-4">Paragraphs</h2>
        <p className="mb-4">Good typography starts with well-formatted paragraphs. Use adequate line height and spacing between paragraphs to improve readability.</p>
        <p className="mb-4">This is a second paragraph showing spacing between paragraphs. Notice how the space helps the reader's eyes rest between thoughts.</p>
        
        <h2 className="text-3xl mt-8 mb-4">Text Formatting</h2>
        <p className="mb-2"><strong>Bold text</strong> adds emphasis.</p>
        <p className="mb-2"><em>Italic text</em> can indicate special meaning.</p>
        <p className="mb-2"><u>Underlined text</u> draws attention (use sparingly).</p>
        <p className="mb-4"><code className="bg-[#333] px-1 py-0.5 rounded">Monospace text</code> is great for code snippets.</p>
        
        <h2 className="text-3xl mt-8 mb-4">Lists</h2>
        <p className="mb-4">Lists help organize information in scannable chunks:</p>
        
        <h3 className="text-2xl mb-2">Unordered List</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>First item</li>
          <li>Second item</li>
          <li>Third item with longer text that might wrap to multiple lines to demonstrate how the list formatting handles longer content</li>
        </ul>
        
        <h3 className="text-2xl mb-2">Ordered List</h3>
        <ol className="list-decimal pl-6 mb-6">
          <li>First step</li>
          <li>Second step</li>
          <li>Third step with more details and explanation</li>
        </ol>
        
        <h2 className="text-3xl mt-8 mb-4">Blockquotes</h2>
        <blockquote className="border-l-4 border-accent pl-4 italic mb-6">
          "Typography is what makes the invisible visible. Good typography enhances the character of the text without drawing attention to itself."
          <footer className="text-sm mt-2 text-gray-400">— Robert Bringhurst</footer>
        </blockquote>
        
        <h2 className="text-3xl mt-8 mb-4">Images with Captions</h2>
        <figure className="mb-6">
          <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6" alt="Code on screen" className="w-full rounded-lg" />
          <figcaption className="text-sm text-center mt-2 text-gray-400">Code displayed on a monitor, showcasing programming syntax highlighted with different colors.</figcaption>
        </figure>
        
        <h2 className="text-3xl mt-8 mb-4">Conclusion</h2>
        <p>
          Typography is a fundamental aspect of web design that impacts readability, user experience, and overall aesthetic. 
          By applying these typography principles consistently, you can create more engaging and readable content.
        </p>
      </div>
    )
  },
  {
    id: 2,
    title: 'Building Responsive Interfaces with Tailwind CSS',
    excerpt: 'Learn how to create beautiful, responsive designs using Tailwind CSS.',
    date: 'May 8, 2025',
  },
  {
    id: 3,
    title: 'React Hooks: A Deep Dive',
    excerpt: 'Understanding React hooks and how they can simplify your components.',
    date: 'May 5, 2025',
  },
  {
    id: 4,
    title: 'The Future of Web Development',
    excerpt: 'Exploring upcoming trends and technologies in web development.',
    date: 'May 1, 2025',
  },
];

const Writing = () => {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const selectedBlog = selectedPost !== null ? blogPosts.find(post => post.id === selectedPost) : null;
  
  const handleNextPost = () => {
    if (selectedPost !== null) {
      const currentIndex = blogPosts.findIndex(post => post.id === selectedPost);
      if (currentIndex < blogPosts.length - 1) {
        setSelectedPost(blogPosts[currentIndex + 1].id);
      } else {
        setSelectedPost(blogPosts[0].id);
      }
    }
  };
  
  const handlePreviousPost = () => {
    if (selectedPost !== null) {
      const currentIndex = blogPosts.findIndex(post => post.id === selectedPost);
      if (currentIndex > 0) {
        setSelectedPost(blogPosts[currentIndex - 1].id);
      } else {
        setSelectedPost(blogPosts[blogPosts.length - 1].id);
      }
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      if (position > 180) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-portfolio-dark text-white">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-56">
        {selectedBlog && isScrolled && (
          <div 
            className="fixed top-0 left-56 right-0 bg-portfolio-dark/90 backdrop-blur-sm z-10 px-4 py-3 border-b border-[#333] transition-opacity duration-300"
          >
            <div className="max-w-3xl mx-auto flex justify-between items-center">
              <h2 className="font-medium">{selectedBlog.title}</h2>
              <span className="text-sm text-gray-400">{selectedBlog.date}</span>
            </div>
          </div>
        )}
        
        <div className="max-w-3xl mx-auto py-10 px-4">
          {selectedBlog ? (
            <div className="animate-fade-in">
              {selectedBlog.content || (
                <div>
                  <h1 className="text-4xl font-bold mb-4">{selectedBlog.title}</h1>
                  <p className="text-gray-400 mb-6">{selectedBlog.date} • Blog post</p>
                  <p className="text-lg mb-6">{selectedBlog.excerpt}</p>
                  <p className="text-lg">This is a placeholder for the full blog content.</p>
                </div>
              )}
              
              <div className="mt-12 border-t border-[#333] pt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={handlePreviousPost} className="cursor-pointer" />
                    </PaginationItem>
                    <PaginationItem className="flex-1" />
                    <PaginationItem>
                      <PaginationNext onClick={handleNextPost} className="cursor-pointer" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-custom font-bold mb-6">Writing</h1>
              <div className="space-y-6">
                {blogPosts.map((post) => (
                  <div 
                    key={post.id}
                    className="border border-[#333] rounded-lg p-4 cursor-pointer hover:bg-[#222] transition-colors"
                    onClick={() => setSelectedPost(post.id)}
                  >
                    <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                    <p className="text-gray-400 text-sm mb-3">{post.date}</p>
                    <p className="text-gray-300">{post.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Writing;

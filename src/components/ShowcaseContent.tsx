
import React from 'react';
import { Card, CardContent } from './ui/card';

interface ShowcaseItem {
  id: number;
  title: string;
  subtext: string;
  media: {
    type: 'image' | 'video';
    src: string;
    alt?: string;
  };
}

const ShowcaseContent = () => {
  const showcaseItems: ShowcaseItem[] = [
    {
      id: 1,
      title: "Project Alpha",
      subtext: "A modern web application built with React and TypeScript",
      media: {
        type: 'image',
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        alt: "Project Alpha"
      }
    },
    {
      id: 2,
      title: "Design System",
      subtext: "Comprehensive design system for scalable UI components",
      media: {
        type: 'image',
        src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
        alt: "Design System"
      }
    },
    {
      id: 3,
      title: "Mobile App",
      subtext: "Native mobile experience with smooth animations",
      media: {
        type: 'video',
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      }
    },
    {
      id: 4,
      title: "Brand Identity",
      subtext: "Complete brand identity and visual language design",
      media: {
        type: 'image',
        src: "https://images.unsplash.com/photo-1561070791-37d14d6b1eef?w=800&h=600&fit=crop",
        alt: "Brand Identity"
      }
    }
  ];

  const ShowcaseCard = ({ item }: { item: ShowcaseItem }) => (
    <Card className="bg-portfolio-dark border border-[#333] hover:border-[#555] transition-colors overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-video overflow-hidden bg-[#0a0a0a]">
          {item.media.type === 'image' ? (
            <img
              src={item.media.src}
              alt={item.media.alt || item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={item.media.src}
              className="w-full h-full object-cover"
              controls
              muted
              loop
            />
          )}
        </div>
        <div className="p-4 bg-portfolio-dark">
          <h3 className="text-white font-semibold text-xl mb-2">{item.title}</h3>
          <p className="text-gray-400 text-base">{item.subtext}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-custom font-bold mb-6">Showcase</h1>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mt-8">
          {showcaseItems.map((item) => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowcaseContent;


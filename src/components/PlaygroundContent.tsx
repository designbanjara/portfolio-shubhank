import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from './ui/badge';

interface PlaygroundItem {
  id: string;
  title: string;
  image?: string;
  tags: string[];
  href?: string;
}

const playgroundItems: PlaygroundItem[] = [
  {
    id: 'bellandur-traffic',
    title: 'Story of my experiments with Bellandur Traffic',
    tags: ['Data viz'],
    href: '/playground/bellandur-traffic',
  },
  {
    id: '2',
    title: 'Playground Item 2',
    tags: ['Prototype', 'Motion'],
  },
  {
    id: '3',
    title: 'Playground Item 3',
    tags: ['Concept', 'Design'],
  },
];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.44, 0, 0.56, 1] } },
};

const CardInner: React.FC<{ item: PlaygroundItem }> = ({ item }) => (
  <div className="flex flex-col">
    <div className="w-full rounded-lg bg-muted flex-shrink-0 overflow-hidden mb-4">
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
          style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
        />
      ) : (
        <div className="w-full h-56 flex items-center justify-center text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>
      )}
    </div>
    <h2 className="text-xl font-custom font-bold text-foreground leading-tight">{item.title}</h2>
    {item.tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-3">
        {item.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80">
            {tag}
          </Badge>
        ))}
      </div>
    )}
  </div>
);

const PlaygroundContent = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-custom font-bold mb-6">Playground</h1>

      <motion.div
        className="mt-10 divide-y divide-border"
        variants={shouldReduceMotion ? undefined : listVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
      >
        {playgroundItems.map((item, idx) => (
          <motion.div
            key={item.id}
            className={`py-10 ${idx === 0 ? 'pt-0' : ''}`}
            variants={shouldReduceMotion ? undefined : itemVariants}
          >
            {item.href ? (
              <Link
                to={item.href}
                className="block group transition-all duration-200"
                style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
              >
                <CardInner item={item} />
              </Link>
            ) : (
              <div className="block group">
                <CardInner item={item} />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PlaygroundContent;

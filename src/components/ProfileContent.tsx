import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SocialLinks from './SocialLinks';
import { EASE, DURATION, STAGGER } from '@/lib/motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER,
      delayChildren: 0,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE.out },
  },
};

const ProfileContent = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      <motion.h1
        id="hello-heading"
        className="text-3xl font-custom font-bold mb-6"
        variants={shouldReduceMotion ? undefined : itemVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
      >
        Hello
      </motion.h1>

      <motion.div
        className="space-y-4"
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <motion.p
          className="text-base max-w-[60ch]"
          variants={shouldReduceMotion ? undefined : itemVariants}
        >
          I'm Shubhank. I'm a digital designer, based out of Bangalore, India.
          I'm currently designing products at{' '}
          <a href="https://www.phonepe.com/" target="_blank" rel="noopener noreferrer">
            PhonePe
          </a>.
        </motion.p>

        <motion.p
          className="text-base max-w-[60ch]"
          variants={shouldReduceMotion ? undefined : itemVariants}
        >
          Before PhonePe, I spent couple of years designing at{' '}
          <a href="https://razorpay.com/" target="_blank" rel="noopener noreferrer">
            Razorpay
          </a>. Majorly working on their mobile app and merchant experience.
        </motion.p>

        <motion.p
          className="text-base max-w-[60ch]"
          variants={shouldReduceMotion ? undefined : itemVariants}
        >
          I have also designed experiences for social media, HR-tech and mobility domains.
        </motion.p>

        <motion.p
          className="text-base max-w-[60ch]"
          variants={shouldReduceMotion ? undefined : itemVariants}
        >
          I plan to write honestly about Design, AI in Design, and the industry in India.
        </motion.p>

        <motion.div variants={shouldReduceMotion ? undefined : itemVariants}>
          <SocialLinks />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileContent;

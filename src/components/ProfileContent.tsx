import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SocialLinks from './SocialLinks';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.44, 0, 0.56, 1] },
  },
};

const ProfileContent = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <motion.h1
        className="text-3xl font-custom font-bold mb-6"
        variants={shouldReduceMotion ? undefined : itemVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
      >
        Shubhank Pawar
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
          Hey, I'm Shubhank. I'm a digital designer, based out of Bangalore, India.
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

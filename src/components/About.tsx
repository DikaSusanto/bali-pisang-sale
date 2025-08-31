"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { HiShieldCheck, HiHeart } from 'react-icons/hi';
import { FaLeaf } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariant = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.25, 0, 1],
    },
  },
};

const badgeVariant = {
  hidden: { scale: 0, rotate: -10, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.8,
    },
  },
};

export default function About() {
  const { t } = useLanguage();
  
  const features = [
    { icon: <HiShieldCheck />, text: t('about.feature1') },
    { icon: <FaLeaf />, text: t('about.feature2') },
    { icon: <HiHeart />, text: t('about.feature3') }
  ];

  return (
    <motion.section
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.1 }}
      className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 py-12 lg:px-24 bg-gray-50/50"
      id="about"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 bg-primary/5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Left Content */}
      <motion.div
        variants={itemVariant}
        className="relative flex justify-center lg:justify-start order-2 lg:order-1"
      >
        {/* Floating Quality Badge */}
        <motion.div
          variants={badgeVariant}
          className="absolute -top-4 -right-4 bg-white shadow-lg rounded-full p-3 border border-gray-100 hidden lg:block z-10"
          whileHover={{ scale: 1.1, rotate: 10 }}
        >
          <HiShieldCheck className="text-primary text-xl" />
        </motion.div>

        {/* Product Image with Enhanced Animation */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.03, rotate: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Subtle Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-yellow-400/10 rounded-2xl blur-xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <Image
            src="/img/1685365207366.png"
            alt="Premium Pisang Sale Product"
            width={400}
            height={400}
            className="relative z-10 w-full max-w-md rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          />
        </motion.div>
      </motion.div>

      {/* Right Content */}
      <motion.div
        variants={itemVariant}
        className="space-y-6 text-center order-1 lg:order-2 relative z-10"
      >
        {/* Section Badge */}
        <motion.div
          variants={badgeVariant}
          className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaLeaf />
          </motion.div>
          {t('about.badge')}
        </motion.div>

        {/* Main Title */}
        <motion.h2
          variants={itemVariant}
          className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight"
        >
          <motion.span
            className="bg-gradient-to-r from-primary to-yellow-700 bg-clip-text text-transparent"
            whileHover={{ scale: 1.02 }}
          >
            {t('about.title1')}
          </motion.span>
          <br />
          {t('about.title2')}
        </motion.h2>

        {/* Feature Icons Row - Now consistently centered */}
        <motion.div
          variants={itemVariant}
          className="flex justify-center gap-4 py-2"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 cursor-default"
              whileHover={{ y: -3, scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <div className="text-primary text-xl group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <span className="text-xs font-medium text-gray-600 group-hover:text-primary transition-colors">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Description - Now centered on all screen sizes */}
        <motion.p
          variants={itemVariant}
          className="text-gray-600 leading-relaxed max-w-md mx-auto"
        >
          {t('about.description')}
          <motion.span
            className="text-primary font-medium"
            whileHover={{ scale: 1.05 }}
          >
            {" "}{t('about.descriptionHighlight')}
          </motion.span>
        </motion.p>

        {/* Enhanced Button */}
        <motion.div variants={itemVariant}>
          <Link
            href="/about"
            className="group relative inline-flex items-center gap-2 bg-primary hover:bg-yellow-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('about.learnMore')}
              <motion.div
                className="group-hover:translate-x-1 transition-transform"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                →
              </motion.div>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
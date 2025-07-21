"use client";

import { motion } from "framer-motion";
import Image from 'next/image';

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariant = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center gap-6 px-4 py-12 lg:px-24"
      id="home"
    >
      <div className="space-y-4">
        {/* 3. Apply the item variant to each child you want to animate */}
        <motion.h1
          variants={itemVariant}
          className="text-4xl lg:text-6xl font-semibold text-yellow-800 leading-tight"
        >
          Bali Pisang Sale
        </motion.h1>
        <motion.h2
          variants={itemVariant}
          className="text-xl lg:text-4xl text-gray-800 font-bold"
        >
          The #1 Leading Pisang <br /> Sale Producer in Bali
        </motion.h2>
        <motion.div variants={itemVariant}>
          <button
            onClick={() => scrollToSection('menu')}
            className="inline-block bg-yellow-800 hover:bg-yellow-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200"
          >
            View Menu
          </button>
        </motion.div>
      </div>
      <motion.div
        variants={itemVariant}
        className="flex justify-center lg:justify-end"
      >
        <Image
          src="/img/1685364484811.png"
          alt="Pisang Sale Product"
          width={500}
          height={500}
          className="w-full max-w-xl"
          priority
        />
      </motion.div>
    </motion.section>
  );
}
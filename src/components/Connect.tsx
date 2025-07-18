"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

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
      ease: 'easeOut',
    },
  },
};

export default function Connect() {
  return (
    <motion.section
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      className="flex flex-col md:flex-row items-center justify-around px-4 py-12 lg:px-24 gap-6"
    >
      <motion.div variants={itemVariant} className="text-center md:text-left">
        <span className="text-yellow-800 font-medium text-lg">Interested?</span>
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 mt-2">
          Order now
        </h2>
      </motion.div>
      <motion.div variants={itemVariant}>
        <Link
          href="/order"
          className="bg-yellow-800 hover:bg-yellow-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 mt-4 md:mt-0"
        >
          Order
        </Link>
      </motion.div>
    </motion.section>
  );
}
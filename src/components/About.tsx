"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';

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

export default function About() {
  return (
    <motion.section
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center px-4 py-12 lg:px-24"
      id="about"
    >
      <motion.div
        variants={itemVariant}
        className="flex justify-center lg:justify-start order-2 lg:order-1"
      >
        <Image
          src="/img/1685365207366.png"
          alt="Pisang Sale Product"
          width={400}
          height={400}
          className="w-full max-w-md rounded-lg"
        />
      </motion.div>
      <motion.div
        variants={itemVariant}
        className="space-y-4 text-center lg:text-left order-1 lg:order-2"
      >
        <span className="text-primary font-medium text-lg">About Us</span>
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 leading-tight">
          Hygienic, No Preservatives, <br /> Unsweetened
        </h2>
        <p className="text-gray-600 text-sm lg:text-base leading-relaxed my-3">
          We guarantee our products to be hygienic. More so, we insist on keeping our Sale untouched by preservatives and additional sweeteners.
        </p>
        <motion.div variants={itemVariant}>
          <Link
            href="#"
            className="inline-block bg-primary hover:bg-yellow-800 text-white px-5 py-2.5 rounded-lg transition-colors duration-200"
          >
            Learn More
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
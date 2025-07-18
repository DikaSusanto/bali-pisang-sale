"use client"
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center gap-6 px-4 py-12 lg:px-24"
      id="home"
    >
      <div className="space-y-4">
        <h1 className="text-4xl lg:text-6xl font-semibold text-yellow-800 leading-tight">
          Bali Pisang Sale
        </h1>
        <h2 className="text-xl lg:text-4xl text-gray-800 font-bold">
          The #1 Leading Pisang <br /> Sale Producer in Bali
        </h2>
        <Link 
          href="#menu" 
          className="inline-block bg-yellow-800 hover:bg-yellow-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200"
        >
          View Menu
        </Link>
      </div>
      <div className="flex justify-center lg:justify-end">
        <Image
          src="/img/1685364484811.png"
          alt="Pisang Sale Product"
          width={500}
          height={500}
          className="w-full max-w-xl"
          priority
        />
      </div>
    </motion.section>
  );
}
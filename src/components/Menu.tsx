"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { HiShoppingCart } from 'react-icons/hi';

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

export default function Menu() {
  const menuItems = [
    {
      id: 1,
      name: 'Pisang Sale',
      size: '250 gr',
      price: 'IDR 45K',
      image: '/img/1685364484811.png',
    },
    {
      id: 2,
      name: 'Pisang Sale',
      size: '100 gr',
      price: 'IDR 20K',
      image: '/img/1685364484811.png',
    },
    {
      id: 3,
      name: 'Pisang Sale Special',
      size: '300 gr',
      price: 'IDR 50K',
      image: '/img/1685364484811.png',
    }
  ];

  return (
    <motion.section
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      className="px-4 py-12 lg:px-24"
      id="menu"
    >
      <motion.div
        variants={itemVariant}
        className="text-center mb-8"
      >
        <span className="text-primary font-medium text-lg">Menu</span>
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 mt-2">
          Variety of Options to Choose From
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariant}
            className="relative mt-8 bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
          >
            <div className="w-full mb-4">
              <Link href={`/order`}>
                <Image
                  src={item.image}
                  alt={`${item.name} ${item.size}`}
                  width={200}
                  height={200}
                  className="w-full h-48 object-contain"
                />
              </Link>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h2>
            <h3 className="text-base font-normal text-gray-600 mb-2">{item.size}</h3>
            <span className="text-sm font-medium text-gray-800 mb-4">{item.price}</span>
            <button className="absolute top-0 right-0 bg-primary hover:bg-yellow-800 text-white p-2 rounded-tl-none rounded-tr-lg rounded-bl-lg rounded-br-none transition-colors">
              <HiShoppingCart className="text-xl" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
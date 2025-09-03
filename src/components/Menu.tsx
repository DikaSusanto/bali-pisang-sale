"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { HiShoppingCart } from 'react-icons/hi';
import { useState } from 'react';
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
      duration: 0.7,
      ease: [0.25, 0.25, 0, 1],
    },
  },
};

const cardVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Menu() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const { t } = useLanguage();

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
      viewport={{ amount: 0.1 }}
      className="px-4 py-12 lg:px-24 bg-gray-50/30"
      id="menu"
    >
      <motion.div
        variants={itemVariant}
        className="text-center mb-12"
      >
        <motion.span
          className="text-primary font-medium text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Menu
        </motion.span>
        <motion.h2
          className="text-2xl lg:text-4xl font-bold text-gray-800 mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {t('menu.sectionSubtitle')}
        </motion.h2>
        <motion.div
          className="w-24 h-1 bg-gradient-to-r from-primary to-yellow-400 mx-auto mt-4 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariant}
            className="relative group cursor-pointer"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Main Card */}
            <motion.div
              className="relative bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col items-center overflow-hidden transition-all duration-300"
              style={{
                background: hoveredItem === item.id
                  ? "linear-gradient(135deg, #ffffff 0%, #fefce8 100%)"
                  : "#ffffff"
              }}
            >
              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 to-yellow-400/5 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Image Container */}
              <motion.div
                className="relative w-full mb-6 group-hover:scale-105 transition-transform duration-300"
                whileHover={{ rotate: [0, 1, -1, 0] }}
                transition={{ duration: 0.5 }}
              >
                  <motion.div
                    animate={{
                      y: hoveredItem === item.id ? [-5, 5, -5] : [0, -3, 0]
                    }}
                    transition={{
                      duration: hoveredItem === item.id ? 2 : 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={`${item.name} ${item.size}`}
                      width={200}
                      height={200}
                      className="w-full h-48 object-contain drop-shadow-lg"
                    />
                  </motion.div>

                {/* Subtle Sparkle Effect on Hover */}
                {hoveredItem === item.id && (
                  <motion.div className="absolute inset-0">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                        style={{
                          left: `${30 + i * 25}%`,
                          top: `${20 + i * 20}%`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Content */}
              <div className="relative z-10 text-center w-full">
                <motion.h2
                  className="text-xl font-bold text-gray-800 mb-1"
                  animate={{
                    color: hoveredItem === item.id ? "#eab308" : "#1f2937"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.h2>

                <motion.h3
                  className="text-base font-normal text-gray-600 mb-3"
                  animate={{
                    scale: hoveredItem === item.id ? 1.05 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.size}
                </motion.h3>

                <motion.div
                  className="text-lg font-bold text-primary mb-4"
                  animate={{
                    scale: hoveredItem === item.id ? 1.1 : 1
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.price}
                </motion.div>
              </div>

              {/* Enhanced Add to Cart Button */}
              <motion.button
                className="absolute top-4 right-4 bg-primary hover:bg-yellow-800 text-white p-3 rounded-xl transition-all duration-300 shadow-lg group/btn"
                whileHover={{
                  scale: 1.1,
                  rotate: 12,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  y: hoveredItem === item.id ? -2 : 0,
                }}
              >
                <motion.div
                  animate={{
                    rotate: hoveredItem === item.id ? [0, 15, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <HiShoppingCart className="text-lg group-hover/btn:scale-110 transition-transform" />
                </motion.div>

                {/* Button Ripple Effect */}
                <motion.div
                  className="absolute inset-0 bg-yellow-600 rounded-xl"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.5, opacity: 0.2 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Subtle Call to Action */}
      <motion.div
        variants={itemVariant}
        className="text-center mt-12"
      >
      </motion.div>
    </motion.section>
  );
}
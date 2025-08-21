"use client";

import { HiPhone, HiGlobe, HiArrowRight } from 'react-icons/hi';
import { useState } from 'react';
import { motion } from 'framer-motion';

const orderingOptions = [
  {
    id: 'website',
    title: 'Pre-Order Online',
    description: 'Secure pre-order system with email confirmation',
    icon: HiGlobe,
    action: () => window.location.href = '/order',
    color: 'bg-primary hover:bg-yellow-800',
  },
  {
    id: 'social',
    title: 'Direct Order',
    description: 'Instant chat via WhatsApp',
    icon: HiPhone,
    action: () => window.open('https://wa.me/6281353018130', '_blank'),
    color: 'bg-amber-700 hover:bg-amber-800',
  },
];

export default function Connect() {
  const [hoveredOrderButton, setHoveredOrderButton] = useState<string | null>(null);

  return (
    <>
      <div id="order" className="h-0" />
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.01 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-2xl mx-auto py-12"
      >
        <motion.div className="text-center mb-8">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
            Ready to Order?
          </h3>
          <p className="text-gray-600 text-sm">
            Choose your preferred way to get your delicious Pisang Sale
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orderingOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <motion.button
                key={option.id}
                className={`group relative ${option.color} text-white p-6 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden`}
                onClick={option.action}
                onMouseEnter={() => setHoveredOrderButton(option.id)}
                onMouseLeave={() => setHoveredOrderButton(null)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.2, duration: 1 }}
              >
                {/* Background Animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-lg font-bold mb-1">{option.title}</div>
                    <div className="text-sm opacity-90">{option.description}</div>
                  </div>

                  <motion.div
                    className="flex items-center gap-2"
                    animate={{
                      x: hoveredOrderButton === option.id ? 5 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <IconComponent className="text-2xl" />
                    <motion.div
                      animate={{
                        x: hoveredOrderButton === option.id ? [0, 5, 0] : 0
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <HiArrowRight className="text-xl" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Button Ripple Effect */}
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-xl"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 2, opacity: 0.1 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.button>
            );
          })}
        </div>
      </motion.section>
    </>
  );
}
"use client";

import { HiCube, HiTruck, HiMail, HiArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

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

const serviceCardVariant = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Services() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const services = [
    {
      id: 1,
      icon: HiCube,
      title: 'Place Pre-Order',
      description: 'Submit your order details with estimated shipping costs. No payment required yet!',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      delay: 0.2,
    },
    {
      id: 2,
      icon: HiMail,
      title: 'Order Confirmation',
      description: 'We confirm product availability & final shipping costs, then email you a secure payment link within 24 hours',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      delay: 0.4,
    },
    {
      id: 3,
      icon: HiTruck,
      title: 'Safe Delivery',
      description: 'Once payment is completed, we carefully package and ship your fresh Pisang Sale to your doorstep',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      delay: 0.6,
    },
  ];

  return (
    <motion.section
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.01 }}
      className="px-4 pb-8 lg:px-24 bg-gradient-to-b from-white to-gray-50/50"
      id="services"
    >
      {/* Header */}
      <motion.div variants={itemVariant} className="text-center mb-16">
        <motion.span
          className="text-primary font-medium text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          How It Works
        </motion.span>
        <motion.h2
          className="text-2xl lg:text-4xl font-bold text-gray-800 mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Our Pre-Order Process Made Simple
        </motion.h2>
        <motion.div
          className="w-24 h-1 bg-gradient-to-r from-primary to-yellow-400 mx-auto mt-4 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <motion.div
              key={service.id}
              variants={serviceCardVariant}
              className="relative group cursor-default"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Service Card */}
              <motion.div
                className={`relative p-8 rounded-2xl text-center overflow-hidden transition-all duration-300 ${hoveredService === service.id ? service.bgColor : 'bg-white'
                  } shadow-md hover:shadow-xl border border-gray-100`}
              >
                {/* Animated Background Gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Step Number */}
                <motion.div
                  className="absolute top-4 left-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: service.delay,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                >
                  {index + 1}
                </motion.div>

                {/* Connecting Line */}
                {index < services.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300"
                    initial={{ width: 0 }}
                    animate={{ width: 32 }}
                    transition={{ delay: service.delay + 0.5, duration: 0.8 }}
                  />
                )}

                {/* Icon with Enhanced Animation */}
                <motion.div
                  className="flex justify-center mb-6 relative"
                  animate={{
                    y: hoveredService === service.id ? [0, -8, 0] : [0, -4, 0]
                  }}
                  transition={{
                    duration: hoveredService === service.id ? 1.5 : 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Icon Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                  />

                  <motion.div
                    whileHover={{
                      rotate: [0, -10, 10, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconComponent className="text-7xl text-primary relative z-10" />
                  </motion.div>

                  {/* Floating Particles */}
                  {hoveredService === service.id && (
                    <motion.div className="absolute inset-0">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-primary rounded-full"
                          style={{
                            left: `${25 + i * 20}%`,
                            top: `${30 + (i % 2) * 40}%`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 0.8, 0],
                            y: [0, -20, -40],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </motion.div>

                {/* Content */}
                <motion.h3
                  className="text-xl font-bold text-gray-800 mb-3"
                  animate={{
                    color: hoveredService === service.id ? "#eab308" : "#1f2937"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {service.title}
                </motion.h3>

                <motion.p
                  className="text-gray-600 text-sm leading-relaxed"
                  animate={{
                    scale: hoveredService === service.id ? 1.02 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {service.description}
                </motion.p>

                {/* Progress Indicator */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-yellow-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: hoveredService === service.id ? "100%" : "0%"
                  }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Call to Action */}
      <motion.div
        variants={itemVariant}
        className="text-center"
      >
        <Link
          href="/how-it-works"
          className="group inline-flex items-center gap-2 text-primary hover:text-yellow-800 transition-colors duration-200 font-medium"
        >
          Learn more about our process
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <HiArrowRight className="text-lg" />
          </motion.div>
        </Link>
      </motion.div>
    </motion.section>
  );
}
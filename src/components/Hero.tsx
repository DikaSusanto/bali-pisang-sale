"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { HiPlay, HiStar, HiLocationMarker, HiHeart } from 'react-icons/hi';

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
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

const floatingVariant = {
  hidden: { y: 0, opacity: 0 },
  visible: {
    y: [0, -10, 0],
    opacity: 1,
    transition: {
      y: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
      opacity: {
        duration: 0.5,
      },
    },
  },
};

const badgeVariant = {
  hidden: { scale: 0, rotate: -180, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 1.2,
    },
  },
};

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  // Spring animations for smooth mouse following
  const springConfig = { stiffness: 150, damping: 15 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      setMousePosition({ x: clientX, y: clientY });
      mouseX.set(clientX - innerWidth / 2);
      mouseY.set(clientY - innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const badges = [
    { icon: <HiStar />, text: "#1 in Bali", position: "top-16 right-20" },
    { icon: <HiHeart />, text: "Made with Love", position: "bottom-32 left-12" },
    { icon: <HiLocationMarker />, text: "100% Local", position: "top-32 left-16" },
  ];

  return (
    <motion.section
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.1 }}
      className="relative w-full min-h-screen overflow-hidden bg-white pt-10"
      id="home"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-yellow-400/10 rounded-full"
          animate={{
            scale: [1, 0.8, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-4 py-12 lg:px-24 min-h-screen">
        {/* Left Content */}
        <div className="space-y-8">
          {/* Hero Badge */}
          <motion.div
            variants={badgeVariant}
            className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <HiStar className="text-yellow-500" />
            </motion.div>
            Bali's Authentic Pisang Sale Experience
          </motion.div>

          {/* Main Title with Gradient */}
          <motion.h1
            variants={itemVariant}
            className="text-5xl lg:text-7xl font-bold leading-tight"
          >
            <motion.span
              className="block bg-gradient-to-r from-primary via-yellow-700 to-primary bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Bali Pisang
            </motion.span>
            <motion.span
              className="block text-gray-800 mt-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Sale
            </motion.span>
          </motion.h1>

          {/* Subtitle with Typewriter Effect */}
          <motion.h2
            variants={itemVariant}
            className="text-xl lg:text-3xl text-gray-700 font-semibold leading-relaxed"
          >
            The <motion.span
              className="text-primary font-bold relative"
              whileHover={{ scale: 1.1 }}
            >
              #1 Leading
            </motion.span> Pisang <br />
            Sale Producer in Bali
          </motion.h2>

          {/* Stats Row */}
          <motion.div
            variants={itemVariant}
            className="flex flex-wrap gap-8 text-center lg:text-left"
          >
            {[
              { number: "7+", label: "Years" },
              { number: "2K+", label: "Happy Customers" },
              { number: "100%", label: "Natural" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, y: -5 }}
                className="cursor-default"
              >
                <motion.div
                  className="text-2xl lg:text-3xl font-bold text-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 + index * 0.2, type: "spring" }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Buttons */}
          <motion.div
            variants={itemVariant}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              onClick={() => scrollToSection('menu')}
              className="group relative flex justify-center items-center bg-primary hover:bg-yellow-800 text-white px-8 py-4 rounded-xl font-medium overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                View Menu
                <motion.div
                  className="group-hover:translate-x-1 transition-transform"
                  animate={{ x: [0, 5, 0] }}
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
            </motion.button>

            <motion.button
              className="group border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 justify-center"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open('https://youtu.be/nERYMGpFgBs?si=4TzOv2PCjGlqhHCN', '_blank')}
            >
              <HiPlay className="group-hover:scale-110 transition-transform" />
              Watch Story
            </motion.button>
          </motion.div>
        </div>

        {/* Right Content - Enhanced Image Section */}
        <motion.div
          variants={itemVariant}
          className="relative flex justify-center lg:justify-end"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Floating Badges */}
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              variants={floatingVariant}
              className={`absolute ${badge.position} hidden lg:flex items-center gap-2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200/50`}
              style={{
                y: useTransform(y, [0, 300], [0, index % 2 === 0 ? -10 : 10]),
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="text-primary">{badge.icon}</span>
              {badge.text}
            </motion.div>
          ))}

          {/* Main Product Image with 3D Effect */}
          <motion.div
            className="relative"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-yellow-400/20 rounded-full blur-3xl"
              animate={{
                scale: isHovered ? 1.2 : 1,
                opacity: isHovered ? 0.6 : 0.3,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Product Image */}
            <motion.div
              className="relative z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/img/1685364484811.png"
                alt="Premium Pisang Sale Product"
                width={600}
                height={600}
                className="w-full max-w-2xl drop-shadow-2xl"
                priority
              />
            </motion.div>

            {/* Interactive Particles */}
            <motion.div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/30 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 3) * 20}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
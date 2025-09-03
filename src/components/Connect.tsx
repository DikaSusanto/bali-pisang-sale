"use client";

import { HiPhone, HiArrowRight } from 'react-icons/hi';
import { FaGlobe } from 'react-icons/fa';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

export default function Connect() {
  const [hoveredOrderButton, setHoveredOrderButton] = useState<string | null>(null);
  const { t } = useLanguage();

  const orderingOptions = [
    {
      id: 'website',
      title: t('connect.preOrder'),
      description: t('connect.preOrderDesc'),
      icon: FaGlobe,
      action: () => window.location.href = '/order',
      color: 'bg-primary hover:bg-yellow-800',
    },
    {
      id: 'social',
      title: t('connect.directOrder'),
      description: t('connect.directOrderDesc'),
      icon: HiPhone,
      action: () => window.open('https://wa.me/6281353018130', '_blank'),
      color: 'bg-amber-700 hover:bg-amber-800',
    },
  ];

  // Partners data with logo placeholders - exactly 4 items
  const partners = [
    { 
      name: 'Pepito', 
      type: 'Supermarket',
      logo: '/logos/pepito.png',
      fallbackColor: 'from-red-400 to-red-600'
    },
    { 
      name: 'Happy Mie', 
      type: 'Restaurant',
      logo: '/logos/happy-mie.jpg',
      fallbackColor: 'from-orange-400 to-orange-600'
    },
    { 
      name: 'Joger', 
      type: 'Souvenir Shop',
      logo: '/logos/joger.png',
      fallbackColor: 'from-green-400 to-green-600'
    },
    { 
      name: 'Griya Bugar', 
      type: 'Shiatsu and Spa',
      logo: '/logos/griya-bugar.png',
      fallbackColor: 'from-blue-400 to-blue-600'
    },
  ];

  // Duplicate partners for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  // Component to handle logo with fallback - bigger size, no frame
  const PartnerLogo = ({ partner }: { partner: typeof partners[0] }) => {
    const [imageError, setImageError] = useState(false);
    
    if (imageError) {
      // Fallback to gradient with first letter - bigger size
      return (
        <div className={`w-20 h-20 bg-gradient-to-br ${partner.fallbackColor} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
          <span className="text-white font-bold text-2xl">
            {partner.name.charAt(0)}
          </span>
        </div>
      );
    }

    return (
      <div className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          width={60}
          height={60}
          className="object-contain rounded-lg"
          onError={() => setImageError(true)}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>
    );
  };

  return (
    <>
      <div id="order" className="h-0" />
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.01 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-4xl mx-auto py-12"
      >
        <motion.div className="text-center mb-8">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
            {t('connect.title')}
          </h3>
          <p className="text-gray-600 text-sm">
            {t('connect.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
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

        {/* Partners Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.01 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-center"
        >
          <motion.h4 
            className="text-lg font-semibold text-gray-800 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {t('connect.alsoAvailable')}
          </motion.h4>
          <motion.p 
            className="text-gray-600 text-sm mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            {t('connect.availableAt')}
          </motion.p>

          {/* Moving Partners Belt */}
          <div className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-white rounded-2xl py-8 border border-gray-100">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-white to-transparent z-10" />
            
            {/* Moving Belt */}
            <motion.div
              className="flex gap-12 items-center"
              animate={{
                x: [0, -800], 
              }}
              transition={{
                duration: 15, // Slower for better visibility
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ width: 'fit-content' }}
            >
              {duplicatedPartners.map((partner, index) => (
                <motion.div
                  key={`${partner.name}-${index}`}
                  className="flex-shrink-0 text-center group cursor-default"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Partner Card */}
                  <div className="bg-transparent p-4 min-w-[180px]">
                    {/* Logo */}
                    <PartnerLogo partner={partner} />
                    <h5 className="font-semibold text-gray-800 text-base mb-1">
                      {partner.name}
                    </h5>
                    <p className="text-sm text-gray-500">
                      {partner.type}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </>
  );
}
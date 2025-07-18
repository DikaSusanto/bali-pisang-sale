"use client";
import { HiCube, HiTruck, HiBadgeCheck } from 'react-icons/hi';
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

export default function Services() {
  const services = [
    {
      id: 1,
      icon: <HiCube className="text-8xl text-yellow-800" />,
      title: 'You Order',
      description: 'Order now by contacting us through our socials!',
    },
    {
      id: 2,
      icon: <HiTruck className="text-8xl text-yellow-800" />,
      title: 'Shipping',
      description:
        'Products safely shipped to your house or any specified location',
    },
    {
      id: 3,
      icon: <HiBadgeCheck className="text-8xl text-yellow-800" />,
      title: 'Delivered',
      description: 'We guarantee our products are safely delivered',
    },
  ];

  return (
    <motion.section
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      className="px-4 py-12 lg:px-24"
      id="services"
    >
      <motion.div variants={itemVariant} className="text-center mb-8">
        <span className="text-yellow-800 font-medium text-lg">Services</span>
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 mt-2">
          We provide best food services
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {services.map((service) => (
          <motion.div
            key={service.id}
            variants={itemVariant}
            className="text-center"
          >
            <div className="flex justify-center mb-4">{service.icon}</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {service.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
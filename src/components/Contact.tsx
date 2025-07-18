"use client";
import Link from 'next/link';
import { HiLocationMarker, HiPhone, HiMail } from 'react-icons/hi';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
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

export default function Contact() {
  return (
    <motion.section
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-12 lg:px-24"
      id="order"
    >
      <motion.div variants={itemVariant} className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Socials</h3>
        <span className="font-medium text-gray-600">Connect With Us</span>
        <div className="flex space-x-4 mt-6">
          <Link
            href="https://www.facebook.com/bali.pisangsale"
            className="text-gray-800 hover:text-yellow-800 transition-colors"
          >
            <FaFacebook className="text-xl" />
          </Link>
          <Link
            href="https://www.instagram.com/bali_pisang/"
            className="text-gray-800 hover:text-yellow-800 transition-colors"
          >
            <FaInstagram className="text-xl" />
          </Link>
        </div>
      </motion.div>

      {/* Menu Links */}
      <motion.div variants={itemVariant} className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Menu Links</h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="#home"
              className="text-gray-800 hover:text-yellow-800 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="#about"
              className="text-gray-800 hover:text-yellow-800 transition-colors"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="#menu"
              className="text-gray-800 hover:text-yellow-800 transition-colors"
            >
              Menu
            </Link>
          </li>
          <li>
            <Link
              href="#services"
              className="text-gray-800 hover:text-yellow-800 transition-colors"
            >
              Service
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="text-gray-800 hover:text-yellow-800 transition-colors"
            >
              Contact
            </Link>
          </li>
        </ul>
      </motion.div>

      {/* Contact Information */}
      <motion.div variants={itemVariant} className="space-y-4 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Contact</h3>
        <div className="flex items-start space-x-3 mb-2">
          <HiLocationMarker className="text-gray-800 text-base mt-1 flex-shrink-0" />
          <span className="text-gray-600 text-sm">
            Jl. Semarang Blok D7 No 10, Jimbaran, Bali
          </span>
        </div>
        <div className="flex items-center space-x-3 mb-2">
          <HiPhone className="text-gray-800 text-base flex-shrink-0" />
          <span className="text-gray-600 text-sm">+62 813 383 251 09</span>
        </div>
        <div className="flex items-center space-x-3">
          <HiMail className="text-gray-800 text-base flex-shrink-0" />
          <span className="text-gray-600 text-sm">double.s1169@gmail.com</span>
        </div>
      </motion.div>
    </motion.section>
  );
}
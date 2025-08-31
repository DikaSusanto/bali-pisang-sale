"use client";
import Link from 'next/link';
import { HiLocationMarker, HiPhone, HiMail } from 'react-icons/hi';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

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

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    const yOffset = -80;
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

export default function Contact() {
  const { t } = useLanguage();

  return (
    <motion.section
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.01 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-12 lg:px-24"
      id="order"
    >
      <motion.div variants={itemVariant} className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Socials</h3>
        <span className="font-medium text-gray-600"> {t('contact.connect')} </span>
        <div className="flex space-x-4 mt-6">
          <Link
            href="https://www.facebook.com/bali.pisangsale"
            className="text-gray-800 hover:text-primary transition-colors"
            target="_blank"
          >
            <FaFacebook className="text-xl" />
          </Link>
          <Link
            href="https://www.instagram.com/bali_pisang/"
            className="text-gray-800 hover:text-primary transition-colors"
            target="_blank"
          >
            <FaInstagram className="text-xl" />
          </Link>
        </div>
      </motion.div>

      {/* Menu Links */}
      <motion.div variants={itemVariant} className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('contact.MenuLink')}</h3>
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className="text-gray-800 hover:text-yellow-800 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              {t('nav.home')}
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="text-gray-800 hover:text-yellow-800 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              {t('nav.about')}
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => scrollToSection('menu')}
              className="text-gray-800 hover:text-yellow-800 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              {t('nav.menu')}
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => scrollToSection('services')}
              className="text-gray-800 hover:text-yellow-800 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              {t('nav.service')}
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => scrollToSection('order')}
              className="text-gray-800 hover:text-yellow-800 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              {t('nav.order')}
            </button>
          </li>
        </ul>
      </motion.div>

      {/* Contact Information */}
      <motion.div variants={itemVariant} className="space-y-4 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-4"> {t('contact.contactDetail')} </h3>
        <div className="flex items-start space-x-3 mb-2">
          <HiLocationMarker className="text-gray-800 text-base mt-1 flex-shrink-0" />
          <span className="text-gray-600 text-sm">
            Jl. Semarang Blok D7 No 10, Jimbaran, Bali
          </span>
        </div>
        <div className="flex items-center space-x-3 mb-2">
          <HiPhone className="text-gray-800 text-base flex-shrink-0" />
          <span className="text-gray-600 text-sm">+62 813 530 181 30</span>
        </div>
        <div className="flex items-center space-x-3">
          <HiMail className="text-gray-800 text-base flex-shrink-0" />
          <span className="text-gray-600 text-sm">double.s1169@gmail.com</span>
        </div>
      </motion.div>
    </motion.section>
  );
}
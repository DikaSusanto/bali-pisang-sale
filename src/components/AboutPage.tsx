"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { HiArrowLeft, HiHeart, HiStar, HiLocationMarker } from 'react-icons/hi';
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
      ease: "easeOut",
    },
  },
};

const fadeInVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function AboutPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const stats = [
    { number: "7+", label: t('aboutPage.stats.experience') },
    { number: "2000+", label: t('aboutPage.stats.customers') },
    { number: "100%", label: t('aboutPage.stats.natural') },
    { number: "#1", label: t('aboutPage.stats.rank') }
  ];

  const values = [
    {
      icon: <HiHeart className="text-3xl text-primary" />,
      title: t('aboutPage.value1.title'),
      description: t('aboutPage.value1.description')
    },
    {
      icon: <HiStar className="text-3xl text-primary" />,
      title: t('aboutPage.value2.title'),
      description: t('aboutPage.value2.description')
    },
    {
      icon: <HiLocationMarker className="text-3xl text-primary" />,
      title: t('aboutPage.value3.title'),
      description: t('aboutPage.value3.description')
    }
  ];

  const handleSectionNavigate = (sectionId: string) => {
    window.localStorage.setItem('scrollTarget', sectionId);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Navigation Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="px-4 pt-8 lg:px-24"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-yellow-800 transition-colors duration-200"
        >
          <HiArrowLeft className="text-xl" />
          <span className="font-medium">{t('aboutPage.backToHome')}</span>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="px-4 py-12 lg:px-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <div className="space-y-6">
            <motion.div variants={itemVariant}>
              <span className="text-primary font-medium text-lg">{t('aboutPage.aboutUs')}</span>
              <h1 className="text-4xl lg:text-6xl font-semibold text-gray-800 leading-tight mt-2">
                {t('aboutPage.heroTitle')}
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariant}
              className="text-lg text-gray-600 leading-relaxed"
            >
              {t('aboutPage.heroDescription')}
            </motion.p>

            <motion.div
              variants={itemVariant}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            variants={itemVariant}
            className="flex justify-center lg:justify-end"
          >
            <Image
              src="/img/1685364484811.png"
              alt="Traditional Pisang Sale Making Process"
              width={500}
              height={500}
              className="w-full max-w-xl rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.1 }}
        className="px-4 py-16 lg:px-24 bg-white"
      >
        <motion.div
          variants={itemVariant}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-lg">{t('aboutPage.journey')}</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-2">
            {t('aboutPage.journeyTitle')}
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeInVariant}
            className="space-y-6 text-gray-600 leading-relaxed text-lg"
          >
            <p>{t('aboutPage.story1')}</p>
            <p>{t('aboutPage.story2')}</p>
            <p>{t('aboutPage.story3')}</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Values Section */}
      <motion.section
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.1 }}
        className="px-4 py-16 lg:px-24 bg-gray-50"
      >
        <motion.div
          variants={itemVariant}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-lg">{t('aboutPage.values')}</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-2">
            {t('aboutPage.valuesTitle')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariant}
              className="bg-white rounded-lg p-8 shadow-md text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.1 }}
        className="px-4 py-16 lg:px-24 bg-white"
      >
        <motion.div
          variants={itemVariant}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            {t('aboutPage.ctaTitle')}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t('aboutPage.ctaDescription')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => handleSectionNavigate('menu')}
              className="inline-block bg-primary hover:bg-yellow-800 text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              {t('aboutPage.viewMenu')}
            </button>
            <button
              type="button"
              onClick={() => handleSectionNavigate('order')}
              className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              {t('aboutPage.contactUs')}
            </button>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
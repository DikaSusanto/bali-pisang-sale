"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { HiArrowLeft, HiCube, HiMail, HiTruck, HiCheckCircle, HiClock, HiShieldCheck, HiCreditCard } from 'react-icons/hi';
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

const stepVariant = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function HowItWorksPage() {
  const router = useRouter();
  const { t } = useLanguage();

const steps = [
    {
      number: 1,
      title: t('howItWorks.step1.title'),
      icon: <HiCube className="text-4xl" />,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      description: t('howItWorks.step1.description'),
      details: [
        t('howItWorks.step1.detail1'),
        t('howItWorks.step1.detail2'),
        t('howItWorks.step1.detail3'),
        t('howItWorks.step1.detail4')
      ],
      timeframe: t('howItWorks.step1.timeframe')
    },
    {
      number: 2,
      title: t('howItWorks.step2.title'),
      icon: <HiMail className="text-4xl" />,
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      description: t('howItWorks.step2.description'),
      details: [
        t('howItWorks.step2.detail1'),
        t('howItWorks.step2.detail2'),
        t('howItWorks.step2.detail3'),
        t('howItWorks.step2.detail4')
      ],
      timeframe: t('howItWorks.step2.timeframe')
    },
    {
      number: 3,
      title: t('howItWorks.step3.title'),
      icon: <HiCreditCard className="text-4xl" />,
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      description: t('howItWorks.step3.description'),
      details: [
        t('howItWorks.step3.detail1'),
        t('howItWorks.step3.detail2'),
        t('howItWorks.step3.detail3'),
        t('howItWorks.step3.detail4')
      ],
      timeframe: t('howItWorks.step3.timeframe')
    },
    {
      number: 4,
      title: t('howItWorks.step4.title'),
      icon: <HiTruck className="text-4xl" />,
      color: "from-amber-400 to-amber-600",
      bgColor: "bg-amber-50",
      description: t('howItWorks.step4.description'),
      details: [
        t('howItWorks.step4.detail1'),
        t('howItWorks.step4.detail2'),
        t('howItWorks.step4.detail3'),
        t('howItWorks.step4.detail4')
      ],
      timeframe: t('howItWorks.step4.timeframe')
    }
  ];

  const benefits = [
    {
      icon: <HiShieldCheck className="text-2xl text-green-600" />,
      title: t('howItWorks.benefit1.title'),
      description: t('howItWorks.benefit1.description')
    },
    {
      icon: <HiCheckCircle className="text-2xl text-blue-600" />,
      title: t('howItWorks.benefit2.title'),
      description: t('howItWorks.benefit2.description')
    },
    {
      icon: <HiClock className="text-2xl text-purple-600" />,
      title: t('howItWorks.benefit3.title'),
      description: t('howItWorks.benefit3.description')
    },
    {
      icon: <HiTruck className="text-2xl text-amber-600" />,
      title: t('howItWorks.benefit4.title'),
      description: t('howItWorks.benefit4.description')
    }
  ];

    const faqs = [
    {
      q: t('howItWorks.faq1.question'),
      a: t('howItWorks.faq1.answer')
    },
    {
      q: t('howItWorks.faq2.question'),
      a: t('howItWorks.faq2.answer')
    },
    {
      q: t('howItWorks.faq3.question'),
      a: t('howItWorks.faq3.answer')
    },
    {
      q: t('howItWorks.faq4.question'),
      a: t('howItWorks.faq4.answer')
    },
    {
      q: t('howItWorks.faq5.question'),
      a: t('howItWorks.faq5.answer')
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
          <span className="font-medium">{t('howItWorks.backToHome')}</span>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="px-4 py-12 lg:px-24"
        >
        <div className="text-center mb-16">
          <motion.span
            variants={itemVariant}
            className="text-primary font-medium text-lg"
          >
            {t('howItWorks.sectionTitle')}
          </motion.span>
          <motion.h1
            variants={itemVariant}
            className="text-4xl lg:text-6xl font-bold text-gray-800 leading-tight mt-2 mb-6"
          >
            {t('howItWorks.heroTitle')}
          </motion.h1>
          <motion.p
            variants={itemVariant}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t('howItWorks.heroDescription')}
          </motion.p>
        </div>

        {/* Benefits Overview */}
        <motion.div
          variants={containerVariant}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariant}
              className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Detailed Steps */}
      <motion.section
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.1 }}
        className="px-4 py-16 lg:px-24"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={stepVariant}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
            >
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.color} text-white rounded-full flex items-center justify-center font-bold text-xl`}>
                    {step.number}
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">{step.title}</h2>
                    <p className="text-sm text-gray-500">{step.timeframe}</p>
                  </div>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                <ul className="space-y-3">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center gap-3">
                      <HiCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual */}
              <div className={`flex justify-center ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <motion.div
                  className={`${step.bgColor} p-8 rounded-2xl shadow-lg`}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`text-gradient bg-gradient-to-r ${step.color} bg-clip-text text-transparent flex justify-center`}>
                    {step.icon}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ Section */}
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
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            {t('howItWorks.faqTitle')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('howItWorks.faqSubtitle')}
          </p>
        </motion.div>

                <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariant}
              className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200"
            >
              <h3 className="font-semibold text-gray-800 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
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
        className="px-4 py-16 lg:px-24 bg-gradient-to-r from-primary to-yellow-600"
      >
        <motion.div
          variants={itemVariant}
          className="text-center max-w-3xl mx-auto text-white"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('howItWorks.ctaTitle')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('howItWorks.ctaDescription')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="inline-block bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl transition-colors duration-200 font-bold text-lg"
            >
              {t('howItWorks.startPreOrder')}
            </Link>
            <button
              type="button"
              onClick={() => handleSectionNavigate('menu')}
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl transition-colors duration-200 font-bold text-lg"
            >
              {t('howItWorks.viewMenuFirst')}
            </button>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
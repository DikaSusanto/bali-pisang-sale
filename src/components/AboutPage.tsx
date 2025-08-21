"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { HiArrowLeft, HiHeart, HiStar, HiLocationMarker } from 'react-icons/hi';

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

  const stats = [
    { number: "7+", label: "Years Experience" },
    { number: "2000+", label: "Happy Customers" },
    { number: "100%", label: "Natural Ingredients" },
    { number: "#1", label: "In Bali" }
  ];

  const values = [
    {
      icon: <HiHeart className="text-3xl text-primary" />,
      title: "Made with Love",
      description: "Every batch of our Pisang Sale is crafted with passion and care, using traditional Balinese recipes passed down through generations."
    },
    {
      icon: <HiStar className="text-3xl text-primary" />,
      title: "Premium Quality",
      description: "We source only the finest bananas from local Balinese farms, ensuring every bite delivers exceptional taste and quality."
    },
    {
      icon: <HiLocationMarker className="text-3xl text-primary" />,
      title: "Authentic Balinese",
      description: "Rooted in Balinese tradition, our Pisang Sale represents the authentic flavors and cultural heritage of the Island of the Gods."
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
          <span className="font-medium">Back to Home</span>
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
              <span className="text-primary font-medium text-lg">About Us</span>
              <h1 className="text-4xl lg:text-6xl font-semibold text-gray-800 leading-tight mt-2">
                The Story Behind Bali's Finest Pisang Sale
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariant}
              className="text-lg text-gray-600 leading-relaxed"
            >
              For over a decade, we've been perfecting the art of creating Bali's most beloved Pisang Sale.
              What started as a family recipe has grown into Bali's leading producer of this traditional delicacy,
              bringing authentic flavors to thousands of satisfied customers.
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
          <span className="text-primary font-medium text-lg">Our Journey</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-2">
            From Family Recipe to Bali's Favorite
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeInVariant}
            className="space-y-6 text-gray-600 leading-relaxed text-lg"
          >
            <p>
              Our story begins in the heart of Bali, where traditional recipes were passed down through generations
              of our family. What started in a small kitchen with our grandmother's secret blend of spices and
              time-honored techniques has evolved into Bali's most trusted name in Pisang Sale production.
            </p>

            <p>
              We believe that the best flavors come from the finest ingredients and traditional methods.
              That's why we work directly with local banana farmers, selecting only the ripest, most flavorful
              bananas that capture the essence of Bali's tropical climate.
            </p>

            <p>
              Today, we're proud to serve thousands of customers who trust us to deliver the authentic taste
              of Balinese Pisang Sale. Every batch is made with the same love, care, and attention to detail
              that has defined our family's approach for generations.
            </p>
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
          <span className="text-primary font-medium text-lg">What We Stand For</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-2">
            Our Core Values
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
            Ready to Taste Tradition?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Experience the authentic flavors of Bali with our premium Pisang Sale.
            Made with love, crafted with tradition.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => handleSectionNavigate('menu')}
              className="inline-block bg-primary hover:bg-yellow-800 text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              View Our Menu
            </button>
            <button
              type="button"
              onClick={() => handleSectionNavigate('order')}
              className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              Contact Us
            </button>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
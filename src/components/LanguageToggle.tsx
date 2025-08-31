"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import { FaGlobeAsia } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import ReactCountryFlag from "react-country-flag";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", countryCode: "US" },
    { code: "id", name: "Bahasa Indonesia", countryCode: "ID" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <div className="relative">
      {/* Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Globe + flag only */}
        <FaGlobeAsia className="text-base" /> {/* ~16px instead of 18px */}
        {currentLanguage && (
          <ReactCountryFlag
            countryCode={currentLanguage.countryCode}
            svg
            style={{
              width: "1.1em", // ~16–18px
              height: "1.1em",
              borderRadius: "2px",
            }}
          />
        )}

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <HiChevronDown className="text-xs" /> {/* smaller chevron */}
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 min-w-[180px]"
            >
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as "en" | "id");
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-primary/5 transition-colors ${
                    language === lang.code
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700"
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Flag + name in dropdown */}
                  <ReactCountryFlag
                    countryCode={lang.countryCode}
                    svg
                    style={{
                      width: "1.2em", // slightly bigger in dropdown
                      height: "1.2em",
                      borderRadius: "2px",
                    }}
                  />
                  <span className="font-medium text-sm">{lang.name}</span>

                  {/* Active indicator */}
                  {language === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-primary rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageToggle;

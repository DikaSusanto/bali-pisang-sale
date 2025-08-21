'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX, HiHome, HiInformationCircle, HiCollection, HiCog, HiShoppingCart } from 'react-icons/hi'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  // Track scroll position for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      window.localStorage.setItem('scrollTarget', sectionId)
      router.push('/')
    } else {
      const section = document.getElementById(sectionId)
      if (section) {
        const yOffset = -80
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
    closeMenu()
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: HiHome },
    { id: 'about', label: 'About', icon: HiInformationCircle },
    { id: 'menu', label: 'Menu', icon: HiCollection },
    { id: 'services', label: 'Service', icon: HiCog },
    { id: 'order', label: 'Order', icon: HiShoppingCart },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed w-full top-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20'
            : 'bg-white/70 backdrop-blur-sm'
          }`}
      >
        <div className="flex items-center justify-between px-4 py-3 lg:px-24">
          {/* Logo Section */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Image
                src="/img/logo sale.png"
                alt="Bali Pisang Sale Logo"
                width={100}
                height={100}
                className="w-16 lg:w-20"
              />
              {/* Glow effect on logo */}
              <motion.div
                className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="group relative text-gray-700 hover:text-primary font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-primary/5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  <item.icon className="text-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                  {item.label}
                </span>

                {/* Hover underline effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden relative z-50 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? (
                <HiX className="text-2xl text-primary" />
              ) : (
                <HiMenu className="text-2xl text-primary" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMenu}
            />

            {/* Mobile Menu */}
            <motion.nav
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-md shadow-2xl z-50 md:hidden"
            >
              {/* Menu Header with close button */}
              <div className="p-6 border-b border-gray-200/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {/* Fixed the logo aspect ratio here */}
                  <Image
                    src="/img/logo sale.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="w-10"
                  />
                  <div>
                    <h2 className="font-bold text-primary">Bali Pisang Sale</h2>
                    {/* Removed "Menu Navigation" text */}
                  </div>
                </div>
                {/* Added a dedicated "X" close button */}
                <motion.button
                  onClick={closeMenu}
                  className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <HiX className="text-2xl text-primary" />
                </motion.button>
              </div>

              {/* Menu Items */}
              <div className="p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full flex items-center gap-4 p-4 text-left text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <item.icon className="text-xl text-primary" />
                    </div>
                    <div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="absolute bottom-6 left-4 right-4">
                <motion.button
                  onClick={() => scrollToSection('order')}
                  className="w-full bg-primary hover:bg-yellow-800 text-white py-4 rounded-xl font-medium shadow-lg"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Order Now
                </motion.button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HiMenu, HiX } from 'react-icons/hi'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed w-full top-0 right-0 z-50 flex items-center justify-between bg-white px-4 py-4 shadow-lg lg:px-24">
      <Link href="#home" className="flex items-center">
        <Image
          src="/img/logo sale.png"
          alt="Bali Pisang Sale Logo"
          width={100}
          height={100}
          className="w-20 lg:w-24"
        />
      </Link>

      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link href="#home" className="text-gray-800 hover:text-yellow-800 font-medium px-5 py-2.5 transition-colors">
          Home
        </Link>
        <Link href="#about" className="text-gray-800 hover:text-yellow-800 font-medium px-5 py-2.5 transition-colors">
          About
        </Link>
        <Link href="#menu" className="text-gray-800 hover:text-yellow-800 font-medium px-5 py-2.5 transition-colors">
          Menu
        </Link>
        <Link href="#services" className="text-gray-800 hover:text-yellow-800 font-medium px-5 py-2.5 transition-colors">
          Service
        </Link>
        <Link href="#order" className="text-gray-800 hover:text-yellow-800 font-medium px-5 py-2.5 transition-colors">
          Order
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-800 text-3xl cursor-pointer"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Mobile Menu */}
      <nav className={`
        md:hidden absolute left-0 right-0 flex flex-col text-center bg-white shadow-lg transition-all duration-200 ease-in-out
        ${isMenuOpen ? 'top-full opacity-100' : 'top-[-495px] opacity-0'}
      `}>
        <Link href="#home" className="block py-6 px-4 bg-white text-gray-800 hover:text-yellow-800 font-medium transition-colors" onClick={closeMenu}>
          Home
        </Link>
        <Link href="#about" className="block py-6 px-4 bg-white text-gray-800 hover:text-yellow-800 font-medium transition-colors" onClick={closeMenu}>
          About
        </Link>
        <Link href="#menu" className="block py-6 px-4 bg-white text-gray-800 hover:text-yellow-800 font-medium transition-colors" onClick={closeMenu}>
          Menu
        </Link>
        <Link href="#services" className="block py-6 px-4 bg-white text-gray-800 hover:text-yellow-800 font-medium transition-colors" onClick={closeMenu}>
          Service
        </Link>
        <Link href="#order" className="block py-6 px-4 bg-white text-gray-800 hover:text-yellow-800 font-medium transition-colors" onClick={closeMenu}>
          Order
        </Link>
      </nav>
    </header>
  )
}
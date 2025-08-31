"use client";

import Image from 'next/image';
import LanguageToggle from './LanguageToggle';

export default function NavbarStatic() {
  return (
    <header className="fixed w-full top-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-3 lg:px-24">
        {/* Logo Section */}
        <div className="flex items-center relative group">
          <Image
            src="/img/logo sale.png"
            alt="Bali Pisang Sale Logo"
            width={100}
            height={100}
            className="w-16 lg:w-20"
            priority
          />
          {/* Glow effect (static) */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        {/* Language Toggle */}
        <div className="ml-4">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
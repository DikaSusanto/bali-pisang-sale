'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow flex items-center justify-between px-8 py-4">
      <Link href="#home">
        <img src="/img/logo sale.png" alt="Logo" className="w-24" />
      </Link>
      <button className="md:hidden" onClick={() => setOpen(!open)}>
        <i className="bx bx-menu text-3xl"></i>
      </button>
      <nav className={`navbar flex-col md:flex-row md:flex ${open ? 'flex' : 'hidden'} md:static absolute top-full left-0 w-full md:w-auto bg-white md:bg-transparent`}>
        <Link href="#home" className="px-4 py-2">Home</Link>
        <Link href="#about" className="px-4 py-2">About</Link>
        <Link href="#menu" className="px-4 py-2">Menu</Link>
        <Link href="#services" className="px-4 py-2">Service</Link>
        <Link href="#order" className="px-4 py-2">Order</Link>
        {/* Add dark mode toggle here if needed */}
      </nav>
    </header>
  );
}
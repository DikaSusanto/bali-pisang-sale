"use client"

import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Menu from '@/components/Menu'
import Connect from '@/components/Connect'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Service from '@/components/Service'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const scrollTarget = window.localStorage.getItem('scrollTarget')
    if (scrollTarget) {
      const section = document.getElementById(scrollTarget)
      if (section) {
        const yOffset = -80
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
      window.localStorage.removeItem('scrollTarget')
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Menu />
      <Service />
      <Connect />
      <Contact />
      <Footer />
    </main>
  )
}
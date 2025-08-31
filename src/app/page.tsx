import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Menu from '@/components/Menu'
import Connect from '@/components/Connect'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Service from '@/components/Service'
import ClientScrollHandler from '@/components/ScrollHandler'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ClientScrollHandler />
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
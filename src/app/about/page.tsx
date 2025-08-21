import Navbar from '@/components/Navbar'
import AboutPage from '@/components/AboutPage'

export const metadata = {
  title: 'About Us - Bali Pisang Sale',
  description: 'Learn about Bali\'s #1 leading Pisang Sale producer and our commitment to traditional quality.',
};

export default function About() {
  return (
    <>
      <Navbar />
      <AboutPage />
    </>
  );
}
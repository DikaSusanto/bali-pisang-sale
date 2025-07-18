import Image from 'next/image'
import Link from 'next/link'

export default function About() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center px-4 py-12 lg:px-24" id="about">
      <div className="flex justify-center lg:justify-start order-2 lg:order-1">
        <Image
          src="/img/1685365207366.png"
          alt="Pisang Sale Product"
          width={400}
          height={400}
          className="w-full max-w-md rounded-lg"
        />
      </div>
      <div className="space-y-4 text-center lg:text-left order-1 lg:order-2">
        <span className="text-yellow-800 font-medium text-lg">About Us</span>
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 leading-tight">
          Hygienic, No Preservatives, <br /> Unsweetened
        </h2>
        <p className="text-gray-600 text-sm lg:text-base leading-relaxed my-3">
          We guarantee our products to be hygienic. More so, we insist on keeping our Sale untouched by preservatives and additional sweeteners.
        </p>
        <Link 
          href="#" 
          className="inline-block bg-yellow-800 hover:bg-yellow-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200"
        >
          Learn More
        </Link>
      </div>
    </section>
  )
}
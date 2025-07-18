import Link from 'next/link'

export default function Connect() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-around px-4 py-12 lg:px-24 gap-6">
      <div className="text-center md:text-left">
        <span className="text-yellow-800 font-medium text-lg">Interested?</span>
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 mt-2">
          Order now
        </h2>
      </div>
      <Link 
        href="/order" 
        className="bg-yellow-800 hover:bg-yellow-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 mt-4 md:mt-0"
      >
        Order
      </Link>
    </section>
  )
}
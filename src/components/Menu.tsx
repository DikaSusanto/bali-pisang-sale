import Image from 'next/image'
import Link from 'next/link'
import { HiShoppingCart } from 'react-icons/hi'

export default function Menu() {
  const menuItems = [
    {
      id: 1,
      name: 'Pisang Sale',
      size: '250 gr',
      price: 'IDR 45K',
      image: '/img/1685364484811.png',
      href: '/order/250gr'
    },
    {
      id: 2,
      name: 'Pisang Sale',
      size: '100 gr',
      price: 'IDR 15K',
      image: '/img/1685364484811.png',
      href: '/order/100gr'
    },
    {
      id: 3,
      name: 'Pisang Sale Special',
      size: '300 gr',
      price: 'IDR 55K',
      image: '/img/1685364484811.png',
      href: '/order/300gr'
    }
  ]

  return (
    <section className="px-4 py-12 lg:px-24" id="menu">
      <div className="text-center mb-8">
        <span className="text-yellow-800 font-medium text-lg">Menu</span>
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 mt-2">
          Variety of Options to Choose From
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {menuItems.map((item) => (
          <div key={item.id} className="relative mt-8 bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
            <div className="w-full mb-4">
              <Link href={item.href}>
                <Image
                  src={item.image}
                  alt={`${item.name} ${item.size}`}
                  width={200}
                  height={200}
                  className="w-full h-48 object-contain"
                />
              </Link>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h2>
            <h3 className="text-base font-normal text-gray-600 mb-2">{item.size}</h3>
            <span className="text-sm font-medium text-gray-800 mb-4">{item.price}</span>
            <button className="absolute top-0 right-0 bg-yellow-800 hover:bg-yellow-700 text-white p-2 rounded-tl-none rounded-tr-lg rounded-bl-lg rounded-br-none transition-colors">
              <HiShoppingCart className="text-xl" />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
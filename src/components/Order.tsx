"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

// --- Product & Cart Interfaces ---
interface Product {
  id: string;
  name: string;
  price: number;
  weight: string;
  image: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

// --- Product Data ---
const products: Product[] = [
  {
    id: "P01",
    name: "Pisang Sale Original",
    price: 35000,
    weight: "250 gr",
    image: "/img/1685364484811.png",
  },
  {
    id: "P02",
    name: "Pisang Sale Mini Pack",
    price: 15000,
    weight: "100 gr",
    image: "/img/1685364484811.png",
  },
  {
    id: "P03",
    name: "Pisang Sale Special",
    price: 50000,
    weight: "300 gr",
    image: "/img/1685364484811.png",
  },
];

export default function Order() {
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  // --- NEW: State to manage the cart as an array ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- NEW: Calculate total price based on all items in the cart ---
  const totalPrice = cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  // Midtrans Snap.js script loader (remains the same)
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey || "");
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // --- NEW: Handler to add a product to the cart from the dropdown ---
  const handleAddProduct = (productId: string) => {
    if (!productId) return; // Ignore the placeholder option

    // Check if product already exists in cart
    const existingItem = cart.find((item) => item.productId === productId);

    if (!existingItem) {
      setCart((prevCart) => [...prevCart, { productId, quantity: 1 }]);
    }
    // Optional: If it exists, you could increase quantity or just ignore it.
    // This implementation ignores it to prevent duplicates from the dropdown.
  };
  
  // --- NEW: Handler to change quantity for a specific item in the cart ---
  const handleQuantityChange = (productId: string, amount: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };
  
  // --- NEW: Handler to remove an item from the cart ---
  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };
  
  const handleOrderSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (cart.length === 0) {
      alert("Your cart is empty. Please add a product.");
      setIsLoading(false);
      return;
    }

    // --- NEW: Prepare order details with multiple items ---
    const orderDetails = {
      orderId: `PISANG-SALE-${Date.now()}`,
      total: totalPrice,
      items: cart.map(item => {
          const product = products.find(p => p.id === item.productId);
          return {
              id: product?.id,
              name: product?.name,
              price: product?.price,
              quantity: item.quantity,
          };
      }),
      customer: customer,
    };

    try {
      // NOTE: Your backend API '/api/create-transaction' must be updated
      // to accept an array of 'items' instead of a single 'product'.
      const response = await fetch('/api/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) throw new Error("Failed to create transaction.");
      
      const { token } = await response.json();
      
      if (window.snap) {
        window.snap.pay(token);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Could not initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-stone-50 px-4 py-16 lg:px-24"
    >
      <div className="container mx-auto">
        <h1 className="text-4xl text-center font-bold text-primary mb-12">
          Checkout
        </h1>

        <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Column 1: Customer & Shipping Details (Unchanged) --- */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                    <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name</label>
                    <input type="text" id="firstName" name="firstName" value={customer.firstName} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"/>
                </div>
                {/* Last Name */}
                <div>
                    <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name</label>
                    <input type="text" id="lastName" name="lastName" value={customer.lastName} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"/>
                </div>
                {/* Email */}
                <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <input type="email" id="email" name="email" value={customer.email} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"/>
                </div>
                {/* Phone */}
                <div className="md:col-span-2">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <input type="tel" id="phone" name="phone" value={customer.phone} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" placeholder="e.g., 081234567890" />
                </div>
            </div>
          </div>

          {/* --- Column 2: Order Summary (Revised) --- */}
          <div className="lg:col-span-1 bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Your Order
            </h2>

            {/* --- NEW: Product Adder Dropdown --- */}
            <div>
              <label htmlFor="product-adder" className="block text-gray-700 font-medium mb-2">Add a Product</label>
              <select
                id="product-adder"
                // Reset value to empty string to allow re-selection
                value=""
                onChange={(e) => handleAddProduct(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">-- Select a product to add --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id} disabled={cart.some(item => item.productId === product.id)}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* --- NEW: Render items from the cart --- */}
            <div className="mt-6 space-y-6">
              {cart.length === 0 ? (
                 <p className="text-gray-500 text-center py-4">Your cart is empty.</p>
              ) : (
                cart.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null; // Should not happen

                  return (
                    <div key={item.productId}>
                        <div className="flex items-start gap-4">
                            <Image src={product.image} alt={product.name} width={60} height={60} className="rounded-lg object-cover" />
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                <p className="text-sm text-gray-600">
                                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(product.price)}
                                </p>
                            </div>
                            <button type="button" onClick={() => handleRemoveItem(item.productId)} className="text-red-500 hover:text-red-700 pt-1">
                                <FaTrash />
                            </button>
                        </div>

                         {/* Quantity Selector for each item */}
                        <div className="flex items-center justify-end gap-3 mt-2">
                            <button type="button" onClick={() => handleQuantityChange(item.productId, -1)} className="text-gray-600 hover:text-yellow-800"><FaMinus/></button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button type="button" onClick={() => handleQuantityChange(item.productId, 1)} className="text-gray-600 hover:text-yellow-800"><FaPlus/></button>
                        </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* --- NEW: Conditional rendering for total and checkout button --- */}
            {cart.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                {/* Total */}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalPrice)}
                  </span>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={isLoading} className="w-full mt-6 bg-primary hover:bg-yellow-800 text-white px-5 py-3 rounded-lg transition-all duration-200 font-bold text-lg disabled:bg-gray-400">
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </motion.section>
  );
}

// Global window type declaration (remains the same)
declare global {
  interface Window {
    snap: any;
  }
}
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaPlus, FaMinus, FaTrash, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

// --- Interfaces and Data ---
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

const products: Product[] = [
  { id: "P01", name: "Pisang Sale Original", price: 40000, weight: "250 gr", image: "/img/1685364484811.png" },
  { id: "P02", name: "Pisang Sale Mini Pack", price: 20000, weight: "100 gr", image: "/img/1685364484811.png" },
  { id: "P03", name: "Pisang Sale Special", price: 50000, weight: "300 gr", image: "/img/1685364484811.png" },
];

// --- Helper function to format currency ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function Order() {
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const subtotal = cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const calculateServiceFee = (amount: number) => {
    if (amount === 0) return 0;
    const percentageFee = amount * 0.025;
    const fixedFee = 1000;
    return Math.ceil(percentageFee + fixedFee);
  };

  const serviceFee = calculateServiceFee(subtotal);
  const grandTotal = subtotal + serviceFee;

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
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddProduct = (productId: string) => { if (!productId) return; const existingItem = cart.find((item) => item.productId === productId); if (!existingItem) { setCart((prevCart) => [...prevCart, { productId, quantity: 1 }]); } };
  const handleQuantityChange = (productId: string, amount: number) => { setCart((prevCart) => prevCart.map((item) => item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item)) };
  const handleRemoveItem = (productId: string) => { setCart((prevCart) => prevCart.filter((item) => item.productId !== productId)) };

  const validateForm = () => {
    const newErrors = { firstName: "", lastName: "", email: "", phone: "", address: "" };
    let isValid = true;

    if (!customer.firstName.trim()) { newErrors.firstName = "First name is required."; isValid = false; }
    if (!customer.lastName.trim()) { newErrors.lastName = "Last name is required."; isValid = false; }
    if (!customer.email.trim()) { newErrors.email = "Email is required."; isValid = false; }
    if (!customer.address.trim()) { newErrors.address = "Address is required."; isValid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) { newErrors.email = "Please enter a valid email address."; isValid = false; }
    if (!customer.phone.trim()) { newErrors.phone = "Phone number is required."; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleOrderSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) { return; }
    if (cart.length === 0) { alert("Your cart is empty. Please add a product."); return; }

    setIsLoading(true);

    const orderDetails = {
      subtotal: subtotal,
      serviceFee: serviceFee,
      grandTotal: grandTotal,
      items: cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return { id: product?.id, name: product?.name, price: product?.price, quantity: item.quantity };
      }),
      customer: customer,
    };

    try {
      const response = await fetch('/api/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create transaction.");
      }
      const { token } = await response.json();
      if (window.snap) {
        window.snap.pay(token);
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      alert(`Could not initiate payment: ${error.message}`);
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
        <h1 className="text-4xl text-center font-bold text-primary mb-12">Checkout</h1>
        <Link href="/" className="text-primary hover:underline mb-6 block">&larr; Back to Home Page</Link>

        <form onSubmit={handleOrderSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Column 1: Customer Details --- */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name</label>
                <input type="text" id="firstName" name="firstName" value={customer.firstName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={customer.lastName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                <input type="email" id="email" name="email" value={customer.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Address</label>
                <input type="text" id="address" name="address" value={customer.address} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" placeholder="e.g., Jalan Semarang" />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={customer.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" placeholder="e.g., 081234567890" />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* --- Column 2: Order Summary --- */}
          <div className="lg:col-span-1 bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Order</h2>

            <div>
              <label htmlFor="product-adder" className="block text-gray-700 font-medium mb-2">Add a Product</label>
              <select
                id="product-adder"
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

            <div className="mt-6 space-y-6">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Your cart is empty.</p>
              ) : (
                cart.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div key={item.productId}>
                      <div className="flex items-start gap-4">
                        <Image src={product.image} alt={product.name} width={60} height={60} className="rounded-lg object-cover" />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-800">{product.name}</h3>
                          <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveItem(item.productId)} className="text-red-500 hover:text-red-700 pt-1">
                          <FaTrash />
                        </button>
                      </div>
                      <div className="flex items-center justify-end gap-3 mt-2">
                        <button type="button" onClick={() => handleQuantityChange(item.productId, -1)} className="text-gray-600 hover:text-yellow-800"><FaMinus /></button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button type="button" onClick={() => handleQuantityChange(item.productId, 1)} className="text-gray-600 hover:text-yellow-800"><FaPlus /></button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* --- Order Summary Section --- */}
            {cart.length > 0 && (
              <div className="mt-6 pt-6 border-t space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    Service Fee
                    <div className="group relative">
                      <FaInfoCircle className="cursor-pointer text-gray-400" />
                      <div className="absolute bottom-full mb-2 -left-1/2 -translate-x-1/4 w-56 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        This fee helps cover payment processing charges.
                      </div>
                    </div>
                  </span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>
                <div className="pt-2 border-t mt-2 flex justify-between font-bold text-lg text-gray-900">
                  <span>Grand Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
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

declare global {
  interface Window {
    snap: any;
  }
}
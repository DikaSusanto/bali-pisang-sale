// FILE: src/app/order/OrderClientPage.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";

// Interfaces
interface CartItem {
    productId: string;
    quantity: number;
}
interface OrderClientPageProps {
    products: Product[];
}
interface AreaOption {
    id: string;
    name: string;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
};

// Helper function to safely extract the number from a string like "250 gr"
const formatWeight = (weightString: string) => {
    const match = weightString.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
};

export default function OrderClientPage({ products }: OrderClientPageProps) {
    const router = useRouter();
    const [customer, setCustomer] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "" });
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "" });
    const [shippingError, setShippingError] = useState("");

    const [provinces, setProvinces] = useState<AreaOption[]>([]);
    const [cities, setCities] = useState<AreaOption[]>([]);
    const [subdistricts, setSubdistricts] = useState<AreaOption[]>([]);

    const [selectedProvinceId, setSelectedProvinceId] = useState("");
    const [selectedCityId, setSelectedCityId] = useState("");
    const [selectedSubdistrictId, setSelectedSubdistrictId] = useState("");
    const [selectedSubdistrictName, setSelectedSubdistrictName] = useState("");

    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [estimatedShippingCost, setEstimatedShippingCost] = useState<number | null>(null);

    // Memoized calculations
    const totalWeight = useMemo(() => {
        return cart.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            const weightInGrams = product ? formatWeight(product.weight) : 0;
            return total + (item.quantity * weightInGrams);
        }, 0);
    }, [cart, products]);

    const subtotal = useMemo(() => cart.reduce((total, item) => {
        const product = products.find((p) => p.id === item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0), [cart, products]);

    const calculateServiceFee = (amount: number) => {
        if (amount === 0) return 0;
        return Math.ceil((amount * 0.025) + 1000);
    };

    const serviceFee = useMemo(() => calculateServiceFee(subtotal), [subtotal]);
    const grandTotal = useMemo(() => subtotal + serviceFee + (estimatedShippingCost || 0), [subtotal, serviceFee, estimatedShippingCost]);

    // --- Shipping Location Effects ---
    useEffect(() => {
        async function fetchProvinces() {
            const cached = localStorage.getItem('provinces');
            if (cached) {
                setProvinces(JSON.parse(cached));
                return;
            }
            const res = await fetch('/api/rajaongkir/provinces');
            const data = await res.json();
            if (res.ok) {
                setProvinces(data);
                localStorage.setItem('provinces', JSON.stringify(data));
            }
        }
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvinceId) {
            async function fetchCities() {
                const cacheKey = `cities_${selectedProvinceId}`;
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    setCities(JSON.parse(cached));
                    setSubdistricts([]);
                    setSelectedCityId("");
                    setSelectedSubdistrictId("");
                    setEstimatedShippingCost(null);
                    return;
                }
                const res = await fetch(`/api/rajaongkir/cities/${selectedProvinceId}`);
                const data = await res.json();
                if (res.ok) {
                    setCities(data);
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                    setSubdistricts([]);
                    setSelectedCityId("");
                    setSelectedSubdistrictId("");
                    setEstimatedShippingCost(null);
                }
            }
            fetchCities();
        }
    }, [selectedProvinceId]);

    useEffect(() => {
        if (selectedCityId) {
            async function fetchSubdistricts() {
                const cacheKey = `subdistricts_${selectedCityId}`;
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    setSubdistricts(JSON.parse(cached));
                    setSelectedSubdistrictId("");
                    setEstimatedShippingCost(null);
                    return;
                }
                const res = await fetch(`/api/rajaongkir/subdistricts/${selectedCityId}`);
                const data = await res.json();
                if (res.ok) {
                    setSubdistricts(data);
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                    setSelectedSubdistrictId("");
                    setEstimatedShippingCost(null);
                }
            }
            fetchSubdistricts();
        }
    }, [selectedCityId]);


    // --- Event Handlers ---
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
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) { newErrors.email = "Please enter a valid email address."; isValid = false; }
        if (!customer.address.trim()) { newErrors.address = "Street address is required."; isValid = false; }
        if (!customer.phone.trim()) { newErrors.phone = "Phone number is required."; isValid = false; }
        if (!selectedSubdistrictId) { setShippingError("Please select a complete shipping destination."); isValid = false; }
        setErrors(newErrors);
        return isValid;
    };

    const handleCalculateShipping = async () => {
        if (!selectedSubdistrictId || totalWeight === 0) {
            setShippingError("Please select a complete destination and add items to your cart.");
            return;
        }
        setIsCalculatingShipping(true);
        setEstimatedShippingCost(null);
        setShippingError("");

        try {
            const response = await fetch('/api/rajaongkir/courier-rates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destination_area_id: selectedSubdistrictId,
                    weight: totalWeight
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to get shipping options.");
            }
            setEstimatedShippingCost(data.estimatedPrice);
        } catch (error: any) {
            setShippingError(error.message);
        } finally {
            setIsCalculatingShipping(false);
        }
    };

    const handleOrderSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateForm()) { return; }
        if (cart.length === 0) { alert("Your cart is empty."); return; }
        if (estimatedShippingCost === null) { alert("Please calculate a shipping cost estimate."); return; }

        setIsLoading(true);

        const fullAddress = `${customer.address}, ${selectedSubdistrictName}`;

        const orderDetails = {
            subtotal: subtotal,
            serviceFee: serviceFee,
            shippingCost: estimatedShippingCost,
            items: cart.map(item => {
                const product = products.find(p => p.id === item.productId);
                return { id: product?.id, name: product?.name, price: product?.price, quantity: item.quantity };
            }),
            customer: { ...customer, address: fullAddress },
        };

        try {
            const response = await fetch('/api/create-pre-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderDetails),
            });
            if (!response.ok) {
                throw new Error("Failed to place your pre-order.");
            }
            router.push('/order/pre-order-success');
        } catch (error: any) {
            alert(error.message);
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
                    <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customer & Shipping Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name</label>
                                <input type="text" id="firstName" name="firstName" value={customer.firstName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" required />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name</label>
                                <input type="text" id="lastName" name="lastName" value={customer.lastName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" required />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                                <input type="email" id="email" name="email" value={customer.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" required />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                                <input type="tel" id="phone" name="phone" value={customer.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" placeholder="e.g., 081234567890" required />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Street Address</label>
                                <input type="text" id="address" name="address" value={customer.address} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" placeholder="e.g., Jalan Pantai Kuta No. 123" required />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                            </div>

                            {/* CASCADED DROPDOWNS */}
                            <div>
                                <label htmlFor="province" className="block text-gray-700 font-medium mb-2">Province</label>
                                <select id="province" value={selectedProvinceId} onChange={(e) => setSelectedProvinceId(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" required>
                                    <option value="">Choose Province</option>
                                    {provinces.map(prov => (
                                        <option key={prov.id} value={prov.id}>{prov.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
                                <select id="city" value={selectedCityId} onChange={(e) => setSelectedCityId(e.target.value)} disabled={!selectedProvinceId} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" required>
                                    <option value="">Choose City</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="subdistrict" className="block text-gray-700 font-medium mb-2">Subdistrict (Kecamatan)</label>
                                <select id="subdistrict" value={selectedSubdistrictId} onChange={(e) => {
                                    setSelectedSubdistrictId(e.target.value);
                                    const selectedOption = subdistricts.find(sd => sd.id === e.target.value);
                                    if (selectedOption) setSelectedSubdistrictName(selectedOption.name);
                                }} disabled={!selectedCityId} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" required>
                                    <option value="">Choose Subdistrict</option>
                                    {subdistricts.map(sd => (
                                        <option key={sd.id} value={sd.id}>{sd.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="border-t pt-6 mt-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Estimate</h3>
                            <button type="button" onClick={handleCalculateShipping} disabled={isCalculatingShipping || !selectedSubdistrictId || cart.length === 0} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
                                {isCalculatingShipping ? 'Calculating...' : 'Calculate Estimated Shipping'}
                            </button>
                            {totalWeight > 0 && totalWeight < 1000 && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Shipping is calculated with a minimum weight of 1kg (1000g), per courier policy.
                                </p>
                            )}
                            {estimatedShippingCost !== null && (
                                <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                                    <p className="text-sm text-gray-600">Average shipping cost estimate:</p>
                                    <p className="font-semibold text-lg">{formatCurrency(estimatedShippingCost)}</p>
                                </div>
                            )}
                            {shippingError && (<p className="text-red-500 text-sm mt-2">{shippingError}</p>)}
                        </div>
                    </div>

                    <div className="lg:col-span-1 bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Order</h2>
                        <div>
                            <label htmlFor="product-adder" className="block text-gray-700 font-medium mb-2">Add a Product</label>
                            <select id="product-adder" value="" onChange={(e) => handleAddProduct(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500">
                                <option value="">-- Select a product to add --</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id} disabled={cart.some(item => item.productId === product.id)}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-6 space-y-6">
                            {cart.length === 0 ? (<p className="text-gray-500 text-center py-4">Your cart is empty.</p>) : (
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
                                                <button type="button" onClick={() => handleRemoveItem(item.productId)} className="text-red-500 hover:text-red-700 pt-1"><FaTrash /></button>
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
                        {cart.length > 0 && (
                            <div className="mt-6 pt-6 border-t space-y-2 text-gray-700">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Service Fee</span>
                                    <span>{formatCurrency(serviceFee)}</span>
                                </div>
                                {estimatedShippingCost !== null && (
                                    <div className="flex justify-between">
                                        <span>Shipping (est.)</span>
                                        <span>{formatCurrency(estimatedShippingCost)}</span>
                                    </div>
                                )}
                                <div className="pt-2 border-t mt-2 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Grand Total (est.)</span>
                                    <span>{formatCurrency(grandTotal)}</span>
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full mt-6 bg-primary text-white font-bold py-3 px-6 rounded-lg transition-colors hover:opacity-90 disabled:bg-gray-400">
                                    {isLoading ? 'Placing Order...' : 'Place Pre-Order'}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </motion.section>
    );
}
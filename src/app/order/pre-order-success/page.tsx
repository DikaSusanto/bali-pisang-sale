// src/app/order/pre-order-success/page.tsx

import Link from 'next/link';

export default function PreOrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-2xl mx-auto text-center">
        <svg className="w-16 h-16 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Pre-Order Received!</h1>
        <p className="text-gray-600 mt-2">
          Thank you! We have received your pre-order. We will confirm stock availability and send a final invoice with a payment link to your email shortly.
        </p>
        <div className="text-center mt-10">
          <Link href="/" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
            → Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Order from "@/components/Order";

export default function OrderPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-800"></div>
        </div>
      ) : (
        <Order />
      )}
    </main>
  );
}
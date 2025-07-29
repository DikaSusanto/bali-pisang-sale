"use client";

import { useState, useEffect } from "react";
import Order from "@/components/Order";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function OrderPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen">
      {isLoading ? (
        <LoadingSpinner /> 
      ) : (
        <Order />
      )}
    </main>
  );
}
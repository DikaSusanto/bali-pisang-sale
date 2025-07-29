"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ErrorDisplay from "@/components/ErrorDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";

// A map of error codes to display messages
const errorMessages: Record<string, string> = {
  MISSING_ID: "Order ID is missing from the URL. We cannot find your order.",
  PAYMENT_FAILED: "Your payment was not successful. Please contact support if you have any questions.",
  ORDER_NOT_FOUND: "We could not find the details for your order.",
  UNKNOWN_ERROR: "An unknown error occurred. Please try again or contact support.",
};

function FailedContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "UNKNOWN_ERROR";
  const message = errorMessages[code] || errorMessages.UNKNOWN_ERROR;

  return <ErrorDisplay title="Order Failed" message={message} />;
}

export default function FailedPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={<LoadingSpinner text="Loading..." />}>
        <FailedContent />
      </Suspense>
    </div>
  );
}
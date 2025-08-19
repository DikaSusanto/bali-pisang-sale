"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ErrorDisplay from "@/components/ErrorDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";

const errorMessages: Record<string, string> = {
  MISSING_ID: "Order ID is missing from the URL. We cannot find your order.",
  MISSING_TOKEN: "Payment token is missing. Please use the payment link from your email.",
  PAYMENT_FAILED: "Your payment was not successful. Please contact support if you have any questions.",
  ORDER_NOT_FOUND: "We could not find the details for your order.",
  MIDTRANS_ERROR: "There was a problem processing your payment with Midtrans. Please try again or contact support.",
  SIGNATURE_ERROR: "Payment verification failed. Please contact support.",
  EXPIRED: "Your payment session has expired. Please place a new order.",
  CANCELLED: "This order has been cancelled and cannot be paid.",
  UNKNOWN_ERROR: "An unknown error occurred. Please try again or contact support.",
};

function FailedContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "UNKNOWN_ERROR";
  const message = errorMessages[code] || errorMessages.UNKNOWN_ERROR;
  return <ErrorDisplay title="Order Failed" message={message} />;
}

export default function FailedClientContent() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading..." />}>
      <FailedContent />
    </Suspense>
  );
}
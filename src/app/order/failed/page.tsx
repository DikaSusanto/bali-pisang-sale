import FailedClientContent from "./FailedClientContent";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Failed | Bali Pisang Sale',
  description: 'There was a problem with your order or payment. Please review the error and try again.',
};

export default function FailedPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <FailedClientContent />
    </div>
  );
}
import Link from 'next/link';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  linkHref?: string;
  linkText?: string;
}

export default function ErrorDisplay({
  title = "An Error Occurred",
  message,
  linkHref = "/",
  linkText = "→ Back to Homepage",
}: ErrorDisplayProps) {
  return (
    <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-2xl mx-auto text-center">
      <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <h1 className="text-3xl font-bold text-gray-800 mt-4">{title}</h1>
      <p className="text-gray-600 mt-2">{message}</p>
      
      <div className="mt-10">
        <Link href={linkHref} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
          {linkText}
        </Link>
      </div>
    </div>
  );
}
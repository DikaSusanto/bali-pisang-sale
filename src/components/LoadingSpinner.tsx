export default function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] min-h-screen py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid mb-4"></div>
      {text && <span className="text-gray-600 text-lg">{text}</span>}
    </div>
  );
}
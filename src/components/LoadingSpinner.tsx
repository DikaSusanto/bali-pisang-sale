interface LoadingSpinnerProps {
  text?: string;
  small?: boolean;
}

export default function LoadingSpinner({ text, small }: LoadingSpinnerProps) {
  const containerClasses = small 
    ? "flex items-center justify-center gap-2" 
    : "flex flex-col items-center justify-center min-h-screen py-12";
  
  const spinnerClasses = small
    ? "animate-spin rounded-full h-5 w-5 border-t-2 border-primary border-solid"
    : "animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid mb-4";
  
  const textClasses = small
    ? "text-gray-600"
    : "text-gray-600 text-lg";

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses}></div>
      {text && <span className={textClasses}>{text}</span>}
    </div>
  );
}
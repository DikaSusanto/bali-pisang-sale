import AuthProvider from "../AuthProvider";
import AuthStatus from "@/components/AuthStatus";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-stone-50">
        <header className="bg-white shadow-md">
          <nav className="container mx-auto px-4 lg:px-24 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
            <AuthStatus />
          </nav>
        </header>
        <main className="py-8">{children}</main>
      </div>
    </AuthProvider>
  );
}
import AuthProvider from "../AuthProvider";
import AuthStatus from "@/components/AuthStatus";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-stone-50">
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 lg:px-24">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
              <AuthStatus />
            </div>
            <nav className="border-t">
              <ul className="flex items-center gap-6 text-sm font-semibold">
                <li><Link href="/admin/orders" className="text-gray-600 hover:text-primary py-3 block">Orders</Link></li>
                <li><Link href="/admin/products" className="text-gray-600 hover:text-primary py-3 block">Products</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="py-8">{children}</main>
      </div>
    </AuthProvider>
  );
}
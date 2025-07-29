"use client";

import { useSession, signOut } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-700 hidden sm:block">
          Signed in as <span className="font-semibold">{session.user?.email}</span>
        </p>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="bg-red-500 text-white font-bold text-sm py-1 px-3 rounded-md hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return null;
}
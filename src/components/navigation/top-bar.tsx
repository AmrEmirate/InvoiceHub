"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Breadcrumb / Title placeholder */}
      <div className="text-sm text-neutral-500">
        Welcome back, <span className="font-medium text-foreground">{user?.name}</span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Tombol Notifikasi (Opsional) */}
        <button className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100">
          <span className="sr-only">Notifications</span>
          🔔
        </button>

        <div className="h-6 w-px bg-neutral-200"></div>

        {/* User Profile Dropdown */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-neutral-500">{user?.company}</p>
          </div>
          
          {/* Avatar Sederhana */}
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="ml-2 text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
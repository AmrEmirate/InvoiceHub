"use client";

import { useAuth } from "@/hooks/use-auth";

interface TopBarProps {
  onToggleSidebar: () => void;
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-neutral-200 px-4 md:px-6 py-4 flex items-center sticky top-0 z-20">
      {/* Tombol Toggle Sidebar (Mobile Only) */}
      <button
        onClick={onToggleSidebar}
        className="md:hidden text-2xl text-neutral-600 hover:text-neutral-900 transition-colors mr-auto"
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      {/* User Profile Info */}
      <div className="flex items-center gap-2 md:gap-4 md:ml-auto">
        <div className="hidden sm:block text-right">
          <p className="font-medium text-foreground text-sm md:text-base">
            {user?.name}
          </p>
          <p className="text-xs text-neutral-600">{user?.email}</p>
        </div>
        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </div>
  );
}
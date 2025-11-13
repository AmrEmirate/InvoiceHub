"use client";

import { useState } from "react";
import Sidebar from "@/components/navigation/sidebar";
import TopBar from "@/components/navigation/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar - Menerima state isOpen dan onClose */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Overlay untuk menutup sidebar di mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* TopBar - Menerima fungsi onToggleSidebar */}
        <TopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
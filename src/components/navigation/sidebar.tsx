"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Invoices", href: "/invoices", icon: "📄" },
    { name: "Clients", href: "/clients", icon: "👥" },
    { name: "Products", href: "/products", icon: "📦" },
    { name: "Categories", href: "/categories", icon: "🏷️" },
    { name: "Profile", href: "/profile", icon: "👤" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-200">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            ₹
          </div>
          <span className="text-xl font-bold text-foreground">InvoiceHub</span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-foreground"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer (Opsional) */}
      <div className="p-4 border-t border-neutral-200">
        <p className="text-xs text-center text-neutral-400">
          © 2025 InvoiceHub
        </p>
      </div>
    </aside>
  );
}
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

interface NavItem {
  label: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { label: "Home", href: "/home", icon: "🏠" },
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Invoices", href: "/invoices", icon: "📄" },
  { label: "Clients", href: "/clients", icon: "👥" },
  { label: "Products", href: "/products", icon: "📦" },
  { label: "Profile", href: "/profile", icon: "⚙️" },
]

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  return (
    <>
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 left-0 top-0 z-50 w-64 h-screen bg-primary text-white transition-transform duration-300 overflow-hidden flex flex-col md:transition-none`}
      >
        <div className="p-6 border-b border-primary-light flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center font-bold text-lg">₹</div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg">InvoiceHub</h1>
              <p className="text-xs text-neutral-400">Management</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-xl hover:text-neutral-300 transition-colors">
            ✕
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-accent text-white" : "text-neutral-300 hover:bg-primary-lighter"
                }`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-primary-light">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

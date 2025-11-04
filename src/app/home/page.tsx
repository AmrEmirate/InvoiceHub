"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { ArrowRight, FileText, Users, BarChart3, Settings } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 rounded-lg bg-white/20 mx-auto mb-4 animate-pulse" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary-light">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="text-lg font-bold text-white">₹</span>
            </div>
            <h1 className="text-2xl font-bold text-white">InvoiceHub</h1>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("authToken")
              localStorage.removeItem("user")
              router.push("/login")
            }}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Welcome Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Welcome, <span className="text-accent">{user?.name || "User"}</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Manage your invoices, clients, and business finances with ease. Start by exploring your dashboard.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors flex items-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/invoices/create")}
              className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              Create Invoice
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <Link
            href="/invoices"
            className="group p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-white font-semibold mb-2">Invoices</h3>
            <p className="text-white/70 text-sm">View and manage all invoices</p>
          </Link>

          <Link
            href="/clients"
            className="group p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
              <Users className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="text-white font-semibold mb-2">Clients</h3>
            <p className="text-white/70 text-sm">Manage your client list</p>
          </Link>

          <Link
            href="/products"
            className="group p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
              <BarChart3 className="w-6 h-6 text-green-300" />
            </div>
            <h3 className="text-white font-semibold mb-2">Products</h3>
            <p className="text-white/70 text-sm">Manage products and services</p>
          </Link>

          <Link
            href="/profile"
            className="group p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
              <Settings className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-white font-semibold mb-2">Profile</h3>
            <p className="text-white/70 text-sm">View and edit your profile</p>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
            <p className="text-white/70 text-sm font-medium mb-2">Company</p>
            <h3 className="text-2xl font-bold text-white">{user?.company || "N/A"}</h3>
          </div>
          <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
            <p className="text-white/70 text-sm font-medium mb-2">Email</p>
            <h3 className="text-lg font-semibold text-white break-all">{user?.email}</h3>
          </div>
          <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
            <p className="text-white/70 text-sm font-medium mb-2">Status</p>
            <h3 className="text-lg font-semibold text-green-300">Active</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

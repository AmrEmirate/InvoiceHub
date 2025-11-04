"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function LandingPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const token = localStorage.getItem("authToken")
    if (token) {
      router.push("/home")
    }
  }, [router])

  if (!isClient) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navbar */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-lg font-bold text-white">₹</span>
              </div>
              <span className="text-xl font-bold text-foreground">InvoiceHub</span>
            </div>
            <div className="flex gap-4">
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
              Professional Invoice Management Made Simple
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Create, manage, and track invoices effortlessly. Perfect for freelancers and small businesses.
            </p>
            <div className="flex gap-4">
              <Link href="/signup" className="btn-primary px-8 py-3">
                Get Started Free
              </Link>
              <Link href="/login" className="btn-secondary px-8 py-3">
                View Demo
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                <span className="text-5xl font-bold text-white">₹</span>
              </div>
              <p className="text-neutral-600">Invoice Management Dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Invoice Creation",
                description: "Create professional invoices in minutes with our intuitive interface.",
              },
              {
                title: "Client Management",
                description: "Keep track of all your clients in one organized place.",
              },
              {
                title: "Payment Tracking",
                description: "Monitor payment status and never miss a payment again.",
              },
              {
                title: "Product Library",
                description: "Reuse products and services for faster invoice creation.",
              },
              {
                title: "Analytics Dashboard",
                description: "Get insights on your invoices and revenue at a glance.",
              },
              {
                title: "Mobile Friendly",
                description: "Manage your invoices on the go with full mobile support.",
              },
            ].map((feature, i) => (
              <div key={i} className="card p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of professionals using InvoiceHub</p>
          <Link
            href="/signup"
            className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Create Your Account Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-neutral-600">
          <p>&copy; 2025 InvoiceHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

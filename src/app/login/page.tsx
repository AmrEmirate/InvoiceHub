"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("demo@invoiceapp.com")
  const [password, setPassword] = useState("demo123456")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Demo authentication - in production, connect to your backend API
      if (email && password) {
        const mockUser = {
          id: "1",
          email: email,
          name: "Demo User",
          company: "My Business",
        }

        localStorage.setItem("authToken", "demo-token-" + Date.now())
        localStorage.setItem("user", JSON.stringify(mockUser))

        router.push("/home")
      } else {
        setError("Please enter both email and password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail("demo@invoiceapp.com")
    setPassword("demo123456")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent mb-4">
            <span className="text-xl font-bold text-white">₹</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">InvoiceHub</h1>
          <p className="text-neutral-300">Professional Invoice Management</p>
        </div>

        {/* Login Card */}
        <div className="card p-8 mb-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="label-text text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="label-text text-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-200 space-y-4">
            <button
              onClick={fillDemoCredentials}
              className="w-full text-center text-sm text-accent hover:text-accent-dark font-medium"
            >
              Use Demo Credentials
            </button>
            <p className="text-center text-sm text-neutral-600">
              <span>Don't have an account? </span>
              <Link href="/signup" className="text-accent hover:text-accent-dark font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="card p-4 bg-blue-50 border-blue-200">
          <p className="text-xs font-medium text-blue-900 mb-2">Demo Credentials:</p>
          <p className="text-xs text-blue-800">Email: demo@invoiceapp.com</p>
          <p className="text-xs text-blue-800">Password: demo123456</p>
        </div>
      </div>
    </div>
  )
}

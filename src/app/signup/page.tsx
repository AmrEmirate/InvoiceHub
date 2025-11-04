"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.password || !formData.company) {
        setError("Please fill in all fields")
        setIsLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        setIsLoading(false)
        return
      }

      const mockUser = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name,
        company: formData.company,
      }

      localStorage.setItem("authToken", "demo-token-" + Date.now())
      localStorage.setItem("user", JSON.stringify(mockUser))

      router.push("/home")
    } catch (err) {
      setError("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent mb-4">
            <span className="text-xl font-bold text-white">₹</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-neutral-300">Join InvoiceHub today</p>
        </div>

        {/* Signup Card */}
        <div className="card p-8 mb-6">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="label-text text-foreground">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="label-text text-foreground">Company Name</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="input-field"
                placeholder="Your Business"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="label-text text-foreground">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="label-text text-foreground">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="At least 6 characters"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="label-text text-foreground">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm password"
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
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:text-accent-dark font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="card p-4 bg-blue-50 border-blue-200 text-center">
          <p className="text-xs font-medium text-blue-900 mb-2">Want to try first?</p>
          <Link href="/login" className="text-xs text-blue-800 hover:text-blue-900 font-medium">
            Use demo credentials
          </Link>
        </div>
      </div>
    </div>
  )
}

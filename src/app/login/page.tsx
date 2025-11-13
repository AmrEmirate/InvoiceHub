"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      await login({ email, password });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    }
  };

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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-sm text-neutral-600">
              <span>Don't have an account? </span>
              <Link
                href="/signup"
                className="text-accent hover:text-accent-dark font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
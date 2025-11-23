"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2020/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setIsSubmitted(true);
      toast.success("Reset link sent to your email");
    } catch (err: any) {
      const msg = err.message || "Failed to send reset link. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent mb-4">
            <span className="text-xl font-bold text-white">₹</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">InvoiceHub</h1>
          <p className="text-neutral-300">Professional Invoice Management</p>
        </div>

        <div className="card p-8 mb-6">
          {isSubmitted ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                  <svg
                    className="w-8 h-8 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Check Your Email
                </h2>
                <p className="text-sm text-neutral-600">
                  We've sent a password reset link to <strong>{email}</strong>.
                  Please check your inbox and spam folder.
                </p>
              </div>

              <Link
                href="/login"
                className="btn-primary w-full text-center block"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Forgot Password?
                </h2>
                <p className="text-sm text-neutral-600">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label-text text-foreground">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="your@email.com"
                    disabled={isLoading}
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-accent"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

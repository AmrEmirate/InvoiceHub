"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2020/api";

export default function SignupPage() {
  const { register, googleSignup, loading } = useAuth();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [error, setError] = useState("");
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);

  // Pre-fill Google data if redirected from Google OAuth
  useEffect(() => {
    const googleEmail = searchParams.get("googleEmail");
    const googleName = searchParams.get("googleName");
    
    if (googleEmail && googleName) {
      setFormData({
        email: decodeURIComponent(googleEmail),
        name: decodeURIComponent(googleName),
        company: "",
      });
      setIsGoogleSignup(true);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.company) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Use googleSignup if user came from Google OAuth
      if (isGoogleSignup) {
        await googleSignup({
          email: formData.email,
          name: formData.name,
          company: formData.company,
        });
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          company: formData.company,
        });
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Signup failed. Please try again.";
      setError(msg);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent mb-4">
            <span className="text-xl font-bold text-white">₹</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-neutral-300">Join InvoiceHub today</p>
        </div>

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
                disabled={loading}
                required
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
                disabled={loading}
                required
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
                disabled={loading}
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
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Sign Up"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-300"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h12.8c-.59 2.73-2.18 4.96-4.66 6.55l7.58 5.85c4.61-4.25 7.28-10.3 7.28-17.36z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.49-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.58-5.85c-2.18 1.45-4.96 2.3-8.31 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Sign up with Google
          </button>

          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent hover:text-accent-dark font-medium"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

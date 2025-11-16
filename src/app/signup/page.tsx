"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth"; // Menggunakan hook baru

export default function SignupPage() {
  const { register, loading } = useAuth(); // Ambil fungsi register & loading
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi Frontend (Sederhana)
    if (!formData.name || !formData.email || !formData.company) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Panggil fungsi register dari hook useAuth
      // Hook ini akan menangani request API
      await register({
        name: formData.name,
        email: formData.email,
        company: formData.company,
      });
      // Jika sukses, hook useAuth akan menampilkan toast
      // dan (opsional) bisa me-redirect atau menampilkan pesan sukses
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Signup failed. Please try again.";
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

            {/* FIELD PASSWORD DAN CONFIRM PASSWORD DIHAPUS */}

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
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setPassword, loading } = useAuth(); // Kita akan tambahkan 'setPassword' ke hook

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const token = searchParams.get("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing verification token.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await setPassword(token, formData.password);
      // Jika sukses, hook akan redirect ke login
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Failed to set password. Please try again.";
      setError(msg);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold text-danger mb-4">Invalid Link</h2>
        <p className="text-neutral-600">
          This password reset link is invalid or has expired.
        </p>
        <Link href="/login" className="text-accent hover:text-accent-dark font-medium mt-4 inline-block">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-8 mb-6">
      <h2 className="text-2xl font-bold text-center text-foreground mb-6">
        Set Your Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text text-foreground">New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            placeholder="At least 6 characters"
            disabled={loading}
            required
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
            placeholder="Confirm new password"
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
          {loading ? "Setting Password..." : "Set Password & Login"}
        </button>
      </form>
    </div>
  );
}

// Komponen wrapper untuk layout dan Suspense (wajib untuk useSearchParams)
export default function SetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent mb-4">
            <span className="text-xl font-bold text-white">₹</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
          <p className="text-neutral-300">Just one last step to secure your account.</p>
        </div>

        <Suspense fallback={<div className="card p-8 text-center">Loading...</div>}>
          <SetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
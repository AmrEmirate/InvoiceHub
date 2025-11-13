"use client";

import type React from "react";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/lib/types";

export default function ProfilePage() {
  const { user, getProfile, updateProfile, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Inisialisasi state profile
  const [profile, setProfile] = useState<Partial<User>>({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    taxId: "",
    bankAccount: "",
  });

  // Update form state saat user data dimuat dari hook
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        country: user.country || "",
        taxId: user.taxId || "",
        bankAccount: user.bankAccount || "",
      });
    } else {
      // Jika user belum ada di state, coba fetch ulang
      getProfile();
    }
  }, [user, getProfile]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!profile.name?.trim()) newErrors.name = "Name is required";
    if (!profile.company?.trim()) newErrors.company = "Company name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSaving(true);
      try {
        await updateProfile(profile);
        setIsEditing(false);
      } catch (error) {
        // Error sudah ditangani oleh hook (toast)
      } finally {
        setSaving(false);
      }
    }
  };

  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-neutral-600">Loading Profile...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
            <p className="text-neutral-600">Manage your account information</p>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-primary">
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Business Information */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="label-text">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${
                    !isEditing && "bg-neutral-100 cursor-not-allowed"
                  }`}
                  placeholder="Your Full Name"
                  title="Full Name"
                />
                {errors.name && (
                  <p className="text-danger text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="label-text">
                  Email (Read-only)
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={profile.email}
                  readOnly
                  className="input-field bg-neutral-100 cursor-not-allowed"
                  placeholder="email@example.com"
                  title="Email Address"
                />
              </div>
              <div>
                <label htmlFor="company" className="label-text">
                  Company Name *
                </label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  value={profile.company}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${
                    !isEditing && "bg-neutral-100 cursor-not-allowed"
                  }`}
                  placeholder="Company Name"
                  title="Company Name"
                />
                {errors.company && (
                  <p className="text-danger text-sm mt-1">{errors.company}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="label-text">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${
                    !isEditing && "bg-neutral-100 cursor-not-allowed"
                  }`}
                  placeholder="+1234567890"
                  title="Phone Number"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="address" className="label-text">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${
                    !isEditing && "bg-neutral-100 cursor-not-allowed"
                  }`}
                  placeholder="Street Address"
                  title="Address"
                />
              </div>
              <div>
                <label htmlFor="city" className="label-text">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${
                    !isEditing && "bg-neutral-100 cursor-not-allowed"
                  }`}
                  placeholder="City"
                  title="City"
                />
              </div>
              <div>
                <label htmlFor="state" className="label-text">
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  value={profile.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${
                    !isEditing && "bg-neutral-100 cursor-not-allowed"
                  }`}
                  placeholder="State"
                  title="State"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="label-text">
                  Zip Code
                </label>
                <input
                  id="zipCode"
                  type="text"
                  name="zipCode"
                  value={profile.zipCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${
                    !isEditing && "bg-neutral-100 cursor-not-allowed"
                  }`}
                  placeholder="Zip Code"
                  title="Zip Code"
                />
              </div>
              <div>
                <label htmlFor="country" className="label-text">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  value={profile.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${
                    !isEditing && "bg-neutral-100 cursor-not-allowed"
                  }`}
                  placeholder="Country"
                  title="Country"
                />
              </div>
            </div>
          </div>

          {/* Tax & Payment Information */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Tax & Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="taxId" className="label-text">
                  Tax ID
                </label>
                <input
                  id="taxId"
                  type="text"
                  name="taxId"
                  value={profile.taxId}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${
                    !isEditing && "bg-neutral-100 cursor-not-allowed"
                  }`}
                  placeholder="Tax ID"
                  title="Tax ID"
                />
              </div>
              <div>
                <label htmlFor="bankAccount" className="label-text">
                  Bank Account
                </label>
                <input
                  id="bankAccount"
                  type="text"
                  name="bankAccount"
                  value={profile.bankAccount}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${
                    !isEditing && "bg-neutral-100 cursor-not-allowed"
                  }`}
                  placeholder="Bank Account Number"
                  title="Bank Account"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          {isEditing && (
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary flex-1"
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}
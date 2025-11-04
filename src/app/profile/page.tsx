"use client"

import type React from "react"

import { useState } from "react"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || "Demo User",
    email: user?.email || "demo@invoiceapp.com",
    company: user?.company || "My Business",
    phone: "+1-555-0000",
    address: "123 Business Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    taxId: "TAX-12345678",
    bankAccount: "XXXX XXXX XXXX 1234",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!profile.name.trim()) newErrors.name = "Name is required"
    if (!profile.email.trim()) newErrors.email = "Email is required"
    if (!profile.company.trim()) newErrors.company = "Company name is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      alert("Profile updated successfully!")
      setIsEditing(false)
    }
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
            <h2 className="text-lg font-bold text-foreground mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing && "bg-neutral-100 cursor-not-allowed"}`}
                />
                {errors.name && <p className="text-danger text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="label-text">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing && "bg-neutral-100 cursor-not-allowed"}`}
                />
                {errors.email && <p className="text-danger text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="label-text">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  value={profile.company}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing && "bg-neutral-100 cursor-not-allowed"}`}
                />
                {errors.company && <p className="text-danger text-sm mt-1">{errors.company}</p>}
              </div>
              <div>
                <label className="label-text">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing && "bg-neutral-100 cursor-not-allowed"}`}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label-text">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing && "bg-neutral-100 cursor-not-allowed"}`}
                />
              </div>
              <div>
                <label className="label-text">City</label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing && "bg-neutral-100 cursor-not-allowed"}`}
                />
              </div>
              <div>
                <label className="label-text">State</label>
                <input
                  type="text"
                  name="state"
                  value={profile.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing && "bg-neutral-100 cursor-not-allowed"}`}
                />
              </div>
              <div>
                <label className="label-text">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={profile.zipCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing && "bg-neutral-100 cursor-not-allowed"}`}
                />
              </div>
              <div>
                <label className="label-text">Country</label>
                <input
                  type="text"
                  name="country"
                  value={profile.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing && "bg-neutral-100 cursor-not-allowed"}`}
                />
              </div>
            </div>
          </div>

          {/* Tax & Payment Information */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Tax & Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Tax ID</label>
                <input
                  type="text"
                  name="taxId"
                  value={profile.taxId}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing && "bg-neutral-100 cursor-not-allowed"}`}
                />
              </div>
              <div>
                <label className="label-text">Bank Account (Last 4 digits)</label>
                <input
                  type="text"
                  name="bankAccount"
                  value={profile.bankAccount}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing && "bg-neutral-100 cursor-not-allowed"}`}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          {isEditing && (
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">
                Save Changes
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  )
}

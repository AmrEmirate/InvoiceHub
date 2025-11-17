"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react"; // Tambahkan useRef
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import apiHelper from "@/lib/apiHelper"; // Impor apiHelper
import { toast } from "sonner"; // Impor toast

// Skema Zod
const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email(),
  company: z.string().min(3, "Company name is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  taxId: z.string().optional(),
  bankAccount: z.string().optional(),
  avatar: z.string().url().optional(), // <-- TAMBAHKAN AVATAR KE SKEMA
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, getProfile, updateProfile, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // State baru untuk proses upload
  const [saving, setSaving] = useState(false); // Ini sekarang menangani save & upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Ref untuk input file
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue, // Kita butuh setValue
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // useEffect untuk mengisi form
  useEffect(() => {
    if (user) {
      reset({
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
        avatar: user.avatar || "", // <-- ISI AVATAR
      });
      // Set juga preview URL jika avatar sudah ada
      if (user.avatar) {
        setPreviewUrl(user.avatar);
      }
    } else {
      getProfile();
    }
  }, [user, getProfile, reset]);

  // Handler untuk perubahan file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Buat URL preview lokal
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Fungsi untuk mengunggah file
  const handleUpload = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await apiHelper.post<{ message: string; data: { url: string } }>(
        "/upload", // Endpoint upload backend Anda
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Image uploaded!");
      return res.data.data.url; // Kembalikan URL gambar
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Image upload failed");
      return null;
    }
  };

  // Fungsi Submit Utama
  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    let avatarUrl = data.avatar; // Ambil URL avatar yang ada

    try {
      // 1. Jika ada file baru, unggah dulu
      if (selectedFile) {
        const newAvatarUrl = await handleUpload();
        if (newAvatarUrl) {
          avatarUrl = newAvatarUrl; // Gunakan URL baru
          setValue("avatar", newAvatarUrl); // Set di form agar 'isDirty' false
        } else {
          // Gagal upload, hentikan proses
          setSaving(false);
          return;
        }
      }

      // 2. Siapkan data akhir untuk dikirim
      const finalData = { ...data, avatar: avatarUrl };

      // 3. Update profil dengan data (termasuk URL avatar)
      await updateProfile(finalData);
      
      setIsEditing(false);
      setSelectedFile(null); // Bersihkan file
    } catch (error) {
      // Error toast sudah ditangani oleh hook
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null); // Bersihkan file
    // Reset form ke data user
    if (user) {
      reset({
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
        avatar: user.avatar || "",
      });
      // Reset preview
      setPreviewUrl(user.avatar || null);
    }
  };

  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-neutral-600">Loading Profile...</div>
      </div>
    );
  }

  // Cek apakah ada file baru atau data form lain yang berubah
  const hasChanges = isDirty || selectedFile !== null;

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* --- BAGIAN UI UPLOAD AVATAR --- */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Profile Picture
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-neutral-100 overflow-hidden flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-neutral-400">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                aria-label="Upload new profile picture"
                className="hidden" // Sembunyikan input file asli
                accept="image/png, image/jpeg"
                disabled={!isEditing}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()} // Picu klik input file
                disabled={!isEditing || saving}
                className="btn-secondary disabled:opacity-50"
              >
                Change Picture
              </button>
              {previewUrl && isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    setValue("avatar", undefined, { shouldDirty: true }); // Tandai form "dirty"
                  }}
                  disabled={saving}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          
          {/* Business Information (Form tidak berubah) */}
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
                  {...register("name")}
                  disabled={!isEditing}
                  className={`input-field ${
                    !isEditing && "bg-neutral-100 cursor-not-allowed"
                  } ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Your Full Name"
                  title="Full Name"
                />
                {errors.name && (
                  <p className="text-danger text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="label-text">
                  Email (Read-only)
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
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
                  {...register("company")}
                  disabled={!isEditing}
                  className={`input-field ${
                    !isEditing && "bg-neutral-100 cursor-not-allowed"
                  } ${errors.company ? 'border-red-500' : ''}`}
                  placeholder="Company Name"
                  title="Company Name"
                />
                {errors.company && (
                  <p className="text-danger text-sm mt-1">{errors.company.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="label-text">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
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

          {/* Address (Form tidak berubah) */}
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
                  {...register("address")}
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
                  {...register("city")}
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
                  {...register("state")}
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
                  {...register("zipCode")}
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
                  {...register("country")}
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

          {/* Tax & Payment (Form tidak berubah) */}
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
                  {...register("taxId")}
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
                  {...register("bankAccount")}
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
                disabled={saving || !hasChanges} // Disable jika menyimpan ATAU tidak ada perubahan
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {saving ? (selectedFile ? "Uploading..." : "Saving...") : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
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
"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import apiHelper from "@/lib/apiHelper";
import { toast } from "sonner";
import {
  profileSchema,
  ProfileFormData,
  BusinessInfo,
  AddressInfo,
  TaxPaymentInfo,
} from "./profile-form-sections";
import { AvatarUpload } from "./avatar-upload";

export default function ProfilePage() {
  const { user, getProfile, updateProfile, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

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
        avatar: user.avatar || "",
      });

      if (user.avatar) {
        setPreviewUrl(user.avatar);
      }
    } else {
      getProfile();
    }
  }, [user, getProfile, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await apiHelper.post<{
        message: string;
        data: { url: string };
      }>("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Image uploaded!");
      return res.data.data.url;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Image upload failed");
      return null;
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    let avatarUrl = data.avatar;

    try {
      if (selectedFile) {
        const newAvatarUrl = await handleUpload();
        if (newAvatarUrl) {
          avatarUrl = newAvatarUrl;
          setValue("avatar", newAvatarUrl);
        } else {
          setSaving(false);
          return;
        }
      }

      const finalData = { ...data, avatar: avatarUrl };
      await updateProfile(finalData);

      setIsEditing(false);
      setSelectedFile(null);
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);

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

      setPreviewUrl(user.avatar || null);
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setValue("avatar", undefined, { shouldDirty: true });
  };

  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-neutral-600">Loading Profile...</div>
      </div>
    );
  }

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
          <AvatarUpload
            user={user}
            previewUrl={previewUrl}
            isEditing={isEditing}
            saving={saving}
            onFileChange={handleFileChange}
            onRemove={handleRemoveAvatar}
          />

          <BusinessInfo
            register={register}
            errors={errors}
            isEditing={isEditing}
          />

          <AddressInfo register={register} isEditing={isEditing} />

          <TaxPaymentInfo register={register} isEditing={isEditing} />

          {isEditing && (
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving || !hasChanges}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {saving
                  ? selectedFile
                    ? "Uploading..."
                    : "Saving..."
                  : "Save Changes"}
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

import { User } from "@/lib/types";
import { useRef } from "react";

interface AvatarUploadProps {
  user: User | null;
  previewUrl: string | null;
  isEditing: boolean;
  saving: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export function AvatarUpload({
  user,
  previewUrl,
  isEditing,
  saving,
  onFileChange,
  onRemove,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
          onChange={onFileChange}
          aria-label="Upload new profile picture"
          className="hidden"
          accept="image/png, image/jpeg"
          disabled={!isEditing}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={!isEditing || saving}
          className="btn-secondary disabled:opacity-50"
        >
          Change Picture
        </button>
        {previewUrl && isEditing && (
          <button
            type="button"
            onClick={onRemove}
            disabled={saving}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

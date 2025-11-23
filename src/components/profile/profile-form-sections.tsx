import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const profileSchema = z.object({
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
  avatar: z.union([z.string().url(), z.literal("")]).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ProfileFormSection({
  title,
  children,
}: ProfileFormSectionProps) {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">{title}</h2>
      {children}
    </div>
  );
}

interface BusinessInfoProps {
  register: ReturnType<typeof useForm<ProfileFormData>>["register"];
  errors: ReturnType<typeof useForm<ProfileFormData>>["formState"]["errors"];
  isEditing: boolean;
}

export function BusinessInfo({
  register,
  errors,
  isEditing,
}: BusinessInfoProps) {
  return (
    <ProfileFormSection title="Business Information">
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
            } ${errors.name ? "border-red-500" : ""}`}
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
            } ${errors.company ? "border-red-500" : ""}`}
            placeholder="Company Name"
            title="Company Name"
          />
          {errors.company && (
            <p className="text-danger text-sm mt-1">
              {errors.company.message}
            </p>
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
    </ProfileFormSection>
  );
}

interface AddressInfoProps {
  register: ReturnType<typeof useForm<ProfileFormData>>["register"];
  isEditing: boolean;
}

export function AddressInfo({ register, isEditing }: AddressInfoProps) {
  return (
    <ProfileFormSection title="Address">
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
    </ProfileFormSection>
  );
}

interface TaxPaymentInfoProps {
  register: ReturnType<typeof useForm<ProfileFormData>>["register"];
  isEditing: boolean;
}

export function TaxPaymentInfo({
  register,
  isEditing,
}: TaxPaymentInfoProps) {
  return (
    <ProfileFormSection title="Tax & Payment Information">
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
    </ProfileFormSection>
  );
}

// components/dashboard/settings/WebsiteInfoForm.tsx
"use client";

import React, { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import AccomplishmentsCard from "./AccomplishmentsCard";
import ContactInfoCard from "./ContactInfoCard";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import {
  getSiteSettings,
  updateSiteSettings,
} from "@/services/settings/siteSettings";

type FormValues = {
  email?: string;
  phone?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  snapchat?: string;
  tiktok?: string;
  youtube?: string;
  clients?: number;
  experienceYears?: number;
  projects?: number;
};

type Props = {
  defaultValues?: Partial<FormValues>;
};

export default function WebsiteInfoForm({ defaultValues = {} }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues,
  });

  const submit = async (values: FieldValues) => {
    try {
      setIsLoading(true);
      setMessage(null);

      // Convert form values to API expected format
      const updateData = {
        email: values.email || "",
        phoneNumber: values.phone || "",
        twitterUrl: values.twitter || "",
        instagramUrl: values.instagram || "",
        snapchatUrl: values.snapchat || "",
        tiktokUrl: values.tiktok || "",
        youtubeUrl: values.youtube || "",
        customerCount: Number(values.clients) || 0,
        yearsExperience: Number(values.experienceYears) || 0,
        projectCount: Number(values.projects) || 0,
      };

      const updatedSettings = await updateSiteSettings(updateData);

      setMessage({
        type: "success",
        text: "تم تحديث إعدادات الموقع بنجاح",
      });

      // Reset form state with the mapped data from server
      reset(mapApiResponseToForm(updatedSettings));
    } catch (error: any) {
      console.error("Update error:", error);

      let errorMessage = "فشل في تحديث إعدادات الموقع";

      // Handle specific error cases
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset(defaultValues);
    setMessage(null);
  };

  return (
    <>
      {message && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        <ContactInfoCard control={control} />

        <AccomplishmentsCard control={control} />

        <div className="space-x-4 flex items-center justify-start">
          <PrimaryButton type="submit" disabled={isLoading || !isDirty}>
            {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </PrimaryButton>
          <SoftActionButton
            onClick={handleCancel}
            type="button"
            disabled={isLoading}
          >
            إلغاء
          </SoftActionButton>
        </div>
      </form>
    </>
  );
}

// Helper function to map API response to form values
export function mapApiResponseToForm(apiData: any): FormValues {
  return {
    email: apiData.email || "",
    phone: apiData.phoneNumber || "",
    twitter: apiData.twitterUrl || "",
    instagram: apiData.instagramUrl || "",
    snapchat: apiData.snapchatUrl || "",
    tiktok: apiData.tiktokUrl || "",
    youtube: apiData.youtubeUrl || "",
    clients: apiData.customerCount || 0,
    experienceYears: apiData.yearsExperience || 0,
    projects: apiData.projectCount || 0,
  };
}

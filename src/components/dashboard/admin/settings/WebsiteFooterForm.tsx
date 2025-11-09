"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Card from "@/components/shared/Card";
import TextareaInput from "@/components/shared/Forms/TextareaInput";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import {
  getFooterSettings,
  patchFooterSettings,
} from "@/services/settings/footerSettings";

type FormValues = {
  footerTitle?: string;
  footerParagraph?: string;
  newsletterTitle?: string;
  newsletterParagraph?: string;
};

type Props = {
  defaultValues?: Partial<FormValues>;
};

export default function WebsiteFooterForm({ defaultValues = {} }: Props) {
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

  const submit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      setMessage(null);

      // Convert to API expected format
      const updateData = {
        footerParagraph: values.footerParagraph || "",
        newsletterTitle: values.newsletterTitle || "",
        newsletterParagraph: values.newsletterParagraph || "",
      };

      const updatedSettings = await patchFooterSettings(updateData);

      setMessage({
        type: "success",
        text: "تم تحديث إعدادات الفوتر بنجاح",
      });

      // Reset form state with the updated data from server
      reset(mapApiResponseToForm(updatedSettings));
    } catch (error: any) {
      console.error("Update error:", error);

      let errorMessage = "فشل في تحديث إعدادات الفوتر";

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
        <Card title="الفوتر" className="space-y-4">
          <Controller
            name="footerParagraph"
            control={control}
            render={({ field }) => (
              <TextareaInput
                id="footer-paragraph"
                name={field.name}
                label="فقرة الفوتر"
                placeholder="أدخل نص الفوتر (فقرة تعريفية، حقوق الملكية، روابط قصيرة...)"
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="newsletterTitle"
            control={control}
            render={({ field }) => (
              <TextareaInput
                id="newsletter-title"
                name={field.name}
                label="عنوان النشرة"
                placeholder="مثال: اشترك لتصلك آخر العروض"
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="newsletterParagraph"
            control={control}
            render={({ field }) => (
              <TextareaInput
                id="newsletter-paragraph"
                name={field.name}
                label="فقرة النشرة"
                placeholder="نص يشرح ما سيحصل عليه المشتركون"
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </Card>

        <div className="space-x-4 flex items-center justify-start">
          <PrimaryButton type="submit" disabled={isLoading || !isDirty}>
            {isLoading ? "جاري الحفظ..." : "حفظ الفوتر"}
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
    footerParagraph: apiData.footerParagraph || "",
    newsletterTitle: apiData.newsletterTitle || "",
    newsletterParagraph: apiData.newsletterParagraph || "",
  };
}

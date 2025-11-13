// CampaignFormUpdate component
"use client";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { campaignSchema, CampaignFormData } from "@/types/campaign";
import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import TextareaInput from "@/components/shared/Forms/TextareaInput";
import Uploader from "@/components/shared/Forms/Uploader";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";

import { useState } from "react";
import { createCampaign, updateCampaign } from "@/services/campaigns/campaigns";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RunSettings from "@/components/dashboard/admin/campaign/RunSettings";
import TargetSettings from "@/components/dashboard/admin/campaign/TargetSettings";

interface CampaignFormUpdateProps {
  campaignId?: any;
  initialData?: Partial<CampaignFormData>;
}

export default function CampaignFormUpdate({
  campaignId,
  initialData,
}: CampaignFormUpdateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Remove validation for update mode by conditionally applying resolver
  const formConfig = campaignId
    ? {
        defaultValues: {
          campaignName: initialData?.campaignName || "",
          campaignTitle: initialData?.campaignTitle || "",
          campaignDescription: initialData?.campaignDescription || "",
          campaignImages: initialData?.campaignImages || [],
          targetChannel: initialData?.targetChannel || "email",
          targetAudience: initialData?.targetAudience || "all_users",
          runType: initialData?.runType || "once",
          runOnceDateTime: initialData?.runOnceDateTime || "",
          startDate: initialData?.startDate || "",
          endDate: initialData?.endDate || "",
          isDraft: initialData?.isDraft || false,
          runFrequency: initialData?.runFrequency || "daily",
          runTime: initialData?.runTime || "09:00",
          messageContent: initialData?.messageContent || "",
        },
      }
    : {
        resolver: zodResolver(campaignSchema),
        defaultValues: {
          campaignName: initialData?.campaignName || "",
          campaignTitle: initialData?.campaignTitle || "",
          campaignDescription: initialData?.campaignDescription || "",
          campaignImages: initialData?.campaignImages || [],
          targetChannel: initialData?.targetChannel || "email",
          targetAudience: initialData?.targetAudience || "all_users",
          runType: initialData?.runType || "once",
          runOnceDateTime: initialData?.runOnceDateTime || "",
          startDate: initialData?.startDate || "",
          endDate: initialData?.endDate || "",
          isDraft: initialData?.isDraft || false,
          runFrequency: initialData?.runFrequency || "daily",
          runTime: initialData?.runTime || "09:00",
          messageContent: initialData?.messageContent || "",
        },
      };

  const {
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CampaignFormData>(formConfig);

  // Fix time format function
  const formatTimeForAPI = (timeString: string): string => {
    if (!timeString) return "09:00:00";

    // If already in HH:MM:SS format, return as is
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    // If in HH:MM format, add seconds
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return `${timeString}:00`;
    }

    // Default fallback
    return "09:00:00";
  };

  async function onSubmit(data: CampaignFormData) {
    setIsLoading(true);

    try {
      // For update mode, only validate essential fields
      if (campaignId) {
        // UPDATE - Only validate essential fields
        const essentialFields = {
          campaignTitle: data.campaignTitle?.trim(),
          campaignDescription: data.campaignDescription?.trim(),
          messageContent: data.messageContent?.trim(),
        };

        const missingFields = Object.entries(essentialFields)
          .filter(([_, value]) => !value)
          .map(([key]) => key);

        if (missingFields.length > 0) {
          toast.error(`الحقول التالية مطلوبة: ${missingFields.join(", ")}`);
          setIsLoading(false);
          return;
        }

        const apiUpdateData = {
          title: data.campaignTitle!.trim(),
          description: data.campaignDescription!.trim(),
          targetAudience: data.targetAudience,
          runType: data.runType,
          runFrequency:
            data.runType === "recurring" ? data.runFrequency : "daily",
          runTime: formatTimeForAPI(data?.runTime), // FIXED: Use proper time formatting
          status: data.isDraft ? "draft" : "scheduled",
          messageContent: data.messageContent!.trim(),
        };

        await updateCampaign(parseInt(campaignId), apiUpdateData);
        toast.success("تم تحديث الحملة بنجاح");
      } else {
        // CREATE - Use full validation
        const createData = {
          name: (data.campaignName || "").trim(),
          title: data.campaignTitle!.trim(),
          description: data.campaignDescription!.trim(),
          targetChannel: data.targetChannel || "email",
          targetAudience: data.targetAudience!,
          runType: data.runType!,
          runOnceDatetime:
            data.runType === "once" && data.runOnceDateTime
              ? new Date(data.runOnceDateTime).toISOString()
              : null,
          startDate: data.startDate
            ? new Date(data.startDate).toISOString()
            : null,
          endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
          runFrequency:
            data.runType === "recurring"
              ? data.runFrequency || "daily"
              : "daily",
          runTime: formatTimeForAPI(data.runTime), // FIXED: Use proper time formatting
          status: data.isDraft ? "draft" : "scheduled",
          messageContent: data.messageContent!.trim(),
          images:
            data.campaignImages?.map(
              (image: any) => image.url || image.imageUrl || image
            ) || [],
        };

        await createCampaign(createData);
        toast.success("تم إنشاء الحملة بنجاح");
      }

      // Redirect to campaigns list
      router.push("/dashboard/admin/campaigns");
    } catch (error: any) {
      console.error("Error saving campaign:", error);

      const errorMessage =
        error.response?.data?.message ||
        (campaignId ? "فشل في تحديث الحملة" : "فشل في إنشاء الحملة");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  function onError(errors: FieldErrors<CampaignFormData>) {
    // For update mode, show minimal errors
    if (campaignId) {
      const essentialErrors = {
        campaignTitle: errors.campaignTitle,
        campaignDescription: errors.campaignDescription,
        messageContent: errors.messageContent,
      };

      const errorMessages = Object.values(essentialErrors)
        .map((error) => error?.message)
        .filter(Boolean);

      if (errorMessages.length > 0) {
        toast.error(`يرجى تصحيح الأخطاء التالية: ${errorMessages.join(", ")}`);
      }
    } else {
      // For create mode, show all errors
      const errorMessages = Object.values(errors)
        .map((error) => error?.message)
        .filter(Boolean);

      if (errorMessages.length > 0) {
        toast.error(`يرجى تصحيح الأخطاء التالية: ${errorMessages.join(", ")}`);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      {/* Basic Information */}
      <Card title="المعلومات الأساسية">
        <div className="space-y-4">
          {!campaignId && (
            <TextInput
              id="campaignName"
              label="اسم الحملة (للمديرين)"
              placeholder="أدخل اسم الحملة"
              name="campaignName"
              value={watch("campaignName")}
              onChange={(e) =>
                setValue("campaignName", e.target.value, {
                  shouldValidate: !campaignId, // FIXED: Should validate in create mode, not update
                })
              }
              error={campaignId ? undefined : errors.campaignName?.message}
            />
          )}

          <TextInput
            id="campaignTitle"
            label="عنوان الحملة"
            placeholder="أدخل عنوان الحملة"
            name="campaignTitle"
            value={watch("campaignTitle")}
            onChange={(e) =>
              setValue("campaignTitle", e.target.value, {
                shouldValidate: true,
              })
            }
            error={errors.campaignTitle?.message}
            required
          />

          <TextareaInput
            id="campaignDescription"
            label="وصف الحملة"
            placeholder="أدخل وصف الحملة"
            name="campaignDescription"
            value={watch("campaignDescription")}
            onChange={(e) =>
              setValue("campaignDescription", e.target.value, {
                shouldValidate: true,
              })
            }
            error={errors.campaignDescription?.message}
            required
          />

          {/* Message Content Field */}
          <TextareaInput
            id="messageContent"
            label="محتوى الرسالة"
            placeholder="أدخل محتوى الرسالة التي سيتم إرسالها"
            name="messageContent"
            value={watch("messageContent")}
            onChange={(e) =>
              setValue("messageContent", e.target.value, {
                shouldValidate: true,
              })
            }
            error={errors.messageContent?.message}
            required
          />
        </div>
      </Card>

      {/* Campaign Images - No validation for update mode */}
      <Card title="صور الحملة">
        <div className="space-y-4">
          {campaignId ? (
            // Update mode - show disabled state
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 text-sm">
                  لا يمكن تعديل صور الحملة بعد الإنشاء. لتحميل صور جديدة، يرجى
                  إنشاء حملة جديدة.
                </p>
              </div>
              {initialData?.campaignImages &&
                initialData.campaignImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      الصور الحالية:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {initialData.campaignImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.url || image}
                            alt={`Campaign image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            // Create mode - show uploader with validation
            <>
              <Uploader
                control={control}
                name="campaignImages"
                accept="image/jpeg,image/png,image/webp"
                allowMultiple={true}
                allowPrimary={false}
                maxFiles={5}
                maxSizeMB={5}
                rules={[
                  "يمكن رفع حتى 5 صور",
                  "الأنواع المدعومة: JPG, PNG, WebP",
                  "الحد الأقصى لحجم الملف 5MB",
                ]}
              />
              {errors.campaignImages && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {errors.campaignImages.message}
                </p>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Excel Files - Only show for create */}
      {!campaignId && (
        <Card title="إرفاق ملفات اكسل (اختياري)">
          <div className="space-y-4">
            <Uploader
              control={control}
              name="campaignExcel"
              accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              allowMultiple={true}
              allowPrimary={false}
              maxFiles={2}
              maxSizeMB={9}
              rules={["يمكن رفع ملفين كحد أقصى", "الحد الأقصى لحجم الملف 9MB"]}
            />
            {errors.campaignExcel && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                {errors.campaignExcel.message}
              </p>
            )}
          </div>
        </Card>
      )}

      <RunSettings
        control={control}
        watch={watch}
        setValue={setValue}
        errors={campaignId ? {} : errors} // Pass empty errors object for update mode
        isUpdate={!!campaignId}
      />

      <TargetSettings
        control={control}
        errors={campaignId ? {} : errors} // Pass empty errors object for update mode
        isUpdate={!!campaignId}
      />

      {/* Draft Option */}
      <Card title="خيارات الحفظ">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={watch("isDraft")}
              onChange={(e) =>
                setValue("isDraft", e.target.checked, {
                  shouldValidate: !campaignId, // FIXED: Should validate in create mode, not update
                })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              حفظ كمسودة
            </span>
          </label>
          <p className="text-sm text-gray-500">
            {watch("isDraft")
              ? "سيتم حفظ الحملة كمسودة ولن يتم تشغيلها تلقائياً"
              : "سيتم جدولة الحملة للبدء وفقاً للإعدادات المحددة"}
          </p>
        </div>
      </Card>

      {/* Submit Buttons */}
      <div className="col-span-12 flex items-center gap-6 flex-wrap">
        <PrimaryButton type="submit" disabled={isLoading}>
          {isLoading
            ? "جاري الحفظ..."
            : campaignId
            ? watch("isDraft")
              ? "حفظ كمسودة"
              : "تحديث الحملة"
            : watch("isDraft")
            ? "حفظ كمسودة"
            : "إنشاء وجدولة الحملة"}
        </PrimaryButton>

        <SoftActionButton
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          إلغاء
        </SoftActionButton>
      </div>
    </form>
  );
}

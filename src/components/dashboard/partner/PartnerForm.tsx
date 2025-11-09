"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import SelectInput from "@/components/shared/Forms/SelectInput";
import { Partner, PartnerKind } from "@/services/partner/partner";
import { useRouter } from "next/navigation";
import { createPartner, updatePartner } from "@/services/partner/partner";
import useCampaigns from "@/hooks/dashboard/admin/campaign/useCampaigns";
import toast from "react-hot-toast";

type Props = {
  partner?: Partner;
  isAdmin?: boolean;
  onSuccess?: (response: { partner: Partner; shareUrl: string }) => void; // Callback for success with response
};

// 🧠 Define Zod schema
const schema = z.object({
  name: z
    .string()
    .min(2, "الاسم يجب أن يكون على الأقل حرفين")
    .max(100, "الاسم طويل جداً"),
  kind: z.enum(["internal", "external"], {
    required_error: "نوع الشريك مطلوب",
  }),
  referralCode: z
    .string()
    .min(3, "كود الإحالة يجب أن يكون على الأقل 3 أحرف")
    .max(20, "كود الإحالة طويل جداً")
    .optional(),
  campaignId: z.number().optional().nullable(),
  baseShareUrl: z
    .string()
    .url("رابط المشاركة يجب أن يكون رابط صحيح")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export default function PartnerForm({
  partner,
  isAdmin = false,
  onSuccess,
}: Props) {
  const router = useRouter();
  const getCampaignsRows = useCampaigns();
  const [campaigns, setCampaigns] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [createdPartnerData, setCreatedPartnerData] = useState<{
    partner: Partner;
    shareUrl: string;
  } | null>(null);

  const isEdit = !!partner;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: partner?.name || "",
      kind: partner?.kind || "external",
      referralCode: partner?.referralCode || "",
      campaignId: partner?.campaign?.id || null,
      baseShareUrl: "",
      isActive: partner?.isActive ?? true,
    },
  });

  // Fetch campaigns on component mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoadingCampaigns(true);
        const result = await getCampaignsRows();

        if (result.rows && result.rows.length > 0) {
          const campaignOptions = result.rows.map((campaign) => ({
            id: parseInt(campaign.id),
            name: campaign.campaignName,
          }));
          setCampaigns(campaignOptions);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("فشل في تحميل قائمة الحملات", {
          duration: 5000,
          position: "top-center",
          icon: "❌",
          style: {
            background: "#EF4444",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
          },
        });
      } finally {
        setLoadingCampaigns(false);
      }
    };

    fetchCampaigns();
  }, [getCampaignsRows]);

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = {
        name: data.name,
        kind: data.kind,
        referralCode: data.referralCode || undefined,
        campaignId: data.campaignId || undefined,
        baseShareUrl: data.baseShareUrl || undefined,
        isActive: data.isActive,
      };

      if (partner) {
        // Update existing partner
        await updatePartner(partner.id, formData);
        toast.success("تم تحديث بيانات الشريك بنجاح", {
          duration: 4000,
          position: "top-center",
          icon: "✅",
          style: {
            background: "#10B981",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
          },
        });
        console.log("🔄 تم تحديث الشريك:", { id: partner.id, ...formData });

        // Redirect to partners list after successful update
        setTimeout(() => {
          router.push("/dashboard/admin/partners");
          router.refresh();
        }, 1000);
      } else {
        // Create new partner
        const response = await createPartner(formData);

        // Store the response data to display share URL
        setCreatedPartnerData(response);

        toast.success("تم إضافة الشريك بنجاح", {
          duration: 4000,
          position: "top-center",
          icon: "✅",
          style: {
            background: "#10B981",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
          },
        });
        console.log("🆕 تم إضافة شريك جديد:", response);

        // Call the success callback if provided
        if (onSuccess) {
          onSuccess(response);
        }
      }
    } catch (error: any) {
      console.error("❌ خطأ في حفظ البيانات:", error);

      const errorMessage =
        error?.response?.data?.message ||
        "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.";

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
        icon: "❌",
        style: {
          background: "#EF4444",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    }
  };

  const handleCancel = () => {
    reset({
      name: partner?.name || "",
      kind: partner?.kind || "external",
      referralCode: partner?.referralCode || "",
      campaignId: partner?.campaign?.id || null,
      baseShareUrl: "",
      isActive: partner?.isActive ?? true,
    });

    // Clear created partner data if canceling after creation
    if (createdPartnerData) {
      setCreatedPartnerData(null);
    }

    toast.success("تم إلغاء التغييرات", {
      duration: 3000,
      position: "top-center",
      icon: "ℹ️",
      style: {
        background: "#6B7280",
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
      },
    });
  };

  const handleContinue = () => {
    // Clear the created partner data and reset form for new entry
    setCreatedPartnerData(null);
    reset({
      name: "",
      kind: "external",
      referralCode: "",
      campaignId: null,
      baseShareUrl: "",
      isActive: true,
    });
  };

  const handleViewPartners = () => {
    router.push("/dashboard/admin/partners");
    router.refresh();
  };

  const currentKind = watch("kind");

  // If we have created partner data, show success message with share URL
  if (createdPartnerData && !partner) {
    return (
      <Card title="تم إضافة الشريك بنجاح">
        <div className="space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-green-800">
                تم إضافة الشريك بنجاح
              </h3>
            </div>

            <div className="space-y-3">
              <InfoBlock
                label="اسم الشريك"
                value={createdPartnerData.partner.name}
              />
              <InfoBlock
                label="نوع الشريك"
                value={
                  createdPartnerData.partner.kind === "internal"
                    ? "داخلي"
                    : "خارجي"
                }
              />
              <InfoBlock
                label="كود الإحالة"
                value={createdPartnerData.partner.referralCode}
                valueClassName="font-mono"
              />

              {createdPartnerData.partner.campaign && (
                <InfoBlock
                  label="الحملة"
                  value={createdPartnerData.partner.campaign.name}
                />
              )}
            </div>
          </div>

          {/* Share URL Section */}
          {isAdmin && createdPartnerData.shareUrl && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">
                رابط المشاركة
              </h4>

              <div className="space-y-3">
                <p className="text-sm text-blue-700">
                  شارك هذا الرابط مع الشريك لبدء تتبع الزيارات والتحويلات:
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={createdPartnerData.shareUrl}
                    readOnly
                    className="flex-1 p-3 border border-blue-300 rounded-lg bg-white text-sm text-gray-700 font-mono"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        createdPartnerData.shareUrl
                      );
                      toast.success("تم نسخ الرابط", {
                        duration: 3000,
                        position: "top-center",
                      });
                    }}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="نسخ الرابط"
                  >
                    نسخ
                  </button>
                </div>

                <p className="text-xs text-blue-600">
                  هذا الرابط يحتوي على جميع معلمات التتبع اللازمة لربط الزيارات
                  بالشريك.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4 flex-wrap pt-4 border-t">
            <PrimaryButton onClick={handleContinue}>
              إضافة شريك جديد
            </PrimaryButton>
            <SoftActionButton onClick={handleViewPartners}>
              عرض جميع الشركاء
            </SoftActionButton>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title={partner ? "تعديل معلومات الشريك" : "إضافة شريك جديد"}>
      {/* النموذج */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-4"
      >
        <div className="col-span-12 md:col-span-6">
          <TextInput
            id="name"
            label="اسم الشريك"
            placeholder="أدخل اسم الشريك"
            {...register("name")}
            error={errors.name?.message}
            required
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <SelectInput
            name="kind"
            label="نوع الشريك"
            value={watch("kind")}
            onChange={(val) => setValue("kind", val as PartnerKind)}
            options={[
              { label: "داخلي", value: "internal" },
              { label: "خارجي", value: "external" },
            ]}
            error={errors.kind?.message}
            required
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <TextInput
            id="referralCode"
            label="كود الإحالة"
            placeholder="أدخل كود الإحالة"
            {...register("referralCode")}
            error={errors.referralCode?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <SelectInput
            name="campaignId"
            label="الحملة"
            value={watch("campaignId")?.toString() || ""}
            onChange={(val) =>
              setValue("campaignId", val ? parseInt(val) : null)
            }
            options={[
              { label: "بدون حملة", value: "" },
              ...campaigns.map((campaign) => ({
                label: campaign.name,
                value: campaign.id.toString(),
              })),
            ]}
            error={errors.campaignId?.message}
            disabled={loadingCampaigns}
            helperText={loadingCampaigns ? "جاري تحميل الحملات..." : ""}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <TextInput
            id="baseShareUrl"
            type="url"
            label="رابط المشاركة الأساسي"
            placeholder="https://example.com"
            {...register("baseShareUrl")}
            error={errors.baseShareUrl?.message}
          />
        </div>

        {isAdmin && (
          <div className="col-span-12 md:col-span-6">
            <SelectInput
              name="isActive"
              label="حالة الشريك"
              value={watch("isActive") ? "true" : "false"}
              onChange={(val) => setValue("isActive", val === "true")}
              options={[
                { label: "نشط", value: "true" },
                { label: "غير نشط", value: "false" },
              ]}
              error={errors.isActive?.message}
            />
          </div>
        )}

        <div className="col-span-12 flex items-center gap-6 flex-wrap pt-4 border-t">
          <PrimaryButton
            type="submit"
            disabled={isSubmitting || loadingCampaigns}
          >
            {isSubmitting
              ? "جاري الحفظ..."
              : partner
              ? "تحديث بيانات الشريك"
              : "إضافة شريك جديد"}
          </PrimaryButton>
          <SoftActionButton
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            إلغاء
          </SoftActionButton>
        </div>
      </form>
    </Card>
  );
}

// Helper InfoBlock component for success display
function InfoBlock({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className={`text-sm text-gray-800 ${valueClassName}`}>{value}</span>
    </div>
  );
}

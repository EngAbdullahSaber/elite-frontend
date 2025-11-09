// components/dashboard/shortLinks/ShortLinkForm.tsx
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
import {
  ShortLinkRow,
  ShortLinkStatus,
  shortLinkStatusMap,
  generateShortUrl,
  shortLinkValidation,
} from "@/types/dashboard/shortLink";
import {
  createShortLink,
  updateShortLink,
} from "@/services/shortLinks/shortLinks";
import { getCampaigns } from "@/services/campaigns/campaigns";
import { getInfluencers } from "@/services/Influencer/Influencer";
import { getMarketers } from "@/services/marketers/marketers";
import toast from "react-hot-toast";
import UserChanger from "../UserChanger";

// Types for dropdown options
interface Campaign {
  id: number;
  name: string;
  status: string;
}

interface Influencer {
  id: number;
  name: string;
  handle: string | null;
  platform: string;
}

interface Marketer {
  id: number;
  referralCode: string;
  user: {
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
}

// User type for UserChanger
interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

// Props
type Props = {
  shortLink?: ShortLinkRow;
  isAdmin?: boolean;
  onSuccess?: () => void;
};

// 🧠 Define Zod schema
const schema = z.object({
  slug: z
    .string()
    .min(3, shortLinkValidation.slug.minLength.message)
    .max(50, shortLinkValidation.slug.maxLength.message)
    .regex(/^[a-zA-Z0-9_-]+$/, shortLinkValidation.slug.pattern.message),
  destination: z
    .string()
    .min(1, shortLinkValidation.destination.required)
    .regex(/^https?:\/\/.+/, shortLinkValidation.destination.pattern.message),
  campaignId: z.number().optional().nullable(),
  influencerId: z.number().optional().nullable(),
  marketerId: z.number().optional().nullable(),
  status: z.enum(["active", "inactive"]),
});

type FormValues = z.infer<typeof schema>;

export default function ShortLinkForm({
  shortLink,
  isAdmin = false,
  onSuccess,
}: Props) {
  const isEdit = !!shortLink;
  const [isLoading, setIsLoading] = React.useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [marketers, setMarketers] = useState<Marketer[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Selected items state
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);
  const [selectedMarketer, setSelectedMarketer] = useState<Marketer | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: shortLink?.slug || "",
      destination: shortLink?.destination || "",
      campaignId: shortLink?.campaignId ? parseInt(shortLink.campaignId) : null,
      influencerId: shortLink?.influencerId
        ? parseInt(shortLink.influencerId)
        : null,
      marketerId: shortLink?.marketerId ? parseInt(shortLink.marketerId) : null,
      status: shortLink?.status ?? "active",
    },
  });

  // Fetch data for dropdowns
  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Set initial selected values when data is loaded or in edit mode
  useEffect(() => {
    if (shortLink && campaigns.length > 0) {
      const campaign = campaigns.find(
        (c) => shortLink.campaignId && c.id.toString() === shortLink.campaignId
      );
      if (campaign) {
        setSelectedCampaign(campaign);
        setValue("campaignId", campaign.id, { shouldDirty: false });
      }
    }
  }, [shortLink, campaigns, setValue]);

  useEffect(() => {
    if (shortLink && influencers.length > 0) {
      const influencer = influencers.find(
        (i) =>
          shortLink.influencerId && i.id.toString() === shortLink.influencerId
      );
      if (influencer) {
        setSelectedInfluencer(influencer);
        setValue("influencerId", influencer.id, { shouldDirty: false });
      }
    }
  }, [shortLink, influencers, setValue]);

  useEffect(() => {
    if (shortLink && marketers.length > 0) {
      const marketer = marketers.find(
        (m) => shortLink.marketerId && m.id.toString() === shortLink.marketerId
      );
      if (marketer) {
        setSelectedMarketer(marketer);
        setValue("marketerId", marketer.id, { shouldDirty: false });
      }
    }
  }, [shortLink, marketers, setValue]);

  const fetchDropdownData = async () => {
    try {
      setDataLoading(true);

      // Fetch campaigns
      const campaignsData = await getCampaigns({
        limit: 100,
      });

      // Fetch influencers
      const influencersData = await getInfluencers({
        limit: 100,
      });

      // Fetch marketers
      const marketersData = await getMarketers({
        limit: 100,
      });

      setCampaigns(campaignsData.records || []);
      setInfluencers(influencersData.records || []);
      setMarketers(marketersData.records || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      toast.error("فشل في تحميل البيانات");
    } finally {
      setDataLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = (value: string) => {
    setValue("status", value as ShortLinkStatus, { shouldDirty: true });
  };

  // Handle campaign change
  const handleCampaignChange = (campaign: Campaign | null) => {
    setSelectedCampaign(campaign);
    const campaignId = campaign ? campaign.id : null;
    setValue("campaignId", campaignId, { shouldDirty: true });
  };

  // Handle influencer change
  const handleInfluencerChange = (influencer: Influencer | null) => {
    setSelectedInfluencer(influencer);
    const influencerId = influencer ? influencer.id : null;
    setValue("influencerId", influencerId, { shouldDirty: true });
  };

  // Handle marketer change
  const handleMarketerChange = (marketer: Marketer | null) => {
    setSelectedMarketer(marketer);
    const marketerId = marketer ? marketer.id : null;
    setValue("marketerId", marketerId, { shouldDirty: true });
  };

  // Format campaigns for UserChanger
  const formatCampaigns = (campaigns: Campaign[]) => {
    return campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      email: "", // Campaigns don't have email
      phone: "", // Campaigns don't have phone
      status: campaign.status,
    }));
  };

  // Format influencers for UserChanger
  const formatInfluencers = (influencers: Influencer[]) => {
    return influencers.map((influencer) => ({
      id: influencer.id,
      name: influencer.name,
      email: influencer.handle || "", // Use handle as email substitute
      phone: influencer.platform, // Use platform as phone substitute
      handle: influencer.handle,
      platform: influencer.platform,
    }));
  };

  // Format marketers for UserChanger
  const formatMarketers = (marketers: Marketer[]) => {
    return marketers.map((marketer) => ({
      id: marketer.id,
      name: marketer.user.fullName,
      email: marketer.user.email,
      phone: marketer.user.phoneNumber || "",
      referralCode: marketer.referralCode,
    }));
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);

      // Prepare the data in the exact format expected by the API
      const shortLinkData = {
        destination: data.destination,
        isActive: data.status === "active",
        influencerId: data.influencerId || null,
        marketerId: data.marketerId || null,
        campaignId: data.campaignId || null,
      };

      console.log("📤 Sending data to API:", shortLinkData);

      if (isEdit && shortLink) {
        // Update existing short link
        await updateShortLink(parseInt(shortLink.id), shortLinkData);

        toast.success("تم تحديث بيانات الرابط بنجاح", {
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

        console.log("🔄 تم تحديث الرابط:", {
          id: shortLink.id,
          ...shortLinkData,
        });
      } else {
        // Create new short link - include slug for creation
        await createShortLink({
          slug: data.slug,
          ...shortLinkData,
        });

        toast.success("تم إضافة الرابط بنجاح", {
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

        console.log("🆕 تم إضافة رابط جديد:", {
          slug: data.slug,
          ...shortLinkData,
        });
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving short link:", error);

      const errorMessage =
        error?.response?.data?.message ||
        "فشل في حفظ البيانات. يرجى المحاولة مرة أخرى.";

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      slug: shortLink?.slug || "",
      destination: shortLink?.destination || "",
      campaignId: shortLink?.campaignId ? parseInt(shortLink.campaignId) : null,
      influencerId: shortLink?.influencerId
        ? parseInt(shortLink.influencerId)
        : null,
      marketerId: shortLink?.marketerId ? parseInt(shortLink.marketerId) : null,
      status: shortLink?.status ?? "active",
    });

    // Reset selected items
    if (shortLink && campaigns.length > 0) {
      const campaign = campaigns.find(
        (c) => shortLink.campaignId && c.id.toString() === shortLink.campaignId
      );
      setSelectedCampaign(campaign || null);
    } else {
      setSelectedCampaign(null);
    }

    if (shortLink && influencers.length > 0) {
      const influencer = influencers.find(
        (i) =>
          shortLink.influencerId && i.id.toString() === shortLink.influencerId
      );
      setSelectedInfluencer(influencer || null);
    } else {
      setSelectedInfluencer(null);
    }

    if (shortLink && marketers.length > 0) {
      const marketer = marketers.find(
        (m) => shortLink.marketerId && m.id.toString() === shortLink.marketerId
      );
      setSelectedMarketer(marketer || null);
    } else {
      setSelectedMarketer(null);
    }
  };

  const statusOptions = [
    { label: "نشط", value: "active" },
    { label: "غير نشط", value: "inactive" },
  ];

  // Generate preview URL
  const slugValue = watch("slug");
  const destination = watch("destination");
  const previewUrl = slugValue ? generateShortUrl(slugValue) : "";

  return (
    <Card title={shortLink ? "تعديل الرابط القصير" : "إضافة رابط قصير جديد"}>
      {/* النموذج */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-4"
      >
        {/* Only show slug field when creating new short link */}
        {!isEdit && (
          <div className="col-span-12 md:col-span-6">
            <TextInput
              id="slug"
              label="الرابط المختصر"
              placeholder="winter-sale-2024"
              {...register("slug", {
                onChange: () => {
                  setValue("slug", watch("slug"), { shouldDirty: true });
                },
              })}
              error={errors.slug?.message}
              required
              dir="ltr"
              className="text-left"
            />
            {slugValue && (
              <p className="text-sm text-gray-600 mt-1">
                المعاينة:{" "}
                <span className="text-blue-600 font-mono">{previewUrl}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              استخدم أحرف إنجليزية وأرقام وشرطات فقط (a-z, 0-9, -_)
            </p>
          </div>
        )}

        {/* Show slug as read-only when editing */}
        {isEdit && shortLink && (
          <div className="col-span-12 md:col-span-6">
            <TextInput
              id="slug"
              label="الرابط المختصر"
              value={shortLink.slug}
              readOnly
              dir="ltr"
              className="text-left bg-gray-50"
            />
            <p className="text-sm text-gray-600 mt-1">
              المعاينة:{" "}
              <a
                href={generateShortUrl(shortLink.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-mono text-sm"
              >
                {generateShortUrl(shortLink.slug)}
              </a>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              لا يمكن تعديل الرابط المختصر بعد الإنشاء
            </p>
          </div>
        )}

        <div className="col-span-12 md:col-span-6">
          <TextInput
            id="destination"
            label="الرابط الوجهة"
            placeholder="https://example.com/page"
            {...register("destination", {
              onChange: () => {
                setValue("destination", watch("destination"), {
                  shouldDirty: true,
                });
              },
            })}
            error={errors.destination?.message}
            required
            dir="ltr"
            className="text-left"
          />
          <p className="text-sm text-gray-500 mt-1">
            يجب أن يبدأ الرابط بـ http:// أو https://
          </p>
        </div>

        {/* Campaign Selector */}
        <div className="col-span-12 md:col-span-6">
          <label className="text-xl font-medium block mb-3">
            الحملة (اختياري)
          </label>
          <UserChanger
            users={formatCampaigns(campaigns)}
            label="الحملة (اختياري)"
            onChange={(user) => {
              const campaign = user
                ? campaigns.find((c) => c.id === user.id) || null
                : null;
              handleCampaignChange(campaign);
            }}
            loading={dataLoading}
            selectedUser={
              selectedCampaign
                ? {
                    id: selectedCampaign.id,
                    name: selectedCampaign.name,
                    email: "",
                    phone: selectedCampaign.status,
                  }
                : null
            }
            placeholder="اختر الحملة..."
          />
        </div>

        {/* Influencer Selector */}
        <div className="col-span-12 md:col-span-6">
          <label className="text-xl font-medium block mb-3">
            المؤثر (اختياري)
          </label>

          <UserChanger
            users={formatInfluencers(influencers)}
            label="المؤثر (اختياري)"
            onChange={(user) => {
              const influencer = user
                ? influencers.find((i) => i.id === user.id) || null
                : null;
              handleInfluencerChange(influencer);
            }}
            loading={dataLoading}
            selectedUser={
              selectedInfluencer
                ? {
                    id: selectedInfluencer.id,
                    name: selectedInfluencer.name,
                    email: selectedInfluencer.handle || "",
                    phone: selectedInfluencer.platform,
                  }
                : null
            }
            placeholder="اختر المؤثر..."
          />
        </div>

        {/* Marketer Selector */}
        <div className="col-span-12 md:col-span-6">
          <label className="text-xl font-medium block mb-3">
            المسوق (اختياري)
          </label>

          <UserChanger
            users={formatMarketers(marketers)}
            label="المسوق (اختياري)"
            onChange={(user) => {
              const marketer = user
                ? marketers.find((m) => m.id === user.id) || null
                : null;
              handleMarketerChange(marketer);
            }}
            loading={dataLoading}
            selectedUser={
              selectedMarketer
                ? {
                    id: selectedMarketer.id,
                    name: selectedMarketer.user.fullName,
                    email: selectedMarketer.user.email,
                    phone: selectedMarketer.user.phoneNumber || "",
                  }
                : null
            }
            placeholder="اختر المسوق..."
          />
        </div>

        {isAdmin && (
          <div className="col-span-12 md:col-span-6">
            <SelectInput
              name="status"
              label="حالة الرابط"
              value={watch("status")}
              onChange={handleStatusChange}
              options={statusOptions}
              error={errors.status?.message}
            />
          </div>
        )}

        {/* Preview Section */}
        {destination && (
          <div className="col-span-12 bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-3">معاينة الرابط</h4>
            <div className="space-y-2">
              {slugValue && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الرابط المختصر:</span>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-mono text-sm"
                  >
                    {previewUrl}
                  </a>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">الرابط الوجهة:</span>
                <span className="text-gray-800 text-sm truncate max-w-[200px]">
                  {watch("destination")}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="col-span-12 flex items-center gap-6 flex-wrap">
          <PrimaryButton type="submit" disabled={isLoading || !isDirty}>
            {isLoading
              ? "جاري الحفظ..."
              : shortLink
              ? "تحديث بيانات الرابط"
              : "إضافة رابط جديد"}
          </PrimaryButton>

          {isDirty && (
            <SoftActionButton
              onClick={handleCancel}
              type="button"
              disabled={isLoading}
            >
              إلغاء
            </SoftActionButton>
          )}
        </div>
      </form>
    </Card>
  );
}

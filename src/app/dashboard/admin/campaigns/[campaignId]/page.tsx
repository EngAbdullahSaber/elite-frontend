// app/dashboard/admin/campaigns/[campaignId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BiListUl } from "react-icons/bi";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import { Campaign } from "@/types/campaign";
import CampaignDetails from "@/components/dashboard/admin/campaign/CampaignDetails";
import { getCampaignById } from "@/services/campaigns/campaigns";

type Props = {
  params: {
    campaignId: string;
  };
};

export default function CampaignDetailsPage({ params }: Props) {
  const { campaignId } = params;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchCampaign();
  }, [campaignId, refreshTrigger]);

  const fetchCampaign = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const campaignData = await getCampaignById(parseInt(campaignId));

      // Map API response to your Campaign type
      const mappedCampaign: Campaign = {
        id: campaignData.id.toString(),
        campaignName: campaignData.name,
        campaignTitle: campaignData.title,
        campaignDescription: campaignData.description,
        campaignImages: campaignData.images || [],
        campaignExcel: [], // API response doesn't include Excel files
        targetChannel: campaignData.targetChannel,
        targetAudience: campaignData.targetAudience,
        runType: campaignData.runType,
        runOnceDateTime: campaignData.runOnceDatetime || "",
        startDate: campaignData.startDate || "",
        endDate: campaignData.endDate || "",
        runFrequency: campaignData.runFrequency,
        runTime: campaignData.runTime,
        status: campaignData.status,
        createdAt: campaignData.createdAt,
        updatedAt: campaignData.updatedAt,
        targetRecipients: 0, // Not provided in API
        actualRecipients: campaignData.actualRecipients || 0,
        views: campaignData.views || 0,
        responses: campaignData.responses || 0,
        messageContent: campaignData.messageContent,
      };

      setCampaign(mappedCampaign);
    } catch (err) {
      console.error("Error fetching campaign:", err);
      setError("فشل في تحميل بيانات الحملة");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to trigger refresh after actions
  const handleCampaignUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <DashboardHeaderTitle path={["الحملات", "جاري التحميل..."]}>
          <Link className="btn-primary" href="/dashboard/admin/campaigns">
            <BiListUl /> عرض جميع الحملات
          </Link>
        </DashboardHeaderTitle>

        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="mr-2 text-gray-600">
            جاري تحميل بيانات الحملة...
          </span>
        </div>
      </>
    );
  }

  // Error state
  if (error || !campaign) {
    const errorCampaign: Campaign = {
      id: campaignId,
      campaignName: "حملة غير موجودة",
      campaignTitle: "تعذر تحميل الحملة",
      campaignDescription:
        error || "تعذر تحميل بيانات الحملة. يرجى المحاولة مرة أخرى.",
      campaignImages: [],
      campaignExcel: [],
      targetChannel: "email",
      targetAudience: "all_users",
      runType: "recurring",
      runOnceDateTime: "",
      startDate: "",
      endDate: "",
      runFrequency: "monthly",
      runTime: "10:00",
      status: "cancelled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetRecipients: 0,
      actualRecipients: 0,
      views: 0,
      responses: 0,
    };

    return (
      <>
        <DashboardHeaderTitle
          path={["الحملات", `تفاصيل الحملة - ${errorCampaign.campaignName}`]}
        >
          <Link className="btn-primary" href="/dashboard/admin/campaigns">
            <BiListUl /> عرض جميع الحملات
          </Link>
        </DashboardHeaderTitle>

        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchCampaign}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>

        <CampaignDetails campaign={errorCampaign} />
      </>
    );
  }

  // Success state
  return (
    <>
      <DashboardHeaderTitle
        path={["الحملات", `تفاصيل الحملة - ${campaign.campaignName}`]}
      >
        <Link className="btn-primary" href="/dashboard/admin/campaigns">
          <BiListUl /> عرض جميع الحملات
        </Link>
      </DashboardHeaderTitle>

      <CampaignDetails
        campaign={campaign}
        onCampaignAction={handleCampaignUpdated}
        actionLoading={null}
      />
    </>
  );
}

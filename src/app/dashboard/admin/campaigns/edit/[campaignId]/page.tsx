// app/dashboard/admin/campaigns/edit/[campaignId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import { Campaign } from "@/types/campaign";
import CenteredContainer from "@/components/shared/CenteredContainer";
import Link from "next/link";
import { BiListUl } from "react-icons/bi";
import { FaBullhorn } from "react-icons/fa";
import { getCampaignById } from "@/services/campaigns/campaigns";
import CampaignFormUpdate from "@/components/dashboard/admin/campaign/CampaignFormUpdate";

export default function EditCampaignPage() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

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
        isDraft: campaignData.status === "draft",
      };

      setCampaign(mappedCampaign);
    } catch (err) {
      console.error("Error fetching campaign:", err);
      setError("فشل في تحميل بيانات الحملة");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div>
        <DashboardHeaderTitle path={["الحملات", "جاري التحميل..."]}>
          <div className="flex gap-4 flex-wrap">
            <Link className="btn-primary" href="/dashboard/admin/campaigns">
              <BiListUl /> عرض جميع الحملات
            </Link>
          </div>
        </DashboardHeaderTitle>
        <CenteredContainer>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="mr-2 text-gray-600">
              جاري تحميل بيانات الحملة...
            </span>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  // Error state
  if (error || !campaign) {
    return (
      <div>
        <DashboardHeaderTitle path={["الحملات", "خطأ في التحميل"]}>
          <div className="flex gap-4 flex-wrap">
            <Link className="btn-primary" href="/dashboard/admin/campaigns">
              <BiListUl /> عرض جميع الحملات
            </Link>
          </div>
        </DashboardHeaderTitle>
        <CenteredContainer>
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <h3 className="text-red-800 text-lg font-medium mb-2">
              تعذر تحميل الحملة
            </h3>
            <p className="text-red-600 mb-4">{error || "حدث خطأ غير متوقع"}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={fetchCampaign}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                إعادة المحاولة
              </button>
              <button
                onClick={() => router.push("/dashboard/admin/campaigns")}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                العودة للقائمة
              </button>
            </div>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  // Success state
  return (
    <div>
      <DashboardHeaderTitle path={["الحملات", "تحرير الحملة"]}>
        <div className="flex gap-4 flex-wrap">
          <Link
            className="btn-primary"
            href={`/dashboard/admin/campaigns/${campaign.id}`}
          >
            <FaBullhorn /> صفحة الحملة
          </Link>
          <Link className="btn-primary" href="/dashboard/admin/campaigns">
            <BiListUl /> عرض جميع الحملات
          </Link>
        </div>
      </DashboardHeaderTitle>
      <CenteredContainer>
        <CampaignFormUpdate
          campaignId={campaignId}
          initialData={{
            campaignName: campaign.campaignName,
            campaignTitle: campaign.campaignTitle,
            campaignDescription: campaign.campaignDescription,
            targetChannel: campaign.targetChannel,
            campaignImages: campaign.campaignImages,
            campaignExcel: campaign.campaignExcel,
            targetAudience: campaign.targetAudience,
            runType: campaign.runType,
            runOnceDateTime: campaign.runOnceDateTime,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            runFrequency: campaign.runFrequency,
            runTime: campaign.runTime,
            isDraft: campaign.isDraft || false,
            messageContent: campaign.messageContent,
          }}
        />
      </CenteredContainer>
    </div>
  );
}

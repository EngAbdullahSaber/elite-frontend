// components/dashboard/admin/campaign/CampaignDetails.tsx
"use client";
import { Campaign } from "@/types/campaign";
import CampaignStatsCard from "./CampaignStatsCard";
import CampaignInfoCard from "./CampaignInfoCard";
import CampaignActionsCard from "./CampaignActionsCard";
import CampaignImagesCard from "./CampaignImagesCard";
import AttachmentsCard from "@/components/shared/AttachmentsCard";

type Props = {
  campaign: Campaign;
  onCampaignAction?: () => void; // Changed to void function
  actionLoading?: string | null;
};

export default function CampaignDetails({
  campaign,
  onCampaignAction,
  actionLoading,
}: Props) {
  // Use actual stats from API or fallback to 0
  const stats = {
    targetRecipients: campaign?.targetRecipients || 0,
    actualRecipients: campaign.actualRecipients || 0,
    views: campaign.views || 0,
    responses: campaign.responses || 0,
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Campaign Statistics - Only show if there are actual recipients */}
      {(stats.actualRecipients > 0 ||
        stats.views > 0 ||
        stats.responses > 0) && <CampaignStatsCard stats={stats} />}

      <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-6 items-stretch">
        <div className="flex-1">
          <CampaignInfoCard campaign={campaign} />
        </div>
        <div className="flex-1">
          <CampaignActionsCard
            campaign={campaign}
            onCampaignUpdated={onCampaignAction} // Fixed prop name
            actionLoading={actionLoading}
          />
        </div>
      </div>

      {/* Excel files - Only show if there are attachments */}
      {campaign.campaignExcel && campaign.campaignExcel.length > 0 && (
        <AttachmentsCard
          attachments={campaign.campaignExcel}
          title="ملفات الاكسل"
        />
      )}

      {/* Campaign Images */}
      <div className="h-full 2xl:col-span-4 flex flex-col gap-4 lg:gap-6">
        <CampaignImagesCard campaign={campaign} />
      </div>
    </div>
  );
}

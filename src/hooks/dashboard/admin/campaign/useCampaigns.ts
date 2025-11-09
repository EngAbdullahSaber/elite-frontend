// hooks/dashboard/admin/campaign/useCampaigns.ts

"use client";

import { useSearchParams } from "next/navigation";
import {
  CampaignFilterKeys,
  CampaignRow,
  CampaignStatus,
} from "@/types/dashboard/campaign";
import { useCallback } from "react";
import { getCampaigns } from "@/services/campaigns/campaigns";

// Helper function to map API response to CampaignRow
function mapApiCampaignToRow(apiCampaign: any): CampaignRow {
  return {
    id: apiCampaign.id.toString(),
    campaignName: apiCampaign.name, // This should be the campaign name for the first column
    targetChannel: apiCampaign.targetChannel,
    targetAudience: apiCampaign.targetAudience,
    status: apiCampaign.status as CampaignStatus,
    startDate: apiCampaign.startDate,
    endDate: apiCampaign.endDate,
    runType: apiCampaign.runType,
    actualRecipients: apiCampaign.actualRecipients || 0,
    views: apiCampaign.views || 0,
    responses: apiCampaign.responses || 0,
    responseRate:
      apiCampaign.actualRecipients > 0
        ? (apiCampaign.responses / apiCampaign.actualRecipients) * 100
        : 0,
    createdBy: apiCampaign.createdBy.fullName,
    createdAt: apiCampaign.createdAt,
  };
}

export default function useCampaigns() {
  const searchParams = useSearchParams();
  const getParam = useCallback(
    (key: CampaignFilterKeys) => searchParams.get(key),
    [searchParams]
  );

  const getRows = useCallback(
    async (
      signal?: AbortSignal
    ): Promise<{
      rows: CampaignRow[];
      error?: Error | null;
      totalCount?: number;
    }> => {
      try {
        // Get filter parameters from URL
        const status = getParam("status");
        const targetChannel = getParam("targetChannel");
        const targetAudience = getParam("targetAudience");
        const runType = getParam("runType");
        const sort = getParam("sort");
        const dir = getParam("dir");
        const startDateFrom = getParam("startDate_from");
        const startDateTo = getParam("startDate_to");
        const endDateFrom = getParam("endDate_from");
        const endDateTo = getParam("endDate_to");
        const page = parseInt(getParam("page") || "1", 10);
        const limit = parseInt(getParam("limit") || "10", 10);
        const searchKey = getParam("search")?.trim() || "";

        // Prepare API parameters
        const apiParams: Record<string, any> = {
          page: page,
          limit: limit,
        };

        // Add status filter
        if (status && status !== "all") {
          apiParams.status = status;
        }

        // Add target channel filter
        if (targetChannel && targetChannel !== "all") {
          apiParams.targetChannel = targetChannel;
        }

        // Add target audience filter
        if (targetAudience && targetAudience !== "all") {
          apiParams.targetAudience = targetAudience;
        }

        // Add run type filter
        if (runType && runType !== "all") {
          apiParams.runType = runType;
        }

        // Add date range filters
        if (startDateFrom) {
          apiParams.startDate_from = startDateFrom;
        }
        if (startDateTo) {
          apiParams.startDate_to = startDateTo;
        }
        if (endDateFrom) {
          apiParams.endDate_from = endDateFrom;
        }
        if (endDateTo) {
          apiParams.endDate_to = endDateTo;
        }

        // Add search filter
        if (searchKey) {
          apiParams.search = searchKey;
        }

        // Add sorting
        if (sort) {
          apiParams.sortBy = sort === "createdAt" ? "createdAt" : sort;
          apiParams.sortOrder = dir === "desc" ? "DESC" : "ASC";
        } else {
          // Default sorting
          apiParams.sortBy = "createdAt";
          apiParams.sortOrder = "DESC";
        }

        // Call the API
        const response = await getCampaigns(apiParams, signal);

        // Map API response to CampaignRow format
        const rows: CampaignRow[] = response.records.map(mapApiCampaignToRow);

        return {
          rows,
          totalCount: response.total_records,
        };
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return { rows: [] };
        }

        console.error("Error fetching campaigns:", err);
        return {
          rows: [],
          error: new Error("فشل في جلب بيانات الحملات"),
        };
      }
    },
    [getParam]
  );

  return getRows;
}

// hooks/dashboard/admin/partner/usePartner.ts

"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  getPartners,
  updatePartnerStatus,
  createPartner as createPartnerService,
  updatePartner as updatePartnerService,
  deletePartner as deletePartnerService,
} from "@/services/partner/partner";

// Define types for partner
export type PartnerStatus = "active" | "inactive";
export type PartnerKind = "internal" | "external";
export type PartnerPlatform =
  | "instagram"
  | "facebook"
  | "twitter"
  | "youtube"
  | "tiktok"
  | "snapchat"
  | "website"
  | "other"
  | null;

export type PartnerFilterKeys =
  | "page"
  | "limit"
  | "platform"
  | "kind"
  | "status"
  | "search"
  | "sort"
  | "dir"
  | "createdAt_from"
  | "createdAt_to"
  | "campaignId";

export interface PartnerRow {
  id: string;
  name: string;
  kind: PartnerKind;
  platform: PartnerPlatform;
  referralCode: string;
  status: PartnerStatus;
  createdAt: string;
  updatedAt: string;
  campaign: {
    id: string;
    name: string;
    title: string;
    status: string;
    targetChannel: string;
    startDate: string;
    endDate: string;
  } | null;
  isActive: boolean;
}

// Helper function to map API response to PartnerRow
function mapApiPartnerToRow(apiPartner: any): PartnerRow {
  console.log("Partner API Response:", apiPartner);

  return {
    id: apiPartner.id.toString(),
    name: apiPartner.name,
    kind: apiPartner.kind as PartnerKind,
    platform: apiPartner.platform as PartnerPlatform,
    referralCode: apiPartner.referralCode,
    status: apiPartner.isActive ? "active" : "inactive",
    createdAt: apiPartner.createdAt,
    updatedAt: apiPartner.updatedAt,
    isActive: apiPartner.isActive,
    campaign: apiPartner.campaign
      ? {
          id: apiPartner.campaign.id.toString(),
          name: apiPartner.campaign.name,
          title: apiPartner.campaign.title,
          status: apiPartner.campaign.status,
          targetChannel: apiPartner.campaign.targetChannel,
          startDate: apiPartner.campaign.startDate,
          endDate: apiPartner.campaign.endDate,
        }
      : null,
  };
}

export default function usePartner() {
  const searchParams = useSearchParams();
  const getParam = useCallback(
    (key: PartnerFilterKeys) => searchParams.get(key),
    [searchParams]
  );

  const getRows = useCallback(
    async (
      signal?: AbortSignal
    ): Promise<{
      rows: PartnerRow[];
      error?: Error | null;
      totalCount?: number;
    }> => {
      try {
        // Get filter parameters from URL
        const status = getParam("status");
        const kind = getParam("kind");
        const platform = getParam("platform");
        const sort = getParam("sort");
        const dir = getParam("dir");
        const createdAtFrom = getParam("createdAt_from");
        const createdAtTo = getParam("createdAt_to");
        const campaignId = getParam("campaignId");
        const page = parseInt(getParam("page") || "1", 10);
        const limit = parseInt(getParam("limit") || "10", 10);
        const searchKey = getParam("search")?.trim() || "";

        // Prepare API parameters
        const apiParams: Record<string, any> = {
          page: page,
          limit: limit,
        };

        // Add status filter (active/inactive)
        if (status && status !== "all") {
          apiParams.isActive = status === "active";
        }

        // Add kind filter (internal/external)
        if (kind && kind !== "all") {
          apiParams.kind = kind;
        }

        // Add platform filter
        if (platform && platform !== "all") {
          apiParams.platform = platform;
        }

        // Add campaign filter
        if (campaignId) {
          apiParams.campaignId = campaignId;
        }

        // Add date range filters
        if (createdAtFrom) {
          apiParams.createdAt_from = createdAtFrom;
        }
        if (createdAtTo) {
          apiParams.createdAt_to = createdAtTo;
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

        // Call the partners API
        const response = await getPartners(apiParams, signal);

        // Map API response to PartnerRow format
        const rows: PartnerRow[] = response.items.map(mapApiPartnerToRow);

        return {
          rows,
          totalCount: response.total,
        };
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return { rows: [] };
        }

        console.error("Error fetching partners:", err);
        return {
          rows: [],
          error: new Error("فشل في جلب بيانات الشركاء"),
        };
      }
    },
    [getParam]
  );

  // Hook for getting partner performance
  const getPartnerPerformance = useCallback(
    async (
      partnerId: string,
      params?: {
        period?: string;
        startDate?: string;
        endDate?: string;
      },
      signal?: AbortSignal
    ) => {
      try {
        // This would use the getPartnerStats service
        console.log("Fetching performance for partner:", partnerId, params);

        // Placeholder - implement based on your performance API
        return {
          clicks: 0,
          conversions: 0,
          revenue: 0,
          commission: 0,
          traffic: 0,
        };
      } catch (err) {
        console.error("Error fetching partner performance:", err);
        throw err;
      }
    },
    []
  );

  // Hook for getting partner stats
  const getPartnerStats = useCallback(
    async (
      partnerId: string,
      params?: {
        startDate?: string;
        endDate?: string;
      },
      signal?: AbortSignal
    ) => {
      try {
        // This would use the getPartnerStats service
        console.log("Fetching stats for partner:", partnerId, params);

        // Placeholder - implement based on your stats API
        return {
          totalClicks: 0,
          totalConversions: 0,
          totalRevenue: 0,
          totalCommission: 0,
          totalTraffic: 0,
          averageConversionRate: 0,
        };
      } catch (err) {
        console.error("Error fetching partner stats:", err);
        throw err;
      }
    },
    []
  );

  // Hook for getting partner campaigns
  const getPartnerCampaigns = useCallback(
    async (
      partnerId: string,
      params?: {
        page?: number;
        limit?: number;
      },
      signal?: AbortSignal
    ) => {
      try {
        const { getPartnerCampaigns: getPartnerCampaignsService } =
          await import("@/services/partner/partner");

        const response = await getPartnerCampaignsService(
          parseInt(partnerId),
          params,
          signal
        );

        return response;
      } catch (err) {
        console.error("Error fetching partner campaigns:", err);
        throw err;
      }
    },
    []
  );

  return {
    getRows,
    getPartnerPerformance,
    getPartnerStats,
    getPartnerCampaigns,
  };
}

// Additional hook for partner management operations
export function usePartnerManagement() {
  const createPartner = useCallback(async (data: any) => {
    try {
      return await createPartnerService(data);
    } catch (err) {
      console.error("Error creating partner:", err);
      throw err;
    }
  }, []);

  const updatePartner = useCallback(async (id: string, data: any) => {
    try {
      return await updatePartnerService(parseInt(id), data);
    } catch (err) {
      console.error("Error updating partner:", err);
      throw err;
    }
  }, []);

  const deletePartner = useCallback(async (id: string) => {
    try {
      await deletePartnerService(parseInt(id));
    } catch (err) {
      console.error("Error deleting partner:", err);
      throw err;
    }
  }, []);

  const togglePartnerStatus = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        return await updatePartnerStatus(parseInt(id), isActive);
      } catch (err) {
        console.error("Error toggling partner status:", err);
        throw err;
      }
    },
    []
  );

  return {
    createPartner,
    updatePartner,
    deletePartner,
    togglePartnerStatus,
  };
}

// hooks/dashboard/admin/influencer/useInfluencer.ts

"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  getInfluencers,
  getActiveInfluencers,
  getInfluencersByPlatform,
} from "@/services/Influencer/Influencer";

// Define types for influencer
export type InfluencerStatus = "active" | "inactive";
export type InfluencerPlatform =
  | "instagram"
  | "snapchat"
  | "tiktok"
  | "youtube"
  | "x"
  | "other";

export type InfluencerFilterKeys =
  | "page"
  | "limit"
  | "platform"
  | "status"
  | "search"
  | "sort"
  | "dir"
  | "joinedAt_from"
  | "joinedAt_to";

export interface InfluencerRow {
  id: string;
  name: string;
  handle: string | null;
  platform: InfluencerPlatform;
  code: string;
  status: InfluencerStatus;
  joinedAt: string;
  email: string | null;
  phone: string | null;
  verificationStatus: string | null;
  userId: string | null;
  socialMediaUrl: string | null;
}

// Helper function to map API response to InfluencerRow
function mapApiInfluencerToRow(apiInfluencer: any): InfluencerRow {
  return {
    id: apiInfluencer.id.toString(),
    name: apiInfluencer.name,
    handle: apiInfluencer.handle,
    platform: apiInfluencer.platform as InfluencerPlatform,
    code: apiInfluencer.code,
    status: apiInfluencer.isActive ? "active" : "inactive",
    joinedAt: apiInfluencer.createdAt,
    email: apiInfluencer.user?.email || null,
    phone: apiInfluencer.user?.phoneNumber || null,
    verificationStatus: apiInfluencer.user?.verificationStatus || null,
    userId: apiInfluencer.user?.id?.toString() || null,
    socialMediaUrl: apiInfluencer.handle
      ? `https://${apiInfluencer.platform}.com/${apiInfluencer.handle.replace(
          "@",
          ""
        )}`
      : null,
  };
}

export default function useInfluencer() {
  const searchParams = useSearchParams();
  const getParam = useCallback(
    (key: InfluencerFilterKeys) => searchParams.get(key),
    [searchParams]
  );

  const getRows = useCallback(
    async (
      signal?: AbortSignal
    ): Promise<{
      rows: InfluencerRow[];
      error?: Error | null;
      totalCount?: number;
    }> => {
      try {
        // Get filter parameters from URL
        const status = getParam("status");
        const platform = getParam("platform");
        const sort = getParam("sort");
        const dir = getParam("dir");
        const joinedFrom = getParam("joinedAt_from");
        const joinedTo = getParam("joinedAt_to");
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

        // Add platform filter
        if (platform && platform !== "all") {
          apiParams.platform = platform;
        }

        // Add date range filters
        if (joinedFrom) {
          apiParams.createdAt_from = joinedFrom;
        }
        if (joinedTo) {
          apiParams.createdAt_to = joinedTo;
        }

        // Add search filter
        if (searchKey) {
          apiParams.search = searchKey;
        }

        // Add sorting
        if (sort) {
          apiParams.sortBy = sort === "joinedAt" ? "createdAt" : sort;
          apiParams.sortOrder = dir === "desc" ? "DESC" : "ASC";
        } else {
          // Default sorting
          apiParams.sortBy = "createdAt";
          apiParams.sortOrder = "DESC";
        }

        // Call the appropriate API based on filters
        let response;
        if (status === "active" && !platform && !searchKey) {
          // Use optimized endpoint for active influencers
          response = await getActiveInfluencers(apiParams, signal);
        } else if (platform && platform !== "all" && !searchKey) {
          // Use platform-specific endpoint
          response = await getInfluencersByPlatform(
            platform,
            apiParams,
            signal
          );
        } else {
          // Use general influencers endpoint
          response = await getInfluencers(apiParams, signal);
        }

        // Map API response to InfluencerRow format
        const rows: InfluencerRow[] = response.records.map(
          mapApiInfluencerToRow
        );

        return {
          rows,
          totalCount: response.total_records,
        };
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return { rows: [] };
        }

        console.error("Error fetching influencers:", err);
        return {
          rows: [],
          error: new Error("فشل في جلب بيانات المروج"),
        };
      }
    },
    [getParam]
  );

  // Additional hook for getting influencer performance
  const getInfluencerPerformance = useCallback(
    async (
      influencerId: string,
      params?: {
        period?: string;
        startDate?: string;
        endDate?: string;
      },
      signal?: AbortSignal
    ) => {
      try {
        // This would use the getInfluencerPerformance service
        // You can implement this based on your needs

        // Placeholder - implement based on your performance API
        return {
          clicks: 0,
          conversions: 0,
          revenue: 0,
          commission: 0,
        };
      } catch (err) {
        console.error("Error fetching influencer performance:", err);
        throw err;
      }
    },
    []
  );

  // Hook for getting influencer stats
  const getInfluencerStats = useCallback(
    async (
      influencerId: string,
      params?: {
        startDate?: string;
        endDate?: string;
      },
      signal?: AbortSignal
    ) => {
      try {
        // This would use the getInfluencerStats service

        // Placeholder - implement based on your stats API
        return {
          totalClicks: 0,
          totalConversions: 0,
          totalRevenue: 0,
          totalCommission: 0,
          averageConversionRate: 0,
        };
      } catch (err) {
        console.error("Error fetching influencer stats:", err);
        throw err;
      }
    },
    []
  );

  return {
    getRows,
    getInfluencerPerformance,
    getInfluencerStats,
  };
}

// Additional hook for influencer management operations
export function useInfluencerManagement() {
  const createInfluencer = useCallback(async (data: any) => {
    try {
      // Import and use createInfluencer service
      const { createInfluencer: createInfluencerService } = await import(
        "@/services/Influencer/Influencer"
      );
      return await createInfluencerService(data);
    } catch (err) {
      console.error("Error creating influencer:", err);
      throw err;
    }
  }, []);

  const updateInfluencer = useCallback(async (id: string, data: any) => {
    try {
      // Import and use updateInfluencer service
      const { updateInfluencer: updateInfluencerService } = await import(
        "@/services/Influencer/Influencer"
      );
      return await updateInfluencerService(parseInt(id), data);
    } catch (err) {
      console.error("Error updating influencer:", err);
      throw err;
    }
  }, []);

  const deleteInfluencer = useCallback(async (id: string) => {
    try {
      // Import and use deleteInfluencer service
      const { deleteInfluencer: deleteInfluencerService } = await import(
        "@/services/Influencer/Influencer"
      );
      await deleteInfluencerService(parseInt(id));
    } catch (err) {
      console.error("Error deleting influencer:", err);
      throw err;
    }
  }, []);

  const toggleInfluencerStatus = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        // Import and use updateInfluencerActivation service
        const { updateInfluencerActivation } = await import(
          "@/services/Influencer/Influencer"
        );
        return await updateInfluencerActivation(parseInt(id), isActive);
      } catch (err) {
        console.error("Error toggling influencer status:", err);
        throw err;
      }
    },
    []
  );

  return {
    createInfluencer,
    updateInfluencer,
    deleteInfluencer,
    toggleInfluencerStatus,
  };
}

// hooks/dashboard/admin/shortLinks/useShortLinks.ts

"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  getShortLinks,
  getActiveShortLinks,
  getShortLinksByInfluencer,
  getShortLinksByMarketer,
  getShortLinksByCampaign,
} from "@/services/shortLinks/shortLinks";

// Define types for short links
export type ShortLinkStatus = "active" | "inactive";

export type ShortLinkFilterKeys =
  | "page"
  | "limit"
  | "influencerId"
  | "marketerId"
  | "campaignId"
  | "status"
  | "search"
  | "sort"
  | "dir"
  | "createdAt_from"
  | "createdAt_to";

export interface ShortLinkRow {
  id: string;
  slug: string;
  destination: string;
  shortUrl: string;
  campaignId: string | null;
  status: ShortLinkStatus;
  createdAt: string;
  influencerName: string | null;
  influencerHandle: string | null;
  marketerReferralCode: string | null;
  createdByName: string;
  clicks?: number;
  conversions?: number;
  conversionRate?: number;
}

// Helper function to map API response to ShortLinkRow
function mapApiShortLinkToRow(apiShortLink: any): ShortLinkRow {
 
  // Generate short URL (you can replace with your actual domain)
  const shortUrl = `${window.location.origin}/s/${apiShortLink.slug}`;

  return {
    id: apiShortLink.id.toString(),
    slug: apiShortLink.slug,
    destination: apiShortLink.destination,
    shortUrl: shortUrl,
    campaignId: apiShortLink.campaignId?.toString() || null,
    status: apiShortLink.isActive ? "active" : "inactive",
    createdAt: apiShortLink.createdAt,
    influencerName: apiShortLink.influencer?.name || null,
    influencerHandle: apiShortLink.influencer?.handle || null,
    marketerReferralCode: apiShortLink.marketer?.referralCode || null,
    createdByName: apiShortLink.createdBy?.fullName || "System",
    // These would come from analytics API in real implementation
    clicks: 0,
    conversions: 0,
    conversionRate: 0,
  };
}

export default function useShortLinks() {
  const searchParams = useSearchParams();
  const getParam = useCallback(
    (key: ShortLinkFilterKeys) => searchParams.get(key),
    [searchParams]
  );

  const getRows = useCallback(
    async (
      signal?: AbortSignal
    ): Promise<{
      rows: ShortLinkRow[];
      error?: Error | null;
      totalCount?: number;
    }> => {
      try {
        // Get filter parameters from URL
        const status = getParam("status");
        const influencerId = getParam("influencerId");
        const marketerId = getParam("marketerId");
        const campaignId = getParam("campaignId");
        const sort = getParam("sort");
        const dir = getParam("dir");
        const createdFrom = getParam("createdAt_from");
        const createdTo = getParam("createdAt_to");
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

        // Add influencer filter
        if (influencerId && influencerId !== "all") {
          apiParams.influencerId = parseInt(influencerId, 10);
        }

        // Add marketer filter
        if (marketerId && marketerId !== "all") {
          apiParams.marketerId = parseInt(marketerId, 10);
        }

        // Add campaign filter
        if (campaignId && campaignId !== "all") {
          apiParams.campaignId = parseInt(campaignId, 10);
        }

        // Add date range filters
        if (createdFrom) {
          apiParams.createdAt_from = createdFrom;
        }
        if (createdTo) {
          apiParams.createdAt_to = createdTo;
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

        // Call the appropriate API based on filters
        let response;
        if (
          status === "active" &&
          !influencerId &&
          !marketerId &&
          !campaignId &&
          !searchKey
        ) {
          // Use optimized endpoint for active short links
          response = await getActiveShortLinks(apiParams, signal);
        } else if (influencerId && influencerId !== "all" && !searchKey) {
          // Use influencer-specific endpoint
          response = await getShortLinksByInfluencer(
            parseInt(influencerId, 10),
            apiParams,
            signal
          );
        } else if (marketerId && marketerId !== "all" && !searchKey) {
          // Use marketer-specific endpoint
          response = await getShortLinksByMarketer(
            parseInt(marketerId, 10),
            apiParams,
            signal
          );
        } else if (campaignId && campaignId !== "all" && !searchKey) {
          // Use campaign-specific endpoint
          response = await getShortLinksByCampaign(
            parseInt(campaignId, 10),
            apiParams,
            signal
          );
        } else {
          // Use general short links endpoint
          response = await getShortLinks(apiParams, signal);
        }

        // Map API response to ShortLinkRow format
        const rows: ShortLinkRow[] = response.records.map(mapApiShortLinkToRow);

        return {
          rows,
          totalCount: response.total_records,
        };
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return { rows: [] };
        }

        console.error("Error fetching short links:", err);
        return {
          rows: [],
          error: new Error("فشل في جلب بيانات الروابط القصيرة"),
        };
      }
    },
    [getParam]
  );

  // Hook for getting short link analytics
  const getShortLinkAnalytics = useCallback(
    async (
      shortLinkId: string,
      params?: {
        startDate?: string;
        endDate?: string;
        period?: string;
      },
      signal?: AbortSignal
    ) => {
      try {
        const { getShortLinkAnalytics: getAnalyticsService } = await import(
          "@/services/shortLinks/shortLinks"
        );

        return await getAnalyticsService(parseInt(shortLinkId), params, signal);
      } catch (err) {
        console.error("Error fetching short link analytics:", err);
        throw err;
      }
    },
    []
  );

  // Hook for getting short link statistics
  const getShortLinkStats = useCallback(
    async (
      shortLinkId: string,
      params?: {
        startDate?: string;
        endDate?: string;
      },
      signal?: AbortSignal
    ) => {
      try {
        const { getShortLinkStats: getStatsService } = await import(
          "@/services/shortLinks/shortLinks"
        );

        return await getStatsService(parseInt(shortLinkId), params, signal);
      } catch (err) {
        console.error("Error fetching short link stats:", err);
        throw err;
      }
    },
    []
  );

  // Hook for getting short link clicks
  const getShortLinkClicks = useCallback(
    async (
      shortLinkId: string,
      params?: {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
      },
      signal?: AbortSignal
    ) => {
      try {
        const { getShortLinkClicks: getClicksService } = await import(
          "@/services/shortLinks/shortLinks"
        );

        return await getClicksService(parseInt(shortLinkId), params, signal);
      } catch (err) {
        console.error("Error fetching short link clicks:", err);
        throw err;
      }
    },
    []
  );

  return {
    getRows,
    getShortLinkAnalytics,
    getShortLinkStats,
    getShortLinkClicks,
  };
}

// Additional hook for short link management operations
export function useShortLinkManagement() {
  const createShortLink = useCallback(async (data: any) => {
    try {
      const { createShortLink: createShortLinkService } = await import(
        "@/services/shortLinks/shortLinks"
      );
      return await createShortLinkService(data);
    } catch (err) {
      console.error("Error creating short link:", err);
      throw err;
    }
  }, []);

  const updateShortLink = useCallback(async (id: string, data: any) => {
    try {
      const { updateShortLink: updateShortLinkService } = await import(
        "@/services/shortLinks/shortLinks"
      );
      return await updateShortLinkService(parseInt(id), data);
    } catch (err) {
      console.error("Error updating short link:", err);
      throw err;
    }
  }, []);

  const deleteShortLink = useCallback(async (id: string) => {
    try {
      const { deleteShortLink: deleteShortLinkService } = await import(
        "@/services/shortLinks/shortLinks"
      );
      await deleteShortLinkService(parseInt(id));
    } catch (err) {
      console.error("Error deleting short link:", err);
      throw err;
    }
  }, []);

  const activateShortLink = useCallback(async (id: string) => {
    try {
      const { activateShortLink: activateShortLinkService } = await import(
        "@/services/shortLinks/shortLinks"
      );
      return await activateShortLinkService(parseInt(id));
    } catch (err) {
      console.error("Error activating short link:", err);
      throw err;
    }
  }, []);

  const deactivateShortLink = useCallback(async (id: string) => {
    try {
      const { deactivateShortLink: deactivateShortLinkService } = await import(
        "@/services/shortLinks/shortLinks"
      );
      return await deactivateShortLinkService(parseInt(id));
    } catch (err) {
      console.error("Error deactivating short link:", err);
      throw err;
    }
  }, []);

  const toggleShortLinkStatus = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        const { updateShortLinkActivation } = await import(
          "@/services/shortLinks/shortLinks"
        );
        return await updateShortLinkActivation(parseInt(id), isActive);
      } catch (err) {
        console.error("Error toggling short link status:", err);
        throw err;
      }
    },
    []
  );

  const generateSlug = useCallback(async (baseSlug: string) => {
    try {
      const { generateSlug: generateSlugService } = await import(
        "@/services/shortLinks/shortLinks"
      );
      return await generateSlugService(baseSlug);
    } catch (err) {
      console.error("Error generating slug:", err);
      throw err;
    }
  }, []);

  const checkSlugAvailability = useCallback(async (slug: string) => {
    try {
      const { checkSlugAvailability: checkSlugService } = await import(
        "@/services/shortLinks/shortLinks"
      );
      return await checkSlugService(slug);
    } catch (err) {
      console.error("Error checking slug availability:", err);
      throw err;
    }
  }, []);

  const getShortLinkBySlug = useCallback(async (slug: string) => {
    try {
      const { getShortLinkBySlug: getBySlugService } = await import(
        "@/services/shortLinks/shortLinks"
      );
      return await getBySlugService(slug);
    } catch (err) {
      console.error("Error fetching short link by slug:", err);
      throw err;
    }
  }, []);

  return {
    createShortLink,
    updateShortLink,
    deleteShortLink,
    activateShortLink,
    deactivateShortLink,
    toggleShortLinkStatus,
    generateSlug,
    checkSlugAvailability,
    getShortLinkBySlug,
  };
}

// Hook for short link performance and analytics
export function useShortLinkAnalytics() {
  const getPerformanceReport = useCallback(
    async (
      shortLinkId: string,
      params?: {
        startDate?: string;
        endDate?: string;
        groupBy?: string;
      }
    ) => {
      try {
        const { getShortLinkPerformanceReport } = await import(
          "@/services/shortLinks/shortLinks"
        );
        return await getShortLinkPerformanceReport(
          parseInt(shortLinkId),
          params
        );
      } catch (err) {
        console.error("Error fetching performance report:", err);
        throw err;
      }
    },
    []
  );

  const getTopPerformingShortLinks = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      period?: string;
      influencerId?: number;
      marketerId?: number;
    }) => {
      try {
        const { getTopPerformingShortLinks: getTopPerformingService } =
          await import("@/services/shortLinks/shortLinks");
        return await getTopPerformingService(params);
      } catch (err) {
        console.error("Error fetching top performing short links:", err);
        throw err;
      }
    },
    []
  );

  const trackClick = useCallback(async (slug: string, data?: any) => {
    try {
      const { trackShortLinkClick: trackClickService } = await import(
        "@/services/shortLinks/shortLinks"
      );
      return await trackClickService(slug, data);
    } catch (err) {
      console.error("Error tracking short link click:", err);
      throw err;
    }
  }, []);

  return {
    getPerformanceReport,
    getTopPerformingShortLinks,
    trackClick,
  };
}

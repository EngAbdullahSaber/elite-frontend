// hooks/dashboard/admin/marketer/useMarketers.ts

"use client";

import { useSearchParams } from "next/navigation";
import {
  MarketerFilterKeys,
  MarketerRow,
  MarketerStatus,
} from "@/types/dashboard/marketer";
import { useCallback } from "react";
import { getMarketers } from "@/services/marketers/marketers";

// Helper function to map API response to MarketerRow
function mapApiMarketerToRow(apiMarketer: any): MarketerRow {
  return {
    id: apiMarketer.id.toString(),
    name: apiMarketer.user.fullName,
    email: apiMarketer.user.email,
    phone: apiMarketer.user.phoneNumber,
    status: (apiMarketer.user.isActive
      ? "active"
      : "inactive") as MarketerStatus,
    joinedAt: apiMarketer.createdAt,
    referralCode: apiMarketer.referralCode,
    createdBy: apiMarketer.createdBy.fullName,
    verificationStatus: apiMarketer.user.verificationStatus,
    userId: apiMarketer.user.id.toString(), // Add userId for status updates
  };
}

export default function useMarketers() {
  const searchParams = useSearchParams();
  const getParam = useCallback(
    (key: MarketerFilterKeys) => searchParams.get(key),
    [searchParams]
  );

  const getRows = useCallback(
    async (
      signal?: AbortSignal
    ): Promise<{
      rows: MarketerRow[];
      error?: Error | null;
      totalCount?: number;
    }> => {
      try {
        // Get filter parameters from URL
        const status = getParam("status");
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

        // Add status filter - map to isActive
        if (status && status !== "all") {
          apiParams.isActive = status === "active";
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

        // Call the API
        const response = await getMarketers(apiParams, signal);

        // Map API response to MarketerRow format
        const rows: MarketerRow[] = response.records.map(mapApiMarketerToRow);

        return {
          rows,
          totalCount: response.total_records,
        };
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return { rows: [] };
        }

        console.error("Error fetching marketers:", err);
        return {
          rows: [],
          error: new Error("فشل في جلب بيانات المسوقين"),
        };
      }
    },
    [getParam]
  );

  return getRows;
}

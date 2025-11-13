// hooks/dashboard/admin/client/useClients.ts

"use client";

import { useSearchParams } from "next/navigation";
import {
  ClientFilterKeys,
  ClientRow,
  ClientStatus,
} from "@/types/dashboard/client";
import { useCallback } from "react";
import { getClients, getCustomers } from "@/services/clinets/clinets";
import { ImageBaseUrl } from "@/libs/app.config";

// Helper function to map API response to ClientRow
function mapApiClientToRow(apiClient: any): ClientRow {
  return {
    id: apiClient.id.toString(),
    name: apiClient.fullName,
    email: apiClient.email,
    phone: apiClient.phoneNumber,
    status: (apiClient.isActive ? "active" : "inactive") as ClientStatus,
    joinedAt: apiClient.createdAt,
    verificationStatus: apiClient.verificationStatus,
    userType: apiClient.userType,
    profilePhoto: apiClient.profilePhotoUrl
      ? ImageBaseUrl + apiClient.profilePhotoUrl
      : null,
  };
}

export default function useClients() {
  const searchParams = useSearchParams();
  const getParam = useCallback(
    (key: ClientFilterKeys) => searchParams.get(key),
    [searchParams]
  );

  const getRows = useCallback(
    async (
      signal?: AbortSignal
    ): Promise<{
      rows: ClientRow[];
      error?: Error | null;
      totalCount?: number;
    }> => {
      try {
        // Get filter parameters from URL
        const status = getParam("status");
        const dir = getParam("dir");
        const joinedFrom = getParam("joinedAt_from");
        const joinedTo = getParam("joinedAt_to");
        const page = parseInt(getParam("page") || "1", 10);
        const limit = parseInt(getParam("limit") || "10", 10);
        const searchKey = getParam("search")?.trim() || "";
        const userType = getParam("userType") || "customer"; // Default to customers

        // Prepare API parameters
        const apiParams: Record<string, any> = {
          page: page,
          limit: limit,
          userType: userType, // Filter by user type
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

        // Call the API - use getCustomers if we only want customers, otherwise getClients
        const response =
          userType === "customer"
            ? await getCustomers(apiParams, signal)
            : await getClients(apiParams, signal);

        // Map API response to ClientRow format
        const rows: ClientRow[] = response.records.map(mapApiClientToRow);

        return {
          rows,
          totalCount: response.total_records,
        };
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return { rows: [] };
        }

        console.error("Error fetching clients:", err);
        return {
          rows: [],
          error: new Error("فشل في جلب بيانات العملاء"),
        };
      }
    },
    [getParam]
  );

  return getRows;
}

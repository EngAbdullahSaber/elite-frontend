"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { propertySubmissionRow } from "@/types/dashboard/property-submissions";
import { getPropertySubmissions } from "@/services/propertySubmissions/propertySubmissions";

export default function usePropertySubmissions() {
  const searchParams = useSearchParams();
  const getParam = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams]
  );

  const getRows = useCallback(
    async (
      signal?: AbortSignal
    ): Promise<{
      rows: propertySubmissionRow[];
      error?: Error | null;
      totalCount?: number;
    }> => {
      try {
        const status = getParam("status");
        const propertyType = getParam("propertyType");
        const crFrom = getParam("createdAt_from");
        const crTo = getParam("createdAt_to");
        const search = getParam("q");

        const sort = getParam("sort");
        const dir = getParam("dir");
        const page = parseInt(getParam("page") || "1", 10);
        const limit = parseInt(getParam("limit") || "10", 10);

        // Prepare query parameters for API
        const queryParams: Record<string, string> = {
          page: page.toString(),
          limit: limit.toString(),
        };

        if (status && status !== "all") {
          queryParams.status = status;
        }

        if (propertyType && propertyType !== "all") {
          queryParams.propertyTypeId = propertyType; // Changed to propertyTypeId to match your API
        }

        if (search) {
          queryParams.search = search;
        }

        if (crFrom) {
          queryParams.createdAt_from = crFrom;
        }

        if (crTo) {
          queryParams.createdAt_to = crTo;
        }

        if (sort) {
          // Map your sort keys to API sort keys if needed
          const sortMap: Record<string, string> = {
            requesterName: "owner.fullName",
            propertyType: "propertyType.name",
            // Add other mappings as needed
          };

          queryParams.sort = sortMap[sort] || sort;
          queryParams.dir = dir || "asc";
        }

        // Fetch data from API
        const response = await getPropertySubmissions(queryParams, signal);

        if (!response) {
          throw new Error("Failed to fetch data");
        }

        console.log("API Response:", response); // Debug log

        // Transform API response to match your table format
        const transformedRows: propertySubmissionRow[] = response.records.map(
          (record: any) => ({
            id: record.id.toString(),
            requesterName: record.owner?.fullName || "N/A",
            requesterEmail: record.owner?.email || "N/A",
            requesterPhone: record.owner?.phoneNumber || "N/A",
            propertyType: record.propertyType?.name || "N/A",
            location: record.location || "N/A",
            bedrooms: record.specifications?.bedrooms || 0,
            askingPrice: record.askingPrice || "0.00",
            status: record.status || "pending",
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            authorizationDocUrl: record.authorizationDocUrl,
            attachments: record.attachments || [],
            relationshipType: record.relationshipType,
            owner: record.owner,
            updatedBy: record.updatedBy,
          })
        );

        return {
          rows: transformedRows,
          totalCount: response.total_records,
        };
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return { rows: [] };
        }

        console.error("Error fetching property submissions:", err);
        return {
          rows: [],
          error: err instanceof Error ? err : new Error("فشل في جلب البيانات"),
        };
      }
    },
    [getParam]
  );

  return getRows;
}

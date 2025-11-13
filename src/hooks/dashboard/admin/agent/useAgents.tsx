// hooks/dashboard/admin/agent/useAgents.ts

"use client";

import { useSearchParams } from "next/navigation";
import {
  AgentFilterKeys,
  AgentRow,
  AgentStatus,
} from "@/types/dashboard/agent";
import { useCallback, useState, useEffect } from "react";
import { getAgents, getPendingAgents } from "@/services/agents/agents";

// Helper function to map API response to AgentRow
function mapApiAgentToRow(apiAgent: any): AgentRow {
  return {
    id: apiAgent.id.toString(),
    name: apiAgent?.user?.fullName,
    email: apiAgent?.user?.email,
    phone: apiAgent.user?.phoneNumber,
    status: apiAgent.status as AgentStatus,
    activationStatus: (apiAgent.user?.isActive
      ? "active"
      : "inactive") as AgentStatus,
    joinedAt: apiAgent.createdAt,
    city: apiAgent.city?.name,
    kycStatus: apiAgent.status,
    kycNotes: apiAgent.kycNotes,
    verificationStatus: apiAgent.user?.verificationStatus,
    identityProofUrl: apiAgent.identityProofUrl,
    residencyDocumentUrl: apiAgent.residencyDocumentUrl,
    userId: apiAgent.user?.id.toString(),
  };
}

export default function useAgents() {
  const searchParams = useSearchParams();
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const getParam = useCallback(
    (key: AgentFilterKeys) => searchParams.get(key),
    [searchParams]
  );

  const fetchAgents = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);
        setError(null);

        // Get filter parameters from URL
        const status = getParam("status");
        const cityId = getParam("cityId");
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

        // Add status filter
        if (status && status !== "all") {
          apiParams.status = status;
        }

        // Add city filter
        if (cityId) {
          apiParams.cityId = parseInt(cityId, 10);
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
        const response = await getAgents(apiParams, signal);

        // Map API response to AgentRow format
        const rows: AgentRow[] = response.records.map(mapApiAgentToRow);

        setAgents(rows);
        setTotalCount(response.total_records);

        return {
          rows,
          totalCount: response.total_records,
        };
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return { rows: [] };
        }

        console.error("Error fetching agents:", err);
        const errorObj = new Error("فشل في جلب بيانات الوكلاء");
        setError(errorObj);
        return {
          rows: [],
          error: errorObj,
        };
      } finally {
        setLoading(false);
      }
    },
    [getParam]
  );

  // Auto-fetch when search params change
  useEffect(() => {
    const abortController = new AbortController();
    fetchAgents(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [fetchAgents]);

  // Return both the data and refetch function
  return {
    agents,
    loading,
    error,
    totalCount,
    refetch: () => fetchAgents(), // Add refetch function
    getRows: fetchAgents, // Keep the original function for compatibility
  };
}

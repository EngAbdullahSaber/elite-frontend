// hooks/useAppointmentRequests.ts
"use client";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { AppointmentRequestRow } from "@/constants/dashboard/agent/appointment-requests/constants";
import { getAppointmentsByAgent } from "@/services/appointments/appointments";

// Transform API response to match your existing interface
const transformAppointmentData = (apiData: any): AppointmentRequestRow => {
  const appointmentDateTime = new Date(
    `${apiData.appointmentDate}T${apiData.startTime}`
  );

  return {
    id: apiData.id,
    appointmentAt: appointmentDateTime,
    createdAt: new Date(apiData.createdAt),
    status: apiData.status,
    project: {
      id: apiData.property.id,
      title: apiData.property.title,
      location: apiData.property.city?.name || "",
      type: "property",
    },
    client: {
      id: apiData.customer.id,
      name: apiData.customer.fullName,
      phone: apiData.customer.phoneNumber,
      email: apiData.customer.email,
    },
    notes: apiData.customerNotes,
    agentNotes: apiData.agentNotes,
  };
};

export default function useAppointmentRequests() {
  const searchParams = useSearchParams();
  const getParam = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams]
  );

  const getRows = useCallback(
    async (
      signal?: AbortSignal
    ): Promise<{
      rows: AppointmentRequestRow[];
      error?: Error | null;
      totalCount?: number;
    }> => {
      try {
        // Safely get agent ID from localStorage
        let agentId: string | null = null;

        if (typeof window !== "undefined") {
          try {
            const userData = localStorage.getItem("user");
            if (userData) {
              const user = JSON.parse(userData);
              agentId = user.id?.toString();
            }
          } catch (parseError) {
            console.error(
              "Error parsing user data from localStorage:",
              parseError
            );
          }
        }

        if (!agentId) {
          throw new Error("Agent ID not found in localStorage");
        }

        // Build query parameters from URL search params
        const params: Record<string, string> = {};

        // Map your existing filter parameters to API expected parameters
        const apFrom = getParam("appointmentAt_from");
        const apTo = getParam("appointmentAt_to");
        const crFrom = getParam("createdAt_from");
        const crTo = getParam("createdAt_to");
        const sort = getParam("sort");
        const dir = getParam("dir");
        const page = getParam("page") || "1";
        const limit = getParam("limit") || "10";

        // Date filters for appointment date
        if (apFrom) params.appointmentDate_from = apFrom;
        if (apTo) params.appointmentDate_to = apTo;

        // Date filters for creation date
        if (crFrom) params.createdAt_from = crFrom;
        if (crTo) params.createdAt_to = crTo;

        // Sorting
        if (sort) {
          // Map your sort fields to API sort fields
          const sortMapping: { [key: string]: string } = {
            projectTitle: "property.title",
            appointmentAt: "appointmentDate",
            createdAt: "createdAt",
            clientName: "customer.fullName",
          };

          params.sort = sortMapping[sort] || sort;
          if (dir) params.dir = dir;
        }

        // Pagination
        params.page = page;
        params.per_page = limit;

        // Call the API
        const response = await getAppointmentsByAgent(
          parseInt(agentId),
          params,
          signal
        );

        // Transform API response to match your existing data structure
        const transformedRows = response.records.map(transformAppointmentData);

        return {
          rows: transformedRows,
          totalCount: response.total_records,
        };
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return { rows: [] };
        }

        console.error("Error fetching appointment requests:", err);
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

// hooks/dashboard/admin/appointments/useAppointments.ts
"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { AppointmentRow } from "@/types/dashboard/appointment";
import {
  getAppointments,
  getAppointmentsByAgent,
  getAppointmentsByClient,
} from "@/services/appointments/appointments";

interface UseAppointmentsProps {
  agentId?: number;
  clientId?: number;
}

export default function useAppointments({
  agentId,
  clientId,
}: UseAppointmentsProps = {}) {
  const searchParams = useSearchParams();
  const getParam = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams]
  );

  const getRows = useCallback(
    async (
      signal?: AbortSignal
    ): Promise<{
      rows: AppointmentRow[];
      error?: Error | null;
      totalCount?: number;
    }> => {
      try {
        const status = getParam("status");
        const crFrom = getParam("createdAt_from");
        const crTo = getParam("createdAt_to");
        const search = getParam("q");
        const appointmentDateFrom = getParam("appointmentDate_from");
        const appointmentDateTo = getParam("appointmentDate_to");

        const sort = getParam("sort");
        const dir = getParam("dir");
        const page = parseInt(getParam("page") || "1", 10);
        const limit = parseInt(getParam("limit") || "10", 10);

        // Prepare query parameters for API
        const queryParams: Record<string, string> = {
          page: page.toString(),
          limit: limit.toString(),
        };

        // Add filters if provided
        if (status && status !== "all") {
          queryParams.status = status;
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

        if (appointmentDateFrom) {
          queryParams.appointmentDate_from = appointmentDateFrom;
        }

        if (appointmentDateTo) {
          queryParams.appointmentDate_to = appointmentDateTo;
        }

        if (sort) {
          queryParams.sort = sort;
          queryParams.dir = dir || "asc";
        }

        let response;

        // Determine which API endpoint to call based on provided IDs
        if (agentId && clientId) {
          // If both are provided, use client-specific endpoint with agent filter
          queryParams.agentId = agentId.toString();
          response = await getAppointmentsByClient(
            clientId,
            queryParams,
            signal
          );
        } else if (agentId) {
          // Only agent ID provided
          response = await getAppointmentsByAgent(agentId, queryParams, signal);
        } else if (clientId) {
          // Only client ID provided
          response = await getAppointmentsByClient(
            clientId,
            queryParams,
            signal
          );
        } else {
          // No specific IDs - get all appointments
          response = await getAppointments(queryParams, signal);
        }

        if (!response) {
          throw new Error("No response received from server");
        }

        // Handle different response structures
        const records =
          response.records || response.data?.records || response.data || [];
        const totalRecords =
          response.total_records ||
          response.data?.total_records ||
          response.totalCount ||
          records.length;

        // Transform API response to match your table format
        const transformedRows: AppointmentRow[] = Array.isArray(records)
          ? (records
              .map((record: any) => {
                if (!record || !record.property || !record.customer) {
                  console.warn("Invalid appointment record:", record);
                  return null;
                }

                try {
                  // Create appointment date from appointmentDate + startTime
                  let appointmentAt: Date;
                  if (record.appointmentDate && record.startTime) {
                    appointmentAt = new Date(
                      `${record.appointmentDate}T${record.startTime}`
                    );
                  } else if (record.appointmentAt) {
                    appointmentAt = new Date(record.appointmentAt);
                  } else {
                    appointmentAt = new Date(record.createdAt);
                  }

                  return {
                    id: record.id?.toString() || `temp-${Math.random()}`,
                    project: {
                      id: record.property.id,
                      title: record.property.title || "Unknown Property",
                      type: getPropertyTypeFromData(record.property),
                      image:
                        record.property.image ||
                        record.property.profilePhotoUrl ||
                        "",
                    },
                    appointmentAt: appointmentAt.toISOString(),
                    createdAt: record.createdAt,
                    agent: record.agent
                      ? {
                          id: record.agent.id,
                          name:
                            record.agent.fullName ||
                            record.agent.name ||
                            "Unknown Agent",
                          email: record.agent.email || "",
                          image:
                            record.agent.profilePhotoUrl ||
                            record.agent.image ||
                            "",
                        }
                      : undefined,
                    client: {
                      id: record.customer.id,
                      name:
                        record.customer.fullName ||
                        record.customer.name ||
                        "Unknown Client",
                      email: record.customer.email || "",
                      image:
                        record.customer.profilePhotoUrl ||
                        record.customer.image ||
                        "",
                    },
                    status: mapApiStatusToBookingStatus(record.status),
                    reviewStars: record.reviewStars,
                    isPaid: record.isPaid,
                    proofFiles: record.proofFiles || [],
                    agentReviewStars: record.agentReviewStars,
                    expectedProfit: record.expectedProfit,
                    agentReviewText: record.agentReviewText,
                    customerNotes: record.customerNotes,
                    agentNotes: record.agentNotes,
                    createdChannel: record.createdChannel,
                  };
                } catch (error) {
                  console.error(
                    "Error transforming appointment record:",
                    error,
                    record
                  );
                  return null;
                }
              })
              .filter(Boolean) as AppointmentRow[])
          : [];

        return {
          rows: transformedRows,
          totalCount: totalRecords,
        };
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return { rows: [] };
        }

        console.error("Error fetching appointments:", err);
        return {
          rows: [],
          error: err instanceof Error ? err : new Error("فشل في جلب البيانات"),
        };
      }
    },
    [getParam, agentId, clientId]
  );

  return getRows;
}

// Helper function to map API status to BookingStatus
function mapApiStatusToBookingStatus(
  apiStatus: string
): import("@/types/global").BookingStatus {
  const statusMap: Record<string, import("@/types/global").BookingStatus> = {
    pending: "pending",
    confirmed: "confirmed",
    completed: "completed",
    cancelled: "cancelled",
    scheduled: "confirmed",
    active: "confirmed",
    finished: "completed",
    // Add other status mappings as needed
  };

  return statusMap[apiStatus?.toLowerCase()] || "pending";
}

// Helper function to determine property type from API data
function getPropertyTypeFromData(
  property: any
): import("@/types/property").PropertyType {
  if (!property) return "apartment";

  // Check if propertyType field exists
  if (property.propertyType) {
    const type = property.propertyType.toLowerCase();
    if (type === "land" || type === "villa" || type === "apartment") {
      return type as import("@/types/property").PropertyType;
    }
  }

  // Fallback logic based on property features
  if (property.bedrooms === 0 || property.type === "land") return "land";
  if (property.bedrooms >= 4 || property.type === "villa") return "villa";

  return "apartment";
}

"use client";
import DataView from "@/components/shared/DateViewTable/DataView";
import {
  agents,
  useCustomerAppointmentColumns,
  appointmentFilters,
  appointmentSortConfig,
} from "@/constants/dashboard/admin/appointment/contants";
import { AppointmentRow } from "@/types/dashboard/appointment";
import { FaExchangeAlt, FaEye, FaUserEdit } from "react-icons/fa";
import AppointmentStatusToggle from "./AppointmentStatusToggle";
import AgentAssignmentToggle from "../UserAssignmentToggle";
import {
  ActionType,
  MenuActionItem,
} from "@/components/shared/Header/MenuActionList";
import AppointmentProofUploadToggle from "./AppointmentProofUploadToggle";
import { useRoleFromPath } from "@/hooks/dashboard/admin/useRoleFromPath";
import { useMemo, useState, useCallback } from "react";
import { getRoleBasedAppointmentFilters } from "@/utils/appointment";
import { getAppointments } from "@/services/appointments/appointments";

type CustomerAppointmentsDataViewProps = {
  clientId?: string;
  onDataUpdate?: (data: any[], filters: Record<string, any>) => void;
};

interface UserData {
  id: number;
  userType: string;
  email: string;
  fullName: string;
}

export default function CustomerAppointmentsDataView({
  clientId,
  onDataUpdate,
}: CustomerAppointmentsDataViewProps) {
  const role = useRoleFromPath();
  const [loading, setLoading] = useState(true);

  // Direct method to fetch and transform data with customerId filter
  const getRows = useCallback(
    async (filters?: Record<string, any>, signal?: AbortSignal) => {
      try {
        // Extract pagination parameters from filters
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;

        // Prepare API parameters
        const apiParams: Record<string, any> = {
          page,
          limit,
        };

        // Add customerId to filter by specific client
        if (clientId) {
          apiParams.customerId = clientId;
        }

        // Add other filters if present
        if (filters) {
          Object.keys(filters).forEach((key) => {
            if (key !== "page" && key !== "limit" && filters[key]) {
              apiParams[key] = filters[key];
            }
          });
        }

        const response = await getAppointments(apiParams, signal);

        console.log("Appointments API Response:", response); // Debug log

        // Handle the response structure
        if (response && typeof response === "object") {
          let data: any[] = [];
          let totalCount = 0;
          let currentPage = page;
          let perPage = limit;

          // Adjust based on your API response structure
          if (response.records && Array.isArray(response.records)) {
            data = response.records;
            totalCount =
              response.total_records || response.total || data.length;
            currentPage = response.current_page || response.page || page;
            perPage = response.per_page || response.limit || limit;
          } else if (response.data && Array.isArray(response.data)) {
            data = response.data;
            totalCount = response.totalCount || response.total || data.length;
            currentPage = response.currentPage || response.page || page;
            perPage = response.perPage || response.limit || limit;
          } else if (Array.isArray(response)) {
            data = response;
            totalCount = data.length;
            currentPage = 1;
            perPage = data.length;
          }

          // Transform the data to match AppointmentRow structure
          const transformedRows = transformAppointmentData(data);

          // Return the expected structure for DataView component
          return {
            rows: transformedRows,
            totalCount: totalCount,
            totalRecords: totalCount,
            currentPage: currentPage,
            perPage: perPage,
          };
        }

        return {
          rows: [],
          totalCount: 0,
          totalRecords: 0,
          currentPage: 1,
          perPage: 10,
        };
      } catch (error) {
        console.error("Error fetching appointments:", error);
        return {
          rows: [],
          totalCount: 0,
          totalRecords: 0,
          currentPage: 1,
          perPage: 10,
          error: error as Error,
        };
      }
    },
    [clientId]
  );

  // Helper function to transform the appointment data to flat rows
  const transformAppointmentData = (appointments: any[]): AppointmentRow[] => {
    if (!appointments || !Array.isArray(appointments)) return [];

    return appointments.map((appointment) => {
      // Create MiniProject object for the project column
      const miniProject = {
        id: appointment?.property?.id,
        title: appointment?.property?.title,
        type: appointment?.property?.propertyType?.name,
        image: appointment?.property?.image || null,
      };

      // Create MiniUser objects for agent and client columns
      const miniAgent = appointment?.agent
        ? {
            id: appointment.agent.id,
            name: appointment.agent.fullName,
            email: appointment.agent.email,
            image: appointment.agent.profilePhotoUrl,
          }
        : undefined;

      const miniClient = appointment?.customer
        ? {
            id: appointment.customer.id,
            name: appointment.customer.fullName,
            email: appointment.customer.email,
            image: appointment.customer.profilePhotoUrl,
          }
        : undefined;

      // Create the transformed row object matching what columns expect
      const transformedRow: AppointmentRow = {
        id: appointment.id,
        // For "project" column
        project: miniProject,
        // For "appointmentAt" column - combine date and time
        appointmentAt:
          appointment?.appointmentDate && appointment?.startTime
            ? `${appointment.appointmentDate}T${appointment.startTime}`
            : null,
        // For "createdAt" column
        createdAt: appointment.createdAt,
        // For "agent" column
        agent: miniAgent,
        // For "client" column
        client: miniClient,
        // For "status" column
        status: appointment.status,
        // For "reviewStars" column (not available in API)
        reviewStars: undefined,
        // For "isPaid" column (not available in API)
        isPaid: false,

        // Keep original data for reference
        originalData: appointment,
      };

      console.log("Transformed row:", transformedRow); // Debug log for each row

      return transformedRow;
    });
  };

  // Handle data updates and pass to parent component
  const handleDataUpdate = (data: any[], filters: Record<string, any>) => {
    if (onDataUpdate) {
      onDataUpdate(data, filters);
    }
  };

  const appointmentColumns = useCustomerAppointmentColumns();

  // ✅ Filter columns by context - hide client column since we're viewing specific client's appointments
  const filteredColumns = useMemo(
    () =>
      appointmentColumns.filter((col) => {
        // Hide client column when viewing specific client's appointments
        if (clientId && col.key === "client") return false;
        return true;
      }),
    [clientId, appointmentColumns]
  );

  // ✅ Role-based filters
  const roleBasedFilters = useMemo(() => {
    if (!role) return [];

    return getRoleBasedAppointmentFilters(role, appointmentFilters);
  }, [role]);

  // ✅ Role-based sort config
  const roleBasedSortConfig = useMemo(() => {
    if (role === "admin") return appointmentSortConfig;
    // remove "اسم الوسيط" sort for non-admins
    return {
      ...appointmentSortConfig,
      sortFields: appointmentSortConfig.sortFields.filter(
        (f) => f.value !== "agentName"
      ),
    };
  }, [role]);

  // ✅ Role-based actions

  return (
    <DataView<AppointmentRow>
      columns={filteredColumns}
      filters={roleBasedFilters}
      sortConfig={roleBasedSortConfig}
      showSearch={false}
      showSort={false}
      getRows={getRows}
      showActions={false}
      onDataUpdate={handleDataUpdate}
    />
  );
}

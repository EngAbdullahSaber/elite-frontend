"use client";
import DataView from "@/components/shared/DateViewTable/DataView";
import {
  appointmentFilters,
  appointmentSortConfig,
  useAppointmentRequestColumns,
} from "@/constants/dashboard/admin/appointment/contants";
import { AppointmentRow } from "@/types/dashboard/appointment";
import { FaExchangeAlt, FaEye, FaUserEdit } from "react-icons/fa";
import AppointmentStatusToggleRequest from "./AppointmentStatusToggleRequest";
import {
  ActionType,
  MenuActionItem,
} from "@/components/shared/Header/MenuActionList";
import { useRoleFromPath } from "@/hooks/dashboard/admin/useRoleFromPath";
import { useMemo, useState, useCallback } from "react";
import { getRoleBasedAppointmentFilters } from "@/utils/appointment";
import { getAppointmentsRequests } from "@/services/appointments/appointments";

type AppointmentsDataViewRequestsProps = {
  onDataUpdate?: (data: any[], filters: Record<string, any>) => void;
};

export default function AppointmentsDataViewRequests({
  onDataUpdate,
}: AppointmentsDataViewRequestsProps) {
  const appointmentColumns = useAppointmentRequestColumns();
  const role = useRoleFromPath();
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger refresh

  // Create a callback to refresh the data
  const refreshAppointmentsData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1); // Increment to trigger refresh
  }, []);

  // Direct method to fetch and transform data with pagination
  const getRows = async (
    filters?: Record<string, any>,
    signal?: AbortSignal
  ) => {
    try {
      // Extract pagination parameters from filters
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;

      // Prepare API parameters
      const apiParams: Record<string, any> = {
        page,
        limit,
      };

      const response = await getAppointmentsRequests(apiParams, signal);

      // Handle the nested response structure with pagination
      if (response && typeof response === "object") {
        let data: any[] = [];
        let totalCount = 0;
        let currentPage = page;
        let perPage = limit;

        // Adjust based on your API response structure
        if (response?.pending?.data) {
          data = response.pending?.data;
          totalCount = response.totalCount || response.total || data.length;
          currentPage = response.currentPage || response.page || page;
          perPage = response.perPage || response.limit || limit;
        } else if (Array.isArray(response.data)) {
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

        // Return the expected structure for DataView component with pagination
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
  };

  // Modified getRows that includes refresh trigger and handles pagination
  const getRowsWithRefresh = useCallback(
    async (filters?: Record<string, any>, signal?: AbortSignal) => {
      // This will be called whenever refreshTrigger changes or pagination changes
      return await getRows(filters, signal);
    },
    [refreshTrigger]
  ); // Add refreshTrigger as dependency

  // Helper function to transform the nested appointment data to flat rows
  const transformAppointmentData = (appointments: any[]): AppointmentRow[] => {
    if (!appointments || !Array.isArray(appointments)) return [];

    return appointments.map((item) => {
      const appointment = item.appointment || item; // Handle both nested and flat structures

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
      const transformedRow: any = {
        id: item.id,
        // For "project" column
        project: miniProject,
        // For "appointmentAt" column - combine date and time
        appointmentAt:
          appointment?.appointmentDate && appointment?.startTime
            ? `${appointment.appointmentDate}T${appointment.startTime}`
            : null,
        // For "createdAt" column
        createdAt: appointment?.createdAt || item.createdAt,
        // For "agent" column
        agent: miniAgent,
        // For "client" column
        client: miniClient,
        // For "status" column
        status: item.status,
        // For "reviewStars" column (not available in API)
        reviewStars: undefined,
        // For "isPaid" column (not available in API)
        isPaid: false,

        // Keep original data for reference
        originalData: item,
      };

      console.log("Transformed row:", transformedRow); // Debug log for each row

      return transformedRow as AppointmentRow;
    });
  };

  // Handle data updates and pass to parent component
  const handleDataUpdate = (data: any[], filters: Record<string, any>) => {
    if (onDataUpdate) {
      onDataUpdate(data, filters);
    }
  };

  // ✅ Filter columns by context
  const filteredColumns = useMemo(
    () =>
      appointmentColumns.filter((col) => {
        return true;
      }),
    [appointmentColumns]
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
  const getActionsMenu = useMemo(
    () =>
      (row: AppointmentRow, onClose?: () => void): MenuActionItem[] => {
        const base: MenuActionItem[] = [
          {
            label: "تغيير الحالة",
            type: "primary" as ActionType,
            icon: <FaExchangeAlt />,
            child: (
              <AppointmentStatusToggleRequest
                appointmentId={row.id}
                currentStatus={row.status}
                onConfirm={() => {
                  onClose?.();
                }}
                onCancel={() => {}}
                onStatusUpdated={refreshAppointmentsData} // Pass refresh callback
              />
            ),
          },
        ];

        return base;
      },
    [role, refreshAppointmentsData] // Add refreshAppointmentsData to dependencies
  );

  return (
    <DataView<AppointmentRow>
      columns={filteredColumns}
      filters={roleBasedFilters}
      sortConfig={roleBasedSortConfig}
      showSearch={false}
      showSort
      getRows={getRowsWithRefresh} // Use the version with refresh trigger
      showActions
      actionsMenuItems={getActionsMenu}
      onDataUpdate={handleDataUpdate}
      key={refreshTrigger} // This will force re-render when refreshTrigger changes
    />
  );
}

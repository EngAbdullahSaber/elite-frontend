"use client";
import DataView from "@/components/shared/DateViewTable/DataView";
import {
  appointmentFilters,
  appointmentSortConfig,
  useAppointmentRequestColumns,
} from "@/constants/dashboard/admin/appointment/contants";
import { AppointmentRow } from "@/types/dashboard/appointment";
import { FaExchangeAlt } from "react-icons/fa";
import AgentStatusToggle from "./AgentStatusToggle";
import {
  ActionType,
  MenuActionItem,
} from "@/components/shared/Header/MenuActionList";
import { useRoleFromPath } from "@/hooks/dashboard/admin/useRoleFromPath";
import { useMemo, useState, useCallback } from "react";
import { getRoleBasedAppointmentFilters } from "@/utils/appointment";
import { getAppointmentsRequests } from "@/services/appointments/appointments";

type AgentAppointmentsDataViewProps = {
  agentId?: number;
  clientId?: number;
  onDataUpdate?: (data: any[], filters: Record<string, any>) => void;
};

export default function AgentAppointmentsDataView({
  agentId,
  clientId,
  onDataUpdate,
}: AgentAppointmentsDataViewProps) {
  const appointmentColumns = useAppointmentRequestColumns();
  const role = useRoleFromPath();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshAppointmentsData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Direct method to fetch and transform data
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

      // Add other filters if present
      if (filters) {
        Object.keys(filters).forEach((key) => {
          if (key !== "page" && key !== "limit" && filters[key]) {
            apiParams[key] = filters[key];
          }
        });
      }

      const response = await getAppointmentsRequests(apiParams, signal);

      console.log("API Response:", response); // Debug log

      // Handle the nested response structure - use only confirmed data
      if (response && typeof response === "object") {
        let data: any[] = [];
        let totalCount = 0;
        let currentPage = page;
        let perPage = limit;

        // Use only confirmed data
        if (
          response.confirmed?.data &&
          Array.isArray(response.confirmed.data)
        ) {
          data = response.confirmed.data;
          totalCount = response.confirmed.total || 0;
          currentPage = response.confirmed.page || page;
          perPage = response.confirmed.limit || limit;
        }

        // Transform the data to match AppointmentRow structure
        const transformedRows = transformAppointmentData(data);

        console.log("Transformed rows:", transformedRows); // Debug log

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
  };

  // Modified getRows that includes refresh trigger
  const getRowsWithRefresh = useCallback(
    async (filters?: Record<string, any>, signal?: AbortSignal) => {
      return await getRows(filters, signal);
    },
    [refreshTrigger]
  );

  // Helper function to transform the appointment data to flat rows
  const transformAppointmentData = (appointments: any[]): AppointmentRow[] => {
    if (!appointments || !Array.isArray(appointments)) return [];

    return appointments.map((appointment) => {
      // Create MiniProject object for the project column
      const miniProject = {
        id: appointment?.appointment?.property?.id,
        title: appointment?.appointment?.property?.title,
        type: appointment?.appointment?.property?.propertyType?.name,
        image: appointment?.appointment?.property?.image || null,
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

      const miniClient = appointment?.appointment?.customer
        ? {
            id: appointment.appointment.customer.id,
            name: appointment.appointment.customer.fullName,
            email: appointment.appointment.customer.email,
            image: appointment.appointment.customer.profilePhotoUrl,
          }
        : undefined;

      // Create the transformed row object matching what columns expect
      const transformedRow: AppointmentRow = {
        id: appointment.id,
        // For "project" column
        project: miniProject,
        // For "appointmentAt" column - combine date and time from appointment object
        appointmentAt:
          appointment?.appointment?.appointmentDate &&
          appointment?.appointment?.startTime
            ? `${appointment.appointment.appointmentDate}T${appointment.appointment.startTime}`
            : null,
        // For "createdAt" column
        createdAt: appointment.createdAt,
        // For "agent" column
        agent: miniAgent,
        // For "client" column
        client: miniClient,
        // For "status" column - use the appointment request status
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

  // ✅ Filter columns by context
  const filteredColumns = useMemo(
    () =>
      appointmentColumns.filter((col) => {
        if (clientId && col.key === "client") return false;
        if (agentId && col.key === "agent") return false;
        return true;
      }),
    [clientId, agentId, appointmentColumns]
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
              <AgentStatusToggle
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
    [role, refreshAppointmentsData]
  );

  return (
    <DataView<AppointmentRow>
      columns={filteredColumns}
      filters={roleBasedFilters}
      sortConfig={roleBasedSortConfig}
      showSearch={false}
      showSort
      getRows={getRowsWithRefresh}
      showActions
      actionsMenuItems={getActionsMenu}
      onDataUpdate={handleDataUpdate}
      key={refreshTrigger}
    />
  );
}

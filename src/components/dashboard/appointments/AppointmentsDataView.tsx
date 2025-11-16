"use client";
import DataView from "@/components/shared/DateViewTable/DataView";
import {
  agents,
  useAppointmentColumns,
  appointmentFilters,
  appointmentSortConfig,
} from "@/constants/dashboard/admin/appointment/contants";
import useAppointments from "@/hooks/dashboard/admin/appointments/useAppointments";
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
import { useMemo, useEffect, useState } from "react";
import { getRoleBasedAppointmentFilters } from "@/utils/appointment";

type AppointmentsDataViewProps = {
  onDataUpdate?: (data: any[], filters: Record<string, any>) => void;
};

interface UserData {
  id: number;
  userType: string;
  email: string;
  fullName: string;
  // Add other user properties as needed
}

export default function AppointmentsDataView({
  onDataUpdate,
}: AppointmentsDataViewProps) {
  const role = useRoleFromPath();
  const [sessionAgentId, setSessionAgentId] = useState<number | undefined>();
  const [sessionClientId, setSessionClientId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  // Get user data from sessionStorage based on role
  useEffect(() => {
    const getUserDataFromSession = () => {
      try {
        const userDataString = sessionStorage.getItem("user");
        if (userDataString) {
          const userData: UserData = JSON.parse(userDataString);

          // Set IDs based on user type
          if (userData.userType === "agent") {
            setSessionAgentId(userData.id);
          } else if (userData.userType === "customer") {
            setSessionClientId(userData.id);
          }
        }
      } catch (error) {
        console.error("Error parsing user data from sessionStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserDataFromSession();
  }, []);

  // Use props if provided, otherwise use session data
  const finalAgentId = sessionAgentId;
  const finalClientId = sessionClientId;

  const getRows = useAppointments({
    agentId: finalAgentId,
    clientId: finalClientId,
  });

  const appointmentColumns = useAppointmentColumns();

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
        if (finalClientId && col.key === "client") return false;
        if (finalAgentId && col.key === "agent") return false;
        return true;
      }),
    [finalClientId, finalAgentId, appointmentColumns]
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
            label: "عرض التفاصيل",
            icon: <FaEye />,
            link: `/dashboard/${role}/appointments/${row.id}`,
          },
        ];

        // // Only show status change for admin or if user is the agent/client of the appointment
        // const canChangeStatus =
        //   role === "admin" ||
        //   (role === "agent" && finalAgentId === row.agent?.id) ||
        //   (role === "client" && finalClientId === row.client?.id);

        // if (canChangeStatus) {
        //   base.push({
        //     label: "تغيير الحالة",
        //     type: "primary" as ActionType,
        //     icon: <FaExchangeAlt />,
        //     child: (
        //       <AppointmentStatusToggle
        //         appointmentId={row.id}
        //         currentStatus={row.status}
        //         onConfirm={() => {
        //           onClose?.();
        //         }}
        //         onCancel={() => {}}
        //       />
        //     ),
        //   });
        // }

        // if (role === "admin") {
        //   base.splice(1, 0, {
        //     label: row.agent ? "تغيير الوسيط" : "تعيين وسيط",
        //     type: "primary" as ActionType,
        //     icon: <FaUserEdit />,
        //     child: (
        //       <AgentAssignmentToggle
        //         users={agents}
        //         label="وسيط"
        //         appointmentId={row.id}
        //         selectedUser={row.agent}
        //         onConfirm={(agent) => {
        //           onClose?.();
        //         }}
        //       />
        //     ),
        //   });

        //   if (row.status === "completed" && !row.isPaid) {
        //     base.push({
        //       label: "إرفاق إثبات الدفع",
        //       type: "primary" as ActionType,
        //       icon: <FaExchangeAlt />,
        //       child: (
        //         <AppointmentProofUploadToggle
        //           appointmentId={row.id}
        //           onConfirm={() => {
        //             onClose?.();
        //           }}
        //           onCancel={() => {}}
        //         />
        //       ),
        //     });
        //   }
        // }

        return base;
      },
    [role, finalAgentId, finalClientId]
  );

  // Show loading while reading session storage
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="mr-3">جاري تحميل البيانات...</span>
      </div>
    );
  }

  return (
    <DataView<AppointmentRow>
      columns={filteredColumns}
      filters={roleBasedFilters}
      sortConfig={roleBasedSortConfig}
      showSearch={false}
      showSort
      getRows={getRows}
      showActions
      actionsMenuItems={getActionsMenu}
      onDataUpdate={handleDataUpdate}
    />
  );
}

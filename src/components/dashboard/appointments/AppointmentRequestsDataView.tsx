"use client";

import { useCallback, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import {
  appointmentRequestColumns,
  appointmentRequestFilters,
  AppointmentRequestRow,
  appointmentRequestSortConfig,
} from "@/constants/dashboard/agent/appointment-requests/constants";
import useAppointmentRequests from "@/hooks/dashboard/agent/appointments/useAppointmentRequests";
import { MenuActionItem } from "@/components/shared/Header/MenuActionList";
import { ActionType } from "@/components/shared/Header/MenuActionList";
import ConfirmActionToggle from "@/components/shared/ConfirmActionToggle";
import DataView from "@/components/shared/DateViewTable/DataView";
import { updateAppointmentStatus } from "@/services/appointments/appointments";
import toast from "react-hot-toast";

// Custom toast functions
const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 4000,
    position: "top-center",
    icon: "✅",
    style: {
      background: "#10B981",
      color: "#fff",
      borderRadius: "8px",
      fontSize: "14px",
    },
  });
};

const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: "top-center",
    icon: "❌",
    style: {
      background: "#EF4444",
      color: "#fff",
      borderRadius: "8px",
      fontSize: "14px",
    },
  });
};

export default function AppointmentRequestsDataView() {
  const getRows = useAppointmentRequests();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusUpdate = useCallback(
    async (id: number, status: "confirmed" | "cancelled", notes?: string) => {
      setUpdatingId(id);

      try {
        await updateAppointmentStatus(id, {
          status,
          notes:
            notes ||
            `Appointment ${
              status === "confirmed" ? "confirmed" : "cancelled"
            } by agent`,
        });

        if (status === "confirmed") {
          showSuccessToast("تم قبول الطلب بنجاح - تم تأكيد الموعد بنجاح");
        } else {
          showSuccessToast("تم رفض الطلب بنجاح - تم إلغاء الموعد بنجاح");
        }

        // Refresh the data table
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("refresh-appointment-data"));
        }
      } catch (error: any) {
        console.error(`Error updating appointment status:`, error);

        const errorMessage =
          error.response?.data?.message || error.message || "حدث خطأ غير متوقع";

        if (status === "confirmed") {
          showErrorToast(`فشل في قبول الطلب: ${errorMessage}`);
        } else {
          showErrorToast(`فشل في رفض الطلب: ${errorMessage}`);
        }
      } finally {
        setUpdatingId(null);
      }
    },
    []
  );

  const getActionsMenu = useCallback(
    (row: AppointmentRequestRow, onClose?: () => void): MenuActionItem[] => {
      const isUpdating = updatingId === row.id;

      return [
        {
          label: isUpdating ? "جاري القبول..." : "قبول الطلب",
          type: "primary" as ActionType,
          icon: <FaCheck />,
          disabled: isUpdating || row.status !== "pending",
          child: !isUpdating ? (
            <ConfirmActionToggle
              title="تأكيد قبول الطلب"
              message="هل أنت متأكد أنك تريد قبول هذا الطلب؟"
              confirmLabel="قبول"
              cancelLabel="إلغاء"
              onConfirm={async () => {
                await handleStatusUpdate(
                  row.id,
                  "confirmed",
                  "تم قبول الموعد من قبل الوكيل"
                );
                onClose?.();
              }}
              onCancel={onClose}
            />
          ) : undefined,
        },
        {
          label: isUpdating ? "جاري الرفض..." : "رفض الطلب",
          type: "danger" as ActionType,
          icon: <FaTimes />,
          disabled: isUpdating || row.status !== "pending",
          child: !isUpdating ? (
            <ConfirmActionToggle
              title="تأكيد رفض الطلب"
              message="هل أنت متأكد أنك تريد رفض هذا الطلب؟"
              confirmLabel="رفض"
              cancelLabel="إلغاء"
              onConfirm={async () => {
                await handleStatusUpdate(
                  row.id,
                  "cancelled",
                  "تم رفض الموعد من قبل الوكيل"
                );
                onClose?.();
              }}
              onCancel={onClose}
            />
          ) : undefined,
        },
      ];
    },
    [handleStatusUpdate, updatingId]
  );

  return (
    <DataView<AppointmentRequestRow>
      columns={appointmentRequestColumns}
      filters={appointmentRequestFilters}
      sortConfig={appointmentRequestSortConfig}
      showSearch={false}
      showSort
      getRows={getRows}
      showActions
      actionsMenuItems={getActionsMenu}
    />
  );
}

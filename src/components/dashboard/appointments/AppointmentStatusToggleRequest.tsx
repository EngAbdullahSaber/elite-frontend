"use client";
import SelectDropdown from "@/components/shared/Forms/SelectDropdown";
import {
  bookingStatusMapReques,
  bookingStatusStyle,
} from "@/constants/dashboard/admin/appointment/contants";
import { useRoleFromPath } from "@/hooks/dashboard/admin/useRoleFromPath";
import { updateAppointmentStatusRequest } from "@/services/appointments/appointments";
import { BookingStatus } from "@/types/global";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";

type Props = {
  appointmentId: number;
  currentStatus: BookingStatus;
  onConfirm?: () => void;
  onCancel?: () => void;
  onStatusUpdated?: () => void; // New callback to refresh data
};

export default function AppointmentStatusToggleRequest({
  appointmentId,
  currentStatus,
  onConfirm,
  onCancel,
  onStatusUpdated, // New prop
}: Props) {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<BookingStatus>(currentStatus);

  const handleChange = (value: string) => {
    setSelectedStatus(value as BookingStatus);
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      await updateAppointmentStatusRequest(appointmentId, {
        status: selectedStatus,
      });

      // Show success toast
      toast.success("تم تحديث حالة الموعد بنجاح", {
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

      // Call both callbacks
      if (onConfirm) onConfirm();
      if (onStatusUpdated) onStatusUpdated(); // Refresh the data
    } catch (error) {
      console.error("Failed to update appointment status:", error);

      // Show error toast
      toast.error("فشل في تحديث حالة الموعد", {
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
    } finally {
      setLoading(false);
    }
  };

  const title = "تغيير حالة الموعد";
  const message = `اختر الحالة الجديدة للموعد رقم ${appointmentId}.`;
  const style = currentStatus
    ? bookingStatusStyle[currentStatus]
    : "bg-gray-100 text-gray-500";

  const role = useRoleFromPath();

  const statusOptions = useMemo(() => {
    const allOptions = Object.entries(bookingStatusMapReques).map(
      ([value, label]) => ({
        value,
        label,
      })
    );

    if (role === "agent") {
      // Remove 'pending', 'assigned', 'confirmed'
      return allOptions.filter(
        (option) =>
          option.value !== "pending" &&
          option.value !== "assigned" &&
          option.value !== "confirmed"
      );
    }

    return allOptions;
  }, [role]);

  return (
    <div className="rounded-lg bg-white max-w-md mx-auto">
      <h3 className="text-lg font-bold text-gray-800 text-center">{title}</h3>
      <p className="text-sm text-gray-600 text-center mb-4">
        {message}
        <span className={`${style} !bg-white`}>
          {" "}
          الحالة الحالية هي {bookingStatusMapReques[currentStatus]}
        </span>
      </p>

      <SelectDropdown
        options={statusOptions}
        value={selectedStatus}
        onChange={handleChange}
        label="الحالة الجديدة"
      />

      <div className="flex justify-end gap-3 pt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          إلغاء
        </button>
        <button
          onClick={handleToggle}
          disabled={loading}
          className="px-4 py-2 rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-600)]"
        >
          {loading
            ? "جارٍ التنفيذ..."
            : `تأكيد التغيير إلى "${bookingStatusMapReques[selectedStatus]}"`}
        </button>
      </div>
    </div>
  );
}

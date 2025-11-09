"use client";

import SelectDropdown from "@/components/shared/Forms/SelectDropdown";
import {
  propertySubmissionStatusMap,
  propertySubmissionStatusStyle,
} from "@/constants/dashboard/admin/propertySubmissions/constants";
import { useState } from "react";
import {
  publishPropertySubmission,
  approvePropertySubmission,
  rejectPropertySubmission,
} from "@/services/propertySubmissions/propertySubmissions";
import toast from "react-hot-toast";

// Define the type locally
type PropertySubmissionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "published";

type Props = {
  requestId: number;
  currentStatus: PropertySubmissionStatus;
  onConfirm?: () => void;
  onCancel?: () => void;
  onStatusChange?: () => void; // Add this prop for refresh
};

export default function PropertySubmissionStatusToggle({
  requestId,
  currentStatus,
  onConfirm,
  onCancel,
  onStatusChange, // Add this prop
}: Props) {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<PropertySubmissionStatus>(currentStatus);

  const handleChange = (value: string) => {
    setSelectedStatus(value as PropertySubmissionStatus);
  };

  const showSuccessToast = () => {
    toast.success("تم تحديث طلب العقار بنجاح", {
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

  const showErrorToast = (errorMessage: string = "فشل في تحديث حالة الطلب") => {
    toast.error(errorMessage, {
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

  const handleToggle = async () => {
    // Don't do anything if status hasn't changed
    if (selectedStatus === currentStatus) {
      onCancel?.();
      return;
    }

    setLoading(true);
    try {
      // Use the appropriate API method based on the selected status
      switch (selectedStatus) {
        case "published":
          await publishPropertySubmission(requestId);
          break;
        case "approved":
          await approvePropertySubmission(requestId);
          break;
        case "rejected":
          await rejectPropertySubmission(requestId);
          break;
        case "pending":
          // For pending status, you might need a different endpoint
          // If not available, you can use updatePropertySubmissionStatus if you have it
          // await updatePropertySubmissionStatus(requestId, "pending");
          break;
        default:
          break;
      }

      showSuccessToast();
      onConfirm?.();
      onStatusChange?.(); // Call the refresh callback
    } catch (error: any) {
      console.error("Failed to update property request status:", error);

      // Show specific error message based on the error
      const errorMessage =
        error.response?.data?.message || "فشل في تحديث حالة الطلب";
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter status options to only include the four allowed statuses
  const allowedStatuses: PropertySubmissionStatus[] = [
    "pending",
    "approved",
    "rejected",
    "published",
  ];

  const statusOptions = Object.entries(propertySubmissionStatusMap)
    .filter(([value]) =>
      allowedStatuses.includes(value as PropertySubmissionStatus)
    )
    .map(([value, label]) => ({
      value,
      label,
    }));

  return (
    <div className="rounded-lg bg-white max-w-md mx-auto p-6">
      <h3 className="text-lg font-bold text-gray-800 text-center mb-4">
        تغيير حالة الطلب
      </h3>
      <p className="text-sm text-gray-600 text-center mb-4">
        اختر الحالة الجديدة للطلب رقم {requestId}.
      </p>

      <div className="mb-4 text-center">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${propertySubmissionStatusStyle[currentStatus]}`}
        >
          الحالة الحالية: {propertySubmissionStatusMap[currentStatus]}
        </span>
      </div>

      <SelectDropdown
        options={statusOptions}
        value={selectedStatus}
        onChange={handleChange}
        label="الحالة الجديدة"
        className="mb-6"
      />

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          إلغاء
        </button>
        <button
          onClick={handleToggle}
          disabled={loading || selectedStatus === currentStatus}
          className="px-4 py-2 rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جارٍ التحديث...
            </span>
          ) : (
            `تأكيد التغيير إلى "${propertySubmissionStatusMap[selectedStatus]}"`
          )}
        </button>
      </div>
    </div>
  );
}

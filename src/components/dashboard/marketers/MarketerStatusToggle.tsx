// components/dashboard/admin/marketers/MarketerStatusToggle.tsx

"use client";

import { useState } from "react";
import { MarketerRow, MarketerStatus } from "@/types/dashboard/marketer";
import { updateMarketerStatus } from "@/services/marketers/marketers";

interface MarketerStatusToggleProps {
  marketer: MarketerRow;
  currentStatus: MarketerStatus;
  nextStatus: MarketerStatus;
  onConfirm: () => void;
}

export default function MarketerStatusToggle({
  marketer,
  currentStatus,
  nextStatus,
  onConfirm,
}: MarketerStatusToggleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async () => {
    try {
      setIsLoading(true);

      // Convert status to isActive boolean
      const isActive = nextStatus === "active";

      // Update marketer status via API
      await updateMarketerStatus(parseInt(marketer.userId!), isActive);

      onConfirm();
    } catch (error) {
      console.error("Error updating marketer status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleStatusChange}
      disabled={isLoading}
      className={`w-full text-right px-4 py-2 text-sm ${
        nextStatus === "active"
          ? "text-green-600 hover:bg-green-50"
          : "text-red-600 hover:bg-red-50"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isLoading
        ? "جاري التحديث..."
        : nextStatus === "active"
        ? "تفعيل الحساب"
        : "تعطيل الحساب"}
    </button>
  );
}

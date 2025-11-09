"use client";

import { useState } from "react";
import { updateClientStatus } from "@/services/clinets/clinets"; // Adjust import path
import { toast } from "react-hot-toast";

type ClientStatusToggleProps = {
  client: any;
  currentStatus: "active" | "suspended";
  onConfirm?: () => void;
  onStatusChange?: (newStatus: "active" | "suspended") => void; // Add this prop
};

export default function ClientStatusToggle({
  client,
  currentStatus,
  onConfirm,
  onStatusChange,
}: ClientStatusToggleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const newStatus = currentStatus === "active" ? "suspended" : "active";

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Convert status to boolean for the API
      const isActive = newStatus === "active" ? "activate" : "deactivate";

      // Call the API to update client status
      await updateClientStatus(client.id, isActive);

      // Show success toast
      toast.success(
        newStatus === "active"
          ? "تم تفعيل الحساب بنجاح"
          : "تم تعليق الحساب بنجاح",
        {
          duration: 4000,
          position: "top-center",
          icon: "✅",
          style: {
            background: "#10B981",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
          },
        }
      );

      // Notify parent about status change
      if (onStatusChange) {
        onStatusChange(newStatus);
      }

      // Close the menu/dialog
      if (onConfirm) {
        onConfirm();
      }
    } catch (err) {
      console.error("Failed to update client status:", err);
      setError("فشل في تحديث حالة العميل. يرجى المحاولة مرة أخرى.");

      // Show error toast
      toast.error("فشل في تحديث حالة العميل", {
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
      setIsLoading(false);
    }
  };

  const getStatusMessages = () => {
    if (newStatus === "active") {
      return {
        title: "تفعيل الحساب",
        message: `هل أنت متأكد من أنك تريد تفعيل حساب ${
          client.fullName || client.name
        }؟`,
        confirmText: "نعم، فعّل الحساب",
        confirmColor: "bg-green-600 hover:bg-green-700",
      };
    } else {
      return {
        title: "تعليق الحساب",
        message: `هل أنت متأكد من أنك تريد تعليق حساب ${
          client.fullName || client.name
        }؟`,
        confirmText: "نعم، علّق الحساب",
        confirmColor: "bg-red-600 hover:bg-red-700",
      };
    }
  };

  const messages = getStatusMessages();

  return (
    <div className="bg-white p-6 rounded-lg max-w-md w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {messages.title}
      </h3>

      <p className="text-gray-600 mb-6">{messages.message}</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={onConfirm} // This will just close the menu
          disabled={isLoading}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
        >
          إلغاء
        </button>

        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`px-4 py-2 text-white rounded-md transition ${messages.confirmColor} disabled:opacity-50`}
        >
          {isLoading ? "جاري المعالجة..." : messages.confirmText}
        </button>
      </div>
    </div>
  );
}

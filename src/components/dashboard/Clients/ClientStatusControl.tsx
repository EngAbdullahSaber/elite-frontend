"use client";

import { useState } from "react";
import Popup from "@/components/shared/Popup";
import ClientStatusToggle from "./ClientStatusToggle";
import { ClientRow } from "@/types/dashboard/client";
import { updateClientStatus } from "@/services/clinets/clinets";
import { toast } from "react-hot-toast"; // Add toast import
import { useRouter } from "next/navigation"; // Add router import

type Props = {
  currentStatus: "active" | "suspended";
  client: ClientRow;
  onStatusChange?: (newStatus: "active" | "suspended") => void; // Callback for parent component
};

export default function ClientStatusControl({
  currentStatus,
  client,
  onStatusChange,
}: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleStatusChange = async (newStatus: "active" | "suspended") => {
    try {
      setIsLoading(true);
      setError(null);

      // Convert status to the correct API action
      const action = newStatus === "active" ? "activate" : "deactivate";

      // Call the API to update client status
      await updateClientStatus(client.id, action);

      // Notify parent component about the status change
      if (onStatusChange) {
        onStatusChange(newStatus);
      }

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

      // Close the popup
      setShowPopup(false);

      // Optional: Refresh the page to show updated status
      setTimeout(() => {
        router.refresh(); // This will refresh the server components
      }, 1000);
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

  const getButtonConfig = () => {
    if (currentStatus === "suspended") {
      return {
        text: "تفعيل الحساب",
        bgColor: "bg-green-600",
        hoverColor: "hover:bg-green-700",
        newStatus: "active" as const,
      };
    } else {
      return {
        text: "تعليق الحساب",
        bgColor: "bg-red-600",
        hoverColor: "hover:bg-red-700",
        newStatus: "suspended" as const,
      };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        disabled={isLoading}
        className={`w-full px-4 py-2 rounded-md text-white font-semibold transition ${
          buttonConfig.bgColor
        } ${buttonConfig.hoverColor} ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "جاري التحديث..." : buttonConfig.text}
      </button>

      <Popup show={showPopup} onClose={() => !isLoading && setShowPopup(false)}>
        <ClientStatusToggle
          client={client}
          currentStatus={currentStatus}
          newStatus={buttonConfig.newStatus}
          isLoading={isLoading}
          error={error}
          onConfirm={() => handleStatusChange(buttonConfig.newStatus)}
          onCancel={() => {
            if (!isLoading) {
              setShowPopup(false);
              setError(null);
            }
          }}
        />
      </Popup>
    </>
  );
}

"use client";
import { useState } from "react";
import Popup from "@/components/shared/Popup";
import AgentStatusToggle from "./AgentStatusToggle";
import { AgentRow, AgentStatus } from "@/types/dashboard/agent";
import { agentStatusClassMap } from "@/constants/dashboard/admin/agent/contants";
import { updateAgentStatus } from "@/services/agents/agents";
import toast from "react-hot-toast";

type Props = {
  currentStatus: AgentStatus;
  agent: AgentRow;
  onStatusUpdate?: () => void;
};

export default function AgentStatusControl({
  currentStatus,
  agent,
  onStatusUpdate,
}: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [nextStatus, setNextStatus] = useState<AgentStatus>("active");
  const [loading, setLoading] = useState(false);

  // For statuses with two options, we'll render two buttons
  const isPending = currentStatus === "pending";
  const isRejected = currentStatus === "rejected";
  const isActive = currentStatus === "active";
  const isSuspended = currentStatus === "suspended";

  // Handle quick status updates without popup (for simple toggles)
  const handleQuickStatusUpdate = async (newStatus: AgentStatus) => {
    setLoading(true);
    try {
      // Convert internal status to API status
      const apiStatus = newStatus === "active" ? "approved" : newStatus;

      await updateAgentStatus(agent.id, apiStatus);

      toast.success("تم تحديث حالة الوسيط بنجاح", {
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

      onStatusUpdate?.();
    } catch (error) {
      console.error("Failed to update agent status:", error);
      toast.error("فشل في تحديث حالة الوسيط. يرجى المحاولة مرة أخرى.", {
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

  const handleStatusChange = (status: AgentStatus) => {
    setNextStatus(status);

    // For simple status changes (active/suspended), update directly without popup
    if (
      (status === "active" && currentStatus === "suspended") ||
      (status === "suspended" && currentStatus === "active")
    ) {
      handleQuickStatusUpdate(status);
    } else {
      // For pending/rejected statuses, show popup for KYC notes
      setShowPopup(true);
    }
  };

  const handleConfirm = () => {
    setShowPopup(false);
    onStatusUpdate?.();
  };

  return (
    <>
      <div className="mt-6 space-y-3">
        {/* Pending Status - Show Accept/Reject buttons */}
        {isPending && (
          <div className="flex gap-3">
            <button
              onClick={() => handleStatusChange("active")}
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-md text-white font-semibold transition disabled:opacity-50 ${agentStatusClassMap["active"]}`}
            >
              {loading ? "جاري المعالجة..." : "قبول الطلب"}
            </button>
            <button
              onClick={() => handleStatusChange("rejected")}
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-md text-white font-semibold transition disabled:opacity-50 ${agentStatusClassMap["rejected"]}`}
            >
              {loading ? "جاري المعالجة..." : "رفض الطلب"}
            </button>
          </div>
        )}

        {/* Rejected Status - Show Reactivate and Move to Pending buttons */}
        {isRejected && (
          <div className="flex gap-3">
            <button
              onClick={() => handleStatusChange("active")}
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-md text-white font-semibold transition disabled:opacity-50 ${agentStatusClassMap["active"]}`}
            >
              {loading ? "جاري المعالجة..." : "إعادة التفعيل"}
            </button>
            <button
              onClick={() => handleStatusChange("pending")}
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-md text-white font-semibold transition disabled:opacity-50 ${agentStatusClassMap["pending"]}`}
            >
              {loading ? "جاري المعالجة..." : "تحويل إلى قيد الانتظار"}
            </button>
          </div>
        )}

        {/* Active Status - Show Suspend button */}
        {isActive && (
          <button
            onClick={() => handleStatusChange("suspended")}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-md text-white font-semibold transition disabled:opacity-50 ${agentStatusClassMap["suspended"]}`}
          >
            {loading ? "جاري التعليق..." : "تعليق الحساب"}
          </button>
        )}

        {/* Suspended Status - Show Activate button */}
        {isSuspended && (
          <button
            onClick={() => handleStatusChange("active")}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-md text-white font-semibold transition disabled:opacity-50 ${agentStatusClassMap["active"]}`}
          >
            {loading ? "جاري التفعيل..." : "تفعيل الحساب"}
          </button>
        )}

        {/* Additional actions for active agents */}
        {isActive && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setNextStatus("rejected");
                setShowPopup(true);
              }}
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-md text-white font-semibold transition disabled:opacity-50 ${agentStatusClassMap["rejected"]}`}
            >
              رفض الحساب
            </button>
          </div>
        )}
      </div>

      {/* Popup for status changes that require KYC notes */}
      <Popup show={showPopup} onClose={() => setShowPopup(false)}>
        <AgentStatusToggle
          agent={agent}
          currentStatus={currentStatus}
          nextStatus={nextStatus}
          onConfirm={handleConfirm}
          onCancel={() => setShowPopup(false)}
        />
      </Popup>
    </>
  );
}

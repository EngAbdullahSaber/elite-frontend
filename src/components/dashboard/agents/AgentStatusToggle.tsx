import { agentStatusClassMap } from "@/constants/dashboard/admin/agent/contants";
import { updateAgentStatus } from "@/services/agents/agents";
import { AgentRow, AgentStatus, agentStatusMap } from "@/types/dashboard/agent";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  agent: AgentRow;
  currentStatus: AgentStatus;
  nextStatus: AgentStatus;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function AgentStatusToggle({
  agent,
  currentStatus,
  nextStatus,
  onConfirm,
  onCancel,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [kycNotes, setKycNotes] = useState("");

  const handleToggle = async () => {
    if (!kycNotes.trim() && nextStatus !== "suspended") {
      toast.error("يرجى إضافة ملاحظات KYC", {
        duration: 4000,
        position: "top-center",
        icon: "⚠️",
        style: {
          background: "#EF4444",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
      return;
    }

    setLoading(true);
    try {
      // Convert internal status to API status
      const apiStatus =
        nextStatus === "active"
          ? "approved"
          : nextStatus === "rejected"
          ? "rejected"
          : nextStatus;

      await updateAgentStatus(
        agent.id,
        apiStatus,
        kycNotes.trim() || undefined
      );

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

      if (onConfirm) onConfirm();
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

  const title = `تغيير حالة الوسيط`;
  const message = `هل أنت متأكد أنك تريد تغيير حالة "${agent.name}" (رقم ${agent.id}) من "${agentStatusMap[currentStatus]}" إلى "${agentStatusMap[nextStatus]}"؟`;

  const showKycNotes = nextStatus !== "suspended";

  return (
    <div className="rounded-lg bg-white max-w-md mx-auto p-6">
      <h3 className="text-lg font-bold text-gray-800 text-center mb-4">
        {title}
      </h3>
      <p className="text-sm text-gray-600 text-center mb-6">{message}</p>

      {showKycNotes && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ملاحظات KYC
          </label>
          <textarea
            value={kycNotes}
            onChange={(e) => setKycNotes(e.target.value)}
            placeholder="أدخل ملاحظات التحقق من الهوية..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {nextStatus === "active" ? "ملاحظات القبول" : "ملاحظات الرفض"}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          إلغاء
        </button>
        <button
          onClick={handleToggle}
          disabled={loading || (showKycNotes && !kycNotes.trim())}
          className={`px-4 py-2 rounded-md text-white ${agentStatusClassMap[nextStatus]} disabled:opacity-50`}
        >
          {loading
            ? "جارٍ التنفيذ..."
            : `تأكيد التغيير إلى ${agentStatusMap[nextStatus]}`}
        </button>
      </div>
    </div>
  );
}

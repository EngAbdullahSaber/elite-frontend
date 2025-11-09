// components/dashboard/admin/campaign/CampaignActionConfirmModal.tsx
"use client";

import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

interface CampaignActionConfirmModalProps {
  confirmAction: "pause" | "cancel" | "draft" | "resume" | null;
  campaignId: string;
  onClose: () => void;
  onConfirm: (action: "pause" | "cancel" | "draft" | "resume") => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CampaignActionConfirmModal({
  confirmAction,
  campaignId,
  onClose,
  onConfirm,
  onCancel,
  isLoading = false,
}: CampaignActionConfirmModalProps) {
  const getActionDetails = () => {
    switch (confirmAction) {
      case "pause":
        return {
          title: "إيقاف الحملة مؤقتاً",
          message:
            "هل أنت متأكد من أنك تريد إيقاف الحملة مؤقتاً؟ يمكنك استئنافها لاحقاً.",
          icon: <FaExclamationTriangle className="text-yellow-500" />,
          confirmText: "إيقاف مؤقت",
          cancelText: "إلغاء",
        };
      case "cancel":
        return {
          title: "إلغاء الحملة",
          message:
            "هل أنت متأكد من أنك تريد إلغاء الحملة؟ لا يمكن التراجع عن هذا الإجراء.",
          icon: <FaExclamationTriangle className="text-red-500" />,
          confirmText: "إلغاء الحملة",
          cancelText: "تراجع",
        };
      case "resume":
        return {
          title: "استئناف الحملة",
          message: "هل أنت متأكد من أنك تريد استئناف الحملة؟",
          icon: <FaInfoCircle className="text-green-500" />,
          confirmText: "استئناف",
          cancelText: "إلغاء",
        };
      case "draft":
        return {
          title: "حفظ كمسودة",
          message: "هل أنت متأكد من أنك تريد حفظ الحملة كمسودة؟",
          icon: <FaInfoCircle className="text-blue-500" />,
          confirmText: "حفظ كمسودة",
          cancelText: "إلغاء",
        };
      default:
        return {
          title: "",
          message: "",
          icon: null,
          confirmText: "تأكيد",
          cancelText: "إلغاء",
        };
    }
  };

  const { title, message, icon, confirmText, cancelText } = getActionDetails();

  if (!confirmAction) return null;

  return (
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <p className="text-gray-600 mb-6">{message}</p>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
        <button
          onClick={() => onConfirm(confirmAction)}
          disabled={isLoading}
          className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            confirmAction === "cancel"
              ? "bg-red-500 hover:bg-red-600"
              : confirmAction === "pause"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : confirmAction === "resume"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "جاري المعالجة..." : confirmText}
        </button>
      </div>
    </div>
  );
}

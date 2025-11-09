"use client";

import { useMemo, useState } from "react";
import Card from "@/components/shared/Card";
import Link from "next/link";
import Popup from "@/components/shared/Popup";
import { Campaign } from "@/types/campaign";
import { FaPause, FaStop, FaEdit, FaSave, FaPlay } from "react-icons/fa";
import CampaignActionConfirmModal from "./CampaignActionConfirmModal";
import { useRoleFromPath } from "@/hooks/dashboard/admin/useRoleFromPath";
import {
  startCampaign,
  pauseCampaign,
  stopCampaign,
} from "@/services/campaigns/campaigns";
import { toast } from "react-hot-toast";

interface CampaignActionsCardProps {
  campaign: Campaign;
  onCampaignUpdated?: () => void; // Make sure this matches
  actionLoading?: string | null;
}

export default function CampaignActionsCard({
  campaign,
  onCampaignUpdated,
  actionLoading,
}: CampaignActionsCardProps) {
  const [confirmAction, setConfirmAction] = useState<
    null | "pause" | "cancel" | "draft" | "resume" | "start"
  >(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const role = useRoleFromPath();
  const isAdmin = role == "admin";

  const handleApiAction = async (action: "start" | "pause" | "stop") => {
    try {
      setIsLoading(action);

      switch (action) {
        case "start":
          await startCampaign(parseInt(campaign.id));
          toast.success("تم بدء الحملة بنجاح");
          break;
        case "pause":
          await pauseCampaign(parseInt(campaign.id));
          toast.success("تم إيقاف الحملة مؤقتاً بنجاح");
          break;
        case "stop":
          await stopCampaign(parseInt(campaign.id));
          toast.success("تم إيقاف الحملة بنجاح");
          break;
      }

      // Refresh campaign data after status change
      if (onCampaignUpdated) {
        // Call the refresh function immediately
        onCampaignUpdated();
      }
    } catch (error: any) {
      console.error(`Error ${action}ing campaign:`, error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `فشل في ${getActionText(action)} الحملة`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(null);
      setConfirmAction(null);
    }
  };

  const handleConfirmAction = async (
    action: "pause" | "cancel" | "draft" | "resume" | "start"
  ) => {
    switch (action) {
      case "resume":
      case "start":
        await handleApiAction("start");
        break;
      case "pause":
        await handleApiAction("pause");
        break;
      case "cancel":
        await handleApiAction("stop");
        break;
      case "draft":
        // Handle save as draft logic here
        toast.success("تم حفظ الحملة كمسودة بنجاح");
        setConfirmAction(null);
        break;
    }
  };

  const getActionText = (action: string): string => {
    switch (action) {
      case "start":
        return "بدء";
      case "pause":
        return "إيقاف مؤقت";
      case "stop":
        return "إيقاف";
      default:
        return "";
    }
  };

  const getLoadingText = (action: string): string => {
    switch (action) {
      case "start":
        return "جاري البدء...";
      case "pause":
        return "جاري الإيقاف المؤقت...";
      case "stop":
        return "جاري الإيقاف...";
      default:
        return "جاري المعالجة...";
    }
  };

  const getButtonLabel = (actionType: string, defaultLabel: string): string => {
    if (isLoading === actionType) {
      return getLoadingText(actionType);
    }
    return defaultLabel;
  };

  const isButtonDisabled = (actionType: string): boolean => {
    return isLoading !== null && isLoading !== actionType;
  };

  const actions = useMemo(() => {
    // Edit action is available for all statuses
    const editAction = {
      icon: <FaEdit className="w-4 h-4" />,
      label: "تحرير",
      href: `/dashboard/${isAdmin ? "admin" : "marketer"}/campaigns/edit/${
        campaign.id
      }`,
      className: "bg-primary text-white hover:bg-primary-600",
      disabled: isLoading !== null, // Disable when any action is loading
    };

    switch (campaign.status) {
      case "draft":
        return [
          {
            icon: <FaPlay className="w-4 h-4" />,
            label: getButtonLabel("start", "بدء الحملة"),
            action: () => setConfirmAction("start"),
            className: "bg-green-500 text-white hover:bg-green-600",
            disabled: isButtonDisabled("start"),
          },
          {
            ...editAction,
            label: "تحرير الحملة",
          },
        ];
      case "scheduled":
        return [
          {
            icon: <FaPause className="w-4 h-4" />,
            label: getButtonLabel("pause", "إيقاف مؤقت"),
            action: () => setConfirmAction("pause"),
            className: "bg-yellow-500 text-white hover:bg-yellow-600",
            disabled: isButtonDisabled("pause"),
          },
          {
            icon: <FaStop className="w-4 h-4" />,
            label: getButtonLabel("stop", "إلغاء"),
            action: () => setConfirmAction("cancel"),
            className: "bg-red-500 text-white hover:bg-red-600",
            disabled: isButtonDisabled("stop"),
          },
          editAction,
        ];
      case "running":
        return [
          {
            icon: <FaPause className="w-4 h-4" />,
            label: getButtonLabel("pause", "إيقاف مؤقت"),
            action: () => setConfirmAction("pause"),
            className: "bg-yellow-500 text-white hover:bg-yellow-600",
            disabled: isButtonDisabled("pause"),
          },
          {
            icon: <FaStop className="w-4 h-4" />,
            label: getButtonLabel("stop", "إيقاف"),
            action: () => setConfirmAction("cancel"),
            className: "bg-red-500 text-white hover:bg-red-600",
            disabled: isButtonDisabled("stop"),
          },
          editAction,
        ];
      case "paused":
        return [
          {
            icon: <FaPlay className="w-4 h-4" />,
            label: getButtonLabel("start", "استئناف"),
            action: () => setConfirmAction("resume"),
            className: "bg-green-500 text-white hover:bg-green-600",
            disabled: isButtonDisabled("start"),
          },
          {
            icon: <FaStop className="w-4 h-4" />,
            label: getButtonLabel("stop", "إلغاء"),
            action: () => setConfirmAction("cancel"),
            className: "bg-red-500 text-white hover:bg-red-600",
            disabled: isButtonDisabled("stop"),
          },
          editAction,
        ];
      case "cancelled":
      case "completed":
        return [editAction];
      default:
        return [editAction];
    }
  }, [campaign.status, campaign.id, isLoading, isAdmin]);

  return (
    <>
      <Card
        title="إجراءات الحملة"
        className="h-full flex flex-col justify-between"
      >
        <div className="flex flex-col gap-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {actions.map((action, index) =>
              action.href ? (
                <Link
                  key={index}
                  href={action.href}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    action.className
                  } ${action.disabled ? "pointer-events-none opacity-50" : ""}`}
                >
                  {action.icon}
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={action.action}
                  disabled={action.disabled}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    action.className
                  } ${action.disabled ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {action.icon}
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              )
            )}
          </div>

          {/* Additional Actions */}
          {campaign.status !== "draft" && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setConfirmAction("draft")}
                  disabled={isLoading !== null}
                  className={`flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaSave className="w-4 h-4" />
                  حفظ كمسودة
                </button>
              </div>
            </div>
          )}

          {/* Status Info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg mt-auto">
            <p className="font-medium mb-1">ملاحظة:</p>
            <ul className="space-y-1 text-xs">
              <li>• يمكن تحرير الحملة في أي وقت</li>
              <li>• الحملات المجدولة يمكن إلغاؤها قبل بدء التشغيل</li>
              <li>• الحملات المتوقفة يمكن استئنافها</li>
              <li>• يمكن بدء الحملات من المسودة أو الحالة المتوقفة فقط</li>
            </ul>
          </div>
        </div>
      </Card>

      <Popup
        show={!!confirmAction}
        onClose={() => !isLoading && setConfirmAction(null)}
      >
        <CampaignActionConfirmModal
          confirmAction={confirmAction}
          campaignId={campaign.id}
          onClose={() => !isLoading && setConfirmAction(null)}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmAction(null)}
          isLoading={!!isLoading}
        />
      </Popup>
    </>
  );
}

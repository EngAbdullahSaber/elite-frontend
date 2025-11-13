"use client";
import DataView from "@/components/shared/DateViewTable/DataView";
import { MenuActionItem } from "@/components/shared/Header/MenuActionList";
import {
  campaignColumns,
  campaignFilters,
  campaignSortConfig,
} from "@/constants/dashboard/admin/campaign/contants";
import { CampaignRow } from "@/types/dashboard/campaign";
import { FaEdit, FaEye, FaPause, FaStop, FaSave, FaPlay } from "react-icons/fa";
import { JSX } from "react";
import CampaignActionConfirmModal, {
  ActionType,
} from "./CampaignActionConfirmModal";
import { useRoleFromPath } from "@/hooks/dashboard/admin/useRoleFromPath";
import { Role } from "@/types/global";
import useCampaigns from "@/hooks/dashboard/admin/campaign/useCampaigns";

interface CampaignsDataViewProps {
  onDataUpdate?: (data: any[], filters: Record<string, any>) => void;
}

export default function CampaignsDataView({
  onDataUpdate,
}: CampaignsDataViewProps) {
  const role = useRoleFromPath();
  const isAdmin = role == "admin";
  const getRows = useCampaigns();

  // Handle data updates and pass to parent component
  const handleDataUpdate = (data: any[], filters: Record<string, any>) => {
    onDataUpdate?.(data, filters);
  };

  return (
    <DataView<CampaignRow>
      columns={campaignColumns}
      filters={campaignFilters}
      sortConfig={campaignSortConfig}
      showSearch
      showSort
      getRows={getRows}
      showActions
      actionsMenuItems={(row, onClose) =>
        getCampaignActionsMenu(row, role, onClose)
      }
      onDataUpdate={handleDataUpdate}
    />
  );
}

export function getCampaignActionsMenu(
  row: CampaignRow,
  role: Role | undefined,
  onClose?: () => void
): MenuActionItem[] {
  const basePath = role === "admin" ? "admin/campaigns" : "marketer/campaigns";

  const baseActions: MenuActionItem[] = [
    {
      label: "عرض التفاصيل",
      icon: <FaEye />,
      link: `/dashboard/${basePath}/${row.id}`,
    },
    {
      label: "تحرير الحملة",
      icon: <FaEdit />,
      link: `/dashboard/${basePath}/edit/${row.id}`,
    },
  ];

  const statusActions: MenuActionItem[] = [];

  const statusToggle = (
    label: string,
    icon: JSX.Element,
    type: "normal" | "delete",
    actionType: ActionType
  ): MenuActionItem => ({
    label,
    icon,
    type,
    child: (
      <CampaignActionConfirmModal
        confirmAction={actionType}
        campaignId={row.id}
        onClose={() => {
          onClose?.();
        }}
        onConfirm={() => console.log("")}
        onCancel={() => console.log("")}
      />
    ),
  });

  switch (row.status) {
    case "draft":
      statusActions.push(
        statusToggle("بدء الحملة", <FaPlay />, "normal", "start")
      );
      break;

    case "scheduled":
      statusActions.push(
        statusToggle("بدء الحملة", <FaPlay />, "normal", "start"),
        statusToggle("إلغاء الحملة", <FaStop />, "delete", "cancel")
      );
      break;

    case "running":
      statusActions.push(
        statusToggle("إيقاف مؤقت", <FaPause />, "delete", "pause"),
        statusToggle("إيقاف الحملة", <FaStop />, "delete", "stop")
      );
      break;

    case "paused":
      statusActions.push(
        statusToggle("استئناف الحملة", <FaPlay />, "normal", "resume"),
        statusToggle("إيقاف الحملة", <FaStop />, "delete", "stop")
      );
      break;

    case "completed":
      statusActions.push(
        statusToggle("إعادة التشغيل", <FaPlay />, "normal", "restart")
      );
      break;

    case "cancelled":
      statusActions.push(
        statusToggle("إعادة الجدولة", <FaSave />, "normal", "reschedule")
      );
      break;

    default:
      break;
  }

  return [...baseActions, ...statusActions];
}

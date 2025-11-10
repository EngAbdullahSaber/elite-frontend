"use client";

import DataView from "@/components/shared/DateViewTable/DataView";
import { propertySubmissionRow } from "@/types/dashboard/property-submissions";
import { FaEdit, FaExchangeAlt, FaEye } from "react-icons/fa";
import {
  ActionType,
  MenuActionItem,
} from "@/components/shared/Header/MenuActionList";
import PropertySubmissionStatusToggle from "./PropertySubmissionStatusToggle";
import {
  propertySubmissionColumns,
  propertySubmissionFilters,
  propertySubmissionSortConfig,
} from "@/constants/dashboard/admin/propertySubmissions/constants";
import usePropertySubmissions from "@/hooks/dashboard/admin/propertySubmissions/usePropertySubmissions";
import { useState, useEffect } from "react";

interface PropertySubmissionsDataViewProps {
  onDataUpdate?: (data: any[], filters: Record<string, any>) => void;
}

export default function PropertySubmissionsDataView({
  onDataUpdate,
}: PropertySubmissionsDataViewProps) {
  const getRows = usePropertySubmissions();
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to trigger refresh
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Handle data updates and pass to parent component
  const handleDataUpdate = (data: any[], filters: Record<string, any>) => {
    console.log("DataView received update:", data.length, "rows"); // Debug log
    if (onDataUpdate) {
      onDataUpdate(data, filters);
    }
  };

  return (
    <DataView<propertySubmissionRow>
      key={refreshKey}
      columns={propertySubmissionColumns}
      filters={propertySubmissionFilters}
      sortConfig={propertySubmissionSortConfig}
      showSearch={false}
      showSort
      getRows={getRows}
      showActions
      actionsMenuItems={(row, onClose) =>
        getPropertySubmissionActionsMenu(row, onClose, handleRefresh)
      }
      onDataUpdate={handleDataUpdate}
    />
  );
}

function getPropertySubmissionActionsMenu(
  row: propertySubmissionRow,
  onClose?: () => void,
  onStatusChange?: () => void
): MenuActionItem[] {
  return [
    {
      label: "عرض التفاصيل",
      icon: <FaEye />,
      link: `/dashboard/admin/property-submissions/${row.id}`,
    },
    {
      label: "تعديل الطلب",
      icon: <FaEdit />,
      link: `/dashboard/admin/property-submissions/edit/${row.id}`,
    },
    {
      label: "تغيير الحالة",
      type: "primary" as ActionType,
      icon: <FaExchangeAlt />,
      child: (
        <PropertySubmissionStatusToggle
          requestId={row.id}
          currentStatus={row.status}
          onConfirm={() => {
            onClose?.();
            onStatusChange?.();
          }}
          onCancel={onClose}
          onStatusChange={onStatusChange}
        />
      ),
    },
  ];
}

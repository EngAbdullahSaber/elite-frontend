"use client";
import { useState } from "react";
import DataView from "@/components/shared/DateViewTable/DataView";
import { FaCheck, FaEdit, FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import useClients from "@/hooks/dashboard/admin/client/useClients";
import {
  columns,
  filters,
  sortConfig,
} from "@/constants/dashboard/admin/client/contants";
import { ClientRow } from "@/types/dashboard/client";
import ClientStatusToggle from "./ClientStatusToggle";
import {
  ActionType,
  MenuActionItem,
} from "@/components/shared/Header/MenuActionList";
interface ClientsDataViewProps {
  onDataUpdate?: (data: any[], filters: Record<string, any>) => void;
}

export default function ClientsDataView({
  onDataUpdate,
}: ClientsDataViewProps) {
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh state

  const getRows = useClients();
  // Function to refresh the data
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };
  const handleDataUpdate = (data: any[], filters: Record<string, any>) => {
    console.log("DataView received update:", data.length, "rows"); // Debug log
    if (onDataUpdate) {
      onDataUpdate(data, filters);
    }
  };
  return (
    <DataView<ClientRow>
      key={refreshKey} // Add key to force re-render
      columns={columns}
      filters={filters}
      sortConfig={sortConfig}
      showSearch
      showSort
      getRows={getRows}
      showActions
      actionsMenuItems={(row, onClose) =>
        getClientActionsMenu(row, onClose, handleRefresh)
      }
      onDataUpdate={handleDataUpdate}
    />
  );
}

export function getClientActionsMenu(
  row: ClientRow,
  onClose?: () => void,
  onStatusChange?: () => void // Add refresh callback
): MenuActionItem[] {
  const isSuspended = row.status !== "active";

  return [
    {
      label: "عرض التفاصيل",
      icon: <FaPencilAlt />,
      link: `/dashboard/admin/clients/${row.id}`,
    },
    {
      label: "تعديل العميل",
      icon: <FaEdit />,
      link: `/dashboard/admin/clients/edit/${row.id}`,
    },
    {
      label: isSuspended ? "تفعيل الحساب" : "تعليق الحساب",
      type: (isSuspended ? "primary" : "delete") as ActionType,
      icon: isSuspended ? <FaCheck /> : <FaRegTrashAlt />,
      child: (
        <ClientStatusToggle
          client={row}
          currentStatus={row.status}
          onConfirm={onClose}
          onStatusChange={onStatusChange} // Pass refresh callback
        />
      ),
    },
  ];
}

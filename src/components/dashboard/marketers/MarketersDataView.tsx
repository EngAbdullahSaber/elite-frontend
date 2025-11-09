// components/dashboard/admin/marketers/MarketersDataView.tsx

"use client";

import DataView from "@/components/shared/DateViewTable/DataView";
import { MenuActionItem } from "@/components/shared/Header/MenuActionList";
import {
  marketerColumns,
  marketerFilters,
  marketerSortConfig,
} from "@/constants/dashboard/admin/marketers/contants";
import { MarketerRow } from "@/types/dashboard/marketer";
import { FaCheck, FaEdit, FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import MarketerStatusToggle from "./MarketerStatusToggle";
import usePartner from "@/hooks/dashboard/admin/partner/usePartner";

export default function MarketersDataView() {
  const getRows = usePartner();

  return (
    <DataView<MarketerRow>
      columns={marketerColumns}
      filters={marketerFilters}
      sortConfig={marketerSortConfig}
      showSearch
      showSort
      getRows={getRows}
      showActions
      actionsMenuItems={getMarketerActionsMenu}
    />
  );
}

function getMarketerActionsMenu(
  row: MarketerRow,
  onClose?: () => void
): MenuActionItem[] {
  const { status } = row;
  const isActive = status === "active";
  const baseActions: MenuActionItem[] = [
    {
      label: "عرض التفاصيل",
      icon: <FaPencilAlt />,
      link: `/dashboard/admin/marketers/${row.id}`,
    },
  ];

  return baseActions;
}

"use client";
import DataView from "@/components/shared/DateViewTable/DataView";
import { MenuActionItem } from "@/components/shared/Header/MenuActionList";

import {
  influencerColumns,
  influencerFilters,
  influencerSortConfig,
} from "@/constants/dashboard/admin/Influencer/Influencer";
import useInfluencer from "@/hooks/dashboard/admin/Influencer/useInfluencer";
import { InfluencerRow } from "@/types/dashboard/Influencer";
import {
  FaCheck,
  FaEdit,
  FaPencilAlt,
  FaRegTrashAlt,
  FaUndo,
} from "react-icons/fa";

export default function InfluencerDataView() {
  const { getRows } = useInfluencer();
  return (
    <DataView<InfluencerRow>
      columns={influencerColumns}
      filters={influencerFilters}
      sortConfig={influencerSortConfig}
      showSearch
      showSort
      getRows={getRows}
      showActions
      actionsMenuItems={getInfluencerActionsMenu}
    />
  );
}

function getInfluencerActionsMenu(
  row: InfluencerRow,
  onClose?: () => void
): MenuActionItem[] {
  const { status } = row;

  const baseActions: MenuActionItem[] = [
    {
      label: "عرض التفاصيل",
      icon: <FaPencilAlt />,
      link: `/dashboard/admin/influncer/${row.id}`,
    },
    {
      label: "تعديل المروج",
      icon: <FaEdit />,
      link: `/dashboard/admin/influncer/edit/${row.id}`,
    },
  ];

  return [...baseActions];
}

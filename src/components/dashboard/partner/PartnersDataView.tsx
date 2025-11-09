// components/dashboard/admin/partners/PartnersDataView.tsx

"use client";

import DataView from "@/components/shared/DateViewTable/DataView";
import { MenuActionItem } from "@/components/shared/Header/MenuActionList";

import { FaPencilAlt } from "react-icons/fa";
import usePartner from "@/hooks/dashboard/admin/partner/usePartner";
import { PartnerRow } from "@/types/dashboard/partner";
import {
  partnerColumns,
  partnerFilters,
  partnerSortConfig,
} from "@/constants/dashboard/admin/partner/partner";

export default function PartnersDataView() {
  const { getRows } = usePartner();

  return (
    <DataView<PartnerRow>
      columns={partnerColumns}
      filters={partnerFilters}
      sortConfig={partnerSortConfig}
      showSearch
      showSort
      getRows={getRows}
      showActions
      actionsMenuItems={getPartnerActionsMenu}
    />
  );
}

function getPartnerActionsMenu(
  row: PartnerRow,
  onClose?: () => void
): MenuActionItem[] {
  const baseActions: MenuActionItem[] = [
    {
      label: "عرض التفاصيل",
      icon: <FaPencilAlt />,
      link: `/dashboard/admin/marketers/${row.id}`,
    },
  ];

  return baseActions;
}

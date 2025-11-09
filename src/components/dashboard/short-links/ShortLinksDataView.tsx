"use client";
import DataView from "@/components/shared/DateViewTable/DataView";
import { MenuActionItem } from "@/components/shared/Header/MenuActionList";
import {
  shortLinkColumns,
  shortLinkFilters,
  shortLinkSortConfig,
} from "@/constants/dashboard/admin/shortLink/shortLink";

import useShortLinks from "@/hooks/dashboard/admin/shortLinks/useShortLinks";
import { ShortLinkRow } from "@/types/dashboard/shortLink";
import {
  FaCheck,
  FaEdit,
  FaPencilAlt,
  FaRegTrashAlt,
  FaUndo,
} from "react-icons/fa";

export default function ShortLinksDataViewDataView() {
  const { getRows } = useShortLinks();

  console.log(getRows);
  return (
    <DataView<ShortLinkRow>
      columns={shortLinkColumns}
      filters={shortLinkFilters}
      sortConfig={shortLinkSortConfig}
      showSearch
      showSort
      getRows={getRows}
      showActions
      actionsMenuItems={getShortLinksDataViewActionsMenu}
    />
  );
}

function getShortLinksDataViewActionsMenu(
  row: ShortLinkRow,
  onClose?: () => void
): MenuActionItem[] {
  const { status } = row;

  const baseActions: MenuActionItem[] = [
    {
      label: "عرض التفاصيل",
      icon: <FaPencilAlt />,
      link: `/dashboard/admin/short-links/${row.slug}`,
    },
    {
      label: "تعديل الرابط المختصر",
      icon: <FaEdit />,
      link: `/dashboard/admin/short-links/edit/${row.slug}`,
    },
  ];

  return [...baseActions];
}

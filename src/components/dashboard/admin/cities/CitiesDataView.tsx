"use client";

import DataView from "@/components/shared/DateViewTable/DataView";
import { MenuActionItem } from "@/components/shared/Header/MenuActionList";
import {
  cityColumns,
  citySortConfig,
} from "@/constants/dashboard/admin/city/contants";
import { useCities } from "@/hooks/dashboard/admin/cities/useCities";
import { CityRow } from "@/types/dashboard/city";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import DeleteCityConfirm from "./DeleteCityConfirm";

export default function CitiesDataView() {
  const getRows = useCities(); // custom hook to fetch cities

  return (
    <DataView<CityRow>
      columns={cityColumns}
      getRows={getRows}
      showActions={false}
      sortConfig={citySortConfig}
      showSort={true}
      showSearch={false}
      actionsMenuItems={getCityActionsMenu}
    />
  );
}

export function getCityActionsMenu(
  row: CityRow,
  onClose?: () => void
): MenuActionItem[] {
  return [
    {
      label: "حذف المدينة",
      type: "delete",
      icon: <FaRegTrashAlt />,
      child: (
        <DeleteCityConfirm
          cityId={row.id}
          cityName={row.name}
          onConfirm={() => {
            console.log("Deleted city", row.id);
            onClose?.();
          }}
          onCancel={() => onClose?.()}
        />
      ),
    },
  ];
}

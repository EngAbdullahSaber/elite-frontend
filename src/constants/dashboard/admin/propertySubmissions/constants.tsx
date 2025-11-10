// constants/dashboard/property-submissions/constants.ts
import InfoCell from "@/components/shared/InfoCell";
import {
  FilterConfig,
  SortConfig,
  TableColumn,
} from "@/types/components/Table";
import { propertySubmissionRow } from "@/types/dashboard/property-submissions";
import { getDefaultProjectpath } from "@/utils/appointment";
import { projectTypeColors } from "../property.tsx/constants";
import {
  MiniProject,
  PropertyType,
  propertyTypeLabels,
} from "@/types/property";

export const propertySubmissionStatusMap: Record<
  propertySubmissionRow["status"],
  string
> = {
  pending: "قيد الانتظار",
  inspected: "قيد المراجعة",
  rejected: "مرفوض",
  published: "منشور",
};

export const propertySubmissionStatusStyle: Record<
  propertySubmissionRow["status"],
  string
> = {
  pending: "bg-[#FFF8E1] text-[#9C6B00]",
  inspected: "bg-[#E6F4FF] text-[#0369A1]",
  rejected: "bg-[#FFF0F0] text-[#BE6464]",
  published: "bg-[#EBFBF2] text-[var(--secondary-500)]",
};

export const propertySubmissionFilters: FilterConfig[] = [
  {
    type: "select",
    key: "status",
    label: "الحالة",
    options: [
      { label: "الكل", value: "all" },
      { label: "قيد الانتظار", value: "pending" },
      { label: "قيد المراجعة", value: "inspected" },
      { label: "مرفوض", value: "rejected" },
      { label: "منشور", value: "published" },
    ],
    default: "all",
  },
];

export const propertySubmissionSortConfig: SortConfig = {
  sortFields: [],
  defaultSort: "createdAt",
};

export const propertySubmissionColumns: TableColumn<propertySubmissionRow>[] = [
  {
    key: "requesterName",
    label: "اسم مقدم الطلب",
  },
  {
    key: "relationshipType",
    label: "نوع العلاقة",
  },
  {
    key: "propertyType",
    label: "نوع العقار",
    cell: (val: string) => <span>{val}</span>,
  },
  {
    key: "askingPrice", // Use askingPrice instead of price
    label: "سعر البيع",
    cell: (val: string) => (
      <span>{parseFloat(val || "0").toLocaleString()} ريال</span>
    ),
  },
  {
    key: "location",
    label: "الموقع",
    cell: (val: string) => <span>{val || "—"}</span>,
  },
  {
    key: "bedrooms",
    label: "عدد الغرف",
    cell: (val: number) => <span>{val || 0}</span>,
  },
  {
    key: "publishedProperty",
    label: "العقار المنشور",
    cell: (val: MiniProject | undefined, row?: propertySubmissionRow) => {
      if (row?.status !== "published" || !val) {
        return <span className="text-xs text-gray-400">—</span>;
      }

      return (
        <InfoCell
          image={val.image}
          title={val.title}
          defaultImage={getDefaultProjectpath(val.type)}
          href={`/projects/${val.id}`}
          subtitle={propertyTypeLabels[val.type]}
          imageRounded="lg"
          subtitleClass={projectTypeColors[val.type]}
        />
      );
    },
  },
  {
    key: "status",
    label: "الحالة",
    cell: (val: propertySubmissionRow["status"]) => {
      const style = propertySubmissionStatusStyle[val];
      const label = propertySubmissionStatusMap[val];
      return (
        <span className={`px-3 py-1 rounded-full text-sm ${style}`}>
          {label}
        </span>
      );
    },
  },
  {
    key: "createdAt",
    label: "تاريخ ووقت الإنشاء",
    cell: (val: string) => {
      const d = new Date(val);
      return (
        <div className="flex flex-col">
          <span className="font-medium">{d.toLocaleDateString("ar-EG")}</span>
          <span className="text-xs text-gray-500">
            {d.toLocaleTimeString("ar-EG")}
          </span>
        </div>
      );
    },
  },
];

import FallbackImage from "@/components/shared/FallbackImage";
import {
  FilterConfig,
  SortConfig,
  TableColumn,
} from "@/types/components/Table";
import {
  MarketerRow,
  MarketerStatus,
  marketerStatusMap,
} from "@/types/dashboard/marketer";
import { formatDate } from "@/utils/date";

export const marketerStatusClassMap: Record<MarketerStatus, string> = {
  active: "bg-green-600 hover:bg-green-700",
  suspended: "bg-red-600 hover:bg-red-700",
};

export const marketerSortConfig: SortConfig = {
  sortFields: [
    { label: "الاسم", value: "name" },
    { label: "الحالة", value: "status" },
    { label: "تاريخ الانضمام", value: "joinedAt" },
  ],
  defaultSort: "name",
};

export const marketerFilters: FilterConfig[] = [
  {
    type: "select",
    label: "الحالة",
    key: "status",
    options: [
      { label: "الكل", value: "all" },
      { label: "نشط", value: "active" },
      { label: "موقوف", value: "suspended" },
    ],
    default: "all",
  },
  {
    type: "dateRange",
    label: "تاريخ الانضمام",
    key: "joinedAt",
  },
];

export const marketerColumns: TableColumn<MarketerRow>[] = [
  {
    key: "image",
    label: "الصورة",
    cell: (val) => {
      return <FallbackImage src={val} alt="Marketer" />;
    },
  },
  { key: "name", label: "الاسم" },
  { key: "email", label: "البريد الإلكتروني" },
  {
    key: "phone",
    label: "رقم الهاتف",
    cell: (val) => (
      <span dir="ltr" className="block">
        {val}
      </span>
    ),
  },
  {
    key: "joinedAt",
    label: "تاريخ الانضمام",
    cell: (val) => <span>{formatDate(val)}</span>,
  },
  {
    key: "status",
    label: "الحالة",
    cell: (val) => {
      const statusStyles: Record<MarketerStatus, string> = {
        active: "bg-[#EBFBF2] text-[var(--secondary-500)]",
        suspended: "bg-[#FFF0F0] text-[#BE6464]",
      };
      const style = statusStyles[val as MarketerStatus] || "";

      return (
        <span className={`${style} px-3 py-1 rounded-full text-sm`}>
          {marketerStatusMap[val as MarketerStatus]}
        </span>
      );
    },
  },
];

export const mockedMarketers: MarketerRow[] = [
  {
    id: 1,
    image: "/users/user-31.jpg",
    name: "محمد الغامدي",
    email: "mohammed.g@marketinghub.com",
    phone: "+966 555 111 222",
    joinedAt: "2024-03-15",
    status: "active",
  },
  {
    id: 2,
    image: "/users/user-32.jpg",
    name: "سارة العبدالله",
    email: "sara.abdullah@example.com",
    phone: "+966 511 222 333",
    joinedAt: "2023-11-02",
    status: "suspended",
  },
  {
    id: 3,
    image: "/users/user-33.jpg",
    name: "خالد الحربي",
    email: "khaled.harbi@adsagency.com",
    phone: "+966 533 444 555",
    joinedAt: "2022-07-19",
    status: "suspended",
  },
  {
    id: 4,
    image: "/users/user-34.jpg",
    name: "ليلى الزهراني",
    email: "layla.zahrani@marketingpro.com",
    phone: "+966 544 666 777",
    joinedAt: "2021-05-10",
    status: "active",
  },
];

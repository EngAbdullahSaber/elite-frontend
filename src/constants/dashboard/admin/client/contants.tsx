import { ClientRow, ClientStatus } from "@/types/dashboard/client";
import {
  FilterConfig,
  SortConfig,
  TableColumn,
  TableRow,
} from "@/types/components/Table";
import { formatDate } from "@/utils/date";
import FallbackImage from "@/components/shared/FallbackImage";

export const filters: FilterConfig[] = [
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

export const sortConfig: SortConfig = {
  sortFields: [
    { label: "الاسم", value: "name" },
    { label: "الحالة", value: "status" },
    { label: "تاريخ الانضمام", value: "joinedAt" },
  ],
  defaultSort: "name",
};

export const columns: TableColumn<ClientRow>[] = [
  {
    key: "profilePhoto",
    label: "الصورة",
    cell: (val, row) => {
      return <FallbackImage src={val} alt="Client" />;
    },
  },
  { key: "name", label: "الاسم" },
  { key: "email", label: "البريد الإلكتروني" },
  {
    key: "phone",
    label: "رقم الهاتف",
    cell: (val) => {
      return (
        <span className="" dir="ltr">
          {val}
        </span>
      );
    },
  },
  {
    key: "joinedAt",
    label: "تاريخ الانضمام",
    cell: (val) => {
      return <span className="">{formatDate(val)}</span>;
    },
  },
  {
    key: "status",
    label: "الحالة",
    cell: (val) => {
      const statusStyles: Record<ClientStatus, string> = {
        active: "bg-[#EBFBF2] text-[var(--secondary-500)]",
        suspended: "bg-[#FFF0F0] text-[#BE6464]",
      };
      const style = val ? statusStyles[val as ClientStatus] : "";

      return (
        <span className={`${style} px-3 py-1 rounded-full text-sm`}>
          {val === "active" ? "نشط" : "موقوف"}
        </span>
      );
    },
  },
];

export const rows: TableRow<ClientRow>[] = [
  {
    id: 1,
    image: "/users/user-1.jpg",
    name: "احمد العتيبي",
    email: "khaled@example.com",
    phone: "+966 500 123 456",
    joinedAt: "2023-01-15",
    status: "active",
  },
  {
    id: 2,
    image: "/users/user-2.webp",
    name: "عبدالله الشهري",
    email: "abdullah@example.com",
    phone: "+966 511 987 654",
    joinedAt: "2022-09-03",
    status: "active",
  },
  {
    id: 3,
    name: "سامي القحطاني",
    email: "sami.qahtani@realestatepro.com",
    phone: "+966 533 222 111",
    joinedAt: "2021-06-27",
    status: "suspended",
  },
  {
    id: 4,
    name: "راكان الزهراني",
    email: "rakan.zahrani@agency.com",
    phone: "+966 544 888 777",
    joinedAt: "2024-02-10",
    status: "active",
  },
  {
    id: 5,
    name: "نورة السبيعي",
    email: "noura.s@example.com",
    phone: "+966 512 345 678",
    joinedAt: "2023-07-21",
    status: "active",
  },
  {
    id: 6,
    name: "فهد المطيري",
    email: "fahad.mutairi@consultinghub.com",
    phone: "+966 533 876 543",
    joinedAt: "2022-11-30",
    status: "suspended",
  },
  {
    id: 7,
    name: "هند القحطاني",
    email: "hind.qahtani@agency.com",
    phone: "+966 544 321 987",
    joinedAt: "2021-04-18",
    status: "suspended",
  },
  {
    id: 8,
    name: "ماجد الحربي",
    email: "majid.harbi@realestatepro.com",
    phone: "+966 500 654 321",
    joinedAt: "2023-12-05",
    status: "active",
  },
  {
    id: 9,
    name: "سارة الزامل",
    email: "sara.zamel@example.com",
    phone: "+966 511 789 456",
    joinedAt: "2022-05-14",
    status: "suspended",
  },
  {
    id: 10,
    name: "ليلى العتيبي",
    email: "layla@example.com",
    phone: "+966 500 111 222",
    joinedAt: "2023-03-12",
    status: "active",
  },
  {
    id: 11,
    name: "خالد السالم",
    email: "khaled.salem@example.com",
    phone: "+966 511 333 444",
    joinedAt: "2022-08-19",
    status: "suspended",
  },
  {
    id: 12,
    name: "ليلى العتيبي",
    email: "layla.otaibi@example.com",
    phone: "+966 500 111 222",
    joinedAt: "2023-03-12",
    status: "active",
  },
  {
    id: 13,
    name: "خالد السالم",
    email: "khaled.salem@example.com",
    phone: "+966 511 333 444",
    joinedAt: "2022-08-19",
    status: "active",
  },
  {
    id: 14,
    name: "مشاعل القحطاني",
    email: "mashael.qahtani@agency.com",
    phone: "+966 533 444 555",
    joinedAt: "2021-12-01",
    status: "suspended",
  },
  {
    id: 15,
    name: "تركي العبدالله",
    email: "turki.abdullah@realestatepro.com",
    phone: "+966 544 666 777",
    joinedAt: "2023-06-15",
    status: "active",
  },
  {
    id: 16,
    name: "ريم السبيعي",
    email: "reem.s@example.com",
    phone: "+966 512 999 888",
    joinedAt: "2022-03-27",
    status: "active",
  },
  {
    id: 17,
    name: "سعود الزهراني",
    email: "saud.zahrani@consultinghub.com",
    phone: "+966 533 777 666",
    joinedAt: "2021-09-10",
    status: "suspended",
  },
  {
    id: 18,
    name: "جواهر المطيري",
    email: "jawaher.mutairi@agency.com",
    phone: "+966 544 123 456",
    joinedAt: "2023-11-05",
    status: "active",
  },
  {
    id: 19,
    name: "بدر الحربي",
    email: "bader.harbi@realestatepro.com",
    phone: "+966 500 654 987",
    joinedAt: "2022-07-22",
    status: "active",
  },
];

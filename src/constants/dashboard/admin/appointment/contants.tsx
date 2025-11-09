import AgentFilterPopup from "@/components/dashboard/AgentFilterPopup";
import InfoCell from "@/components/shared/InfoCell";
import {
  FilterConfig,
  SortConfig,
  TableColumn,
} from "@/types/components/Table";
import { AppointmentRow, MiniUser } from "@/types/dashboard/appointment";
import { BookingStatus } from "@/types/global";
import { getDefaultProjectpath } from "@/utils/appointment";
import { formatDate, formatTime } from "@/utils/date";
import { FaStar } from "react-icons/fa";
import { projectTypeColors } from "../property.tsx/constants";
import { MiniProject, propertyTypeLabels } from "@/types/property";
import { useRoleFromPath } from "@/hooks/dashboard/admin/useRoleFromPath";
import { useMemo } from "react";

export const bookingStatusMap: Record<BookingStatus, string> = {
  pending: "قيد الانتظار",
  assigned: "تم التعيين",
  confirmed: "مؤكد",
  in_progress: "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
  no_show: "لم يحضر",
};

export const bookingStatusStyle: Record<BookingStatus, string> = {
  pending: "bg-[#FFF8E1] text-[#9C6B00]",
  assigned: "bg-[#E6F4FF] text-[#0369A1]",
  confirmed: "bg-[#E9FBEA] text-[#1B7B3A]",
  in_progress: "bg-[#EEF2FF] text-[#3730A3]",
  completed: "bg-[#EBFBF2] text-[var(--secondary-500)]",
  cancelled: "bg-[#FFF0F0] text-[#BE6464]",
  no_show: "bg-[#F3F4F6] text-[#4B5563]",
};

export const appointmentFilters: FilterConfig[] = [
  {
    type: "select",
    label: "الحالة",
    key: "status",
    options: [
      { label: "الكل", value: "all" },
      { label: "قيد الانتظار", value: "pending" },
      { label: "تم التعيين", value: "assigned" },
      { label: "مؤكد", value: "confirmed" },
      { label: "قيد التنفيذ", value: "in_progress" },
      { label: "مكتمل", value: "completed" },
      { label: "ملغي", value: "cancelled" },
      { label: "لم يحضر", value: "no_show" },
    ],
    default: "all",
  },
  {
    type: "dateRange",
    label: "تاريخ الموعد",
    key: "appointmentAt",
  },
  // Remove isPaid filter since it's not in API
  // {
  //     key: 'isPaid',
  //     label: 'الدفع',
  //     type: 'select',
  //     options: [
  //         { label: 'الكل', value: 'all' },
  //         { label: 'مدفوعة', value: 'paid' },
  //         { label: 'غير مدفوعة', value: 'unpaid' },
  //     ],
  //     default: 'all',
  // },
  {
    key: "agentId",
    label: "الوسيط",
    type: "custom",
    component: ({ value, onChange }) => {
      // Use the agents array directly instead of mockAppointments
      const selectedAgent = agents.find(
        (agent) => agent.id.toString() === value
      );
      return (
        <AgentFilterPopup
          selectedAgent={selectedAgent}
          onSelect={(agent) => onChange(agent.id.toString())}
          onClear={() => onChange(undefined)}
        />
      );
    },
  },
];

export const appointmentSortConfig: SortConfig = {
  sortFields: [
    { label: "الحالة", value: "status" },
    { label: "اسم الوسيط", value: "agentName" },
    { label: "اسم العميل", value: "clientName" },
    { label: "اسم المشروع", value: "projectTitle" },
    { label: "موعد الزيارة", value: "appointmentAt" },
  ],
  defaultSort: "appointmentAt",
};

export function useAppointmentColumns(): TableColumn<AppointmentRow>[] {
  const role = useRoleFromPath();
  const isAdmin = role === "admin";

  return useMemo(
    () => [
      {
        key: "project",
        label: "المشروع",
        cell: (val: MiniProject, row?: AppointmentRow) => {
          // Handle missing image safely
          const projectImage = val?.image || "";

          return (
            <InfoCell
              image={projectImage}
              title={val?.title || "لا يوجد عنوان"}
              defaultImage={getDefaultProjectpath(val?.type)}
              href={`/projects/${val?.id}`}
              subtitle={val?.type ? propertyTypeLabels[val.type] : "غير محدد"}
              imageRounded="lg"
              subtitleClass={val?.type ? projectTypeColors[val.type] : ""}
            />
          );
        },
      },
      {
        key: "appointmentAt",
        label: "موعد الزيارة",
        cell: (val: string) => {
          if (!val) return <span className="text-gray-400">—</span>;

          try {
            const d = new Date(val);
            const date = formatDate(d);
            const time = formatTime(d);
            return (
              <div className="flex flex-col">
                <span className="font-medium">{date}</span>
                <span className="text-xs text-gray-500">{time}</span>
              </div>
            );
          } catch (error) {
            return <span className="text-gray-400">تاريخ غير صالح</span>;
          }
        },
      },
      {
        key: "createdAt",
        label: "تاريخ الإنشاء",
        cell: (val: string) => {
          if (!val) return <span className="text-gray-400">—</span>;

          try {
            const d = new Date(val);
            const date = formatDate(d);
            return (
              <div className="">
                <span className="font-medium">{date}</span>
              </div>
            );
          } catch (error) {
            return <span className="text-gray-400">تاريخ غير صالح</span>;
          }
        },
      },
      {
        key: "agent",
        label: "الوسيط",
        cell: (user: MiniUser | undefined) => {
          if (!user) return <span className="text-gray-400">غير معين</span>;

          return (
            <InfoCell
              image={user.image || ""}
              subtitle={user.email}
              title={user.name}
              href={isAdmin ? `/dashboard/admin/agents/${user.id}` : undefined}
            />
          );
        },
      },
      {
        key: "client",
        label: "العميل",
        cell: (user: MiniUser) => {
          if (!user) return <span className="text-gray-400">—</span>;

          return (
            <InfoCell
              image={user.image || ""}
              subtitle={user.email}
              title={user.name}
              href={isAdmin ? `/dashboard/admin/clients/${user.id}` : undefined}
            />
          );
        },
      },
      {
        key: "reviewStars",
        label: "تقييم العميل",
        cell: (val: number | undefined, row?: AppointmentRow) => {
          // Hide this column for now since it's not in API
          return <span className="text-xs text-gray-400">—</span>;

          // Original code (commented out since data not available in API)
          // if (row?.status !== 'completed' || !val) return <span className="text-xs text-gray-400">—</span>;
          // return (
          //     <div className="flex items-center gap-0.5 text-amber-500">
          //         {Array.from({ length: 5 }).map((_, i) => (
          //             <FaStar key={i} className={i < val ? 'fill-amber-500' : 'fill-gray-300'} />
          //         ))}
          //     </div>
          // );
        },
      },
      {
        key: "status",
        label: "الحالة",
        cell: (val: BookingStatus | undefined) => {
          const style = val
            ? bookingStatusStyle[val]
            : "bg-gray-100 text-gray-500";
          const label = val ? bookingStatusMap[val] : "غير محدد";

          return (
            <span className={`px-3 py-1 rounded-full text-sm ${style}`}>
              {label}
            </span>
          );
        },
      },
      {
        key: "isPaid",
        label: "الدفع",
        cell: (val: boolean | undefined, row?: AppointmentRow) => {
          // Hide this column for now since it's not in API
          return <span className="text-xs text-gray-400">—</span>;

          // Original code (commented out since data not available in API)
          // if (row?.status !== 'completed') return <span className="text-xs text-gray-400">—</span>;
          // return val ? (
          //     <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">مدفوع</span>
          // ) : (
          //     <span className="px-2 py-0.5 rounded-full text-xs bg-rose-100 text-rose-700">غير مدفوع</span>
          // );
        },
      },
    ],
    [isAdmin]
  );
}

// Alternative: Create a filtered columns function that removes unavailable columns
export function useFilteredAppointmentColumns(): TableColumn<AppointmentRow>[] {
  const role = useRoleFromPath();
  const isAdmin = role === "admin";

  const allColumns = useAppointmentColumns();

  return useMemo(() => {
    // Remove columns that rely on data not available in API
    return allColumns.filter(
      (column) => column.key !== "reviewStars" && column.key !== "isPaid"
    );
  }, [allColumns]);
}

export const mockAppointments: AppointmentRow[] = [
  // ... your existing mock data
];

export const agents: MiniUser[] = [
  {
    id: 21,
    name: "يوسف أحمد",
    email: "youssef@agency.com",
    image: "/users/user-2.webp",
  },
  {
    id: 22,
    name: "سارة العتيبي",
    email: "sara@agency.com",
    image: "/users/user-3.jpg",
  },
  { id: 23, name: "نواف المطيري", email: "nawaf@agency.com", image: "" },
  { id: 24, name: "ليان الغامدي", email: "layan@agency.com" },
  {
    id: 25,
    name: "فهد الزهراني",
    email: "fahad@agency.com",
    image: "/users/user-4.jpg",
  },
  {
    id: 26,
    name: "نورة السبيعي",
    email: "noura@agency.com",
    image: "/users/user-5.jpg",
  },
  {
    id: 27,
    name: "خالد الزامل",
    email: "khalid@agency.com",
    image: "/users/user-7.jpg",
  },
  { id: 28, name: "هند القحطاني", email: "hind@agency.com", image: "" },
  {
    id: 29,
    name: "سعد المطيري",
    email: "saad@agency.com",
    image: "/users/user-10.jpg",
  },
  {
    id: 30,
    name: "راكان العتيبي",
    email: "rakan@agency.com",
    image: "/users/user-11.jpg",
  },
];

export const clients: MiniUser[] = [
  {
    id: 1,
    name: "خالد الشمري",
    email: "khaled@example.com",
    image: "/users/user-1.jpg",
  },
  {
    id: 2,
    name: "عبدالله الشهري",
    email: "abdullah@example.com",
    image: "/users/user-2.webp",
  },
  { id: 3, name: "أحمد العتيبي", email: "ahmad@example.com", image: "" },
  { id: 4, name: "هناء العبدالله", email: "hannah@example.com" },
  { id: 5, name: "ريم الحربي", email: "reem@example.com", image: "" },
  {
    id: 6,
    name: "عبدالرحمن القحطاني",
    email: "abdulrahman@example.com",
    image: "/users/user-6.jpg",
  },
  {
    id: 7,
    name: "سلمان العتيبي",
    email: "salman@example.com",
    image: "/users/user-8.jpg",
  },
  {
    id: 8,
    name: "ماجد السالم",
    email: "majed@example.com",
    image: "/users/user-9.jpg",
  },
  { id: 9, name: "نجلاء العنزي", email: "najla@example.com", image: "" },
  {
    id: 10,
    name: "أماني الزهراني",
    email: "amani@example.com",
    image: "/users/user-12.jpg",
  },
];

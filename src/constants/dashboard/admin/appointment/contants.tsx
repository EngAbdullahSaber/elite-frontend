import AgentFilterPopup from "@/components/dashboard/AgentFilterPopup";
import InfoCell from "@/components/shared/InfoCell";
import {
  FilterConfig,
  SortConfig,
  TableColumn,
} from "@/types/components/Table";
import { AppointmentRow, MiniUser } from "@/types/dashboard/appointment";
import {
  BookingStatus,
  BookingStatusConfirme,
  BookingStatusRequest,
} from "@/types/global";
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
export const bookingStatusMapReques: Record<BookingStatusRequest, string> = {
  pending: "قيد الانتظار",
  accepted: "موافقة",
  rejected: "ملغي",
};

export const agentBookingStatusMap: Record<BookingStatusConfirme, string> = {
  completed: "مكتمل",
  expired: "لم يحضر",
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
];

export const appointmentSortConfig: SortConfig = {
  sortFields: [],
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
    ],
    [isAdmin]
  );
}
export function useCustomerAppointmentColumns(): TableColumn<AppointmentRow>[] {
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
    ],
    [isAdmin]
  );
}
// Create this in your constants file or add to existing one
export function useAppointmentRequestColumns(): TableColumn<AppointmentRow>[] {
  const role = useRoleFromPath();
  const isAdmin = role === "admin";

  return useMemo(
    () => [
      {
        key: "project",
        label: "العقار",
        cell: (val: any, row?: AppointmentRow) => {
          // Handle missing image safely
          const projectImage = val?.image || "";

          return (
            <InfoCell
              image={projectImage}
              title={val?.title || "لا يوجد عنوان"}
              defaultImage={getDefaultProjectpath(val?.type)}
              href={`/properties/${val?.id}`}
              subtitle={val?.type || "غير محدد"}
              imageRounded="lg"
              subtitleClass={val?.type ? "text-gray-600" : ""}
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
            // Parse the combined date-time string
            const [datePart, timePart] = val.split("T");
            const date = formatDate(new Date(datePart));
            const time = timePart
              ? formatTime(new Date(`2000-01-01T${timePart}`))
              : "";

            return (
              <div className="flex flex-col">
                <span className="font-medium">{date}</span>
                {time && <span className="text-xs text-gray-500">{time}</span>}
              </div>
            );
          } catch (error) {
            return <span className="text-gray-400">تاريخ غير صالح</span>;
          }
        },
      },
      {
        key: "createdAt",
        label: "تاريخ الطلب",
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
        key: "client",
        label: "العميل",
        cell: (user: any) => {
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
        key: "status",
        label: "حالة الطلب",
        cell: (val: string | undefined) => {
          const style =
            val === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : val === "confirmed" || val === "completed"
              ? "bg-green-100 text-green-800"
              : val === "rejected"
              ? "bg-red-100 text-red-800"
              : val === "expired"
              ? "bg-orange-100 text-orange-800"
              : val === "accepted"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-500";

          const label =
            val === "pending"
              ? "قيد الانتظار"
              : val === "confirmed"
              ? "مكتمل"
              : val === "completed"
              ? "مكتمل"
              : val === "rejected"
              ? "مرفوض"
              : val === "expired"
              ? "لم يحضر"
              : val === "accepted"
              ? "مقبول"
              : "غير محدد";

          return (
            <span className={`px-3 py-1 rounded-full text-sm ${style}`}>
              {label}
            </span>
          );
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

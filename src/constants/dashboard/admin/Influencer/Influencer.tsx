import FallbackImage from "@/components/shared/FallbackImage";
import {
  FilterConfig,
  SortConfig,
  TableColumn,
} from "@/types/components/Table";
import {
  InfluencerRow,
  InfluencerStatus,
  InfluencerPlatform,
} from "@/hooks/dashboard/admin/Influencer/useInfluencer";
import { formatDate } from "@/utils/date";

export const influencerStatusClassMap: Record<InfluencerStatus, string> = {
  active: "bg-green-600 hover:bg-green-700",
  inactive: "bg-gray-500 hover:bg-gray-600",
};

export const influencerPlatformMap: Record<InfluencerPlatform, string> = {
  instagram: "إنستغرام",
  snapchat: "سناب شات",
  tiktok: "تيك توك",
  youtube: "يوتيوب",
  x: "تويتر (X)",
  other: "أخرى",
};

export const influencerStatusMap: Record<InfluencerStatus, string> = {
  active: "نشط",
  inactive: "غير نشط",
};

export const influencerSortConfig: SortConfig = {
  sortFields: [
    { label: "الاسم", value: "name" },
    { label: "الحالة", value: "status" },
    { label: "المنصة", value: "platform" },
    { label: "تاريخ الانضمام", value: "joinedAt" },
  ],
  defaultSort: "name",
};

export const influencerFilters: FilterConfig[] = [
  {
    type: "select",
    label: "الحالة",
    key: "status",
    options: [
      { label: "الكل", value: "all" },
      { label: "نشط", value: "active" },
      { label: "غير نشط", value: "inactive" },
    ],
    default: "all",
  },
  {
    type: "select",
    label: "المنصة",
    key: "platform",
    options: [
      { label: "الكل", value: "all" },
      { label: "إنستغرام", value: "instagram" },
      { label: "سناب شات", value: "snapchat" },
      { label: "تيك توك", value: "tiktok" },
      { label: "يوتيوب", value: "youtube" },
      { label: "تويتر (X)", value: "x" },
      { label: "أخرى", value: "other" },
    ],
    default: "all",
  },
  {
    type: "dateRange",
    label: "تاريخ الانضمام",
    key: "joinedAt",
  },
];

export const influencerColumns: TableColumn<InfluencerRow>[] = [
  {
    key: "id",
    label: "المعرف",
    cell: (val) => <span className="text-gray-500">#{val}</span>,
  },
  {
    key: "name",
    label: "الاسم",
  },
  {
    key: "handle",
    label: "الحساب",
    cell: (val) => (
      <span className="text-blue-600 font-medium">{val || "لا يوجد"}</span>
    ),
  },
  {
    key: "platform",
    label: "المنصة",
    cell: (val) => {
      const platformStyles: Record<InfluencerPlatform, string> = {
        instagram: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
        snapchat: "bg-yellow-400 text-black",
        tiktok: "bg-black text-white",
        youtube: "bg-red-600 text-white",
        x: "bg-black text-white",
        other: "bg-gray-500 text-white",
      };
      const style =
        platformStyles[val as InfluencerPlatform] ||
        "bg-gray-200 text-gray-700";

      return (
        <span className={`${style} px-3 py-1 rounded-full text-sm font-medium`}>
          {influencerPlatformMap[val as InfluencerPlatform]}
        </span>
      );
    },
  },
  {
    key: "code",
    label: "الكود",
    cell: (val) => (
      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-mono">
        {val}
      </span>
    ),
  },
  {
    key: "email",
    label: "البريد الإلكتروني",
    cell: (val) => val || <span className="text-gray-400">غير متوفر</span>,
  },
  {
    key: "phone",
    label: "رقم الهاتف",
    cell: (val) =>
      val ? (
        <span dir="ltr" className="block text-gray-700">
          {val}
        </span>
      ) : (
        <span className="text-gray-400">غير متوفر</span>
      ),
  },
  {
    key: "joinedAt",
    label: "تاريخ الانضمام",
    cell: (val) => <span className="text-gray-600">{formatDate(val)}</span>,
  },
  {
    key: "status",
    label: "الحالة",
    cell: (val) => {
      const statusStyles: Record<InfluencerStatus, string> = {
        active:
          "bg-[#EBFBF2] text-[var(--secondary-500)] border border-[var(--secondary-200)]",
        inactive: "bg-gray-100 text-gray-600 border border-gray-300",
      };
      const style = statusStyles[val as InfluencerStatus] || "";

      return (
        <span className={`${style} px-3 py-1 rounded-full text-sm font-medium`}>
          {influencerStatusMap[val as InfluencerStatus]}
        </span>
      );
    },
  },
  {
    key: "socialMediaUrl",
    label: "الرابط",
    cell: (val, row) => {
      if (!val) return <span className="text-gray-400">غير متوفر</span>;

      return (
        <a
          href={val as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          زيارة الحساب
        </a>
      );
    },
  },
];

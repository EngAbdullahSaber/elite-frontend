import FallbackImage from "@/components/shared/FallbackImage";
import {
  FilterConfig,
  SortConfig,
  TableColumn,
} from "@/types/components/Table";
import {
  PartnerRow,
  PartnerStatus,
  PartnerKind,
  PartnerPlatform,
} from "@/hooks/dashboard/admin/partner/usePartner";
import { formatDate } from "@/utils/date";

export const partnerStatusClassMap: Record<PartnerStatus, string> = {
  active: "bg-green-600 hover:bg-green-700",
  inactive: "bg-gray-500 hover:bg-gray-600",
};

export const partnerKindMap: Record<PartnerKind, string> = {
  internal: "داخلي",
  external: "خارجي",
};

export const partnerPlatformMap: Record<
  Exclude<PartnerPlatform, null>,
  string
> = {
  instagram: "إنستغرام",
  facebook: "فيسبوك",
  twitter: "تويتر",
  youtube: "يوتيوب",
  tiktok: "تيك توك",
  snapchat: "سناب شات",
  website: "موقع ويب",
  other: "أخرى",
};

export const partnerStatusMap: Record<PartnerStatus, string> = {
  active: "نشط",
  inactive: "غير نشط",
};

export const campaignStatusMap: Record<string, string> = {
  scheduled: "مجدول",
  running: "قيد التشغيل",
  completed: "مكتمل",
  cancelled: "ملغي",
  draft: "مسودة",
};

export const partnerSortConfig: SortConfig = {
  sortFields: [
    { label: "الاسم", value: "name" },
    { label: "النوع", value: "kind" },
    { label: "الحالة", value: "status" },
    { label: "المنصة", value: "platform" },
    { label: "تاريخ الإنشاء", value: "createdAt" },
  ],
  defaultSort: "name",
};

export const partnerFilters: FilterConfig[] = [
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
    label: "النوع",
    key: "kind",
    options: [
      { label: "الكل", value: "all" },
      { label: "داخلي", value: "internal" },
      { label: "خارجي", value: "external" },
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
      { label: "فيسبوك", value: "facebook" },
      { label: "تويتر", value: "twitter" },
      { label: "يوتيوب", value: "youtube" },
      { label: "تيك توك", value: "tiktok" },
      { label: "سناب شات", value: "snapchat" },
      { label: "موقع ويب", value: "website" },
      { label: "أخرى", value: "other" },
    ],
    default: "all",
  },
  {
    type: "dateRange",
    label: "تاريخ الإنشاء",
    key: "createdAt",
  },
];

export const partnerColumns: TableColumn<PartnerRow>[] = [
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
    key: "kind",
    label: "النوع",
    cell: (val) => {
      const kindStyles: Record<PartnerKind, string> = {
        internal: "bg-blue-100 text-blue-800 border border-blue-200",
        external: "bg-green-100 text-green-800 border border-green-200",
      };
      const style = kindStyles[val as PartnerKind] || "";

      return (
        <span className={`${style} px-3 py-1 rounded-full text-sm font-medium`}>
          {partnerKindMap[val as PartnerKind]}
        </span>
      );
    },
  },
  {
    key: "platform",
    label: "المنصة",
    cell: (val) => {
      if (!val) {
        return <span className="text-gray-400">غير محدد</span>;
      }

      const platformStyles: Record<Exclude<PartnerPlatform, null>, string> = {
        instagram: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
        facebook: "bg-blue-600 text-white",
        twitter: "bg-black text-white",
        youtube: "bg-red-600 text-white",
        tiktok: "bg-black text-white",
        snapchat: "bg-yellow-400 text-black",
        website: "bg-indigo-600 text-white",
        other: "bg-gray-500 text-white",
      };
      const style =
        platformStyles[val as Exclude<PartnerPlatform, null>] ||
        "bg-gray-200 text-gray-700";

      return (
        <span className={`${style} px-3 py-1 rounded-full text-sm font-medium`}>
          {partnerPlatformMap[val as Exclude<PartnerPlatform, null>]}
        </span>
      );
    },
  },
  {
    key: "referralCode",
    label: "كود الإحالة",
    cell: (val) => (
      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-mono">
        {val}
      </span>
    ),
  },
  {
    key: "campaign",
    label: "الحملة",
    cell: (val) => {
      const campaign = val as PartnerRow["campaign"];
      if (!campaign) {
        return <span className="text-gray-400">لا توجد حملة</span>;
      }

      const statusStyles: Record<string, string> = {
        scheduled: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        running: "bg-blue-100 text-blue-800 border border-blue-200",
        completed: "bg-green-100 text-green-800 border border-green-200",
        cancelled: "bg-red-100 text-red-800 border border-red-200",
        draft: "bg-gray-100 text-gray-800 border border-gray-200",
      };
      const statusStyle =
        statusStyles[campaign.status] || "bg-gray-100 text-gray-800";

      return (
        <div className="space-y-1">
          <div className="font-medium text-sm">{campaign.name}</div>
          <span className={`${statusStyle} px-2 py-1 rounded text-xs`}>
            {campaignStatusMap[campaign.status] || campaign.status}
          </span>
        </div>
      );
    },
  },
  {
    key: "createdAt",
    label: "تاريخ الإنشاء",
    cell: (val) => <span className="text-gray-600">{formatDate(val)}</span>,
  },
  {
    key: "status",
    label: "الحالة",
    cell: (val) => {
      const statusStyles: Record<PartnerStatus, string> = {
        active:
          "bg-[#EBFBF2] text-[var(--secondary-500)] border border-[var(--secondary-200)]",
        inactive: "bg-gray-100 text-gray-600 border border-gray-300",
      };
      const style = statusStyles[val as PartnerStatus] || "";

      return (
        <span className={`${style} px-3 py-1 rounded-full text-sm font-medium`}>
          {partnerStatusMap[val as PartnerStatus]}
        </span>
      );
    },
  },
  {
    key: "campaign",
    label: "تفاصيل الحملة",
    cell: (val) => {
      const campaign = val as PartnerRow["campaign"];
      if (!campaign) {
        return <span className="text-gray-400">-</span>;
      }

      return (
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">القناة:</span>
            <span className="text-gray-600">{campaign.targetChannel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">الفترة:</span>
            <span className="text-gray-600">
              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
            </span>
          </div>
        </div>
      );
    },
  },
];

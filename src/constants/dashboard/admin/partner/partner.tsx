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
    key: "referralCode",
    label: "كود الإحالة",
    cell: (val) => (
      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-mono">
        {val}
      </span>
    ),
  },

  {
    key: "createdAt",
    label: "تاريخ الإنشاء",
    cell: (val) => <span className="text-gray-600">{formatDate(val)}</span>,
  },
];

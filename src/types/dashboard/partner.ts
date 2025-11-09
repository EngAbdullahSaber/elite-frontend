// types/dashboard/partner.ts

export type PartnerStatus = "active" | "inactive";

export type PartnerKind = "internal" | "external";

export type PartnerPlatform =
  | "instagram"
  | "facebook"
  | "twitter"
  | "youtube"
  | "tiktok"
  | "snapchat"
  | "website"
  | "other"
  | null;

export interface PartnerRow {
  id: string;
  name: string;
  kind: PartnerKind;
  platform: PartnerPlatform;
  referralCode: string;
  status: PartnerStatus;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  campaign: {
    id: string;
    name: string;
    title: string;
    status: string;
    targetChannel: string;
    startDate: string;
    endDate: string;
  } | null;
  // Performance metrics (optional)
  totalClicks?: number;
  totalConversions?: number;
  totalRevenue?: number;
  totalCommission?: number;
  totalTraffic?: number;
}

export type PartnerFilterKeys =
  | "status"
  | "kind"
  | "platform"
  | "sort"
  | "dir"
  | "createdAt_from"
  | "createdAt_to"
  | "page"
  | "limit"
  | "search"
  | "campaignId";

// Status map for display
export const partnerStatusMap: Record<PartnerStatus, string> = {
  active: "نشط",
  inactive: "غير نشط",
};

// Kind map for display
export const partnerKindMap: Record<PartnerKind, string> = {
  internal: "داخلي",
  external: "خارجي",
};

// Platform map for display
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

// Platform icon map (for UI components)
export const partnerPlatformIcons: Record<
  Exclude<PartnerPlatform, null>,
  string
> = {
  instagram: "📷",
  facebook: "👥",
  twitter: "🐦",
  youtube: "📺",
  tiktok: "🎵",
  snapchat: "👻",
  website: "🌐",
  other: "🔗",
};

// Platform color map (for UI styling)
export const partnerPlatformColors: Record<
  Exclude<PartnerPlatform, null>,
  string
> = {
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  facebook: "bg-blue-600",
  twitter: "bg-black",
  youtube: "bg-red-600",
  tiktok: "bg-black",
  snapchat: "bg-yellow-400",
  website: "bg-indigo-600",
  other: "bg-gray-500",
};

// Kind color map (for UI styling)
export const partnerKindColors: Record<PartnerKind, string> = {
  internal: "bg-blue-100 text-blue-800",
  external: "bg-green-100 text-green-800",
};

// Campaign status map for display
export const campaignStatusMap: Record<string, string> = {
  scheduled: "مجدول",
  running: "قيد التشغيل",
  completed: "مكتمل",
  cancelled: "ملغي",
  draft: "مسودة",
};

// Campaign status colors
export const campaignStatusColors: Record<string, string> = {
  scheduled: "bg-yellow-100 text-yellow-800",
  running: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800",
};

// Target channel map
export const targetChannelMap: Record<string, string> = {
  whatsapp: "واتساب",
  sms: "رسالة نصية",
  email: "بريد إلكتروني",
  push: "إشعار",
  all: "جميع القنوات",
};

// Performance status types
export type PerformanceStatus = "excellent" | "good" | "average" | "poor";

export interface PartnerPerformance {
  id: string;
  partnerId: string;
  period: string; // 'daily', 'weekly', 'monthly'
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
  traffic: number;
  conversionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerStats {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCommission: number;
  totalTraffic: number;
  averageConversionRate: number;
  topPerformingPlatform: PartnerPlatform;
  topPerformingKind: PartnerKind;
  performanceTrend: {
    period: string;
    clicks: number;
    conversions: number;
    revenue: number;
    traffic: number;
  }[];
}

// Performance status map
export const performanceStatusMap: Record<PerformanceStatus, string> = {
  excellent: "ممتاز",
  good: "جيد",
  average: "متوسط",
  poor: "ضعيف",
};

// Performance color map
export const performanceColorMap: Record<PerformanceStatus, string> = {
  excellent: "bg-green-100 text-green-800",
  good: "bg-blue-100 text-blue-800",
  average: "bg-yellow-100 text-yellow-800",
  poor: "bg-red-100 text-red-800",
};

// Helper function to determine performance status based on conversion rate
export const getPerformanceStatus = (
  conversionRate: number
): PerformanceStatus => {
  if (conversionRate >= 10) return "excellent";
  if (conversionRate >= 5) return "good";
  if (conversionRate >= 2) return "average";
  return "poor";
};

// Helper function to get platform display name
export const getPlatformDisplayName = (platform: PartnerPlatform): string => {
  if (!platform) return "غير محدد";
  return partnerPlatformMap[platform];
};

// Helper function to get kind display name
export const getKindDisplayName = (kind: PartnerKind): string => {
  return partnerKindMap[kind];
};

// Helper function to get status display name
export const getStatusDisplayName = (status: PartnerStatus): string => {
  return partnerStatusMap[status];
};

// Helper function to generate platform URL
export const generatePlatformUrl = (
  platform: PartnerPlatform,
  handle: string | null
): string | null => {
  if (!platform || !handle) return null;

  const cleanHandle = handle.replace("@", "");

  const urlMap: Record<Exclude<PartnerPlatform, null>, string> = {
    instagram: `https://instagram.com/${cleanHandle}`,
    facebook: `https://facebook.com/${cleanHandle}`,
    twitter: `https://twitter.com/${cleanHandle}`,
    youtube: `https://youtube.com/@${cleanHandle}`,
    tiktok: `https://tiktok.com/@${cleanHandle}`,
    snapchat: `https://snapchat.com/add/${cleanHandle}`,
    website: cleanHandle.startsWith("http")
      ? cleanHandle
      : `https://${cleanHandle}`,
    other: cleanHandle.startsWith("http")
      ? cleanHandle
      : `https://${cleanHandle}`,
  };

  return urlMap[platform];
};

// Helper function to check if partner is internal
export const isInternalPartner = (kind: PartnerKind): boolean => {
  return kind === "internal";
};

// Helper function to check if partner has active campaign
export const hasActiveCampaign = (
  campaign: PartnerRow["campaign"]
): boolean => {
  return campaign?.status === "running" || campaign?.status === "scheduled";
};

// Partner creation data type
export interface CreatePartnerData {
  name: string;
  kind: PartnerKind;
  platform?: PartnerPlatform;
  referralCode?: string;
  isActive?: boolean;
  campaignId?: number;
}

// Partner update data type
export interface UpdatePartnerData {
  name?: string;
  kind?: PartnerKind;
  platform?: PartnerPlatform;
  referralCode?: string;
  isActive?: boolean;
  campaignId?: number;
}

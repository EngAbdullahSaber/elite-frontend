// types/dashboard/influencer.ts

export type InfluencerStatus = "active" | "inactive";

export type InfluencerPlatform =
  | "instagram"
  | "snapchat"
  | "tiktok"
  | "youtube"
  | "x"
  | "other";

export interface InfluencerRow {
  id: string;
  name: string;
  handle: string | null;
  platform: InfluencerPlatform;
  code: string;
  status: InfluencerStatus;
  joinedAt: string;
  email: string | null;
  phone: string | null;
  verificationStatus: string | null;
  userId: string | null;
  socialMediaUrl: string | null;
  // Performance metrics (optional)
  totalClicks?: number;
  totalConversions?: number;
  totalRevenue?: number;
  totalCommission?: number;
}

export type InfluencerFilterKeys =
  | "status"
  | "platform"
  | "sort"
  | "dir"
  | "joinedAt_from"
  | "joinedAt_to"
  | "page"
  | "limit"
  | "search";

// Status map for display
export const influencerStatusMap: Record<InfluencerStatus, string> = {
  active: "نشط",
  inactive: "غير نشط",
};

// Platform map for display
export const influencerPlatformMap: Record<InfluencerPlatform, string> = {
  instagram: "إنستغرام",
  snapchat: "سناب شات",
  tiktok: "تيك توك",
  youtube: "يوتيوب",
  x: "تويتر (X)",
  other: "أخرى",
};

// Platform icon map (for UI components)
export const influencerPlatformIcons: Record<InfluencerPlatform, string> = {
  instagram: "📷",
  snapchat: "👻",
  tiktok: "🎵",
  youtube: "📺",
  x: "🐦",
  other: "🔗",
};

// Platform color map (for UI styling)
export const influencerPlatformColors: Record<InfluencerPlatform, string> = {
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  snapchat: "bg-yellow-400",
  tiktok: "bg-black",
  youtube: "bg-red-600",
  x: "bg-black",
  other: "bg-gray-500",
};

// Performance status types
export type PerformanceStatus = "excellent" | "good" | "average" | "poor";

export interface InfluencerPerformance {
  id: string;
  influencerId: string;
  period: string; // 'daily', 'weekly', 'monthly'
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
  conversionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface InfluencerStats {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCommission: number;
  averageConversionRate: number;
  topPerformingPlatform: InfluencerPlatform;
  performanceTrend: {
    period: string;
    clicks: number;
    conversions: number;
    revenue: number;
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

// Helper function to generate social media URL
export const generateSocialMediaUrl = (
  platform: InfluencerPlatform,
  handle: string | null
): string | null => {
  if (!handle) return null;

  const cleanHandle = handle.replace("@", "");

  const urlMap: Record<InfluencerPlatform, string> = {
    instagram: `https://instagram.com/${cleanHandle}`,
    snapchat: `https://snapchat.com/add/${cleanHandle}`,
    tiktok: `https://tiktok.com/@${cleanHandle}`,
    youtube: `https://youtube.com/@${cleanHandle}`,
    x: `https://x.com/${cleanHandle}`,
    other: `https://${cleanHandle}`,
  };

  return urlMap[platform];
};

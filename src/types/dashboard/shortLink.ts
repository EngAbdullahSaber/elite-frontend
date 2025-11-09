// types/dashboard/shortLink.ts

export type ShortLinkStatus = "active" | "inactive";

export interface ShortLinkRow {
  id: string;
  slug: string;
  destination: string;
  shortUrl: string;
  campaignId: string | null;
  status: ShortLinkStatus;
  createdAt: string;
  updatedAt: string;
  influencerName: string | null;
  influencerHandle: string | null;
  influencerPlatform: string | null;
  marketerReferralCode: string | null;
  createdByName: string;
  createdByEmail: string;
  // Analytics metrics (optional)
  totalClicks?: number;
  uniqueClicks?: number;
  totalConversions?: number;
  conversionRate?: number;
  lastClickedAt?: string | null;
}

export type ShortLinkFilterKeys =
  | "status"
  | "influencerId"
  | "marketerId"
  | "campaignId"
  | "sort"
  | "dir"
  | "createdAt_from"
  | "createdAt_to"
  | "page"
  | "limit"
  | "search";

// Status map for display
export const shortLinkStatusMap: Record<ShortLinkStatus, string> = {
  active: "نشط",
  inactive: "غير نشط",
};

// Status color map (for UI styling)
export const shortLinkStatusColors: Record<ShortLinkStatus, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
};

// Analytics types
export interface ShortLinkAnalytics {
  id: string;
  shortLinkId: string;
  totalClicks: number;
  uniqueClicks: number;
  totalConversions: number;
  conversionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShortLinkStats {
  totalClicks: number;
  uniqueClicks: number;
  totalConversions: number;
  conversionRate: number;
  topReferrers: {
    referrer: string;
    clicks: number;
    percentage: number;
  }[];
  clickTrend: {
    date: string;
    clicks: number;
    conversions: number;
  }[];
  deviceBreakdown: {
    device: string;
    clicks: number;
    percentage: number;
  }[];
  geographicData: {
    country: string;
    clicks: number;
    percentage: number;
  }[];
}

export interface ClickData {
  id: string;
  shortLinkId: string;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  country: string;
  city: string;
  deviceType: string;
  browser: string;
  os: string;
  createdAt: string;
}

// Performance status types for short links
export type ShortLinkPerformanceStatus =
  | "excellent"
  | "good"
  | "average"
  | "poor";

// Performance status map
export const shortLinkPerformanceMap: Record<
  ShortLinkPerformanceStatus,
  string
> = {
  excellent: "ممتاز",
  good: "جيد",
  average: "متوسط",
  poor: "ضعيف",
};

// Performance color map
export const shortLinkPerformanceColors: Record<
  ShortLinkPerformanceStatus,
  string
> = {
  excellent: "bg-green-100 text-green-800",
  good: "bg-blue-100 text-blue-800",
  average: "bg-yellow-100 text-yellow-800",
  poor: "bg-red-100 text-red-800",
};

// Helper function to determine performance status based on conversion rate
export const getShortLinkPerformanceStatus = (
  conversionRate: number
): ShortLinkPerformanceStatus => {
  if (conversionRate >= 15) return "excellent";
  if (conversionRate >= 8) return "good";
  if (conversionRate >= 3) return "average";
  return "poor";
};

// Helper function to generate short URL
export const generateShortUrl = (slug: string): string => {
  // You can replace this with your actual short domain
  const shortDomain =
    typeof window !== "undefined"
      ? `${window.location.origin}/s`
      : "https://yourdomain.com/s";
  return `${shortDomain}/${slug}`;
};

// Helper function to truncate long URLs for display
export const truncateUrl = (url: string, maxLength: number = 50): string => {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + "...";
};

// Helper function to format click numbers
export const formatClicks = (clicks: number): string => {
  if (clicks >= 1000000) {
    return (clicks / 1000000).toFixed(1) + "M";
  }
  if (clicks >= 1000) {
    return (clicks / 1000).toFixed(1) + "K";
  }
  return clicks.toString();
};

// Helper function to get platform icon
export const getPlatformIcon = (platform: string | null): string => {
  if (!platform) return "🔗";

  const icons: Record<string, string> = {
    instagram: "📷",
    snapchat: "👻",
    tiktok: "🎵",
    youtube: "📺",
    x: "🐦",
  };

  return icons[platform] || "🔗";
};

// Helper function to get platform name
export const getPlatformName = (platform: string | null): string => {
  if (!platform) return "غير محدد";

  const names: Record<string, string> = {
    instagram: "إنستغرام",
    snapchat: "سناب شات",
    tiktok: "تيك توك",
    youtube: "يوتيوب",
    x: "تويتر (X)",
  };

  return names[platform] || platform;
};

// Types for creating/updating short links
export interface CreateShortLinkData {
  slug: string;
  destination: string;
  campaignId?: string | null;
  influencerId?: string | null;
  marketerId?: string | null;
  isActive?: boolean;
}

export interface UpdateShortLinkData {
  slug?: string;
  destination?: string;
  campaignId?: string | null;
  influencerId?: string | null;
  marketerId?: string | null;
  isActive?: boolean;
}

// Types for filter options
export interface ShortLinkFilterOptions {
  status: Array<{ label: string; value: string }>;
  influencers: Array<{ label: string; value: string }>;
  marketers: Array<{ label: string; value: string }>;
  campaigns: Array<{ label: string; value: string }>;
}

// Default filter options
export const defaultShortLinkFilters: ShortLinkFilterOptions = {
  status: [
    { label: "الكل", value: "all" },
    { label: "نشط", value: "active" },
    { label: "غير نشط", value: "inactive" },
  ],
  influencers: [{ label: "الكل", value: "all" }],
  marketers: [{ label: "الكل", value: "all" }],
  campaigns: [{ label: "الكل", value: "all" }],
};

// Types for analytics charts
export interface ClickTrendData {
  date: string;
  clicks: number;
  conversions: number;
}

export interface DeviceData {
  device: string;
  clicks: number;
  percentage: number;
}

export interface GeographicData {
  country: string;
  countryCode: string;
  clicks: number;
  percentage: number;
}

export interface ReferrerData {
  referrer: string;
  clicks: number;
  percentage: number;
}

// Types for performance reports
export interface PerformanceReport {
  period: string;
  totalClicks: number;
  uniqueClicks: number;
  totalConversions: number;
  conversionRate: number;
  performanceByPeriod: {
    period: string;
    clicks: number;
    uniqueClicks: number;
    conversions: number;
  }[];
}

// Validation schemas (for form validation)
export const shortLinkValidation = {
  slug: {
    required: "الرابط المختصر مطلوب",
    minLength: {
      value: 3,
      message: "يجب أن يكون الرابط المختصر 3 أحرف على الأقل",
    },
    maxLength: { value: 50, message: "يجب ألا يتجاوز الرابط المختصر 50 حرف" },
    pattern: {
      value: /^[a-zA-Z0-9_-]+$/,
      message: "يجب أن يحتوي الرابط المختصر على أحرف وأرقام وشرطات فقط",
    },
  },
  destination: {
    required: "الرابط الوجهة مطلوب",
    pattern: {
      value: /^https?:\/\/.+/,
      message: "يجب أن يبدأ الرابط بـ http:// أو https://",
    },
  },
};

// services/shortLinks/shortLinks.ts

import { api } from "@/libs/axios";

export interface Influencer {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  handle: string | null;
  platform: string;
  code: string;
  isActive: boolean;
}

export interface Marketer {
  id: number;
  createdAt: string;
  updatedAt: string;
  referralCode: string;
}

export interface CreatedByUser {
  id: number;
  createdAt: string;
  updatedAt: string;
  phoneNumber: string;
  email: string;
  fullName: string;
  userType: string;
  profilePhotoUrl: string | null;
  nationalIdUrl: string | null;
  residencyIdUrl: string | null;
  verificationStatus: string;
  verifiedAt: string | null;
  passwordHash: string;
  emailOtp: string | null;
  emailOtpExpiresAt: string | null;
  resetOtp: string | null;
  resetOtpExpiresAt: string | null;
  isActive: boolean;
}

export interface ShortLink {
  id: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  destination: string;
  campaignId: number | null;
  isActive: boolean;
  influencer: Influencer | null;
  marketer: Marketer | null;
  createdBy: CreatedByUser;
}

export interface ShortLinksResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: ShortLink[];
}

export interface CreateShortLinkData {
  slug: string;
  destination: string;
  campaignId?: number | null;
  influencerId?: number | null;
  marketerId?: number | null;
  isActive?: boolean;
}

export interface UpdateShortLinkData {
  slug?: string;
  destination?: string;
  campaignId?: number | null;
  influencerId?: number | null;
  marketerId?: number | null;
  isActive?: boolean;
}

export interface ShortLinkAnalytics {
  id: number;
  shortLinkId: number;
  totalClicks: number;
  uniqueClicks: number;
  conversionRate: number;
  totalConversions: number;
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
  id: number;
  shortLinkId: number;
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

// GET - Fetch all short links with pagination and filtering
export async function getShortLinks(
  params?: {
    page?: number;
    limit?: number;
    influencerId?: number;
    marketerId?: number;
    campaignId?: number;
    isActive?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    createdAt_from?: string;
    createdAt_to?: string;
  },
  signal?: AbortSignal
): Promise<ShortLinksResponse> {
  try {
    const response = await api.get("/short-links", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching short links:", error);
    throw error;
  }
}

// GET - Fetch single short link by ID
export async function getShortLinkById(
  slug: string,
  signal?: AbortSignal
): Promise<ShortLink> {
  try {
    const response = await api.get(`/short-links/info/${slug}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching short link ${id}:`, error);
    throw error;
  }
}

// GET - Fetch short link by slug
export async function getShortLinkBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<ShortLink> {
  try {
    const response = await api.get(`/short-links/slug/${slug}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching short link with slug ${slug}:`, error);
    throw error;
  }
}

// POST - Create new short link
export async function createShortLink(
  data: CreateShortLinkData,
  signal?: AbortSignal
): Promise<ShortLink> {
  try {
    const response = await api.post("/short-links", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating short link:", error);
    throw error;
  }
}

// PATCH - Update short link
export async function updateShortLink(
  id: number,
  data: UpdateShortLinkData,
  signal?: AbortSignal
): Promise<ShortLink> {
  try {
    const response = await api.patch(`/short-links/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating short link ${id}:`, error);
    throw error;
  }
}

// PUT - Update short link (alternative to PATCH)
export async function updateShortLinkPut(
  id: number,
  data: UpdateShortLinkData,
  signal?: AbortSignal
): Promise<ShortLink> {
  try {
    const response = await api.put(`/short-links/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating short link ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete short link
export async function deleteShortLink(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/short-links/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting short link ${id}:`, error);
    throw error;
  }
}

// POST - Activate short link
export async function activateShortLink(
  id: number,
  signal?: AbortSignal
): Promise<ShortLink> {
  try {
    const response = await api.post(
      `/short-links/${id}/activate`,
      {},
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error activating short link ${id}:`, error);
    throw error;
  }
}

// POST - Deactivate short link
export async function deactivateShortLink(
  id: number,
  signal?: AbortSignal
): Promise<ShortLink> {
  try {
    const response = await api.post(
      `/short-links/${id}/deactivate`,
      {},
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error deactivating short link ${id}:`, error);
    throw error;
  }
}

// POST - Update short link activation status
export async function updateShortLinkActivation(
  id: number,
  isActive: boolean,
  signal?: AbortSignal
): Promise<ShortLink> {
  try {
    const response = await api.post(
      `/short-links/${id}/activation`,
      { isActive },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating short link activation ${id}:`, error);
    throw error;
  }
}

// GET - Get short link analytics
export async function getShortLinkAnalytics(
  id: number,
  params?: {
    startDate?: string;
    endDate?: string;
    period?: string; // 'daily', 'weekly', 'monthly'
  },
  signal?: AbortSignal
): Promise<ShortLinkAnalytics> {
  try {
    const response = await api.get(`/short-links/${id}/analytics`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching analytics for short link ${id}:`, error);
    throw error;
  }
}

// GET - Get short link statistics
export async function getShortLinkStats(
  id: number,
  params?: {
    startDate?: string;
    endDate?: string;
  },
  signal?: AbortSignal
): Promise<ShortLinkStats> {
  try {
    const response = await api.get(`/short-links/${id}/stats`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching stats for short link ${id}:`, error);
    throw error;
  }
}

// GET - Get short link clicks
export async function getShortLinkClicks(
  id: number,
  params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<{
  total_records: number;
  current_page: number;
  per_page: number;
  records: ClickData[];
}> {
  try {
    const response = await api.get(`/short-links/${id}/clicks`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching clicks for short link ${id}:`, error);
    throw error;
  }
}

// POST - Track short link click
export async function trackShortLinkClick(
  slug: string,
  data?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    campaign?: string;
  },
  signal?: AbortSignal
): Promise<{ success: boolean; destination: string }> {
  try {
    const response = await api.post(`/short-links/${slug}/click`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error tracking click for short link ${slug}:`, error);
    throw error;
  }
}

// GET - Get short links by influencer
export async function getShortLinksByInfluencer(
  influencerId: number,
  params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<ShortLinksResponse> {
  try {
    const response = await api.get(`/short-links/influencer/${influencerId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error fetching short links for influencer ${influencerId}:`,
      error
    );
    throw error;
  }
}

// GET - Get short links by marketer
export async function getShortLinksByMarketer(
  marketerId: number,
  params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<ShortLinksResponse> {
  try {
    const response = await api.get(`/short-links/marketer/${marketerId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error fetching short links for marketer ${marketerId}:`,
      error
    );
    throw error;
  }
}

// GET - Get short links by campaign
export async function getShortLinksByCampaign(
  campaignId: number,
  params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<ShortLinksResponse> {
  try {
    const response = await api.get(`/short-links/campaign/${campaignId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error fetching short links for campaign ${campaignId}:`,
      error
    );
    throw error;
  }
}

// GET - Get active short links
export async function getActiveShortLinks(
  params?: {
    page?: number;
    limit?: number;
    influencerId?: number;
    marketerId?: number;
    campaignId?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<ShortLinksResponse> {
  try {
    const response = await api.get("/short-links", {
      params: {
        isActive: true,
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching active short links:", error);
    throw error;
  }
}

// GET - Search short links
export async function searchShortLinks(
  query: string,
  params?: {
    page?: number;
    limit?: number;
    influencerId?: number;
    marketerId?: number;
    campaignId?: number;
    isActive?: boolean;
  },
  signal?: AbortSignal
): Promise<ShortLinksResponse> {
  try {
    const response = await api.get("/short-links/search", {
      params: {
        search: query,
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error searching short links:", error);
    throw error;
  }
}

// GET - Generate unique slug
export async function generateSlug(
  baseSlug: string,
  signal?: AbortSignal
): Promise<{ slug: string; available: boolean }> {
  try {
    const response = await api.get("/short-links/generate-slug", {
      params: { baseSlug },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error generating slug:", error);
    throw error;
  }
}

// GET - Check slug availability
export async function checkSlugAvailability(
  slug: string,
  signal?: AbortSignal
): Promise<{ available: boolean }> {
  try {
    const response = await api.get("/short-links/check-slug", {
      params: { slug },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error checking slug availability:", error);
    throw error;
  }
}

// GET - Get short link performance report
export async function getShortLinkPerformanceReport(
  id: number,
  params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: string; // 'day', 'week', 'month'
  },
  signal?: AbortSignal
): Promise<{
  totalClicks: number;
  uniqueClicks: number;
  conversionRate: number;
  performanceByPeriod: {
    period: string;
    clicks: number;
    uniqueClicks: number;
    conversions: number;
  }[];
}> {
  try {
    const response = await api.get(`/short-links/${id}/performance-report`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error fetching performance report for short link ${id}:`,
      error
    );
    throw error;
  }
}

// GET - Get top performing short links
export async function getTopPerformingShortLinks(
  params?: {
    page?: number;
    limit?: number;
    period?: string; // 'day', 'week', 'month'
    influencerId?: number;
    marketerId?: number;
  },
  signal?: AbortSignal
): Promise<ShortLinksResponse> {
  try {
    const response = await api.get("/short-links/top-performing", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching top performing short links:", error);
    throw error;
  }
}

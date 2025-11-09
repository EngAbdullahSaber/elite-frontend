// services/influencers/influencers.ts

import { api } from "@/libs/axios";

export interface InfluencerUser {
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

export interface Influencer {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  handle: string | null;
  platform: string; // 'instagram', 'snapchat', 'tiktok', 'youtube', etc.
  code: string;
  isActive: boolean;
  user: InfluencerUser | null;
}

export interface InfluencersResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Influencer[];
}

export interface CreateInfluencerData {
  name: string;
  handle?: string | null;
  platform: string;
  code: string;
  isActive?: boolean;
  userId?: number; // Optional user ID to associate with existing user
}

export interface UpdateInfluencerData {
  name?: string;
  handle?: string | null;
  platform?: string;
  code?: string;
  isActive?: boolean;
  userId?: number | null;
}

export interface InfluencerPerformance {
  id: number;
  influencerId: number;
  period: string; // 'daily', 'weekly', 'monthly'
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
  createdAt: string;
  updatedAt: string;
}

export interface InfluencerPerformanceResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: InfluencerPerformance[];
}

export interface InfluencerStats {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCommission: number;
  averageConversionRate: number;
  topPerformingPlatform: string;
  performanceTrend: {
    period: string;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
}

// GET - Fetch all influencers with pagination and filtering
export async function getInfluencers(
  params?: {
    page?: number;
    limit?: number;
    platform?: string;
    isActive?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    createdAt_from?: string;
    createdAt_to?: string;
  },
  signal?: AbortSignal
): Promise<InfluencersResponse> {
  try {
    const response = await api.get("/traffic/influencers", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching influencers:", error);
    throw error;
  }
}

// GET - Fetch single influencer by ID
export async function getInfluencerById(
  id: number,
  signal?: AbortSignal
): Promise<Influencer> {
  try {
    const response = await api.get(`/traffic/influencers/${id}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching influencer ${id}:`, error);
    throw error;
  }
}

// POST - Create new influencer
export async function createInfluencer(
  data: CreateInfluencerData,
  signal?: AbortSignal
): Promise<Influencer> {
  try {
    const response = await api.post("/traffic/influencers", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating influencer:", error);
    throw error;
  }
}

// PATCH - Update influencer
export async function updateInfluencer(
  id: number,
  data: UpdateInfluencerData,
  signal?: AbortSignal
): Promise<Influencer> {
  try {
    const response = await api.patch(`/traffic/influencers/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating influencer ${id}:`, error);
    throw error;
  }
}

// PUT - Update influencer (alternative to PATCH)
export async function updateInfluencerPut(
  id: number,
  data: UpdateInfluencerData,
  signal?: AbortSignal
): Promise<Influencer> {
  try {
    const response = await api.put(`/traffic/influencers/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating influencer ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete influencer
export async function deleteInfluencer(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/traffic/influencers/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting influencer ${id}:`, error);
    throw error;
  }
}

// GET - Get influencer performance metrics
export async function getInfluencerPerformance(
  id: number,
  params?: {
    page?: number;
    limit?: number;
    period?: string; // 'daily', 'weekly', 'monthly'
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<InfluencerPerformanceResponse> {
  try {
    const response = await api.get(`/traffic/influencers/${id}/performance`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching performance for influencer ${id}:`, error);
    throw error;
  }
}

// GET - Get influencer statistics
export async function getInfluencerStats(
  id: number,
  params?: {
    startDate?: string;
    endDate?: string;
    period?: string;
  },
  signal?: AbortSignal
): Promise<InfluencerStats> {
  try {
    const response = await api.get(`/traffic/influencers/${id}/stats`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching stats for influencer ${id}:`, error);
    throw error;
  }
}

// GET - Get influencers by platform
export async function getInfluencersByPlatform(
  platform: string,
  params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<InfluencersResponse> {
  try {
    const response = await api.get(
      `/traffic/influencers/platform/${platform}`,
      {
        params,
        signal,
      }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error fetching influencers for platform ${platform}:`,
      error
    );
    throw error;
  }
}

// GET - Get active influencers
export async function getActiveInfluencers(
  params?: {
    page?: number;
    limit?: number;
    platform?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<InfluencersResponse> {
  try {
    const response = await api.get("/traffic/influencers", {
      params: {
        isActive: true,
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching active influencers:", error);
    throw error;
  }
}

// GET - Search influencers
export async function searchInfluencers(
  query: string,
  params?: {
    page?: number;
    limit?: number;
    platform?: string;
    isActive?: boolean;
  },
  signal?: AbortSignal
): Promise<InfluencersResponse> {
  try {
    const response = await api.get("/traffic/influencers/search", {
      params: {
        search: query,
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error searching influencers:", error);
    throw error;
  }
}

// POST - Update influencer activation status
export async function updateInfluencerActivation(
  id: number,
  isActive: boolean,
  signal?: AbortSignal
): Promise<Influencer> {
  try {
    const response = await api.post(
      `/traffic/influencers/${id}/activation`,
      { isActive },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating influencer activation ${id}:`, error);
    throw error;
  }
}

// GET - Get influencer by code
export async function getInfluencerByCode(
  code: string,
  signal?: AbortSignal
): Promise<Influencer> {
  try {
    const response = await api.get(`/traffic/influencers/code/${code}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching influencer with code ${code}:`, error);
    throw error;
  }
}

// POST - Track influencer click
export async function trackInfluencerClick(
  code: string,
  data?: {
    source?: string;
    campaign?: string;
    ipAddress?: string;
    userAgent?: string;
  },
  signal?: AbortSignal
): Promise<{ success: boolean; influencerId: number }> {
  try {
    const response = await api.post(
      `/traffic/influencers/${code}/click`,
      data,
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error tracking click for influencer ${code}:`, error);
    throw error;
  }
}

// POST - Track influencer conversion
export async function trackInfluencerConversion(
  code: string,
  data: {
    conversionValue: number;
    conversionType: string;
    metadata?: any;
  },
  signal?: AbortSignal
): Promise<{ success: boolean; conversionId: number }> {
  try {
    const response = await api.post(
      `/traffic/influencers/${code}/conversion`,
      data,
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error tracking conversion for influencer ${code}:`, error);
    throw error;
  }
}

// GET - Get top performing influencers
export async function getTopPerformingInfluencers(
  params?: {
    page?: number;
    limit?: number;
    period?: string; // 'week', 'month', 'year'
    platform?: string;
  },
  signal?: AbortSignal
): Promise<InfluencersResponse> {
  try {
    const response = await api.get("/traffic/influencers/top-performing", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching top performing influencers:", error);
    throw error;
  }
}

// GET - Get influencer commission report
export async function getInfluencerCommissionReport(
  id: number,
  params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  },
  signal?: AbortSignal
): Promise<{
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
  commissions: InfluencerPerformance[];
}> {
  try {
    const response = await api.get(
      `/traffic/influencers/${id}/commission-report`,
      {
        params,
        signal,
      }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error fetching commission report for influencer ${id}:`,
      error
    );
    throw error;
  }
}

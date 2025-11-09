// services/campaigns/campaigns.ts

import { api } from "@/libs/axios";

export interface CampaignUser {
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
  verifiedAt: string;
  passwordHash: string;
  emailOtp: string | null;
  emailOtpExpiresAt: string | null;
  resetOtp: string | null;
  resetOtpExpiresAt: string | null;
  isActive: boolean;
}

export interface CampaignImage {
  id: number;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}

export interface Campaign {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  description: string;
  targetChannel: string; // 'whatsapp', 'email', 'sms', 'push'
  targetAudience: string; // 'all_users', 'customers', 'agents', 'marketers'
  runType: string; // 'one_time', 'recurring'
  runOnceDatetime: string | null;
  startDate: string;
  endDate: string;
  runFrequency: string; // 'daily', 'weekly', 'monthly'
  runTime: string;
  status: string; // 'draft', 'scheduled', 'running', 'completed', 'paused', 'cancelled'
  messageContent: string;
  actualRecipients: number;
  views: number;
  responses: number;
  createdBy: CampaignUser;
  images: CampaignImage[];
}

export interface CampaignsResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Campaign[];
}

export interface CreateCampaignData {
  name: string;
  title: string;
  description: string;
  targetChannel: string;
  targetAudience: string;
  runType: string;
  runOnceDatetime?: string | null;
  startDate: string;
  endDate: string;
  runFrequency?: string;
  runTime?: string;
  messageContent: string;
  images?: Array<{
    imageUrl: string;
  }>;
}

export interface UpdateCampaignData {
  name?: string;
  title?: string;
  description?: string;
  targetChannel?: string;
  targetAudience?: string;
  runType?: string;
  runOnceDatetime?: string | null;
  startDate?: string;
  endDate?: string;
  runFrequency?: string;
  runTime?: string;
  status?: string;
  messageContent?: string;
  images?: Array<{
    imageUrl: string;
  }>;
}

export interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  scheduledCampaigns: number;
  completedCampaigns: number;
  totalRecipients: number;
  totalViews: number;
  totalResponses: number;
  averageResponseRate: number;
}

export interface ApiCampaign {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  description: string;
  targetChannel: string;
  targetAudience: string;
  runType: string;
  runOnceDatetime: string | null;
  startDate: string | null;
  endDate: string | null;
  runFrequency: string;
  runTime: string;
  status: string;
  messageContent: string;
  actualRecipients: number | null;
  views: number | null;
  responses: number | null;
  createdBy: any;
  images: any[];
}

// GET - Fetch all campaigns with pagination and filtering
export async function getCampaigns(
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    targetChannel?: string;
    targetAudience?: string;
    runType?: string;
    runFrequency?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    search?: string;
    startDate_from?: string;
    startDate_to?: string;
    endDate_from?: string;
    endDate_to?: string;
  },
  signal?: AbortSignal
): Promise<CampaignsResponse> {
  try {
    const response = await api.get("/campaigns", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
}

// GET - Fetch single campaign by ID
export async function getCampaignById(
  id: number,
  signal?: AbortSignal
): Promise<Campaign> {
  try {
    const response = await api.get(`/campaigns/${id}`, {
      signal,
    });

    // Debug: Log the response to see the actual structure
    console.log("API Response:", response.data);

    // Try different response structures
    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error(`Error fetching campaign ${id}:`, error);
    throw error;
  }
}

// POST - Create new campaign
export async function createCampaign(
  data: CreateCampaignData,
  signal?: AbortSignal
): Promise<Campaign> {
  try {
    const response = await api.post("/campaigns", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
}

// PATCH - Update campaign
export async function updateCampaign(
  id: number,
  data: UpdateCampaignData,
  signal?: AbortSignal
): Promise<Campaign> {
  try {
    const response = await api.patch(`/campaigns/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating campaign ${id}:`, error);
    throw error;
  }
}

// POST - Start campaign
export async function startCampaign(
  id: number,
  signal?: AbortSignal
): Promise<ApiCampaign> {
  try {
    const response = await api.post(
      `/campaigns/${id}/start`,
      {},
      {
        signal,
      }
    );

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error(`Error starting campaign ${id}:`, error);
    throw error;
  }
}

// POST - Pause campaign
export async function pauseCampaign(
  id: number,
  signal?: AbortSignal
): Promise<ApiCampaign> {
  try {
    const response = await api.post(
      `/campaigns/${id}/pause`,
      {},
      {
        signal,
      }
    );

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error(`Error pausing campaign ${id}:`, error);
    throw error;
  }
}

// POST - Stop campaign
export async function stopCampaign(
  id: number,
  signal?: AbortSignal
): Promise<ApiCampaign> {
  try {
    const response = await api.post(
      `/campaigns/${id}/stop`,
      {},
      {
        signal,
      }
    );

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error(`Error stopping campaign ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete campaign
export async function deleteCampaign(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/campaigns/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting campaign ${id}:`, error);
    throw error;
  }
}

// GET - Get campaign statistics
export async function getCampaignStats(
  id: number,
  signal?: AbortSignal
): Promise<{
  actualRecipients: number;
  views: number;
  responses: number;
  responseRate: number;
  viewRate: number;
  uniqueViews: number;
  conversions: number;
}> {
  try {
    const response = await api.get(`/campaigns/${id}/stats`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching stats for campaign ${id}:`, error);
    throw error;
  }
}

// GET - Get overall campaigns statistics
export async function getOverallCampaignStats(
  params?: {
    startDate?: string;
    endDate?: string;
    targetChannel?: string;
  },
  signal?: AbortSignal
): Promise<CampaignStats> {
  try {
    const response = await api.get("/campaigns/stats/overall", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching overall campaign stats:", error);
    throw error;
  }
}

// POST - Add images to campaign
export async function addCampaignImages(
  id: number,
  images: Array<{ imageUrl: string }>,
  signal?: AbortSignal
): Promise<Campaign> {
  try {
    const response = await api.post(
      `/campaigns/${id}/images`,
      { images },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error adding images to campaign ${id}:`, error);
    throw error;
  }
}

// DELETE - Remove image from campaign
export async function removeCampaignImage(
  id: number,
  imageId: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/campaigns/${id}/images/${imageId}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error removing image from campaign ${id}:`, error);
    throw error;
  }
}

// GET - Get campaigns by status
export async function getCampaignsByStatus(
  status: string,
  params?: {
    page?: number;
    limit?: number;
    targetChannel?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<CampaignsResponse> {
  try {
    const response = await api.get(`/campaigns/status/${status}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching campaigns with status ${status}:`, error);
    throw error;
  }
}

// GET - Get campaigns by target channel
export async function getCampaignsByChannel(
  channel: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<CampaignsResponse> {
  try {
    const response = await api.get(`/campaigns/channel/${channel}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching campaigns for channel ${channel}:`, error);
    throw error;
  }
}

// POST - Duplicate campaign
export async function duplicateCampaign(
  id: number,
  newName?: string,
  signal?: AbortSignal
): Promise<Campaign> {
  try {
    const response = await api.post(
      `/campaigns/${id}/duplicate`,
      { newName },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error duplicating campaign ${id}:`, error);
    throw error;
  }
}

// GET - Search campaigns
export async function searchCampaigns(
  query: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    targetChannel?: string;
  },
  signal?: AbortSignal
): Promise<CampaignsResponse> {
  try {
    const response = await api.get("/campaigns/search", {
      params: {
        search: query,
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error searching campaigns:", error);
    throw error;
  }
}

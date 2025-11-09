// services/partners/partners.ts

import { api } from "@/libs/axios";

export interface User {
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

export interface Campaign {
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
  startDate: string;
  endDate: string;
  runFrequency: string;
  runTime: string;
  status: string;
  messageContent: string;
  actualRecipients: number | null;
  views: number | null;
  responses: number | null;
  createdBy: User;
}

export interface Partner {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  kind: "internal" | "external";
  platform: string | null;
  referralCode: string;
  isActive: boolean;
  campaign: Campaign;
}

export interface PartnersResponse {
  page: number;
  limit: number;
  total: number;
  items: Partner[];
}

export interface CreatePartnerData {
  name: string;
  kind: "internal" | "external";
  platform?: string | null;
  referralCode?: string;
  isActive?: boolean;
  campaignId?: number;
}

export interface UpdatePartnerData {
  name?: string;
  kind?: "internal" | "external";
  platform?: string | null;
  referralCode?: string;
  isActive?: boolean;
  campaignId?: number;
}

// GET - Fetch all partners with pagination and filtering
export async function getPartners(
  params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    search?: string;
    kind?: "internal" | "external";
    platform?: string;
    isActive?: boolean;
    createdAt_from?: string;
    createdAt_to?: string;
    campaignId?: number;
  },
  signal?: AbortSignal
): Promise<PartnersResponse> {
  try {
    const response = await api.get("/traffic/partners", {
      params,
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching partners:", error);
    throw error;
  }
}

// GET - Fetch single partner by ID
export async function getPartnerById(
  id: number,
  signal?: AbortSignal
): Promise<Partner> {
  try {
    const response = await api.get(`/traffic/partners/${id}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching partner ${id}:`, error);
    throw error;
  }
}

// POST - Create new partner
export async function createPartner(
  data: CreatePartnerData,
  signal?: AbortSignal
): Promise<Partner> {
  try {
    const response = await api.post("/traffic/partners", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating partner:", error);
    throw error;
  }
}

// PATCH - Update partner
export async function updatePartner(
  id: number,
  data: UpdatePartnerData,
  signal?: AbortSignal
): Promise<Partner> {
  try {
    const response = await api.patch(`/traffic/partners/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating partner ${id}:`, error);
    throw error;
  }
}

// POST - Update partner status
export async function updatePartnerStatus(
  id: number,
  isActive: boolean,
  signal?: AbortSignal
): Promise<Partner> {
  try {
    const response = await api.post(
      `/traffic/partners/${id}/status`,
      { isActive },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating partner status ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete partner
export async function deletePartner(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/traffic/partners/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting partner ${id}:`, error);
    throw error;
  }
}

// GET - Fetch partner performance
export async function getPartnerPerformance(
  partnerId: number,
  signal?: AbortSignal
): Promise<any> {
  try {
    const response = await api.get(`/traffic/partners/${partnerId}/performance`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching partner stats ${partnerId}:`, error);
    throw error;
  }
}

// GET - Fetch partner campaigns
export async function getPartnerCampaigns(
  partnerId: number,
  params?: {
    page?: number;
    limit?: number;
  },
  signal?: AbortSignal
): Promise<any> {
  try {
    const response = await api.get(`/traffic/partners/${partnerId}/campaigns`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching partner campaigns ${partnerId}:`, error);
    throw error;
  }
}

// services/marketers/marketers.ts

import { api } from "@/libs/axios";

export interface MarketerUser {
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

export interface Marketer {
  id: number;
  createdAt: string;
  updatedAt: string;
  referralCode: string;
  user: MarketerUser;
  createdBy: MarketerUser;
}

export interface MarketersResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Marketer[];
}

export interface CreateMarketerData {
  phoneNumber: string;
  email: string;
  fullName: string;
  password?: string;
  profilePhotoUrl?: string;
  nationalIdUrl?: string;
  residencyIdUrl?: string;
  referralCode?: string;
  createdById?: number;
}

export interface UpdateMarketerData {
  phoneNumber?: string;
  email?: string;
  fullName?: string;
  profilePhotoUrl?: string | null;
  nationalIdUrl?: string | null;
  residencyIdUrl?: string | null;
  isActive?: boolean;
}

// GET - Fetch all marketers with pagination and filtering
export async function getMarketers(
  params?: {
    page?: number;
    limit?: number;
    createdById?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    search?: string;
    verificationStatus?: string;
    isActive?: boolean;
    createdAt_from?: string;
    createdAt_to?: string;
  },
  signal?: AbortSignal
): Promise<MarketersResponse> {
  try {
    const response = await api.get("/marketers", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching marketers:", error);
    throw error;
  }
}

// GET - Fetch single marketer by ID
export async function getMarketerById(
  id: number,
  signal?: AbortSignal
): Promise<Marketer> {
  try {
    const response = await api.get(`/marketers/${id}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching marketer ${id}:`, error);
    throw error;
  }
}

// POST - Create new marketer
export async function createMarketer(
  data: CreateMarketerData,
  signal?: AbortSignal
): Promise<Marketer> {
  try {
    const response = await api.post("/marketers", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating marketer:", error);
    throw error;
  }
}

// PATCH - Update marketer
export async function updateMarketer(
  id: number,
  data: UpdateMarketerData,
  signal?: AbortSignal
): Promise<Marketer> {
  try {
    const response = await api.patch(`/marketers/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating marketer ${id}:`, error);
    throw error;
  }
}

// POST - Update marketer status
export async function updateMarketerStatus(
  id: number,
  isActive: boolean,
  signal?: AbortSignal
): Promise<Marketer> {
  try {
    const response = await api.post(
      `/marketers/${id}/status`,
      { isActive },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating marketer status ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete marketer
export async function deleteMarketer(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/marketers/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting marketer ${id}:`, error);
    throw error;
  }
}

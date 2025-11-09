// services/propertySubmissions/propertySubmissions.ts

import { api } from "@/libs/axios";

export interface PropertySubmissionsResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Array<{
    id: number;
    createdAt: string;
    updatedAt: string;
    relationshipType: string;
    location: string;
    specifications: {
      bedrooms: number;
    };
    askingPrice: string;
    authorizationDocUrl: string;
    status: string;
    owner: {
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
    };
    propertyType: {
      id: number;
      createdAt: string;
      updatedAt: string;
      name: string;
      isActive: boolean;
    };
    attachments: Array<{
      id: number;
      createdAt: string;
      updatedAt: string;
      attachmentUrl: string;
    }>;
    updatedBy: any;
  }>;
}

export interface CreatePropertySubmissionData {
  relationshipType: string;
  location: string;
  specifications: {
    bedrooms: number;
    bathrooms?: number;
    area?: number;
    // Add other specification fields as needed
  };
  askingPrice: string;
  authorizationDocUrl: string;
  propertyTypeId: number;
  attachments?: Array<{
    attachmentUrl: string;
    // Add other attachment fields as needed
  }>;
  ownerId?: number;
}

export interface UpdatePropertySubmissionData {
  relationshipType?: string;
  location?: string;
  specifications?: {
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    // Add other specification fields as needed
  };
  askingPrice?: string;
  authorizationDocUrl?: string;
  propertyTypeId?: number;
  status?: string;
  attachments?: Array<{
    attachmentUrl: string;
    // Add other attachment fields as needed
  }>;
}

// GET - Fetch property submissions
export async function getPropertySubmissions(
  params?: Record<string, string>,
  signal?: AbortSignal
) {
  try {
    const response = await api.get("/property-listing-requests", {
      params,
      signal,
    });

    // Based on your API response structure, adjust this if needed
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching property submissions:", error);
    throw error;
  }
}

// GET - Fetch single property submission by ID
export async function getPropertySubmission(id: number, signal?: AbortSignal) {
  try {
    const response = await api.get(`/property-listing-requests/${id}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching property submission ${id}:`, error);
    throw error;
  }
}

// POST - Create new property submission
export async function createPropertySubmission(
  data: CreatePropertySubmissionData,
  signal?: AbortSignal
) {
  try {
    const response = await api.post("/property-listing-requests", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating property submission:", error);
    throw error;
  }
}

// PATCH - Update property submission
export async function updatePropertySubmission(
  id: number,
  data: UpdatePropertySubmissionData,
  signal?: AbortSignal
) {
  try {
    const response = await api.patch(`/property-listing-requests/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating property submission ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete property submission
export async function deletePropertySubmission(
  id: number,
  signal?: AbortSignal
) {
  try {
    const response = await api.delete(`/property-listing-requests/${id}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error deleting property submission ${id}:`, error);
    throw error;
  }
}

// POST - Publish property submission
export async function publishPropertySubmission(
  id: number,
  signal?: AbortSignal
) {
  try {
    const response = await api.post(
      `/property-listing-requests/${id}/publish`,
      {}, // Empty body since it's just an action
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error publishing property submission ${id}:`, error);
    throw error;
  }
}

// POST - Approve property submission
export async function approvePropertySubmission(
  id: number,
  signal?: AbortSignal
) {
  try {
    const response = await api.post(
      `/property-listing-requests/${id}/approve`,
      {}, // Empty body since it's just an action
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error approving property submission ${id}:`, error);
    throw error;
  }
}

// POST - Reject property submission
export async function rejectPropertySubmission(
  id: number,
  signal?: AbortSignal
) {
  try {
    const response = await api.post(
      `/property-listing-requests/${id}/reject`,
      {}, // Empty body since it's just an action
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error rejecting property submission ${id}:`, error);
    throw error;
  }
}

// DELETE - Remove attachment from property submission
export async function removePropertySubmissionAttachment(
  id: number,
  attachmentId: number,
  signal?: AbortSignal
) {
  try {
    const response = await api.delete(
      `/property-listing-requests/${id}/attachments/${attachmentId}`,
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error removing attachment from property submission ${id}:`,
      error
    );
    throw error;
  }
}

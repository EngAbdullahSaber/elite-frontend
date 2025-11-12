// services/contact/contact.ts

import { api } from "@/libs/axios";

export interface ContactMessage {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  message: string;
  phoneNumber?: string | null;
  subject?: string | null;
  propertyId?: number | null;
  status: "pending" | "read" | "replied" | "resolved";
  priority: "low" | "medium" | "high";
  response?: string | null;
  respondedAt?: string | null;
  respondedBy?: number | null;
  source: "website" | "mobile_app" | "api";
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface CreateContactData {
  name: string;
  email: string;
  message: string;
  phoneNumber?: string | null;
  subject?: string | null;
  propertyId?: number | null;
  priority?: "low" | "medium" | "high";
  source?: "website" | "mobile_app" | "api";
}

export interface UpdateContactData {
  status?: "pending" | "read" | "replied" | "resolved";
  priority?: "low" | "medium" | "high";
  response?: string | null;
  respondedBy?: number | null;
}

export interface ContactFilterParams {
  page?: number;
  limit?: number;
  status?: "pending" | "read" | "replied" | "resolved";
  priority?: "low" | "medium" | "high";
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  propertyId?: number;
  source?: "website" | "mobile_app" | "api";
}

export interface ContactStats {
  totalMessages: number;
  pendingMessages: number;
  readMessages: number;
  repliedMessages: number;
  resolvedMessages: number;
  highPriorityMessages: number;
  averageResponseTime: number; // in hours
  messagesThisMonth: number;
  messagesLastMonth: number;
}

export interface ContactResponse {
  records: ContactMessage[];
  total_records: number;
  current_page: number;
  per_page: number;
  total_pages: number;
}

// GET - Fetch all contact messages with pagination and filtering
export async function getContactMessages(
  params: ContactFilterParams = {},
  signal?: AbortSignal
): Promise<ContactResponse> {
  try {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.status) queryParams.append("status", params.status);
    if (params.priority) queryParams.append("priority", params.priority);
    if (params.search) queryParams.append("search", params.search);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.propertyId)
      queryParams.append("propertyId", params.propertyId.toString());
    if (params.source) queryParams.append("source", params.source);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const url = `/contact-us${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url, { signal });

    // Handle different response structures
    const responseData = response.data.data || response.data;

    return {
      records:
        responseData.records ||
        responseData.data ||
        responseData.messages ||
        [],
      total_records:
        responseData.total_records ||
        responseData.totalCount ||
        responseData.total ||
        0,
      current_page:
        responseData.current_page ||
        responseData.currentPage ||
        params.page ||
        1,
      per_page:
        responseData.per_page || responseData.perPage || params.limit || 10,
      total_pages:
        responseData.total_pages ||
        responseData.totalPages ||
        Math.ceil((responseData.total_records || 0) / (params.limit || 10)),
    };
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    throw error;
  }
}

// GET - Fetch single contact message by ID
export async function getContactMessageById(
  id: number,
  signal?: AbortSignal
): Promise<ContactMessage> {
  try {
    const response = await api.get(`/contact-us/${id}`, {
      signal,
    });

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error(`Error fetching contact message ${id}:`, error);
    throw error;
  }
}

// POST - Create new contact message
export async function createContactMessage(
  data: CreateContactData,
  signal?: AbortSignal
): Promise<ContactMessage> {
  try {
    const response = await api.post("/contact-us", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating contact message:", error);
    throw error;
  }
}

// PATCH - Update contact message (admin only)
export async function updateContactMessage(
  id: number,
  data: UpdateContactData,
  signal?: AbortSignal
): Promise<ContactMessage> {
  try {
    const response = await api.patch(`/contact-us/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating contact message ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete contact message (admin only)
export async function deleteContactMessage(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/contact-us/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting contact message ${id}:`, error);
    throw error;
  }
}

// PATCH - Update contact message status
export async function updateContactStatus(
  id: number,
  status: "pending" | "read" | "replied" | "resolved",
  signal?: AbortSignal
): Promise<ContactMessage> {
  try {
    const response = await api.patch(
      `/contact-us/${id}/status`,
      { status },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating contact message ${id} status:`, error);
    throw error;
  }
}

// PATCH - Respond to contact message
export async function respondToContactMessage(
  id: number,
  response: string,
  respondedBy: number,
  signal?: AbortSignal
): Promise<ContactMessage> {
  try {
    const responseData = await api.patch(
      `/contact-us/${id}/respond`,
      { response, respondedBy },
      { signal }
    );

    return responseData.data.data || responseData.data;
  } catch (error) {
    console.error(`Error responding to contact message ${id}:`, error);
    throw error;
  }
}

// GET - Get contact statistics
export async function getContactStats(
  params?: {
    startDate?: string;
    endDate?: string;
    source?: "website" | "mobile_app" | "api";
  },
  signal?: AbortSignal
): Promise<ContactStats> {
  try {
    const response = await api.get("/contact-us/stats", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching contact stats:", error);
    throw error;
  }
}

// GET - Get pending contact messages count
export async function getPendingMessagesCount(
  signal?: AbortSignal
): Promise<{ count: number }> {
  try {
    const response = await api.get("/contact-us/pending/count", {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching pending messages count:", error);
    throw error;
  }
}

// GET - Get contact messages by property
export async function getContactMessagesByProperty(
  propertyId: number,
  params?: {
    page?: number;
    limit?: number;
    status?: "pending" | "read" | "replied" | "resolved";
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<ContactResponse> {
  try {
    const response = await api.get(`/contact-us/property/${propertyId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error fetching contact messages for property ${propertyId}:`,
      error
    );
    throw error;
  }
}

// GET - Search contact messages
export async function searchContactMessages(
  query: string,
  params?: {
    page?: number;
    limit?: number;
    status?: "pending" | "read" | "replied" | "resolved";
    priority?: "low" | "medium" | "high";
  },
  signal?: AbortSignal
): Promise<ContactResponse> {
  try {
    const response = await api.get("/contact-us/search", {
      params: {
        search: query,
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error searching contact messages:", error);
    throw error;
  }
}

// POST - Bulk update contact messages status
export async function bulkUpdateContactStatus(
  ids: number[],
  status: "pending" | "read" | "replied" | "resolved",
  signal?: AbortSignal
): Promise<{ updated: number }> {
  try {
    const response = await api.post(
      "/contact-us/bulk/status",
      { ids, status },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error bulk updating contact messages status:", error);
    throw error;
  }
}

// GET - Export contact messages
export async function exportContactMessages(
  params?: {
    startDate?: string;
    endDate?: string;
    status?: "pending" | "read" | "replied" | "resolved";
    format?: "csv" | "excel" | "json";
  },
  signal?: AbortSignal
): Promise<Blob> {
  try {
    const response = await api.get("/contact-us/export", {
      params,
      responseType: "blob",
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error exporting contact messages:", error);
    throw error;
  }
}

// Utility function for creating a simple contact message (for frontend use)
export async function submitContactForm(
  name: string,
  email: string,
  message: string,
  options?: {
    phoneNumber?: string;
    subject?: string;
    propertyId?: number;
    source?: "website" | "mobile_app" | "api";
  }
): Promise<ContactMessage> {
  const contactData: CreateContactData = {
    name,
    email,
    message,
    phoneNumber: options?.phoneNumber || null,
    subject: options?.subject || null,
    propertyId: options?.propertyId || null,
    source: options?.source || "website",
    priority: "medium",
  };

  return createContactMessage(contactData);
}

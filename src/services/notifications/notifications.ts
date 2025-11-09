// services/notifications/notifications.ts

import { api } from "@/libs/axios";

export interface Notification {
  id: number;
  createdAt: string;
  updatedAt: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId: number | null;
  channel: NotificationChannel;
  status: NotificationStatus;
  scheduledFor: string | null;
  sentAt: string | null;
  readAt?: string | null;
}

export type NotificationType =
  | "campaign"
  | "property"
  | "system"
  | "message"
  | "alert"
  | "approval"
  | "reminder"
  | string;

export type NotificationChannel = "in_app" | "email" | "sms" | "push" | string;

export type NotificationStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "cancelled";

export interface NotificationsResponse {
  records: Notification[];
  total_records: number;
  current_page: number;
  per_page: number;
  total_pages: number;
}

export interface NotificationFilterParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  channel?: NotificationChannel;
  status?: NotificationStatus;
  read?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "scheduledFor" | "sentAt";
  sortOrder?: "ASC" | "DESC";
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: Record<NotificationType, number>;
  byChannel: Record<NotificationChannel, number>;
  byStatus: Record<NotificationStatus, number>;
}

export interface MarkAsReadPayload {
  notificationIds?: number[];
  all?: boolean;
  read?: boolean;
}

export interface CreateNotificationData {
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: number | null;
  channel: NotificationChannel;
  scheduledFor?: string | null;
  metadata?: Record<string, any>;
  userIds?: number[];
  userGroups?: string[];
}

export interface UpdateNotificationData {
  type?: NotificationType;
  title?: string;
  message?: string;
  relatedId?: number | null;
  channel?: NotificationChannel;
  status?: NotificationStatus;
  scheduledFor?: string | null;
  metadata?: Record<string, any>;
}

// GET - Fetch logged-in user's notifications with pagination and filtering
export async function getAllsNotifications(
  params: NotificationFilterParams = {},
  signal?: AbortSignal
): Promise<NotificationsResponse> {
  try {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.type) queryParams.append("type", params.type);
    if (params.channel) queryParams.append("channel", params.channel);
    if (params.status) queryParams.append("status", params.status);
    if (params.read !== undefined)
      queryParams.append("read", params.read.toString());
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const url = `/notifications${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url, { signal });

    // Directly return the response as it matches your API structure
    return response.data;
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    throw error;
  }
}


// GET - Fetch logged-in user's notifications with pagination and filtering
export async function getMyNotifications(
  params: NotificationFilterParams = {},
  signal?: AbortSignal
): Promise<NotificationsResponse> {
  try {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.type) queryParams.append("type", params.type);
    if (params.channel) queryParams.append("channel", params.channel);
    if (params.status) queryParams.append("status", params.status);
    if (params.read !== undefined)
      queryParams.append("read", params.read.toString());
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const url = `/notifications/my${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url, { signal });

    // Directly return the response as it matches your API structure
    return response.data;
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    throw error;
  }
}

// GET - Fetch single notification by ID for logged-in user
export async function getMyNotificationById(
  id: number,
  signal?: AbortSignal
): Promise<Notification> {
  try {
    const response = await api.get(`/notifications/my/${id}`, {
      signal,
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching user notification ${id}:`, error);
    throw error;
  }
}

// GET - Get logged-in user's notification statistics
export async function getMyNotificationStats(
  params?: {
    startDate?: string;
    endDate?: string;
    type?: NotificationType;
    channel?: NotificationChannel;
  },
  signal?: AbortSignal
): Promise<NotificationStats> {
  try {
    const response = await api.get("/notifications/my/stats", {
      params,
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user notification stats:", error);
    throw error;
  }
}

// GET - Get logged-in user's unread notifications count
export async function getMyUnreadCount(
  signal?: AbortSignal
): Promise<{ count: number }> {
  try {
    const response = await api.get("/notifications/my/unread-count", {
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user unread count:", error);
    throw error;
  }
}

// PATCH - Mark logged-in user's notifications as read/unread
export async function markMyNotificationsAsRead(
  data: MarkAsReadPayload,
  signal?: AbortSignal
): Promise<{ updated: number }> {
  try {
    const response = await api.patch("/notifications/mark-all-read", data, {
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error marking user notifications as read:", error);
    throw error;
  }
}

// PATCH - Mark single notification as read for logged-in user
export async function markMyNotificationAsRead(
  id: number,
  signal?: AbortSignal
): Promise<Notification> {
  try {
    const response = await api.post(
      `/notifications/${id}/mark-read`,
      {},
      {
        signal,
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error marking user notification ${id} as read:`, error);
    throw error;
  }
}

// DELETE - Delete single notification for logged-in user
export async function deleteMyNotification(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/notifications/my/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting user notification ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete all logged-in user's notifications
export async function deleteAllMyNotifications(
  signal?: AbortSignal
): Promise<{ deleted: number }> {
  try {
    const response = await api.delete("/notifications/my/all", {
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting all user notifications:", error);
    throw error;
  }
}

// DELETE - Delete read notifications for logged-in user
export async function deleteMyReadNotifications(
  signal?: AbortSignal
): Promise<{ deleted: number }> {
  try {
    const response = await api.delete("/notifications/my/read", {
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting user read notifications:", error);
    throw error;
  }
}

// GET - Get logged-in user's notifications by type
export async function getMyNotificationsByType(
  type: NotificationType,
  params?: {
    page?: number;
    limit?: number;
    read?: boolean;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<NotificationsResponse> {
  try {
    const response = await api.get(`/notifications/my/type/${type}`, {
      params,
      signal,
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching user notifications by type ${type}:`, error);
    throw error;
  }
}

// GET - Search logged-in user's notifications
export async function searchMyNotifications(
  query: string,
  params?: {
    page?: number;
    limit?: number;
    type?: NotificationType;
    channel?: NotificationChannel;
  },
  signal?: AbortSignal
): Promise<NotificationsResponse> {
  try {
    const response = await api.get("/notifications/my/search", {
      params: {
        search: query,
        ...params,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error searching user notifications:", error);
    throw error;
  }
}

// Admin functions (if user has admin privileges)
// POST - Create new notification (admin only)
export async function createNotification(
  data: CreateNotificationData,
  signal?: AbortSignal
): Promise<Notification> {
  try {
    const response = await api.post("/notifications", data, {
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// PATCH - Update notification (admin only)
export async function updateNotification(
  id: number,
  data: UpdateNotificationData,
  signal?: AbortSignal
): Promise<Notification> {
  try {
    const response = await api.patch(`/notifications/${id}`, data, {
      signal,
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating notification ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete notification (admin only)
export async function deleteNotification(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/notifications/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting notification ${id}:`, error);
    throw error;
  }
}

// GET - Get all notifications (admin only)
export async function getAllNotifications(
  params: NotificationFilterParams & { userId?: number },
  signal?: AbortSignal
): Promise<NotificationsResponse> {
  try {
    const response = await api.get("/notifications", {
      params,
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching all notifications:", error);
    throw error;
  }
}

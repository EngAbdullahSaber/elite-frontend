"use client";

import React, { useState, useEffect } from "react";
import { Empty } from "@/components/shared/Empty";
import NotificationCard from "@/components/shared/NotificationCard";
import {
  getMyNotifications,
  markMyNotificationAsRead,
} from "@/services/notifications/notifications";
import {
  Notification,
  NotificationType as ApiNotificationType,
} from "@/services/notifications/notifications";
import { NotificationType as CardNotificationType } from "@/types/global";

// Map API notification types to card notification types
const mapNotificationType = (
  apiType: ApiNotificationType
): CardNotificationType => {
  const typeMap: Record<string, CardNotificationType> = {
    campaign: "info",
    property: "info",
    system: "info",
    message: "info",
    alert: "warn",
    approval: "warn",
    reminder: "info",
    error: "error",
    success: "done",
  };

  return typeMap[apiType] || "info";
};

// Map API status to read state
const isNotificationRead = (
  status: string,
  readAt: string | null | undefined
): boolean => {
  return status === "read" || !!readAt;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMyNotifications({
        page: 1,
        limit: 50, // Fetch more notifications to display
        sortBy: "createdAt",
        sortOrder: "DESC", // Show newest first
      });

      setNotifications(response.records || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("فشل في تحميل الإشعارات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markMyNotificationAsRead(notificationId);

      // Update local state to mark as read
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                status: "read" as any,
                readAt: new Date().toISOString(),
              }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleClose = async (notificationId: number) => {
    // Mark as read when closing
    await handleMarkAsRead(notificationId);

    // Remove from local state
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const handleCloseAll = async () => {
    // Mark all as read and clear
    try {
      const unreadNotifications = notifications.filter(
        (notification) =>
          !isNotificationRead(notification.status, notification.readAt)
      );

      // Mark all unread notifications as read
      for (const notification of unreadNotifications) {
        try {
          await markMyNotificationAsRead(notification.id);
        } catch (err) {
          console.error(
            `Failed to mark notification ${notification.id} as read:`,
            err
          );
        }
      }

      // Clear all notifications from local state
      setNotifications([]);
    } catch (err) {
      console.error("Failed to close all notifications:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-4 h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Empty
        className="mt-[20%]"
        header="حدث خطأ"
        description={error}
        action={{
          label: "إعادة المحاولة",
          onClick: fetchNotifications,
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {notifications.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            الإشعارات ({notifications.length})
          </h2>
          <button
            onClick={handleCloseAll}
            className="text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            مسح الكل
          </button>
        </div>
      )}

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              type={mapNotificationType(notification.type)}
              title={notification.title}
              description={notification.message}
              timestamp={new Date(notification.createdAt)}
              isRead={isNotificationRead(
                notification.status,
                notification.readAt
              )}
              onClose={() => handleClose(notification.id)}
              onMarkAsRead={() => handleMarkAsRead(notification.id)}
            />
          ))}
        </div>
      ) : (
        <Empty
          className="mt-[20%]"
          header="لا توجد إشعارات"
          description="لم يتم العثور على أي إشعارات جديدة في الوقت الحالي. يرجى التحقق لاحقاً."
        />
      )}
    </div>
  );
}

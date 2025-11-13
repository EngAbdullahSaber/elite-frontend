"use client";
import {
  FaCalendarAlt,
  FaUser,
  FaUserTie,
  FaClock,
  FaBellSlash,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { getAllsNotifications } from "@/services/notifications/notifications";

interface AppointmentNotification {
  id: string;
  clientName: string;
  agentName?: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  appointmentDate: string;
  updatedAt: string;
  appointmentNumber: string;
}

interface NotificationsCardProps {
  notifications?: AppointmentNotification[]; // Optional predefined notifications
  limit?: number; // Number of notifications to show
  showAgentName?: boolean; // Whether to show agent name column
}

// API Response Types
interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  status: string;
  channel: string;
  createdAt: string;
  updatedAt: string;
  relatedId?: number;
  user?: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    userType: string;
  };
}

interface NotificationsResponse {
  data: Notification[];
  total: number;
}

const getStatusText = (status: string) => {
  switch (status) {
    case "confirmed":
      return "مؤكد";
    case "pending":
      return "قيد الانتظار";
    case "cancelled":
      return "ملغي";
    case "completed":
      return "مكتمل";
    default:
      return "غير محدد";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "text-green-600 bg-green-50";
    case "pending":
      return "text-yellow-600 bg-yellow-50";
    case "cancelled":
      return "text-red-600 bg-red-50";
    case "completed":
      return "text-blue-600 bg-blue-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

// Extract appointment status from notification message
const extractAppointmentStatus = (message: string): string => {
  if (message.includes("مؤكد") || message.includes("confirmed"))
    return "confirmed";
  if (message.includes("قيد الانتظار") || message.includes("pending"))
    return "pending";
  if (message.includes("ملغي") || message.includes("cancelled"))
    return "cancelled";
  if (message.includes("مكتمل") || message.includes("completed"))
    return "completed";
  return "pending";
};

// Extract client name from notification message
const extractClientName = (message: string): string => {
  // Try to extract name from Arabic messages
  const arabicNameMatch =
    message.match(/العميل:\s*([^,\n.]+)/) ||
    message.match(/العميل\s*([^,\n.]+)/) ||
    message.match(/مع\s*([^,\n.]+)/);
  if (arabicNameMatch) return arabicNameMatch[1].trim();

  // Try to extract name from English messages
  const englishNameMatch =
    message.match(/client:\s*([^,\n.]+)/i) ||
    message.match(/with\s*([^,\n.]+)/i);
  if (englishNameMatch) return englishNameMatch[1].trim();

  return "عميل";
};

// Extract agent name from notification message
const extractAgentName = (message: string): string => {
  const arabicMatch =
    message.match(/الوسيط:\s*([^,\n.]+)/) ||
    message.match(/الوسيط\s*([^,\n.]+)/);
  if (arabicMatch) return arabicMatch[1].trim();

  const englishMatch = message.match(/agent:\s*([^,\n.]+)/i);
  if (englishMatch) return englishMatch[1].trim();

  return "";
};

// Extract appointment date from notification message
const extractAppointmentDate = (message: string): string => {
  const dateMatch =
    message.match(/\d{4}-\d{2}-\d{2}/) ||
    message.match(/\d{2}\/\d{2}\/\d{4}/) ||
    message.match(/\d{2}-\d{2}-\d{4}/);

  if (dateMatch) return dateMatch[0];

  // Fallback to today's date
  return new Date().toISOString().split("T")[0];
};

export default function NotificationsCard({
  notifications: propNotifications,
  limit = 6,
  showAgentName = true,
}: NotificationsCardProps) {
  const [notifications, setNotifications] = useState<AppointmentNotification[]>(
    []
  );
  const [loading, setLoading] = useState(!propNotifications);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Otherwise, fetch from API
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
 
        const response = await getAllsNotifications({
          limit: limit,
          type: "appointment_reminder", // Filter by appointment reminders only
          page: 1,
          sortBy: "createdAt",
          sortOrder: "DESC",
        });

 
        // Transform API notifications to our component format
        const transformedNotifications = transformApiNotifications(
          response.records || []
        );
 
        setNotifications(transformedNotifications);
      } catch (err: any) {
        console.error("Error fetching notifications:", err);
        setError(err.message || "فشل في تحميل الإشعارات");
        // Set empty array instead of default data
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [propNotifications, limit, showAgentName]);

  // Transform API notifications to component format
  const transformApiNotifications = (
    apiNotifications: Notification[]
  ): AppointmentNotification[] => {
    if (!apiNotifications || apiNotifications.length === 0) {
      return [];
    }

    return apiNotifications.map((notification, index) => {
      const status = extractAppointmentStatus(notification.message);
      const clientName = extractClientName(notification.message);
      const agentName = extractAgentName(notification.message);
      const appointmentDate = extractAppointmentDate(notification.message);

      return {
        id: notification.id.toString(),
        clientName: clientName,
        agentName: showAgentName ? agentName : undefined,
        status: status as any,
        appointmentDate: appointmentDate,
        updatedAt: new Date(notification.updatedAt).toLocaleDateString("ar-SA"),
        appointmentNumber: `APT-${notification.relatedId || notification.id}`,
      };
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-3 max-h-[900px] overflow-y-auto">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-xl border border-gray-200 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                </div>
                {showAgentName && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                    <div className="h-3 bg-gray-300 rounded w-20"></div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="h-3 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FaBellSlash className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500">لا توجد إشعارات</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[900px] overflow-y-auto">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          {/* Header with appointment number and status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-gray-800">
                موعد #{notification.appointmentNumber}
              </span>
            </div>
            <div
              className={`px-3 py-1 w-fit rounded-full text-xs font-medium ${getStatusColor(
                notification.status
              )}`}
            >
              {getStatusText(notification.status)}
            </div>
          </div>

          {/* Main content with left and right sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left side - Client and Agent info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaUser className="w-3 h-3 text-gray-500" />
                <span className="text-sm text-gray-600">العميل:</span>
                <span className="text-sm font-medium text-gray-800">
                  {notification.clientName}
                </span>
              </div>

              {notification.agentName && showAgentName && (
                <div className="flex items-center gap-2">
                  <FaUserTie className="w-3 h-3 text-gray-500" />
                  <span className="text-sm text-gray-600">الوسيط:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {notification.agentName}
                  </span>
                </div>
              )}
            </div>

            {/* Right side - Date and update info */}
            <div className="flex flex-col gap-3 justify-start">
              <div className="flex items-center gap-2 md:justify-end">
                <FaClock className="w-3 h-3 text-gray-500" />
                <span className="text-sm text-gray-600">تاريخ الموعد:</span>
                <span className="text-sm font-medium text-gray-800">
                  {notification.appointmentDate}
                </span>
              </div>

              <div className="flex items-center gap-2 md:justify-end">
                <span className="text-xs text-gray-500">
                  تاريخ التحديث: {notification.updatedAt}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Show error message but still display data */}
      {error && (
        <div className="text-center text-yellow-600 text-sm bg-yellow-50 p-2 rounded">
          {error} - يتم عرض البيانات المتاحة
        </div>
      )}
    </div>
  );
}

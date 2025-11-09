// components/shared/NotificationCard.tsx (updated version)

import React from "react";
import { NotificationType } from "@/types/global";

interface NotificationCardProps {
  type: NotificationType;
  title: string;
  description: string;
  timestamp?: Date;
  isRead?: boolean;
  onClose: () => void;
  onMarkAsRead?: () => void;
}

export default function NotificationCard({
  type,
  title,
  description,
  timestamp,
  isRead = false,
  onClose,
  onMarkAsRead,
}: NotificationCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case "info":
        return "bg-blue-50 border-blue-200";
      case "done":
        return "bg-green-50 border-green-200";
      case "warn":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case "info":
        return "💡";
      case "done":
        return "✅";
      case "warn":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "📢";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat("ar-EG", { numeric: "auto" }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 ${getTypeStyles()} ${
        isRead ? "opacity-70" : "opacity-100"
      } transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <div className="text-2xl mt-1">{getTypeIcon()}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
              {!isRead && (
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              )}
            </div>
            <p className="text-gray-600 mt-1 text-sm leading-relaxed">
              {description}
            </p>
            {timestamp && (
              <p className="text-gray-400 text-xs mt-2">
                {formatDate(timestamp)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isRead && onMarkAsRead && (
            <button
              onClick={onMarkAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              تعليم كمقروء
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

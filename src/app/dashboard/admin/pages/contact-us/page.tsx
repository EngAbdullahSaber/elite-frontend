"use client";

import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import CenteredContainer from "@/components/shared/CenteredContainer";
import { useState, useEffect } from "react";
import {
  getContactMessages,
  deleteContactMessage,
} from "@/services/contactUs/contactUs";
import {
  ContactMessage,
  ContactFilterParams,
} from "@/services/contactUs/contactUs";
import toast from "react-hot-toast";
import Card from "@/components/shared/Card";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_records: 0,
  });
  const [filters, setFilters] = useState<ContactFilterParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  // Fetch contact messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getContactMessages(filters);

      setMessages(response.records);
      setPagination({
        current_page: response.current_page,
        per_page: response.per_page,
        total_pages: response.total_pages,
        total_records: response.total_records,
      });
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      toast.error("فشل في تحميل الرسائل");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filters]);

  // Handle delete message
  const handleDeleteMessage = async (id: number) => {
    try {
      setDeleteLoading(id);
      await deleteContactMessage(id);

      toast.success("تم حذف الرسالة بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });

      // Refresh messages
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("فشل في حذف الرسالة");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Handle filter change
  const handleFilterChange = (key: keyof ContactFilterParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "read":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "replied":
        return "bg-green-100 text-green-800 border-green-200";
      case "resolved":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div>
        <DashboardHeaderTitle path={["إعدادات", "رسائل اتصل بنا"]} />
        <CenteredContainer className="space-y-6">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-gray-600">جاري تحميل الرسائل...</div>
            </div>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeaderTitle path={["إعدادات", "رسائل اتصل بنا"]} />

      <CenteredContainer className="space-y-6">
        {/* Filters */}
        <Card title="الفلاتر والبحث">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البحث
              </label>
              <input
                type="text"
                value={filters.search || ""}
                onChange={(e) =>
                  handleFilterChange("search", e.target.value || undefined)
                }
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Card className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {pagination.total_records}
              </div>
              <div className="text-gray-600">إجمالي الرسائل</div>
            </Card>
          </div>
        </Card>

        {/* Messages List */}
        <Card title={`رسائل اتصل بنا (${pagination.total_records})`}>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد رسائل لعرضها
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            message.status
                          )}`}
                        >
                          {message.status === "pending" && "معلقة"}
                          {message.status === "read" && "مقروءة"}
                          {message.status === "replied" && "تم الرد"}
                          {message.status === "resolved" && "مكتملة"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                            message.priority
                          )}`}
                        >
                          {message.priority === "high" && "عالية"}
                          {message.priority === "medium" && "متوسطة"}
                          {message.priority === "low" && "منخفضة"}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                          {message.source === "website" && "الموقع"}
                          {message.source === "mobile_app" && "التطبيق"}
                          {message.source === "api" && "API"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {message.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {message.email}
                          </p>
                          {message.phoneNumber && (
                            <p className="text-sm text-gray-600">
                              {message.phoneNumber}
                            </p>
                          )}
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-sm text-gray-500">
                            {formatDate(message.createdAt)}
                          </p>
                          {message.subject && (
                            <p className="text-sm font-medium text-gray-700 mt-1">
                              {message.subject}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>

                      {message.response && (
                        <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200">
                          <p className="text-sm font-medium text-green-800 mb-1">
                            الرد:
                          </p>
                          <p className="text-green-700 whitespace-pre-wrap">
                            {message.response}
                          </p>
                          {message.respondedAt && (
                            <p className="text-xs text-green-600 mt-2">
                              تم الرد في: {formatDate(message.respondedAt)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 lg:w-auto">
                      <SoftActionButton
                        onClick={() => handleDeleteMessage(message.id)}
                        disabled={deleteLoading === message.id}
                        className="text-sm py-2 text-red-600 border-red-200 hover:bg-red-500"
                      >
                        {deleteLoading === message.id ? "جاري الحذف..." : "حذف"}
                      </SoftActionButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                السابق
              </button>

              {Array.from(
                { length: pagination.total_pages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 border rounded-lg ${
                    pagination.current_page === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                التالي
              </button>
            </div>
          )}
        </Card>
      </CenteredContainer>
    </div>
  );
}

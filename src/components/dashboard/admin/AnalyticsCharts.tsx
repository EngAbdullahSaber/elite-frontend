// components/dashboard/admin/AnalyticsCharts.tsx
"use client";
import { AdminDashboardResponse } from "@/services/dashboard/dashboard";

interface AnalyticsChartsProps {
  data?: AdminDashboardResponse;
  loading?: boolean;
}

export default function AnalyticsCharts({
  data,
  loading = false,
}: AnalyticsChartsProps) {
  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded-lg p-6 h-80"></div>
    );
  }

  const financialStats = data?.overview.financialStats.totalRevenue;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold mb-4">تحليلات التحويل</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">
            {financialStats?.totalVisitors || 0}
          </p>
          <p className="text-gray-600">إجمالي الزوار</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">
            {financialStats?.totalConversions || 0}
          </p>
          <p className="text-gray-600">إجمالي التحويلات</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">
            {financialStats?.conversionRate || "0%"}
          </p>
          <p className="text-gray-600">معدل التحويل</p>
        </div>
      </div>
    </div>
  );
}

export function VisitsAnalyticsCharts({
  data,
  loading = false,
}: AnalyticsChartsProps) {
  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded-lg p-6 h-80"></div>
    );
  }

  // You can add more detailed charts here using charting libraries
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold mb-4">
        تحليلات الزيارات والتسجيلات
      </h3>
      <div className="text-center p-8">
        <p className="text-gray-600">
          سيتم إضافة الرسوم البيانية التفصيلية هنا قريباً
        </p>
      </div>
    </div>
  );
}

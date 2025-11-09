// app/dashboard/admin/page.tsx
"use client";
import { useState, useEffect } from "react";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import Card from "@/components/shared/Card";
import StatisticsCards from "@/components/dashboard/admin/StatisticsCards";
import AppointmentStatusCards from "@/components/dashboard/admin/AppointmentStatusCards";
import AnalyticsCharts, {
  VisitsAnalyticsCharts,
} from "@/components/dashboard/admin/AnalyticsCharts";
import AgentPerformanceCard from "@/components/dashboard/admin/AgentPerformanceCard";
import AverageRatingsCard, {
  defaultRatings,
} from "@/components/dashboard/admin/AverageRatingsCard";
import NotificationsCard from "@/components/dashboard/admin/NotificationsCard";
import {
  EnhancedDashboardData,
  getEnhancedAdminDashboard,
} from "@/services/dashboard/dashboard";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] =
    useState<EnhancedDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEnhancedAdminDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("فشل في تحميل بيانات لوحة التحكم. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mock data for agents (you might want to replace this with real API data)
  const agents = [
    {
      id: "3",
      name: "محمد علي",
      image: "/users/user-3.webp",
      totalAppointments: dashboardData?.overview.appointmentStats
        .totalAppointments
        ? Math.round(
            dashboardData.overview.appointmentStats.totalAppointments * 0.3
          )
        : 30,
      completedAppointments: dashboardData?.overview.appointmentStats
        .completedAppointments
        ? Math.round(
            dashboardData.overview.appointmentStats.completedAppointments * 0.3
          )
        : 28,
    },
    {
      id: "2",
      name: "فاطمة أحمد",
      image: "/users/user-2.webp",
      totalAppointments: dashboardData?.overview.appointmentStats
        .totalAppointments
        ? Math.round(
            dashboardData.overview.appointmentStats.totalAppointments * 0.2
          )
        : 18,
      completedAppointments: dashboardData?.overview.appointmentStats
        .completedAppointments
        ? Math.round(
            dashboardData.overview.appointmentStats.completedAppointments * 0.2
          )
        : 15,
    },
    {
      id: "4",
      name: "سارة حسن",
      image: "/users/user-4.webp",
      totalAppointments: dashboardData?.overview.appointmentStats
        .totalAppointments
        ? Math.round(
            dashboardData.overview.appointmentStats.totalAppointments * 0.25
          )
        : 22,
      completedAppointments: dashboardData?.overview.appointmentStats
        .completedAppointments
        ? Math.round(
            dashboardData.overview.appointmentStats.completedAppointments * 0.25
          )
        : 18,
    },
    {
      id: "1",
      name: "أحمد محمد",
      image: "/users/user-1.jpg",
      totalAppointments: dashboardData?.overview.appointmentStats
        .totalAppointments
        ? Math.round(
            dashboardData.overview.appointmentStats.totalAppointments * 0.25
          )
        : 25,
      completedAppointments: dashboardData?.overview.appointmentStats
        .completedAppointments
        ? Math.round(
            dashboardData.overview.appointmentStats.completedAppointments * 0.25
          )
        : 20,
    },
  ];

  if (error) {
    return (
      <div>
        <DashboardHeaderTitle path={["لوحة المعلومات"]} />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeaderTitle path={["لوحة المعلومات"]} />
      <div className="space-y-4 lg:pace-y-6">
        {/* Statistics Cards */}
        <StatisticsCards data={dashboardData} loading={loading} />

        {/* Appointment Status Cards - You might want to update this component too */}
        <AppointmentStatusCards data={dashboardData} loading={loading} />

        {/* Analytics Charts - Orders and Projects Distribution */}
        <AnalyticsCharts data={dashboardData} loading={loading} />

        {/* Visits and Registrations Analytics */}
        <VisitsAnalyticsCharts data={dashboardData} loading={loading} />

        {/* Project Sources and Types */}
        {/* <ProjectCharts /> */}

        {/* Notifications */}
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-6">
          <Card
            title="متوسط التقييمات"
            className="xl:w-[calc(50%-12px)]"
            subTitle="حسب العملاء"
          >
            <AverageRatingsCard ratings={defaultRatings} loading={loading} />
          </Card>
          <Card
            title="أداء الوسطاء العقاريين"
            className="xl:w-[calc(50%-12px)]"
            subTitle="اخر 30 يوم"
          >
            <AgentPerformanceCard agents={agents} loading={loading} />
          </Card>
        </div>

        {/* Ratings */}
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-6">
          <div className="xl:w-[calc(50%-12px)]"></div>
        </div>

        <Card title="إشعارات المواعيد">
          <NotificationsCard loading={loading} />
        </Card>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import { TwoLineChart } from "@/components/shared/charts/TwoLineChart";
import Card from "@/components/shared/Card";
import AgentAppointmentStatusCards from "@/components/dashboard/agentRole/Schedule/charts/AgentAppointmentStatusCards";

import NotificationsCard from "@/components/dashboard/admin/NotificationsCard";
import AgentStatsCard from "@/components/dashboard/agentRole/Schedule/charts/AgentStatsCard";
import { getAgentDashboard } from "@/services/dashboard/agentDashboard";

// Define types based on your API response
interface AgentDashboardResponse {
  stats: {
    totalAppointments: number;
    totalEarnings: number;
    pendingBalance: number;
    averageRating: number;
  };
  recentPayments: any[];
  recentReviews: any[];
  recentAppointments: any[];
}

export default function AgentDashboardPage() {
  const [dashboardData, setDashboardData] =
    useState<AgentDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAgentDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching agent dashboard:", err);
        setError("فشل في تحميل بيانات لوحة التحكم");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Transform API data to match component props
  const transformStats = (stats: AgentDashboardResponse["stats"]) => ({
    totalAppointments: stats.totalAppointments,
    pendingBalance: stats.pendingBalance,
    totalEarnings: stats.totalEarnings,
    rating: stats.averageRating,
  });

  // Calculate appointment status data from recent appointments
  const calculateStatusData = (appointments: any[]) => {
    const statusCounts = {
      confirmed: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
    };

    appointments?.forEach((appointment) => {
      switch (appointment.status) {
        case "confirmed":
          statusCounts.confirmed++;
          break;
        case "in_progress":
        case "inProgress":
          statusCounts.inProgress++;
          break;
        case "completed":
          statusCounts.completed++;
          break;
        case "cancelled":
          statusCounts.cancelled++;
          break;
        default:
          break;
      }
    });

    return statusCounts;
  };

  // Calculate chart data from recent appointments
  const calculateChartData = (appointments: any[]) => {
    // Get last 6 months
    const months = ["يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    // Initialize data arrays
    const completedData = new Array(6).fill(0);
    const incompleteData = new Array(6).fill(0);

    appointments?.forEach((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const currentDate = new Date();

      // Calculate month difference
      const monthDiff =
        (currentDate.getFullYear() - appointmentDate.getFullYear()) * 12 +
        (currentDate.getMonth() - appointmentDate.getMonth());

      // Only consider appointments from last 6 months
      if (monthDiff >= 0 && monthDiff < 6) {
        const monthIndex = 5 - monthDiff; // Reverse index to show oldest first

        if (appointment.status === "completed") {
          completedData[monthIndex]++;
        } else if (
          ["cancelled", "pending", "in_progress"].includes(appointment.status)
        ) {
          incompleteData[monthIndex]++;
        }
      }
    });

    return {
      labels: months,
      completedData,
      incompleteData,
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">لا توجد بيانات متاحة</div>
      </div>
    );
  }

  const statusData = calculateStatusData(dashboardData.recentAppointments);
  const stats = transformStats(dashboardData.stats);
  const chartData = calculateChartData(dashboardData.recentAppointments);

  console.log("Dashboard Data:", dashboardData);
  console.log("Chart Data:", chartData);

  return (
    <>
      <DashboardHeaderTitle path={["لوحة الوسيط"]} />
      <div className="space-y-4 lg:pace-y-6">
        {/* 1. إحصائيات سريعة */}
        <AgentStatsCard stats={stats} />

        {/* 2. حالة المواعيد */}
        <AgentAppointmentStatusCards data={statusData} />

        {/* 3. تحليل المواعيد (آخر 6 أشهر) */}
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-6">
          <Card
            title="تحليل المواعيد"
            subTitle="آخر 6 أشهر"
            className="xl:w-[calc(100%-12px)]"
          >
            <TwoLineChart
              labels={chartData.labels}
              data1={chartData.completedData}
              data2={chartData.incompleteData}
              tooltiTitle="المواعيد"
              data1Label="مكتملة"
              data2Label="غير مكتملة"
              line1Color="#363aed"
              line2Color="#37d279"
              line1Gradient={{
                from: "rgba(54, 58, 237, 0.1)",
                to: "rgba(54, 58, 237, 0.45)",
              }}
              line2Gradient={{
                from: "rgba(55, 210, 121, 0.1)",
                to: "rgba(55, 210, 121, 0.45)",
              }}
            />
          </Card>
        </div>

        {/* 5. إشعارات الوسيط */}
        <Card title="الإشعارات" subTitle="أخر التحديثات">
          <NotificationsCard notifications={""} />
        </Card>
      </div>
    </>
  );
}

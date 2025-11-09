// components/dashboard/admin/StatisticsCards.tsx
"use client";
import Card from "@/components/shared/Card";
import CardInfo from "@/components/shared/infos/CardInfo";
import { AdminDashboardResponse } from "@/services/dashboard/dashboard";
import {
  FaCalendarAlt,
  FaProjectDiagram,
  FaUserTie,
  FaUserFriends,
} from "react-icons/fa";

interface StatisticsCardsProps {
  data?: AdminDashboardResponse;
  loading?: boolean;
}

export default function StatisticsCards({
  data,
  loading = false,
}: StatisticsCardsProps) {
  // Calculate completion rate for appointments
  const completionRate = data
    ? (data.overview.appointmentStats.completedAppointments /
        data.overview.appointmentStats.totalAppointments) *
      100
    : 0;

  // Mock property distribution (you might want to get this from API)
  const propertyDistribution = "شقق: 300 | فلل: 150 | أراضي: 50";

  // Calculate active agents percentage (mock data - you might want to get this from API)
  const activeAgentsPercentage = data
    ? Math.round(
        (data.overview.userStats.totalAgents /
          Math.max(data.overview.userStats.totalUsers, 1)) *
          100
      )
    : 80;

  // Calculate active users percentage (mock data - you might want to get this from API)
  const activeUsersPercentage = data ? 92 : 92; // You can replace this with actual data

  if (loading) {
    return (
      <Card title="إحصائيات عامة">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
            >
              <div className="animate-pulse bg-gray-200 rounded-lg p-6 h-32"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card title="إحصائيات عامة">
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        <CardInfo
          icon={
            <div className="rounded-full bg-primary p-4">
              <FaCalendarAlt className="text-white text-3xl" />
            </div>
          }
          value={data?.overview.appointmentStats.totalAppointments || 0}
          title="المواعيد"
          label={`نسبة الاكتمال ${completionRate.toFixed(0)}%`}
          className="!bg-primary-light col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
        />
        <CardInfo
          icon={
            <div className="rounded-full bg-secondary p-4">
              <FaProjectDiagram className="text-white text-3xl " />
            </div>
          }
          value={data?.overview.propertyStats.totalProperties || 0}
          title="المشاريع"
          label={propertyDistribution}
          className="!bg-secondary-light  col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
        />
        <CardInfo
          icon={
            <div className="rounded-full bg-tertiary p-4">
              <FaUserTie className="text-white text-3xl" />
            </div>
          }
          value={data?.overview.userStats.totalAgents || 0}
          title="الوسطاء العقاريين"
          label={`نشط: ${Math.round(
            data?.overview.userStats.totalAgents || 0 * 0.8
          )} (${activeAgentsPercentage}%)`}
          className="!bg-tertiary-300  col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
        />
        <CardInfo
          icon={
            <div className="rounded-full bg-primary p-4">
              <FaUserFriends className="text-white text-3xl" />
            </div>
          }
          value={data?.overview.userStats.totalUsers || 0}
          title="المستخدمين"
          label={`نشط: ${Math.round(
            (data?.overview.userStats.totalUsers || 0) * 0.92
          )} (${activeUsersPercentage}%)`}
          className="!bg-primary-light  col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
        />
      </div>
    </Card>
  );
}

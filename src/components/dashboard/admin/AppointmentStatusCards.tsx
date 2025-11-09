// components/dashboard/admin/AppointmentStatusCards.tsx
"use client";
import { AdminDashboardResponse } from "@/services/dashboard/dashboard";

interface AppointmentStatusCardsProps {
  data?: AdminDashboardResponse;
  loading?: boolean;
}

export default function AppointmentStatusCards({
  data,
  loading = false,
}: AppointmentStatusCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 rounded-lg p-6 h-24"
          ></div>
        ))}
      </div>
    );
  }

  const appointmentStats = data?.overview.appointmentStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* You can add your appointment status cards here using real data */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-800">إجمالي المواعيد</h3>
        <p className="text-2xl font-bold text-blue-600 mt-2">
          {appointmentStats?.totalAppointments || 0}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-800">
          المواعيد المكتملة
        </h3>
        <p className="text-2xl font-bold text-green-600 mt-2">
          {appointmentStats?.completedAppointments || 0}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-800">نسبة الإكتمال</h3>
        <p className="text-2xl font-bold text-purple-600 mt-2">
          {appointmentStats?.totalAppointments
            ? (
                (appointmentStats.completedAppointments /
                  appointmentStats.totalAppointments) *
                100
              ).toFixed(1) + "%"
            : "0%"}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-800">
          المواعيد المتبقية
        </h3>
        <p className="text-2xl font-bold text-orange-600 mt-2">
          {appointmentStats
            ? appointmentStats.totalAppointments -
              appointmentStats.completedAppointments
            : 0}
        </p>
      </div>
    </div>
  );
}

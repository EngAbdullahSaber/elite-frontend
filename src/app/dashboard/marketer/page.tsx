// src/app/dashboard/marketer/page.tsx
"use client";

import { VisitsAnalyticsCharts } from "@/components/dashboard/admin/AnalyticsCharts";
import NotificationsCard from "@/components/dashboard/admin/NotificationsCard";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import MarketerStatsCard from "@/components/marketerRol/charts/MarketerStatsCard";
import Card from "@/components/shared/Card";

export default function MarketerDashboardPage() {
  // Mock data — these would come from your API
  const stats = {
    visits: 3500,
    registrations: 420,
    conversions: 120,
    sources: 5,
    resultingAppointments: 48,
  };

  const visitsData = {
    visits: [1200, 1500, 1800, 1600, 2000, 2200],
    registrations: [45, 52, 68, 55, 78, 85],
    labels: ["يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
  };

  return (
    <>
      <DashboardHeaderTitle path={["لوحة المسوق"]} />
      <div className="space-y-4 lg:pace-y-6">
        {/* 1. إحصائيات المسوق */}
        <MarketerStatsCard stats={stats} />

        {/* 3. مصادر الزيارات وتحويلاتها */}
        <VisitsAnalyticsCharts visitsData={visitsData} />

        {/* 4. إشعارات المسوق */}
        <Card title="الإشعارات">
          <NotificationsCard notifications={[]} />
        </Card>
      </div>
    </>
  );
}

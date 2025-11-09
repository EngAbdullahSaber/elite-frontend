import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import { TwoLineChart } from "@/components/shared/charts/TwoLineChart";
import Card from "@/components/shared/Card";
import AgentAppointmentStatusCards from "@/components/dashboard/agentRole/Schedule/charts/AgentAppointmentStatusCards";
import AverageRatingsCard, {
  defaultRatings,
} from "@/components/dashboard/admin/AverageRatingsCard";
import NotificationsCard, {
  agetnDefaultNotifications,
} from "@/components/dashboard/admin/NotificationsCard";
import AgentStatsCard from "@/components/dashboard/agentRole/Schedule/charts/AgentStatsCard";

export default function AgentDashboardPage() {
  // هذه القيم ستأتي من API في الواقع
  const stats = {
    upcoming: 5, // مواعيد قادمة
    today: 2, // مواعيد اليوم
    earningsThisMonth: 1200, // أرباح هذا الشهر
    rating: 4.7, // متوسط التقييم
  };

  const statusData = {
    confirmed: 15,
    inProgress: 8,
    completed: 20,
    cancelled: 3,
  };

  const chartLabels = [
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  const completedData = [5, 8, 12, 10, 15, 20];
  const incompleteData = [2, 1, 3, 4, 2, 5];

  return (
    <>
      <DashboardHeaderTitle path={["لوحة الوسيط"]} />
      <div className="space-y-4 lg:pace-y-6">
        {/* 1. إحصائيات سريعة */}
        <AgentStatsCard stats={stats} />

        {/* 2. حالة المواعيد (بدون pending, assigned) */}
        <AgentAppointmentStatusCards data={statusData} />

        {/* 3. تحليل المواعيد (آخر 6 أشهر) */}

        {/* 4. متوسط التقييمات */}
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-6">
          <Card
            title="تحليل المواعيد"
            subTitle="آخر 6 أشهر"
            className="xl:w-[calc(50%-12px)]"
          >
            <TwoLineChart
              labels={chartLabels}
              data1={completedData}
              data2={incompleteData}
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
          <Card
            title="متوسط التقييم"
            subTitle="حسب تقييم العملاء"
            className="xl:w-[calc(50%-12px)]"
          >
            <AverageRatingsCard ratings={defaultRatings} />
          </Card>
        </div>
        {/* 5. إشعارات الوسيط */}
        <Card title="الإشعارات" subTitle="أخر التحديثات">
          <NotificationsCard notifications={agetnDefaultNotifications} />
        </Card>
      </div>
    </>
  );
}

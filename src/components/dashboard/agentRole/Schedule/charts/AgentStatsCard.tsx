"use client";

import Card from "@/components/shared/Card";
import CardInfo from "@/components/shared/infos/CardInfo";
import {
  FaCalendarAlt,
  FaRegCalendarCheck,
  FaWallet,
  FaStar,
} from "react-icons/fa";

export interface AgentStats {
  totalAppointments: number;
  totalEarnings: number;
  pendingBalance: number;
  averageRating: number;
}

interface AgentStatsCardProps {
  stats: AgentStats;
}

export default function AgentStatsCard({ stats }: AgentStatsCardProps) {
  console.log(stats);
  return (
    <Card title="إحصائيات الوسيط">
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        {/* إجمالي المواعيد */}
        <CardInfo
          icon={
            <div className="rounded-full bg-primary p-4">
              <FaCalendarAlt className="text-white text-3xl" />
            </div>
          }
          value={stats.totalAppointments}
          title="إجمالي المواعيد"
          className="!bg-primary-light col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
        />

        {/* أرباح إجمالية */}
        <CardInfo
          icon={
            <div className="rounded-full bg-secondary p-4">
              <FaRegCalendarCheck className="text-white text-3xl" />
            </div>
          }
          value={stats.totalEarnings}
          title="الأرباح الإجمالية"
          className="!bg-secondary-light col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
        />

        {/* الرصيد المعلق */}
        <CardInfo
          icon={
            <div className="rounded-full bg-tertiary p-4">
              <FaWallet className="text-white text-3xl" />
            </div>
          }
          value={stats.pendingBalance}
          title="الرصيد المعلق"
          className="!bg-tertiary-300 col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
        />

        {/* متوسط التقييم */}
        <CardInfo
          icon={
            <div className="rounded-full bg-primary p-4">
              <FaStar className="text-white text-3xl" />
            </div>
          }
          value={stats.averageRating?.toFixed(1)}
          title="متوسط التقييم"
          label={`${((stats.averageRating / 5) * 100)?.toFixed(0)}%`}
          className="!bg-primary-light col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
        />
      </div>
    </Card>
  );
}

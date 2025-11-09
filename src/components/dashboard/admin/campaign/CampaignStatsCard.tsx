"use client";
import Card from "@/components/shared/Card";
import CardInfo from "@/components/shared/infos/CardInfo";
import { FaUsers, FaEye, FaReply, FaCheckCircle } from "react-icons/fa";

interface CampaignStats {
  targetRecipients: number;
  actualRecipients: number;
  views: number;
  responses: number;
}

interface CampaignStatsCardProps {
  stats: CampaignStats;
}

export default function CampaignStatsCard({ stats }: CampaignStatsCardProps) {
  const statsData = [
    {
      icon: <FaUsers className="w-6 h-6 text-blue-600" />,
      label: "المستهدفون",
      value: stats.targetRecipients,
    },
    {
      icon: <FaCheckCircle className="w-6 h-6 text-green-600" />,
      label: "المستقبلون الفعليون",
      value: stats.actualRecipients,
    },
    {
      icon: <FaEye className="w-6 h-6 text-purple-600" />,
      label: "المشاهدات",
      value: stats.views,
    },
    {
      icon: <FaReply className="w-6 h-6 text-orange-600" />,
      label: "الردود",
      value: stats.responses,
    },
  ];

  return (
    <Card title="إحصائيات الحملة">
      <div className="grid grid-cols-2 2xl:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <CardInfo
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </div>
    </Card>
  );
}

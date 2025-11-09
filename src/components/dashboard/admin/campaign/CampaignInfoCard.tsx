"use client";
import Card from "@/components/shared/Card";
import { Campaign } from "@/types/campaign";
import { formatDate } from "@/utils/date";

interface CampaignInfoCardProps {
  campaign: Campaign;
}

export default function CampaignInfoCard({ campaign }: CampaignInfoCardProps) {
  const infoItems = [
    {
      label: "اسم الحملة",
      value: campaign.campaignName,
    },
    {
      label: "عنوان الحملة",
      value: campaign.campaignTitle,
    },
    {
      label: "وصف الحملة",
      value: campaign.campaignDescription,
    },
    {
      label: "محتوى الرسالة",
      value: campaign.messageContent,
    },
    {
      label: "قناة الإرسال",
      value: getChannelLabel(campaign.targetChannel),
    },
    {
      label: "الجمهور المستهدف",
      value: getAudienceLabel(campaign.targetAudience),
    },
    {
      label: "نوع التشغيل",
      value: getRunTypeLabel(campaign.runType),
    },
    {
      label: "الحالة",
      value: getStatusLabel(campaign.status),
      className: getStatusClass(campaign.status),
    },
    {
      label: "تاريخ الإنشاء",
      value: formatDate(campaign.createdAt),
    },
    {
      label: "تاريخ التحديث",
      value: formatDate(campaign.updatedAt),
    },
    {
      label: "تم الإنشاء بواسطة",
      value: campaign.createdBy || "System",
    },
  ];

  // Add date-related fields only if they exist
  if (campaign.startDate) {
    infoItems.splice(7, 0, {
      label: "تاريخ البدء",
      value: formatDate(campaign.startDate),
    });
  }

  if (campaign.endDate) {
    infoItems.splice(8, 0, {
      label: "تاريخ الانتهاء",
      value: formatDate(campaign.endDate),
    });
  }

  if (campaign.runFrequency) {
    infoItems.splice(9, 0, {
      label: "التكرار",
      value: getFrequencyLabel(campaign.runFrequency),
    });
  }

  if (campaign.runTime) {
    infoItems.splice(10, 0, {
      label: "وقت التشغيل",
      value: campaign.runTime,
    });
  }

  return (
    <Card title="معلومات الحملة">
      <div className="space-y-4">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center gap-2"
          >
            <span className="text-sm font-medium text-gray-600 min-w-[140px]">
              {item.label}:
            </span>
            <span
              className={`text-sm text-gray-800 flex-1 ${item.className || ""}`}
            >
              {item.value || "غير محدد"}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Helper functions for labels
function getChannelLabel(channel: string): string {
  const channels: { [key: string]: string } = {
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    sms: "رسائل SMS",
    push: "الإشعارات",
  };
  return channels[channel] || channel;
}

function getAudienceLabel(audience: string): string {
  const audiences: { [key: string]: string } = {
    all_users: "جميع المستخدمين",
    customers: "العملاء",
    agents: "الوسطاء",
    marketers: "المسوقين",
    new_customers: "العملاء الجدد",
  };
  return audiences[audience] || audience;
}

function getRunTypeLabel(runType: string): string {
  const types: { [key: string]: string } = {
    once: "مرة واحدة",
    recurring: "متكرر",
  };
  return types[runType] || runType;
}

function getFrequencyLabel(frequency: string): string {
  const frequencies: { [key: string]: string } = {
    daily: "يومي",
    weekly: "أسبوعي",
    monthly: "شهري",
  };
  return frequencies[frequency] || frequency;
}

function getStatusLabel(status: string): string {
  const statuses: { [key: string]: string } = {
    draft: "مسودة",
    scheduled: "مجدولة",
    running: "قيد التشغيل",
    paused: "متوقفة",
    completed: "مكتملة",
    cancelled: "ملغاة",
  };
  return statuses[status] || status;
}

function getStatusClass(status: string): string {
  const classes: { [key: string]: string } = {
    draft: "text-gray-600",
    scheduled: "text-blue-600",
    running: "text-green-600",
    paused: "text-yellow-600",
    completed: "text-purple-600",
    cancelled: "text-red-600",
  };
  return classes[status] || "text-gray-600";
}

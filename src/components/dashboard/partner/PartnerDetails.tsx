import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import CardInfo from "@/components/shared/infos/CardInfo";
import IconDetail from "@/components/shared/infos/IconDetail";
import { InfoBlock } from "@/components/shared/infos/InfoBlock";
import { Partner } from "@/services/partner/partner";
import {
  partnerStatusMap,
  partnerKindMap,
  partnerPlatformMap,
  campaignStatusMap,
  targetChannelMap,
} from "@/types/dashboard/partner";
import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaChartLine,
  FaUserPlus,
  FaCheckCircle,
  FaProjectDiagram,
  FaLink,
  FaBullhorn,
} from "react-icons/fa";
import { formatDate } from "@/utils/date";
import FallbackImage from "@/components/shared/FallbackImage";

type Props = {
  partner: Partner;
  performance?: any;
};

export default function PartnerDetails({ partner, performance }: Props) {
  // Use performance data if available, otherwise use placeholder data
  const metrics = performance?.metrics || {
    visits: 0,
    registrations: 0,
    appointments: 0,
    conversionRate: "0.00%",
  };

  const campaign = partner.campaign;

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-6 gap-4 lg:gap-6 items-stretch">
      {/* Left Column */}
      <div className="h-full xl:col-span-2">
        <DashboardSectionCard className="h-full">
          <div className="relative rounded-2xl bg-white p-6">
            <div className="relative w-fit mx-auto">
              <FallbackImage
                src={null} // Partners don't have profile images in the data
                alt={partner.name}
                width={80}
                height={80}
                className="rounded-full w-20 h-20 object-cover border bg-gray-100 flex items-center justify-center"
                fallback={
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xl font-semibold">
                      {partner.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                }
              />
            </div>

            <h5 className="text-xl font-semibold mt-5 text-center">
              {partner.name}
            </h5>

            <div className="flex items-center justify-center border-b border-dashed py-2">
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                <span
                  className={`w-3 h-3 rounded-full border border-white ${
                    partner.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                  title={
                    partnerStatusMap[partner.isActive ? "active" : "inactive"]
                  }
                />
                <span className="text-[10px] font-medium text-gray-700">
                  {partnerStatusMap[partner.isActive ? "active" : "inactive"]}
                </span>
              </div>
            </div>
          </div>

          {/* Partner Info */}
          <div className="mt-6 space-y-4">
            <IconDetail
              icon={
                <FaClipboardList className="text-[var(--primary)] w-6 h-6" />
              }
              label="نوع الشريك"
              value={partnerKindMap[partner.kind]}
            />
            <IconDetail
              icon={<FaLink className="text-[var(--secondary-500)] w-6 h-6" />}
              label="كود الإحالة"
              value={partner.referralCode}
              valueClassName="font-mono text-sm"
            />
            {partner.platform && (
              <IconDetail
                icon={<FaBullhorn className="text-blue-600 w-6 h-6" />}
                label="المنصة"
                value={
                  partnerPlatformMap[
                    partner.platform as keyof typeof partnerPlatformMap
                  ] || partner.platform
                }
              />
            )}
            {campaign && (
              <IconDetail
                icon={<FaCalendarAlt className="text-green-600 w-6 h-6" />}
                label="الحملة"
                value={campaign.name}
              />
            )}
          </div>
        </DashboardSectionCard>
      </div>

      {/* Right Column */}
      <div className="h-full xl:col-span-4">
        <DashboardSectionCard className="h-full">
          <h3 className="text-xl font-semibold mb-6">إحصائيات الشريك</h3>

          {/* Performance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-b pb-8 border-dashed">
            <CardInfo
              icon={<FaChartLine className="text-[var(--primary)] w-10 h-10" />}
              value={metrics.visits.toLocaleString()}
              label="عدد الزيارات"
            />
            <CardInfo
              icon={
                <FaUserPlus className="text-[var(--secondary-500)] w-10 h-10" />
              }
              value={metrics.registrations}
              label="التسجيلات"
            />
            <CardInfo
              icon={<FaCheckCircle className="text-green-600 w-10 h-10" />}
              value={metrics.appointments}
              label="المواعيد"
            />
            <CardInfo
              icon={<FaProjectDiagram className="text-blue-600 w-10 h-10" />}
              value={metrics.conversionRate}
              label="معدل التحويل"
            />
            {campaign && (
              <CardInfo
                icon={<FaBullhorn className="text-purple-600 w-10 h-10" />}
                value={campaignStatusMap[campaign.status] || campaign.status}
                label="حالة الحملة"
              />
            )}
          </div>

          {/* Partner Details */}
          <div className="grid grid-cols-12 gap-4 mt-6">
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock label="الاسم" value={partner.name} />
              <InfoBlock
                label="نوع الشريك"
                value={partnerKindMap[partner.kind]}
              />
              <InfoBlock
                label="تاريخ الإنشاء"
                value={formatDate(partner.createdAt)}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock
                label="كود الإحالة"
                value={partner.referralCode}
                valueClassName="font-mono text-sm"
              />
              <InfoBlock
                label="المنصة"
                value={
                  partner.platform
                    ? partnerPlatformMap[
                        partner.platform as keyof typeof partnerPlatformMap
                      ] || partner.platform
                    : "غير محدد"
                }
              />
              <InfoBlock
                label="تاريخ التحديث"
                value={formatDate(partner.updatedAt)}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock
                label="الحالة"
                value={
                  partnerStatusMap[partner.isActive ? "active" : "inactive"]
                }
              />
              {campaign && (
                <>
                  <InfoBlock label="الحملة" value={campaign.name} />
                  <InfoBlock
                    label="حالة الحملة"
                    value={
                      campaignStatusMap[campaign.status] || campaign.status
                    }
                  />
                </>
              )}
            </div>
          </div>

          {/* Campaign Details Section */}
          {campaign && (
            <div className="mt-8 pt-6 border-t border-dashed">
              <h4 className="text-lg font-semibold mb-4">تفاصيل الحملة</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoBlock label="اسم الحملة" value={campaign.name} />
                <InfoBlock label="عنوان الحملة" value={campaign.title} />
                <InfoBlock
                  label="القناة المستهدفة"
                  value={
                    targetChannelMap[campaign.targetChannel] ||
                    campaign.targetChannel
                  }
                />
                <InfoBlock
                  label="الجمهور المستهدف"
                  value={campaign.targetAudience}
                />
                <InfoBlock label="نوع التشغيل" value={campaign.runType} />
                <InfoBlock
                  label="الحالة"
                  value={campaignStatusMap[campaign.status] || campaign.status}
                />
                <InfoBlock
                  label="تاريخ البدء"
                  value={formatDate(campaign.startDate)}
                />
                <InfoBlock
                  label="تاريخ الانتهاء"
                  value={formatDate(campaign.endDate)}
                />
                {campaign.runFrequency && (
                  <InfoBlock label="التكرار" value={campaign.runFrequency} />
                )}
              </div>
              {campaign.description && (
                <div className="mt-4">
                  <InfoBlock
                    label="وصف الحملة"
                    value={campaign.description}
                    valueClassName="text-gray-700 leading-relaxed"
                  />
                </div>
              )}
            </div>
          )}
        </DashboardSectionCard>
      </div>
    </div>
  );
}

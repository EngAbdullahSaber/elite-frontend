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
  FaCode,
  FaCopy,
} from "react-icons/fa";
import { formatDate } from "@/utils/date";
import FallbackImage from "@/components/shared/FallbackImage";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  partner: Partner;
  performance?: any;
};

export default function PartnerDetails({ partner, performance }: Props) {
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Use performance data if available, otherwise use placeholder data
  const metrics = performance?.metrics || {
    visits: 0,
    registrations: 0,
    appointments: 0,
    conversionRate: "0.00%",
  };

  const handleCopyShareUrl = () => {
    if (partner.shareUrl) {
      navigator.clipboard.writeText(partner.shareUrl);
      setCopiedUrl(true);
      toast.success("تم نسخ رابط المشاركة", {
        duration: 3000,
        position: "top-center",
      });

      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (!url) return "";
    if (url.length <= maxLength) return url;

    const start = url.substring(0, maxLength / 2 - 3);
    const end = url.substring(url.length - maxLength / 2 + 3);
    return `${start}...${end}`;
  };

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-6 gap-4 lg:gap-6 items-stretch">
      {/* Left Column */}
      <div className="h-full xl:col-span-2">
        <DashboardSectionCard className="h-full">
          <div className="relative rounded-2xl bg-white p-6">
            <div className="relative w-fit mx-auto">
              <FallbackImage
                src={null} // Partners don't have profile images in the data
                alt={partner?.name}
                width={80}
                height={80}
                className="rounded-full w-20 h-20 object-cover border bg-gray-100 flex items-center justify-center"
                fallback={
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xl font-semibold">
                      {partner?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                }
              />
            </div>

            <h5 className="text-xl font-semibold mt-5 text-center">
              {partner?.name}
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
              icon={<FaCode className="text-[var(--secondary-500)] w-6 h-6" />}
              label="كود الإحالة"
              value={partner.referralCode}
              valueClassName="font-mono text-sm"
            />

            {/* Share URL Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <FaLink className="text-[var(--secondary-500)] w-6 h-6" />
                <span className="text-sm font-medium">رابط التسويق</span>
              </div>

              {partner.shareUrl ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <a
                        href={partner.shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all font-mono"
                        title={partner.shareUrl}
                      >
                        {truncateUrl(partner.shareUrl)}
                      </a>
                    </div>
                    <button
                      onClick={handleCopyShareUrl}
                      className="flex-shrink-0 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="نسخ الرابط"
                    >
                      <FaCopy
                        className={`w-4 h-4 ${
                          copiedUrl ? "text-green-500" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Click to copy hint */}
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-xs text-gray-500">
                      انقر فوق الرابط لفتحه أو زر النسخ
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-500 text-center">
                    لا يوجد رابط مشاركة متاح
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Actions */}
          {partner.shareUrl && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <p className="text-xs text-gray-600 text-center">
                  شارك هذا الرابط مع عملائك لتتبع الزيارات والتحويلات
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyShareUrl}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FaCopy className="w-4 h-4" />
                    {copiedUrl ? "تم النسخ!" : "نسخ الرابط"}
                  </button>
                  <a
                    href={partner.shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FaLink className="w-4 h-4" />
                    فتح الرابط
                  </a>
                </div>
              </div>
            </div>
          )}
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
              {/* Share URL in details section */}
              {partner.shareUrl && (
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">
                    رابط المشاركة:
                  </span>
                  <div className="bg-gray-50 p-2 rounded border">
                    <a
                      href={partner.shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline break-all font-mono block"
                      title={partner.shareUrl}
                    >
                      {truncateUrl(partner.shareUrl, 30)}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DashboardSectionCard>
      </div>
    </div>
  );
}

// app/dashboard/admin/influencers/[influencerId]/InfluencerDetails.tsx
"use client";

import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import CardInfo from "@/components/shared/infos/CardInfo";
import IconDetail from "@/components/shared/infos/IconDetail";
import { InfoBlock } from "@/components/shared/infos/InfoBlock";
import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import {
  FaUsers,
  FaChartLine,
  FaMoneyBillWave,
  FaLink,
  FaCalendarAlt,
  FaClipboardList,
  FaEye,
  FaShoppingCart,
  FaPercentage,
} from "react-icons/fa";
import { formatDate } from "@/utils/date";
import {
  influencerPlatformMap,
  InfluencerRow,
  influencerStatusMap,
} from "@/types/dashboard/Influencer";
import { useEffect, useState } from "react";
import { getInfluencerPerformance } from "@/services/Influencer/Influencer";

type Props = {
  influencer: InfluencerRow;
  onInfluencerAction?: () => void;
};

interface PerformanceData {
  totalVisitors: number;
  totalConversions: number;
  conversionRate: string;
}

export default function InfluencerDetails({
  influencer,
  onInfluencerAction,
}: Props) {
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(true);
  const [performanceError, setPerformanceError] = useState<string | null>(null);

  useEffect(() => {
    fetchPerformanceData();
  }, [influencer.id]);

  const fetchPerformanceData = async () => {
    try {
      setIsLoadingPerformance(true);
      setPerformanceError(null);

      const performanceResponse = await getInfluencerPerformance(
        parseInt(influencer.id)
      );

      // Handle different response structures
      let performanceData: PerformanceData;

      if (performanceResponse.performance) {
        // If response has performance object
        performanceData = performanceResponse.performance;
      } else if (
        performanceResponse.records &&
        performanceResponse.records.length > 0
      ) {
        // If response has records array, calculate totals
        const records = performanceResponse.records;
        const totalVisitors = records.reduce(
          (sum: number, record: any) => sum + (record.visitors || 0),
          0
        );
        const totalConversions = records.reduce(
          (sum: number, record: any) => sum + (record.conversions || 0),
          0
        );
        const conversionRate =
          totalVisitors > 0
            ? ((totalConversions / totalVisitors) * 100).toFixed(2) + "%"
            : "0%";

        performanceData = {
          totalVisitors,
          totalConversions,
          conversionRate,
        };
      } else {
        // Fallback to empty data
        performanceData = {
          totalVisitors: 0,
          totalConversions: 0,
          conversionRate: "0%",
        };
      }

      setPerformance(performanceData);
    } catch (err) {
      console.error("Error fetching performance data:", err);
      setPerformanceError("فشل في تحميل بيانات الأداء");
      // Set default performance data on error
      setPerformance({
        totalVisitors: 0,
        totalConversions: 0,
        conversionRate: "0%",
      });
    } finally {
      setIsLoadingPerformance(false);
    }
  };

  // Platform-specific icon and color
  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      instagram: "📷",
      snapchat: "👻",
      tiktok: "🎵",
      youtube: "📺",
      x: "🐦",
      other: "🔗",
    };
    return icons[platform] || "🔗";
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
      snapchat: "bg-yellow-400",
      tiktok: "bg-black",
      youtube: "bg-red-600",
      x: "bg-black",
      other: "bg-gray-500",
    };
    return colors[platform] || "bg-gray-500";
  };

  // Calculate commission based on conversions (mock calculation)
  const calculateCommission = (conversions: number) => {
    const commissionPerConversion = 50; // 50 SAR per conversion
    return conversions * commissionPerConversion;
  };

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-6 gap-4 lg:gap-6 items-stretch">
      {/* Left Column */}
      <div className="h-full xl:col-span-2">
        <DashboardSectionCard className="h-full">
          <div className="relative rounded-2xl bg-white p-6">
            <Link
              href={`/dashboard/admin/influncer/edit/${influencer.id}`}
              className="absolute top-4 right-4 bg-white border border-gray-200 p-2 rounded-full shadow-sm hover:bg-gray-50 transition z-10"
              title="تعديل المروج"
            >
              <BiEdit className="w-5 h-5 text-gray-600" />
            </Link>

            <div className="relative w-fit mx-auto">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl ${getPlatformColor(
                  influencer.platform
                )}`}
              >
                {getPlatformIcon(influencer.platform)}
              </div>
            </div>

            <h5 className="text-xl font-semibold mt-5 text-center">
              {influencer.name}
            </h5>
            {influencer.handle && (
              <p className="text-gray-600 text-center mt-1">
                @{influencer.handle.replace("@", "")}
              </p>
            )}

            <div className="flex items-center justify-center border-b border-dashed py-2">
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                <span
                  className={`w-3 h-3 rounded-full border border-white ${
                    influencer.status === "active"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                  title={influencerStatusMap[influencer.status]}
                />
                <span className="text-[10px] font-medium text-gray-700">
                  {influencerStatusMap[influencer.status]}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 space-y-4">
            {influencer.email && (
              <IconDetail
                icon={
                  <FaClipboardList className="text-[var(--primary)] w-6 h-6" />
                }
                label="البريد الإلكتروني"
                value={influencer.email}
                href={`mailto:${influencer.email}`}
              />
            )}
            {influencer.phone && (
              <IconDetail
                icon={
                  <FaCalendarAlt className="text-[var(--secondary-500)] w-6 h-6" />
                }
                label="رقم الهاتف"
                value={influencer.phone}
                href={`tel:${influencer.phone}`}
                className="ltr-data block"
              />
            )}
            {influencer.socialMediaUrl && (
              <IconDetail
                icon={<FaLink className="text-blue-500 w-6 h-6" />}
                label="رابط الحساب"
                value="زيارة الحساب"
                href={influencer.socialMediaUrl}
                external
              />
            )}
            <IconDetail
              icon={
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center text-white ${getPlatformColor(
                    influencer.platform
                  )}`}
                >
                  {getPlatformIcon(influencer.platform)}
                </div>
              }
              label="المنصة"
              value={influencerPlatformMap[influencer.platform]}
            />
            <IconDetail
              icon={<FaClipboardList className="text-gray-500 w-6 h-6" />}
              label="الكود المرجعي"
              value={influencer.code}
              className="font-mono bg-gray-50 px-2 py-1 rounded"
            />
          </div>
        </DashboardSectionCard>
      </div>

      {/* Right Column */}
      <div className="h-full xl:col-span-4">
        <DashboardSectionCard className="h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">إحصائيات المروج</h3>
            {isLoadingPerformance && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                جاري تحميل البيانات...
              </div>
            )}
          </div>

          {/* Performance Cards */}
          <div className="flex flex-wrap gap-6 border-b pb-8 border-dashed">
            <CardInfo
              icon={<FaEye className="text-blue-600 w-10 h-10" />}
              value={
                isLoadingPerformance
                  ? "..."
                  : performance?.totalVisitors.toLocaleString() || "0"
              }
              label="إجمالي الزوار"
              loading={isLoadingPerformance}
            />
            <CardInfo
              icon={<FaShoppingCart className="text-green-600 w-10 h-10" />}
              value={
                isLoadingPerformance
                  ? "..."
                  : performance?.totalConversions.toLocaleString() || "0"
              }
              label="إجمالي التحويلات"
              loading={isLoadingPerformance}
            />
            <CardInfo
              icon={<FaPercentage className="text-purple-600 w-10 h-10" />}
              value={
                isLoadingPerformance
                  ? "..."
                  : performance?.conversionRate || "0%"
              }
              label="معدل التحويل"
              loading={isLoadingPerformance}
            />
            <CardInfo
              icon={<FaMoneyBillWave className="text-yellow-600 w-10 h-10" />}
              value={
                isLoadingPerformance
                  ? "..."
                  : `${calculateCommission(
                      performance?.totalConversions || 0
                    ).toLocaleString()} ر.س`
              }
              label="إجمالي العمولات"
              loading={isLoadingPerformance}
            />
          </div>

          {performanceError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
              <p className="text-yellow-800 text-sm">{performanceError}</p>
              <button
                onClick={fetchPerformanceData}
                className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* Performance Summary */}
          {performance && !isLoadingPerformance && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-3">ملخص الأداء</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {performance.totalVisitors.toLocaleString()}
                  </div>
                  <div className="text-gray-600">زائر</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {performance.totalConversions.toLocaleString()}
                  </div>
                  <div className="text-gray-600">تحويل</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {performance.conversionRate}
                  </div>
                  <div className="text-gray-600">معدل التحويل</div>
                </div>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-12 gap-4 mt-6">
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock label="الاسم" value={influencer.name} />
              <InfoBlock
                label="الحساب"
                value={influencer.handle || "غير متوفر"}
                valueClassName={
                  influencer.handle ? "text-blue-600" : "text-gray-400"
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock
                label="المنصة"
                value={influencerPlatformMap[influencer.platform]}
              />
              <InfoBlock
                label="الكود المرجعي"
                value={influencer.code}
                valueClassName="font-mono"
              />
            </div>
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock
                label="الحالة"
                value={influencerStatusMap[influencer.status]}
              />
              <InfoBlock
                label="تاريخ الانضمام"
                value={formatDate(influencer.joinedAt)}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-12 gap-4 mt-6">
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock
                label="البريد الإلكتروني"
                value={influencer.email || "غير متوفر"}
                valueClassName={influencer.email ? "" : "text-gray-400"}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock
                label="رقم الهاتف"
                value={influencer.phone || "غير متوفر"}
                valueClassName={
                  influencer.phone ? "ltr-data block" : "text-gray-400"
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock
                label="حالة التحقق"
                value={influencer.verificationStatus ? "تم التحقق" : "غير محقق"}
                valueClassName={
                  influencer.verificationStatus
                    ? "text-green-600"
                    : "text-gray-400"
                }
              />
            </div>
          </div>
        </DashboardSectionCard>
      </div>
    </div>
  );
}

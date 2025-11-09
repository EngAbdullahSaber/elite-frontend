// app/dashboard/admin/influencers/[influencerId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BiListUl } from "react-icons/bi";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import InfluencerDetails from "@/components/dashboard/influncer/InfluencerDetails";
import { getInfluencerById } from "@/services/Influencer/Influencer";

type Props = {
  params: {
    influncerId: string;
  };
};

export default function InfluencerDetailsPage({ params }: Props) {
  const { influncerId } = params;
  const [influencer, setInfluencer] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchInfluencer();
  }, [influncerId, refreshTrigger]);

  const fetchInfluencer = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const influencerData = await getInfluencerById(parseInt(influncerId));

      // Map API response to influencer type
      const mappedInfluencer = {
        id: influencerData.id.toString(),
        name: influencerData.name,
        handle: influencerData.handle,
        platform: influencerData.platform,
        code: influencerData.code,
        status: influencerData.isActive ? "active" : "inactive",
        joinedAt: influencerData.createdAt,
        email: influencerData.user?.email || null,
        phone: influencerData.user?.phoneNumber || null,
        verificationStatus: influencerData.user?.verificationStatus || null,
        userId: influencerData.user?.id?.toString() || null,
        socialMediaUrl: influencerData.handle
          ? `https://${
              influencerData.platform
            }.com/${influencerData.handle.replace("@", "")}`
          : null,
      };

      setInfluencer(mappedInfluencer);
    } catch (err) {
      console.error("Error fetching influencer:", err);
      setError("فشل في تحميل بيانات المروج");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to trigger refresh after actions
  const handleInfluencerUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <DashboardHeaderTitle path={["المروجين", "جاري التحميل..."]}>
          <Link className="btn-primary" href="/dashboard/admin/influencers">
            <BiListUl /> عرض جميع المروجين
          </Link>
        </DashboardHeaderTitle>

        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="mr-2 text-gray-600">
            جاري تحميل بيانات المروج...
          </span>
        </div>
      </>
    );
  }

  // Error state
  if (error || !influencer) {
    const errorInfluencer = {
      id: influncerId,
      name: "مروج غير موجود",
      handle: null,
      platform: "instagram",
      code: "ERROR",
      status: "inactive" as const,
      joinedAt: new Date().toISOString(),
      email: null,
      phone: null,
      verificationStatus: null,
      userId: null,
      socialMediaUrl: null,
    };

    return (
      <>
        <DashboardHeaderTitle
          path={["المروجين", `تفاصيل المروج - ${errorInfluencer.name}`]}
        >
          <Link className="btn-primary" href="/dashboard/admin/influencers">
            <BiListUl /> عرض جميع المروجين
          </Link>
        </DashboardHeaderTitle>

        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchInfluencer}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>

        <InfluencerDetails influencer={errorInfluencer} />
      </>
    );
  }

  // Success state
  return (
    <>
      <DashboardHeaderTitle
        path={["المروجين", `تفاصيل المروج - ${influencer.name}`]}
      >
        <Link className="btn-primary" href="/dashboard/admin/influncer">
          <BiListUl /> عرض جميع المروجين
        </Link>
      </DashboardHeaderTitle>

      <InfluencerDetails
        influencer={influencer}
        onInfluencerAction={handleInfluencerUpdated}
      />
    </>
  );
}

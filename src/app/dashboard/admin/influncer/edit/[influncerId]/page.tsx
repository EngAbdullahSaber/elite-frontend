// app/dashboard/admin/influncer/[influncerId]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import Link from "next/link";
import { BiUser, BiGroup } from "react-icons/bi";
import CenteredContainer from "@/components/shared/CenteredContainer";
import { InfluencerRow } from "@/types/dashboard/Influencer";
import InfluencerForm from "@/components/dashboard/influncer/InfluncerForm";
import { getInfluencerById } from "@/services/Influencer/Influencer";

type Props = {
  params: { influncerId: string };
};

export default function EditInfluencerPage({ params }: Props) {
  const { influncerId } = params;
  const [influencer, setInfluencer] = useState<InfluencerRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    fetchInfluencer();
  }, [influncerId]);

  const fetchInfluencer = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const influencerData = await getInfluencerById(parseInt(influncerId));

      // Map API response to InfluencerRow
      const mappedInfluencer: InfluencerRow = {
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

  const handleSuccess = () => {
    // Redirect to influencer details page after successful update
    router.push(`/dashboard/admin/influncer/${influncerId}`);
    router.refresh(); // Refresh the page to show updated data
  };

  if (isLoading) {
    return (
      <div>
        <DashboardHeaderTitle path={["المروجين", "جاري التحميل..."]}>
          <div className="flex gap-4 flex-wrap">
            <Link className="btn-primary" href="/dashboard/admin/influncer">
              <BiGroup /> عرض جميع المروجين
            </Link>
          </div>
        </DashboardHeaderTitle>
        <CenteredContainer>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="mr-2 text-gray-600">جاري تحميل البيانات...</span>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div>
        <DashboardHeaderTitle path={["المروجين", "خطأ في التحميل"]}>
          <div className="flex gap-4 flex-wrap">
            <Link className="btn-primary" href="/dashboard/admin/influncer">
              <BiGroup /> عرض جميع المروجين
            </Link>
          </div>
        </DashboardHeaderTitle>
        <CenteredContainer>
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <p className="text-red-800 mb-4">{error || "المروج غير موجود"}</p>
            <button
              onClick={fetchInfluencer}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeaderTitle
        path={["المروجين", `تعديل بيانات المروج: ${influencer.name}`]}
      >
        <div className="flex gap-4 flex-wrap">
          <Link
            className="btn-primary"
            href={`/dashboard/admin/influncer/${influencer.id}`}
          >
            <BiUser /> صفحة المروج
          </Link>
          <Link className="btn-primary" href="/dashboard/admin/influncer">
            <BiGroup /> عرض جميع المروجين
          </Link>
        </div>
      </DashboardHeaderTitle>

      <CenteredContainer>
        <InfluencerForm
          influencer={influencer}
          isAdmin={true}
          onSuccess={handleSuccess}
        />
      </CenteredContainer>
    </div>
  );
}

// app/dashboard/admin/short-links/[shortLinkSlug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BiListUl } from "react-icons/bi";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import { getShortLinkById } from "@/services/shortLinks/shortLinks";
import ShortLinkDetails from "@/components/dashboard/short-links/ShortLinkDetails";

type Props = {
  params: {
    shortLinkSlug: string;
  };
};

export default function ShortLinkDetailsPage({ params }: Props) {
  const { shortLinkSlug } = params;
  const [shortLink, setShortLink] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchShortLink();
  }, [shortLinkSlug, refreshTrigger]);

  const fetchShortLink = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const shortLinkData = await getShortLinkById(shortLinkSlug);

      // Map API response to short link type
      const mappedShortLink = {
        id: shortLinkData.id.toString(),
        slug: shortLinkData.slug,
        destination: shortLinkData.destination,
        shortUrl: `${window.location.origin}/s/${shortLinkData.slug}`,
        campaignId: shortLinkData.campaignId?.toString() || null,
        status: shortLinkData.isActive ? "active" : "inactive",
        createdAt: shortLinkData.createdAt,
        updatedAt: shortLinkData.updatedAt,
        influencerName: shortLinkData.influencer?.name || null,
        influencerHandle: shortLinkData.influencer?.handle || null,
        influencerPlatform: shortLinkData.influencer?.platform || null,
        influencerCode: shortLinkData.influencer?.code || null,
        marketerReferralCode: shortLinkData.marketer?.referralCode || null,
        marketerName: shortLinkData.marketer?.user?.fullName || null,
        marketerEmail: shortLinkData.marketer?.user?.email || null,
        createdByName: shortLinkData.createdBy?.fullName || "System",
        createdByEmail: shortLinkData.createdBy?.email || "",
      };

      setShortLink(mappedShortLink);
    } catch (err) {
      console.error("Error fetching short link:", err);
      setError("فشل في تحميل بيانات الرابط القصير");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to trigger refresh after actions
  const handleShortLinkUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <DashboardHeaderTitle path={["الروابط القصيرة", "جاري التحميل..."]}>
          <Link className="btn-primary" href="/dashboard/admin/short-links">
            <BiListUl /> عرض جميع الروابط
          </Link>
        </DashboardHeaderTitle>

        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="mr-2 text-gray-600">
            جاري تحميل بيانات الرابط...
          </span>
        </div>
      </>
    );
  }

  // Error state
  if (error || !shortLink) {
    const errorShortLink = {
      id: shortLinkSlug,
      slug: "رابط-غير-موجود",
      destination: "#",
      shortUrl: "#",
      campaignId: null,
      status: "inactive" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      influencerName: null,
      influencerHandle: null,
      influencerPlatform: null,
      influencerCode: null,
      marketerReferralCode: null,
      marketerName: null,
      marketerEmail: null,
      createdByName: "System",
      createdByEmail: "",
    };

    return (
      <>
        <DashboardHeaderTitle
          path={["الروابط القصيرة", `تفاصيل الرابط - ${errorShortLink.slug}`]}
        >
          <Link className="btn-primary" href="/dashboard/admin/short-links">
            <BiListUl /> عرض جميع الروابط
          </Link>
        </DashboardHeaderTitle>

        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchShortLink}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>

        <ShortLinkDetails shortLink={errorShortLink} />
      </>
    );
  }

  // Success state
  return (
    <>
      <DashboardHeaderTitle
        path={["الروابط القصيرة", `تفاصيل الرابط - ${shortLink.slug}`]}
      >
        <Link className="btn-primary" href="/dashboard/admin/short-links">
          <BiListUl /> عرض جميع الروابط
        </Link>
      </DashboardHeaderTitle>

      <ShortLinkDetails
        shortLink={shortLink}
        onShortLinkAction={handleShortLinkUpdated}
      />
    </>
  );
}

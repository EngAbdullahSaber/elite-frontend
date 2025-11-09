// app/dashboard/admin/short-links/[shortLinkSlug]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import Link from "next/link";
import { BiLink, BiListUl } from "react-icons/bi";
import CenteredContainer from "@/components/shared/CenteredContainer";
import { ShortLinkRow } from "@/types/dashboard/shortLink";
import { getShortLinkById } from "@/services/shortLinks/shortLinks";
import ShortLinkForm from "@/components/dashboard/short-links/ShortLinkForm";

type Props = {
  params: { shortLinkSlug: string };
};

export default function EditShortLinkPage({ params }: Props) {
  const { shortLinkSlug } = params;
  const [shortLink, setShortLink] = useState<ShortLinkRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchShortLink();
  }, [shortLinkSlug]);

  const fetchShortLink = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch short link by ID
      const shortLinkData = await getShortLinkById(shortLinkSlug);

      // Map API response to ShortLinkRow
      const mappedShortLink: ShortLinkRow = {
        id: shortLinkData.id.toString(),
        slug: shortLinkData.slug,
        destination: shortLinkData.destination,
        shortUrl: shortLinkData.shortUrl,
        clicks: shortLinkData.clicks || 0,
        status: shortLinkData.isActive ? "active" : "inactive",
        createdAt: shortLinkData.createdAt,
        campaignId: shortLinkData.campaign?.id?.toString() || null,
        campaignName: shortLinkData.campaign?.name || null,
        influencerId: shortLinkData.influencer?.id?.toString() || null,
        influencerName: shortLinkData.influencer?.name || null,
        marketerId: shortLinkData.marketer?.id?.toString() || null,
        marketerName: shortLinkData.marketer?.user?.fullName || null,
      };

      setShortLink(mappedShortLink);
    } catch (err) {
      console.error("Error fetching short link:", err);
      setError("فشل في تحميل بيانات الرابط القصير");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    // Redirect to short links list page after successful update
    router.push("/dashboard/admin/short-links");
    router.refresh(); // Refresh the page to show updated data
  };

  if (isLoading) {
    return (
      <div>
        <DashboardHeaderTitle path={["الروابط القصيرة", "جاري التحميل..."]}>
          <div className="flex gap-4 flex-wrap">
            <Link className="btn-primary" href="/dashboard/admin/short-links">
              <BiListUl /> عرض جميع الروابط
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

  if (error || !shortLink) {
    return (
      <div>
        <DashboardHeaderTitle path={["الروابط القصيرة", "خطأ في التحميل"]}>
          <div className="flex gap-4 flex-wrap">
            <Link className="btn-primary" href="/dashboard/admin/short-links">
              <BiListUl /> عرض جميع الروابط
            </Link>
          </div>
        </DashboardHeaderTitle>
        <CenteredContainer>
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <p className="text-red-800 mb-4">
              {error || "الرابط القصير غير موجود"}
            </p>
            <button
              onClick={fetchShortLink}
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
        path={["الروابط القصيرة", `تعديل الرابط: ${shortLink.slug}`]}
      >
        <div className="flex gap-4 flex-wrap">
          <Link
            className="btn-primary"
            href={`/dashboard/admin/short-links/${shortLink.slug}`}
          >
            <BiLink /> صفحة الرابط
          </Link>
          <Link className="btn-primary" href="/dashboard/admin/short-links">
            <BiListUl /> عرض جميع الروابط
          </Link>
        </div>
      </DashboardHeaderTitle>

      <CenteredContainer>
        <ShortLinkForm
          shortLink={shortLink}
          isAdmin={true}
          onSuccess={handleSuccess}
        />
      </CenteredContainer>
    </div>
  );
}

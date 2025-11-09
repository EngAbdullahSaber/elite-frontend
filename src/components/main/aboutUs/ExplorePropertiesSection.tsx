"use client";
import SectionTitle from "@/components/shared/SectionTitle";
import VideoSection from "@/components/shared/VideoSection";
import { getPageSections } from "@/services/AboutUsPage/AboutUsPage";
import { getSiteSettings } from "@/services/settings/siteSettings";
import Image from "next/image";
import { useEffect, useState } from "react";

// Types for the API responses
interface SiteSettings {
  youtube_url?: string;
  [key: string]: any;
}

interface Section {
  id: number;
  title: string;
  description?: string;
  subtitle?: string;
  content?: string;
  [key: string]: any;
}

interface SectionsResponse {
  data: Section[];
  meta: {
    current_page: number;
    total: number;
    [key: string]: any;
  };
}

// Constants
const PAGE_ID = 10;
const SECTION_ID = 10;

export default function ExplorePropertiesSection() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [sectionData, setSectionData] = useState<Section | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch site settings for video URL
        const siteSettings = await getSiteSettings();
        const youtubeUrl =
          siteSettings.youtube_url ||
          "https://youtu.be/v6E-NKtYLRg?si=nCCCOoyOfkELc9kx";
        setVideoUrl(youtubeUrl);

        // Fetch page sections for title and description
        const sectionsResponse = await getPageSections(PAGE_ID);
        console.log("Sections response:", sectionsResponse);

        // Find the specific section by ID - use 'records' instead of 'data'
        const targetSection = sectionsResponse.records.find(
          (section: Section) => section.id === SECTION_ID
        );

        console.log("Target section:", targetSection);

        if (targetSection) {
          setSectionData({
            id: targetSection.id,
            title: targetSection.title,
            subtitle: targetSection.sectionKey, // Using sectionKey as subtitle
            description: targetSection.description,
          });
        } else {
          console.warn(
            `Section with ID ${SECTION_ID} not found. Available sections:`,
            sectionsResponse.records.map((s) => ({
              id: s.id,
              sectionKey: s.sectionKey,
            }))
          );

          // Fallback data if section not found
          setSectionData({
            id: SECTION_ID,
            title: "نظرة تفصيلية داخل عقاراتنا",
            subtitle: "استكشاف العقارات",
            description:
              "يمكن شراء العقارات أو بيعها ،وهي فرصة استثمارية قيّمة. قيمة العقارات قابلة للنمو...",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.");

        // Set fallback data on error
        setVideoUrl("https://youtu.be/v6E-NKtYLRg?si=nCCCOoyOfkELc9kx");
        setSectionData({
          id: SECTION_ID,
          title: "نظرة تفصيلية داخل عقاراتنا",
          subtitle: "استكشاف العقارات",
          description:
            "يمكن شراء العقارات أو بيعها ،وهي فرصة استثمارية قيّمة. قيمة العقارات قابلة للنمو...",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // Show loading state
  if (loading) {
    return (
      <section className="bg-white pt-[60px] lg:pt-[120px] relative z-10">
        <div className="container z-20 relative">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error && !sectionData) {
    return (
      <section className="bg-white pt-[60px] lg:pt-[120px] relative z-10">
        <div className="container z-20 relative text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            حاول مرة أخرى
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white pt-[60px] lg:pt-[120px] relative z-10">
      {/* Decorative Background Layer */}
      <Image
        alt="el"
        width={110}
        height={115}
        className="absolute hidden lg:block top-20 right-20"
        src="/main/about/explore-el-2.png"
      />

      <div className="container z-20 relative">
        {/* Section Title */}
        <SectionTitle
          arrowTitle={sectionData?.subtitle || "استكشاف العقارات"}
          title={sectionData?.title || "نظرة تفصيلية داخل عقاراتنا"}
          description={
            sectionData?.description ||
            "يمكن شراء العقارات أو بيعها ،وهي فرصة استثمارية قيّمة. قيمة العقارات قابلة للنمو..."
          }
          bgColor="var(--primary-light)"
        />

        {/* Video Section */}
        <VideoSection videoUrl={videoUrl} />
      </div>
    </section>
  );
}

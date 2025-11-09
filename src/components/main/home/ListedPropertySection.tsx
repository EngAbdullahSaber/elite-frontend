"use client";

import SectionTitle from "@/components/shared/SectionTitle";
import ListPropertyFilterBar from "./ListPropertyFilterBar";
import ListProperty from "./ListProperty";
import { getPageSections } from "@/services/AboutUsPage/AboutUsPage";
import { useEffect, useState } from "react";
import useProperties from "@/hooks/dashboard/admin/properties/useProperties";

// Constants
const MAIN_PAGE_ID = 1;
const LISTED_PROPERTY_SECTION_ID = 12; // The section ID for listed properties

interface SectionData {
  id: number;
  title: string;
  description: string;
  sectionKey?: string | null;
}

export default function ListedPropertySection() {
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    error: propertiesError,
  } = useProperties();

  useEffect(() => {
    async function fetchSectionData() {
      try {
        setLoading(true);
        setError(null);

        const response = await getPageSections(MAIN_PAGE_ID, {
          page: 1,
          limit: 10,
        });

        // Find the listed property section by ID
        const listedPropertySection = response.records.find(
          (section: SectionData) => section.id === LISTED_PROPERTY_SECTION_ID
        );

        setSectionData(listedPropertySection || null);
      } catch (err) {
        console.error("Error fetching listed property section data:", err);
        setError("فشل في تحميل البيانات");
        setSectionData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSectionData();
  }, []);

  // Fallback data
  const fallbackData = {
    title: "قائمة المشاريع",
    description: "يمكن شراء العقارات ، ويمكن أن تكون فرصة استثمارية قيّمة.",
    sectionKey: "المشاريع",
  };

  const { title, description, sectionKey } = sectionData || fallbackData;

  // Process properties data to ensure required fields
  const processedProperties = propertiesData
    ? propertiesData.map((property: any) => ({
        ...property,
        // Ensure required fields for PropertyCardGrid
        id: property.id || property._id || Math.random().toString(),
        href: property.href || `/projects/${property.id || property._id}`,
        // Add other required fields with fallbacks
        title: property.title || property.name || "عقار",
        location: property.location || property.address || "موقع غير محدد",
        price: property.price || 0,
        // Add any other required fields for PropertyCardGrid
      }))
    : [];

  // Combined loading state
  const isLoading = loading || propertiesLoading;

  // Loading state
  if (isLoading) {
    return (
      <section className="bg-[var(--bg-2)] py-[60px] lg:py-[120px] relative bg-[url('/pattern-01.png')] bg-contain bg-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-white/80 z-[1]" />

        {/* Content wrapper */}
        <div className="relative z-[2]">
          <div className="container">
            {/* Loading skeleton for SectionTitle */}
            <div className="text-center mb-12">
              <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-32 mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-48 mx-auto mb-4"></div>
              <div className="h-16 bg-gray-200 rounded animate-pulse max-w-2xl mx-auto"></div>
            </div>

            {/* Loading skeleton for filter bar */}
            <div className="mb-8">
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
            </div>

            {/* Loading skeleton for property grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--bg-2)] py-[60px] lg:py-[120px] relative bg-[url('/pattern-01.png')] bg-contain bg-center">
      {/* Background layers */}
      <div className="absolute inset-0 bg-white/80 z-[1]" />

      {/* Content wrapper */}
      <div className="relative z-[2]">
        <div className="container">
          <SectionTitle
            arrowTitle={sectionKey || "المشاريع"}
            title={title}
            description={description}
          />

          {(error || propertiesError) && (
            <div className="text-center mb-6">
              <p className="text-red-500 text-sm">
                {error || "فشل في تحميل قائمة العقارات"}
              </p>
            </div>
          )}

          <ListPropertyFilterBar />
          <ListProperty properties={processedProperties} />
        </div>
      </div>
    </section>
  );
}

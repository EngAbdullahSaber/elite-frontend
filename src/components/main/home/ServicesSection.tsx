"use client";

import SectionTitle from "@/components/shared/SectionTitle";
import ServiceCard from "./ServiceCard";
import { getPageSections } from "@/services/AboutUsPage/AboutUsPage";
import { useEffect, useState } from "react";

// Constants
const MAIN_PAGE_ID = 1;
const SERVICES_SECTION_ID = 13; // The section ID for services section

interface SectionData {
  id: number;
  title: string;
  description: string;
  sectionKey?: string | null;
}

export default function ServicesSection() {
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSectionData() {
      try {
        setLoading(true);
        setError(null);

        const response = await getPageSections(MAIN_PAGE_ID, {
          page: 1,
          limit: 10,
        });

        // Find the services section by ID
        const servicesSection = response.records.find(
          (section: SectionData) => section.id === SERVICES_SECTION_ID
        );

        setSectionData(servicesSection || null);
      } catch (err) {
        console.error("Error fetching services section data:", err);
        setError("فشل في تحميل البيانات");
        setSectionData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSectionData();
  }, []);

  // Static services data (since these contain images, links, and button text)
  const services = [
    {
      title: "شراء عقار",
      description: "الشراء هو خطوة استثمارية مهمة تتيح لك امتلاك منزل أو أرض.",
      buttonText: "ابحث عن منزل",
      imageUrl: "/main/home/service-img-1.webp",
      link: "/projects",
    },
    {
      title: "بيع عقار",
      description: "البيع يتيح لك تحقيق عائد من ممتلكاتك العقارية.",
      buttonText: "أنشئ إعلانًا",
      imageUrl: "/main/home/service-img-2.png",
      link: "#",
    },
  ];

  // Fallback data for section header
  const fallbackData = {
    title: "شاهد كيف يمكن ان نساعدك",
    description:
      "يمكن شراء العقارات أو بيعها أو تأجيرها أو استئجارها، وهي تُعد فرصة استثمارية قيّمة. وتعتمد قيمة العقار على الموقع والاستخدام.",
    sectionKey: "الخدمات",
  };

  const { title, description, sectionKey } = sectionData || fallbackData;

  // Loading state
  if (loading) {
    return (
      <section className="relative bg-bg-2 py-[60px] lg:py-[120px]">
        {/* Content wrapper */}
        <div className="relative z-[2]">
          <div className="container">
            <div className="max-w-[630px] mx-auto flex flex-col items-center text-center px-3">
              {/* Loading skeleton for SectionTitle */}
              <div className="w-full mb-12">
                <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-32 mx-auto mb-4"></div>
                <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-64 mx-auto mb-4"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse w-full"></div>
              </div>
            </div>

            {/* Loading skeleton for service cards */}
            <div className="flex flex-row flex-wrap justify-center gap-4 px-3 px-xl-0 mt-10">
              {services.map((_, index) => (
                <div
                  key={index}
                  className="w-full md:w-[calc(50%-16px)] max-w-md"
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32"></div>
                    </div>
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
    <section className="relative bg-bg-2 py-[60px] lg:py-[120px]">
      {/* Content wrapper */}
      <div className="relative z-[2]">
        <div className="container">
          <div className="max-w-[630px] mx-auto flex flex-col items-center text-center px-3">
            <SectionTitle
              title={title}
              arrowTitle={sectionKey || "الخدمات"}
              bgColor="var(--primary-light)"
              description={description}
            />

            {error && (
              <div className="mt-4">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
          </div>

          <div className="flex flex-row flex-wrap justify-center gap-4 px-3 px-xl-0 mt-10">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

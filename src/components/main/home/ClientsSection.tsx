"use client";

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionTitle from "@/components/shared/SectionTitle";
import SwiperPrevButton from "@/components/shared/SwiperPrevButton";
import SwiperNextButton from "@/components/shared/SwiperNextButton";
import { getPageSections } from "@/services/AboutUsPage/AboutUsPage";
import { useEffect, useState } from "react";

// Constants
const MAIN_PAGE_ID = 1;
const CLIENTS_SECTION_ID = 15; // The section ID for clients section

const clientLogos = [
  "/main/home/clients/client-1.webp",
  "/main/home/clients/client-2.webp",
  "/main/home/clients/client-3.webp",
  "/main/home/clients/client-4.webp",
  "/main/home/clients/client-5.webp",
  "/main/home/clients/client-6.webp",
  "/main/home/clients/client-7.webp",
];

interface SectionData {
  id: number;
  title: string;
  description: string;
  sectionKey?: string | null;
}

export default function ClientsSection() {
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

        // Find the clients section by ID
        const clientsSection = response.records.find(
          (section: SectionData) => section.id === CLIENTS_SECTION_ID
        );

        setSectionData(clientsSection || null);
      } catch (err) {
        console.error("Error fetching clients section data:", err);
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
    title: "عملاؤنا",
    description:
      "نفخر بثقة عملائنا الذين يمثلون نخبة من الشركات والمؤسسات الرائدة في مجال العقارات.",
    sectionKey: "شركاؤنا",
  };

  const { title, description, sectionKey } = sectionData || fallbackData;

  // Loading state
  if (loading) {
    return (
      <section className="py-[60px] lg:py-[120px] relative bg-bg-2 px-3">
        {/* Content wrapper */}
        <div className="relative z-[2]">
          {/* Decorative Images */}
          <Image
            alt="decoration"
            width={208}
            height={182}
            className="hidden lg:block absolute top-10 left-10 -scale-[1] rotate-90"
            src="/main/home/side-2.png"
          />
          <Image
            alt="decoration"
            width={99}
            height={86}
            className="hidden lg:block absolute right-10 top-[60%]"
            src="/main/home/testimonial-el-3.webp"
          />

          <div className="container">
            {/* Loading skeleton for SectionTitle */}
            <div className="text-center mb-12">
              <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-32 mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-48 mx-auto mb-4"></div>
              <div className="h-16 bg-gray-200 rounded animate-pulse max-w-2xl mx-auto"></div>
            </div>

            {/* Loading skeleton for swiper */}
            <div className="relative mt-10">
              <div className="swiper max-w-[856px] bg-[#EBEBFD] rounded-xl px-3 lg:px-5 xl:px-10 !py-12 text-center mx-auto">
                <div className="flex justify-center gap-6">
                  {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-center py-4"
                    >
                      <div className="w-40 h-20 bg-gray-300 rounded-lg animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[60px] lg:py-[120px] relative bg-bg-2 px-3">
      {/* Content wrapper */}
      <div className="relative z-[2]">
        {/* Decorative Images */}
        <Image
          alt="decoration"
          width={208}
          height={182}
          className="hidden lg:block absolute top-10 left-10 -scale-[1] rotate-90"
          src="/main/home/side-2.png"
        />
        <Image
          alt="decoration"
          width={99}
          height={86}
          className="hidden lg:block absolute right-10 top-[60%]"
          src="/main/home/testimonial-el-3.webp"
        />

        <div className="container">
          <SectionTitle
            title={title}
            bgColor="var(--primary-light)"
            arrowTitle={sectionKey || "شراكات"}
            description={description}
          />

          {error && (
            <div className="text-center mb-6">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <div className="relative mt-10">
            {/* Navigation Buttons */}
            <SwiperPrevButton className="clients-prev absolute top-[40%] left-2 lg:left-10" />
            <SwiperNextButton className="clients-next absolute top-[40%] right-2 lg:right-10" />

            {/* Swiper Carousel */}
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: ".clients-next",
                prevEl: ".clients-prev",
              }}
              spaceBetween={24}
              loop={true}
              breakpoints={{
                320: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
                1536: { slidesPerView: 6 },
              }}
              className="swiper max-w-[856px] bg-[#EBEBFD] rounded-xl px-3 lg:px-5 xl:px-10 !py-12 text-center mx-auto"
            >
              {clientLogos.map((logo, index) => (
                <SwiperSlide
                  key={index}
                  className="flex items-center justify-center py-4"
                >
                  <Image
                    alt={`Client ${index + 1}`}
                    width={160}
                    height={80}
                    className="object-contain max-h-[80px]"
                    src={logo}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

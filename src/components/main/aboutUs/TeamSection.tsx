"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SwiperNextButton from "@/components/shared/SwiperNextButton";
import SwiperPrevButton from "@/components/shared/SwiperPrevButton";
import SectionTitle from "@/components/shared/SectionTitle";
import FallbackImage from "@/components/shared/FallbackImage";
import { getTeamMembers } from "@/services/AboutUsPage/AboutUsPage";
import { getPageSections } from "@/services/AboutUsPage/AboutUsPage";
import { ImageBaseUrl } from "@/libs/app.config";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface Section {
  id: number;
  title: string;
  description: string;
  sectionKey: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [sectionData, setSectionData] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const PAGE_ID = 10;
  const SECTION_ID = 11;

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch section data (title and description)
      const [sectionsResponse, membersResponse] = await Promise.all([
        getPageSections(PAGE_ID, {
          limit: 50,
          sortBy: "createdAt",
          sortOrder: "DESC",
        }),
        getTeamMembers({
          limit: 50,
          sortBy: "createdAt",
          sortOrder: "DESC",
        }),
      ]);

      // Find the specific section
      const teamSection = sectionsResponse.records?.find(
        (section: Section) => section.id === SECTION_ID
      );

      if (teamSection) {
        setSectionData(teamSection);
      } else {
        console.warn("Team section not found with ID:", SECTION_ID);
        // Set default values if section not found
        setSectionData({
          id: SECTION_ID,
          title: "فريقنا المميز",
          description:
            "تعرف على أعضاء فريقنا الذين يقفون خلف نجاحنا، حيث يجمعون بين الخبرة، الشغف، والاحترافية لتقديم أفضل الخدمات العقارية وتحقيق تطلعات عملائنا.",
          sectionKey: "team",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Set team members
      const members = membersResponse.records || membersResponse;
      setTeamMembers(members || []);
    } catch (err) {
      console.error("Error fetching team data:", err);
      setError("فشل في تحميل بيانات الفريق");

      // Set fallback data in case of error
      setSectionData({
        id: SECTION_ID,
        title: "فريقنا المميز",
        description:
          "تعرف على أعضاء فريقنا الذين يقفون خلف نجاحنا، حيث يجمعون بين الخبرة، الشغف، والاحترافية لتقديم أفضل الخدمات العقارية وتحقيق تطلعات عملائنا.",
        sectionKey: "team",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <section className="relative mt-12 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-48 mx-auto mb-4"></div>
          <div className="animate-pulse bg-gray-200 rounded-lg h-6 w-64 mx-auto mb-4"></div>
          <div className="animate-pulse bg-gray-200 rounded-lg h-16 w-2/3 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center animate-pulse">
              <div className="bg-gray-200 rounded-full w-48 h-48 mx-auto mb-4"></div>
              <div className="bg-gray-200 rounded-lg h-6 w-32 mx-auto mb-2"></div>
              <div className="bg-gray-200 rounded-lg h-4 w-24 mx-auto"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Show error state
  if (error && (!teamMembers || teamMembers.length === 0)) {
    return (
      <section className="relative mt-12 max-w-7xl mx-auto px-4">
        <div className="text-center text-red-500 py-12">
          <p>{error}</p>
          <button
            onClick={fetchTeamData}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            إعادة المحاولة
          </button>
        </div>
      </section>
    );
  }

  // Don't render if no team members
  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  return (
    <section className="relative mt-12 max-w-7xl mx-auto px-4">
      <SectionTitle
        arrowTitle="الفريق"
        title={sectionData?.title || "فريقنا المميز"}
        description={
          sectionData?.description ||
          "تعرف على أعضاء فريقنا الذين يقفون خلف نجاحنا، حيث يجمعون بين الخبرة، الشغف، والاحترافية لتقديم أفضل الخدمات العقارية وتحقيق تطلعات عملائنا."
        }
        bgColor="var(--primary-light)"
        className="items-center text-center"
      />

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          navigation={{
            nextEl: ".team-next",
            prevEl: ".team-prev",
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1020: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
          loop={teamMembers.length >= 4}
          className="swiper"
        >
          {teamMembers.map((member) => (
            <SwiperSlide key={member.id}>
              <div className="group text-center">
                <div className="relative flex justify-center">
                  <FallbackImage
                    src={ImageBaseUrl + member.imageUrl}
                    alt={member.name}
                    width={250}
                    height={250}
                    className="rounded-full w-[200px] h-[200px] md:w-[250px] md:h-[250px] object-cover group-hover:grayscale duration-300"
                    fallbackSrc="/main/about/team/member-1.webp"
                  />
                </div>
                <div className="mt-6">
                  <h4 className="text-[20px] md:text-[24px] font-semibold">
                    {member.name}
                  </h4>
                  <p className="text-base md:text-lg mb-4">{member.position}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {teamMembers.length > 4 && (
          <>
            <SwiperPrevButton className="team-prev absolute top-[50%] left-2 lg:left-6 xl:left-1 z-10" />
            <SwiperNextButton className="team-next absolute top-[50%] right-2 lg:right-6 xl:right-1 z-10" />
          </>
        )}
      </div>

      {/* Error message with retry button (if there's an error but we have data) */}
      {error && (
        <div className="text-center mt-6">
          <p className="text-orange-500 text-sm mb-2">{error}</p>
          <button
            onClick={fetchTeamData}
            className="text-blue-500 text-sm hover:text-blue-600"
          >
            إعادة تحميل البيانات
          </button>
        </div>
      )}
    </section>
  );
}

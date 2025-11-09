"use client";

import Link from "next/link";
import { AiOutlineArrowDown } from "react-icons/ai";
import "rc-slider/assets/index.css";
import Image from "next/image";
import HeroPropertyFiltering from "./HeroPropertyFiltering";
import { getPageSections } from "@/services/AboutUsPage/AboutUsPage";
import { useEffect, useState } from "react";

// Constants
const MAIN_PAGE_ID = 1;
const HERO_SECTION_ID = 1; // The section ID for hero section

interface HeroSectionData {
  id: number;
  title: string;
  description: string;
  sectionKey?: string | null;
}

// Fallback data in case API fails
const fallbackData = {
  title: "طريقة أسرع وأذكى للعثور على عقارك المثالي",
  description:
    "تصفّح آلاف القوائم المصنّفة بدقة، وفِلتر النتائج حسب المدينة، النوع والميزانية.",
};

export default function HeroSection() {
  const [heroData, setHeroData] = useState<HeroSectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeroData() {
      try {
        setLoading(true);
        setError(null);

        const response = await getPageSections(MAIN_PAGE_ID, {
          page: 1,
          limit: 10,
        });

        // Find the hero section by ID
        const heroSection = response.records.find(
          (section: HeroSectionData) => section.id === HERO_SECTION_ID
        );

        setHeroData(heroSection || null);
      } catch (err) {
        console.error("Error fetching hero section data:", err);
        setError("فشل في تحميل البيانات");
        setHeroData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchHeroData();
  }, []);

  const { title, description } = heroData || fallbackData;

  // Show loading state
  if (loading) {
    return (
      <section className="relative bg-bg-1 border-t lg:border-t-0 overflow-hidden bg-[url('/pattern-01.png')] bg-contain bg-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-white/80" />

        {/* Decorative photos */}
        <Image
          src="/main/home/primary-hero-img-2.jpg"
          className="absolute hidden lg:block w-[25%] left-0 bottom-0 z-[2] rounded-tr-3xl shadow-xl"
          width={508}
          height={642}
          alt="صورة"
          priority
        />
        <Image
          src="/main/home/primary-hero-img-1.jpg"
          className="absolute hidden xl:block w-[25%] top-0 right-0 rounded-bl-3xl shadow-xl"
          width={508}
          height={642}
          alt="صورة"
          priority
        />

        <div className="pt-[90px] sm:pt-[120px] md:pt-[160px] xl:pt-[200px] pb-16 h-full px-3 relative z-[3]">
          <div className="container mx-auto">
            <div className="text-center">
              {/* Loading skeleton for title */}
              <div className="h-16 bg-gray-200 rounded-lg animate-pulse mx-auto max-w-2xl mb-4"></div>
              {/* Loading skeleton for description */}
              <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto max-w-[680px] mb-8"></div>

              <HeroPropertyFiltering />

              {/* More Details */}
              <div className="mx-auto mt-12">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-full bg-primary text-white p-4 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
                  aria-label="عرض المزيد"
                >
                  <AiOutlineArrowDown className="w-5 h-5" />
                </Link>
                <span className="text-center block mt-2 text-neutral-600">
                  عرض المزيد
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state (optional - you can remove this if you want to always show fallback data)
  if (error && !heroData) {
    return (
      <section className="relative bg-bg-1 border-t lg:border-t-0 overflow-hidden bg-[url('/pattern-01.png')] bg-contain bg-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-white/80" />

        {/* Decorative photos */}
        <Image
          src="/main/home/primary-hero-img-2.jpg"
          className="absolute hidden lg:block w-[25%] left-0 bottom-0 z-[2] rounded-tr-3xl shadow-xl"
          width={508}
          height={642}
          alt="صورة"
          priority
        />
        <Image
          src="/main/home/primary-hero-img-1.jpg"
          className="absolute hidden xl:block w-[25%] top-0 right-0 rounded-bl-3xl shadow-xl"
          width={508}
          height={642}
          alt="صورة"
          priority
        />

        <div className="pt-[90px] sm:pt-[120px] md:pt-[160px] xl:pt-[200px] pb-16 h-full px-3 relative z-[3]">
          <div className="container mx-auto">
            <div className="text-center">
              <h1 className="text-[40px] lg:text-[56px] leading-[1.15] text-neutral-800 font-extrabold tracking-tight">
                {title}
              </h1>
              <p className="text-lg lg:text-xl mx-auto max-w-[680px] text-neutral-600 mt-4 md:mt-6">
                {description}
              </p>
              <p className="text-red-500 text-sm mt-2">{error}</p>

              <HeroPropertyFiltering />

              {/* More Details */}
              <div className="mx-auto mt-12">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-full bg-primary text-white p-4 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
                  aria-label="عرض المزيد"
                >
                  <AiOutlineArrowDown className="w-5 h-5" />
                </Link>
                <span className="text-center block mt-2 text-neutral-600">
                  عرض المزيد
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-bg-1 border-t lg:border-t-0 overflow-hidden bg-[url('/pattern-01.png')] bg-contain bg-center ">
      {/* Background layers */}
      <div className="absolute inset-0 bg-white/80" />

      {/* Decorative photos */}
      <Image
        src="/main/home/primary-hero-img-2.jpg"
        className="absolute hidden lg:block w-[25%] left-0 bottom-0 z-[2] rounded-tr-3xl shadow-xl"
        width={508}
        height={642}
        alt="صورة"
        priority
      />
      <Image
        src="/main/home/primary-hero-img-1.jpg"
        className="absolute hidden xl:block w-[25%] top-0 right-0 rounded-bl-3xl shadow-xl"
        width={508}
        height={642}
        alt="صورة"
        priority
      />

      <div className="pt-[90px] sm:pt-[120px] md:pt-[160px] xl:pt-[200px] pb-16 h-full px-3 relative z-[3]">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-[40px] lg:text-[56px] leading-[1.15] text-neutral-800 font-extrabold tracking-tight">
              {title}
            </h1>
            <p className="text-lg lg:text-xl mx-auto max-w-[680px] text-neutral-600 mt-4 md:mt-6">
              {description}
            </p>

            <HeroPropertyFiltering />

            {/* More Details */}
            <div className="mx-auto mt-12">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-full bg-primary text-white p-4 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
                aria-label="عرض المزيد"
              >
                <AiOutlineArrowDown className="w-5 h-5" />
              </Link>
              <span className="text-center block mt-2 text-neutral-600">
                عرض المزيد
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

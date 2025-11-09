"use client";

import Image from "next/image";
import CategoryCard from "./CategoryCard";
import Link from "next/link";
import { IconType } from "react-icons";
import {
  FaCity,
  FaBuilding,
  FaIndustry,
  FaStore,
  FaLandmark,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { BsArrowUpRight } from "react-icons/bs";
import SectionTitle from "@/components/shared/SectionTitle";
import { getPageSections } from "@/services/AboutUsPage/AboutUsPage";
import { useEffect, useState } from "react";

// Constants
const MAIN_PAGE_ID = 1;
const CATEGORY_SECTION_ID = 2; // The section ID for category section

export type Category = {
  title: string;
  description: string;
  href: string;
  icon: IconType;
  color?: string;
};

// Static categories data (fallback)
export const categories: Category[] = [
  {
    title: "فلل",
    description: "الفيلا هي منزل فاخر كبير عادةً في منطقة راقية.",
    href: "/projects?type=villas",
    icon: FaLandmark,
    color: "var(--secondary)",
  },
  {
    title: "شقق",
    description: "الشقة هي وحدة سكنية مستقلة داخل مبنى.",
    href: "/projects?type=apartments",
    icon: FaCity,
    color: "var(--primary)",
  },
  {
    title: "أراضي سكنية",
    description: "أراضي مخصصة للبناء السكني وتطوير المجتمعات.",
    href: "/projects?type=residential-land",
    icon: FaMapMarkedAlt,
    color: "var(--tertiary)",
  },
  {
    title: "أراضي تجارية",
    description: "أراضي مخصصة للمشاريع التجارية والاستثمارية.",
    href: "/projects?type=commercial-land",
    icon: FaMapMarkerAlt,
    color: "var(--tertiary)",
  },
  {
    title: "مكاتب إدارية",
    description: "مساحات مكتبية مخصصة للأعمال والإدارة.",
    href: "/projects?type=offices",
    icon: FaBuilding,
    color: "var(--secondary)",
  },
  {
    title: "صناعي",
    description: "الصناعي يشير إلى المباني المخصصة للأعمال الصناعية.",
    href: "/projects?type=industrial",
    icon: FaIndustry,
  },
  {
    title: "تجاري",
    description: "التجاري يشير إلى الأنشطة أو المباني التجارية.",
    href: "/projects?type=commercial",
    icon: FaStore,
    color: "var(--tertiary)",
  },
];

interface SectionData {
  id: number;
  title: string;
  description: string;
  sectionKey?: string | null;
}

export default function CategorySection() {
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

        // Find the category section by ID
        const categorySection = response.records.find(
          (section: SectionData) => section.id === CATEGORY_SECTION_ID
        );

        setSectionData(categorySection || null);
      } catch (err) {
        console.error("Error fetching category section data:", err);
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
    title: "اختر الفئة المناسبة",
    description:
      "يمكن شراء العقارات أو بيعها، وهي فرصة استثمارية قيّمة. قيمة العقار تعتمد على الموقع والاستخدام.",
  };

  const { title, description } = sectionData || fallbackData;

  // Loading state
  if (loading) {
    return (
      <section className="bg-bg-2 py-[60px] lg:py-[120px] relative px-3">
        {/* Content wrapper */}
        <div className="relative z-[2]">
          <Image
            alt="عنصر زخرفي"
            src="/main/home/category-section-el.png"
            width={232}
            height={207}
            className="absolute hidden lg:block top-12 left-12"
            style={{ color: "transparent" }}
          />

          <div className="container">
            {/* Loading skeleton for SectionTitle */}
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mx-auto mb-2"></div>
              <div className="h-16 bg-gray-200 rounded animate-pulse max-w-2xl mx-auto"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {/* Loading skeletons for category cards */}
              {categories.map((_, idx) => (
                <div
                  key={idx}
                  className="w-[290px] h-[290px] rounded-2xl bg-gray-200 animate-pulse"
                ></div>
              ))}

              {/* Loading skeleton for highlighted circle */}
              <div className="w-[290px] h-[290px] rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-center">
                  <div className="h-6 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-24 mx-auto mb-4"></div>
                  <div className="rounded-full bg-gray-300 p-6 inline-block"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bg-2 py-[60px] lg:py-[120px] relative px-3">
      {/* Content wrapper */}
      <div className="relative z-[2]">
        <Image
          alt="عنصر زخرفي"
          src="/main/home/category-section-el.png"
          width={232}
          height={207}
          className="absolute hidden lg:block top-12 left-12"
          style={{ color: "transparent" }}
        />

        <div className="container">
          <SectionTitle
            title={title}
            bgColor="var(--primary-light)"
            arrowTitle="الفئات"
            description={description}
          />

          {error && (
            <div className="text-center mb-6">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((cat, idx) => (
              <CategoryCard
                key={idx}
                title={cat.title}
                description={cat.description}
                href={cat.href}
                icon={
                  <cat.icon
                    className={`text-7xl group-hover:!text-white`}
                    style={{ color: cat?.color || "var(--primary)" }}
                  />
                }
              />
            ))}

            {/* Highlighted Circle */}
            <Link
              href="/projects"
              className="flex justify-center items-center relative group"
            >
              <div className="w-[290px] h-[290px] rounded-full bg-secondary-300 duration-300 group-hover:bg-secondary-500 group-hover:text-white flex items-center justify-center p-5 cursor-pointer relative overflow-hidden">
                <div className="text-center">
                  <h2 className="mb-2 group-hover:text-white">25+</h2>
                  <p>
                    استكشف العقارات <br /> واستثمر بثقة
                  </p>
                  <div className="rounded-full bg-white group-hover:bg-tertiary mt-4 p-6 inline-block text-black">
                    <BsArrowUpRight size={20} />
                  </div>
                </div>
                <div className="h-[197px] w-[197px] rounded-full absolute -right-20 -bottom-16 bg-secondary-400" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

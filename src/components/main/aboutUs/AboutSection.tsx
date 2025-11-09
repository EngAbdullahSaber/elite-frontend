"use client";

import React, { useState } from "react";
import { FaHeadset, FaProjectDiagram, FaUsers } from "react-icons/fa";
import StatBadge from "@/components/shared/StatBadge";
import FeatureList from "./FeatureList";
import SectionTitle from "@/components/shared/SectionTitle";
import { BiLike } from "react-icons/bi";
import Image from "next/image";

const tabConfig = [
  {
    title: "سكني",
    slug: "residential",
    paragraph:
      "إذا كنت تبحث عن عقار سكني، تأكد من التحقق من الحي، المدارس القريبة، والخدمات المتاحة.",
  },
  {
    title: "شقق",
    slug: "apartment",
    paragraph:
      "الشقق توفر خيارات مرنة للعيش أو الاستثمار، خاصة في المناطق الحضرية ذات الطلب العالي.",
  },
  {
    title: "تجاري",
    slug: "commercial",
    paragraph:
      "إذا كنت مهتمًا بشراء عقار تجاري، فقد ترغب في مراعاة عوامل مثل الموقع وسعر العقار.",
  },
];

export default function AboutSection() {
  const [activeTitle, setActiveTitle] = useState<string>(tabConfig[0].title);
  const activeTab = tabConfig.find((t) => t.title === activeTitle);

  return (
    <section className="py-20 px-4 bg-[var(--bg-2)] relative z-[1]">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center  gap-4 lg:gap-6">
          {/* Left Image */}
          <div className="w-full lg:w-1/2 text-center lg:text-start">
            <Image
              alt="صورة العقار"
              loading="lazy"
              width={526}
              height={499}
              src="/main/about/about-img.webp"
              className="mx-auto lg:mx-0 rounded-xl shadow-md"
            />
            <div className="mt-6 lg:mt-8">
              <StatBadge
                stats={[
                  { value: "10+", label: "الخبرة", icon: BiLike },
                  { value: "880+", label: "العملاء", icon: FaUsers },
                  { value: "251+", label: "المشاريع", icon: FaProjectDiagram },
                ]}
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <SectionTitle
              arrowTitle="من نحن"
              title="نبني مساحات حديثة ونوفر عقارات للبيع والشراء"
              bgColor="var(--primary-light)"
              className="items-center text-center lg:text-start"
            />

            {/* Tabs */}
            <div className="flex justify-center lg:justify-start gap-4 flex-wrap">
              {tabConfig.map((tab) => (
                <button
                  key={tab.slug}
                  onClick={() => setActiveTitle(tab.title)}
                  className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                    activeTitle === tab.title
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-[var(--neutral-700)] border-[var(--neutral-300)] hover:border-primary"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Paragraph */}
            <p className="text-[var(--neutral-600)] text-base leading-relaxed text-center lg:text-start">
              {activeTab?.paragraph}
            </p>

            {/* Features */}
            <FeatureList />

            {/* CTA */}
            <div className="flex flex-col lg:flex-row items-center justify-center lg:!justify-start gap-6 mt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--primary-light)] text-primary flex items-center justify-center">
                  <FaHeadset className="text-2xl" />
                </div>
                <div className="text-center lg:text-start">
                  <p className="text-sm text-[var(--neutral-500)] mb-1">
                    الدعم الفني
                  </p>
                  <p className="text-lg font-semibold text-[var(--primary-dark)]">
                    966&nbsp;54&nbsp;364&nbsp;0639+
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 ">
                <div className="w-14 h-14 rounded-full bg-[var(--tertiary)] text-white flex items-center justify-center">
                  <span className="text-xl font-bold">24/7</span>
                </div>
                <div className="text-center lg:text-start">
                  <p className="text-sm text-[var(--neutral-500)] mb-1">
                    خدمة مستمرة
                  </p>
                  <p className="text-lg font-semibold text-[var(--primary-dark)]">
                    دعم على مدار الساعة
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BsArrowRight } from "react-icons/bs";
import PropertyCardGrid from "@/components/main/projects/PropertyCardGrid";
import { Property } from "@/types/global";
import PrimaryButton from "@/components/shared/Button";

interface ListPropertyProps {
  properties: Property[];
  max?: number;
}

export default function ListProperty({
  properties,
  max = 10,
}: ListPropertyProps) {
  const router = useRouter();

  const handleShowMore = () => {
    router.push("/projects");
  };

  const visibleProperties = properties.slice(0, max);

  return (
    <section className="space-y-10">
      <div className="grid grid-cols-12 gap-6">
        {visibleProperties.map((property, idx) => (
          <div
            key={idx}
            className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 px-3 xl:px-0"
          >
            <PropertyCardGrid property={property} />
          </div>
        ))}
      </div>

      {properties.length > max && (
        <div className="flex justify-center">
          <PrimaryButton
            onClick={handleShowMore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white hover:bg-[#212391] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="عرض المزيد"
          >
            <BsArrowRight className="mt-1" />
            <span>عرض المزيد</span>
          </PrimaryButton>
        </div>
      )}
    </section>
  );
}

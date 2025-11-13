"use client";
import React, { useEffect } from "react";
import WorkProcessCard from "./WorkProcessCard";
import SectionTitle from "@/components/shared/SectionTitle";
import { getPageSections, getSteps } from "@/services/AboutUsPage/AboutUsPage";

// Types for the API response
interface Step {
  id: number;
  createdAt: string;
  updatedAt: string;
  stepNumber: number;
  title: string;
  description: string;
}

interface StepsResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Step[];
}

interface PageSection {
  id: number;
  title: string;
  description: string;
  // Add other fields as needed from your page section API
}

interface WorkProcessSectionProps {
  pageId?: number;
  sectionId?: number;
}

const WorkProcessSection: React.FC<WorkProcessSectionProps> = ({
  pageId = 10,
  sectionId = 6,
}) => {
  const [steps, setSteps] = React.useState<Step[]>([]);
  const [sectionData, setSectionData] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch steps data
        const stepsData = await getSteps();

        // Fetch section data if pageId and sectionId are provided
        if (pageId && sectionId) {
          try {
            const sectionData = await getPageSections(pageId);
            setSectionData(
              sectionData.filter((sec: any) => sec.id === sectionId)[0]
            );
          } catch (sectionError) {
            console.warn("Could not fetch section data, using default values");
            // Use default values if section data fetch fails
            setSectionData({
              id: sectionId,
              title: "كيفية حجز تذاكر الطيران: دليل خطوة بخطوة",
              description:
                "يمكن شراء العقارات أو بيعها أو تأجيرها، وهي فرصة استثمارية قيّمة. قيمة العقارات قابلة للنمو...",
            });
          }
        }

        setSteps(stepsData.records || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching work process data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageId, sectionId]);
   // Default image mapping based on step number
  const getStepImage = (stepNumber: number): string => {
    const imageMap: { [key: number]: string } = {
      1: "/main/about/work-process-icon-1.png",
      2: "/main/about/work-process-icon-2.png",
      3: "/main/about/work-process-icon-3.png",
      4: "/main/about/work-process-icon-4.png", // Add more as needed
    };

    return imageMap[stepNumber] || "/main/about/work-process-icon-1.png";
  };

  if (loading) {
    return (
      <section className="bg-white py-[60px] lg:py-[120px] px-3 xl:px-0">
        <div className="container">
          <div className="text-center">جاري التحميل...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-[60px] lg:py-[120px] px-3 xl:px-0">
        <div className="container">
          <div className="text-center text-red-500">
            خطأ في تحميل البيانات: {error}
          </div>
        </div>
      </section>
    );
  }

  if (!steps || steps.length === 0) {
    return (
      <section className="bg-white py-[60px] lg:py-[120px] px-3 xl:px-0">
        <div className="container">
          <p className="text-center text-neutral-500">
            لا توجد خطوات متاحة حالياً.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-[60px] lg:py-[120px] px-3 xl:px-0">
      <div className="container">
        <SectionTitle
          arrowTitle="عملية الحجز"
          title={
            sectionData?.title || "كيفية حجز تذاكر الطيران: دليل خطوة بخطوة"
          }
          description={
            sectionData?.description ||
            "يمكن شراء العقارات أو بيعها أو تأجيرها، وهي فرصة استثمارية قيّمة. قيمة العقارات قابلة للنمو..."
          }
        />

        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {steps.map((step) => (
            <WorkProcessCard
              key={step.id}
              step={step.stepNumber}
              title={step.title}
              description={step.description}
              imageSrc={getStepImage(step.stepNumber)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkProcessSection;

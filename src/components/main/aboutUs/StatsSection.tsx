// components/StatsSection.tsx
"use client";
import {
  BsCheckSquare,
  BsHandThumbsUp,
  BsPersonCircle,
  BsAward,
} from "react-icons/bs";
import { useEffect, useState } from "react";
import { getStats } from "@/services/AboutUsPage/AboutUsPage";

// Types for the API responses
interface StatRecord {
  id: number;
  createdAt: string;
  updatedAt: string;
  label: string;
  value: string;
}

interface StatsResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: StatRecord[];
}

interface StatsFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

// Default icons mapping based on label keywords
const iconMapping: { [key: string]: JSX.Element } = {
  عقار: <BsCheckSquare />,
  مكتمل: <BsCheckSquare />,
  متاح: <BsCheckSquare />,
  عميل: <BsHandThumbsUp />,
  رضا: <BsHandThumbsUp />,
  وكيل: <BsPersonCircle />,
  معتمد: <BsPersonCircle />,
  خبير: <BsPersonCircle />,
  جائزة: <BsAward />,
  محقق: <BsAward />,
};

// Background colors cycle
const bgColors = ["bg-primary", "bg-[#22804A]", "bg-[#9C742B]", "bg-primary"];

export default function StatsSection() {
  const [stats, setStats] = useState<StatRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getStats();

        setStats(response.records || []);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("فشل في تحميل الإحصائيات");

        // Fallback to default stats if API fails
        setStats([
          {
            id: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            label: "عقار مكتمل",
            value: "15k",
          },
          {
            id: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            label: "رضا العملاء",
            value: "14k",
          },
          {
            id: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            label: "وكلاء خبراء",
            value: "457+",
          },
          {
            id: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            label: "جوائز محققة",
            value: "78+",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    return () => {
      controller.abort();
    };
  }, []);

  // Function to get icon based on label
  const getIconForLabel = (label: string): JSX.Element => {
    const lowerLabel = label.toLowerCase();

    // Find matching keyword
    for (const [keyword, icon] of Object.entries(iconMapping)) {
      if (lowerLabel.includes(keyword.toLowerCase())) {
        return icon;
      }
    }

    // Default icon if no match found
    return <BsCheckSquare />;
  };

  // Function to get background color based on index
  const getBgColor = (index: number): string => {
    return bgColors[index % bgColors.length];
  };

  // Show loading state
  if (loading) {
    return (
      <section className="py-[60px] lg:py-[120px] relative">
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="col-span-12 xs:col-span-6 lg:col-span-3 text-center"
              >
                <div className="animate-pulse">
                  <div
                    className={`rounded-full mb-4 bg-gray-300 w-20 h-20 mx-auto`}
                  ></div>
                  <div className="h-8 bg-gray-300 rounded w-24 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state (but still show stats with fallback data)
  if (error && stats.length === 0) {
    return (
      <section className="py-[60px] lg:py-[120px] relative">
        <div className="container text-center">
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
    <section className="py-[60px] lg:py-[120px] relative">
      <div className="container">
        <div className="grid grid-cols-12 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="col-span-12 xs:col-span-6 lg:col-span-3 text-white text-center"
            >
              <div
                className={`text-4xl rounded-full mb-4 ${getBgColor(
                  index
                )} w-20 h-20 flex items-center justify-center mx-auto`}
              >
                {getIconForLabel(stat.label)}
              </div>
              <h2 className="h2 text-black mb-2">
                <span>{stat.value}</span>
              </h2>
              <span className="text-black">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Show error message but still display stats */}
        {error && (
          <div className="text-center mt-4">
            <div className="text-yellow-600 text-sm">
              {error} - يتم عرض بيانات افتراضية
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

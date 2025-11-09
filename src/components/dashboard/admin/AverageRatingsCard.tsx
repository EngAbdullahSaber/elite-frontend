"use client";
import { FaUserTie, FaEye, FaComments, FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  getCustomerReviews,
  Review,
  ReviewDimension,
} from "@/services/rating/rating";

interface RatingCategory {
  name: string;
  value: number;
  maxValue: number;
  icon: React.ReactNode;
}

interface AverageRatingsCardProps {
  agentId?: number; // Optional agent ID to filter by specific agent
  ratings?: RatingCategory[]; // Optional predefined ratings (for fallback)
  showGlobalAverage?: boolean; // Whether to show the global average circle
}

// Default dimension mappings
const dimensionMappings: {
  [key: string]: { name: string; icon: React.ReactNode };
} = {
  communication: {
    name: "التواصل",
    icon: <FaComments className="w-4 h-4" />,
  },
  professionalism: {
    name: "الاحترافية",
    icon: <FaUserTie className="w-4 h-4" />,
  },
  clarity: {
    name: "الوضوح",
    icon: <FaEye className="w-4 h-4" />,
  },
  cooperation: {
    name: "التعاون",
    icon: <FaClock className="w-4 h-4" />,
  },
};

// Fallback default ratings
const defaultRatings: RatingCategory[] = [
  {
    name: "الاحترافية",
    value: 4.5,
    maxValue: 5,
    icon: <FaUserTie className="w-4 h-4" />,
  },
  {
    name: "الوضوح",
    value: 4.3,
    maxValue: 5,
    icon: <FaEye className="w-4 h-4" />,
  },
  {
    name: "التواصل",
    value: 4.3,
    maxValue: 5,
    icon: <FaComments className="w-4 h-4" />,
  },
  {
    name: "سرعة الاستجابة",
    value: 4.3,
    maxValue: 5,
    icon: <FaClock className="w-4 h-4" />,
  },
];

export default function AverageRatingsCard({
  ratings: propRatings,
  showGlobalAverage = true,
}: AverageRatingsCardProps) {
  const [ratings, setRatings] = useState<RatingCategory[]>(
    propRatings || defaultRatings
  );
  const [loading, setLoading] = useState(!propRatings);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Otherwise, fetch from API
    const fetchRatings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getCustomerReviews({
          limit: 100,
          isApproved: true, // Only use approved reviews
          withDimensions: true, // Include dimension scores
        });

        const calculatedRatings = calculateRatingsFromReviews(response.records);
        setRatings(calculatedRatings);
      } catch (err) {
        console.error("Error fetching ratings:", err);
        setError("فشل في تحميل التقييمات");
        setRatings(defaultRatings); // Fallback to default ratings
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  // Calculate ratings from reviews data
  const calculateRatingsFromReviews = (reviews: Review[]): RatingCategory[] => {
    if (!reviews || reviews.length === 0) {
      return defaultRatings;
    }

    // Calculate overall rating statistics
    const dimensionScores: { [key: string]: { total: number; count: number } } =
      {};
    const overallRatings: number[] = [];

    reviews.forEach((review) => {
      // Add overall rating
      overallRatings.push(review.rating);

      // Process dimension scores
      if (review.dimensions && review.dimensions.length > 0) {
        review.dimensions.forEach((dimension: ReviewDimension) => {
          if (!dimensionScores[dimension.dimension]) {
            dimensionScores[dimension.dimension] = { total: 0, count: 0 };
          }
          dimensionScores[dimension.dimension].total += dimension.score;
          dimensionScores[dimension.dimension].count += 1;
        });
      }
    });

    // Calculate average for each dimension
    const dimensionAverages: RatingCategory[] = [];

    // Add dimensions from the data
    Object.entries(dimensionScores).forEach(([dimensionKey, data]) => {
      const mapping = dimensionMappings[dimensionKey] || {
        name: dimensionKey,
        icon: <FaUserTie className="w-4 h-4" />,
      };

      dimensionAverages.push({
        name: mapping.name,
        value: parseFloat((data.total / data.count).toFixed(1)),
        maxValue: 5,
        icon: mapping.icon,
      });
    });

    // If we have overall ratings but no dimensions, create default categories
    if (dimensionAverages.length === 0 && overallRatings.length > 0) {
      const overallAverage =
        overallRatings.reduce((sum, rating) => sum + rating, 0) /
        overallRatings.length;

      return defaultRatings.map((category) => ({
        ...category,
        value: parseFloat(overallAverage.toFixed(1)),
      }));
    }

    return dimensionAverages.length > 0 ? dimensionAverages : defaultRatings;
  };

  // Calculate global average
  const globalAverage =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
      : 0;

  const globalPercentage = (globalAverage / 5) * 100;

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {showGlobalAverage && (
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
          </div>
        )}

        <div className="space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Average Circle */}
      {showGlobalAverage && (
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgb(229 231 235)"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="var(--primary)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${
                  2 * Math.PI * 40 * (1 - globalPercentage / 100)
                }`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-primary">
                {globalAverage.toFixed(1)}
              </span>
              <span className="text-sm text-gray-600">5/</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-500 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Individual Ratings */}
      <div className="space-y-4">
        {ratings.map((rating, index) => {
          const percentage = (rating.value / rating.maxValue) * 100;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-primary">{rating.icon}</div>
                  <span className="text-sm font-medium text-gray-700">
                    {rating.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {rating.value.toFixed(1)}/{rating.maxValue}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Export the default ratings for use in other components
export { defaultRatings };

"use client";
import { useEffect, useState } from "react";
import FallbackImage from "@/components/shared/FallbackImage";
import { getAgentReviews } from "@/services/rating/rating";

interface Agent {
  id: string;
  name: string;
  image: string;
  totalAppointments: number;
  completedAppointments: number;
  averageRating?: number;
}

interface AgentPerformanceCardProps {
  agents?: Agent[]; // Optional predefined agents (for fallback)
  limit?: number; // Number of agents to show
}

interface AgentReview {
  id: number;
  createdAt: string;
  updatedAt: string;
  rating: number;
  reviewText: string;
  appointment: {
    id: number;
    status: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    customerNotes: string | null;
    agentNotes: string | null;
    createdChannel: string;
  };
  agent: {
    id: number;
    fullName: string;
    profilePhotoUrl: string | null;
    email: string;
    phoneNumber: string;
    userType: string;
    isActive: boolean;
  };
  customer: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  dimensions: Array<{
    id: number;
    dimension: string;
    score: number;
  }>;
}

interface AgentPerformanceData {
  agentId: string;
  name: string;
  image: string;
  totalAppointments: number;
  completedAppointments: number;
  averageRating: number;
  totalReviews: number;
}

export default function AgentPerformanceCard({
  agents: propAgents,
  limit = 5,
}: AgentPerformanceCardProps) {
  const [agents, setAgents] = useState<AgentPerformanceData[]>([]);
  const [loading, setLoading] = useState(!propAgents);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
 
    // Otherwise, fetch from API
    const fetchAgentPerformance = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching agent performance data...");

        const response = await getAgentReviews({
          limit: 100, // Get enough records to analyze
          isApproved: true, // Only approved reviews
        });

        console.log("Agent reviews API response:", response);

        // Process the data to get agent performance metrics
        const agentPerformance = calculateAgentPerformance(
          response.records || []
        );
        console.log("Processed agent performance:", agentPerformance);

        // Limit the number of agents shown
        const limitedAgents = agentPerformance.slice(0, limit);
        setAgents(limitedAgents);
      } catch (err: any) {
        console.error("Error fetching agent performance:", err);
        setError(err.message || "فشل في تحميل بيانات أداء الوكلاء");
        // Fallback to empty array or sample data
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentPerformance();
  }, [propAgents, limit]);

  // Calculate agent performance from reviews data
  const calculateAgentPerformance = (
    reviews: AgentReview[]
  ): AgentPerformanceData[] => {
    if (!reviews || reviews.length === 0) {
      return [];
    }

    // Group reviews by agent
    const agentMap = new Map<
      string,
      {
        agent: any;
        reviews: AgentReview[];
        appointments: Set<number>;
        completedAppointments: number;
      }
    >();

    reviews.forEach((review) => {
      const agentId = review.agent.id.toString();

      if (!agentMap.has(agentId)) {
        agentMap.set(agentId, {
          agent: review.agent,
          reviews: [],
          appointments: new Set(),
          completedAppointments: 0,
        });
      }

      const agentData = agentMap.get(agentId)!;
      agentData.reviews.push(review);

      // Track unique appointments
      agentData.appointments.add(review.appointment.id);

      // Count completed appointments (status based)
      if (
        review.appointment.status === "confirmed" ||
        review.appointment.status === "completed"
      ) {
        agentData.completedAppointments++;
      }
    });

    // Convert to performance data
    const performanceData: AgentPerformanceData[] = [];

    agentMap.forEach((data, agentId) => {
      const totalAppointments = data.appointments.size;
      const completedAppointments = data.completedAppointments;

      // Calculate average rating
      const totalRating = data.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating =
        data.reviews.length > 0 ? totalRating / data.reviews.length : 0;

      performanceData.push({
        agentId,
        name: data.agent.fullName,
        image: data.agent.profilePhotoUrl || "/images/default-agent.png",
        totalAppointments,
        completedAppointments,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: data.reviews.length,
      });
    });

    // Sort by completion rate (highest first)
    return performanceData.sort((a, b) => {
      const rateA =
        a.totalAppointments > 0
          ? a.completedAppointments / a.totalAppointments
          : 0;
      const rateB =
        b.totalAppointments > 0
          ? b.completedAppointments / b.totalAppointments
          : 0;
      return rateB - rateA;
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="flex gap-4">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="w-20 flex-shrink-0">
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="w-full bg-gray-200 rounded-full h-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state
  if (error && agents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Show empty state
  if (agents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-sm">
          لا توجد بيانات أداء للوكلاء متاحة حالياً
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {agents.map((agent) => {
        const completionRate =
          agent.totalAppointments > 0
            ? Math.round(
                (agent.completedAppointments / agent.totalAppointments) * 100
              )
            : 0;

        return (
          <div
            key={agent.agentId}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
          >
            {/* Agent Image */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <FallbackImage
                src={agent.image}
                alt={agent.name}
                fill
                className="rounded-full object-cover"
              />
            </div>

            {/* Agent Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-800 truncate">
                {agent.name}
              </h4>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                <span>المواعيد: {agent.totalAppointments}</span>
                <span>المكتملة: {agent.completedAppointments}</span>
                {agent.averageRating > 0 && (
                  <span>التقييم: {agent.averageRating} ⭐</span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex-shrink-0 w-20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">
                  {completionRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Show error message but still display data */}
      {error && (
        <div className="text-center text-yellow-600 text-sm bg-yellow-50 p-2 rounded">
          {error} - يتم عرض البيانات المتاحة
        </div>
      )}
    </div>
  );
}

// Default sample agents for fallback
export const defaultAgents: Agent[] = [
  {
    id: "1",
    name: "أحمد السعد",
    image: "/images/agent1.jpg",
    totalAppointments: 15,
    completedAppointments: 12,
  },
  {
    id: "2",
    name: "فاطمة محمد",
    image: "/images/agent2.jpg",
    totalAppointments: 10,
    completedAppointments: 8,
  },
  {
    id: "3",
    name: "خالد العتيبي",
    image: "/images/agent3.jpg",
    totalAppointments: 8,
    completedAppointments: 6,
  },
];

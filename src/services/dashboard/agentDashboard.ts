// services/reports/dashboard.ts

import { api } from "@/libs/axios";

export interface AgentStats {
  totalAppointments: number;
  totalEarnings: number;
  pendingBalance: number;
  averageRating: number;
}

export interface RecentPayment {
  id: number;
  amount: number;
  date: string;
  status: string;
  description?: string;
}

export interface RecentReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  customerName: string;
  customerPhoto?: string;
}

export interface RecentAppointment {
  id: number;
  createdAt: string;
  updatedAt: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  customerNotes: string | null;
  agentNotes: string | null;
  createdChannel: string;
  customer: {
    id: number;
    createdAt: string;
    updatedAt: string;
    phoneNumber: string;
    email: string;
    fullName: string;
    userType: string;
    profilePhotoUrl: string | null;
    nationalIdUrl: string | null;
    residencyIdUrl: string | null;
    verificationStatus: string;
    verifiedAt: string;
    passwordHash: string;
    emailOtp: string | null;
    emailOtpExpiresAt: string | null;
    resetOtp: string | null;
    resetOtpExpiresAt: string | null;
    isActive: boolean;
  };
  property: {
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string;
    bedrooms: number;
    bathrooms: number;
    areaM2: string;
    price: string;
    propertyListingRequestId: number | null;
    specifications: string;
    guarantees: string;
    accessType: string;
    ownerName: string;
    ownerPhone: string;
    ownerNotes: string | null;
    latitude: string | null;
    longitude: string | null;
    mapPlaceId: string | null;
    isActive: boolean;
    propertyType: {
      id: number;
      createdAt: string;
      updatedAt: string;
      name: string;
      isActive: boolean;
    };
    city: {
      id: number;
      createdAt: string;
      updatedAt: string;
      name: string;
      isActive: boolean;
    };
    area: {
      id: number;
      createdAt: string;
      updatedAt: string;
      name: string;
      isActive: boolean;
      city: {
        id: number;
        createdAt: string;
        updatedAt: string;
        name: string;
        isActive: boolean;
      };
    };
    createdBy: {
      id: number;
      createdAt: string;
      updatedAt: string;
      phoneNumber: string;
      email: string;
      fullName: string;
      userType: string;
      profilePhotoUrl: string | null;
      nationalIdUrl: string | null;
      residencyIdUrl: string | null;
      verificationStatus: string;
      verifiedAt: string;
      passwordHash: string;
      emailOtp: string | null;
      emailOtpExpiresAt: string | null;
      resetOtp: string | null;
      resetOtpExpiresAt: string | null;
      isActive: boolean;
    };
    cityId: number;
    areaId: number;
  };
  agent: {
    id: number;
    createdAt: string;
    updatedAt: string;
    phoneNumber: string;
    email: string;
    fullName: string;
    userType: string;
    profilePhotoUrl: string | null;
    nationalIdUrl: string | null;
    residencyIdUrl: string | null;
    verificationStatus: string;
    verifiedAt: string;
    passwordHash: string;
    emailOtp: string | null;
    emailOtpExpiresAt: string | null;
    resetOtp: string | null;
    resetOtpExpiresAt: string | null;
    isActive: boolean;
  };
}

export interface AgentDashboardResponse {
  stats: AgentStats;
  recentPayments: RecentPayment[];
  recentReviews: RecentReview[];
  recentAppointments: RecentAppointment[];
}

// GET - Fetch agent dashboard data
export async function getAgentDashboard(
  signal?: AbortSignal
): Promise<AgentDashboardResponse> {
  try {
    const response = await api.get("/agents/dashboard", {
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching agent dashboard data:", error);
    throw error;
  }
}

// Utility functions for agent dashboard
export function calculateAgentEarnings(stats: AgentStats): {
  totalEarnings: number;
  pendingBalance: number;
  availableBalance: number;
} {
  return {
    totalEarnings: stats.totalEarnings,
    pendingBalance: stats.pendingBalance,
    availableBalance: stats.totalEarnings - stats.pendingBalance,
  };
}

export function calculateAppointmentCompletionRate(
  appointments: RecentAppointment[]
): number {
  const totalAppointments = appointments.length;
  if (totalAppointments === 0) return 0;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed"
  ).length;

  return (completedAppointments / totalAppointments) * 100;
}

export function getUpcomingAppointments(
  appointments: RecentAppointment[],
  limit?: number
): RecentAppointment[] {
  const now = new Date();
  const upcoming = appointments
    .filter((appointment) => {
      const appointmentDateTime = new Date(
        `${appointment.appointmentDate}T${appointment.startTime}`
      );
      return (
        appointmentDateTime > now &&
        appointment.status !== "cancelled" &&
        appointment.status !== "completed"
      );
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate}T${a.startTime}`);
      const dateB = new Date(`${b.appointmentDate}T${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    });

  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getPendingAppointments(
  appointments: RecentAppointment[]
): RecentAppointment[] {
  return appointments.filter((appointment) => appointment.status === "pending");
}

// Enhanced agent dashboard interface with calculated metrics
export interface EnhancedAgentDashboard extends AgentDashboardResponse {
  metrics: {
    completionRate: number;
    upcomingAppointments: RecentAppointment[];
    pendingAppointments: RecentAppointment[];
    availableBalance: number;
    ratingPercentage: number;
  };
}

// GET - Fetch enhanced agent dashboard data with calculated metrics
export async function getEnhancedAgentDashboard(
  signal?: AbortSignal
): Promise<EnhancedAgentDashboard> {
  try {
    const data = await getAgentDashboard(signal);

    const completionRate = calculateAppointmentCompletionRate(
      data.recentAppointments
    );
    const upcomingAppointments = getUpcomingAppointments(
      data.recentAppointments
    );
    const pendingAppointments = getPendingAppointments(data.recentAppointments);
    const availableBalance =
      data.stats.totalEarnings - data.stats.pendingBalance;
    const ratingPercentage = (data.stats.averageRating / 5) * 100;

    return {
      ...data,
      metrics: {
        completionRate,
        upcomingAppointments,
        pendingAppointments,
        availableBalance,
        ratingPercentage,
      },
    };
  } catch (error) {
    console.error("Error fetching enhanced agent dashboard:", error);
    throw error;
  }
}

// Mock data for agent dashboard (remove in production)
export const generateMockAgentDashboardData = (): AgentDashboardResponse => ({
  stats: {
    totalAppointments: 15,
    totalEarnings: 12500,
    pendingBalance: 2500,
    averageRating: 4.5,
  },
  recentPayments: [
    {
      id: 1,
      amount: 5000,
      date: "2025-11-10",
      status: "completed",
      description: "Property commission",
    },
    {
      id: 2,
      amount: 2500,
      date: "2025-11-05",
      status: "pending",
      description: "Appointment fees",
    },
  ],
  recentReviews: [
    {
      id: 1,
      rating: 5,
      comment: "Excellent service! Very professional.",
      createdAt: "2025-11-09T14:30:00.000Z",
      customerName: "Ahmed Mohammed",
    },
    {
      id: 2,
      rating: 4,
      comment: "Good agent, but was a bit late to the appointment.",
      createdAt: "2025-11-08T10:15:00.000Z",
      customerName: "Sarah Johnson",
    },
  ],
  recentAppointments: [
    {
      id: 12,
      createdAt: "2025-11-11T12:02:43.397Z",
      updatedAt: "2025-11-11T12:02:43.397Z",
      appointmentDate: "2025-11-10",
      startTime: "09:00:00",
      endTime: "10:00:00",
      status: "pending",
      customerNotes: null,
      agentNotes: null,
      createdChannel: "web",
      customer: {
        id: 37,
        createdAt: "2025-11-11T07:52:12.053Z",
        updatedAt: "2025-11-11T07:57:58.579Z",
        phoneNumber: "011443801140",
        email: "mostafatamer@gmail.com",
        fullName: "mostafa tamer",
        userType: "customer",
        profilePhotoUrl: null,
        nationalIdUrl: null,
        residencyIdUrl: null,
        verificationStatus: "verified",
        verifiedAt: "2025-11-11T07:57:58.947Z",
        passwordHash:
          "$2b$12$pK9KGcQ3H0bzaXZ3SENzmed.MNuyh8s3sI5BTjzSu3KYm3eMQyuXu",
        emailOtp: null,
        emailOtpExpiresAt: null,
        resetOtp: null,
        resetOtpExpiresAt: null,
        isActive: true,
      },
      property: {
        id: 11,
        createdAt: "2025-11-11T09:56:39.919Z",
        updatedAt: "2025-11-11T09:56:39.919Z",
        title: "Elit earum itaque l",
        description: "Laborum cupiditate e",
        bedrooms: 52,
        bathrooms: 90,
        areaM2: "60.00",
        price: "370.00",
        propertyListingRequestId: null,
        specifications: "{}",
        guarantees: '{"Quia sint et delectu":"Nostrum quam deserun"}',
        accessType: "direct",
        ownerName: "Mallory Gardner",
        ownerPhone: "+1 (307) 773-1278",
        ownerNotes: null,
        latitude: null,
        longitude: null,
        mapPlaceId: null,
        isActive: true,
        propertyType: {
          id: 1,
          createdAt: "2025-10-18T13:11:08.135Z",
          updatedAt: "2025-10-18T13:11:08.135Z",
          name: "شقة",
          isActive: true,
        },
        city: {
          id: 1,
          createdAt: "2025-10-18T13:11:07.672Z",
          updatedAt: "2025-10-18T13:11:07.672Z",
          name: "الرياض",
          isActive: true,
        },
        area: {
          id: 1,
          createdAt: "2025-10-18T13:11:07.935Z",
          updatedAt: "2025-10-18T13:11:07.935Z",
          name: "الرياض - المنطقة الشمالية",
          isActive: true,
          city: {
            id: 1,
            createdAt: "2025-10-18T13:11:07.672Z",
            updatedAt: "2025-10-18T13:11:07.672Z",
            name: "الرياض",
            isActive: true,
          },
        },
        createdBy: {
          id: 1,
          createdAt: "2025-10-18T13:11:07.468Z",
          updatedAt: "2025-10-26T11:47:18.276Z",
          phoneNumber: "+966500000001",
          email: "admin@gmail.com",
          fullName: "System Administrator",
          userType: "admin",
          profilePhotoUrl: null,
          nationalIdUrl: null,
          residencyIdUrl: null,
          verificationStatus: "verified",
          verifiedAt: "2025-10-18T13:11:06.298Z",
          passwordHash:
            "$2b$12$cH7XJpEXYvJ3czL9VDZ9keqA6op7itNEcgwbrFwFnM8.FJidynhIO",
          emailOtp: null,
          emailOtpExpiresAt: null,
          resetOtp: null,
          resetOtpExpiresAt: null,
          isActive: true,
        },
        cityId: 1,
        areaId: 1,
      },
      agent: {
        id: 7,
        createdAt: "2025-10-18T13:11:07.468Z",
        updatedAt: "2025-10-18T13:11:07.468Z",
        phoneNumber: "+966500000007",
        email: "quality@gmail.com",
        fullName: "Quality Team Member",
        userType: "quality_team",
        profilePhotoUrl: null,
        nationalIdUrl: null,
        residencyIdUrl: null,
        verificationStatus: "verified",
        verifiedAt: "2025-10-18T13:11:06.298Z",
        passwordHash:
          "$2b$10$dJL7QOWcI1aswJ1te3IQ3eXDJ8HFqWOnnlx4K.Nkyo4emd57AcRW.",
        emailOtp: null,
        emailOtpExpiresAt: null,
        resetOtp: null,
        resetOtpExpiresAt: null,
        isActive: true,
      },
    },
  ],
});

// ... existing functions remain the same ...

// services/reports/dashboard.ts

import { api } from "@/libs/axios";

export interface Period {
  startDate: string;
  endDate: string;
}

export interface UserStats {
  totalUsers: number;
  totalAgents: number;
}

export interface AppointmentStats {
  totalAppointments: number;
  completedAppointments: number;
}

export interface PropertyStats {
  totalProperties: number;
}

export interface RevenueStats {
  totalVisitors: number;
  totalConversions: number;
  conversionRate: string;
}

export interface FinancialStats {
  totalRevenue: RevenueStats;
}

export interface DashboardOverview {
  period: Period;
  userStats: UserStats;
  appointmentStats: AppointmentStats;
  propertyStats: PropertyStats;
  financialStats: FinancialStats;
}

export interface DashboardComparison {
  period: Period;
  userStats: UserStats;
  appointmentStats: AppointmentStats;
  propertyStats: PropertyStats;
  financialStats: FinancialStats;
}

export interface AdminDashboardResponse {
  overview: DashboardOverview;
  comparison: DashboardComparison;
}

export interface DashboardFilterParams {
  startDate?: string;
  endDate?: string;
  period?: "day" | "week" | "month" | "year" | "custom";
  compareWithPrevious?: boolean;
}

// GET - Fetch admin dashboard data
export async function getAdminDashboard(
  params?: DashboardFilterParams,
  signal?: AbortSignal
): Promise<AdminDashboardResponse> {
  try {
    const response = await api.get("/reports/dashboard/admin", {
      params,
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    throw error;
  }
}

// GET - Fetch dashboard statistics with custom date range
export async function getDashboardStats(
  startDate: string,
  endDate: string,
  signal?: AbortSignal
): Promise<AdminDashboardResponse> {
  try {
    const response = await api.get("/reports/dashboard/admin", {
      params: {
        startDate,
        endDate,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

// Utility functions for calculating metrics
export function calculateGrowthPercentage(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function formatGrowthPercentage(growth: number): string {
  const sign = growth >= 0 ? "+" : "";
  return `${sign}${growth.toFixed(1)}%`;
}

export function calculateCompletionRate(
  appointments: AppointmentStats
): number {
  if (appointments.totalAppointments === 0) return 0;
  return (
    (appointments.completedAppointments / appointments.totalAppointments) * 100
  );
}

// Extended interface with calculated metrics
export interface EnhancedDashboardData extends AdminDashboardResponse {
  metrics: {
    userGrowth: number;
    agentGrowth: number;
    appointmentGrowth: number;
    completionRateGrowth: number;
    propertyGrowth: number;
    conversionGrowth: number;
    currentCompletionRate: number;
    previousCompletionRate: number;
  };
}

// GET - Fetch enhanced dashboard data with calculated metrics
export async function getEnhancedAdminDashboard(
  params?: DashboardFilterParams,
  signal?: AbortSignal
): Promise<EnhancedDashboardData> {
  try {
    const data = await getAdminDashboard(params, signal);

    // Calculate growth percentages
    const userGrowth = calculateGrowthPercentage(
      data.overview.userStats.totalUsers,
      data.comparison.userStats.totalUsers
    );

    const agentGrowth = calculateGrowthPercentage(
      data.overview.userStats.totalAgents,
      data.comparison.userStats.totalAgents
    );

    const appointmentGrowth = calculateGrowthPercentage(
      data.overview.appointmentStats.totalAppointments,
      data.comparison.appointmentStats.totalAppointments
    );

    const propertyGrowth = calculateGrowthPercentage(
      data.overview.propertyStats.totalProperties,
      data.comparison.propertyStats.totalProperties
    );

    const conversionGrowth = calculateGrowthPercentage(
      data.overview.financialStats.totalRevenue.totalConversions,
      data.comparison.financialStats.totalRevenue.totalConversions
    );

    // Calculate completion rates
    const currentCompletionRate = calculateCompletionRate(
      data.overview.appointmentStats
    );
    const previousCompletionRate = calculateCompletionRate(
      data.comparison.appointmentStats
    );

    const completionRateGrowth = calculateGrowthPercentage(
      currentCompletionRate,
      previousCompletionRate
    );

    return {
      ...data,
      metrics: {
        userGrowth,
        agentGrowth,
        appointmentGrowth,
        completionRateGrowth,
        propertyGrowth,
        conversionGrowth,
        currentCompletionRate,
        previousCompletionRate,
      },
    };
  } catch (error) {
    console.error("Error fetching enhanced admin dashboard:", error);
    throw error;
  }
}

// GET - Fetch quick stats for dashboard cards
export async function getDashboardQuickStats(signal?: AbortSignal): Promise<{
  totalUsers: number;
  totalAgents: number;
  totalProperties: number;
  totalAppointments: number;
  conversionRate: string;
}> {
  try {
    const data = await getAdminDashboard({}, signal);

    return {
      totalUsers: data.overview.userStats.totalUsers,
      totalAgents: data.overview.userStats.totalAgents,
      totalProperties: data.overview.propertyStats.totalProperties,
      totalAppointments: data.overview.appointmentStats.totalAppointments,
      conversionRate: data.overview.financialStats.totalRevenue.conversionRate,
    };
  } catch (error) {
    console.error("Error fetching quick stats:", error);
    throw error;
  }
}

// Types for specific dashboard components
export interface StatsCardData {
  title: string;
  value: number | string;
  growth?: number;
  icon?: string;
  format?: "number" | "percentage" | "currency";
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label: string;
}

// Mock data generators for development (remove in production)
export const generateMockDashboardData = (): AdminDashboardResponse => ({
  overview: {
    period: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString(),
    },
    userStats: {
      totalUsers: 8,
      totalAgents: 2,
    },
    appointmentStats: {
      totalAppointments: 6,
      completedAppointments: 0,
    },
    propertyStats: {
      totalProperties: 500,
    },
    financialStats: {
      totalRevenue: {
        totalVisitors: 5,
        totalConversions: 2,
        conversionRate: "40.00%",
      },
    },
  },
  comparison: {
    period: {
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    userStats: {
      totalUsers: 0,
      totalAgents: 0,
    },
    appointmentStats: {
      totalAppointments: 0,
      completedAppointments: 0,
    },
    propertyStats: {
      totalProperties: 0,
    },
    financialStats: {
      totalRevenue: {
        totalVisitors: 0,
        totalConversions: 0,
        conversionRate: "0%",
      },
    },
  },
});

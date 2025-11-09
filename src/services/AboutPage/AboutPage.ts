// services/appointments/appointments.ts

import { api } from "@/libs/axios";

export interface AppointmentsResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Array<{
    id: number;
    createdAt: string;
    updatedAt: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    status: string;
    customerNotes: string | null;
    agentNotes: string | null;
    createdChannel: string;
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
      specifications: any;
      guarantees: any;
      accessType: string;
      ownerName: string | null;
      ownerPhone: string | null;
      ownerNotes: string | null;
      latitude: number | null;
      longitude: number | null;
      mapPlaceId: string | null;
      isActive: boolean;
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
      } | null;
      cityId: number;
      areaId: number | null;
    };
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
    } | null;
  }>;
}

export async function getAppointments(
  params?: Record<string, string>,
  signal?: AbortSignal
) {
  try {
    const response = await api.get("/appointments", {
      params,
      signal,
    });

    // Based on your API response structure
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

// services/appointments/appointments.ts

import { api } from "@/libs/axios";

export interface Appointment {
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
}

export interface AppointmentsResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Appointment[];
}

export interface CreateAppointmentData {
  appointmentDate: string;
  startTime: string;
  endTime: string;
  propertyId: number;
  customerId: number;
  agentId?: number;
  customerNotes?: string;
  agentNotes?: string;
  createdChannel?: string;
}

export interface UpdateAppointmentData {
  appointmentDate?: string;
  startTime?: string;
  endTime?: string;
  propertyId?: number;
  customerId?: number;
  agentId?: number;
  customerNotes?: string;
  agentNotes?: string;
  status?: string;
}

// GET - Fetch all appointments with pagination and filtering
export async function getAppointments(
  params?: Record<string, string>,
  signal?: AbortSignal
): Promise<AppointmentsResponse> {
  try {
    const response = await api.get("/appointments", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

// GET - Fetch single appointment by ID
export async function getAppointmentById(
  id: number,
  signal?: AbortSignal
): Promise<Appointment> {
  try {
    const response = await api.get(`/appointments/${id}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching appointment ${id}:`, error);
    throw error;
  }
}

// POST - Create new appointment
export async function createAppointment(
  data: CreateAppointmentData,
  signal?: AbortSignal
): Promise<Appointment> {
  try {
    const response = await api.post("/appointments", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}

// PATCH - Update appointment
export async function updateAppointment(
  id: number,
  data: UpdateAppointmentData,
  signal?: AbortSignal
): Promise<Appointment> {
  try {
    const response = await api.patch(`/appointments/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating appointment ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete appointment
export async function deleteAppointment(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/appointments/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting appointment ${id}:`, error);
    throw error;
  }
}

// GET - Get appointments by client ID
export async function getAppointmentsByClient(
  customerId: number,
  params?: Record<string, string>,
  signal?: AbortSignal
): Promise<AppointmentsResponse> {
  try {
    const response = await api.get(`/appointments/customer/${customerId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error fetching appointments for customer ${customerId}:`,
      error
    );
    throw error;
  }
}

// GET - Get appointments by agent ID
export async function getAppointmentsByAgent(
  agentId: number,
  params?: Record<string, string>,
  signal?: AbortSignal
): Promise<AppointmentsResponse> {
  try {
    const response = await api.get(`/appointments/agent/${agentId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching appointments for agent ${agentId}:`, error);
    throw error;
  }
}

// GET - Get appointments by property ID
export async function getAppointmentsByProperty(
  propertyId: number,
  params?: Record<string, string>,
  signal?: AbortSignal
): Promise<AppointmentsResponse> {
  try {
    const response = await api.get(`/appointments/property/${propertyId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error fetching appointments for property ${propertyId}:`,
      error
    );
    throw error;
  }
}

// POST - Reschedule appointment
export async function rescheduleAppointment(
  id: number,
  data: {
    appointmentDate: string;
    startTime: string;
    endTime: string;
    reason?: string;
  },
  signal?: AbortSignal
): Promise<Appointment> {
  try {
    const response = await api.post(`/appointments/${id}/reschedule`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error rescheduling appointment ${id}:`, error);
    throw error;
  }
}

// POST - Cancel appointment
export async function cancelAppointment(
  id: number,
  reason?: string,
  signal?: AbortSignal
): Promise<Appointment> {
  try {
    const response = await api.post(
      `/appointments/${id}/cancel`,
      { reason },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error canceling appointment ${id}:`, error);
    throw error;
  }
}

// POST - Complete appointment
export async function completeAppointment(
  id: number,
  agentNotes?: string,
  signal?: AbortSignal
): Promise<Appointment> {
  try {
    const response = await api.post(
      `/appointments/${id}/complete`,
      { agentNotes },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error completing appointment ${id}:`, error);
    throw error;
  }
}

// GET - Check appointment availability
export async function checkAppointmentAvailability(
  data: {
    appointmentDate: string;
    startTime: string;
    endTime: string;
    agentId?: number;
    propertyId?: number;
  },
  signal?: AbortSignal
): Promise<{ available: boolean; conflict?: Appointment }> {
  try {
    const response = await api.post("/appointments/check-availability", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error checking appointment availability:", error);
    throw error;
  }
}
// Add this to your existing appointments.ts service file

// POST - Update appointment status
export async function updateAppointmentStatus(
  id: number,
  data: {
    status: string;
    notes?: string;
  },
  signal?: AbortSignal
): Promise<Appointment> {
  try {
    const response = await api.post(`/appointments/${id}/update-status`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating appointment status ${id}:`, error);
    throw error;
  }
}

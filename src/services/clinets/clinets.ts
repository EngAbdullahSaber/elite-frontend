// services/clients/clients.ts

import { api } from "@/libs/axios";

export interface Client {
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
  verifiedAt: string | null;
  passwordHash: string;
  emailOtp: string | null;
  emailOtpExpiresAt: string | null;
  resetOtp: string | null;
  resetOtpExpiresAt: string | null;
  isActive: boolean;
}

export interface ClientsResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Client[];
}

export interface CreateClientData {
  phoneNumber: string;
  email: string;
  fullName: string;
  password?: string;
  profilePhotoUrl?: string;
  nationalIdUrl?: string;
  residencyIdUrl?: string;
}

export interface UpdateClientData {
  phoneNumber?: string;
  email?: string;
  fullName?: string;
  profilePhotoUrl?: string | null;
  nationalIdUrl?: string | null;
  residencyIdUrl?: string | null;
  isActive?: boolean;
}

// GET - Fetch all clients with pagination and filtering
export async function getClients(
  params?: {
    page?: number;
    limit?: number;
    userType?: string; // 'customer' for clients

    search?: string;
    verificationStatus?: string;
    isActive?: boolean;
    createdAt_from?: string;
    createdAt_to?: string;
  },
  signal?: AbortSignal
): Promise<ClientsResponse> {
  try {
    const response = await api.get("/users", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}

// GET - Fetch single client by ID
export async function getClientById(
  id: number,
  signal?: AbortSignal
): Promise<Client> {
  try {
    const response = await api.get(`/users/${id}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching client ${id}:`, error);
    throw error;
  }
}

// POST - Create new client
export async function createClient(data: FormData): Promise<Client> {
  try {
    const response = await api.post("/users", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
}

// PATCH - Update client
export async function updateClient(
  id: number,
  data: UpdateClientData
): Promise<Client> {
  try {
    const response = await api.patch(`/users/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating client ${id}:`, error);
    throw error;
  }
}

// PUT - Update client (alternative to PATCH)
export async function updateClientPut(
  id: number,
  data: UpdateClientData,
  signal?: AbortSignal
): Promise<Client> {
  try {
    const response = await api.put(`/users/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating client ${id}:`, error);
    throw error;
  }
}

// POST - Update client status
export async function updateClientStatus(
  id: number,
  isActive: boolean,
  signal?: AbortSignal
): Promise<Client> {
  try {
    const response = await api.post(`/users/${id}/${isActive}`, { signal });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating client status ${id}:`, error);
    throw error;
  }
}

// POST - Update client verification status
export async function updateClientVerification(
  id: number,
  verificationStatus: string,
  signal?: AbortSignal
): Promise<Client> {
  try {
    const response = await api.post(
      `/users/${id}/verification`,
      { verificationStatus },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating client verification ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete client
export async function deleteClient(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/users/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting client ${id}:`, error);
    throw error;
  }
}

// GET - Get clients by type (specifically customers)
export async function getCustomers(
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    verificationStatus?: string;
    isActive?: boolean;
    createdAt_from?: string;
    createdAt_to?: string;
  },
  signal?: AbortSignal
): Promise<ClientsResponse> {
  try {
    const response = await api.get("/users", {
      params: {
        userType: "customer",
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
}

// GET - Search clients
export async function searchClients(
  query: string,
  params?: {
    page?: number;
    limit?: number;
    userType?: string;
  },
  signal?: AbortSignal
): Promise<ClientsResponse> {
  try {
    const response = await api.get("/users/search", {
      params: {
        search: query,
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error searching clients:", error);
    throw error;
  }
}

// GET - Get client statistics
export async function getClientStats(
  id: number,
  signal?: AbortSignal
): Promise<{
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  totalPropertiesViewed: number;
}> {
  try {
    const response = await api.get(`/users/${id}/stats`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching stats for client ${id}:`, error);
    throw error;
  }
}

// GET - Get client appointments
export async function getClientAppointments(
  clientId: number,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
  },
  signal?: AbortSignal
): Promise<any> {
  try {
    const response = await api.get(`/users/${clientId}/appointments`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching appointments for client ${clientId}:`, error);
    throw error;
  }
}

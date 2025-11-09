// services/agents/agents.ts

import { api } from "@/libs/axios";

export interface AgentUser {
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

export interface City {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  isActive: boolean;
}

export interface Agent {
  id: number;
  createdAt: string;
  updatedAt: string;
  identityProofUrl: string;
  residencyDocumentUrl: string;
  status: string; // 'pending', 'approved', 'rejected'
  kycNotes: string | null;
  user: AgentUser;
  city: City;
}

export interface AgentsResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Agent[];
}

export interface CreateAgentData {
  phoneNumber: string;
  email: string;
  fullName: string;
  password?: string;
  profilePhotoUrl?: string;
  nationalIdUrl?: string;
  residencyIdUrl?: string;
  identityProofUrl: string;
  residencyDocumentUrl: string;
  cityId: number;
  kycNotes?: string;
}

export interface UpdateAgentData {
  phoneNumber?: string;
  email?: string;
  fullName?: string;
  profilePhotoUrl?: string | null;
  nationalIdUrl?: string | null;
  residencyIdUrl?: string | null;
  identityProofUrl?: string;
  residencyDocumentUrl?: string;
  cityId?: number;
  status?: string;
  kycNotes?: string | null;
  isActive?: boolean;
}

export interface AgentStats {
  totalProperties: number;
  activeProperties: number;
  totalAppointments: number;
  completedAppointments: number;
  totalEarnings: number;
  pendingEarnings: number;
}

// GET - Fetch all agents with pagination and filtering
export async function getAgents(
  params?: {
    page?: number;
    limit?: number;
    status?: string; // 'pending', 'approved', 'rejected'
    cityId?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    search?: string;
    isActive?: boolean;
    createdAt_from?: string;
    createdAt_to?: string;
  },
  signal?: AbortSignal
): Promise<AgentsResponse> {
  try {
    const response = await api.get("/agents", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching agents:", error);
    throw error;
  }
}

// GET - Fetch single agent by ID
export async function getAgentById(
  id: number,
  signal?: AbortSignal
): Promise<Agent> {
  try {
    const response = await api.get(`/agents/${id}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching agent ${id}:`, error);
    throw error;
  }
}

// POST - Create new agent
export async function createAgent(data: CreateAgentData): Promise<Agent> {
  try {
    const response = await api.post("/agents", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating agent:", error);
    throw error;
  }
}

// PATCH - Update agent
export async function updateAgent(
  id: number,
  data: UpdateAgentData,
  signal?: AbortSignal
): Promise<Agent> {
  try {
    const response = await api.patch(`/agents/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating agent ${id}:`, error);
    throw error;
  }
}

// PUT - Update agent (alternative to PATCH)
export async function updateAgentPut(
  id: number,
  data: UpdateAgentData,
  signal?: AbortSignal
): Promise<Agent> {
  try {
    const response = await api.put(`/agents/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating agent ${id}:`, error);
    throw error;
  }
}

// POST - Update agent status (KYC approval)
export async function updateAgentStatus(
  id: number,
  status: string, // 'approved', 'rejected'
  kycNotes?: string,
  signal?: AbortSignal
): Promise<Agent> {
  try {
    const response = await api.post(
      `/agents/${id}/approve`,
      { status, kycNotes },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating agent status ${id}:`, error);
    throw error;
  }
}

// POST - Update agent activation status
export async function updateAgentActivation(
  id: number,
  isActive: boolean,
  signal?: AbortSignal
): Promise<Agent> {
  try {
    const response = await api.post(
      `/agents/${id}/activation`,
      { isActive },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating agent activation ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete agent
export async function deleteAgent(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/agents/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting agent ${id}:`, error);
    throw error;
  }
}

// GET - Get agents by city
export async function getAgentsByCity(
  cityId: number,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<AgentsResponse> {
  try {
    const response = await api.get(`/agents/city/${cityId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching agents for city ${cityId}:`, error);
    throw error;
  }
}

// GET - Get agents by status
export async function getAgentsByStatus(
  status: string,
  params?: {
    page?: number;
    limit?: number;
    cityId?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<AgentsResponse> {
  try {
    const response = await api.get(`/agents/status/${status}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching agents with status ${status}:`, error);
    throw error;
  }
}

// GET - Get agent statistics
export async function getAgentStats(
  id: number,
  signal?: AbortSignal
): Promise<AgentStats> {
  try {
    const response = await api.get(`/agents/${id}/stats`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching stats for agent ${id}:`, error);
    throw error;
  }
}

// GET - Get agent properties
export async function getAgentProperties(
  agentId: number,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
  },
  signal?: AbortSignal
): Promise<any> {
  try {
    const response = await api.get(`/agents/${agentId}/properties`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching properties for agent ${agentId}:`, error);
    throw error;
  }
}

// GET - Get agent appointments
export async function getAgentAppointments(
  agentId: number,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
  },
  signal?: AbortSignal
): Promise<any> {
  try {
    const response = await api.get(`/agents/${agentId}/appointments`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching appointments for agent ${agentId}:`, error);
    throw error;
  }
}

// GET - Search agents
export async function searchAgents(
  query: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    cityId?: number;
  },
  signal?: AbortSignal
): Promise<AgentsResponse> {
  try {
    const response = await api.get("/agents/search", {
      params: {
        search: query,
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error searching agents:", error);
    throw error;
  }
}

// GET - Get pending agents (for KYC approval)
export async function getPendingAgents(
  params?: {
    page?: number;
    limit?: number;
    cityId?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<AgentsResponse> {
  try {
    const response = await api.get("/agents", {
      params: {
        status: "pending",
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching pending agents:", error);
    throw error;
  }
}

// POST - Upload agent documents
export async function uploadAgentDocuments(
  id: number,
  documents: {
    identityProofUrl: string;
    residencyDocumentUrl: string;
  },
  signal?: AbortSignal
): Promise<Agent> {
  try {
    const response = await api.post(`/agents/${id}/documents`, documents, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error uploading documents for agent ${id}:`, error);
    throw error;
  }
}

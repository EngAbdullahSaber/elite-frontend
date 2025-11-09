// services/reviews/reviews.ts

import { api } from "@/libs/axios";

export interface Customer {
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
}

export interface ReviewDimension {
  id: number;
  createdAt: string;
  updatedAt: string;
  dimension: string;
  score: number;
}

export interface Review {
  id: number;
  createdAt: string;
  updatedAt: string;
  agentId: number;
  rating: number;
  reviewText: string;
  isApproved: boolean;
  appointment: Appointment;
  customer: Customer;
  dimensions: ReviewDimension[];
}

export interface ReviewsResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Review[];
}

export interface CreateReviewData {
  agentId: number;
  rating: number;
  reviewText: string;
  appointmentId: number;
  dimensions?: {
    dimension: string;
    score: number;
  }[];
}

export interface UpdateReviewData {
  rating?: number;
  reviewText?: string;
  isApproved?: boolean;
  dimensions?: {
    dimension: string;
    score: number;
  }[];
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
  dimensionAverages: {
    dimension: string;
    averageScore: number;
    totalReviews: number;
  }[];
  totalAppointments: number;
  reviewRate: number; // Percentage of appointments with reviews
}

export interface AgentReviewStats {
  agentId: number;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
  dimensionAverages: {
    dimension: string;
    averageScore: number;
    totalReviews: number;
  }[];
}

// GET - Fetch all customer reviews with pagination and filtering
export async function getCustomerReviews(
  params?: {
    page?: number;
    limit?: number;
    agentId?: number;
    rating?: number;
    isApproved?: boolean;
    customerId?: number;
    appointmentId?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    withDimensions?: boolean;
  },
  signal?: AbortSignal
): Promise<ReviewsResponse> {
  try {
    const response = await api.get("/reviews/customer", {
      params,
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching customer reviews:", error);
    throw error;
  }
}

// GET - Fetch single review by ID
export async function getReviewById(
  id: number,
  signal?: AbortSignal
): Promise<Review> {
  try {
    const response = await api.get(`/reviews/customer/${id}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching review ${id}:`, error);
    throw error;
  }
}
// GET - Fetch all Agent reviews with pagination and filtering
export async function getAgentReviews(
  params?: {
    page?: number;
    limit?: number;
    agentId?: number;
    rating?: number;
    isApproved?: boolean;
    customerId?: number;
    appointmentId?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    withDimensions?: boolean;
  },
  signal?: AbortSignal
): Promise<ReviewsResponse> {
  try {
    const response = await api.get("/reviews/agent", {
      params,
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching customer reviews:", error);
    throw error;
  }
}
// POST - Create new review
export async function createReview(
  data: CreateReviewData,
  signal?: AbortSignal
): Promise<Review> {
  try {
    const response = await api.post("/reviews/customer", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}

// PATCH - Update review
export async function updateReview(
  id: number,
  data: UpdateReviewData,
  signal?: AbortSignal
): Promise<Review> {
  try {
    const response = await api.patch(`/reviews/customer/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating review ${id}:`, error);
    throw error;
  }
}

// PUT - Update review (alternative to PATCH)
export async function updateReviewPut(
  id: number,
  data: UpdateReviewData,
  signal?: AbortSignal
): Promise<Review> {
  try {
    const response = await api.put(`/reviews/customer/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating review ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete review
export async function deleteReview(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/reviews/customer/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting review ${id}:`, error);
    throw error;
  }
}

// GET - Get reviews by agent ID
export async function getReviewsByAgent(
  agentId: number,
  params?: {
    page?: number;
    limit?: number;
    isApproved?: boolean;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<ReviewsResponse> {
  try {
    const response = await api.get(`/reviews/customer/agent/${agentId}`, {
      params,
      signal,
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for agent ${agentId}:`, error);
    throw error;
  }
}

// GET - Get reviews by customer ID
export async function getReviewsByCustomer(
  customerId: number,
  params?: {
    page?: number;
    limit?: number;
    isApproved?: boolean;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<ReviewsResponse> {
  try {
    const response = await api.get(`/reviews/customer/customer/${customerId}`, {
      params,
      signal,
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for customer ${customerId}:`, error);
    throw error;
  }
}

// GET - Get approved reviews
export async function getApprovedReviews(
  params?: {
    page?: number;
    limit?: number;
    agentId?: number;
    rating?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<ReviewsResponse> {
  try {
    const response = await api.get("/reviews/customer", {
      params: {
        isApproved: true,
        ...params,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    throw error;
  }
}

// GET - Get pending reviews (not approved)
export async function getPendingReviews(
  params?: {
    page?: number;
    limit?: number;
    agentId?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<ReviewsResponse> {
  try {
    const response = await api.get("/reviews/customer", {
      params: {
        isApproved: false,
        ...params,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    throw error;
  }
}

// POST - Approve review
export async function approveReview(
  id: number,
  signal?: AbortSignal
): Promise<Review> {
  try {
    const response = await api.post(
      `/reviews/customer/${id}/approve`,
      {},
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error approving review ${id}:`, error);
    throw error;
  }
}

// POST - Reject review
export async function rejectReview(
  id: number,
  signal?: AbortSignal
): Promise<Review> {
  try {
    const response = await api.post(
      `/reviews/customer/${id}/reject`,
      {},
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error rejecting review ${id}:`, error);
    throw error;
  }
}

// GET - Get review statistics
export async function getReviewStats(
  params?: {
    agentId?: number;
    startDate?: string;
    endDate?: string;
    includeDimensions?: boolean;
  },
  signal?: AbortSignal
): Promise<ReviewStats> {
  try {
    const response = await api.get("/reviews/customer/stats", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching review statistics:", error);
    throw error;
  }
}

// GET - Get agent review statistics
export async function getAgentReviewStats(
  agentId: number,
  params?: {
    startDate?: string;
    endDate?: string;
    includeDimensions?: boolean;
  },
  signal?: AbortSignal
): Promise<AgentReviewStats> {
  try {
    const response = await api.get(`/reviews/customer/agent/${agentId}/stats`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching stats for agent ${agentId}:`, error);
    throw error;
  }
}

// GET - Search reviews by text
export async function searchReviews(
  query: string,
  params?: {
    page?: number;
    limit?: number;
    agentId?: number;
    isApproved?: boolean;
    rating?: number;
  },
  signal?: AbortSignal
): Promise<ReviewsResponse> {
  try {
    const response = await api.get("/reviews/customer/search", {
      params: {
        search: query,
        ...params,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error searching reviews:", error);
    throw error;
  }
}

// GET - Get reviews with high ratings (4+ stars)
export async function getHighRatedReviews(
  params?: {
    page?: number;
    limit?: number;
    agentId?: number;
    minRating?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<ReviewsResponse> {
  try {
    const response = await api.get("/reviews/customer", {
      params: {
        rating: params?.minRating || 4,
        ...params,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching high rated reviews:", error);
    throw error;
  }
}

// GET - Get reviews by rating
export async function getReviewsByRating(
  rating: number,
  params?: {
    page?: number;
    limit?: number;
    agentId?: number;
    isApproved?: boolean;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<ReviewsResponse> {
  try {
    const response = await api.get("/reviews/customer", {
      params: {
        rating,
        ...params,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews with rating ${rating}:`, error);
    throw error;
  }
}

// GET - Get recent reviews
export async function getRecentReviews(
  params?: {
    page?: number;
    limit?: number;
    days?: number;
    agentId?: number;
    isApproved?: boolean;
  },
  signal?: AbortSignal
): Promise<ReviewsResponse> {
  try {
    const response = await api.get("/reviews/customer/recent", {
      params,
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching recent reviews:", error);
    throw error;
  }
}

// POST - Bulk update review approval status
export async function bulkUpdateReviewApproval(
  reviewIds: number[],
  isApproved: boolean,
  signal?: AbortSignal
): Promise<{ updated: number; failed: number }> {
  try {
    const response = await api.post(
      "/reviews/customer/bulk-approval",
      {
        reviewIds,
        isApproved,
      },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error bulk updating review approval:", error);
    throw error;
  }
}

// GET - Get review dimensions summary
export async function getReviewDimensionsSummary(
  params?: {
    agentId?: number;
    startDate?: string;
    endDate?: string;
  },
  signal?: AbortSignal
): Promise<{
  dimensions: {
    dimension: string;
    averageScore: number;
    totalReviews: number;
    scoreDistribution: {
      score: number;
      count: number;
    }[];
  }[];
}> {
  try {
    const response = await api.get("/reviews/customer/dimensions/summary", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching review dimensions summary:", error);
    throw error;
  }
}

// services/favorites/favorites.ts

import { api } from "@/libs/axios";

export interface FavoriteUser {
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

export interface PropertySpecifications {
  pool?: boolean;
  garden?: boolean;
  parking?: boolean;
  furnished?: boolean;
  [key: string]: any;
}

export interface PropertyGuarantees {
  warranty?: string;
  maintenance?: string;
  [key: string]: any;
}

export interface FavoriteProperty {
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
  specifications: PropertySpecifications;
  guarantees: PropertyGuarantees;
  accessType: string;
  ownerName: string;
  ownerPhone: string;
  ownerNotes: string | null;
  latitude: number | null;
  longitude: number | null;
  mapPlaceId: string | null;
  isActive: boolean;
  cityId: number;
  areaId: number;
}

export interface Favorite {
  id: number;
  createdAt: string;
  updatedAt: string;
  note: string | null;
  user: FavoriteUser;
  property: FavoriteProperty;
}

export interface FavoritesResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Favorite[];
}

export interface ToggleFavoriteData {
  propertyId: number;
  note?: string;
}

export interface ToggleFavoriteResponse {
  message: string;
  data: {
    favorite?: Favorite; // Present when adding to favorites
    removed?: boolean; // Present when removing from favorites
  };
}

// POST - Toggle favorite (add/remove)
export async function toggleFavorite(
  data: ToggleFavoriteData,
  signal?: AbortSignal
): Promise<ToggleFavoriteResponse> {
  try {
    const response = await api.post("/favorites", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
}

// GET - Fetch user favorites with pagination
export async function getFavorites(
  params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    propertyId?: number;
    userId?: number;
  },
  signal?: AbortSignal
): Promise<FavoritesResponse> {
  try {
    const response = await api.get("/favorites", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
}

// GET - Check if property is favorited by current user
export async function checkIsFavorited(
  propertyId: number,
  signal?: AbortSignal
): Promise<{ isFavorited: boolean; favorite?: Favorite }> {
  try {
    const response = await api.get("/favorites/check", {
      params: { propertyId },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error checking favorite status for property ${propertyId}:`,
      error
    );
    throw error;
  }
}

// DELETE - Remove favorite by ID
export async function removeFavorite(
  favoriteId: number,
  signal?: AbortSignal
): Promise<{ message: string }> {
  try {
    const response = await api.delete(`/favorites/${favoriteId}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error removing favorite ${favoriteId}:`, error);
    throw error;
  }
}

// DELETE - Remove favorite by property ID
export async function removeFavoriteByProperty(
  propertyId: number,
  signal?: AbortSignal
): Promise<{ message: string }> {
  try {
    const response = await api.delete("/favorites/by-property", {
      params: { propertyId },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error removing favorite for property ${propertyId}:`, error);
    throw error;
  }
}

// PUT - Update favorite note
export async function updateFavoriteNote(
  favoriteId: number,
  note: string,
  signal?: AbortSignal
): Promise<Favorite> {
  try {
    const response = await api.put(
      `/favorites/${favoriteId}/note`,
      { note },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating favorite note ${favoriteId}:`, error);
    throw error;
  }
}

// GET - Get favorites count for current user
export async function getFavoritesCount(
  signal?: AbortSignal
): Promise<{ count: number }> {
  try {
    const response = await api.get("/favorites/count", {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching favorites count:", error);
    throw error;
  }
}

// GET - Get favorites by property ID
export async function getFavoritesByProperty(
  propertyId: number,
  params?: {
    page?: number;
    limit?: number;
  },
  signal?: AbortSignal
): Promise<FavoritesResponse> {
  try {
    const response = await api.get(`/favorites/property/${propertyId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error fetching favorites for property ${propertyId}:`,
      error
    );
    throw error;
  }
}

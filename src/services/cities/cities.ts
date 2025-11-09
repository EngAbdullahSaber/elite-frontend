// services/cities/cities.ts

import { api } from "@/libs/axios";

export interface City {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  isActive: boolean;
}

export interface Area {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  isActive: boolean;
  city: City;
}

export interface AreasResponse {
  total_records: number;
  current_page: number;
  per_page: number;
  records: Area[];
}

export interface CreateCityData {
  name: string;
  isActive?: boolean;
}

export interface UpdateCityData {
  name?: string;
  isActive?: boolean;
}

export interface CreateAreaData {
  name: string;
  cityId: number;
  isActive?: boolean;
}

export interface UpdateAreaData {
  name?: string;
  cityId?: number;
  isActive?: boolean;
}

// City endpoints
export async function getCities(
  params?: Record<string, string>,
  signal?: AbortSignal
) {
  try {
    const response = await api.get("/master-data/cities", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
}

export async function getCity(cityId: number, signal?: AbortSignal) {
  try {
    const response = await api.get(`/master-data/cities/${cityId}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching city:", error);
    throw error;
  }
}

export async function createCity(data: CreateCityData, signal?: AbortSignal) {
  try {
    const response = await api.post("/master-data/cities", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating city:", error);
    throw error;
  }
}

export async function updateCity(
  cityId: number,
  data: UpdateCityData,
  signal?: AbortSignal
) {
  try {
    const response = await api.patch(`/master-data/cities/${cityId}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error updating city:", error);
    throw error;
  }
}

export async function deleteCity(cityId: number, signal?: AbortSignal) {
  try {
    const response = await api.delete(`/master-data/cities/${cityId}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error deleting city:", error);
    throw error;
  }
}

export async function toggleCityStatus(
  cityId: number,
  isActive: boolean,
  signal?: AbortSignal
) {
  try {
    const response = await api.patch(
      `/master-data/cities/${cityId}`,
      { isActive },
      {
        signal,
      }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error toggling city status:", error);
    throw error;
  }
}

// Area/Region endpoints
export async function getRegions(
  params?: Record<string, string>,
  signal?: AbortSignal
) {
  try {
    const response = await api.get("/master-data/areas", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching areas:", error);
    throw error;
  }
}

export async function getRegion(areaId: number, signal?: AbortSignal) {
  try {
    const response = await api.get(`/master-data/areas/${areaId}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching area:", error);
    throw error;
  }
}

export async function getRegionsByCity(
  cityId: number,
  params?: Record<string, string>,
  signal?: AbortSignal
) {
  try {
    const response = await api.get(`/master-data/areas/city/${cityId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching areas by city:", error);
    throw error;
  }
}

export async function createRegion(data: CreateAreaData, signal?: AbortSignal) {
  try {
    const response = await api.post("/master-data/areas", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating area:", error);
    throw error;
  }
}

export async function updateRegion(
  areaId: number,
  data: UpdateAreaData,
  signal?: AbortSignal
) {
  try {
    const response = await api.patch(`/master-data/areas/${areaId}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error updating area:", error);
    throw error;
  }
}

export async function deleteRegion(areaId: number, signal?: AbortSignal) {
  try {
    const response = await api.delete(`/master-data/areas/${areaId}`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error deleting area:", error);
    throw error;
  }
}

export async function toggleRegionStatus(
  areaId: number,
  isActive: boolean,
  signal?: AbortSignal
) {
  try {
    const response = await api.patch(
      `/master-data/areas/${areaId}`,
      { isActive },
      {
        signal,
      }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error toggling area status:", error);
    throw error;
  }
}

// Helper function to get cities with their areas count
export async function getCitiesWithRegionsCount(signal?: AbortSignal) {
  try {
    const [citiesResponse, areasResponse] = await Promise.all([
      getCities(undefined, signal),
      getRegions(undefined, signal),
    ]);

    // Count areas per city
    const areasCountMap = areasResponse.records.reduce(
      (acc: { [key: number]: number }, area: Area) => {
        acc[area.city.id] = (acc[area.city.id] || 0) + 1;
        return acc;
      },
      {}
    );

    // Merge cities with their areas count
    const citiesWithAreas = citiesResponse.records.map((city: City) => ({
      ...city,
      areasCount: areasCountMap[city.id] || 0,
    }));

    return {
      ...citiesResponse,
      records: citiesWithAreas,
    };
  } catch (error) {
    console.error("Error fetching cities with areas count:", error);
    throw error;
  }
}

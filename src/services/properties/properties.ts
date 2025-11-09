// services/properties/properties.ts

import { api } from "@/libs/axios";

export interface PropertyMedia {
  id: number;
  createdAt: string;
  updatedAt: string;
  mediaUrl: string;
  isPrimary: boolean;
  orderIndex: number;
}

export interface PropertyType {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  isActive: boolean;
}

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
}

export interface PropertyUser {
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
}

export interface PropertySpecifications {
  parking?: boolean;
  furnished?: boolean;
  pool?: boolean;
  garden?: boolean;
  elevator?: boolean;
  security?: boolean;
  utilities?: string;
  roadAccess?: string;
  [key: string]: any;
}

export interface PropertyGuarantees {
  warranty?: string;
  maintenance?: string;
  ownership?: string;
  [key: string]: any;
}

export interface Property {
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
  accessType: string; // 'mediated', 'direct'
  ownerName: string | null;
  ownerPhone: string | null;
  ownerNotes: string | null;
  latitude: number | null;
  longitude: number | null;
  mapPlaceId: string | null;
  isActive: boolean;
  propertyType: PropertyType;
  city: City;
  area: Area | null;
  createdBy: PropertyUser;
  medias: PropertyMedia[];
  cityId: number;
  areaId: number | null;
}

export type PropertiesResponse = {
  records: Property[];
  total_records: number;
  current_page: number;
  per_page: number;
  total_pages: number;
};

export interface CreatePropertyData {
  title: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  areaM2: string;
  price: string;
  propertyTypeId: number;
  cityId: number;
  areaId?: number | null;
  specifications?: PropertySpecifications;
  guarantees?: PropertyGuarantees;
  accessType: string;
  ownerName?: string | null;
  ownerPhone?: string | null;
  ownerNotes?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  mapPlaceId?: string | null;
  isActive?: boolean;
  medias?: Array<{
    mediaUrl: string;
    isPrimary?: boolean;
    orderIndex?: number;
  }>;
}

export interface UpdatePropertyData {
  title?: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaM2?: string;
  price?: string;
  propertyTypeId?: number;
  cityId?: number;
  areaId?: number | null;
  specifications?: PropertySpecifications;
  guarantees?: PropertyGuarantees;
  accessType?: string;
  ownerName?: string | null;
  ownerPhone?: string | null;
  ownerNotes?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  mapPlaceId?: string | null;
  isActive?: boolean;
  medias?: Array<{
    mediaUrl: string;
    isPrimary?: boolean;
    orderIndex?: number;
  }>;
}

export interface PropertyStats {
  totalProperties: number;
  activeProperties: number;
  inactiveProperties: number;
  totalVillas: number;
  totalApartments: number;
  totalLands: number;
  averagePrice: number;
  totalViews: number;
  totalContacts: number;
}

export interface PropertyFilterParams {
  page?: number;
  limit?: number;
  cityId?: number;
  areaId?: number;
  propertyTypeId?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  isActive?: boolean;
  search?: string;
  accessType?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  createdBy?: number;
  hasImages?: boolean;
  specifications?: string; // JSON string of specifications
}

// GET - Fetch all properties with pagination and filtering
export async function getProperties(
  params: PropertyFilterParams = {},
  signal?: AbortSignal
): Promise<PropertiesResponse> {
  try {
    // Convert params to query string
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.search) queryParams.append("search", params.search);
    if (params.type) queryParams.append("type", params.type);
    if (params.city) queryParams.append("city", params.city);
    if (params.priceMin)
      queryParams.append("priceMin", params.priceMin.toString());
    if (params.priceMax)
      queryParams.append("priceMax", params.priceMax.toString());
    if (params.propertyTypeId)
      queryParams.append("propertyTypeId", params.propertyTypeId.toString());
    if (params.cityId) queryParams.append("cityId", params.cityId.toString());
    if (params.areaId) queryParams.append("areaId", params.areaId.toString());
    if (params.accessType) queryParams.append("accessType", params.accessType);

    const queryString = queryParams.toString();
    const url = `/properties${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url, { signal });

    // Handle different response structures
    const responseData = response.data.data || response.data;

    return {
      records:
        responseData.records ||
        responseData.data ||
        responseData.properties ||
        [],
      total_records:
        responseData.total_records ||
        responseData.totalCount ||
        responseData.total ||
        0,
      current_page:
        responseData.current_page ||
        responseData.currentPage ||
        params.page ||
        1,
      per_page:
        responseData.per_page || responseData.perPage || params.limit || 10,
      total_pages:
        responseData.total_pages ||
        responseData.totalPages ||
        Math.ceil((responseData.total_records || 0) / (params.limit || 10)),
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
}
// GET - Fetch single property by ID
export async function getPropertyById(
  id: number,
  signal?: AbortSignal
): Promise<Property> {
  try {
    const response = await api.get(`/properties/${id}`, {
      signal,
    });

    console.log("Property API Response:", response.data);

    return response.data.data || response.data.record || response.data;
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    throw error;
  }
}

// POST - Create new property
export async function createProperty(
  data: CreatePropertyData,
  signal?: AbortSignal
): Promise<Property> {
  try {
    const response = await api.post("/properties", data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
}

// PATCH - Update property
export async function updateProperty(
  id: number,
  data: UpdatePropertyData,
  signal?: AbortSignal
): Promise<Property> {
  try {
    const response = await api.patch(`/properties/${id}`, data, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating property ${id}:`, error);
    throw error;
  }
}

// DELETE - Delete property
export async function deleteProperty(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/properties/${id}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error deleting property ${id}:`, error);
    throw error;
  }
}

// PATCH - Toggle property active status
export async function togglePropertyStatus(
  id: number,
  isActive: boolean,
  signal?: AbortSignal
): Promise<Property> {
  try {
    const response = await api.patch(
      `/properties/${id}/status`,
      { isActive },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error toggling property ${id} status:`, error);
    throw error;
  }
}

// GET - Get property statistics
export async function getPropertyStats(
  id: number,
  signal?: AbortSignal
): Promise<{
  views: number;
  contacts: number;
  favorites: number;
  shares: number;
  lastViewed: string | null;
}> {
  try {
    const response = await api.get(`/properties/${id}/stats`, {
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching stats for property ${id}:`, error);
    throw error;
  }
}

// GET - Get overall properties statistics
export async function getOverallPropertyStats(
  params?: {
    startDate?: string;
    endDate?: string;
    cityId?: number;
    propertyTypeId?: number;
  },
  signal?: AbortSignal
): Promise<PropertyStats> {
  try {
    const response = await api.get("/properties/stats/overall", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching overall property stats:", error);
    throw error;
  }
}

// POST - Add media to property
export async function addPropertyMedia(
  id: number,
  media: Array<{
    mediaUrl: string;
    isPrimary?: boolean;
    orderIndex?: number;
  }>,
  signal?: AbortSignal
): Promise<Property> {
  try {
    const response = await api.post(
      `/properties/${id}/media`,
      { media },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error adding media to property ${id}:`, error);
    throw error;
  }
}

// DELETE - Remove media from property
export async function removePropertyMedia(
  id: number,
  mediaId: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.delete(`/properties/${id}/media/${mediaId}`, {
      signal,
    });
  } catch (error) {
    console.error(`Error removing media from property ${id}:`, error);
    throw error;
  }
}

// PATCH - Set primary media for property
export async function setPrimaryPropertyMedia(
  id: number,
  mediaId: number,
  signal?: AbortSignal
): Promise<Property> {
  try {
    const response = await api.patch(
      `/properties/${id}/media/${mediaId}/primary`,
      {},
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error setting primary media for property ${id}:`, error);
    throw error;
  }
}

// PATCH - Reorder property media
export async function reorderPropertyMedia(
  id: number,
  mediaOrder: Array<{ mediaId: number; orderIndex: number }>,
  signal?: AbortSignal
): Promise<Property> {
  try {
    const response = await api.patch(
      `/properties/${id}/media/reorder`,
      { mediaOrder },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error reordering media for property ${id}:`, error);
    throw error;
  }
}

// GET - Get properties by city
export async function getPropertiesByCity(
  cityId: number,
  params?: {
    page?: number;
    limit?: number;
    propertyTypeId?: number;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<PropertiesResponse> {
  try {
    const response = await api.get(`/properties/city/${cityId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching properties for city ${cityId}:`, error);
    throw error;
  }
}

// GET - Get properties by property type
export async function getPropertiesByType(
  propertyTypeId: number,
  params?: {
    page?: number;
    limit?: number;
    cityId?: number;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<PropertiesResponse> {
  try {
    const response = await api.get(`/properties/type/${propertyTypeId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error fetching properties for type ${propertyTypeId}:`,
      error
    );
    throw error;
  }
}

// GET - Get featured properties
export async function getFeaturedProperties(
  params?: {
    page?: number;
    limit?: number;
    cityId?: number;
    propertyTypeId?: number;
  },
  signal?: AbortSignal
): Promise<PropertiesResponse> {
  try {
    const response = await api.get("/properties/featured", {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    throw error;
  }
}

// GET - Get similar properties
export async function getSimilarProperties(
  propertyId: number,
  params?: {
    page?: number;
    limit?: number;
    similarityType?: "type" | "location" | "price";
  },
  signal?: AbortSignal
): Promise<PropertiesResponse> {
  try {
    const response = await api.get(`/properties/${propertyId}/similar`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(
      `Error fetching similar properties for ${propertyId}:`,
      error
    );
    throw error;
  }
}

// POST - Duplicate property
export async function duplicateProperty(
  id: number,
  newTitle?: string,
  signal?: AbortSignal
): Promise<Property> {
  try {
    const response = await api.post(
      `/properties/${id}/duplicate`,
      { newTitle },
      { signal }
    );

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error duplicating property ${id}:`, error);
    throw error;
  }
}

// GET - Search properties
export async function searchProperties(
  query: string,
  params?: {
    page?: number;
    limit?: number;
    cityId?: number;
    propertyTypeId?: number;
    isActive?: boolean;
  },
  signal?: AbortSignal
): Promise<PropertiesResponse> {
  try {
    const response = await api.get("/properties/search", {
      params: {
        search: query,
        ...params,
      },
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error searching properties:", error);
    throw error;
  }
}

// GET - Get properties by user
export async function getPropertiesByUser(
  userId: number,
  params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<PropertiesResponse> {
  try {
    const response = await api.get(`/properties/user/${userId}`, {
      params,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching properties for user ${userId}:`, error);
    throw error;
  }
}

// POST - Increment property views
export async function incrementPropertyViews(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  try {
    await api.post(`/properties/${id}/views`, {}, { signal });
  } catch (error) {
    console.error(`Error incrementing views for property ${id}:`, error);
    throw error;
  }
}

// GET - Get property count by filters
export async function getPropertyCount(
  filters?: {
    cityId?: number;
    propertyTypeId?: number;
    isActive?: boolean;
    accessType?: string;
  },
  signal?: AbortSignal
): Promise<{ count: number }> {
  try {
    const response = await api.get("/properties/count", {
      params: filters,
      signal,
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching property count:", error);
    throw error;
  }
}

// services/export/export.ts

import { api } from "@/libs/axios";

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
  format?: string;
  type?: "string" | "number" | "date" | "currency";
}

export interface ExportData {
  fileName: string;
  sheetName: string;
  columns: ExportColumn[];
  rows: any[];
}

export interface ExportResponse {
  success: boolean;
  message: string;
  downloadUrl?: string;
  filePath?: string;
  fileSize?: number;
}

export interface ExportModuleParams {
  module: string;
  limit?: number | "all";
  filters?: Record<string, any>;
  columns?: string[];
  format?: "excel" | "csv" | "pdf";
  startDate?: string;
  endDate?: string;
}

// GET - Export data by module (with file download support)
export async function exportModule(
  params: ExportModuleParams,
  signal?: AbortSignal
): Promise<ExportResponse | Blob> {
  try {
    const response = await api.get("/export", {
      params: {
        ...params,
        limit: params.limit === "all" ? "all" : params.limit,
      },
      signal,
      responseType: "blob", // Important for file downloads
    });

    // If it's a blob (file), return it directly
    if (response.data instanceof Blob) {
      return response.data;
    }

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error exporting module data:", error);
    throw error;
  }
}

// POST - Export custom data with specified columns and rows
export async function exportCustomData(
  data: ExportData,
  signal?: AbortSignal
): Promise<ExportResponse> {
  try {
    const response = await api.post("/export/rows", data, {
      signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error exporting custom data:", error);
    throw error;
  }
}

// GET - Get available export modules
export async function getExportModules(
  signal?: AbortSignal
): Promise<string[]> {
  try {
    const response = await api.get("/export/modules", {
      signal,
    });

    return (
      response.data.data?.allowedModules || response.data.allowedModules || []
    );
  } catch (error) {
    console.error("Error fetching export modules:", error);
    throw error;
  }
}

// GET - Get module columns schema
export async function getModuleColumns(
  module: string,
  signal?: AbortSignal
): Promise<ExportColumn[]> {
  try {
    const response = await api.get(`/export/modules/${module}/columns`, {
      signal,
    });

    return response.data.data || response.data.columns || [];
  } catch (error) {
    console.error(`Error fetching columns for module ${module}:`, error);
    throw error;
  }
}

// POST - Export with advanced configuration
export async function exportWithConfig(
  config: {
    module: string;
    fileName: string;
    sheetName?: string;
    columns?: string[] | ExportColumn[];
    filters?: Record<string, any>;
    format?: "excel" | "csv" | "pdf";
    includeHeaders?: boolean;
    groupBy?: string[];
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  },
  signal?: AbortSignal
): Promise<ExportResponse> {
  try {
    const response = await api.post("/export/advanced", config, {
      signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error exporting with advanced config:", error);
    throw error;
  }
}

// Utility function to download exported file
export function downloadExportFile(
  downloadUrl: string,
  fileName: string
): void {
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Utility function to create export data for common modules
export function createCommonExportConfig(
  module: string,
  data: any[],
  customColumns?: ExportColumn[]
): ExportData {
  const defaultConfigs: Record<string, ExportData> = {
    user: {
      fileName: "users_report",
      sheetName: "Users",
      columns: customColumns || [
        { header: "ID", key: "id", width: 10 },
        { header: "Full Name", key: "fullName", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Phone Number", key: "phoneNumber", width: 15 },
        { header: "User Type", key: "userType", width: 15 },
        { header: "Status", key: "isActive", width: 12 },
        { header: "Created At", key: "createdAt", width: 20, type: "date" },
      ],
      rows: data,
    },
    property: {
      fileName: "properties_report",
      sheetName: "Properties",
      columns: customColumns || [
        { header: "ID", key: "id", width: 10 },
        { header: "Title", key: "title", width: 30 },
        { header: "Type", key: "propertyType", width: 15 },
        { header: "Price", key: "price", width: 15, type: "currency" },
        { header: "City", key: "city", width: 15 },
        { header: "Area", key: "area", width: 15 },
        { header: "Status", key: "status", width: 12 },
        { header: "Created At", key: "createdAt", width: 20, type: "date" },
      ],
      rows: data,
    },
    appointment: {
      fileName: "appointments_report",
      sheetName: "Appointments",
      columns: customColumns || [
        { header: "ID", key: "id", width: 10 },
        { header: "Customer", key: "customerName", width: 25 },
        { header: "Agent", key: "agentName", width: 25 },
        { header: "Property", key: "propertyTitle", width: 30 },
        { header: "Date", key: "appointmentDate", width: 20, type: "date" },
        { header: "Time", key: "appointmentTime", width: 15 },
        { header: "Status", key: "status", width: 15 },
        { header: "Created At", key: "createdAt", width: 20, type: "date" },
      ],
      rows: data,
    },
  };

  return (
    defaultConfigs[module] || {
      fileName: `${module}_report`,
      sheetName: module.charAt(0).toUpperCase() + module.slice(1),
      columns:
        customColumns ||
        Object.keys(data[0] || {}).map((key) => ({
          header: key.charAt(0).toUpperCase() + key.slice(1),
          key,
          width: 20,
        })),
      rows: data,
    }
  );
}
// Utility function to handle file download from blob
export function downloadFileFromBlob(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

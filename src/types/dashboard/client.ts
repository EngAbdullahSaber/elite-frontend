// types/dashboard/client.ts

export type ClientStatus = "active" | "inactive" | "pending" | "suspended";
export type UserType =
  | "customer"
  | "agent"
  | "admin"
  | "marketer"
  | "quality_team";

export interface ClientRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: ClientStatus;
  joinedAt: string;
  verificationStatus: string;
  userType: UserType;
  profilePhoto?: string | null;
}

export type ClientFilterKeys =
  | "status"
  | "sort"
  | "dir"
  | "joinedAt_from"
  | "joinedAt_to"
  | "page"
  | "limit"
  | "search"
  | "userType";

// Status map for display
export const clientStatusMap: Record<ClientStatus, string> = {
  active: "نشط",
  inactive: "غير نشط",
  pending: "قيد الانتظار",
  suspended: "موقوف",
};

// User type map for display
export const userTypeMap: Record<UserType, string> = {
  customer: "عميل",
  agent: "وسيط",
  admin: "مدير",
  marketer: "مسوق",
  quality_team: "فريق الجودة",
};

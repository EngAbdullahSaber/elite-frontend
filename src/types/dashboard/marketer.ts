// types/dashboard/marketer.ts

export type MarketerStatus = "active" | "inactive" | "pending" | "suspended";

export interface MarketerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: MarketerStatus;
  joinedAt: string;
  referralCode: string;
  createdBy: string;
  verificationStatus: string;
  userId?: string; // Add userId for API operations
}

export type MarketerFilterKeys =
  | "status"
  | "sort"
  | "dir"
  | "joinedAt_from"
  | "joinedAt_to"
  | "page"
  | "limit"
  | "search";
export const marketerStatusMap: Record<MarketerStatus, string> = {
  active: "نشط",
  inactive: "غير نشط",
  pending: "قيد الانتظار",
  suspended: "موقوف",
};

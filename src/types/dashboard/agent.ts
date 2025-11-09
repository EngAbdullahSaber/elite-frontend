// types/dashboard/agent.ts

export type AgentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "inactive";

export interface AgentRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: AgentStatus; // KYC status
  activationStatus: AgentStatus; // Account activation status
  joinedAt: string;
  city: string;
  kycStatus: string;
  kycNotes: string | null;
  verificationStatus: string;
  identityProofUrl: string;
  residencyDocumentUrl: string;
  userId?: string;
}

export type AgentFilterKeys =
  | "status"
  | "cityId"
  | "sort"
  | "dir"
  | "joinedAt_from"
  | "joinedAt_to"
  | "page"
  | "limit"
  | "search";

// Status map for display
export const agentStatusMap: Record<AgentStatus, string> = {
  pending: "قيد المراجعة",
  approved: "معتمد",
  rejected: "مرفوض",
  active: "نشط",
  inactive: "غير نشط",
};

// KYC status map for display
export const kycStatusMap: Record<string, string> = {
  pending: "قيد المراجعة",
  approved: "معتمد",
  rejected: "مرفوض",
};

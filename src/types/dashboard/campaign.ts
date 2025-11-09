// types/dashboard/campaign.ts

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "running"
  | "paused"
  | "completed"
  | "cancelled";

export type TargetChannel = "whatsapp" | "email" | "sms" | "push";

export type TargetAudience = "all_users" | "customers" | "agents" | "marketers";

export type RunType = "one_time" | "recurring";

export type RunFrequency = "daily" | "weekly" | "monthly";

export interface CampaignRow {
  id: string;
   campaignName: string;
  targetChannel: TargetChannel;
  targetAudience: TargetAudience;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  runType: RunType;
  actualRecipients: number;
  views: number;
  responses: number;
  responseRate: number;
  createdBy: string;
  createdAt: string;
}

export type CampaignFilterKeys =
  | "status"
  | "targetChannel"
  | "targetAudience"
  | "runType"
  | "sort"
  | "dir"
  | "startDate_from"
  | "startDate_to"
  | "endDate_from"
  | "endDate_to"
  | "page"
  | "limit"
  | "search";

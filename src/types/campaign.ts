import { FileItem, fileItemSchema } from "@/utils/upload";
import { z } from "zod";

export const campaignSchema = z
  .object({
    // Basic Information
    campaignName: z
      .string()
      .min(1, "اسم الحملة مطلوب")
      .max(100, "اسم الحملة يجب أن يكون أقل من 100 حرف"),
    campaignTitle: z
      .string()
      .min(1, "عنوان الحملة مطلوب")
      .max(200, "عنوان الحملة يجب أن يكون أقل من 200 حرف"),
    campaignDescription: z
      .string()
      .min(1, "وصف الحملة مطلوب")
      .max(1000, "وصف الحملة يجب أن يكون أقل من 1000 حرف"),

    messageContent: z
      .string()
      .min(1, "محتوى الرسالة مطلوب")
      .max(5000, "محتوى الرسالة يجب أن يكون أقل من 5000 حرف"),

    // Images (max 2)
    campaignImages: z
      .array(fileItemSchema)
      .max(2, "يمكن رفع صورتين كحد أقصى")
      .optional(),
    campaignExcel: z
      .array(fileItemSchema)
      .max(2, "يمكن رفع صورتين كحد أقصى")
      .optional(),

    // Run Settings
    runType: z.enum(["once", "recurring"], {
      message: "نوع التشغيل مطلوب",
    }),

    // Run Once Settings
    runOnceDateTime: z.string().optional(),

    // Recurring Settings
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    runFrequency: z
      .enum(["daily", "every_2_days", "weekly", "every_2_weeks", "monthly"])
      .optional(),
    runTime: z.string().optional(),

    // Target Settings
    targetChannel: z.enum(["email", "whatsapp"], {
      message: "قناة الهدف مطلوبة",
    }),

    targetAudience: z.enum(
      ["all_users", "agents", "marketers", "clients", "new_clients"],
      {
        message: "الجمهور المستهدف مطلوب",
      }
    ),
    isDraft: z.boolean({
      message: "حالة المسودة مطلوبة",
    }),
  })
  .refine(
    (data) => {
      // If runType is 'once', runOnceDateTime is required
      if (data.runType === "once" && !data.runOnceDateTime) {
        return false;
      }
      return true;
    },
    {
      message: "تاريخ ووقت التشغيل مطلوب للحملات الفردية",
      path: ["runOnceDateTime"],
    }
  )
  .refine(
    (data) => {
      if (data.runType === "once" && data.runOnceDateTime) {
        return new Date(data.runOnceDateTime) > new Date();
      }
      return true;
    },
    {
      message: "تاريخ ووقت التشغيل يجب أن يكون في المستقبل",
      path: ["runOnceDateTime"],
    }
  )
  .refine(
    (data) => {
      // If runType is 'recurring', recurring fields are required
      if (data.runType === "recurring") {
        return (
          data.startDate && data.endDate && data.runFrequency && data.runTime
        );
      }
      return true;
    },
    {
      message: "جميع حقول التشغيل المتكرر مطلوبة",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      if (data.runType === "recurring" && data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
      }
      return true;
    },
    {
      message: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية",
      path: ["startDate"],
    }
  );

export type CampaignFormData = z.infer<typeof campaignSchema>;

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "running"
  | "completed"
  | "paused"
  | "Cancelled";

export interface Campaign {
  id: string;
  campaignName: string;
  campaignTitle: string;
  campaignDescription: string;
  messageContent: string; // Add this
  campaignImages: FileItem[];
  targetChannel: "email" | "whatsapp";
  targetAudience:
    | "all_users"
    | "agents"
    | "marketers"
    | "clients"
    | "new_clients";
  runType: "once" | "recurring";
  runOnceDateTime?: string;
  startDate?: string;
  endDate?: string;
  runFrequency?:
    | "daily"
    | "every_2_days"
    | "weekly"
    | "every_2_weeks"
    | "monthly";
  runTime?: string;
  isDraft?: boolean;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
  // Statistics fields
  actualRecipients?: number;
  views?: number;
  responses?: number;
}

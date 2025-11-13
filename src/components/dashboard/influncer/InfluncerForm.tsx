// components/dashboard/influncer/InfluncerForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import SelectInput from "@/components/shared/Forms/SelectInput";
import {
  InfluencerRow,
  InfluencerStatus,
  InfluencerPlatform,
  influencerPlatformMap,
} from "@/types/dashboard/Influencer";
import {
  updateInfluencer,
  createInfluencer,
} from "@/services/Influencer/Influencer";
import toast from "react-hot-toast";
import { getClients } from "@/services/clinets/clinets";
import UserChanger from "../UserChanger";

// Types for users
interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

interface ClientsResponse {
  records: User[];
  total_records: number;
}

// Props
type Props = {
  influencer?: InfluencerRow;
  isAdmin?: boolean;
  onSuccess?: () => void;
};

// 🧠 Define Zod schema
const schema = z.object({
  name: z.string().min(2, "الاسم مطلوب ويجب أن يكون على الأقل حرفين"),
  handle: z.string().optional().nullable(),
  platform: z.enum([
    "instagram",
    "snapchat",
    "tiktok",
    "youtube",
    "x",
    "other",
  ]),
  code: z.string().min(2, "الكود المرجعي مطلوب"),
  status: z.enum(["active", "inactive"]),
  userId: z.number().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

export default function InfluencerForm({
  influencer,
  isAdmin = false,
  onSuccess,
}: Props) {
  const isEdit = !!influencer;
  const [isLoading, setIsLoading] = React.useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: influencer?.name || "",
      handle: influencer?.handle || "",
      platform: influencer?.platform || "instagram",
      code: influencer?.code || "",
      status: influencer?.status ?? "active",
      userId: influencer?.userId ? parseInt(influencer.userId) : null,
    },
  });

  // Fetch users for dropdown
  useEffect(() => {
    if (!isEdit) {
      fetchUsers();
    }
  }, [isEdit]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const clientsData: ClientsResponse = await getClients({
        userType: "customer",
        limit: 100, // Get more users for selection
        sortBy: "fullName",
        sortOrder: "ASC",
      });

      setUsers(clientsData.records || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("فشل في تحميل قائمة المستخدمين");
    } finally {
      setUsersLoading(false);
    }
  };

  // Format users for UserChanger component
  const formatUsers = (usersList: User[]) => {
    return usersList.map((user) => ({
      id: user.id,
      name: user.fullName,
      email: user.email,
      phone: user.phoneNumber,
    }));
  };

  // Handle platform change
  const handlePlatformChange = (value: string) => {
    setValue("platform", value as InfluencerPlatform, { shouldDirty: true });
  };

  // Handle status change
  const handleStatusChange = (value: string) => {
    setValue("status", value as InfluencerStatus, { shouldDirty: true });
  };

  // Handle user change
  const handleUserChange = (user: any) => {
    setValue("userId", user?.id || null, { shouldDirty: true });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);

      if (isEdit && influencer) {
        // Update existing influencer
        const updateData = {
          name: data.name,
          handle: data.handle || null,
          platform: data.platform,
          isActive: data.status === "active",
        };

        await updateInfluencer(parseInt(influencer.id), updateData);

        toast.success("تم تحديث بيانات المروج بنجاح", {
          duration: 4000,
          position: "top-center",
          icon: "✅",
          style: {
            background: "#10B981",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
          },
        });
      } else {
        // Create new influencer
        const createData = {
          name: data.name,
          handle: data.handle || null,
          platform: data.platform,
          code: data.code,
          userId: data.userId || undefined, // Only include if provided
        };

        await createInfluencer(createData);

        toast.success("تم إضافة المروج بنجاح", {
          duration: 4000,
          position: "top-center",
          icon: "✅",
          style: {
            background: "#10B981",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
          },
        });
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving influencer:", error);

      const errorMessage =
        error?.response?.data?.message ||
        "فشل في حفظ البيانات. يرجى المحاولة مرة أخرى.";

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
        icon: "❌",
        style: {
          background: "#EF4444",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      name: influencer?.name || "",
      handle: influencer?.handle || "",
      platform: influencer?.platform || "instagram",
      code: influencer?.code || "",
      status: influencer?.status ?? "active",
      userId: influencer?.userId ? parseInt(influencer.userId) : null,
    });
  };

  const platformOptions = Object.entries(influencerPlatformMap).map(
    ([value, label]) => ({
      label,
      value,
    })
  );

  const statusOptions = [
    { label: "نشط", value: "active" },
    { label: "غير نشط", value: "inactive" },
  ];

  // Get selected user for display
  const selectedUserId = watch("userId");
  const selectedUser = users.find((user) => user.id === selectedUserId);

  return (
    <Card title={influencer ? "تعديل معلومات المروج" : "إضافة مروج جديد"}>
      {/* النموذج */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-4"
      >
        <div className="col-span-12 md:col-span-6">
          <TextInput
            id="name"
            label="اسم المروج"
            placeholder="أدخل اسم المروج"
            {...register("name", {
              onChange: () => {
                setValue("name", watch("name"), { shouldDirty: true });
              },
            })}
            error={errors.name?.message}
            required
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <TextInput
            id="handle"
            label="اسم المستخدم (Handle)"
            placeholder="@username"
            {...register("handle", {
              onChange: () => {
                setValue("handle", watch("handle"), { shouldDirty: true });
              },
            })}
            error={errors.handle?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <SelectInput
            name="platform"
            label="منصة التواصل"
            value={watch("platform")}
            onChange={handlePlatformChange}
            options={platformOptions}
            error={errors.platform?.message}
            required
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <TextInput
            id="code"
            label="الكود المرجعي"
            placeholder="أدخل الكود المرجعي"
            {...register("code", {
              onChange: () => {
                setValue("code", watch("code"), { shouldDirty: true });
              },
            })}
            error={errors.code?.message}
            required={!isEdit}
            disabled={isEdit}
            className={isEdit ? "bg-gray-50" : ""}
          />
          {isEdit && (
            <p className="text-sm text-gray-500 mt-1">
              لا يمكن تعديل الكود المرجعي بعد الإنشاء
            </p>
          )}
        </div>

        {/* User Selection - Only show for create */}
        {!isEdit && isAdmin && (
          <div className="col-span-12 md:col-span-6">
            <label className="text-lg font-medium block mb-3">
              ربط بحساب مستخدم
            </label>
            <UserChanger
              users={formatUsers(users)}
              label="مستخدم"
              onChange={handleUserChange}
              loading={usersLoading}
              selectedUser={
                selectedUser
                  ? {
                      id: selectedUser.id,
                      name: selectedUser.fullName,
                      email: selectedUser.email,
                      phone: selectedUser.phoneNumber,
                    }
                  : null
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              اختياري - يمكن ربط المروج بحساب مستخدم موجود
            </p>
          </div>
        )}

        {isAdmin && (
          <div className="col-span-12 md:col-span-6">
            <SelectInput
              name="status"
              label="حالة الحساب"
              value={watch("status")}
              onChange={handleStatusChange}
              options={statusOptions}
              error={errors.status?.message}
            />
          </div>
        )}

        <div className="col-span-12 flex items-center gap-6 flex-wrap">
          <PrimaryButton type="submit" disabled={isLoading || !isDirty}>
            {isLoading
              ? "جاري الحفظ..."
              : influencer
              ? "تحديث بيانات المروج"
              : "إضافة مروج جديد"}
          </PrimaryButton>

          {isDirty && (
            <SoftActionButton
              onClick={handleCancel}
              type="button"
              disabled={isLoading}
            >
              إلغاء
            </SoftActionButton>
          )}
        </div>
      </form>
    </Card>
  );
}

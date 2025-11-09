"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Card from "@/components/shared/Card";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import SelectInput from "@/components/shared/Forms/SelectInput";
import { AgentRow } from "@/types/dashboard/agent";
import FieldErrorMessage from "@/components/shared/Forms/FieldErrorMessage";
import { getClients } from "@/services/clinets/clinets";
import { createAgent, updateAgent } from "@/services/agents/agents";
import { getCities } from "@/services/cities/cities";
import UserChanger from "../UserChanger";

// Types for API data
interface Client {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePhotoUrl?: string;
}

interface City {
  id: number;
  name: string;
}

// Props
type Props = {
  agent?: AgentRow;
  isAdmin?: boolean;
  isCurentUser?: boolean;
};

// 🧠 Define Zod schema - Handle both create and edit scenarios
const createSchema = z.object({
  userId: z.number().min(1, "يجب اختيار عميل"),
  cityId: z.number().min(1, "يجب اختيار مدينة"),
  identityProofFile: z
    .instanceof(File, { message: "إثبات الهوية مطلوب" })
    .optional(),
  residencyDocumentFile: z
    .instanceof(File, { message: "مستند الإقامة مطلوب" })
    .optional(),
});

const editSchema = z.object({
  userId: z.number().min(1, "يجب اختيار عميل"),
  cityId: z.number().min(1, "يجب اختيار مدينة"),
  identityProofFile: z
    .instanceof(File, { message: "إثبات الهوية مطلوب" })
    .optional(),
  residencyDocumentFile: z
    .instanceof(File, { message: "مستند الإقامة مطلوب" })
    .optional(),
});

type FormValues = z.infer<typeof createSchema>;

export default function AgentForm({
  agent,
  isCurentUser = false,
  isAdmin = false,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const isEdit = isCurentUser || (agent && agent.id);

  // Use appropriate schema based on mode
  const schema = isEdit ? editSchema : createSchema;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: agent?.userId ? Number(agent.userId) : undefined,
      cityId: agent?.cityId ? Number(agent.cityId) : undefined,
    },
  });

  const fetchData = async () => {
    try {
      setDataLoading(true);

      // Fetch clients (users with type 'customer')
      const clientsResponse = await getClients({
        userType: "customer",
        limit: 100,
      });
      setClients(clientsResponse?.records || []);

      // Fetch cities
      const citiesResponse = await getCities();
      setCities(citiesResponse?.records || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("فشل في تحميل البيانات", {
        duration: 5000,
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setDataLoading(false);
    }
  };

  // Fetch clients and cities on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Format clients for UserChanger component
  const formatUsers = (users: Client[]) => {
    return users.map((user) => ({
      id: user.id,
      name: user.fullName,
      email: user.email,
      phone: user.phoneNumber,
      image: user.profilePhotoUrl,
    }));
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // Prepare form data
      const formData = new FormData();

      // Append user and city data
      formData.append("userId", data.userId.toString());
      formData.append("cityId", data.cityId.toString());

      // Append files only if they are provided (for edit) or required (for create)
      if (data.identityProofFile) {
        formData.append("identityProof", data.identityProofFile);
      }
      if (data.residencyDocumentFile) {
        formData.append("residencyDocument", data.residencyDocumentFile);
      }

      let result;
      if (isEdit && agent) {
        // Update existing agent
        const agentId = parseInt(agent.id);
        result = await updateAgent(agentId, formData);

        toast.success("تم تحديث بيانات الوسيط بنجاح", {
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
        // Create new agent
        result = await createAgent(formData);

        toast.success("تم إضافة الوسيط بنجاح", {
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

      // Redirect to agents list
      router.push("/dashboard/admin/agents");
      router.refresh();
    } catch (error: any) {
      console.error(`❌ خطأ في ${isEdit ? "تحديث" : "إضافة"} الوسيط:`, error);

      const errorMessage =
        error.response?.data?.message ||
        `حدث خطأ أثناء ${
          isEdit ? "تحديث" : "إضافة"
        } الوسيط. يرجى المحاولة مرة أخرى.`;

      setServerError(errorMessage);

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
    if (agent) {
      reset({
        userId: agent.userId ? Number(agent.userId) : undefined,
        cityId: agent.cityId ? Number(agent.cityId) : undefined,
      });
    } else {
      reset({
        userId: undefined,
        cityId: undefined,
      });
    }
    setServerError(null);
  };

  const handleIdentityProofChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("identityProofFile", file);
    }
  };

  const handleResidencyDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("residencyDocumentFile", file);
    }
  };

  return (
    <Card title={isEdit ? "تعديل معلومات الوسيط" : "إضافة وسيط جديد"}>
      {/* Server Error */}
      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {serverError}
        </div>
      )}

      {/* النموذج */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-6"
      >
        {/* العميل */}
        <div className="col-span-12 md:col-span-6">
          <label className="text-lg font-medium block mb-3">العميل</label>
          <UserChanger
            users={formatUsers(clients)}
            label="عميل"
            initialUserId={agent?.userId ? Number(agent.userId) : undefined}
            onChange={(client) => setValue("userId", client?.id || 0)}
            loading={dataLoading}
          />
          <FieldErrorMessage errors={errors} fieldName="userId" />
        </div>

        {/* المدينة */}
        <div className="col-span-12 md:col-span-6">
          <SelectInput
            name="cityId"
            label="المدينة"
            value={watch("cityId")?.toString() || ""}
            onChange={(val) => setValue("cityId", parseInt(val))}
            options={cities.map((city) => ({
              label: city.name,
              value: city.id.toString(),
            }))}
            error={errors.cityId?.message}
            placeholder="اختر المدينة"
            loading={dataLoading}
          />
        </div>

        {/* Document Uploads */}
        <div className="col-span-12 md:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            إثبات الهوية {!isEdit && "*"}
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleIdentityProofChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {agent?.identityProofUrl && (
            <p className="mt-2 text-sm text-gray-600">
              الملف الحالي:{" "}
              <a
                href={agent.identityProofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                عرض الملف
              </a>
            </p>
          )}
          {errors.identityProofFile && (
            <p className="mt-1 text-sm text-red-600">
              {errors.identityProofFile.message}
            </p>
          )}
          {isEdit && (
            <p className="mt-1 text-sm text-gray-500">
              اترك الحقل فارغاً للحفاظ على الملف الحالي
            </p>
          )}
        </div>

        <div className="col-span-12 md:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            مستند الإقامة {!isEdit && "*"}
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleResidencyDocumentChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {agent?.residencyDocumentUrl && (
            <p className="mt-2 text-sm text-gray-600">
              الملف الحالي:{" "}
              <a
                href={agent.residencyDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                عرض الملف
              </a>
            </p>
          )}
          {errors.residencyDocumentFile && (
            <p className="mt-1 text-sm text-red-600">
              {errors.residencyDocumentFile.message}
            </p>
          )}
          {isEdit && (
            <p className="mt-1 text-sm text-gray-500">
              اترك الحقل فارغاً للحفاظ على الملف الحالي
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="col-span-12 flex items-center gap-6 flex-wrap pt-4">
          <PrimaryButton type="submit" disabled={isLoading || dataLoading}>
            {isLoading
              ? isEdit
                ? "جاري التحديث..."
                : "جاري الإضافة..."
              : isEdit
              ? "تحديث بيانات الوسيط"
              : "إضافة وسيط جديد"}
          </PrimaryButton>
          <SoftActionButton
            type="button"
            onClick={handleCancel}
            disabled={isLoading || dataLoading}
          >
            إلغاء
          </SoftActionButton>
        </div>
      </form>
    </Card>
  );
}

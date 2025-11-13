"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Card from "@/components/shared/Card";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import FieldErrorMessage from "@/components/shared/Forms/FieldErrorMessage";
import { AgentRow } from "@/types/dashboard/agent";
import { getClients } from "@/services/clinets/clinets";
import { createAgent, updateAgent } from "@/services/agents/agents";
import { getCities } from "@/services/cities/cities";
import UserChangerPagination from "../UserChangerPagination";

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

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
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

  // Clients state with pagination
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [clientPagination, setClientPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
  });

  // Cities state with pagination
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [cityPagination, setCityPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
  });

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

  // Fetch clients with search and pagination
  const fetchClients = useCallback(
    async (
      page: number = 1,
      search: string = "",
      resetList: boolean = false
    ) => {
      setClientsLoading(true);
      try {
        const params: Record<string, string> = {
          page: page.toString(),
          limit: "10",
          userType: "customer",
        };

        if (search) {
          params.search = search;
        }

        const response = await getClients(params);
        const clientsData = response?.records || [];
        const paginationData = response;

        // Calculate hasNextPage based on current page and total records
        const totalPages = Math.ceil((paginationData.total_records || 0) / 10);
        const hasNextPage = page < totalPages;

        setClients((prev) =>
          resetList ? clientsData : [...prev, ...clientsData]
        );
        setClientPagination({
          currentPage: paginationData.current_page || page,
          totalPages: totalPages,
          totalRecords: paginationData.total_records || 0,
          hasNextPage: hasNextPage,
        });
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("فشل في تحميل العملاء", {
          duration: 5000,
          position: "top-center",
          icon: "❌",
        });
      } finally {
        setClientsLoading(false);
      }
    },
    []
  );

  // Fetch cities with search and pagination
  const fetchCities = useCallback(
    async (
      page: number = 1,
      search: string = "",
      resetList: boolean = false
    ) => {
      setCitiesLoading(true);
      try {
        const params: Record<string, string> = {
          page: page.toString(),
          limit: "5",
        };

        if (search) {
          params.search = search;
        }

        const response = await getCities(params);
        const citiesData = response?.records || [];
        const paginationData = response;

        // Calculate hasNextPage based on current page and total records
        const totalPages = Math.ceil((paginationData.total_records || 0) / 5);
        const hasNextPage = page < totalPages;

        setCities((prev) =>
          resetList ? citiesData : [...prev, ...citiesData]
        );
        setCityPagination({
          currentPage: paginationData.current_page || page,
          totalPages: totalPages,
          totalRecords: paginationData.total_records || 0,
          hasNextPage: hasNextPage,
        });
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("فشل في تحميل المدن", {
          duration: 5000,
          position: "top-center",
          icon: "❌",
        });
      } finally {
        setCitiesLoading(false);
      }
    },
    []
  );

  // Handle client search
  const handleClientSearch = (search: string) => {
    setClientSearch(search);
    fetchClients(1, search, true);
  };

  // Handle city search
  const handleCitySearch = (search: string) => {
    setCitySearch(search);
    fetchCities(1, search, true);
  };

  // Handle client pagination
  const handleClientLoadMore = () => {
    if (clientPagination.hasNextPage && !clientsLoading) {
      fetchClients(clientPagination.currentPage + 1, clientSearch, false);
    }
  };

  // Handle city pagination
  const handleCityLoadMore = () => {
    if (cityPagination.hasNextPage && !citiesLoading) {
      fetchCities(cityPagination.currentPage + 1, citySearch, false);
    }
  };
   // Format clients for UserChangerPagination component
  const formatClients = (clients: Client[]) => {
    return clients.map((client) => ({
      id: client.id,
      name: client.fullName,
      email: client.email,
      phone: client.phoneNumber,
      image: client.profilePhotoUrl,
    }));
  };

  // Format cities for UserChangerPagination component
  const formatCities = (cities: City[]) => {
    return cities.map((city) => ({
      id: city.id,
      name: city.name,
      email: "", // Cities don't have emails
      phone: "", // Cities don't have phones
      image: undefined,
    }));
  };

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([fetchClients(1, "", true), fetchCities(1, "", true)]);
    };

    fetchInitialData();
  }, [fetchClients, fetchCities]);

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
          <UserChangerPagination
            users={formatClients(clients)}
            initialUserId={agent?.userId ? Number(agent.userId) : undefined}
            label="عميل"
            onChange={(client) => {
              if (client) {
                setValue("userId", client.id);
              } else {
                setValue("userId", 0);
              }
            }}
            loading={clientsLoading}
            searchable={true}
            onSearch={handleClientSearch}
            searchValue={clientSearch}
            hasMore={clientPagination.hasNextPage}
            onLoadMore={handleClientLoadMore}
            loadingMore={clientsLoading}
          />
          <FieldErrorMessage errors={errors} fieldName="userId" />
          <p className="text-sm text-gray-500 mt-1">
            اختر العميل المراد تحويله إلى وسيط
          </p>
        </div>

        {/* المدينة */}
        <div className="col-span-12 md:col-span-6">
          <label className="text-lg font-medium block mb-3">المدينة</label>
          <UserChangerPagination
            users={formatCities(cities)}
            initialUserId={agent?.cityId ? Number(agent.cityId) : undefined}
            label="مدينة"
            onChange={(city) => {
              if (city) {
                setValue("cityId", city.id);
              } else {
                setValue("cityId", 0);
              }
            }}
            loading={citiesLoading}
            searchable={true}
            onSearch={handleCitySearch}
            searchValue={citySearch}
            hasMore={cityPagination.hasNextPage}
            onLoadMore={handleCityLoadMore}
            loadingMore={citiesLoading}
          />
          <FieldErrorMessage errors={errors} fieldName="cityId" />
          <p className="text-sm text-gray-500 mt-1">
            اختر المدينة التي يعمل فيها الوسيط
          </p>
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
          <PrimaryButton
            type="submit"
            disabled={isLoading || clientsLoading || citiesLoading}
          >
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
            disabled={isLoading || clientsLoading || citiesLoading}
          >
            إلغاء
          </SoftActionButton>
        </div>
      </form>
    </Card>
  );
}

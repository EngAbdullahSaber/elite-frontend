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
import { createAgent, updateAgent } from "@/services/agents/agents";
import { getCities, getRegions } from "@/services/cities/cities";
import UserChangerPaginationMulti from "../UserChangerPaginationMulti";

// Types for API data
interface City {
  id: string;
  name: string;
}

interface Area {
  id: string;
  name: string;
  cityId?: string;
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

// 🧠 Define Zod schema for creating new agent
const createSchema = z.object({
  // User information
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phoneNumber: z.string().min(1, "رقم الهاتف مطلوب"),
  fullName: z.string().min(1, "الاسم الكامل مطلوب"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  profilePhotoUrl: z.string().optional(),

  // Agent information
  cityIds: z.array(z.number()).min(1, "يجب اختيار مدينة واحدة على الأقل"),
  areaIds: z.array(z.number()).optional(),
  identityProofFile: z.instanceof(File, { message: "إثبات الهوية مطلوب" }),
  residencyDocumentFile: z.instanceof(File, { message: "مستند الإقامة مطلوب" }),
});

// Schema for editing existing agent
const editSchema = z.object({
  // For editing, we might not need all user fields
  cityIds: z.array(z.number()).min(1, "يجب اختيار مدينة واحدة على الأقل"),
  areaIds: z.array(z.number()).optional(),
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

  // Areas state with pagination
  const [areas, setAreas] = useState<Area[]>([]);
  const [areasLoading, setAreasLoading] = useState(false);
  const [areaSearch, setAreaSearch] = useState("");
  const [areaPagination, setAreaPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
  });

  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);

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
      email: agent?.email || "",
      phoneNumber: agent?.phoneNumber || "",
      fullName: agent?.fullName || "",
      cityIds: agent?.cityId ? [Number(agent.cityId)] : [],
      areaIds: agent?.areaId ? [Number(agent.areaId)] : [],
    },
  });

  // Watch form values
  const watchedCityIds = watch("cityIds") || [];
  const watchedAreaIds = watch("areaIds") || [];

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
          limit: "10",
        };

        if (search) {
          params.search = search;
        }

        const response = await getCities(params);
        const citiesData = response?.records || [];
        const paginationData = response;

        // Calculate hasNextPage based on current page and total records
        const totalPages = Math.ceil((paginationData.total_records || 0) / 10);
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

  // Fetch areas with search and pagination
  const fetchAreas = useCallback(
    async (
      page: number = 1,
      search: string = "",
      resetList: boolean = false
    ) => {
      if (selectedCityIds.length === 0) return;

      setAreasLoading(true);
      try {
        // Fetch areas for all selected cities
        const areasPromises = selectedCityIds.map((cityId) =>
          getRegions({
            page: page.toString(),
            limit: "10",
            cityId: cityId,
            ...(search && { search }),
          })
        );

        const areasResponses = await Promise.all(areasPromises);

        // Combine all areas from all responses
        let allAreas: Area[] = [];
        areasResponses.forEach((response) => {
          const areasData = response?.records || [];
          allAreas = [...allAreas, ...areasData];
        });

        // Use the first response for pagination (or combine if needed)
        const paginationData = areasResponses[0] || {};

        // Calculate hasNextPage based on current page and total records
        const totalPages = Math.ceil((paginationData.total_records || 0) / 10);
        const hasNextPage = page < totalPages;

        setAreas((prev) => (resetList ? allAreas : [...prev, ...allAreas]));
        setAreaPagination({
          currentPage: paginationData.current_page || page,
          totalPages: totalPages,
          totalRecords: paginationData.total_records || 0,
          hasNextPage: hasNextPage,
        });
      } catch (error) {
        console.error("Error fetching areas:", error);
        toast.error("فشل في تحميل المناطق", {
          duration: 5000,
          position: "top-center",
          icon: "❌",
        });
      } finally {
        setAreasLoading(false);
      }
    },
    [selectedCityIds]
  );

  // Handle city search
  const handleCitySearch = (search: string) => {
    setCitySearch(search);
    fetchCities(1, search, true);
  };

  // Handle area search
  const handleAreaSearch = (search: string) => {
    setAreaSearch(search);
    fetchAreas(1, search, true);
  };

  // Handle city pagination
  const handleCityLoadMore = () => {
    if (cityPagination.hasNextPage && !citiesLoading) {
      fetchCities(cityPagination.currentPage + 1, citySearch, false);
    }
  };

  // Handle area pagination
  const handleAreaLoadMore = () => {
    if (
      areaPagination.hasNextPage &&
      !areasLoading &&
      selectedCityIds.length > 0
    ) {
      fetchAreas(areaPagination.currentPage + 1, areaSearch, false);
    }
  };

  // Format cities for UserChangerPagination component
  const formatCities = (cities: City[]) => {
    return cities.map((city) => ({
      id: parseInt(city.id),
      name: city.name,
      email: "", // Cities don't have emails
      phone: "", // Cities don't have phones
      image: undefined,
    }));
  };

  // Format areas for UserChangerPagination component
  const formatAreas = (areas: Area[]) => {
    return areas.map((area) => ({
      id: parseInt(area.id),
      name: area.name,
      email: "", // Areas don't have emails
      phone: "", // Areas don't have phones
      image: undefined,
    }));
  };

  const handleCityChange = (cities: any[]) => {
    const cityIds = cities.map((city) => city.id.toString());
    setSelectedCityIds(cityIds);

    // Convert to numbers for form value
    const numericCityIds = cities.map((city) => city.id);
    setValue("cityIds", numericCityIds);

    // Reset areas when cities change
    if (cityIds.length === 0) {
      setAreas([]);
      setAreaSearch("");
      setValue("areaIds", []);
      setSelectedAreaIds([]);
    } else {
      // Fetch areas for selected cities
      setAreaSearch("");
      setAreaPagination({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        hasNextPage: false,
      });
      fetchAreas(1, "", true);
    }
  };

  // Handle area change - support multiple selection
  const handleAreaChange = (areas: any[]) => {
    const areaIds = areas.map((area) => area.id.toString());
    setSelectedAreaIds(areaIds);

    // Convert to numbers for form value
    const numericAreaIds = areas.map((area) => area.id);
    setValue("areaIds", numericAreaIds);
  };

  // Check if area selection is allowed
  const canSelectAreas = selectedCityIds.length === 1;

  // Fetch initial data
  useEffect(() => {
    fetchCities(1, "", true);
  }, [fetchCities]);

  // Fetch areas when selected cities change
  useEffect(() => {
    if (selectedCityIds.length > 0) {
      setAreaSearch("");
      setAreaPagination({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        hasNextPage: false,
      });
      fetchAreas(1, "", true);
    } else {
      setAreas([]);
    }
  }, [selectedCityIds, fetchAreas]);

  // Set selected cities from existing agent data
  useEffect(() => {
    if (agent?.cityId) {
      setSelectedCityIds([agent.cityId.toString()]);
    }
  }, [agent?.cityId]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // Prepare form data
      const formData = new FormData();

      if (!isEdit) {
        // For new agent, add all user information
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("fullName", data.fullName);
        formData.append("password", data.password);

        if (data.profilePhotoUrl) {
          formData.append("profilePhotoUrl", data.profilePhotoUrl);
        }
      }

      // Append city IDs as array
      data.cityIds.forEach((cityId) => {
        formData.append("cityIds[]", cityId.toString());
      });

      // Append area IDs only if there is exactly one city selected
      if (canSelectAreas && data.areaIds && data.areaIds.length > 0) {
        data.areaIds.forEach((areaId) => {
          formData.append("areaIds[]", areaId.toString());
        });
      }

      // Append files
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
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (agent) {
      reset({
        email: agent.email || "",
        phoneNumber: agent.phoneNumber || "",
        fullName: agent.fullName || "",
        cityIds: agent.cityId ? [Number(agent.cityId)] : [],
        areaIds: agent.areaId ? [Number(agent.areaId)] : [],
      });
      setSelectedCityIds(agent.cityId ? [agent.cityId.toString()] : []);
      setSelectedAreaIds(agent.areaId ? [agent.areaId.toString()] : []);
    } else {
      reset({
        email: "",
        phoneNumber: "",
        fullName: "",
        password: "",
        cityIds: [],
        areaIds: [],
      });
      setSelectedCityIds([]);
      setSelectedAreaIds([]);
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

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For profile photo, you might want to upload it first and get the URL
      // For now, we'll just set the file
      setValue("profilePhotoUrl", URL.createObjectURL(file));
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
        {/* User Information - Only for new agents */}
        {!isEdit && (
          <>
            <div className="col-span-12 md:col-span-6">
              <label className="text-lg font-medium block mb-3">
                الاسم الكامل
              </label>
              <input
                type="text"
                {...register("fullName")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="أدخل الاسم الكامل"
              />
              <FieldErrorMessage errors={errors} fieldName="fullName" />
            </div>

            <div className="col-span-12 md:col-span-6">
              <label className="text-lg font-medium block mb-3">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="أدخل البريد الإلكتروني"
              />
              <FieldErrorMessage errors={errors} fieldName="email" />
            </div>

            <div className="col-span-12 md:col-span-6">
              <label className="text-lg font-medium block mb-3">
                رقم الهاتف
              </label>
              <input
                type="text"
                {...register("phoneNumber")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="أدخل رقم الهاتف"
              />
              <FieldErrorMessage errors={errors} fieldName="phoneNumber" />
            </div>

            <div className="col-span-12 md:col-span-6">
              <label className="text-lg font-medium block mb-3">
                كلمة المرور
              </label>
              <input
                type="password"
                {...register("password")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="أدخل كلمة المرور"
              />
              <FieldErrorMessage errors={errors} fieldName="password" />
            </div>

            <div className="col-span-12 md:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة الملف الشخصي
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </>
        )}

        {/* المدينة */}
        <div className="col-span-12 md:col-span-6">
          <label className="text-lg font-medium block mb-3">المدن</label>
          <UserChangerPaginationMulti
            users={formatCities(cities)}
            initialUserIds={watchedCityIds}
            label="مدينة"
            onChange={handleCityChange}
            loading={citiesLoading}
            searchable={true}
            onSearch={handleCitySearch}
            searchValue={citySearch}
            hasMore={cityPagination.hasNextPage}
            onLoadMore={handleCityLoadMore}
            loadingMore={citiesLoading}
            multiple={true}
          />
          <FieldErrorMessage errors={errors} fieldName="cityIds" />
          <p className="text-sm text-gray-500 mt-1">
            اختر المدن التي يعمل فيها الوسيط
          </p>
        </div>

        {/* المنطقة */}
        <div className="col-span-12 md:col-span-6">
          <label className="text-lg font-medium block mb-3">المناطق</label>
          <UserChangerPaginationMulti
            users={formatAreas(areas)}
            initialUserIds={watchedAreaIds}
            label="منطقة"
            onChange={handleAreaChange}
            loading={areasLoading}
            searchable={true}
            onSearch={handleAreaSearch}
            searchValue={areaSearch}
            hasMore={areaPagination.hasNextPage}
            onLoadMore={handleAreaLoadMore}
            loadingMore={areasLoading}
            disabled={!canSelectAreas}
            multiple={true}
          />
          <FieldErrorMessage errors={errors} fieldName="areaIds" />
          <p className="text-sm text-gray-500 mt-1">
            {selectedCityIds.length === 0
              ? "يجب اختيار المدن أولاً"
              : selectedCityIds.length === 1
              ? "اختر المناطق المرتبطة بالمدن المختارة"
              : "لا يمكن اختيار المناطق عند اختيار أكثر من مدينة"}
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
          <FieldErrorMessage errors={errors} fieldName="identityProofFile" />
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
          <FieldErrorMessage
            errors={errors}
            fieldName="residencyDocumentFile"
          />
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
            disabled={isLoading || citiesLoading || areasLoading}
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
            disabled={isLoading || citiesLoading || areasLoading}
          >
            إلغاء
          </SoftActionButton>
        </div>
      </form>
    </Card>
  );
}

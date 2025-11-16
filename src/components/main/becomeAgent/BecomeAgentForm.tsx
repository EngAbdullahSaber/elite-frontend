"use client";

import { Controller, useForm } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/shared/Card";
import Uploader from "@/components/shared/Forms/Uploader";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import { FileItem } from "@/utils/upload";
import { createAgent } from "@/services/agents/agents";
import toast from "react-hot-toast";
import { getRegions, getCities } from "@/services/cities/cities"; // Import getCities directly
import UserChangerPagination from "@/components/dashboard/UserChangerPagination";

type BecomeAgentFormValues = {
  cityId: string;
  areaId: string;
  identity_proof: FileItem[];
  license_document: FileItem[];
  favorite_properties: number[];
};

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
}

export default function BecomeAgentForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Cities state with pagination
  const [cities, setCities] = useState<any[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [cityPagination, setCityPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
  });

  // Areas state with pagination
  const [areas, setAreas] = useState<any[]>([]);
  const [areasLoading, setAreasLoading] = useState(false);
  const [areaSearch, setAreaSearch] = useState("");
  const [areaPagination, setAreaPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
  });

  const [selectedCityId, setSelectedCityId] = useState<string>("");

  const { handleSubmit, setValue, watch, control } =
    useForm<BecomeAgentFormValues>({
      defaultValues: {
        cityId: "",
        areaId: "",
        identity_proof: [],
        license_document: [],
        favorite_properties: [],
      },
    });

  const cityId = watch("cityId");
  const areaId = watch("areaId");
  const idProof = watch("identity_proof");
  const license = watch("license_document");

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

        // Use getCities service function directly
        const response = await getCities(params);
        console.log("Cities API Response:", response);

        // Handle different response structures
        let citiesData = [];
        let paginationData = response;

        if (response.records && Array.isArray(response.records)) {
          citiesData = response.records;
        } else if (response.rows && Array.isArray(response.rows)) {
          citiesData = response.rows;
        } else if (response.data && Array.isArray(response.data)) {
          citiesData = response.data;
        } else if (Array.isArray(response)) {
          citiesData = response;
        }

        // Calculate hasNextPage based on current page and total records
        const totalRecords =
          response.total_records ||
          response.totalCount ||
          response.total ||
          citiesData.length;
        const totalPages = Math.ceil(totalRecords / 10);
        const hasNextPage = page < totalPages;

        setCities((prev) =>
          resetList ? citiesData : [...prev, ...citiesData]
        );
        setCityPagination({
          currentPage: response.current_page || response.currentPage || page,
          totalPages: totalPages,
          totalRecords: totalRecords,
          hasNextPage: hasNextPage,
        });
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("فشل في تحميل قائمة المدن", {
          duration: 5000,
          position: "top-center",
        });
      } finally {
        setCitiesLoading(false);
      }
    },
    [] // Remove getCitiesData dependency since we're using getCities directly
  );

  // Fetch areas with search and pagination
  const fetchAreas = useCallback(
    async (
      page: number = 1,
      search: string = "",
      resetList: boolean = false
    ) => {
      if (!selectedCityId) return;

      setAreasLoading(true);
      try {
        const params: Record<string, string> = {
          page: page.toString(),
          limit: "10",
          cityId: selectedCityId,
        };

        if (search) {
          params.search = search;
        }

        const response = await getRegions(params);
        const areasData = response?.records || [];
        const paginationData = response;

        // Calculate hasNextPage based on current page and total records
        const totalPages = Math.ceil((paginationData.total_records || 0) / 10);
        const hasNextPage = page < totalPages;

        setAreas((prev) => (resetList ? areasData : [...prev, ...areasData]));
        setAreaPagination({
          currentPage: paginationData.current_page || page,
          totalPages: totalPages,
          totalRecords: paginationData.total_records || 0,
          hasNextPage: hasNextPage,
        });
      } catch (error) {
        console.error("Error fetching areas:", error);
        toast.error("فشل في تحميل قائمة المناطق", {
          duration: 5000,
          position: "top-center",
        });
      } finally {
        setAreasLoading(false);
      }
    },
    [selectedCityId]
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
    if (areaPagination.hasNextPage && !areasLoading && selectedCityId) {
      fetchAreas(areaPagination.currentPage + 1, areaSearch, false);
    }
  };

  // Format cities for UserChangerPagination component
  const formatCities = (cities: any[]) => {
    return cities.map((city) => ({
      id: parseInt(city.id),
      name: city.name,
      email: "", // Cities don't have emails
      phone: "", // Cities don't have phones
      image: undefined,
    }));
  };

  // Format areas for UserChangerPagination component
  const formatAreas = (areas: any[]) => {
    return areas.map((area) => ({
      id: parseInt(area.id),
      name: area.name,
      email: "", // Areas don't have emails
      phone: "", // Areas don't have phones
      image: undefined,
    }));
  };

  // Handle city change
  const handleCityChange = (city: any) => {
    if (city) {
      setSelectedCityId(city.id.toString());
      setAreas([]);
      setAreaSearch("");
      setValue("cityId", city.id.toString());
      setValue("areaId", ""); // Reset area when city changes
    } else {
      setSelectedCityId("");
      setAreas([]);
      setAreaSearch("");
      setValue("cityId", "");
      setValue("areaId", "");
    }
  };

  // Handle area change
  const handleAreaChange = (area: any) => {
    if (area) {
      setValue("areaId", area.id.toString());
    } else {
      setValue("areaId", "");
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchCities(1, "", true);
    };

    fetchInitialData();
  }, [fetchCities]);

  // Fetch areas when city is selected
  useEffect(() => {
    if (selectedCityId) {
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
  }, [selectedCityId, fetchAreas]);

  const onSubmit = async (data: BecomeAgentFormValues) => {
    // Validation
    if (!data.cityId) {
      toast.error("الرجاء اختيار المدينة", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    if (!data.areaId) {
      toast.error("الرجاء اختيار المنطقة", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    if (!data.identity_proof?.length) {
      toast.error("الرجاء رفع وثيقة الهوية", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    if (!data.license_document?.length) {
      toast.error("الرجاء رفع الرخصة", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Append city ID and area ID
      formData.append("city_Id", data.cityId.toString());
      formData.append("area_Id", data.areaId.toString());

      // Append identity proof file
      if (data.identity_proof.length > 0) {
        const identityFile = data.identity_proof[0].file;
        if (identityFile) {
          formData.append("identityProof", identityFile);
        }
      }

      // Append license document file
      if (data.license_document.length > 0) {
        const licenseFile = data.license_document[0].file;
        if (licenseFile) {
          formData.append("residencyDocument", licenseFile);
        }
      }

      // Submit the form
      const result = await createAgent(formData);

      // Show success message
      toast.success("تم إرسال طلب الانضمام كوسيط بنجاح", {
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

      // Redirect or reset form
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting agent request:", error);

      let errorMessage = "فشل في إرسال الطلب. يرجى المحاولة مرة أخرى.";

      if (error.response?.status === 400) {
        errorMessage = "بيانات الطلب غير صحيحة أو ناقصة";
      } else if (error.response?.status === 409) {
        errorMessage = "لديك بالفعل طلب قيد المراجعة";
      } else if (error.response?.status === 403) {
        errorMessage = "غير مسموح لك بتقديم طلب انضمام";
      }

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
    router.back();
  };

  // Get user data from sessionStorage or context
  const getUserData = () => {
    try {
      const userDataStr = sessionStorage.getItem("user");
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        return {
          fullName: userData.fullName || userData.name || "غير معروف",
          email: userData.email || "غير معروف",
          phone: userData.phoneNumber || userData.phone || "غير معروف",
        };
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }

    return {
      fullName: "غير معروف",
      email: "غير معروف",
      phone: "غير معروف",
    };
  };

  const userData = getUserData();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card title="طلب الانضمام كوسيط">
        <div className="grid grid-cols-12 gap-4">
          {/* المدينة */}
          <div className="col-span-12 md:col-span-6">
            <label className="text-xl font-medium block mb-3">المدينة</label>
            <UserChangerPagination
              users={formatCities(cities)}
              initialUserId={cityId ? parseInt(cityId) : undefined}
              label="مدينة"
              onChange={handleCityChange}
              loading={citiesLoading}
              searchable={true}
              onSearch={handleCitySearch}
              searchValue={citySearch}
              hasMore={cityPagination.hasNextPage}
              onLoadMore={handleCityLoadMore}
              loadingMore={citiesLoading}
            />
            {!cityId && (
              <p className="text-sm text-gray-500 mt-1">
                اختر المدينة التي ترغب في العمل بها
              </p>
            )}
          </div>

          {/* المنطقة */}
          <div className="col-span-12 md:col-span-6">
            <label className="text-xl font-medium block mb-3">المنطقة</label>
            <UserChangerPagination
              users={formatAreas(areas)}
              initialUserId={areaId ? parseInt(areaId) : undefined}
              label="منطقة"
              onChange={handleAreaChange}
              loading={areasLoading}
              searchable={true}
              onSearch={handleAreaSearch}
              searchValue={areaSearch}
              hasMore={areaPagination.hasNextPage}
              onLoadMore={handleAreaLoadMore}
              loadingMore={areasLoading}
              disabled={!selectedCityId}
            />
            {!selectedCityId && (
              <p className="text-sm text-gray-500 mt-1">
                يجب اختيار المدينة أولاً
              </p>
            )}
            {selectedCityId && areas.length === 0 && !areasLoading && (
              <p className="text-sm text-yellow-600 mt-1">
                لا توجد مناطق متاحة لهذه المدينة
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card title="وثائق التحقق">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <Uploader
              control={control}
              name="identity_proof"
              maxFiles={1}
              allowPrimary={false}
              accept="image/*,application/pdf"
              label="إثبات الهوية"
              disabled={isLoading}
              rules={[
                "الحد الأقصى لحجم الملف 5MB",
                "يجب أن يكون الملف صورة أو PDF",
                "مطلوب ملف واحد فقط",
              ]}
            />
          </div>

          <div className="col-span-12">
            <Uploader
              control={control}
              name="license_document"
              maxFiles={1}
              allowPrimary={false}
              accept="image/*,application/pdf"
              label="الرخصة أو وثيقة الإقامة"
              disabled={isLoading}
              rules={[
                "الحد الأقصى لحجم الملف 5MB",
                "يجب أن يكون الملف صورة أو PDF",
                "مطلوب ملف واحد فقط",
              ]}
            />
          </div>
        </div>
      </Card>

      <div className="space-x-4 flex items-center justify-start">
        <PrimaryButton
          type="submit"
          disabled={isLoading || citiesLoading || areasLoading}
          className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
        >
          {isLoading ? "جاري إرسال الطلب..." : "إرسال الطلب"}
        </PrimaryButton>
        <SoftActionButton
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
        >
          إلغاء
        </SoftActionButton>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>جاري إرسال طلب الانضمام...</span>
          </div>
        </div>
      )}
    </form>
  );
}

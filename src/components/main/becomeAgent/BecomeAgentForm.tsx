"use client";

import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/shared/Card";
import SelectInput from "@/components/shared/Forms/SelectInput";
import Uploader from "@/components/shared/Forms/Uploader";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import FavoritePropertiesChooser from "@/components/dashboard/Property Filter/FavoritePropertiesChooser";
import { properties } from "@/constants/projects";
import { FileItem } from "@/utils/upload";
import { useCities } from "@/hooks/dashboard/admin/cities/useCities";
import { createAgent } from "@/services/agents/agents"; // Adjust import path as needed
import toast from "react-hot-toast";

type BecomeAgentFormValues = {
  cityId: string;
  identity_proof: FileItem[];
  license_document: FileItem[];
  favorite_properties: number[];
};

export default function BecomeAgentForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const getCitiesData = useCities();

  const { handleSubmit, setValue, watch, control } =
    useForm<BecomeAgentFormValues>({
      defaultValues: {
        cityId: "",
        identity_proof: [],
        license_document: [],
        favorite_properties: [],
      },
    });

  const cityId = watch("cityId");
  const idProof = watch("identity_proof");
  const license = watch("license_document");
  const favoriteProperties = watch("favorite_properties");

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        const result = await getCitiesData();
        if (result.rows) {
          setCities(result.rows);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("فشل في تحميل قائمة المدن", {
          duration: 5000,
          position: "top-center",
        });
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, [getCitiesData]);

  const onSubmit = async (data: BecomeAgentFormValues) => {
    // Validation
    if (!data.cityId) {
      toast.error("الرجاء اختيار المدينة", {
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

      // Append city ID
      formData.append("cityId", data.cityId.toString());

      // Append identity proof file (take the first file)
      if (data.identity_proof.length > 0) {
        const identityFile = data.identity_proof[0].file;
        if (identityFile) {
          formData.append("identityProofUrl", identityFile);
        }
      }

      // Append license document file (take the first file)
      if (data.license_document.length > 0) {
        const licenseFile = data.license_document[0].file;
        if (licenseFile) {
          formData.append("residencyDocumentUrl", licenseFile);
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
        router.push("/"); // Redirect to home or dashboard
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

  // Get user data from localStorage or context
  const getUserData = () => {
    try {
      const userDataStr = localStorage.getItem("user");
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

  const cityOptions = [
    { label: "اختر المدينة", value: "" },
    ...cities?.map((city) => ({
      label: city.name,
      value: String(city.id),
      disabled: !city.isActive, // Optionally disable inactive cities
    })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card title="طلب الانضمام كوسيط">
        <div className="grid grid-cols-12 gap-4">
          {/* المدينة */}
          <div className="col-span-12 md:col-span-12">
            <label className="text-xl font-medium block mb-3">المدينة</label>
            <SelectInput
              name="cityId"
              options={cityOptions}
              value={cityId}
              onChange={(val) => setValue("cityId", val)}
              disabled={citiesLoading || isLoading}
              loading={citiesLoading}
            />
            {citiesLoading && (
              <p className="text-sm text-gray-500 mt-1">جاري تحميل المدن...</p>
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
              maxFiles={1} // Changed to 1 file as per API requirement
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
              maxFiles={1} // Changed to 1 file as per API requirement
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
          disabled={isLoading || citiesLoading}
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

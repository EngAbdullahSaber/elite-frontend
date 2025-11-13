"use client";

import { Control, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import { AboutContentForm } from "./AboutForm";

import toast from "react-hot-toast";
import {
  getFeatures,
  createFeature,
  deleteFeature,
  Feature,
  getPageSections,
  updateSection,
  Section,
} from "@/services/AboutUsPage/AboutUsPage";
import { PiPlusCircleDuotone } from "react-icons/pi";
import { BiTrash } from "react-icons/bi";

type MainSectionFormProps = {
  control: Control<AboutContentForm>;
};

export default function MainSectionForm({ control }: MainSectionFormProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [mainSection, setMainSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(true);
  const [updatingSection, setUpdatingSection] = useState(false);
  const [newFeatureText, setNewFeatureText] = useState("");
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const MAIN_PAGE_ID = 10; // The page ID for about page
  const MAIN_SECTION_ID = 5; // The section ID we want (the one with "استكشاف العقارات")

  useEffect(() => {
    fetchMainSection();
    fetchFeatures();
  }, []);

  const fetchMainSection = async () => {
    try {
      setSectionLoading(true);
      const response = await getPageSections(MAIN_PAGE_ID, {
        limit: 50, // Get more sections to make sure we find the one we need
        sortBy: "createdAt",
        sortOrder: "DESC",
      });

      // Find the section with ID 10 in the records array
      const targetSection = response.records.find(
        (section) => section.id === MAIN_SECTION_ID
      );

      if (targetSection) {
        setMainSection(targetSection);
      } else {
        console.warn(`Section with ID ${MAIN_SECTION_ID} not found`);
        toast.error("لم يتم العثور على القسم الرئيسي");
      }
    } catch (error) {
      console.error("Error fetching main section:", error);
      toast.error("فشل في تحميل بيانات القسم الرئيسي");
    } finally {
      setSectionLoading(false);
    }
  };

  // Alternative approach if you want to get the section by key instead of ID
  const fetchMainSectionByKey = async () => {
    try {
      setSectionLoading(true);
      const response = await getPageSections(MAIN_PAGE_ID, {
        limit: 50,
      });

      // Find the section by key instead of ID
      const targetSection = response.records.find(
        (section) => section.sectionKey === "استكشاف العقارات"
      );

      if (targetSection) {
        setMainSection(targetSection);
      } else {
        console.warn('Section with key "استكشاف العقارات" not found');
        toast.error("لم يتم العثور على القسم الرئيسي");
      }
    } catch (error) {
      console.error("Error fetching main section:", error);
      toast.error("فشل في تحميل بيانات القسم الرئيسي");
    } finally {
      setSectionLoading(false);
    }
  };

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await getFeatures({
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });
      setFeatures(response.records);
    } catch (error) {
      console.error("Error fetching features:", error);
      toast.error("فشل في تحميل الميزات");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSection = async (field: string, value: string) => {
    if (!mainSection) return;

    try {
      setUpdatingSection(true);

      const updateData: any = {};
      if (field === "title") {
        updateData.title = value;
      } else if (field === "description") {
        updateData.description = value;
      }

      const updatedSection = await updateSection(mainSection.id, updateData);
      setMainSection(updatedSection);

      toast.success("تم تحديث القسم الرئيسي بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
      });
    } catch (error: any) {
      console.error("Error updating section:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "فشل في تحديث القسم الرئيسي";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setUpdatingSection(false);
    }
  };

  // Debounced update function to avoid too many API calls
  const debouncedUpdate = (() => {
    let timeoutId: NodeJS.Timeout;
    return (field: string, value: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleUpdateSection(field, value);
      }, 1000); // Wait 1 second after user stops typing
    };
  })();

  const handleAddFeature = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFeatureText.trim()) {
      toast.error("يرجى إدخال نص الميزة");
      return;
    }

    if (newFeatureText.length > 500) {
      toast.error("نص الميزة يجب أن لا يتجاوز 500 حرف");
      return;
    }

    if (newFeatureText.length < 3) {
      toast.error("نص الميزة يجب أن يكون 3 أحرف على الأقل");
      return;
    }

    try {
      setIsAddingFeature(true);
      const newFeature = await createFeature({ featureText: newFeatureText });

      toast.success("تم إضافة الميزة بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
      });

      setNewFeatureText("");
      setFeatures((prev) => [newFeature, ...prev]);
    } catch (error: any) {
      console.error("Error creating feature:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "فشل في إضافة الميزة";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setIsAddingFeature(false);
    }
  };

  const handleDeleteFeature = async (id: number, featureText: string) => {
    try {
      setDeletingIds((prev) => [...prev, id]);
      await deleteFeature(id);

      toast.success("تم حذف الميزة بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
      });

      setFeatures((prev) => prev.filter((feature) => feature.id !== id));
    } catch (error: any) {
      console.error("Error deleting feature:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "فشل في حذف الميزة";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setDeletingIds((prev) => prev.filter((deletingId) => deletingId !== id));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddFeature(e as any);
    }
  };

  return (
    <Card title="القسم الرئيسي" collapsible>
      {/* Section Loading State */}
      {sectionLoading && (
        <div className="space-y-4 mb-6">
          <div className="animate-pulse bg-gray-200 rounded-lg h-12"></div>
          <div className="animate-pulse bg-gray-200 rounded-lg h-12"></div>
        </div>
      )}

      {/* Main Title and Subtitle */}
      {!sectionLoading && mainSection && (
        <div className="space-y-4 mb-6">
          <Controller
            name="mainTitle"
            control={control}
            defaultValue={mainSection.title}
            render={({ field }) => (
              <div className="relative">
                <TextInput
                  {...field}
                  id="main-title"
                  label="العنوان الرئيسي"
                  placeholder="مثال: نبني مساحات حديثة ونوفر عقارات للبيع والشراء"
                  onChange={(e) => {
                    field.onChange(e);
                    debouncedUpdate("title", e.target.value);
                  }}
                  disabled={updatingSection}
                />
                {updatingSection && (
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            )}
          />

          <Controller
            name="mainSubtitle"
            control={control}
            defaultValue={mainSection.description}
            render={({ field }) => (
              <div className="relative">
                <TextInput
                  {...field}
                  id="main-subtitle"
                  label="النص الفرعي"
                  placeholder="مثال: ابحث عن منزل أحلامك"
                  onChange={(e) => {
                    field.onChange(e);
                    debouncedUpdate("description", e.target.value);
                  }}
                  disabled={updatingSection}
                />
                {updatingSection && (
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            )}
          />

          {/* Current Section Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-blue-800">
                  معلومات القسم الحالية
                </h4>
              </div>
              <button
                onClick={fetchMainSection}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                تحديث البيانات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show message if section not found */}
      {!sectionLoading && !mainSection && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <BiTrash className="w-6 h-6 text-gray-400" />
          </div>
          <p>لم يتم العثور على القسم الرئيسي</p>
          <p className="text-sm mt-1">يرجى التحقق من إعدادات الصفحة</p>
          <PrimaryButton onClick={fetchMainSection} className="mt-3">
            إعادة المحاولة
          </PrimaryButton>
        </div>
      )}

      {/* Rest of your features management code remains the same */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          إدارة الميزات
        </h3>

        {/* Add New Feature Form */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label
                htmlFor="new-feature"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                إضافة ميزة جديدة
              </label>
              <input
                id="new-feature"
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="أدخل نص الميزة الجديدة..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isAddingFeature}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  {newFeatureText.length}/500 حرف
                </p>
                {newFeatureText.length > 0 && (
                  <p
                    className={`text-xs ${
                      newFeatureText.length < 3
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {newFeatureText.length < 3
                      ? "يجب أن يكون 3 أحرف على الأقل"
                      : "مقبول"}
                  </p>
                )}
              </div>
            </div>
            <PrimaryButton
              type="submit"
              loading={isAddingFeature}
              onClick={handleAddFeature}
              disabled={
                isAddingFeature ||
                !newFeatureText.trim() ||
                newFeatureText.length < 3
              }
              className="flex items-center gap-2"
            >
              <PiPlusCircleDuotone className="w-4 h-4" />
              {isAddingFeature ? "جاري الإضافة..." : "إضافة"}
            </PrimaryButton>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">الميزات الحالية</h4>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {features.length} ميزة
            </span>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-gray-200 rounded-lg h-12"
                ></div>
              ))}
            </div>
          ) : features.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto border rounded-lg">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="flex items-center justify-between p-4 bg-white border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white text-sm rounded-full flex items-center justify-center mt-1">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 break-words">
                        {feature.featureText}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        أضيف في{" "}
                        {new Date(feature.createdAt).toLocaleDateString(
                          "ar-EG"
                        )}
                      </p>
                    </div>
                  </div>
                  <SoftActionButton
                    onClick={() =>
                      handleDeleteFeature(feature.id, feature.featureText)
                    }
                    disabled={deletingIds.includes(feature.id)}
                    className="flex items-center gap-1 text-red-600 hover:bg-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    <BiTrash className="w-4 h-4" />
                    {deletingIds.includes(feature.id) ? "جاري الحذف..." : "حذف"}
                  </SoftActionButton>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <PiPlusCircleDuotone className="w-6 h-6 text-gray-400" />
              </div>
              <p>لا توجد ميزات مضافة حتى الآن</p>
              <p className="text-sm mt-1">
                استخدم النموذج أعلاه لإضافة أول ميزة
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

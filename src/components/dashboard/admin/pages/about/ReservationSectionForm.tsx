"use client";

import { Control, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import TextareaInput from "@/components/shared/Forms/TextareaInput";
import Image from "next/image";
import { AboutContentForm } from "./AboutForm";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import toast from "react-hot-toast";
import {
  getSteps,
  createStep,
  deleteStep,
  type Step,
  sortStepsByNumber,
  getNextStepNumber,
  getPageSections,
  updateSection,
  type Section,
} from "@/services/AboutUsPage/AboutUsPage";
import { PiPlusCircleDuotone } from "react-icons/pi";
import { BiTrash } from "react-icons/bi";

const stepImages = [
  "/main/about/work-process-icon-1.png",
  "/main/about/work-process-icon-2.png",
  "/main/about/work-process-icon-3.png",
  "/main/about/work-process-icon-4.png",
  "/main/about/work-process-icon-5.png",
  "/main/about/work-process-icon-6.png",
];

type ReservationSectionFormProps = {
  control: Control<AboutContentForm>;
};

export default function ReservationSectionForm({
  control,
}: ReservationSectionFormProps) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [reservationSection, setReservationSection] = useState<Section | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(true);
  const [updatingSection, setUpdatingSection] = useState(false);
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [newStepData, setNewStepData] = useState({
    title: "",
    description: "",
  });

  // Local state for form values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const MAIN_PAGE_ID = 10; // The page ID for about page
  const RESERVATION_SECTION_ID = 6; // The section ID for reservations

  useEffect(() => {
    fetchReservationSection();
    fetchSteps();
  }, []);

  // Update local state when section is fetched
  useEffect(() => {
    if (reservationSection) {
      setTitle(reservationSection.title);
      setDescription(reservationSection.description);
    }
  }, [reservationSection]);

  const fetchReservationSection = async () => {
    try {
      setSectionLoading(true);
      const response = await getPageSections(MAIN_PAGE_ID, {
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });

      // Find the section with ID 6 in the records array
      const targetSection = response.records.find(
        (section) => section.id === RESERVATION_SECTION_ID
      );

      if (targetSection) {
        setReservationSection(targetSection);
        console.log("Found reservation section:", targetSection);
      } else {
        console.warn(`Section with ID ${RESERVATION_SECTION_ID} not found`);
        toast.error("لم يتم العثور على قسم الحجوزات");
      }
    } catch (error) {
      console.error("Error fetching reservation section:", error);
      toast.error("فشل في تحميل بيانات قسم الحجوزات");
    } finally {
      setSectionLoading(false);
    }
  };

  const fetchSteps = async () => {
    try {
      setLoading(true);
      const response = await getSteps({
        sortBy: "stepNumber",
        sortOrder: "ASC",
      });
      const sortedSteps = sortStepsByNumber(response.records);
      setSteps(sortedSteps);
    } catch (error) {
      console.error("Error fetching steps:", error);
      toast.error("فشل في تحميل خطوات الحجز");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSection = async () => {
    if (!reservationSection) return;

    // Validation
    if (!title.trim()) {
      toast.error("يرجى إدخال عنوان القسم");
      return;
    }

    if (!description.trim()) {
      toast.error("يرجى إدخال وصف القسم");
      return;
    }

    try {
      setUpdatingSection(true);

      const updatedSection = await updateSection(reservationSection.id, {
        title: title.trim(),
        description: description.trim(),
      });
      setReservationSection(updatedSection);

      toast.success("تم تحديث قسم الحجوزات بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
      });
    } catch (error: any) {
      console.error("Error updating section:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "فشل في تحديث قسم الحجوزات";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setUpdatingSection(false);
    }
  };

  // Check if form has changes
  const hasChanges =
    reservationSection &&
    (title !== reservationSection.title ||
      description !== reservationSection.description);

  // Reset form to original values
  const handleReset = () => {
    if (reservationSection) {
      setTitle(reservationSection.title);
      setDescription(reservationSection.description);
    }
  };

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newStepData.title.trim() || !newStepData.description.trim()) {
      toast.error("يرجى إدخال عنوان ووصف للخطوة");
      return;
    }

    if (newStepData.title.length > 100) {
      toast.error("عنوان الخطوة يجب أن لا يتجاوز 100 حرف");
      return;
    }

    if (newStepData.description.length > 500) {
      toast.error("وصف الخطوة يجب أن لا يتجاوز 500 حرف");
      return;
    }

    try {
      setIsAddingStep(true);
      const nextStepNumber = getNextStepNumber(steps);

      const newStep = await createStep({
        stepNumber: nextStepNumber,
        title: newStepData.title,
        description: newStepData.description,
      });

      toast.success("تم إضافة الخطوة بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
      });

      setNewStepData({ title: "", description: "" });
      setSteps((prev) => sortStepsByNumber([...prev, newStep]));
    } catch (error: any) {
      console.error("Error creating step:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "فشل في إضافة الخطوة";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setIsAddingStep(false);
    }
  };

  const handleDeleteStep = async (id: number, stepTitle: string) => {
    try {
      setDeletingIds((prev) => [...prev, id]);
      await deleteStep(id);

      toast.success("تم حذف الخطوة بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
      });

      setSteps((prev) => prev.filter((step) => step.id !== id));
    } catch (error: any) {
      console.error("Error deleting step:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "فشل في حذف الخطوة";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setDeletingIds((prev) => prev.filter((deletingId) => deletingId !== id));
    }
  };

  const getStepImage = (index: number) => {
    return stepImages[index % stepImages.length];
  };

  return (
    <Card title="عملية الحجز" collapsible>
      {/* Section Loading State */}
      {sectionLoading && (
        <div className="space-y-4 mb-6">
          <div className="animate-pulse bg-gray-200 rounded-lg h-12"></div>
          <div className="animate-pulse bg-gray-200 rounded-lg h-12"></div>
        </div>
      )}

      {/* Section Title and Description */}
      {!sectionLoading && reservationSection && (
        <div className="space-y-4 mb-6">
          <div>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="booking-title"
              label="عنوان القسم"
              placeholder="مثال: كيفية حجز تذاكر الطيران: دليل خطوة بخطوة"
            />
          </div>

          <div>
            <TextareaInput
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="booking-subtitle"
              label="وصف القسم"
              placeholder="اشرح بإيجاز خطوات الحجز (مثال: يمكن شراء العقارات أو بيعها أو تأجيرها...)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            {hasChanges && (
              <SoftActionButton
                onClick={handleReset}
                disabled={updatingSection}
                className="text-gray-600 hover:bg-gray-200"
              >
                إلغاء التغييرات
              </SoftActionButton>
            )}
            <PrimaryButton
              onClick={handleUpdateSection}
              loading={updatingSection}
              disabled={!hasChanges || updatingSection}
              className="min-w-24"
            >
              {updatingSection ? "جاري الحفظ..." : "حفظ التغييرات"}
            </PrimaryButton>
          </div>

          {/* Current Section Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-blue-800">
                  معلومات القسم الحالية
                </h4>
                <p className="text-sm text-blue-600 mt-1">
                  <strong>المفتاح:</strong> {reservationSection.sectionKey}
                </p>
                <p className="text-sm text-blue-600">
                  <strong>آخر تحديث:</strong>{" "}
                  {new Date(reservationSection.updatedAt).toLocaleDateString(
                    "ar-EG"
                  )}
                </p>
                {hasChanges && (
                  <p className="text-sm text-orange-600 mt-1">
                    ⚠️ لديك تغييرات غير محفوظة
                  </p>
                )}
              </div>
              <button
                onClick={fetchReservationSection}
                disabled={updatingSection}
                className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
              >
                تحديث البيانات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show message if section not found */}
      {!sectionLoading && !reservationSection && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <BiTrash className="w-6 h-6 text-gray-400" />
          </div>
          <p>لم يتم العثور على قسم الحجوزات</p>
          <p className="text-sm mt-1">يرجى التحقق من إعدادات الصفحة</p>
          <PrimaryButton onClick={fetchReservationSection} className="mt-3">
            إعادة المحاولة
          </PrimaryButton>
        </div>
      )}

      {/* Steps Management Section */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            إدارة خطوات الحجز
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {steps.length} خطوة
          </span>
        </div>

        {/* Add New Step Form */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid gap-4">
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الخطوة الجديدة
                </label>
                <input
                  type="text"
                  value={newStepData.title}
                  onChange={(e) =>
                    setNewStepData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="أدخل عنوان الخطوة الجديدة..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isAddingStep}
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newStepData.title.length}/100 حرف
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الخطوة الجديدة
                </label>
                <textarea
                  value={newStepData.description}
                  onChange={(e) =>
                    setNewStepData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="أدخل وصف الخطوة الجديدة..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical min-h-[80px]"
                  disabled={isAddingStep}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newStepData.description.length}/500 حرف
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <PrimaryButton
                type="submit"
                loading={isAddingStep}
                onClick={handleAddStep}
                disabled={
                  isAddingStep ||
                  !newStepData.title.trim() ||
                  !newStepData.description.trim() ||
                  newStepData.title.length < 2 ||
                  newStepData.description.length < 10
                }
                className="flex items-center gap-2"
              >
                <PiPlusCircleDuotone className="w-4 h-4" />
                {isAddingStep ? "جاري الإضافة..." : "إضافة خطوة جديدة"}
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-gray-200 rounded-lg h-32"
                ></div>
              ))}
            </div>
          ) : steps.length > 0 ? (
            <div className="grid lg:grid-cols-1 gap-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="border p-4 rounded-lg bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-primary text-white text-sm rounded-full flex items-center justify-center font-semibold">
                        {step.stepNumber}
                      </span>
                      <Image
                        src={getStepImage(index)}
                        width={32}
                        height={32}
                        alt={step.title}
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <SoftActionButton
                      onClick={() => handleDeleteStep(step.id, step.title)}
                      disabled={deletingIds.includes(step.id)}
                      className="flex items-center gap-1 text-red-600 hover:bg-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      <BiTrash className="w-4 h-4" />
                      {deletingIds.includes(step.id) ? "جاري الحذف..." : "حذف"}
                    </SoftActionButton>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    آخر تحديث:{" "}
                    {new Date(step.updatedAt).toLocaleDateString("ar-EG")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <PiPlusCircleDuotone className="w-6 h-6 text-gray-400" />
              </div>
              <p>لا توجد خطوات مضافة حتى الآن</p>
              <p className="text-sm mt-1">
                استخدم النموذج أعلاه لإضافة أول خطوة في عملية الحجز
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

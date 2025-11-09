import { Control, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import TextareaInput from "@/components/shared/Forms/TextareaInput";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import {
  BsAward,
  BsCheckSquare,
  BsHandThumbsUp,
  BsPersonCircle,
  BsPlus,
  BsTrash,
} from "react-icons/bs";
import { AboutContentForm } from "./AboutForm";
import {
  getStats,
  createStat,
  deleteStat,
  Stat,
  CreateStatData,
  getPageSections,
  updateSection,
  Section,
} from "@/services/AboutUsPage/AboutUsPage";
import toast from "react-hot-toast";

const defaultIcons = [
  {
    icon: <BsCheckSquare className="w-6 h-6 text-white" />,
    bg: "bg-primary",
  },
  {
    icon: <BsHandThumbsUp className="w-6 h-6 text-white" />,
    bg: "bg-[#22804A]",
  },
  {
    icon: <BsPersonCircle className="w-6 h-6 text-white" />,
    bg: "bg-[#9C742B]",
  },
  {
    icon: <BsAward className="w-6 h-6 text-white" />,
    bg: "bg-primary",
  },
];

type DiscoverPropertiesSectionFormProps = {
  control: Control<AboutContentForm>;
};

export default function DiscoverPropertiesSectionForm({
  control,
}: DiscoverPropertiesSectionFormProps) {
  const [stats, setStats] = useState<Stat[]>([]);
  const [discoverSection, setDiscoverSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(true);
  const [updatingSection, setUpdatingSection] = useState(false);
  const [newStat, setNewStat] = useState<CreateStatData>({
    label: "",
    value: "",
  });
  const [isAddingStat, setIsAddingStat] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  // Local state for form values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const MAIN_PAGE_ID = 10; // The page ID for about page
  const DISCOVER_SECTION_ID = 10; // The section ID for discover properties

  useEffect(() => {
    fetchDiscoverSection();
    fetchStats();
  }, []);

  // Update local state when section is fetched
  useEffect(() => {
    if (discoverSection) {
      setTitle(discoverSection.title);
      setDescription(discoverSection.description);
    }
  }, [discoverSection]);

  const fetchDiscoverSection = async () => {
    try {
      setSectionLoading(true);
      const response = await getPageSections(MAIN_PAGE_ID, {
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });

      // Find the section with ID 10 in the records array
      const targetSection = response.records.find(
        (section) => section.id === DISCOVER_SECTION_ID
      );

      if (targetSection) {
        setDiscoverSection(targetSection);
        console.log("Found discover properties section:", targetSection);
      } else {
        console.warn(`Section with ID ${DISCOVER_SECTION_ID} not found`);
        toast.error("لم يتم العثور على قسم استكشاف العقارات");
      }
    } catch (error) {
      console.error("Error fetching discover section:", error);
      toast.error("فشل في تحميل بيانات قسم استكشاف العقارات");
    } finally {
      setSectionLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getStats({
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "ASC",
      });
      setStats(response.records);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("فشل في تحميل الإحصائيات");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSection = async () => {
    if (!discoverSection) return;

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

      const updatedSection = await updateSection(discoverSection.id, {
        title: title.trim(),
        description: description.trim(),
      });
      setDiscoverSection(updatedSection);

      toast.success("تم تحديث قسم استكشاف العقارات بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
      });
    } catch (error: any) {
      console.error("Error updating section:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "فشل في تحديث قسم استكشاف العقارات";
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
    discoverSection &&
    (title !== discoverSection.title ||
      description !== discoverSection.description);

  // Reset form to original values
  const handleReset = () => {
    if (discoverSection) {
      setTitle(discoverSection.title);
      setDescription(discoverSection.description);
    }
  };

  const handleAddStat = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newStat.label.trim() || !newStat.value.trim()) {
      toast.error("يرجى إدخال جميع الحقول");
      return;
    }

    if (stats.length >= 4) {
      toast.error("لا يمكن إضافة أكثر من 4 إحصائيات في هذا القسم");
      return;
    }

    try {
      setIsAddingStat(true);
      const createdStat = await createStat(newStat);

      toast.success("تم إضافة الإحصائية بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
      });

      setNewStat({ label: "", value: "" });
      setStats((prev) => [...prev, createdStat]);
    } catch (error: any) {
      console.error("Error creating stat:", error);
      toast.error(error.response?.data?.message || "فشل في إضافة الإحصائية", {
        duration: 4000,
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setIsAddingStat(false);
    }
  };

  const handleDeleteStat = async (id: number, label: string) => {
    try {
      setDeletingIds((prev) => [...prev, id]);
      await deleteStat(id);

      toast.success("تم حذف الإحصائية بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
      });

      setStats((prev) => prev.filter((stat) => stat.id !== id));
    } catch (error: any) {
      console.error("Error deleting stat:", error);
      toast.error(error.response?.data?.message || "فشل في حذف الإحصائية", {
        duration: 4000,
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setDeletingIds((prev) => prev.filter((deletingId) => deletingId !== id));
    }
  };

  const getIconForStat = (index: number) => {
    return defaultIcons[index] || defaultIcons[0];
  };

  return (
    <Card title="استكشاف العقارات" collapsible>
      {/* Section Loading State */}
      {sectionLoading && (
        <div className="space-y-4 mb-6">
          <div className="animate-pulse bg-gray-200 rounded-lg h-12"></div>
          <div className="animate-pulse bg-gray-200 rounded-lg h-12"></div>
        </div>
      )}

      {/* Section Title and Description */}
      {!sectionLoading && discoverSection && (
        <div className="space-y-4 mb-6">
          <div>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="discover-title"
              label="عنوان القسم"
              placeholder="مثال: استكشاف العقارات"
            />
          </div>

          <div>
            <TextareaInput
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="discover-subtitle"
              label="وصف القسم"
              placeholder="مثال: نظرة تفصيلية داخل عقاراتنا"
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
                  <strong>المفتاح:</strong> {discoverSection.sectionKey}
                </p>
                <p className="text-sm text-blue-600">
                  <strong>آخر تحديث:</strong>{" "}
                  {new Date(discoverSection.updatedAt).toLocaleDateString(
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
                onClick={fetchDiscoverSection}
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
      {!sectionLoading && !discoverSection && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <BsTrash className="w-6 h-6 text-gray-400" />
          </div>
          <p>لم يتم العثور على قسم استكشاف العقارات</p>
          <p className="text-sm mt-1">يرجى التحقق من إعدادات الصفحة</p>
          <PrimaryButton onClick={fetchDiscoverSection} className="mt-3">
            إعادة المحاولة
          </PrimaryButton>
        </div>
      )}

      {/* Stats Management Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          إدارة إحصائيات الاستكشاف
        </h3>

        {/* Add New Stat Form */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="stat-label"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                تسمية الإحصائية *
              </label>
              <input
                id="stat-label"
                type="text"
                value={newStat.label}
                onChange={(e) =>
                  setNewStat((prev) => ({ ...prev, label: e.target.value }))
                }
                placeholder="مثال: عقار مكتمل"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isAddingStat}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {newStat.label.length}/100 حرف
              </p>
            </div>

            <div>
              <label
                htmlFor="stat-value"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                قيمة الإحصائية *
              </label>
              <input
                id="stat-value"
                type="text"
                value={newStat.value}
                onChange={(e) =>
                  setNewStat((prev) => ({ ...prev, value: e.target.value }))
                }
                placeholder="مثال: 15k"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isAddingStat}
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">
                {newStat.value.length}/50 حرف
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">{stats.length} / 4 إحصائية</p>
            <PrimaryButton
              type="submit"
              loading={isAddingStat}
              onClick={handleAddStat}
              disabled={
                isAddingStat ||
                !newStat.label.trim() ||
                !newStat.value.trim() ||
                stats.length >= 4
              }
              className="flex items-center gap-2"
            >
              <BsPlus className="w-4 h-4" />
              {isAddingStat ? "جاري الإضافة..." : "إضافة إحصائية"}
            </PrimaryButton>
          </div>
        </div>

        {/* Stats Display Grid */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">الإحصائيات المعروضة</h4>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
              {stats.length} إحصائية
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex flex-col items-center justify-center border rounded-md p-4 text-center"
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : stats.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const iconData = getIconForStat(index);
                return (
                  <div
                    key={stat.id}
                    className="flex flex-col items-center justify-center border rounded-md p-4 text-center relative group hover:shadow-md transition-shadow"
                  >
                    {/* Delete Button */}
                    <SoftActionButton
                      onClick={() => handleDeleteStat(stat.id, stat.label)}
                      disabled={deletingIds.includes(stat.id)}
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 text-xs p-1"
                    >
                      <BsTrash className="w-3 h-3" />
                      {deletingIds.includes(stat.id) ? "..." : ""}
                    </SoftActionButton>

                    {/* Icon */}
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${iconData.bg}`}
                    >
                      {iconData.icon}
                    </div>

                    {/* Label */}
                    <p className="font-semibold text-gray-700 text-sm mb-2">
                      {stat.label}
                    </p>

                    {/* Value */}
                    <p className="text-xl font-bold text-primary">
                      {stat.value}
                    </p>

                    {/* Position Indicator */}
                    <div className="absolute top-2 right-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </div>
                  </div>
                );
              })}

              {/* Empty slots for remaining positions */}
              {stats.length < 4 && (
                <>
                  {[...Array(4 - stats.length)].map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 text-center text-gray-400"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full mb-2 bg-gray-100">
                        <BsPlus className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="font-semibold text-sm mb-2">شاغر</p>
                      <p className="text-sm">
                        إحصائية {stats.length + index + 1}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsPlus className="w-8 h-8 text-gray-400" />
              </div>
              <p>لا توجد إحصائيات مضافة حتى الآن</p>
              <p className="text-sm mt-1">
                استخدم النموذج أعلاه لإضافة الإحصائيات
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

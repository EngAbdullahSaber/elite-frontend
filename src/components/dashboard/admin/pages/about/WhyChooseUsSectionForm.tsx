"use client";

import { Control } from "react-hook-form";
import { useState, useEffect } from "react";
import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import TextareaInput from "@/components/shared/Forms/TextareaInput";
import { AboutContentForm } from "./AboutForm";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import toast from "react-hot-toast";
import {
  getPageSections,
  updateSection,
  type Section,
} from "@/services/AboutUsPage/AboutUsPage";
import { BiTrash } from "react-icons/bi";

type WhyChooseUsSectionFormProps = {
  control: Control<AboutContentForm>;
};

export default function WhyChooseUsSectionForm({
  control,
}: WhyChooseUsSectionFormProps) {
  const [sections, setSections] = useState<{
    main: Section | null;
    client: Section | null;
    developer: Section | null;
  }>({
    main: null,
    client: null,
    developer: null,
  });

  const [sectionLoading, setSectionLoading] = useState(true);
  const [updatingSections, setUpdatingSections] = useState<{
    main: boolean;
    client: boolean;
    developer: boolean;
  }>({
    main: false,
    client: false,
    developer: false,
  });

  // Local state for form values
  const [mainTitle, setMainTitle] = useState("");
  const [mainDescription, setMainDescription] = useState("");
  const [clientDescription, setClientDescription] = useState("");
  const [developerDescription, setDeveloperDescription] = useState("");

  const MAIN_PAGE_ID = 10; // The page ID for about page
  const WHY_CHOOSE_US_SECTION_ID = 7; // Main why choose us section
  const CLIENT_SECTION_ID = 8; // Client section
  const DEVELOPER_SECTION_ID = 9; // Developer section

  useEffect(() => {
    fetchWhyChooseUsSections();
  }, []);

  // Update local state when sections are fetched
  useEffect(() => {
    if (sections.main) {
      setMainTitle(sections.main.title);
      setMainDescription(sections.main.description);
    }
    if (sections.client) {
      setClientDescription(sections.client.description);
    }
    if (sections.developer) {
      setDeveloperDescription(sections.developer.description);
    }
  }, [sections]);

  const fetchWhyChooseUsSections = async () => {
    try {
      setSectionLoading(true);
      const response = await getPageSections(MAIN_PAGE_ID, {
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });

      // Find all three sections
      const mainSection = response.records.find(
        (section) => section.id === WHY_CHOOSE_US_SECTION_ID
      );
      const clientSection = response.records.find(
        (section) => section.id === CLIENT_SECTION_ID
      );
      const developerSection = response.records.find(
        (section) => section.id === DEVELOPER_SECTION_ID
      );

      setSections({
        main: mainSection || null,
        client: clientSection || null,
        developer: developerSection || null,
      });

      if (!mainSection || !clientSection || !developerSection) {
        const missingSections = [];
        if (!mainSection) missingSections.push("القسم الرئيسي (7)");
        if (!clientSection) missingSections.push("قسم العميل (8)");
        if (!developerSection) missingSections.push("قسم المطور (9)");

        console.warn(`Missing sections: ${missingSections.join(", ")}`);
        toast.error(`لم يتم العثور على: ${missingSections.join(", ")}`);
      } else {
       }
    } catch (error) {
      console.error("Error fetching why choose us sections:", error);
      toast.error("فشل في تحميل بيانات قسم لماذا تختارنا");
    } finally {
      setSectionLoading(false);
    }
  };

  const handleUpdateSection = async (
    sectionType: "main" | "client" | "developer"
  ) => {
    const section = sections[sectionType];
    if (!section) return;

    let updateData: { title?: string; description: string } = {
      description: "",
    };

    // Validation
    if (sectionType === "main") {
      if (!mainTitle.trim()) {
        toast.error("يرجى إدخال عنوان القسم الرئيسي");
        return;
      }
      if (!mainDescription.trim()) {
        toast.error("يرجى إدخال وصف القسم الرئيسي");
        return;
      }
      updateData = {
        title: mainTitle.trim(),
        description: mainDescription.trim(),
      };
    } else if (sectionType === "client") {
      if (!clientDescription.trim()) {
        toast.error("يرجى إدخال وصف قسم العميل");
        return;
      }
      updateData = { description: clientDescription.trim() };
    } else if (sectionType === "developer") {
      if (!developerDescription.trim()) {
        toast.error("يرجى إدخال وصف قسم المطور");
        return;
      }
      updateData = { description: developerDescription.trim() };
    }

    try {
      setUpdatingSections((prev) => ({ ...prev, [sectionType]: true }));

      const updatedSection = await updateSection(section.id, updateData);

      // Update the specific section in state
      setSections((prev) => ({
        ...prev,
        [sectionType]: updatedSection,
      }));

      toast.success(`تم تحديث ${getSectionName(sectionType)} بنجاح`, {
        duration: 4000,
        position: "top-center",
        icon: "✅",
      });
    } catch (error: any) {
      console.error(`Error updating ${sectionType} section:`, error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `فشل في تحديث ${getSectionName(sectionType)}`;
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setUpdatingSections((prev) => ({ ...prev, [sectionType]: false }));
    }
  };

  const getSectionName = (sectionType: string) => {
    const names: { [key: string]: string } = {
      main: "القسم الرئيسي",
      client: "قسم العميل",
      developer: "قسم المطور",
    };
    return names[sectionType] || "القسم";
  };

  // Check if form has changes for each section
  const hasChanges = {
    main:
      sections.main &&
      (mainTitle !== sections.main.title ||
        mainDescription !== sections.main.description),
    client:
      sections.client && clientDescription !== sections.client.description,
    developer:
      sections.developer &&
      developerDescription !== sections.developer.description,
  };

  // Reset form to original values for specific section
  const handleReset = (sectionType: "main" | "client" | "developer") => {
    const section = sections[sectionType];
    if (!section) return;

    if (sectionType === "main") {
      setMainTitle(section.title);
      setMainDescription(section.description);
    } else if (sectionType === "client") {
      setClientDescription(section.description);
    } else if (sectionType === "developer") {
      setDeveloperDescription(section.description);
    }
  };

  // Check if all sections are loaded
  const allSectionsLoaded =
    sections.main && sections.client && sections.developer;

  return (
    <Card title="لماذا تختارنا" collapsible>
      {/* Section Loading State */}
      {sectionLoading && (
        <div className="space-y-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="animate-pulse bg-gray-200 rounded-lg h-12"></div>
              <div className="animate-pulse bg-gray-200 rounded-lg h-24"></div>
            </div>
          ))}
        </div>
      )}

      {/* Main Why Choose Us Section */}
      {!sectionLoading && sections.main && (
        <div className="space-y-4 mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            القسم الرئيسي
          </h3>

          <div>
            <TextInput
              value={mainTitle}
              onChange={(e) => setMainTitle(e.target.value)}
              id="why-title"
              label="العنوان"
              placeholder="مثال: ارتقِ بتجربة السكن.."
            />
          </div>

          <div>
            <TextareaInput
              value={mainDescription}
              onChange={(e) => setMainDescription(e.target.value)}
              id="why-subtitle"
              label="الوصف"
              placeholder="مثال: دائما يتم ترديد عبارة لسنا الوحيدين ولكن نحن الأفضل..."
            />
          </div>

          {/* Action Buttons for Main Section */}
          <div className="flex gap-3 justify-end">
            {hasChanges.main && (
              <SoftActionButton
                onClick={() => handleReset("main")}
                disabled={updatingSections.main}
                className="text-gray-600 hover:bg-gray-200"
              >
                إلغاء التغييرات
              </SoftActionButton>
            )}
            <PrimaryButton
              onClick={() => handleUpdateSection("main")}
              loading={updatingSections.main}
              disabled={!hasChanges.main || updatingSections.main}
              className="min-w-24"
            >
              {updatingSections.main ? "جاري الحفظ..." : "حفظ"}
            </PrimaryButton>
          </div>

          {/* Current Section Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-blue-800">معلومات القسم</h4>
                <p className="text-sm text-blue-600 mt-1">
                  <strong>المفتاح:</strong> {sections.main.sectionKey}
                </p>
                <p className="text-sm text-blue-600">
                  <strong>آخر تحديث:</strong>{" "}
                  {new Date(sections.main.updatedAt).toLocaleDateString(
                    "ar-EG"
                  )}
                </p>
                {hasChanges.main && (
                  <p className="text-sm text-orange-600 mt-1">
                    ⚠️ لديك تغييرات غير محفوظة
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Section */}
      {!sectionLoading && sections.client && (
        <div className="space-y-4 mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            أما لو كنت العميل
          </h3>

          <div>
            <TextareaInput
              value={clientDescription}
              onChange={(e) => setClientDescription(e.target.value)}
              id="why-client-description"
              label="الوصف"
              placeholder="اشرح كيف تهتم بالعميل (مثال: تقديم استشارات، تجربة شراء فريدة...)"
            />
          </div>

          {/* Action Buttons for Client Section */}
          <div className="flex gap-3 justify-end">
            {hasChanges.client && (
              <SoftActionButton
                onClick={() => handleReset("client")}
                disabled={updatingSections.client}
                className="text-gray-600 hover:bg-gray-200"
              >
                إلغاء التغييرات
              </SoftActionButton>
            )}
            <PrimaryButton
              onClick={() => handleUpdateSection("client")}
              loading={updatingSections.client}
              disabled={!hasChanges.client || updatingSections.client}
              className="min-w-24"
            >
              {updatingSections.client ? "جاري الحفظ..." : "حفظ"}
            </PrimaryButton>
          </div>

          {/* Current Section Info */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-green-800">معلومات القسم</h4>
                <p className="text-sm text-green-600 mt-1">
                  <strong>المفتاح:</strong> {sections.client.sectionKey}
                </p>
                <p className="text-sm text-green-600">
                  <strong>آخر تحديث:</strong>{" "}
                  {new Date(sections.client.updatedAt).toLocaleDateString(
                    "ar-EG"
                  )}
                </p>
                {hasChanges.client && (
                  <p className="text-sm text-orange-600 mt-1">
                    ⚠️ لديك تغييرات غير محفوظة
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Developer Section */}
      {!sectionLoading && sections.developer && (
        <div className="space-y-4 mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            لو كنت مطور أو مالك عقار
          </h3>

          <div>
            <TextareaInput
              value={developerDescription}
              onChange={(e) => setDeveloperDescription(e.target.value)}
              id="why-developer-description"
              label="الوصف"
              placeholder="اشرح كيف تساعد المطور أو المالك (مثال: تسويق العقار، تصوير احترافي...)"
            />
          </div>

          {/* Action Buttons for Developer Section */}
          <div className="flex gap-3 justify-end">
            {hasChanges.developer && (
              <SoftActionButton
                onClick={() => handleReset("developer")}
                disabled={updatingSections.developer}
                className="text-gray-600 hover:bg-gray-200"
              >
                إلغاء التغييرات
              </SoftActionButton>
            )}
            <PrimaryButton
              onClick={() => handleUpdateSection("developer")}
              loading={updatingSections.developer}
              disabled={!hasChanges.developer || updatingSections.developer}
              className="min-w-24"
            >
              {updatingSections.developer ? "جاري الحفظ..." : "حفظ"}
            </PrimaryButton>
          </div>

          {/* Current Section Info */}
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-purple-800">معلومات القسم</h4>
                <p className="text-sm text-purple-600 mt-1">
                  <strong>المفتاح:</strong> {sections.developer.sectionKey}
                </p>
                <p className="text-sm text-purple-600">
                  <strong>آخر تحديث:</strong>{" "}
                  {new Date(sections.developer.updatedAt).toLocaleDateString(
                    "ar-EG"
                  )}
                </p>
                {hasChanges.developer && (
                  <p className="text-sm text-orange-600 mt-1">
                    ⚠️ لديك تغييرات غير محفوظة
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show message if some sections not found */}
      {!sectionLoading && !allSectionsLoaded && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <BiTrash className="w-6 h-6 text-gray-400" />
          </div>
          <p>لم يتم العثور على بعض الأقسام</p>
          <p className="text-sm mt-1">يرجى التحقق من إعدادات الصفحة</p>
          <PrimaryButton onClick={fetchWhyChooseUsSections} className="mt-3">
            إعادة المحاولة
          </PrimaryButton>
        </div>
      )}

      {/* Refresh All Button */}
      {!sectionLoading && allSectionsLoaded && (
        <div className="flex justify-center mt-6">
          <SoftActionButton
            onClick={fetchWhyChooseUsSections}
            className="text-blue-600 hover:bg-blue-100"
          >
            تحديث جميع البيانات
          </SoftActionButton>
        </div>
      )}
    </Card>
  );
}

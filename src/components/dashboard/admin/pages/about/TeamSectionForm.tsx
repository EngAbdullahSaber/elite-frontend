"use client";

import { Control, Controller } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import TextareaInput from "@/components/shared/Forms/TextareaInput";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import toast from "react-hot-toast";
import {
  getPageSections,
  updateSection,
  type Section,
} from "@/services/AboutUsPage/AboutUsPage";
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  type TeamMember,
  type CreateTeamMemberData,
  type UpdateTeamMemberData,
} from "@/services/AboutUsPage/AboutUsPage";
import {
  BiTrash,
  BiEdit,
  BiPlus,
  BiRefresh,
  BiUpload,
  BiImage,
} from "react-icons/bi";
import { ImageBaseUrl } from "@/libs/app.config";

type TeamSectionFormProps = {
  control: Control<any>;
};

export default function TeamSectionForm({ control }: TeamSectionFormProps) {
  const [teamSection, setTeamSection] = useState<Section | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [sectionLoading, setSectionLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [updatingSection, setUpdatingSection] = useState(false);
  const [updatingMember, setUpdatingMember] = useState<number | null>(null);
  const [creatingMember, setCreatingMember] = useState(false);

  // File upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Local state for form values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Team member form state
  const [newMember, setNewMember] = useState({
    name: "",
    position: "",
    imageFile: null as File | null,
    imagePreview: "",
  });

  const [editingMember, setEditingMember] = useState<{
    member: TeamMember;
    formData: {
      name: string;
      position: string;
      imageFile: File | null;
      imagePreview: string;
    };
  } | null>(null);

  const MAIN_PAGE_ID = 10; // The page ID for about page
  const TEAM_SECTION_ID = 11; // The section ID for team section

  useEffect(() => {
    fetchTeamSection();
    fetchTeamMembers();
  }, []);

  // Update local state when section is fetched
  useEffect(() => {
    if (teamSection) {
      setTitle(teamSection.title);
      setDescription(teamSection.description);
    }
  }, [teamSection]);

  const fetchTeamSection = async () => {
    try {
      setSectionLoading(true);
      const response = await getPageSections(MAIN_PAGE_ID, {
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });

      const targetSection = response.records.find(
        (section) => section.id === TEAM_SECTION_ID
      );

      if (targetSection) {
        setTeamSection(targetSection);
      } else {
        toast.error("لم يتم العثور على قسم الفريق");
      }
    } catch (error) {
      console.error("Error fetching team section:", error);
      toast.error("فشل في تحميل بيانات قسم الفريق");
    } finally {
      setSectionLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      setMembersLoading(true);
      const response = await getTeamMembers({
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });
      setTeamMembers(response.records || response);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("فشل في تحميل أعضاء الفريق");
    } finally {
      setMembersLoading(false);
    }
  };

  // File handling functions
  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى اختيار ملف صورة فقط");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5MB");
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      if (isEdit && editingMember) {
        setEditingMember({
          ...editingMember,
          formData: {
            ...editingMember.formData,
            imageFile: file,
            imagePreview: previewUrl,
          },
        });
      } else {
        setNewMember((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: previewUrl,
        }));
      }
    }
  };

  const removeImage = (isEdit: boolean = false) => {
    if (isEdit && editingMember) {
      setEditingMember({
        ...editingMember,
        formData: {
          ...editingMember.formData,
          imageFile: null,
          imagePreview: "",
        },
      });
    } else {
      setNewMember((prev) => ({
        ...prev,
        imageFile: null,
        imagePreview: "",
      }));
    }
  };

  const triggerFileInput = (isEdit: boolean = false) => {
    if (isEdit) {
      editFileInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleUpdateSection = async () => {
    if (!teamSection) return;

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
      const updatedSection = await updateSection(teamSection.id, {
        title: title.trim(),
        description: description.trim(),
      });
      setTeamSection(updatedSection);
      toast.success("تم تحديث قسم الفريق بنجاح");
    } catch (error: any) {
      console.error("Error updating section:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "فشل في تحديث قسم الفريق";
      toast.error(errorMessage);
    } finally {
      setUpdatingSection(false);
    }
  };

  const handleCreateMember = async () => {
    if (!newMember.name.trim() || !newMember.position.trim()) {
      toast.error("يرجى إدخال اسم العضو والمنصب");
      return;
    }

    if (!newMember.imageFile) {
      toast.error("يرجى اختيار صورة للعضو");
      return;
    }

    try {
      setCreatingMember(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", newMember.name.trim());
      formData.append("position", newMember.position.trim());
      formData.append("image", newMember.imageFile);

      const createdMember = await createTeamMember(formData as any);
      setTeamMembers((prev) => [createdMember, ...prev]);

      // Reset form
      setNewMember({
        name: "",
        position: "",
        imageFile: null,
        imagePreview: "",
      });

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("تم إضافة العضو بنجاح");
    } catch (error: any) {
      console.error("Error creating team member:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "فشل في إضافة العضو";
      toast.error(errorMessage);
    } finally {
      setCreatingMember(false);
    }
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    const { member, formData } = editingMember;

    if (!formData.name.trim() || !formData.position.trim()) {
      toast.error("يرجى إدخال اسم العضو والمنصب");
      return;
    }

    try {
      setUpdatingMember(member.id);

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("position", formData.position.trim());

      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      const updatedMember = await updateTeamMember(
        member.id,
        formDataToSend as any
      );

      // Update local state
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === member.id ? updatedMember : m))
      );
      setEditingMember(null);

      // Clear file input
      if (editFileInputRef.current) {
        editFileInputRef.current.value = "";
      }

      toast.success("تم تحديث العضو بنجاح");
    } catch (error: any) {
      console.error("Error updating team member:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "فشل في تحديث العضو";
      toast.error(errorMessage);
    } finally {
      setUpdatingMember(null);
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    try {
      setUpdatingMember(memberId);
      await deleteTeamMember(memberId);
      setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
      toast.success("تم حذف العضو بنجاح");
    } catch (error: any) {
      console.error("Error deleting team member:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "فشل في حذف العضو";
      toast.error(errorMessage);
    } finally {
      setUpdatingMember(null);
    }
  };

  const startEditing = (member: TeamMember) => {
    setEditingMember({
      member,
      formData: {
        name: member.name,
        position: member.position,
        imageFile: null,
        imagePreview: member.imageUrl,
      },
    });
  };

  const cancelEditing = () => {
    setEditingMember(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  // Check if form has changes
  const hasChanges =
    teamSection &&
    (title !== teamSection.title || description !== teamSection.description);

  // Reset form to original values
  const handleReset = () => {
    if (teamSection) {
      setTitle(teamSection.title);
      setDescription(teamSection.description);
    }
  };

  // Image upload component
  const ImageUploadField = ({
    preview,
    onFileSelect,
    onRemove,
    isEdit = false,
  }: {
    preview: string;
    onFileSelect: () => void;
    onRemove: () => void;
    isEdit?: boolean;
  }) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        صورة العضو {!isEdit && <span className="text-red-500">*</span>}
      </label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <BiTrash className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={onFileSelect}
          className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <BiImage className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500 text-center px-2">
            اختر صورة
          </span>
        </div>
      )}

      <div className="text-xs text-gray-500">
        الملفات المسموحة: JPG, PNG, GIF (الحد الأقصى: 5MB)
      </div>
    </div>
  );

  return (
    <Card className="space-y-6" title="الفريق" collapsible>
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileSelect(e, false)}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={editFileInputRef}
        onChange={(e) => handleFileSelect(e, true)}
        accept="image/*"
        className="hidden"
      />

      {/* Section Loading State */}
      {sectionLoading && (
        <div className="space-y-4">
          <div className="animate-pulse bg-gray-200 rounded-lg h-12"></div>
          <div className="animate-pulse bg-gray-200 rounded-lg h-24"></div>
        </div>
      )}

      {/* Section Title and Description */}
      {!sectionLoading && teamSection && (
        <>
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              عنوان ووصف القسم
            </h3>

            <div className="space-y-4">
              <div>
                <TextInput
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  id="team-title"
                  label="العنوان"
                  placeholder="مثال: فريقنا المميز"
                />
              </div>

              <div>
                <TextareaInput
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="team-subtitle"
                  label="الوصف"
                  placeholder="مثال: تعرف على أعضاء فريقنا الذين يقفون خلف نجاحنا..."
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
            </div>
          </div>

          {/* Team Members Management Section */}
          <div className="pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              إدارة أعضاء الفريق
            </h3>

            {/* Add New Member Form */}
            <Card className="mb-6" title="إضافة عضو جديد">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <TextInput
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    label="اسم العضو"
                    placeholder="أدخل اسم العضو"
                    required
                  />
                  <TextInput
                    value={newMember.position}
                    onChange={(e) =>
                      setNewMember((prev) => ({
                        ...prev,
                        position: e.target.value,
                      }))
                    }
                    label="المنصب"
                    placeholder="أدخل المنصب"
                    required
                  />
                </div>

                <div className="flex justify-center">
                  <ImageUploadField
                    preview={newMember.imagePreview}
                    onFileSelect={() => triggerFileInput(false)}
                    onRemove={() => removeImage(false)}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <PrimaryButton
                  onClick={handleCreateMember}
                  loading={creatingMember}
                  disabled={
                    !newMember.name.trim() ||
                    !newMember.position.trim() ||
                    !newMember.imageFile ||
                    creatingMember
                  }
                  className="min-w-24"
                >
                  <BiPlus className="w-4 h-4 ml-1" />
                  إضافة عضو
                </PrimaryButton>
              </div>
            </Card>

            {/* Edit Member Modal */}
            {editingMember && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">تعديل العضو</h3>
                    <button
                      onClick={cancelEditing}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <TextInput
                        value={editingMember.formData.name}
                        onChange={(e) =>
                          setEditingMember((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  formData: {
                                    ...prev.formData,
                                    name: e.target.value,
                                  },
                                }
                              : null
                          )
                        }
                        label="اسم العضو"
                        placeholder="أدخل اسم العضو"
                        required
                      />
                      <TextInput
                        value={editingMember.formData.position}
                        onChange={(e) =>
                          setEditingMember((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  formData: {
                                    ...prev.formData,
                                    position: e.target.value,
                                  },
                                }
                              : null
                          )
                        }
                        label="المنصب"
                        placeholder="أدخل المنصب"
                        required
                      />
                    </div>

                    <div className="flex justify-center">
                      <ImageUploadField
                        preview={
                          ImageBaseUrl + editingMember.formData.imagePreview
                        }
                        onFileSelect={() => triggerFileInput(true)}
                        onRemove={() => removeImage(true)}
                        isEdit
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end mt-6">
                    <SoftActionButton
                      onClick={cancelEditing}
                      disabled={updatingMember === editingMember.member.id}
                    >
                      إلغاء
                    </SoftActionButton>
                    <PrimaryButton
                      onClick={handleUpdateMember}
                      loading={updatingMember === editingMember.member.id}
                      disabled={
                        !editingMember.formData.name.trim() ||
                        !editingMember.formData.position.trim() ||
                        updatingMember === editingMember.member.id
                      }
                      className="min-w-24"
                    >
                      حفظ التغييرات
                    </PrimaryButton>
                  </div>
                </Card>
              </div>
            )}

            {/* Team Members List */}
            <Card title={`أعضاء الفريق (${teamMembers?.length || 0})`}>
              {membersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-200 rounded-lg h-16"
                    ></div>
                  ))}
                </div>
              ) : teamMembers?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BiPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>لا يوجد أعضاء في الفريق</p>
                  <p className="text-sm mt-1">ابدأ بإضافة أول عضو في الفريق</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        {member.imageUrl && (
                          <img
                            src={ImageBaseUrl + member.imageUrl}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {member.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {member.position}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(member.createdAt).toLocaleDateString(
                              "ar-EG"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(member)}
                          disabled={updatingMember === member.id}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
                        >
                          <BiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          disabled={updatingMember === member.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        >
                          <BiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Refresh Button */}
              <div className="flex justify-end mt-4">
                <SoftActionButton
                  onClick={fetchTeamMembers}
                  loading={membersLoading}
                  disabled={membersLoading}
                  className="text-sm"
                >
                  <BiRefresh className="w-4 h-4 ml-1" />
                  تحديث القائمة
                </SoftActionButton>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Show message if section not found */}
      {!sectionLoading && !teamSection && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <BiTrash className="w-6 h-6 text-gray-400" />
          </div>
          <p>لم يتم العثور على قسم الفريق</p>
          <p className="text-sm mt-1">يرجى التحقق من إعدادات الصفحة</p>
          <PrimaryButton onClick={fetchTeamSection} className="mt-3">
            إعادة المحاولة
          </PrimaryButton>
        </div>
      )}
    </Card>
  );
}

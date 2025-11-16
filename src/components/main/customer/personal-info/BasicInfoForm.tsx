"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Card from "@/components/shared/Card";
import TextInput from "@/components/shared/Forms/TextInput";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import SelectInput from "@/components/shared/Forms/SelectInput";
import { ClientRow } from "@/types/dashboard/client";
import ImageUpload from "@/components/shared/Forms/ImageUpload";
import {
  createClient,
  updateClient,
  getClientById,
} from "@/services/clinets/clinets";
import {
  BiIdCard,
  BiHome,
  BiTrash,
  BiDownload,
  BiUpload,
} from "react-icons/bi";

type Props = {
  client?: Omit<ClientRow, "joinedAt">;
  clientId?: number;
  isAdmin?: boolean;
  isCurentUser?: boolean;
};

// 🧠 Define Zod schema
const schema = z.object({
  fullName: z
    .string()
    .min(2, "الاسم الكامل مطلوب ويجب أن يكون على الأقل حرفين"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phoneNumber: z.string().min(1, "رقم الهاتف مطلوب"),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف")
    .optional()
    .or(z.literal("")),
  userType: z.enum(["agent", "marketer", "customer"]),
  profilePhotoFile: z.instanceof(File).optional(),
  nationalIdFile: z.instanceof(File).optional(),
  residencyIdFile: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof schema>;

// Document Upload Component
interface DocumentUploadProps {
  label: string;
  previewUrl: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onDownload?: () => void;
  error?: string;
  icon: React.ReactNode;
  accept?: string;
  required?: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  previewUrl,
  onChange,
  onRemove,
  onDownload,
  error,
  icon,
  accept = "image/*,.pdf",
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        const event = {
          target: { files: [file] },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      } else {
        toast.error("يرجى رفع ملف صورة أو PDF فقط");
      }
    }
  };

  const getFileType = (url: string) => {
    if (url.toLowerCase().endsWith(".pdf")) return "pdf";
    return "image";
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              {getFileType(previewUrl) === "pdf" ? (
                <div className="w-16 h-20 bg-red-100 rounded-lg flex items-center justify-center">
                  <BiIdCard className="w-8 h-8 text-red-600" />
                </div>
              ) : (
                <img
                  src={previewUrl}
                  alt={label}
                  className="w-16 h-20 object-cover rounded-lg border border-gray-200"
                />
              )}
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-600 font-medium">
                {getFileType(previewUrl) === "pdf" ? "ملف PDF" : "صورة"}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <BiTrash className="w-3 h-3" />
                إزالة
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                {icon}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-600 font-medium">
                اسحب الملف هنا أو انقر للرفع
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, PDF (الحد الأقصى 5MB)
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
              <BiUpload className="w-4 h-4" />
              اختر ملف
              <input
                type="file"
                className="hidden"
                accept={accept}
                onChange={onChange}
              />
            </label>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

export default function BasicInfoForm({
  client,
  clientId,
  isCurentUser = false,
  isAdmin = false,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>(
    client?.image || "/users/default-user.png"
  );
  const [nationalIdPreview, setNationalIdPreview] = useState<string>(
    client?.nationalIdUrl || ""
  );
  const [residencyIdPreview, setResidencyIdPreview] = useState<string>(
    client?.residencyIdUrl || ""
  );
  const [isFetchingClient, setIsFetchingClient] = useState(
    !!clientId && !client
  );

  const isEdit = isCurentUser || (client && client.id) || clientId;

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
      fullName: client?.name || "",
      email: client?.email || "",
      phoneNumber: client?.phone || "",
      userType: client?.type || "customer",
      password: "", // Empty for edit mode
    },
  });

  // Fetch client data if clientId is provided but client data is not
  useEffect(() => {
    const fetchClientData = async () => {
      if (clientId && !client) {
        try {
          setIsFetchingClient(true);
          const clientData = await getClientById(clientId);

          // Reset form with client data
          reset({
            fullName: clientData.fullName || "",
            email: clientData.email || "",
            phoneNumber: clientData.phoneNumber || "",
            userType: clientData.userType || "customer",
            password: "", // Don't pre-fill password for security
          });

          setProfilePreview(
            clientData.profilePhotoUrl || "/users/default-user.png"
          );
          setNationalIdPreview(clientData.nationalIdUrl || "");
          setResidencyIdPreview(clientData.residencyIdUrl || "");
        } catch (error) {
          console.error("❌ خطأ في جلب بيانات العميل:", error);
          toast.error("فشل في تحميل بيانات العميل", {
            duration: 5000,
            position: "top-center",
            icon: "❌",
          });
        } finally {
          setIsFetchingClient(false);
        }
      }
    };

    fetchClientData();
  }, [clientId, client, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // Prepare form data
      const formData = new FormData();

      // Append basic fields
      formData.append("email", data.email);
      formData.append("fullName", data.fullName);
      formData.append("userType", data.userType);
      formData.append("phoneNumber", data.phoneNumber);

      // Append password only if provided (for edit) or always (for create)
      if (data.password && data.password.trim() !== "") {
        formData.append("password", data.password);
      }

      // Append files if they exist
      if (data.profilePhotoFile) {
        formData.append("profilePhotoUrl", data.profilePhotoFile);
      }
      if (data.nationalIdFile) {
        formData.append("nationalIdUrl", data.nationalIdFile);
      }
      if (data.residencyIdFile) {
        formData.append("residencyIdUrl", data.residencyIdFile);
      }

      let result;
      if (isEdit) {
        // Update existing client
        const id = clientId || client?.id;
        if (!id) {
          throw new Error("معرف العميل غير متوفر");
        }
        result = await updateClient(id, formData);

        // Show success toast for update
        toast.success("تم تحديث بيانات العميل بنجاح", {
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
        // Create new client
        result = await createClient(formData);

        // Show success toast for create
        toast.success("تم إضافة العميل بنجاح", {
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

      // Redirect to clients list
      router.push("/dashboard/admin/clients");
      router.refresh(); // Refresh the page to show updated data
    } catch (error: any) {
      console.error(`❌ خطأ في ${isEdit ? "تحديث" : "إضافة"} العميل:`, error);

      const errorMessage =
        error.response?.data?.message ||
        `حدث خطأ أثناء ${
          isEdit ? "تحديث" : "إضافة"
        } العميل. يرجى المحاولة مرة أخرى.`;

      setServerError(errorMessage);

      // Show error toast
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
    if (client) {
      reset({
        fullName: client.name || "",
        email: client.email || "",
        phoneNumber: client.phone || "",
        userType: client.type || "customer",
        password: "",
      });
      setProfilePreview(client.image || "/users/default-user.png");
      setNationalIdPreview(client.nationalIdUrl || "");
      setResidencyIdPreview(client.residencyIdUrl || "");
    } else {
      reset({
        fullName: "",
        email: "",
        phoneNumber: "",
        userType: "customer",
        password: "",
      });
      setProfilePreview("/users/default-user.png");
      setNationalIdPreview("");
      setResidencyIdPreview("");
    }
    setServerError(null);
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الملف يجب أن يكون أقل من 5MB");
        return;
      }
      setValue("profilePhotoFile", file);
      const imageUrl = URL.createObjectURL(file);
      setProfilePreview(imageUrl);
    }
  };

  const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الملف يجب أن يكون أقل من 5MB");
        return;
      }
      setValue("nationalIdFile", file);
      const imageUrl = URL.createObjectURL(file);
      setNationalIdPreview(imageUrl);
    }
  };

  const handleResidencyIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الملف يجب أن يكون أقل من 5MB");
        return;
      }
      setValue("residencyIdFile", file);
      const imageUrl = URL.createObjectURL(file);
      setResidencyIdPreview(imageUrl);
    }
  };

  const handleDownloadNationalId = () => {
    if (nationalIdPreview && !nationalIdPreview.startsWith("blob:")) {
      window.open(nationalIdPreview, "_blank");
    }
  };

  const handleDownloadResidencyId = () => {
    if (residencyIdPreview && !residencyIdPreview.startsWith("blob:")) {
      window.open(residencyIdPreview, "_blank");
    }
  };

  // Remove profile photo
  const handleRemoveProfilePhoto = () => {
    setValue("profilePhotoFile", undefined);
    setProfilePreview("/users/default-user.png");
  };

  // Remove national ID file
  const handleRemoveNationalId = () => {
    setValue("nationalIdFile", undefined);
    setNationalIdPreview("");
  };

  // Remove residency ID file
  const handleRemoveResidencyId = () => {
    setValue("residencyIdFile", undefined);
    setResidencyIdPreview("");
  };

  if (isFetchingClient) {
    return (
      <Card title="جاري التحميل...">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card title={isEdit ? "تعديل معلومات العميل" : "إضافة عميل جديد"}>
      {/* Server Error */}
      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {serverError}
        </div>
      )}

      {/* Profile Photo Upload using ImageUpload component */}
      <ImageUpload
        imageUrl={profilePreview}
        onChange={handleProfilePhotoChange}
        onRemove={handleRemoveProfilePhoto}
        error={errors.profilePhotoFile?.message}
        label="صورة الملف الشخصي"
        className="mb-6"
      />

      {/* النموذج */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-6"
      >
        {/* Basic Information */}
        <TextInput
          id="full-name"
          label="الاسم الكامل"
          placeholder="أدخل الاسم الكامل"
          {...register("fullName")}
          error={errors.fullName?.message}
          required
          className="col-span-12 md:col-span-6"
        />

        <TextInput
          id="user-email"
          type="email"
          label="البريد الإلكتروني"
          placeholder="أدخل البريد الإلكتروني"
          {...register("email")}
          error={errors.email?.message}
          required
          className="col-span-12 md:col-span-6"
        />

        <TextInput
          id="user-phone"
          type="text"
          label="رقم الهاتف"
          placeholder="أدخل رقم الهاتف"
          className="ltr-data col-span-12 md:col-span-6"
          {...register("phoneNumber")}
          error={errors.phoneNumber?.message}
          required
        />

        <TextInput
          id="user-password"
          type="password"
          label="كلمة المرور"
          placeholder={
            isEdit
              ? "اتركه فارغاً للحفاظ على كلمة المرور الحالية"
              : "أدخل كلمة المرور"
          }
          {...register("password")}
          error={errors.password?.message}
          required={!isEdit} // Required only for new clients
          className="col-span-12 md:col-span-6"
        />

        {/* Document Uploads */}
        <div className="col-span-12 md:col-span-6">
          <DocumentUpload
            label="الهوية الوطنية"
            previewUrl={nationalIdPreview}
            onChange={handleNationalIdChange}
            onRemove={handleRemoveNationalId}
            onDownload={handleDownloadNationalId}
            error={errors.nationalIdFile?.message}
            icon={<BiIdCard className="w-6 h-6 text-gray-600" />}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <DocumentUpload
            label="إثبات الإقامة"
            previewUrl={residencyIdPreview}
            onChange={handleResidencyIdChange}
            onRemove={handleRemoveResidencyId}
            onDownload={handleDownloadResidencyId}
            error={errors.residencyIdFile?.message}
            icon={<BiHome className="w-6 h-6 text-gray-600" />}
          />
        </div>

        {/* Buttons */}
        <div className="col-span-12 flex items-center gap-6 flex-wrap pt-4">
          <PrimaryButton type="submit" disabled={isLoading || isFetchingClient}>
            {isLoading
              ? isEdit
                ? "جاري التحديث..."
                : "جاري الإضافة..."
              : isCurentUser
              ? "المعلومات الاساسية"
              : isEdit
              ? "تحديث بيانات العميل"
              : "إضافة عميل جديد"}
          </PrimaryButton>
          <SoftActionButton
            type="button"
            onClick={handleCancel}
            disabled={isLoading || isFetchingClient}
          >
            إلغاء
          </SoftActionButton>
        </div>
      </form>
    </Card>
  );
}

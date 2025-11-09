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
      setValue("profilePhotoFile", file);

      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setProfilePreview(imageUrl);
    }
  };

  const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("nationalIdFile", file);

      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setNationalIdPreview(imageUrl);
    }
  };

  const handleResidencyIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("residencyIdFile", file);

      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setResidencyIdPreview(imageUrl);
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

        {/* User Type */}
        <SelectInput
          name="userType"
          label="نوع المستخدم"
          value={watch("userType")}
          onChange={(val) =>
            setValue("userType", val as "agent" | "marketer" | "customer")
          }
          options={[
            { label: "عميل", value: "customer" },
            { label: "وسيط", value: "agent" },
            { label: "مسوق", value: "marketer" },
          ]}
          error={errors.userType?.message}
          className="col-span-12 md:col-span-12"
        />

        {/* Additional Documents */}
        <div className="col-span-12 md:col-span-6">
          <ImageUpload
            imageUrl={nationalIdPreview}
            onChange={handleNationalIdChange}
            onRemove={handleRemoveNationalId}
            error={errors.nationalIdFile?.message}
            label="صورة الهوية الوطنية"
            showRemoveButton={!!nationalIdPreview}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <ImageUpload
            imageUrl={residencyIdPreview}
            onChange={handleResidencyIdChange}
            onRemove={handleRemoveResidencyId}
            error={errors.residencyIdFile?.message}
            label="صورة إثبات الإقامة"
            showRemoveButton={!!residencyIdPreview}
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

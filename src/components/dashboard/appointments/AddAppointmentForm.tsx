"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Card from "@/components/shared/Card";
import SelectSingleDate from "@/components/shared/Forms/SelectSingleDate";
import SelectTime from "@/components/shared/Forms/SelectTime";
import UserChanger from "../UserChanger";
import TextareaInput from "@/components/shared/Forms/TextareaInput";
import PropertyChanger from "../Property Filter/PropertyChanger";
import FieldErrorMessage from "@/components/shared/Forms/FieldErrorMessage";
import PrimaryButton from "@/components/shared/Button";
import SoftActionButton from "@/components/shared/SoftActionButton";
import { useRoleFromPath } from "@/hooks/dashboard/admin/useRoleFromPath";
import { useSearchParams } from "next/navigation";
import { createAppointment } from "@/services/appointments/appointments";
import useAgents from "@/hooks/dashboard/admin/agent/useAgents";
import useProperties from "@/hooks/dashboard/admin/properties/useProperties";
import useClients from "@/hooks/dashboard/admin/client/useClients";

// Update schema to match API data structure
const schema = z.object({
  appointmentDate: z.string().min(1, "يرجى اختيار التاريخ"),
  startTime: z.string().min(1, "يرجى اختيار وقت البدء"),
  endTime: z.string().min(1, "يرجى اختيار وقت الانتهاء"),
  customerNotes: z.string().optional(),
  agentId: z
    .union([z.number(), z.undefined()])
    .refine((val) => typeof val === "number", {
      message: "يرجى اختيار وسيط",
    }),
  customerId: z
    .union([z.number(), z.undefined()])
    .refine((val) => typeof val === "number", {
      message: "يرجى اختيار عميل",
    }),
  propertyId: z
    .union([z.string(), z.undefined()])
    .refine((val) => typeof val === "string", {
      message: "يرجى اختيار عقار",
    }),
});

type FormValues = z.infer<typeof schema>;

export default function AddAppointmentForm() {
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get("client_id");
  const initialClientId = clientIdParam ? parseInt(clientIdParam) : null;

  const role = useRoleFromPath();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Use the hooks directly
  const {
    agents: agentsData,
    loading: agentsLoading,
    error: agentsError,
    getRows: getAgentsData,
  } = useAgents();

  const {
    data: propertiesData,
    loading: propertiesLoading,
    error: propertiesError,
  } = useProperties();

  const getClientsData = useClients();

  // State for fetched data
  const [clients, setClients] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Fetch clients and agents data
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setDataLoading(true);
        setDataError(null);

        // Fetch clients data
        const clientsResult = await getClientsData(signal);

        if (signal.aborted) return;

        // Set clients data
        if (clientsResult.error) {
          throw new Error(clientsResult.error.message);
        }
        setClients(clientsResult.rows || []);

        // Set agents data from useAgents hook (only for admin)
        if (role === "admin") {
          // Use the agents data directly from the hook
          setAgents(agentsData || []);
        }

        // Set properties data
        setProperties(propertiesData || []);

        setDataLoading(false);
      } catch (error) {
        if (!signal.aborted) {
          console.error("Error fetching form data:", error);
          setDataError(
            error instanceof Error ? error.message : "فشل في تحميل البيانات"
          );
          setDataLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [getClientsData, agentsData, propertiesData, role]);

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      appointmentDate: "",
      startTime: "09:00",
      endTime: "10:00",
      customerNotes: "",
      agentId: undefined,
      customerId: initialClientId || undefined,
      propertyId: undefined,
    },
  });

  // Show error toasts if data fetching fails
  useEffect(() => {
    if (dataError) {
      toast.error(dataError, {
        duration: 5000,
        position: "top-center",
      });
    }
    if (agentsError) {
      toast.error("فشل في تحميل بيانات الوكلاء", {
        duration: 5000,
        position: "top-center",
      });
    }
    if (propertiesError) {
      toast.error("فشل في تحميل بيانات العقارات", {
        duration: 5000,
        position: "top-center",
      });
    }
  }, [dataError, agentsError, propertiesError]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    try {
      // Prepare data for API
      const appointmentData = {
        propertyId: parseInt(data.propertyId), // Convert string to number
        customerId: data.customerId,
        agentId: data.agentId,
        appointmentDate: data.appointmentDate,
        startTime: data.startTime,
        endTime: data.endTime,
        customerNotes: data.customerNotes || undefined,
        createdChannel: "web" as const,
      };

      const result = await createAppointment(appointmentData);

      // Show success toast
      toast.success("تم إنشاء الموعد بنجاح", {
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

      // Reset form
      reset();

      // Redirect to appointments list after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/admin/appointments");
      }, 1000);
    } catch (error: any) {
      console.error("❌ Failed to create appointment:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء إنشاء الموعد";

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
      setLoading(false);
    }
  };

  // Handle time change - automatically set end time based on start time and duration
  const handleTimeChange = (startTime: string, duration: number) => {
    setValue("startTime", startTime);

    // Calculate end time (start time + duration in hours)
    if (startTime && duration > 0) {
      const [hours, minutes] = startTime.split(":").map(Number);
      const endTimeDate = new Date();
      endTimeDate.setHours(hours + duration, minutes);
      const endTimeString = `${endTimeDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${endTimeDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      setValue("endTime", endTimeString);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.back();
  };

  // Format users for UserChanger component - Updated to match AgentRow structure
  const formatUsers = (users: any[]) => {
    return (
      users?.map((user) => {
        // Handle both agent structure and client structure
        const userData = user.user || user; // Support nested user object for agents

        return {
          id: parseInt(userData.id || user.id), // Convert string ID to number
          name: userData.fullName || userData.name || user.name || "غير معروف",
          email: userData.email || user.email,
          phone: userData.phoneNumber || userData.phone || user.phone,
          avatar:
            userData.profilePhoto || userData.profilePhotoUrl || user.avatar,
        };
      }) || []
    );
  };

  // Format properties for PropertyChanger component
  const formatProperties = (properties: any[]) => {
    return (
      properties?.map((property) => ({
        id: property.id.toString(),
        title: property.title,
        description: property.description,
        price: property.price,
        location: property.city?.name || "غير معروف",
        image: property.medias?.[0]?.mediaUrl || property.images?.[0]?.imageUrl,
        type: property.propertyType?.name,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.areaM2,
      })) || []
    );
  };

  const isLoading = dataLoading || agentsLoading || propertiesLoading;
  const hasData =
    clients.length > 0 &&
    properties.length > 0 &&
    (role !== "admin" || agents.length > 0);

  return (
    <div className="space-y-4 lg:space-y-6">
      <Card title="إضافة موعد جديد">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="mr-3">جاري تحميل البيانات...</span>
          </div>
        ) : dataError || agentsError || propertiesError ? (
          <div className="text-center py-12 text-red-600">
            <p>
              {dataError ||
                agentsError?.message ||
                propertiesError?.message ||
                "فشل في تحميل البيانات المطلوبة"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-12 gap-6"
          >
            {/* التاريخ */}
            <div className="col-span-12 md:col-span-6">
              <label
                htmlFor="appointmentDate"
                className="text-lg font-medium block mb-3"
              >
                تاريخ الموعد
              </label>
              <SelectSingleDate
                value={
                  watch("appointmentDate")
                    ? new Date(watch("appointmentDate"))
                    : undefined
                }
                onChange={(date) =>
                  setValue(
                    "appointmentDate",
                    date?.toISOString().split("T")[0] || ""
                  )
                }
                label="تاريخ الموعد"
                className="!w-full single-date"
              />
              <FieldErrorMessage errors={errors} fieldName="appointmentDate" />
            </div>

            {/* الوقت */}
            <div className="col-span-12 md:col-span-6">
              <SelectTime
                timeValue={watch("startTime")}
                durationValue={60} // Default 60 minutes duration
                onChangeTime={(time) => handleTimeChange(time || "", 1)}
                onChangeDuration={(duration) =>
                  handleTimeChange(watch("startTime"), duration || 1)
                }
                label="وقت الموعد"
              />
              <div className="mt-2 text-sm text-gray-500">
                وقت البدء: {watch("startTime")} - وقت الانتهاء:{" "}
                {watch("endTime")}
              </div>
              <FieldErrorMessage
                errors={errors}
                fieldName={errors.startTime ? "startTime" : "endTime"}
              />
            </div>

            {/* الوسيط */}
            {role === "admin" && (
              <div className="col-span-12 md:col-span-6">
                <label className="text-lg font-medium block mb-3">الوسيط</label>
                <UserChanger
                  users={formatUsers(agents)}
                  label="وسيط"
                  onChange={(agent) => setValue("agentId", agent?.id)}
                  loading={agentsLoading}
                />
                <FieldErrorMessage errors={errors} fieldName="agentId" />
              </div>
            )}

            {/* العميل */}
            <div className="col-span-12 md:col-span-6">
              <label className="text-lg font-medium block mb-3">العميل</label>
              <UserChanger
                users={formatUsers(clients)}
                label="عميل"
                initialUserId={initialClientId ?? undefined}
                onChange={(client) => setValue("customerId", client?.id)}
                loading={dataLoading}
              />
              <FieldErrorMessage errors={errors} fieldName="customerId" />
            </div>

            {/* العقار */}
            <div className="col-span-12 md:col-span-6">
              <label className="text-lg font-medium block mb-3">العقار</label>
              <PropertyChanger
                properties={formatProperties(properties)}
                label="عقار"
                onChange={(property) => setValue("propertyId", property?.id)}
                loading={propertiesLoading}
              />
              <FieldErrorMessage errors={errors} fieldName="propertyId" />
            </div>

            {/* الملاحظات */}
            <div className="col-span-12">
              <TextareaInput
                name="customerNotes"
                id="customerNotes"
                label="ملاحظات العميل"
                placeholder="أدخل ملاحظات العميل حول الموعد..."
                className="text-area h-full"
                value={watch("customerNotes")}
                onChange={(e) => setValue("customerNotes", e.target.value)}
              />
            </div>

            {/* Debug information (remove in production) */}
            {process.env.NODE_ENV === "development" && (
              <div className="col-span-12">
                <Card title="بيانات الإرسال (للتطوير)">
                  <div className="text-xs bg-gray-50 p-3 rounded">
                    <pre>
                      {JSON.stringify(
                        {
                          propertyId: watch("propertyId"),
                          customerId: watch("customerId"),
                          agentId: watch("agentId"),
                          appointmentDate: watch("appointmentDate"),
                          startTime: watch("startTime"),
                          endTime: watch("endTime"),
                          customerNotes: watch("customerNotes"),
                          clientsCount: clients.length,
                          agentsCount: agents.length,
                          propertiesCount: properties.length,
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </Card>
              </div>
            )}

            {/* الإجراءات */}
            <div className="col-span-12 flex items-center gap-6 flex-wrap mt-4">
              <PrimaryButton
                type="submit"
                disabled={loading || isLoading}
                className={
                  loading || isLoading ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                {loading ? "جاري إنشاء الموعد..." : "حفظ الموعد"}
              </PrimaryButton>
              <SoftActionButton
                onClick={handleCancel}
                disabled={loading}
                type="button"
              >
                إلغاء
              </SoftActionButton>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

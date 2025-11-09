"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BiGroup } from "react-icons/bi";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import AppointmentDetails from "@/components/dashboard/appointments/AppointmentDetails";
import DownloadContent from "@/components/shared/DownloadContent";
import { getAppointmentById } from "@/services/appointments/appointments";

type Props = {
  params: {
    appointmentId: string;
  };
};

export default function AppointmentDetailsPage({ params }: Props) {
  const { appointmentId } = params;
  const [appointment, setAppointment] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId, refreshTrigger]);

  const fetchAppointment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const appointmentData = await getAppointmentById(parseInt(appointmentId));

      console.log("📋 Raw API Response:", appointmentData);

      // Map API response to AppointmentRow type
      const mappedAppointment = {
        id: appointmentData.id.toString(),
        project: {
          id: appointmentData.property?.id?.toString() || "",
          title: appointmentData.property?.title || "عقار غير معروف",
          description: appointmentData.property?.description || "",
          price: appointmentData.property?.price || "0",
          location: appointmentData.property?.city?.name || "غير معروف",
          image: appointmentData.property?.medias?.[0]?.mediaUrl || null,
          type: appointmentData.property?.propertyType?.name || "villa",
          bedrooms: appointmentData.property?.bedrooms || 0,
          bathrooms: appointmentData.property?.bathrooms || 0,
          area: appointmentData.property?.areaM2 || "0",
        },
        client: {
          id: appointmentData.customer?.id?.toString() || "",
          name: appointmentData.customer?.fullName || "عميل غير معروف",
          email: appointmentData.customer?.email || "",
          phone: appointmentData.customer?.phoneNumber || "",
          image: appointmentData.customer?.profilePhotoUrl || null,
        },
        agent: appointmentData.agent
          ? {
              id: appointmentData.agent.id.toString(),
              name: appointmentData.agent.fullName || "وسيط غير معروف",
              email: appointmentData.agent.email || "",
              phone: appointmentData.agent.phoneNumber || "",
              image: appointmentData.agent.profilePhotoUrl || null,
            }
          : undefined,
        appointmentAt: `${appointmentData.appointmentDate}T${appointmentData.startTime}`,
        status: appointmentData.status || "scheduled",
        customerNotes: appointmentData.customerNotes || "",
        createdAt: appointmentData.createdAt,
        updatedAt: appointmentData.updatedAt,
        // Optional fields that might not be in API response
        reviewStars: appointmentData.reviewStars || 0,
        agentReviewStars: appointmentData.agentReviewStars || 0,
        agentReviewText: appointmentData.agentReviewText || "",
        expectedProfit: appointmentData.expectedProfit || 0,
        isPaid: appointmentData.isPaid || false,
        proofFiles: appointmentData.proofFiles || [],
      };

      console.log("🔄 Mapped Appointment:", mappedAppointment);
      setAppointment(mappedAppointment);
    } catch (err) {
      console.error("❌ Error fetching appointment:", err);
      setError("فشل في تحميل بيانات الموعد");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to trigger refresh after actions
  const handleAppointmentUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <DashboardHeaderTitle path={["المواعيد", "جاري التحميل..."]}>
          <div className="flex gap-4 flex-wrap">
            <DownloadContent text="تحميل المعلومات" disabled />
            <Link className="btn-primary" href="/dashboard/admin/appointments">
              <BiGroup /> عرض جميع المواعيد
            </Link>
          </div>
        </DashboardHeaderTitle>

        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="mr-2 text-gray-600">
            جاري تحميل بيانات الموعد...
          </span>
        </div>
      </>
    );
  }

  // Error state
  if (error || !appointment) {
    const errorAppointment = {
      id: appointmentId,
      project: {
        id: "0",
        title: "عقار غير موجود",
        description: "تعذر تحميل بيانات العقار",
        price: "0",
        location: "غير معروف",
        image: "",
        type: "villa",
        bedrooms: 0,
        bathrooms: 0,
        area: "0",
      },
      client: {
        id: "0",
        name: "عميل غير معروف",
        email: "",
        phone: "",
        image: "",
      },
      appointmentAt: new Date().toISOString(),
      status: "cancelled",
      customerNotes:
        error || "تعذر تحميل بيانات الموعد. يرجى المحاولة مرة أخرى.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewStars: 0,
      agentReviewStars: 0,
      agentReviewText: "",
      expectedProfit: 0,
      isPaid: false,
      proofFiles: [],
    };

    return (
      <>
        <DashboardHeaderTitle path={["المواعيد", `تفاصيل الموعد - غير موجود`]}>
          <div className="flex gap-4 flex-wrap">
            <DownloadContent text="تحميل المعلومات" disabled />
            <Link className="btn-primary" href="/dashboard/admin/appointments">
              <BiGroup /> عرض جميع المواعيد
            </Link>
          </div>
        </DashboardHeaderTitle>

        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchAppointment}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>

        <AppointmentDetails
          appointment={errorAppointment}
          onAppointmentAction={handleAppointmentUpdated}
        />
      </>
    );
  }

  // Success state
  return (
    <>
      <DashboardHeaderTitle
        path={["المواعيد", `تفاصيل الموعد - ${appointment.project.title}`]}
      >
        <div className="flex gap-4 flex-wrap">
          <DownloadContent text="تحميل المعلومات" />
          <Link className="btn-primary" href="/dashboard/admin/appointments">
            <BiGroup /> عرض جميع المواعيد
          </Link>
        </div>
      </DashboardHeaderTitle>

      <AppointmentDetails
        appointment={appointment}
        onAppointmentAction={handleAppointmentUpdated}
      />
    </>
  );
}

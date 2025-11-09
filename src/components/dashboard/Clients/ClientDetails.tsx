"use client";

import { useState } from "react"; // Add useState import
import CardInfo from "@/components/shared/infos/CardInfo";
import IconDetail from "@/components/shared/infos/IconDetail";
import { InfoBlock } from "@/components/shared/infos/InfoBlock";
import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import { FaCalendarAlt, FaClipboardList } from "react-icons/fa";
import DashboardSectionCard from "../DashboardSectionCard";
import { formatDate } from "@/utils/date";
import ClientStatusControl from "./ClientStatusControl";
import FallbackImage from "@/components/shared/FallbackImage";

type Props = {
  client: any;
};

// Mock data for appointments (replace with actual API calls)

export default function ClientDetails({ client: initialClient }: Props) {
  const [client, setClient] = useState(initialClient);

  // Handle status change from child component
  const handleStatusChange = (newStatus: "active" | "suspended") => {
    // Update the client state with new status
    setClient((prevClient) => ({
      ...prevClient,
      isActive: newStatus === "active",
      // Also update verification status if needed
      verificationStatus:
        newStatus === "active" ? "verified" : prevClient.verificationStatus,
    }));
  };

  // Map API status to component status
  const getStatusDisplay = () => {
    if (!client.isActive) return { status: "suspended", text: "موقوف" };
    if (client.verificationStatus === "verified")
      return { status: "active", text: "نشط" };
    return { status: "suspended", text: "قيد المراجعة" };
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-6 gap-4 lg:gap-6 items-stretch">
      {/* Left Column */}
      <div className="h-full xl:col-span-2">
        <DashboardSectionCard className="h-full">
          <div className="relative rounded-2xl bg-white p-6">
            {/* ✏️ Edit Icon at Card Corner */}
            <Link
              href={`/dashboard/admin/clients/edit/${client.id}`}
              className="absolute top-4 right-4 bg-white border border-gray-200 p-2 rounded-full shadow-sm hover:bg-gray-50 transition z-10"
              title="تعديل العميل"
            >
              <BiEdit className="w-5 h-5 text-gray-600" />
            </Link>

            {/* Avatar */}
            <div className="relative w-fit mx-auto">
              <FallbackImage
                src={client.profilePhotoUrl}
                alt={client.fullName}
                width={80}
                height={80}
                className="rounded-full w-20 h-20 object-cover border"
              />
            </div>

            {/* Name */}
            <h5 className="text-xl font-semibold mt-5 text-center">
              {client.fullName}
            </h5>

            {/* Status Ball */}
            <div className="flex items-center justify-center border-b border-dashed py-2">
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                <span
                  className={`w-3 h-3 rounded-full border border-white ${
                    statusInfo.status === "active"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  title={statusInfo.text}
                />
                <span className="text-[10px] font-medium text-gray-700">
                  {statusInfo.text}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 space-y-4">
            <IconDetail
              icon={
                <FaClipboardList className="text-[var(--primary)] w-6 h-6" />
              }
              label="رقم الهاتف"
              value={client.phoneNumber}
              href={`tel:${client.phoneNumber}`}
              className="ltr-data block"
            />
            <IconDetail
              icon={
                <FaCalendarAlt className="text-[var(--secondary-500)] w-6 h-6" />
              }
              label="البريد الإلكتروني"
              value={client.email}
              href={`mailto:${client.email}`}
            />
          </div>

          <div className="mt-6 flex gap-2 items-end">
            <div className="flex-1">
              <ClientStatusControl
                currentStatus={statusInfo.status}
                client={client}
                onStatusChange={handleStatusChange} // Pass the callback
              />
            </div>
            <div className="flex-1">
              <Link
                href={`/dashboard/admin/appointments/add?client_id=${client.id}`}
                className="bg-primary w-full px-4 py-2 rounded-md text-white font-semibold transition flex items-center justify-center gap-2"
              >
                حجز موعد جديد
              </Link>
            </div>
          </div>
        </DashboardSectionCard>
      </div>

      {/* Right Column */}
      <div className="h-full xl:col-span-4">
        <DashboardSectionCard className="h-full">
          <h3 className="text-xl font-semibold mb-6">معلومات العميل</h3>

          {/* Cards */}
          {/* <div className="flex flex-wrap gap-6 border-b pb-8 border-dashed">
            <CardInfo
              icon={
                <FaClipboardList className="text-[var(--primary)] w-10 h-10" />
              }
              value={mockAppointmentsData.totalAppointments}
              label="إجمالي الحجوزات"
            />
            <CardInfo
              icon={
                <FaCalendarAlt className="text-[var(--secondary-500)] w-10 h-10" />
              }
              value={mockAppointmentsData.monthlyAppointments}
              label="حجوزات هذا الشهر"
            />
          </div> */}

          {/* Details */}
          <div className="grid grid-cols-12 gap-4 mt-6">
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock label="الاسم الكامل" value={client.fullName} />
              <InfoBlock
                label="رقم الهاتف"
                value={client.phoneNumber}
                valueClassName="ltr-data block"
              />
            </div>
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock label="البريد الإلكتروني" value={client.email} />
              <InfoBlock
                label="تاريخ الانضمام"
                value={formatDate(client.createdAt)}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock
                label="نوع المستخدم"
                value={
                  client.userType === "customer" ? "عميل" : client.userType
                }
              />
              <InfoBlock
                label="حالة التحقق"
                value={
                  client.verificationStatus === "verified"
                    ? "تم التحقق"
                    : client.verificationStatus === "pending"
                    ? "قيد المراجعة"
                    : "غير موثق"
                }
              />
              {client.verifiedAt && (
                <InfoBlock
                  label="تاريخ التحقق"
                  value={formatDate(client.verifiedAt)}
                />
              )}
            </div>
          </div>
        </DashboardSectionCard>
      </div>
    </div>
  );
}

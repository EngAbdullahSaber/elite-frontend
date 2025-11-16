"use client";

import { useState } from "react";
import CardInfo from "@/components/shared/infos/CardInfo";
import IconDetail from "@/components/shared/infos/IconDetail";
import { InfoBlock } from "@/components/shared/infos/InfoBlock";
import Link from "next/link";
import {
  BiEdit,
  BiCalendar,
  BiPhone,
  BiEnvelope,
  BiUser,
  BiCheckShield,
  BiTime,
} from "react-icons/bi";
import { FaUserTie, FaClipboardCheck, FaCalendarPlus } from "react-icons/fa";
import DashboardSectionCard from "../DashboardSectionCard";
import { formatDate } from "@/utils/date";
import ClientStatusControl from "./ClientStatusControl";
import FallbackImage from "@/components/shared/FallbackImage";

type Props = {
  client: any;
};

export default function ClientDetails({ client: initialClient }: Props) {
  const [client, setClient] = useState(initialClient);

  // Handle status change from child component
  const handleStatusChange = (newStatus: "active" | "suspended") => {
    setClient((prevClient) => ({
      ...prevClient,
      isActive: newStatus === "active",
      verificationStatus: newStatus === "active" ? "verified" : "pending",
    }));
  };

  // Map API status to component status based on actual API response
  const getStatusDisplay = () => {
    if (!client.isActive) {
      return { status: "suspended", text: "موقوف", color: "bg-red-500" };
    }

    if (client.verificationStatus === "verified") {
      return { status: "active", text: "نشط", color: "bg-green-500" };
    }

    return {
      status: "pending",
      text: "قيد المراجعة",
      color: "bg-yellow-500",
    };
  };

  const statusInfo = getStatusDisplay();

  // Get verification status display
  const getVerificationStatus = () => {
    switch (client.verificationStatus) {
      case "verified":
        return {
          text: "تم التحقق",
          color: "text-green-600 bg-green-50 border-green-200",
          icon: "✅",
        };
      case "pending":
        return {
          text: "قيد المراجعة",
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
          icon: "⏳",
        };
      default:
        return {
          text: "غير موثق",
          color: "text-red-600 bg-red-50 border-red-200",
          icon: "❌",
        };
    }
  };

  const verificationStatus = getVerificationStatus();

  // Get account status display
  const getAccountStatus = () => {
    if (client.isActive) {
      return {
        text: "مفعل",
        color: "text-green-600 bg-green-50 border-green-200",
        icon: "🟢",
      };
    } else {
      return {
        text: "موقوف",
        color: "text-red-600 bg-red-50 border-red-200",
        icon: "🔴",
      };
    }
  };

  const accountStatus = getAccountStatus();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Profile Card */}
      <div className="xl:col-span-1">
        <DashboardSectionCard className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">الملف الشخصي</h3>
              <Link
                href={`/dashboard/admin/clients/edit/${client.id}`}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-200"
                title="تعديل العميل"
              >
                <BiEdit className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            {/* Profile Avatar & Info */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <FallbackImage
                  src={client.profilePhotoUrl}
                  alt={client.fullName}
                  width={96}
                  height={96}
                  className="rounded-2xl w-24 h-24 object-cover border-4 border-white shadow-lg mx-auto bg-gray-100 flex items-center justify-center"
                  fallback={
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                      {client.fullName?.charAt(0) || "U"}
                    </div>
                  }
                />
                {/* Status Badge */}
              </div>

              <h2 className="text-xl font-bold text-gray-800 mt-6 mb-2">
                {client.fullName}
              </h2>
              <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
                <BiUser className="w-4 h-4" />
                {client.userType === "customer" ? "عميل" : client.userType}
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <BiPhone className="text-blue-600" />
                  معلومات الاتصال
                </h4>
                <div className="space-y-3">
                  <IconDetail
                    icon={<BiPhone className="text-blue-600 w-5 h-5" />}
                    label="رقم الهاتف"
                    value={client.phoneNumber || "غير متوفر"}
                    href={
                      client.phoneNumber
                        ? `tel:${client.phoneNumber}`
                        : undefined
                    }
                    className="ltr-data text-gray-700 font-medium"
                  />
                  <IconDetail
                    icon={<BiEnvelope className="text-purple-600 w-5 h-5" />}
                    label="البريد الإلكتروني"
                    value={client.email}
                    href={`mailto:${client.email}`}
                    className="text-gray-700 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <ClientStatusControl
                currentStatus={statusInfo.status}
                client={client}
                onStatusChange={handleStatusChange}
                className="w-full"
              />
              <Link
                href={`/dashboard/admin/appointments/add?client_id=${client.id}`}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FaCalendarPlus className="w-4 h-4" />
                حجز موعد جديد
              </Link>
            </div>
          </div>
        </DashboardSectionCard>
      </div>

      {/* Details Card */}
      <div className="xl:col-span-2">
        <DashboardSectionCard className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FaUserTie className="w-5 h-5" />
              المعلومات التفصيلية
            </h3>
          </div>

          <div className="p-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BiCalendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-800">0</div>
                <div className="text-sm text-gray-600">إجمالي الحجوزات</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FaClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-800">0</div>
                <div className="text-sm text-gray-600">الحجوزات النشطة</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BiTime className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {formatDate(client.createdAt)}
                </div>
                <div className="text-sm text-gray-600">تاريخ الانضمام</div>
              </div>
            </div>

            {/* Detailed Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <BiUser className="text-blue-600" />
                  المعلومات الشخصية
                </h4>

                <div className="space-y-3">
                  <InfoBlock
                    label="الاسم الكامل"
                    value={client.fullName}
                    icon={<BiUser className="text-gray-400 w-4 h-4" />}
                    className="bg-gray-50 rounded-lg p-3"
                  />
                  <InfoBlock
                    label="رقم الهاتف"
                    value={client.phoneNumber || "غير متوفر"}
                    valueClassName="ltr-data font-mono"
                    icon={<BiPhone className="text-gray-400 w-4 h-4" />}
                    className="bg-gray-50 rounded-lg p-3"
                  />
                  <InfoBlock
                    label="البريد الإلكتروني"
                    value={client.email}
                    icon={<BiEnvelope className="text-gray-400 w-4 h-4" />}
                    className="bg-gray-50 rounded-lg p-3"
                  />
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <BiCheckShield className="text-green-600" />
                  معلومات الحساب
                </h4>

                <div className="space-y-3">
                  <InfoBlock
                    label="نوع المستخدم"
                    value={
                      client.userType === "customer" ? "عميل" : client.userType
                    }
                    icon={<FaUserTie className="text-gray-400 w-4 h-4" />}
                    className="bg-gray-50 rounded-lg p-3"
                  />

                  {/* Account Status */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BiUser className="text-gray-400 w-4 h-4" />
                        <span className="text-sm font-medium text-gray-700">
                          حالة الحساب
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${accountStatus.color}`}
                      >
                        {accountStatus.text}
                      </span>
                    </div>
                  </div>

                  <InfoBlock
                    label="تاريخ الانضمام"
                    value={formatDate(client.createdAt)}
                    icon={<BiCalendar className="text-gray-400 w-4 h-4" />}
                    className="bg-gray-50 rounded-lg p-3"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes Section */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BiEnvelope className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-blue-800 text-sm mb-1">
                    ملاحظات
                  </h5>
                  <p className="text-blue-700 text-sm">
                    {client.isActive
                      ? "الحساب نشط ومفعل. يمكن للعميل حجز المواعيد واستخدام المنصة."
                      : "الحساب موقوف حالياً. لا يمكن للعميل حجز مواعيد جديدة."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DashboardSectionCard>
      </div>
    </div>
  );
}

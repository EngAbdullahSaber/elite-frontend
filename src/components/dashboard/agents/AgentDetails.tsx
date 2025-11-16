"use client";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import CardInfo from "@/components/shared/infos/CardInfo";
import IconDetail from "@/components/shared/infos/IconDetail";
import { InfoBlock } from "@/components/shared/infos/InfoBlock";
import { AgentRow, agentStatusMap } from "@/types/dashboard/agent";
import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaMapMarkerAlt,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaCity,
  FaMap,
} from "react-icons/fa";
import { formatDate } from "@/utils/date";
import AgentStatusControl from "./AgentStatusControl";
import FallbackImage from "@/components/shared/FallbackImage";

type Props = {
  agent: AgentRow;
  onStatusUpdate?: () => void;
};

export default function AgentDetails({ agent, onStatusUpdate }: Props) {
  // Get cities and areas from the agent data
  const cities = agent.cities || [];
  const areas = agent.areas || [];

  // Get unique city names
  const cityNames = cities.map((city) => city.name).filter(Boolean);
  const areaNames = areas.map((area) => area.name).filter(Boolean);

  // Format cities display text
  const citiesDisplayText =
    cityNames.length > 0 ? cityNames.join("، ") : "غير محدد";

  // Format areas display text
  const areasDisplayText =
    areaNames.length > 0 ? areaNames.join("، ") : "غير محدد";

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-6 gap-4 lg:gap-6 items-stretch">
      {/* Left Column - Profile Info */}
      <div className="h-full xl:col-span-2">
        <DashboardSectionCard className="h-full">
          <div className="relative rounded-2xl bg-white p-6">
            <Link
              href={`/dashboard/admin/agents/edit/${agent.id}`}
              className="absolute top-4 right-4 bg-white border border-gray-200 p-2 rounded-full shadow-sm hover:bg-gray-50 transition z-10"
              title="تعديل الوسيط"
            >
              <BiEdit className="w-5 h-5 text-gray-600" />
            </Link>

            <div className="relative w-fit mx-auto">
              <FallbackImage
                src={agent.user?.profilePhotoUrl || agent.image}
                alt={agent.user?.fullName || agent.name}
                width={80}
                height={80}
                className="rounded-full w-20 h-20 object-cover border"
              />
            </div>

            <h5 className="text-xl font-semibold mt-5 text-center">
              {agent.user?.fullName || agent.name}
            </h5>

            <div className="flex items-center justify-center border-b border-dashed py-2">
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                <span
                  className={`w-3 h-3 rounded-full border border-white ${
                    agent.status === "active"
                      ? "bg-green-500"
                      : agent.status === "pending"
                      ? "bg-yellow-500"
                      : agent.status === "rejected"
                      ? "bg-gray-500"
                      : "bg-red-500"
                  }`}
                  title={agentStatusMap[agent.status]}
                />
                <span className="text-[10px] font-medium text-gray-700">
                  {agentStatusMap[agent.status]}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 space-y-4">
            <IconDetail
              icon={<FaPhone className="text-[var(--primary)] w-6 h-6" />}
              label="رقم الهاتف"
              value={agent.user?.phoneNumber || agent.phone}
              href={`tel:${agent.user?.phoneNumber || agent.phone}`}
              className="ltr-data block"
            />
            <IconDetail
              icon={
                <FaEnvelope className="text-[var(--secondary-500)] w-6 h-6" />
              }
              label="البريد الإلكتروني"
              value={agent.user?.email || agent.email}
              href={`mailto:${agent.user?.email || agent.email}`}
            />
            <IconDetail
              icon={<FaCity className="text-blue-500 w-6 h-6" />}
              label="المدن"
              value={citiesDisplayText}
            />
            {areaNames.length > 0 && (
              <IconDetail
                icon={<FaMap className="text-green-500 w-6 h-6" />}
                label="المناطق"
                value={areasDisplayText}
              />
            )}
          </div>

          <AgentStatusControl
            onStatusUpdate={onStatusUpdate}
            currentStatus={agent.status}
            agent={agent}
          />
        </DashboardSectionCard>
      </div>

      {/* Right Column - Details */}
      <div className="h-full xl:col-span-4">
        <DashboardSectionCard className="h-full">
          <h3 className="text-xl font-semibold mb-6">معلومات الوسيط</h3>

          {/* Status Cards */}
          <div className="flex flex-wrap gap-6 border-b pb-8 border-dashed">
            <CardInfo
              icon={<FaUser className="text-[var(--primary)] w-10 h-10" />}
              value={agentStatusMap[agent.status]}
              label="حالة الوسيط"
            />
            <CardInfo
              icon={
                <FaIdCard className="text-[var(--secondary-500)] w-10 h-10" />
              }
              value={
                agent.user?.verificationStatus === "verified"
                  ? "موثق"
                  : "غير موثق"
              }
              label="حالة التوثيق"
            />
            <CardInfo
              icon={<FaCalendarAlt className="text-green-600 w-10 h-10" />}
              value={formatDate(agent.createdAt || agent.joinedAt)}
              label="تاريخ الانضمام"
            />
            <CardInfo
              icon={<FaMapMarkerAlt className="text-yellow-600 w-10 h-10" />}
              value={`${cityNames.length} مدينة`}
              label="عدد المدن"
            />
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-12 gap-4 mt-6">
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock
                label="الاسم الكامل"
                value={agent.user?.fullName || agent.name}
              />
              <InfoBlock
                label="رقم الهاتف"
                value={agent.user?.phoneNumber || agent.phone}
                valueClassName="ltr-data block"
              />
              <InfoBlock
                label="الجنسية"
                value={agent.nationality || "غير محدد"}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock
                label="البريد الإلكتروني"
                value={agent.user?.email || agent.email}
              />
              <InfoBlock
                label="تاريخ الانضمام"
                value={formatDate(agent.createdAt || agent.joinedAt)}
              />
              <InfoBlock
                label="آخر تحديث"
                value={formatDate(agent.updatedAt)}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
              <InfoBlock
                label="حالة الحساب"
                value={agentStatusMap[agent.status]}
              />
              <InfoBlock
                label="حالة التوثيق"
                value={
                  agent.user?.verificationStatus === "verified"
                    ? "موثق"
                    : "غير موثق"
                }
              />
              <InfoBlock
                label="عدد المدن"
                value={`${cityNames.length} مدينة`}
              />
            </div>
          </div>

          {/* Cities and Areas Section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cities Section */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FaCity className="text-blue-500" />
                المدن ({cityNames.length})
              </h4>
              {cityNames.length > 0 ? (
                <div className="space-y-2">
                  {cities.map((city, index) => (
                    <div
                      key={city.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-sm text-gray-700">{city.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {city.isActive ? "نشط" : "غير نشط"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">لا توجد مدن محددة</p>
              )}
            </div>

            {/* Areas Section */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FaMap className="text-green-500" />
                المناطق ({areaNames.length})
              </h4>
              {areaNames.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {areas.map((area, index) => (
                    <div
                      key={area.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <span className="text-sm text-gray-700 block">
                          {area.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {area.city?.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {area.isActive ? "نشط" : "غير نشط"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">لا توجد مناطق محددة</p>
              )}
            </div>
          </div>

          {/* KYC Notes Section */}
          {agent.kycNotes && agent.kycNotes !== "لا توجد ملاحظات" && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                ملاحظات التحقق:
              </h4>
              <p className="text-yellow-700 text-sm">{agent.kycNotes}</p>
            </div>
          )}

          {/* Document Links */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {agent.identityProofUrl &&
              agent.identityProofUrl !== "/uploads/images/undefined" && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">وثيقة الهوية:</h4>
                  <a
                    href={agent.identityProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm break-all"
                  >
                    عرض الوثيقة
                  </a>
                </div>
              )}
            {agent.residencyDocumentUrl &&
              agent.residencyDocumentUrl !== "/uploads/images/undefined" && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">وثيقة الإقامة:</h4>
                  <a
                    href={agent.residencyDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm break-all"
                  >
                    عرض الوثيقة
                  </a>
                </div>
              )}
          </div>
        </DashboardSectionCard>
      </div>
    </div>
  );
}

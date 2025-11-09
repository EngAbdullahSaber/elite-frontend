"use client";
import Link from "next/link";
import {
  FaRegCalendarAlt,
  FaClipboardList,
  FaCalendarAlt,
} from "react-icons/fa";
import { formatDate, formatTime } from "@/utils/date";
import {
  agents,
  bookingStatusMap,
  bookingStatusStyle,
} from "@/constants/dashboard/admin/appointment/contants";
import AppointmentStatusControl from "./AppointmentStatusControl";
import Card from "@/components/shared/Card";
import { addMinutes } from "date-fns";
import { AppointmentRow } from "@/types/dashboard/appointment";
import { getDefaultProjectpath } from "@/utils/appointment";
import IconDetail from "@/components/shared/infos/IconDetail";
import { SlCalender } from "react-icons/sl";
import { BiTimeFive } from "react-icons/bi";
import {
  MdAttachMoney,
  MdReviews,
  MdStarRate,
  MdTimelapse,
} from "react-icons/md";
import StarRating from "@/components/shared/StarRating";
import ReviewBookingButton from "@/components/main/customer/user-booking/ReviewBookingButton";
import AppointmentNotesCard from "./AppointmentNotesCard";
import UserChanger from "../UserChanger";
import { projectTypeColors } from "@/constants/dashboard/admin/property.tsx/constants";
import { propertyTypeLabels } from "@/types/property";
import AttachmentsCard from "@/components/shared/AttachmentsCard";
import AppointmentProofUploadControl from "./AppointmentProofUploadControl";
import { useRoleFromPath } from "@/hooks/dashboard/admin/useRoleFromPath";
import FallbackImage from "@/components/shared/FallbackImage";

type AppointmentDetailsProps = {
  appointment: AppointmentRow;
};

const reviewText =
  "لقد كانت تجربتي مع شركة العقارات ممتازة من البداية حتى النهاية. ساعدوني في العثور على منزل يناسب احتياجاتي بكل احترافية.";
export default function AppointmentDetails({
  appointment,
}: AppointmentDetailsProps) {
  const role = useRoleFromPath();
  const isAdmin = role === "admin";

  const {
    id,
    project,
    client,
    agent,
    appointmentAt,
    status,
    reviewStars,
    createdAt,
    agentReviewStars,
    agentReviewText,
  } = appointment;
  const appointmentDate = new Date(appointment.appointmentAt);
  const badgeStyle = projectTypeColors[project.type];

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-6 gap-4 lg:gap-6 ">
      <div className="h-full 2xl:col-span-2 space-y-4 lg:space-y-6">
        <Card title="تفاصيل العقار">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative w-[80px] h-[80px] shrink-0">
              <FallbackImage
                src={project.image}
                alt={project.title}
                defaultImage={getDefaultProjectpath(project.type)}
                fill
                className={`rounded-lg object-cover ${
                  project.image && "border"
                }`}
              />
            </div>

            <div className="flex flex-col justify-between text-center sm:text-start gap-1">
              <Link href={`/projects/${project.id}`}>
                <span className="text-lg font-semibold text-gray-800 hover:underline">
                  {project.title}
                </span>
              </Link>

              <span
                className={`w-fit mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${badgeStyle}`}
              >
                {propertyTypeLabels[project.type]}
              </span>
            </div>
          </div>
        </Card>
        <Card title="تفاصيل الحجز" className="space-y-4">
          <IconDetail
            icon={<SlCalender className="text-[var(--primary)] w-6 h-6" />}
            label="تاريخ الإنشاء"
            value={formatDate(createdAt)}
            className="block"
          />

          <IconDetail
            icon={
              <FaRegCalendarAlt className="text-[var(--primary)] w-6 h-6" />
            }
            label="تاريخ الموعد"
            value={formatDate(appointmentAt)}
            className="block"
          />
          <div className="flex flex-row flex-wrap gap-4 ">
            <div className="flex-1">
              <IconDetail
                icon={<BiTimeFive className="text-[var(--primary)] w-6 h-6" />}
                label="بدابة الموعد"
                value={formatTime(appointmentAt)}
              />
            </div>
            <div className="flex-1">
              <IconDetail
                icon={<MdTimelapse className="text-[var(--primary)] w-6 h-6" />}
                label="نهاية الموعد"
                value={formatTime(addMinutes(appointmentDate, 60))}
              />
            </div>
          </div>
          {appointment.expectedProfit !== undefined && (
            <IconDetail
              icon={<MdAttachMoney className="text-[var(--primary)] w-6 h-6" />}
              label={
                status === "completed"
                  ? "الربح"
                  : status === "pending" ||
                    status === "assigned" ||
                    status === "confirmed" ||
                    status === "in_progress"
                  ? "الربح المتوقع"
                  : "الربح"
              }
              value={`${appointment.expectedProfit.toLocaleString()} ريال`}
              className="font-semibold text-green-600"
            />
          )}

          {reviewStars && (
            <IconDetail
              icon={<MdStarRate className="text-[var(--primary)] w-6 h-6" />}
              label="تقييم العميل للموعد"
              value={<StarRating value={reviewStars} className="mt-2" />}
            />
          )}

          {reviewStars && reviewText && (
            <IconDetail
              icon={<MdReviews className="text-[var(--primary)] w-6 h-6" />}
              label="نص تقييم العميل"
              value={reviewText}
              className="text-[16px] font-semibold"
            />
          )}

          {agentReviewStars && (
            <IconDetail
              icon={
                <MdStarRate className="text-[var(--secondary-500)] w-6 h-6" />
              }
              label="تقييم الوسيط للعميل"
              value={<StarRating value={agentReviewStars} className="mt-2" />}
            />
          )}

          {agentReviewText && (
            <IconDetail
              icon={
                <MdReviews className="text-[var(--secondary-500)] w-6 h-6" />
              }
              label="مراجعة الوسيط"
              value={agentReviewText}
              className="text-[16px] font-semibold"
            />
          )}

          <IconDetail
            icon={<MdReviews className="text-[var(--primary)] w-6 h-6" />}
            label="الحالة"
            value={bookingStatusMap[status]}
            className={`${bookingStatusStyle[status]} block px-3 py-1 !rounded-full text-sm font-medium mt-1`}
          />
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex-1">
              <AppointmentStatusControl
                appointmentId={id}
                currentStatus={status}
              />
            </div>
            {!appointment.isPaid && (
              <AppointmentProofUploadControl appointmentId={appointment.id} />
            )}
            {role === "agent" &&
              status === "completed" &&
              !agentReviewStars && (
                <div className="flex-1">
                  <ReviewBookingButton
                    bookingId={String(appointment.id)}
                    className="agent-review"
                  />
                </div>
              )}
          </div>
        </Card>
      </div>
      <div className="h-full 2xl:col-span-4 flex flex-col gap-4 lg:gap-6 ">
        <div className="flex gap-4 lg:gap-6 items-start flex-col md:flex-row">
          {role === "admin" && (
            <Card className="flex-1 w-full h-full flex flex-col" title="الوسيط">
              <div className="flex-1">
                {agent ? (
                  <>
                    {/* ✅ معلومات الوسيط المعين */}
                    <div className="relative rounded-2xl bg-white p-6">
                      <div className="relative w-fit mx-auto">
                        <FallbackImage
                          src={agent.image}
                          alt={agent.name}
                          width={80}
                          height={80}
                          className="rounded-full w-20 h-20 object-cover border"
                        />
                      </div>

                      <Link href={`/dashboard/admin/agents/${agent.id}`}>
                        <h5 className="text-xl font-semibold mt-5 text-center hover:underline">
                          {agent.name}
                        </h5>
                      </Link>
                    </div>

                    <div className="mt-6 space-y-4 flex flex-col md:flex-row">
                      <IconDetail
                        icon={
                          <FaClipboardList className="text-[var(--primary)] w-6 h-6" />
                        }
                        label="رقم الهاتف"
                        value={agent.phone || "غير متوفر"}
                        href={agent.phone ? `tel:${agent.phone}` : undefined}
                        className="ltr-data block"
                      />
                      <IconDetail
                        icon={
                          <FaCalendarAlt className="text-[var(--secondary-500)] w-6 h-6" />
                        }
                        label="البريد الإلكتروني"
                        value={agent.email || "غير متوفر"}
                        href={agent.email ? `mailto:${agent.email}` : undefined}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* 🚫 لا يوجد وسيط معين */}
                    <div className="text-center py-10 text-gray-500">
                      <p className="text-lg font-semibold">
                        لم يتم تعيين وسيط بعد
                      </p>
                      <p className="text-sm mt-2">
                        يمكنك اختيار وسيط من القائمة أو تعيينه لاحقًا
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* ✅ مكون اختيار الوسيط يظهر دائمًا في الأسفل */}
              <div className="mt-auto pt-4">
                <UserChanger
                  appointmentId={appointment.id}
                  showSelected={false}
                  initialUserId={agent.id}
                  users={agents}
                  label="وسيط"
                />
              </div>
            </Card>
          )}

          <Card className="flex-1 h-full w-full" title="العميل">
            <div className="relative rounded-2xl bg-white p-6">
              {/* Avatar */}
              <div className="relative w-fit mx-auto">
                <FallbackImage
                  src={client.image}
                  alt={client.name}
                  width={80}
                  height={80}
                  className="rounded-full w-20 h-20 object-cover border"
                />
              </div>

              {/* Name */}
              {isAdmin ? (
                <Link href={`/dashboard/admin/clients/${client.id}`}>
                  <h5 className="text-xl font-semibold mt-5 text-center hover:underline">
                    {client.name}
                  </h5>
                </Link>
              ) : (
                <h5 className="text-xl font-semibold mt-5 text-center hover:underline">
                  {client.name}
                </h5>
              )}
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-4">
              <IconDetail
                icon={
                  <FaClipboardList className="text-[var(--primary)] w-6 h-6" />
                }
                label="رقم الهاتف"
                value={client?.phone || "+456 546 4654"}
                href={`tel:${client?.phone || "+456 546 4654"}`}
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
          </Card>
        </div>
        <AppointmentNotesCard initailNotes="" />
      </div>
      {appointment.status === "completed" && (
        <div className="2xl:col-span-6">
          <AttachmentsCard
            title="مستندات الدفع"
            attachments={appointment.proofFiles || []}
          />
        </div>
      )}
    </div>
  );
}

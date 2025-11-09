import AppointmentDetails from "@/components/dashboard/appointments/AppointmentDetails";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import DownloadContent from "@/components/shared/DownloadContent";
import { mockAppointments } from "@/constants/dashboard/admin/appointment/contants";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BiGroup } from "react-icons/bi";

export default async function AppointmentDetailsPage({
  params,
}: {
  params: { appointmentId: string };
}) {
  await new Promise((r) => setTimeout(r, 300)); // simulate loading

  const appointment = mockAppointments.find((a) => a.id === Number(101));
  // const appointment = getMockAppointmentById(appointmentId);

  if (!appointment) return notFound();

  return (
    <>
      <DashboardHeaderTitle path={["المواعيد", `تفاصيل الموعد`]}>
        <div className="flex gap-4  flex-wrap ">
          <DownloadContent text="تحميل المعلومات" />
          <Link className="btn-primary" href="/dashboard/agent/appointments">
            <BiGroup /> عرض جميع المواعيد
          </Link>
        </div>
      </DashboardHeaderTitle>

      <AppointmentDetails appointment={appointment} />
    </>
  );
}

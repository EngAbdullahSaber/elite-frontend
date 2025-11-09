import AddAppointmentForm from "@/components/dashboard/appointments/AddAppointmentForm";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import CenteredContainer from "@/components/shared/CenteredContainer";
import Link from "next/link";
import { BiGroup } from "react-icons/bi";


export default function AddAppointmentPage() {
    return (
        <div>
            <DashboardHeaderTitle path={['المواعيد', 'إضافة موعد جديد']}>
                <Link className="btn-primary" href="/dashboard/agent/appointments">
                    <BiGroup /> عرض جميع المواعيد
                </Link>
            </DashboardHeaderTitle>

            <CenteredContainer>
                <AddAppointmentForm />
            </CenteredContainer>
        </div>
    );
}
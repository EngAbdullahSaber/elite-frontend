import AppointmentsDataView from '@/components/dashboard/appointments/AppointmentsDataView';
import DashboardHeaderTitle from '@/components/dashboard/DashboardHeaderTitle';
import DownloadList from "@/components/shared/DownloadContent";
import Link from 'next/link';
import { BiPlus } from 'react-icons/bi';

export default function AppointmentsPage() {

    return (
        <div>
            <DashboardHeaderTitle path={['المواعيد']}>
                <div className="flex gap-4 flex-wrap">
                    <DownloadList />
                    <Link className="btn-primary" href="/dashboard/agent/appointments/add">
                        <BiPlus /> إضافة موعد
                    </Link>
                </div>
            </DashboardHeaderTitle>

            <section className="p-3 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white relative z-[1]">
                <AppointmentsDataView agentId={35} />
            </section>
        </div>
    );
}

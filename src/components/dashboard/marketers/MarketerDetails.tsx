import DashboardSectionCard from '@/components/dashboard/DashboardSectionCard';
import CardInfo from '@/components/shared/infos/CardInfo';
import IconDetail from '@/components/shared/infos/IconDetail';
import { InfoBlock } from '@/components/shared/infos/InfoBlock';
import { MarketerRow, marketerStatusMap } from '@/types/dashboard/marketer';
import Link from 'next/link';
import { BiEdit } from 'react-icons/bi';
import {
    FaCalendarAlt,
    FaClipboardList,
    FaChartLine,
    FaUserPlus,
    FaCheckCircle,
    FaProjectDiagram,
} from 'react-icons/fa';
import { formatDate } from '@/utils/date';
import MarketerStatusControl from './MarketerStatusControl';
import FallbackImage from '@/components/shared/FallbackImage';


type Props = {
    marketer: MarketerRow;
};

export default function MarketerDetails({ marketer }: Props) {
    // Mocked stats (replace with real calculations later)
    const visits = 3500;
    const registrations = 420;
    const conversions = 120;
    const trafficSources = 5;
    const generatedAppointments = 48;

    return (
        <div className="grid grid-cols-1 2xl:grid-cols-6 gap-4 lg:gap-6 items-stretch">
            {/* Left Column */}
            <div className="h-full xl:col-span-2">
                <DashboardSectionCard className="h-full">
                    <div className="relative rounded-2xl bg-white p-6">
                        <Link
                            href={`/dashboard/admin/marketers/edit/${marketer.id}`}
                            className="absolute top-4 right-4 bg-white border border-gray-200 p-2 rounded-full shadow-sm hover:bg-gray-50 transition z-10"
                            title="تعديل المسوق"
                        >
                            <BiEdit className="w-5 h-5 text-gray-600" />
                        </Link>

                        <div className="relative w-fit mx-auto">
                            <FallbackImage
                                src={marketer.image}
                                alt={marketer.name}
                                width={80}
                                height={80}
                                className="rounded-full w-20 h-20 object-cover border"
                            />
                        </div>

                        <h5 className="text-xl font-semibold mt-5 text-center">{marketer.name}</h5>

                        <div className="flex items-center justify-center border-b border-dashed py-2">
                            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                                <span
                                    className={`w-3 h-3 rounded-full border border-white ${marketer.status === 'active'
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                        }`}
                                    title={marketerStatusMap[marketer.status]}
                                />
                                <span className="text-[10px] font-medium text-gray-700">
                                    {marketerStatusMap[marketer.status]}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-6 space-y-4">
                        <IconDetail
                            icon={<FaClipboardList className="text-[var(--primary)] w-6 h-6" />}
                            label="رقم الهاتف"
                            value={marketer.phone}
                            href={`tel:${marketer.phone}`}
                            className="ltr-data block"
                        />
                        <IconDetail
                            icon={<FaCalendarAlt className="text-[var(--secondary-500)] w-6 h-6" />}
                            label="البريد الإلكتروني"
                            value={marketer.email}
                            href={`mailto:${marketer.email}`}
                        />
                    </div>

                    <MarketerStatusControl currentStatus={marketer.status} marketer={marketer} />
                </DashboardSectionCard>
            </div>

            {/* Right Column */}
            <div className="h-full xl:col-span-4">
                <DashboardSectionCard className="h-full">
                    <h3 className="text-xl font-semibold mb-6">إحصائيات المسوق</h3>

                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-b pb-8 border-dashed">
                        <CardInfo
                            icon={<FaChartLine className="text-[var(--primary)] w-10 h-10" />}
                            value={visits.toLocaleString()}
                            label="عدد الزيارات"
                        />
                        <CardInfo
                            icon={<FaUserPlus className="text-[var(--secondary-500)] w-10 h-10" />}
                            value={registrations}
                            label="التسجيلات"
                        />
                        <CardInfo
                            icon={<FaCheckCircle className="text-green-600 w-10 h-10" />}
                            value={conversions}
                            label="التحويلات"
                        />
                        <CardInfo
                            icon={<FaProjectDiagram className="text-blue-600 w-10 h-10" />}
                            value={trafficSources}
                            label="مصادر الزيارات"
                        />
                        <CardInfo
                            icon={<FaCalendarAlt className="text-yellow-600 w-10 h-10" />}
                            value={generatedAppointments}
                            label="المواعيد الناتجة"
                        />
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-12 gap-4 mt-6">
                        <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
                            <InfoBlock label="الاسم الكامل" value={marketer.name} />
                            <InfoBlock label="رقم الهاتف" value={marketer.phone} valueClassName="ltr-data block" />
                        </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
                            <InfoBlock label="البريد الإلكتروني" value={marketer.email} />
                            <InfoBlock label="تاريخ الانضمام" value={formatDate(marketer.joinedAt)} />
                        </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-3">
                            <InfoBlock label="الحالة" value={marketerStatusMap[marketer.status]} />
                        </div>
                    </div>
                </DashboardSectionCard>
            </div>
        </div>
    );
}

'use client';

import Card from '@/components/shared/Card';
import CardInfo from '@/components/shared/infos/CardInfo';
import {
    FaCalendarAlt,
    FaRegCalendarCheck,
    FaWallet,
    FaStar
} from 'react-icons/fa';

export interface AgentStats {
    upcoming: number;            // المواعيد القادمة
    today: number;               // مواعيد اليوم
    earningsThisMonth: number;   // أرباح هذا الشهر
    rating: number;              // متوسط التقييم
}

interface AgentStatsCardProps {
    stats: AgentStats;
}

export default function AgentStatsCard({ stats }: AgentStatsCardProps) {
    return (
        <Card title="إحصائيات الوسيط">
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
                {/* مواعيد قادمة */}
                <CardInfo
                    icon={
                        <div className="rounded-full bg-primary p-4">
                            <FaCalendarAlt className="text-white text-3xl" />
                        </div>
                    }
                    value={stats.upcoming}
                    title="مواعيد قادمة"
                    className="!bg-primary-light col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
                />

                {/* مواعيد اليوم */}
                <CardInfo
                    icon={
                        <div className="rounded-full bg-secondary p-4">
                            <FaRegCalendarCheck className="text-white text-3xl" />
                        </div>
                    }
                    value={stats.today}
                    title="مواعيد اليوم"
                    className="!bg-secondary-light col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
                />

                {/* أرباح هذا الشهر */}
                <CardInfo
                    icon={
                        <div className="rounded-full bg-tertiary p-4">
                            <FaWallet className="text-white text-3xl" />
                        </div>
                    }
                    value={stats.earningsThisMonth}
                    title="أرباح هذا الشهر"
                    className="!bg-tertiary-300 col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
                />

                {/* متوسط التقييم */}
                <CardInfo
                    icon={
                        <div className="rounded-full bg-primary p-4">
                            <FaStar className="text-white text-3xl" />
                        </div>
                    }
                    value={stats.rating.toFixed(1)}
                    title="متوسط التقييم"
                    label={`${((stats.rating / 5) * 100).toFixed(0)}%`}
                    className="!bg-primary-light col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3"
                />
            </div>
        </Card>
    );
}

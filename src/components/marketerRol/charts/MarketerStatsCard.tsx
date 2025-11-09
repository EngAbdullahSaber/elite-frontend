// src/components/marketer/MarketerStatsCard.tsx
'use client';

import Card from '@/components/shared/Card';
import CardInfo from '@/components/shared/infos/CardInfo';
import {
    FaChartLine,
    FaUserPlus,
    FaExchangeAlt,
    FaCalendarCheck
} from 'react-icons/fa';

export interface MarketerStats {
    visits: number;
    registrations: number;
    conversions: number;
    sources: number;
    resultingAppointments: number;
}

interface MarketerStatsCardProps {
    stats: MarketerStats;
}

export default function MarketerStatsCard({ stats }: MarketerStatsCardProps) {
    const statsData = [
        {
            icon: (
                <div className="rounded-full bg-primary p-4">
                    <FaChartLine className="text-white text-3xl" />
                </div>
            ),
            label: 'عدد الزيارات',
            value: stats.visits,
            className: '!bg-primary-light col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3'
        },
        {
            icon: (
                <div className="rounded-full bg-secondary p-4">
                    <FaUserPlus className="text-white text-3xl" />
                </div>
            ),
            label: 'التسجيلات',
            value: stats.registrations,
            className: '!bg-secondary-light col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3'
        },
        {
            icon: (
                <div className="rounded-full bg-tertiary p-4">
                    <FaExchangeAlt className="text-white text-3xl" />
                </div>
            ),
            label: 'التحويلات',
            value: stats.conversions,
            className: '!bg-tertiary-300 col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3'
        },
        {
            icon: (
                <div className="rounded-full bg-primary p-4">
                    <FaCalendarCheck className="text-white text-3xl" />
                </div>
            ),
            label: 'المواعيد الناتجة',
            value: stats.resultingAppointments,
            className: '!bg-primary-light col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3'
        }
    ];

    return (
        <Card title="إحصائيات المسوق">
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
                {statsData.map((stat, idx) => (
                    <CardInfo
                        key={idx}
                        icon={stat.icon}
                        value={stat.value}
                        title={stat.label}
                        className={stat.className}
                    />
                ))}
            </div>
        </Card>
    );
}

import React from 'react';
import { IconType } from 'react-icons';

type StatItem = {
    value: string;
    label: string;
    icon: IconType;
};

type StatBadgeProps = {
    stats: StatItem[];
};

export default function StatBadge({ stats }: StatBadgeProps) {
    return (
        <div className="absolute top-[120px] lg:top-[30%] right-[13%] bg-primary rounded-2xl shadow-lg p-2 lg:p-4 w-fit max-w-[700px]">
            <div className="grid grid-cols-3 gap-2 lg:gap-4">
                {stats.map(({ value, label, icon: Icon }, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center bg-primary text-white p-2 lg:p-4 rounded-xl"
                    >
                        <div className="w-8 h-8 rounded-full bg-white grid place-content-center text-primary mb-2">
                            <Icon size={18} />
                        </div>
                        <h3 className="text-lg font-bold">{value}</h3>
                        <p className="text-sm">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

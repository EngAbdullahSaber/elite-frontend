import React from 'react';
import { IconType } from 'react-icons';

type HelpCardProps = {
    title: string;
    details: string[];
    iconBg: string;
    icon: IconType;
};

export default function HelpCard({ title, details, iconBg, icon: Icon }: HelpCardProps) {
    return (
        <div className="flex flex-col items-center text-center bg-[var(--bg-1)] rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${iconBg}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-[var(--primary-dark)] mb-3">{title}</h4>
            <ul className="space-y-1">
                {details.map((item, i) => (
                    <li key={i} className="text-[var(--neutral-600)] text-sm leading-relaxed">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { FiCopy } from 'react-icons/fi';
import { ReactNode } from 'react';

type ContactItemProps = {
    icon: ReactNode;
    label: string;
    value: string;
    type: 'phone' | 'email' | 'location';
    copied: string | null;
    onCopy: (text: string, key: 'phone' | 'email' | 'location') => void;
};

export default function ContactItem({
    icon,
    label,
    value,
    type,
    copied,
    onCopy,
}: ContactItemProps) {
    const bgColor =
        type === 'phone'
            ? 'bg-primary text-white'
            : type === 'email'
                ? 'bg-secondary text-neutral-700'
                : 'bg-tertiary text-neutral-700';

    return (
        <div
            className="relative flex items-center gap-4 px-3 xl:px-4 cursor-pointer"
            onClick={() => onCopy(value, type)}
        >
            <span className={`peer text-2xl p-2 rounded-full inline-flex ${bgColor}`}>
                {icon}
            </span>

            {/* Desktop */}
            <div className="hidden lg:flex flex-col">
                <span className="text-xs text-neutral-500">{label}</span>
                <div className="flex items-center gap-2">
                    {type === 'phone' && (
                        <Link
                            aria-label={`الاتصال على ${value}`}
                            className="text-base hover:underline"
                            href={`tel:${value.replace(/[^\d+]/g, '')}`}
                        >
                            {value}
                        </Link>
                    )}
                    {type === 'email' && (
                        <Link
                            aria-label={`إرسال بريد إلى ${value}`}
                            className="text-base hover:underline break-all"
                            href={`mailto:${value}`}
                        >
                            {value}
                        </Link>
                    )}
                    {type === 'location' && (
                        <span className="text-base capitalize">{value}</span>
                    )}
                    <button
                        onClick={() => onCopy(value, type)}
                        className="p-1 rounded hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        aria-label={`نسخ ${label}`}
                        title="نسخ"
                    >
                        <FiCopy className="text-sm" />
                    </button>
                    {copied === type && (
                        <span className="text-xs text-primary">تم النسخ</span>
                    )}
                </div>
            </div>

            {/* Mobile hover */}
            <div className="z-30 lg:hidden absolute top-0 left-full min-w-[160px] mt-2 bg-white shadow rounded p-2 text-sm text-neutral-700 opacity-0 peer-hover:opacity-100 transition-opacity peer-hover:pointer-events-auto pointer-events-none">
                <span className={type === 'location' ? 'capitalize' : ''}>{value}</span>
                {copied === type && (
                    <span className="block text-xs text-primary mt-1">تم النسخ</span>
                )}
            </div>
        </div>
    );
}
